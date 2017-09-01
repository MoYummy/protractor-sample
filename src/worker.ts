/// <reference path="../node_modules/protractor-intercept/lib/index.d.ts" />
import * as protractor from 'protractor';
import * as log4js from 'log4js';
import * as Intercept from 'protractor-intercept';

const pbd = protractor.browser.driver;
const by: protractor.ProtractorBy = protractor.by;

describe('worker', () => {
  beforeAll(() => {
    const getLogFile = (aDate: Date) => `${aDate.getFullYear()}-${aDate.getMonth() + 1}-${aDate.getDate()}-${aDate.getHours()}-${aDate.getMinutes()}-${aDate.getSeconds()}.log`;
    log4js.configure({
      appenders: {
        everything: { type: 'file', filename: `/myapp/logs/${getLogFile(new Date())}`, layout: { type: 'pattern', pattern: '%m%n' } },
      },
      categories: {
        default: { appenders: ['everything'], level: 'debug' },
      },
    } as any);
  });

  function waitVisible(locator: any): void {
    pbd.wait(protractor.until.elementLocated(locator)).then((e) => {
      pbd.wait(protractor.until.elementIsVisible(e)).then(() => {
        const printFunc = (str) => console.log(new Date() + 'WebElement(\'' + locator.toString() + '\'):\n' + str);
        e.getLocation().then(str => printFunc(`${str.x},${str.y}`));
        e.getTagName().then(str => printFunc(str));
        // e.getText().then(str => printFunc(str));
        // pbd.getPageSource().then(str => printFunc(str));
      });
    });
  }

  function waitExist(locator: any): void {
    pbd.wait(protractor.until.elementLocated(locator)).then((e) => {
      const printFunc = () => console.log(new Date() + 'WebElement(\'' + locator.toString() + '\') exists');
    });
  }

  function snapshot(logger: log4js.Logger, title: string): void {
    pbd.getPageSource().then(html => {
      logger.info(`================ ${title} ================`);
      logger.info(html);
      logger.info(`================ ${title} ================`);
    });
  }

  it('should cache be', async (done: DoneFn) => {
    const logger = log4js.getLogger('everything');
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 60;
    await pbd.get('http://cafetownsend-angular-rails.herokuapp.com');
    const intercept = new Intercept(protractor.browser);
    intercept.addListener();
    expect(await protractor.browser.getTitle()).toEqual('CafeTownsend-AngularJS-Rails');

    const mainViewContainer = by.css('.main-view-container');
    waitVisible(mainViewContainer);
    const mainViewContainerEl: protractor.WebElement = await pbd.findElement(mainViewContainer);
    snapshot(logger, 'mainViewContainer');
    expect(await pbd.getCurrentUrl()).toMatch(/login/);

    const username = by.css('input[type=text]');
    const password = by.css('input[type=password]');
    const loginButton = by.css('.main-button');
    waitVisible(username);
    waitVisible(password);
    waitVisible(loginButton);
    const usernameEl: protractor.WebElement = await mainViewContainerEl.findElement(username);
    const passwordEl: protractor.WebElement = await mainViewContainerEl.findElement(password);
    const loginButtonEl: protractor.WebElement = await mainViewContainerEl.findElement(loginButton);
    snapshot(logger, 'login');
    usernameEl.sendKeys('Luke');
    passwordEl.sendKeys('Skywalker');
    loginButtonEl.click();

    const employeeList = by.css('#employee-list-container');
    waitVisible(employeeList);
    const employeeListEl = pbd.findElement(employeeList);
    snapshot(logger, 'employeeList');
    expect(await pbd.getCurrentUrl()).toMatch(/employees/);

    //const globalPanelEl: protractor.WebElement = await pbd.findElement(globalPanel);
    //console.dir(await intercept.getRequests(), { depth: 20 });
    done();
  });
});
