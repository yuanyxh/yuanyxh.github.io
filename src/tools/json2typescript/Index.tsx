import { useState } from 'react';

import style from './Index.module.less';
import { createType, generate } from './JSON2TypeScript';

import Editor from '@monaco-editor/react';

// const transform = (obj: any) => {
//   const type = typeof obj;

//   switch (type) {
//     case 'string':
//     case 'number':
//     case 'bigint':
//     case 'boolean':
//     case 'object':
//   }
// }

const json2ts = (json: string) => {
  try {
    const obj = JSON.parse(json);

    console.log(createType(obj));

    return generate(createType(obj));
  } catch (err) {
    console.log(err);

    return void 0;
  }
};

const JSON2TypeScript: React.FC = () => {
  const [typescript, setTypeScript] = useState('');

  const handleChange = (e: string | undefined) => {
    const ts = json2ts(e || '');

    if (typeof ts === 'string') {
      setTypeScript(ts);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.json}>
        <div className={style.toolbar}>JSON</div>
        <Editor
          height={'calc(100% - 60px)'}
          defaultLanguage="json"
          options={{ minimap: { enabled: false } }}
          onChange={handleChange}
        />
      </div>

      <div className={style.typescript}>
        <div className={style.toolbar}>TypeScript</div>
        <Editor
          height={'calc(100% - 60px)'}
          defaultLanguage="typescript"
          options={{ minimap: { enabled: false } }}
          value={typescript}
        />
      </div>
    </div>
  );
};

export default JSON2TypeScript;
