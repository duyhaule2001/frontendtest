import React, { useState } from 'react';
import { Form, Input, Button, Modal, notification } from 'antd';
import { verifyResetCodeAPI } from '../../../services/common.service';
import NewPasswordForm from './NewPasswordForm';

const ResetConfirmCode = ({ isVisible, setIsVisible, dataSubmit }) => {
    const [codeForm] = Form.useForm();
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
    const [updatedDataSubmit, setUpdatedDataSubmit] = useState(dataSubmit);

    const handleCodeSubmit = async (values) => {
        const data = {
            username: dataSubmit.username,
            email: dataSubmit.email,
            confirmationCode: values.confirmationCode,
        };
        try {
            const response = await verifyResetCodeAPI(data);
            if (response.data) {
                setUpdatedDataSubmit({
                    ...dataSubmit,
                    confirmationCode: values.confirmationCode,
                });
                setIsVisible(false);
                setIsResetPasswordModalVisible(true);
                notification.success({
                    message: 'メール承認が成功しました。',
                    style: {
                        width: 320,
                    },
                });
                codeForm.resetFields('');
            } else {
                notification.error({
                    message: response.error,
                    style: {
                        width: 410,
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
                title="メールで送信された認証コードをご入力ください"
                maskClosable={false}
                open={isVisible}
                footer={null}
                onCancel={() => {
                    setIsVisible(false), codeForm.resetFields('');
                }}
            >
                <Form
                    form={codeForm}
                    layout="vertical"
                    onFinish={handleCodeSubmit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') codeForm.submit();
                    }}
                >
                    <Form.Item
                        label="認証コード"
                        name="confirmationCode"
                        rules={[{ required: true, message: '認証コードを入力してください' }]}
                    >
                        <Input className="rounded-lg" />
                    </Form.Item>

                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => codeForm.submit()}
                            type="primary"
                            className="w-full rounded-lg bg-blue-500 hover:bg-blue-600"
                        >
                            認証
                        </Button>
                    </div>
                </Form>
            </Modal>
            <NewPasswordForm
                isVisible={isResetPasswordModalVisible}
                setIsVisible={setIsResetPasswordModalVisible}
                dataSubmit={updatedDataSubmit}
            />
        </>
    );
};

export default ResetConfirmCode;
