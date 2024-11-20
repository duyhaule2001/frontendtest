import React from 'react';
import { Form, Input, Modal, notification } from 'antd';
import { changePasswordAPI } from '../../../services/common.service';

const ChangePassword = ({ setChangePassword, changePasswordVisible }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const { oldPassword, newPassword } = values;
        try {
            const response = await changePasswordAPI({ oldPassword, newPassword });
            if (response.data) {
                notification.success({
                    message: response.data.message,
                    style: {
                        width: 330,
                    },
                });
                setChangePassword(false);
                form.resetFields();
            } else {
                notification.error({
                    message: response.error,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="パスワード変更"
            open={changePasswordVisible}
            maskClosable={false}
            onOk={() => form.submit()}
            okText="変更"
            cancelText="キャンセル"
            onCancel={() => {
                form.resetFields();
                setChangePassword(false);
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') form.submit();
                }}
            >
                <Form.Item label="現在のパスワード" name="oldPassword" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="新しいパスワード"
                    name="newPassword"
                    rules={[
                        { required: true },
                        {
                            min: 8,
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                            message: 'パスワードは8文字以上で、大文字、小文字、数字を含めてください。',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="新しいパスワード(確認)"
                    name="confirmNewPassword"
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('新しいパスワードが一致しません！'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePassword;
