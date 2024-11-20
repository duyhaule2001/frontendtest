import React, { useState } from 'react';
import { Form, Input, Button, Modal, notification } from 'antd';
import dayjs from 'dayjs';

import { verifyAuthCodeAPI, getAccountAPI, getApplicationList } from '../../services/common.service';
import { doGetAccountAction } from '../../redux/account/accountSlice';
import { setUnapprovedItems } from '../../redux/approval/approvalSlice';

const ConfirmCode = ({ isVisible, setIsVisible, dispatch, navigate, submitData }) => {
    const [authForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchApplicationList = async () => {
        try {
            const year = dayjs().format('YYYY');
            const month = dayjs().format('MM');
            const res = await getApplicationList(year, month);
            if (res.data && Array.isArray(res.data)) {
                dispatch(setUnapprovedItems(res.data)); // Reduxストアにデータを更新する
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAuthCodeSubmit = async (values) => {
        setLoading(true);
        try {
            const data = {
                username: submitData?.username,
                password: submitData?.password,
                mail: submitData?.mail,
                confirmationCode: values.confirmationCode,
            };
            const res = await verifyAuthCodeAPI(data);
            if (res.data) {
                localStorage.setItem('access_token', res.data.access_token);
                notification.success({
                    message: 'ログインが成功しました。',
                    style: {
                        width: 290,
                    },
                });

                const accountResponse = await getAccountAPI();
                if (accountResponse.data) {
                    dispatch(doGetAccountAction(accountResponse.data));
                    const permissionRoutes = {
                        0: '/board',
                        1: '/recommendation',
                        2: '/humanResources',
                        3: '/generalAffairs',
                        4: '/sale',
                        5: '/sale',
                        6: '/employee',
                        7: '/employee',
                        8: '/employee',
                        9: '/employee',
                        20: '/teacher',
                        50: '/vicePresident',
                        100: '/president',
                    };

                    const redirectPath = permissionRoutes[accountResponse.data.permissions];
                    if (redirectPath) {
                        navigate(redirectPath);
                    }
                    if (accountResponse.data.permissions === 3) {
                        fetchApplicationList();
                    }
                    setIsVisible(false);
                } else {
                    notification.error({
                        message: accountResponse.error,
                    });
                }
            } else {
                notification.error({
                    message: res.error,
                    style: {
                        width: 410,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="メールで送信された認証コードをご入力ください"
            maskClosable={false}
            open={isVisible}
            footer={null}
            onCancel={() => {
                setIsVisible(false);
                authForm.resetFields('');
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') authForm.submit();
            }}
        >
            <Form form={authForm} layout="vertical" onFinish={handleAuthCodeSubmit}>
                <Form.Item
                    label="認証コード"
                    name="confirmationCode"
                    rules={[{ required: true, message: '認証コードを入力してください' }]}
                >
                    <Input className="rounded-lg" />
                </Form.Item>

                <div className="flex items-center justify-center">
                    <Button
                        onClick={() => authForm.submit()}
                        type="primary"
                        className="w-full rounded-lg bg-blue-500 hover:bg-blue-600"
                        loading={loading}
                    >
                        認証
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ConfirmCode;
