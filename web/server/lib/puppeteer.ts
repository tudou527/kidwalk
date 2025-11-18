import puppeteer from 'puppeteer';

export default async function getDetail(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await browser.setCookie({
    name: 'cookie1',
    value: '1',
    domain: 'localhost',
    path: '/',
    sameParty: false,
    expires: -1,
    httpOnly: false,
    secure: false,
    sourceScheme: 'NonSecure',
  });

  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (interceptedRequest.isInterceptResolutionHandled()) {
      return;
    };
    // 不加载图片
    if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg')) {
      interceptedRequest.abort();
    }
    else interceptedRequest.continue();
  });
  page.on('response', response => {
    console.log(response.url());
  });

  await page.goto(url);
  await page.setViewport({ width: 1080, height: 1024 });

  // 在页面环境中暴露这个函数
  await page.exposeFunction('getNodeInfo', async () => {
    return 'xxxx';
  });

  const hasLogin = await page.evaluate(async () => {
    const info = await window.getNodeInfo();
    // 登录判断
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      url: window.location.href,
      info,
    };
  });

  await browser.close();
}