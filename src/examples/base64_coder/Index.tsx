//--meta:
// title: base64 编解码
// date: 2024-4-21 16:54:00
// author: yuanyxh
// description: js 实现的 base64 编解码示例，帮助理解 base64 是如何工作的。base64 中的 64 对应 64 个指定的字符，将源字符以 3 字节一组拆分，每组分为 4 个 6 位数字，每位数字对应 64 位字符的索引，以此来编码源字符。
//--endmeta

import { useState } from 'react';

import { Input, message } from 'antd';

import { Icon } from '@/components';

import styles from './styles/Index.module.less';
import base64 from './utils/base64';

type TChange = React.ChangeEventHandler<HTMLTextAreaElement>;

const { TextArea } = Input;

export default function Base64_Coder() {
  const [messageApi, contextHolder] = message.useMessage();

  const [origin, setOrigin] = useState('');
  const [encode, setEncode] = useState('');

  const handleInputOrigin: TChange = (e) => {
    setOrigin(e.target.value);

    if (!e.target.value) {
      return setEncode('');
    }

    try {
      setEncode(base64.encode(e.target.value));
    } catch (err) {
      messageApi.error((err as Error).message);
    }
  };

  const handleInputEncode: TChange = (e) => {
    setEncode(e.target.value);

    if (!e.target.value) {
      return setOrigin('');
    }

    try {
      setOrigin(base64.decode(e.target.value));
    } catch (err) {
      messageApi.error((err as Error).message);
    }
  };

  return (
    <div className={styles.base64_coder}>
      {contextHolder}

      <TextArea
        placeholder="输入源字符串"
        rows={7}
        value={origin}
        onChange={handleInputOrigin}
      />

      <Icon icon="material-symbols:sync" size={30} />

      <TextArea
        placeholder="输入 base64 编码字符串"
        rows={7}
        value={encode}
        onChange={handleInputEncode}
      />
    </div>
  );
}
