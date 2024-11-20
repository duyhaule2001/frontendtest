import { Form, notification, Modal, Input } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { createSharingApi } from '../../../services/common.service';

const CreateInternalSharing = ({ createSharing, setCreateSharing, fetchData }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const response = await createSharingApi(values);
            if (response.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setCreateSharing(false);
                form.resetFields();
                await fetchData(dayjs().year(), dayjs().month() + 1);
            } else {
                notification.error({
                    message: '登録が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="新規登録"
            maskClosable={false}
            open={createSharing}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                form.resetFields();
                setCreateSharing(false);
            }}
            width={'50%'}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="タイトル"
                    name="title"
                    rules={[{ required: true, message: 'タイトルを入力してください！' }]}
                >
                    <Input className="w-full" />
                </Form.Item>
                <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '内容を入力してください！' }]}
                >
                    <TextArea rows={14} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateInternalSharing;
