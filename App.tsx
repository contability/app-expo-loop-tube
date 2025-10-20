import {
  Alert,
  Animated,
  Dimensions,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import queryString from 'query-string';
import WebView from 'react-native-webview';

// 화면의 너비 구하기
// window는 진짜로 쓰이는 화면의 크기
// screen은 안쓰이는 부분까지 모두 합친 크기
const YT_WIDTH = Dimensions.get('window').width;
// 16:9비율
const YT_HEIGHT = YT_WIDTH * (9 / 16);

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#242424',
  },
  inputContainer: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 15,
    color: '#AEAEB2',
    flex: 1,
    marginRight: 4,
  },
  youtubeContainer: {
    width: YT_WIDTH,
    height: YT_HEIGHT,
    backgroundColor: '#4A4A4A',
  },
  seekBarBackground: {
    height: 3,
    backgroundColor: '#D4D4D4',
    // 터치 이벤트 안받도록 함. thumb 눌렀을 때만 panResponder 사용되도록 하기 위함
    // box-none은 본인(컨테이너)는 이벤트 안받을건데 자식들은 받게 해주는 속성 값
    pointerEvents: 'box-none',
  },
  seekBarProgress: {
    height: 3,
    backgroundColor: '#00DDA8',
    // width: '0%',
    pointerEvents: 'none',
  },
  seekBarThumb: {
    width: 14,
    height: 14,
    backgroundColor: '#00DDA8',
    borderRadius: 14 / 2,
    position: 'absolute',
    top: (-14 + 3) / 2,
  },
  repeat: {
    width: 14,
    height: 14,
    backgroundColor: 'red',
    borderRadius: 14 / 2,
    position: 'absolute',
    top: (-14 + 3) / 2,
  },
  urlListContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 72,
    alignItems: 'center',
    gap: 16,
  },
  urlList: {
    color: '#AEAEB2',
  },
  controller: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 72,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 54,
  },
  timerText: {
    color: '#AEAEB2',
    alignSelf: 'flex-end',
    fontSize: 13,
    marginTop: 15,
    marginRight: 20,
  },
});

