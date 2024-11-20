import React, { useEffect } from 'react';
import { Form, Input, Modal, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { updateSharingApi } from '../../../services/common.service';

const UpdateInternalSharing = ({ updateSharing, setUpdateSharing, selectedSharing, fetchData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedSharing) {
            form.setFieldsValue({
                title: selectedSharing.title,
                content: selectedSharing.content,
            });
        }
    }, [selectedSharing, updateSharing, form]);

    const handleSubmit = async (values) => {
        try {
            const response = await updateSharingApi(selectedSharing.id, values);
            if (response.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setUpdateSharing(false);
                await fetchData(dayjs().year(), dayjs().month() + 1);
            } else {
                notification.error({
                    message: '修正が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            notification.error({
                message: '更新が失敗しました。',
            });
        }
    };

    return (
        <Modal
            title="情報修正"
            maskClosable={false}
            open={updateSharing}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                setUpdateSharing(false);
            }}
            width={'50%'}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="タイトル"
                    name="title"
                    rules={[{ required: true, message: 'タイトルを入力してください！' }]}
                >
                    <Input placeholder="タイトルを入力してください" className="w-full" />
                </Form.Item>
                <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '内容を入力してください！' }]}
                >
                    <TextArea rows={14} placeholder="内容を入力してください" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateInternalSharing;
