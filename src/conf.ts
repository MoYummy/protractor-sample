import { Config } from 'protractor';
export const config: Config = {
  seleniumAddress: 'http://selenium-hub:4444/wd/hub',
  framework: 'jasmine',
  multiCapabilities: [{
    'browserName': 'chrome'
  }],
  specs: ['worker.js'],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },
  chromeOptions: {
    args: ['--headless'],
    //args: ['--headless', '--disable-gpu', '--window-size=800,600'],
    //args: ['--headless', '--disable-gpu'],
  }
};