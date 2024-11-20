import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router';

import { loginAPI } from '../../services/common.service';
import { useDispatch } from 'react-redux';
import logo from '../../assets/logo.png';
import ConfirmCode from './ConfirmCode';
import ForgotPasswordForm from './ResetPassWord/ForgotPasswordForm';

function Login() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isAuthCodeModalVisible, setIsAuthCodeModalVisible] = useState(false);
    const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
    const [submitData, setSubmitData] = useState();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const res = await loginAPI(values.username, values.password, values.mail);
            if (res.data) {
                setSubmitData({
                    username: values.username,
                    password: values.password,
                    mail: values.mail,
                });
                setIsAuthCodeModalVisible(true);
            } else {
                notification.error({
                    message: res.error,
                    style: {
                        width: 345,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img className="mx-auto h-12 w-auto" src={logo} alt="Your Company" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">株式会社スカイテック</h2>
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleLogin}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') form.submit();
                    }}
                >
                    <Form.Item
                        label="ユーザーID"
                        name="username"
                        rules={[{ required: true, message: 'ユーザーIDを入力してください' }]}
                    >
                        <Input className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        label="パスワード"
                        name="password"
                        rules={[{ required: true, message: 'パスワードを入力してください' }]}
                    >
                        <Input.Password className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        label="メールアドレス"
                        name="mail"
                        rules={[
                            { required: true, message: 'メールアドレスを入力してください' },
                            { type: 'email', message: '有効なメールアドレスを入力してください' },
                        ]}
                    >
                        <Input
                            className="rounded-lg"
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') form.submit();
                            }}
                        />
                    </Form.Item>

                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => form.submit()}
                            type="primary"
                            className="w-full rounded-lg bg-blue-500 hover:bg-blue-600"
                            loading={loading}
                        >
                            ログイン
                        </Button>
                    </div>
                    <span
                        className="mt-4 block cursor-pointer text-sm text-blue-500 hover:text-blue-700"
                        onClick={() => setIsForgotPasswordModalVisible(true)}
                    >
                        パスワードを忘れた場合
                    </span>
                </Form>
            </div>

            <ConfirmCode
                isVisible={isAuthCodeModalVisible}
                setIsVisible={setIsAuthCodeModalVisible}
                dispatch={dispatch}
                navigate={navigate}
                submitData={submitData}
            />
            <ForgotPasswordForm
                isVisible={isForgotPasswordModalVisible}
                setIsVisible={setIsForgotPasswordModalVisible}
            />
        </div>
    );
}

export default Login;
