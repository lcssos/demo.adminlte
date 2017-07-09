import { Demo.AdminltePage } from './app.po';

describe('demo.adminlte App', () => {
  let page: Demo.AdminltePage;

  beforeEach(() => {
    page = new Demo.AdminltePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
