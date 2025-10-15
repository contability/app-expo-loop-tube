describe('YouTube Loop Tube 앱 테스트', () => {
  before(async () => {
    // 앱이 로드될 때까지 대기
    await driver.pause(3000);
  });

  it('앱이 정상적으로 실행되어야 한다', async () => {
    // 앱이 실행되었는지 확인 (URL 입력 필드가 있으면 앱이 로드된 것)
    const urlInput = await $('~URL 입력 필드');
    await urlInput.waitForDisplayed({ timeout: 10000 });
    expect(await urlInput.isDisplayed()).toBe(true);
  });

  it('URL 입력 필드가 존재해야 한다', async () => {
    // accessibility label로 요소 찾기
    const urlInput = await $('~URL 입력 필드');
    await urlInput.waitForDisplayed({ timeout: 10000 });
    expect(await urlInput.isDisplayed()).toBe(true);
  });

  it('YouTube URL을 입력하고 링크 버튼을 클릭할 수 있어야 한다', async () => {
    const urlInput = await $('~URL 입력 필드');
    const linkButton = await $('~링크 추가 버튼');

    // URL 입력
    await urlInput.click();
    await urlInput.setValue('https://www.youtube.com/watch?v=rlh76p4T6qw');

    // 링크 버튼 클릭
    await linkButton.click();

    // 잠시 대기 (YouTube 로드 시간)
    await driver.pause(2000);
  });

  it('미리 설정된 URL 버튼들이 존재해야 한다', async () => {
    let urlButton1, urlButton2;

    if (driver.isIOS) {
      urlButton1 = await $('~https://www.youtube.com/watch?v=rlh76p4T6qw');
      urlButton2 = await $('~https://www.youtube.com/watch?v=FJyxYf3UH6A');
    } else {
      urlButton1 = await $('android=new UiSelector().text("https://www.youtube.com/watch?v=rlh76p4T6qw")');
      urlButton2 = await $('android=new UiSelector().text("https://www.youtube.com/watch?v=FJyxYf3UH6A")');
    }

    await urlButton1.waitForDisplayed({ timeout: 10000 });
    await urlButton2.waitForDisplayed({ timeout: 10000 });

    expect(await urlButton1.isDisplayed()).toBe(true);
    expect(await urlButton2.isDisplayed()).toBe(true);
  });

  it('미리 설정된 URL을 클릭하면 입력 필드에 URL이 설정되어야 한다', async () => {
    const urlButton = await $('android=new UiSelector().text("https://www.youtube.com/watch?v=rlh76p4T6qw")');
    const urlInput = await $('~URL 입력 필드');

    // 미리 설정된 URL 버튼 클릭
    await urlButton.click();

    // 잠시 대기
    await driver.pause(1000);

    // 입력 필드의 값 확인 (value 속성으로 확인)
    const inputValue = await urlInput.getValue();
    expect(inputValue).toContain('youtube.com/watch?v=rlh76p4T6qw');
  });

  it('재생/일시정지 버튼이 존재해야 한다', async () => {
    // 재생 버튼 또는 일시정지 버튼 찾기
    try {
      const playButton = await $('~재생 버튼');
      await playButton.waitForDisplayed({ timeout: 5000 });
      expect(await playButton.isDisplayed()).toBe(true);
    } catch (error) {
      // 재생 버튼이 없으면 일시정지 버튼 찾기
      const pauseButton = await $('~일시정지 버튼');
      await pauseButton.waitForDisplayed({ timeout: 5000 });
      expect(await pauseButton.isDisplayed()).toBe(true);
    }
  });

  after(async () => {
    // 테스트 완료 후 정리
    console.log('테스트 완료');
  });
});
