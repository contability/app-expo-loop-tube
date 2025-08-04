import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useMemo, useState } from 'react';
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
});

const App = () => {
  const [url, setUrl] = useState('');
  const [youtubeId, setYoutubeId] = useState('');

  const onPressOpenLink = () => {
    const {
      query: { v: id },
    } = queryString.parseUrl(url);

    if (typeof id === 'string') setYoutubeId(id);
    else Alert.alert('잘못된 URL입니다.');
  };

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

          // 4. The API will call this function when the video player is ready.
          function onPlayerReady(event) {
            event.target.playVideo();
          }

          // 5. The API calls this function when the player's state changes.
          //    The function indicates that when playing a video (state=1),
          //    the player should play for six seconds and then stop.
          var done = false;
          function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING && !done) {
              setTimeout(stopVideo, 6000);
              done = true;
            }
          }
          function stopVideo() {
            player.stopVideo();
          }
        </script>
      </body>
    </html>`;
    return { html };
  }, [youtubeId]);

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
        />
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onPressOpenLink}>
          <Icon name="add-link" size={24} color={'#AEAEB2'} />
        </TouchableOpacity>
      </View>
      <View style={styles.youtubeContainer}>
        {youtubeId && (
          <WebView source={source} allowsInlineMediaPlayback={true} mediaPlaybackRequiresUserAction={false} />
        )}
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
