import { NextRequest } from 'next/server';

import { getStructuredData } from '@/server/agent';
import { saveLocationDraft } from '@/server/location';

export async function POST(request: NextRequest) {
  const { content } = await request.json();
  const text = `
    杭州余杭｜这片免费露营大草坪太香了～ 🌈余杭枫岭村 ... http://xhslink.com/o/Au87T9oUpas 
    复制后打开【小红书】查看笔记！
  `.trim();

  if (!text) {
    return Response.json({
      success: false,
      errorMessage: '参数不正确',
    });
  }

  const result = await getStructuredData(text);
  if (!result) {
    return Response.json({
      success: false,
      errorMessage: '获取数据失败',
    });
  }

  await saveLocationDraft(result);
  return Response.json({
    success: true,
    data: result,
  });
}