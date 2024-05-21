import { ModalFuncProps, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import { confirm } from '@/utils';

interface WarningOptions {
  title: string;
  list?: string[];
  onOk: ModalFuncProps['onOk'];
}

interface IWarningComProps {
  title: string;
  list?: string[];
}

const { Paragraph, Text } = Typography;

const WarningCom: React.FC<Readonly<IWarningComProps>> = (props) => {
  return (
    <>
      <Paragraph>{props.title}</Paragraph>

      {props.list?.length ? (
        <Paragraph>
          <ul>
            {props.list.map((n) => (
              <li key={n}>
                <Text style={{ verticalAlign: 'text-bottom' }}>{n}</Text>
              </li>
            ))}
          </ul>
        </Paragraph>
      ) : null}
    </>
  );
};

export function fileOperationWarning(options: WarningOptions) {
  const { title, list, onOk } = options;

  return confirm({
    title: '温馨提示',
    icon: <ExclamationCircleFilled />,
    content: <WarningCom title={title} list={list} />,
    onOk,
    okText: '确认',
    cancelText: '取消'
  });
}
