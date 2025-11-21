import data from '../result.json';
import { getPosition } from './lbs';

const apiKey = 'sk-d9fd212135ce46a082e75ae30184b44f';
export async function getStructuredData() {
  const { comments, note } = data;
  const projects = [
    '爬山','玩水','挖沙','散步','骑车','露营','滑梯','足球','篮球','爬爬架','滑草'
  ]
  const promptStr: string[] = [
    `## ${note.title}`,
    `用户：${note.user.nickname} 所在城市：${note.ipLocation}`,
    '### 笔记内容\n${note.desc}',
  ];

  if (comments.list.length > 0) {
    promptStr.push('### 笔记评论')
    comments.list.forEach(comment => {
      promptStr.push(`${comment.userInfo?.nickname}： ${comment.content}`);
    });
  }

  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: `
            你是一个专业助理，你需要从用户笔记中抽取城市、地区、导航地点、具体地点、游乐项目数据，以JSON格式返回。
            **城市**：笔记中用户所在城市
            **导航地点**：你需要根据笔记内容未用户提供一个可导航的目的，比如杭钢公园、xx村委会。**不要返模糊**
            **具体地点**：笔记中提到的具体地点
            **游乐项目**：指的是适合儿童玩耍的项目，可选项为：${projects.join('、')}
          `,
        },
        {
          role: 'user',
          content: promptStr.join('\n'),
        },
      ],
      response_format: {
        type: 'json_object'
      }
    })
  }).then(res => res.json());
  const info = JSON.parse(response.choices[0].message.content);
  const position = await getPosition(info['导航地点'], info['城市']);

  return {
    ...info,
    location: position.results,
  }
}

getStructuredData();