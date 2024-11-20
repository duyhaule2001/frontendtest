import React from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const MessageModal = ({ isModalVisible, handleOk, handleCancel, messageForm, fileList, setFileList }) => {
    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    return (
        <Modal
            title="メール送信"
            maskClosable={false}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="送信"
            cancelText="キャンセル"
        >
            <Form form={messageForm} layout="vertical">
                <Form.Item name="title" label="タイトル" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="content"
                    label="メール内容"
                    rules={[{ required: true, message: '内容を入力してください。' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="ファイル添付">
                    <Upload fileList={fileList} onChange={handleChange} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>選択</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MessageModal;
