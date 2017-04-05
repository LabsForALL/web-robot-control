import { WebRobotControlPage } from './app.po';

describe('web-robot-control App', function() {
  let page: WebRobotControlPage;

  beforeEach(() => {
    page = new WebRobotControlPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
