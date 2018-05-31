import { Angular4starterPage } from './app.po';

describe('angular4starter App', () => {
  let page: Angular4starterPage;

  beforeEach(() => {
    page = new Angular4starterPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
