import React from 'react';
import { Form, Input, Button, Modal, notification } from 'antd';
import { resetPassWordAPI } from '../../../services/common.service';

const NewPasswordForm = ({ isVisible, setIsVisible, dataSubmit }) => {
    const [resetPasswordForm] = Form.useForm();

    const handleResetPasswordSubmit = async (values) => {
        const data = {
            username: dataSubmit.username,
            email: dataSubmit.email,
            confirmationCode: dataSubmit.confirmationCode,
            newPassword: values.newPassword,
        };
        try {
            const response = await resetPassWordAPI(data);
            if (response.data.success) {
                setIsVisible(false);
                notification.success({
                    message: 'パスワード再設定が成功しました。',
                    style: {
                        width: 350,
                    },
                });
                resetPasswordForm.resetFields('');
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
            title="新しいパスワードをご入力ください"
            maskClosable={false}
            open={isVisible}
            footer={null}
            onCancel={() => {
                setIsVisible(false);
                resetPasswordForm.resetFields('');
            }}
        >
            <Form
                form={resetPasswordForm}
                layout="vertical"
                onFinish={handleResetPasswordSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') resetPasswordForm.submit();
                }}
            >
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
                    <Input.Password className="rounded-lg" />
                </Form.Item>

                <Form.Item
                    label="新しいパスワード（確認）"
                    name="confirmPassword"
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('パスワードが一致しません'));
                            },
                        }),
                    ]}
                >
                    <Input.Password className="rounded-lg" />
                </Form.Item>

                <div className="flex items-center justify-center">
                    <Button
                        onClick={() => resetPasswordForm.submit()}
                        type="primary"
                        className="w-full rounded-lg bg-blue-500 hover:bg-blue-600"
                    >
                        送信
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default NewPasswordForm;
