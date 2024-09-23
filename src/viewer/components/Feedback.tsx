import { useState } from 'react';

import { Button, Form, Input, Modal, Select, Space } from 'antd';

import { error, success } from '@/utils';

import type { IIssuesPayload } from '@/http';
import { postIssues } from '@/http';

interface IFeedbackProps {
  visible: boolean;
  onChange: (visible?: boolean) => void;
}

const initialValues: IIssuesPayload = {
  concact: '',
  type: 'suggestion',
  description: ''
};

export const Feedback: React.FC<IFeedbackProps> = ({ visible, onChange }) => {
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

          await postIssues(value);

          form.resetFields();

          success('已发送反馈建议。');
        } catch (err) {
          error(err as string);
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
          <Form.Item<IIssuesPayload> name="type" label="类型" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'suggestion', label: '建议' },
                { value: 'feedback', label: '反馈' }
              ]}
              onChange={onTypeChange}
            />
          </Form.Item>

          <Form.Item<IIssuesPayload>
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入清晰的描述信息' }]}
          >
            <Input.TextArea style={{ resize: 'none' }} rows={5} maxLength={1000} showCount />
          </Form.Item>

          <Form.Item<IIssuesPayload> name="concact" label="联系方式">
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
