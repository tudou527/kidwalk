import puppeteer from 'puppeteer';

import { getLinkFromText } from '../util/common';

async function getDetail(url: string) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
    ],
  });
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
  page.on('request', request => {
    if (request.isInterceptResolutionHandled()) {
      return;
    };
    // 不加载图片
    if (['image', 'stylesheet', 'font', 'media'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });
  page.on('response', response => {
    // console.log(response.url());
  });

  await page.goto(url);
  await page.setViewport({ width: 1080, height: 1024 });

  // 在页面环境中暴露方法
  await page.exposeFunction('getNodeInfo', async () => {
    return document.body.innerHTML;
  });
  
  const data = await page.evaluate(async () => {
    return document.documentElement.innerHTML;
    // const info = await window.getNodeInfo();
    // // 登录判断
    // return {
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    //   url: window.location.href,
    //   info,
    // };
  });
  console.log('>>>>> data: ', data);

  await page.close();
  await browser.close();
}

new Promise(async () => {
  const demoText = `
    杭州余杭｜这片免费露营大草坪太香了～ 🌈余杭枫岭村 ... http://xhslink.com/o/Au87T9oUpas 
    复制后打开【小红书】查看笔记！
    `;
  const [link] = getLinkFromText(demoText);
  if (!link) {
    return;
  }

  await getDetail(link);
});