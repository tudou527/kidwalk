'use client';
import { Sender } from '@ant-design/x';
import { useSetState } from 'ahooks';
import { Button, message } from 'antd';
import { IconClipboardText } from '@tabler/icons-react';

import style from './home/style.module.css';

interface IState {
  loading: boolean;
  content: string;
  result?: string;
}

export default function Page() {
  const [state, setState] = useSetState<IState>({
    loading: false,
    content: '',
  });

  // 读取剪切板
  const handleReadClipboard = async () => {
    const text = await navigator.clipboard.readText();
    setState({ content: text.trim() });
  }

  const handleSubmit = async () => {
    setState({ loading: true });
    const response = await fetch('/api/draft', {
      method: 'post',
      body: JSON.stringify({
        text: state.content,
      }),
    }).then(res => res.json());

    if (!response.success) {
      message.error(response.errorMessage);
    }

    setState({
      loading: false,
      result: response.data,
    });
  }

  return (
    <div className={style.page}>
      <div className={style.msgList}>

      </div>
      <Sender
        suffix={false}
        loading={state.loading}
        value={state.content}
        onChange={(val) => setState({ content: val })}
        onSubmit={handleSubmit}
        footer={(actionNode) => (
          <div className={style.footer}>
            <div className={style.tools}>
              <Button type="text" onClick={handleReadClipboard}>
                <IconClipboardText size={20} stroke={2} />
              </Button>
            </div>
            {actionNode}
          </div>
        )}
        autoSize={false}
      />
    </div>
  );
}
