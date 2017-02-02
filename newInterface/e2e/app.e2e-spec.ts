import { NewInterfacePage } from './app.po';

describe('new-interface App', function() {
  let page: NewInterfacePage;

  beforeEach(() => {
    page = new NewInterfacePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
