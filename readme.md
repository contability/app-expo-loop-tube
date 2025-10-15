# YouTube Loop Tube App

React Native Expo로 개발된 YouTube 동영상 반복 재생 앱

## 주요 기능

- YouTube URL 입력을 통한 동영상 재생
- 동영상 반복 재생 (루프)
- 재생/일시정지 컨트롤
- 시크바를 통한 구간 이동
- 미리 설정된 YouTube URL 버튼

## 기술 스택

- **React Native**: 0.79.5
- **Expo**: ~53.0.23
- **TypeScript**: ~5.8.3
- **react-native-webview**: YouTube IFrame API 사용
- **@expo/vector-icons**: 아이콘 사용
- **query-string**: URL 파싱

## 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 시작
yarn start

# iOS 시뮬레이터에서 실행
yarn ios

# Android 에뮬레이터에서 실행
yarn android
```

## Appium 테스트

이 프로젝트는 Appium을 사용한 E2E 테스트를 지원한다.

### 사전 준비

1. **Appium 서버 설치**

   ```bash
   npm install -g appium
   appium driver install xcuitest  # iOS용
   appium driver install uiautomator2  # Android용
   ```

2. **iOS 시뮬레이터 또는 Android 에뮬레이터 실행**
   - iOS: Xcode Simulator 실행
   - Android: Android Studio에서 AVD 실행

3. **Expo Go 앱 설치**
   - iOS 시뮬레이터: App Store에서 Expo Go 설치
   - Android 에뮬레이터: Play Store에서 Expo Go 설치

### 테스트 실행

1. **Appium 서버 시작**

   ```bash
   appium --relaxed-security
   ```

2. **앱 실행**

   ```bash
   yarn start
   ```

   QR 코드를 스캔하여 Expo Go에서 앱 실행

3. **테스트 실행**

   ```bash
   # 모든 플랫폼에서 테스트
   yarn test:appium

   # iOS만 테스트
   yarn test:appium:ios

   # Android만 테스트
   yarn test:appium:android
   ```

### 테스트 케이스

- 앱 정상 실행 확인
- URL 입력 필드 존재 확인
- YouTube URL 입력 및 링크 버튼 클릭
- 미리 설정된 URL 버튼 동작 확인
- 재생/일시정지 버튼 존재 확인

## 개발 참고사항

- **react-native-vector-icons**: @expo/vector-icons 사용
- **react-native-webview**: YouTube IFrame Player API 사용
- **static HTML**: 웹뷰를 통한 YouTube API 활용
- **URL 파싱**: query-string 라이브러리 사용

- react-native-vector-icons
  - 따로 설치할 필요 없이 @expo/vector-icons 사용
- react-native-webview
  - npx expo install react-native-webview
- static HTML로 유튜브 API 이용
  - 공식적인 API는 웹용 Youtube IFrame Player API만 제공하고 있음
  - 이러한 경우 웹뷰를 이용해서 React Native에서 Youtube IFrame API를 사용할 수 있음
  - https://developers.google.com/youtube/iframe_api_reference
- React Native TextInput 사용
- URL의 쿼리 스트링 파싱

## API 참고

- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
