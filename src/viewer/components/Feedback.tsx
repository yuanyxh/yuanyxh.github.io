import { useState } from 'react';

import { Button, Form, Input, Modal, Select, Space } from 'antd';

import { error, success } from '@/utils';

interface IFeedbackProps {
  visible: boolean;
  onChange: (visible?: boolean) => void;
}

const initialValues = {
  concact: '',
  type: 'suggestion',
  description: ''
};
const Feedback: React.FC<IFeedbackProps> = ({ visible, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const [form] = Form.useForm<typeof initialValues>();

  const onTypeChange = (type: string) => {
    form.setFieldValue('type', type);
  };

  const handleUploadFeedback = async () => {
    form
      .validateFields()
      .then(async (value) => {
        try {
          setUploading(true);

          await fetch('https://api.yuanyxh.com/issues', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(value),
            signal: AbortSignal.timeout(8000)
          });

          form.resetFields();

          success('已发送反馈建议。');
        } catch (err) {
          error('抱歉，暂时无法发送反馈，请稍后再试或前往 Github 留言。');
        } finally {
          setUploading(false);
        }
      })
      .catch(() => {
        /* empty */
      });
  };

  const handleCancel = () => {
    onChange(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        style={{ top: '15vh' }}
        title="反馈建议"
        open={visible}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          style={{ maxWidth: 600, marginTop: 30 }}
          name="feedback"
          form={form}
          initialValues={initialValues}
          layout="vertical"
          onFinish={handleUploadFeedback}
        >
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'suggestion', label: '建议' },
                { value: 'feedback', label: '反馈' }
              ]}
              onChange={onTypeChange}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入清晰的描述信息' }]}
          >
            <Input.TextArea
              style={{ resize: 'none' }}
              rows={5}
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item name="concact" label="联系方式">
            <Input
              placeholder="请输入您的联系方式，并备注使用的客户端，可留空"
              maxLength={40}
              showCount
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={uploading}>
                提交
              </Button>

              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Feedback;
