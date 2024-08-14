import { useEffect, useState } from 'react';

import style from './Index.module.less';
import { json2ts } from './JSON2TypeScript';

import Editor from '@monaco-editor/react';

const JSON2TypeScript: React.FC = () => {
  const [typescript, setTypeScript] = useState('');

  useEffect(() => {
    handleChange(`{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}`);
  }, []);

  const handleChange = (e: string | undefined) => {
    try {
      const obj = JSON.parse(e || '');

      const ts = json2ts(obj);

      // console.log(ts);

      if (typeof ts === 'string') {
        setTypeScript(ts);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.json}>
        <div className={style.toolbar}>JSON</div>
        <Editor
          height={'calc(100% - 60px)'}
          defaultLanguage="json"
          defaultValue='{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}'
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
