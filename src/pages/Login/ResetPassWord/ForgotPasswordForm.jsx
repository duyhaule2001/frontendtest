import React, { useState } from 'react';
import { Form, Input, Button, Modal, notification } from 'antd';
import { submitForgotPassword } from '../../../services/common.service';
import ResetConfirmCode from './ResetConfirmCode';

const ForgotPasswordForm = ({ isVisible, setIsVisible }) => {
    const [forgotPasswordForm] = Form.useForm();
    const [isCodeModalVisible, setIsCodeModalVisible] = useState(false);
    const [dataSubmit, setDataSubmit] = useState();

    const handleForgotPasswordSubmit = async (values) => {
        try {
            const response = await submitForgotPassword(values);
            if (response.data) {
                setIsVisible(false);
                setIsCodeModalVisible(true);
                setDataSubmit(values);
                notification.success({
                    message: '認証コードがメールに送信されました。',
                });
                forgotPasswordForm.resetFields('');
            } else {
                notification.error({
                    message: response.error,
                    style: {
                        width: 360,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                title="ユーザーIDとメールアドレスをご入力ください"
                maskClosable={false}
                open={isVisible}
                footer={null}
                onCancel={() => {
                    setIsVisible(false);
                    forgotPasswordForm.resetFields('');
                }}
            >
                <Form
                    form={forgotPasswordForm}
                    layout="vertical"
                    onFinish={handleForgotPasswordSubmit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') forgotPasswordForm.submit();
                    }}
                >
                    <Form.Item label="ユーザーID" name="username" rules={[{ required: true }]}>
                        <Input className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        label="メールアドレス"
                        name="email"
                        rules={[
                            { required: true, message: 'メールを入力してください' },
                            { type: 'email', message: '有効なメールを入力してください' },
                        ]}
                    >
                        <Input className="rounded-lg" />
                    </Form.Item>

                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => forgotPasswordForm.submit()}
                            type="primary"
                            className="w-full rounded-lg bg-blue-500 hover:bg-blue-600"
                        >
                            送信
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Enter confirmation code modal */}
            <ResetConfirmCode
                isVisible={isCodeModalVisible}
                setIsVisible={setIsCodeModalVisible}
                dataSubmit={dataSubmit}
            />
        </>
    );
};

export default ForgotPasswordForm;