const formatTime = (seconds: number) => {
  const minuates = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinuate = String(minuates).padStart(2, '0');
  const formatetdSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinuate}:${formatetdSeconds}`;
};

const App = () => {
  const [url, setUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationInSec, setDurationInSec] = useState(0);
  const [currentTimeInSec, setCurrentTimeInSec] = useState(0);
  const [repeatStartInSec, setRepeatStartInSec] = useState<number | null>(null);
  const [repeatEndInSec, setRepeatEndInSec] = useState<number | null>(null);
  const [repeated, setRepeated] = useState(false);

  const webViewRef = useRef<WebView | null>(null);
  const seekBarAnimRef = useRef(new Animated.Value(0));

  const onPressOpenLink = () => {
    const {
      query: { v: id },
    } = queryString.parseUrl(url);

    if (typeof id === 'string') setYoutubeId(id);
    else Alert.alert('잘못된 URL입니다.');
  };

  const onPressPlay = useCallback(() => {
    if (webViewRef.current !== null) {
      webViewRef.current?.injectJavaScript('player.playVideo(); true;');
    }
  }, []);

  const onPressPause = useCallback(() => {
    if (webViewRef.current !== null) {
      webViewRef.current?.injectJavaScript('player.pauseVideo(); true;');
    }
  }, []);

  const durationText = formatTime(Math.floor(durationInSec));
  const currentTimeText = formatTime(Math.floor(currentTimeInSec));

  const source = useMemo(() => {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style="margin: 0; padding: 0;">
        <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
        <div id="player"></div>

        <script>
          // 2. This code loads the IFrame Player API code asynchronously.
          var tag = document.createElement('script');

          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          // 3. This function creates an <iframe> (and YouTube player)
          //    after the API code downloads.
          var player;
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              height: '${YT_HEIGHT}',
              width: '${YT_WIDTH}',
              videoId: '${youtubeId}',
              playerVars: {
                'playsinline': 1
              },
              events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
              }
            });
          }

          function postMessageToRN(type, data){
            const message = JSON.stringify({
              type, data
            });

            window.ReactNativeWebView.postMessage(message); 
          }

          function onPlayerReady(event) {
            postMessageToRN('duration', player.getDuration());
          }

          function onPlayerStateChange(event) {
            postMessageToRN('player-state', event.data);
          }
        </script>
      </body>
    </html>`;
    return { html };
  }, [youtubeId]);

  const durationInSecRef = useRef(durationInSec);
  durationInSecRef.current = durationInSec;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        webViewRef.current?.injectJavaScript('player.pauseVideo(); true;');
      },
      onPanResponderMove: (event, gestureState) => {
        const newTimeInSec = (gestureState.moveX / YT_WIDTH) * durationInSecRef.current;
        seekBarAnimRef.current.setValue(newTimeInSec);
      },
      onPanResponderRelease: (event, gestureState) => {
        const newTimeInSec = (gestureState.moveX / YT_WIDTH) * durationInSecRef.current;
        webViewRef.current?.injectJavaScript(`player.seekTo(${newTimeInSec}, true);`);
        webViewRef.current?.injectJavaScript('player.playVideo(); true;');
      },
    }),
  );

  const onPressSetRepeatTime = () => {
    if (repeatStartInSec === null) {
      setRepeatStartInSec(currentTimeInSec);
    } else if (repeatEndInSec === null) {
      setRepeatEndInSec(currentTimeInSec);
    } else {
      setRepeatStartInSec(null);
      setRepeatEndInSec(null);
    }
  };

  const onPressRepeat = () => {
    setRepeated(!repeated);
  };

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => {
        if (webViewRef.current !== null) {
          webViewRef.current?.injectJavaScript('postMessageToRN("current-time", player.getCurrentTime());');
        }
      }, 50);
      return () => {
        clearInterval(id);
      };
    }
  }, [isPlaying]);

  useEffect(() => {
    Animated.timing(seekBarAnimRef.current, {
      // 어떠한 값으로 서서히 변경할건지
      toValue: currentTimeInSec,
      duration: 50,
      // 이게 false가 아니면 seekBarProgress 스타일에 width로 값 전달이 불가능
      useNativeDriver: false,
    }).start();
  }, [currentTimeInSec]);

  useEffect(() => {
    if (repeated && repeatStartInSec !== null && repeatEndInSec !== null) {
      if (currentTimeInSec > repeatEndInSec) {
        webViewRef.current?.injectJavaScript(`player.seekTo(${repeatStartInSec}, true);`);
      }
    }
  }, [currentTimeInSec, repeatEndInSec, repeatStartInSec, repeated]);

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="클릭하여 링크를 삽입하세요"
          placeholderTextColor={'#AEAEB2'}
          onChangeText={setUrl}
          value={url}
          inputMode="url"
          accessibilityLabel="URL 입력 필드"
          testID="url-input"
        />
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onPressOpenLink}
          accessibilityLabel="링크 추가 버튼"
          testID="add-link-button"
        >
          <Icon name="add-link" size={24} color={'#AEAEB2'} />
        </TouchableOpacity>
      </View>
      <View style={styles.youtubeContainer}>
        {youtubeId && (
          <WebView
            ref={webViewRef}
            source={source}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            onMessage={event => {
              // console.log('🚀 ~ App ~ event:', event.nativeEvent.data);
              const { type, data } = JSON.parse(event.nativeEvent.data);

              switch (type) {
                case 'player-state':
                  setIsPlaying(data === 1);
                  break;
                case 'duration':
                  setDurationInSec(data);
                  break;
                case 'current-time':
                  setCurrentTimeInSec(data);
                  break;
                default:
                  break;
              }
            }}
          />
        )}
      </View>
      {/* SeekBar */}
      <View style={styles.seekBarBackground} {...panResponder.current.panHandlers}>
        <Animated.View
          style={[
            styles.seekBarProgress,
            {
              width: seekBarAnimRef.current.interpolate({
                inputRange: [0, durationInSec],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.seekBarThumb,
            {
              left: seekBarAnimRef.current.interpolate({
                inputRange: [0, durationInSec],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        {repeatStartInSec && <View style={[styles.repeat, { left: (repeatStartInSec / durationInSec) * YT_WIDTH }]} />}
        {repeatEndInSec && <View style={[styles.repeat, { left: (repeatEndInSec / durationInSec) * YT_WIDTH }]} />}
      </View>
      <Text style={styles.timerText}>{`${currentTimeText} / ${durationText}`}</Text>
      <View style={styles.controller}>
        <TouchableOpacity onPress={onPressSetRepeatTime}>
          <Icon name="data-array" size={28} color="#D9D9D9" />
        </TouchableOpacity>
        {isPlaying ? (
          <TouchableOpacity
            style={styles.playButton}
            onPress={onPressPause}
            accessibilityLabel="일시정지 버튼"
            testID="pause-button"
          >
            <Icon name="pause-circle" size={41.67} color="#E5E5EA" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.playButton}
            onPress={onPressPlay}
            accessibilityLabel="재생 버튼"
            testID="play-button"
          >
            <Icon name="play-circle" size={39.58} color="#00DDAB" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onPressRepeat}>
          <Icon name="repeat" size={28} color={repeated ? '#00DDA8' : '#D9D9D9'} />
        </TouchableOpacity>
      </View>
      <View style={styles.urlListContainer}>
        <TouchableOpacity
          hitSlop={{ right: 50, left: 50 }}
          onPress={() => setUrl('https://www.youtube.com/watch?v=rlh76p4T6qw')}
        >
          <Text style={styles.urlList}>https://www.youtube.com/watch?v=rlh76p4T6qw</Text>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ right: 50, left: 50 }}
          onPress={() => setUrl('https://www.youtube.com/watch?v=FJyxYf3UH6A')}
        >
          <Text style={styles.urlList}>https://www.youtube.com/watch?v=FJyxYf3UH6A</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
