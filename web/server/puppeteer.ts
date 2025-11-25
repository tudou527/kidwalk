import puppeteer from 'puppeteer';

export interface IPageDetail {
  comments: any;
  note: any;
}

export async function getPageDetail(url: string): Promise<IPageDetail | null> {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
    ],
    browser: 'chrome',
    channel: 'chrome',
    enableExtensions: ['/home/nextjs/.cache/puppeteer'],
  });
  browser.setCookie({
    name: 'web_session',
    value: '040069b402dcad37404658bf2b3b4b13df14b4',
    domain: '.xiaohongshu.com',
    httpOnly: true,
    secure: true,
    expires: 1795173041572,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url);
  await page.waitForSelector('body');

  await page.waitForSelector('body');
  await page.screenshot({ path: 'example.png' });

  const pageData = await page.evaluate(async () => {
    const initState = (window as unknown as any).__INITIAL_STATE__ || {};
    if (!initState.note) {
      return null;
    }

    const currentNoteId = initState.note.currentNoteId._value;
    const noteDetailMap = initState.note.noteDetailMap;
    const { comments, note } = noteDetailMap[currentNoteId] || {};

    // 加载更多评论
    const getMoreComments = async (cursor: string, index: number) => {
      const params = new URLSearchParams({
        note_id: currentNoteId,
        cursor,
        top_comment_id: '',
        xsec_token: note.xsecToken,
        image_formats: 'jpg,webp,avif',
      });
      const commentResponse = await fetch(`https://edith.xiaohongshu.com/api/sns/web/v2/comment/page?${params.toString()}`, {
        method: 'get',
        credentials: 'include'
      }).then(res => res.json());

      if (commentResponse.success) {
        comments.list.push(...commentResponse.data.comments);
        comments.hasMore = commentResponse.data.hasMore;
        comments.cursor = commentResponse.data.cursor;

        note.xsecToken = commentResponse.data.xsec_token;
      }

      if (comments.hasMore && index < 5) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await getMoreComments(comments.cursor, index + 1);
      }
    }

    if (comments.hasMore) {
      await getMoreComments(comments.cursor, 1);
    }

    return { comments, note };
  });

  await page.close();
  await browser.close();

  return pageData;
}
