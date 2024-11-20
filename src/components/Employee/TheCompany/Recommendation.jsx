import React, { useState } from 'react';
import { Button, Modal, notification } from 'antd';

import { recommenDationsApi } from '../../../services/employee.service';
import TitleCus from '../../Common/Layout/TitleCus';

const Recommendation = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        const res = await recommenDationsApi();
        if (res.data) {
            notification.success({
                message: '登録が成功しました。',
                style: {
                    width: 270,
                },
            });
            setIsModalVisible(false);
        } else {
            notification.error({
                message: '登録が失敗しました。',
                style: {
                    width: 270,
                },
            });
        }
    };

    return (
        <>
            <TitleCus title={'プロジェクト増員数登録'} />
            <div className="mt-10 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="mb-4 block text-base font-bold italic leading-relaxed text-gray-800 sm:text-xs md:text-xl">
                        推薦したい方がいらっしゃいましたら、以下のボタンをクリックしていただき、
                        <br className="hidden sm:block" />
                        総務からのご連絡をお待ちください。
                    </span>
                    <Button type="primary" onClick={showModal} className="mt-4 sm:w-auto sm:px-8">
                        推薦する
                    </Button>
                </div>
                <Modal
                    title="推薦の確認"
                    maskClosable={false}
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={() => setIsModalVisible(false)}
                    okText="はい"
                    cancelText="キャンセル"
                    className="sm:max-w-sm"
                >
                    <p className="text-center">推薦したい方がいらっしゃいますか？</p>
                </Modal>
            </div>
        </>
    );
};

export default Recommendation;
