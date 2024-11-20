import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ChangePassword from './ChangePassword';
import { Avatar, Button, Divider, notification } from 'antd';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { getCheckInAPi, submitCheckInAPi } from '../../../services/common.service';

const UserInfoEmp = () => {
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const user = useSelector((state) => state.account.user);
    const [isImageError, setIsImageError] = useState(false);
    const navigate = useNavigate();
    const [isCheckIn, setIsCheckIn] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        notification.success({
            message: 'ログアウトが成功しました。',
            style: {
                width: 320,
            },
        });
        navigate('/');
    };

    const handleCheckIn = async () => {
        try {
            const res = await submitCheckInAPi();
            console.log('Check', res.data);
            if (res.data) {
                setIsCheckIn(true);
                notification.success({
                    message: '出勤が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user.permissions === 50 || user.permissions === 0) {
            getCheckIn();
        }
    }, []);

    const getCheckIn = async () => {
        try {
            const res = await getCheckInAPi();
            if (res.data) {
                setIsCheckIn(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="text-center">
            <div>
                <div className="mb-5 flex justify-center">
                    <Avatar
                        size={200}
                        className="border-2 border-blue-400"
                        src={!isImageError ? user.image : undefined}
                        style={{ backgroundColor: user.image && !isImageError ? undefined : '#f56a00' }}
                        onError={() => setIsImageError(true)}
                    >
                        <span className="text-6xl">{!user.image || isImageError ? user.name.charAt(0) : null}</span>
                    </Avatar>
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.mail}</p>
            </div>
            <Divider style={{ borderColor: 'black' }} />
            <div>
                <div className="flex justify-between">
                    <span className="font-semibold">社員番号</span>
                    <span className="text-gray-600">{user.emp_no}</span>
                </div>
                {user.permissions !== 20 && (
                    <div className="flex justify-between">
                        <span className="font-semibold">部門</span>
                        <span className="text-gray-600">{user.department}</span>
                    </div>
                )}
                {user.permissions !== 20 && (
                    <div className="flex justify-between">
                        <span className="font-semibold">役職</span>
                        <span className="text-gray-600">{user.managerial_position}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="font-semibold">在籍期間</span>
                    <span className="text-gray-600">{user.tenure_period}</span>
                </div>
                {[1, 2, 3, 4, 5].includes(user.permissions) && (
                    <div className="flex justify-between">
                        <span className="font-semibold">残りの有給休暇</span>
                        <span className="text-gray-600">{user.remaining_paid_leave_days}</span>
                    </div>
                )}
            </div>
            <div className="mt-4 flex justify-around">
                <Button onClick={() => setChangePasswordVisible(true)}>
                    <SettingOutlined />
                    パスワード変更
                </Button>
                <Button onClick={handleLogout}>
                    <LogoutOutlined />
                    ログアウト
                </Button>
            </div>
            {(user.permissions === 50 || user.permissions === 0) && (
                <div className="mt-2">
                    {!isCheckIn ? (
                        <Button type="primary" onClick={handleCheckIn}>
                            出勤
                        </Button>
                    ) : (
                        <Button disabled>出勤済み</Button>
                    )}
                </div>
            )}
            <ChangePassword
                setChangePassword={setChangePasswordVisible}
                changePasswordVisible={changePasswordVisible}
            />
        </div>
    );
};

export default UserInfoEmp;
