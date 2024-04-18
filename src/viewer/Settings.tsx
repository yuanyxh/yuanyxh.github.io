import { Button } from 'antd';

import { requestFullScreen } from '@/utils';

const Settings = () => {
  const handleFullScreen = () => {
    requestFullScreen();
  };

  return (
    <>
      <div>
        <Button type="primary" onClick={handleFullScreen}>
          full screen
        </Button>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          height: '300px',
          border: '1px solid #eee'
        }}
      >
        全屏啊
      </div>
    </>
  );
};

export default Settings;
