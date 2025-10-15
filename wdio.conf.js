exports.config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',

  // ==================
  // Specify Test Files
  // ==================
  specs: ['./test/specs/**/*.js'],

  // Patterns to exclude.
  exclude: [],

  // ============
  // Capabilities
  // ============
  maxInstances: 1,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 16 Pro',
      'appium:platformVersion': '18.4',
      'appium:automationName': 'XCUITest',
      'appium:bundleId': 'host.exp.Exponent',
      'appium:noReset': true,
      'appium:fullReset': false,
    },
  ],

  // ===================
  // Test Configurations
  // ===================
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // Appium 서버 연결 설정
  hostname: 'localhost',
  port: 4723,
  path: '/',

  services: [],
  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  // =====
  // Hooks
  // =====
  onPrepare: function (config, capabilities) {
    console.log('🚀 Appium 테스트 시작');
  },

  onComplete: function (exitCode, config, capabilities, results) {
    console.log('✅ Appium 테스트 완료');
  },
};
