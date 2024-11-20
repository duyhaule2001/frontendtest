import React, { useState } from 'react';
import { Button, Modal, notification } from 'antd';
import { recommenDationsApi } from '../../../services/employee.service';

const Recommendations = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        const res = await recommenDationsApi();
        if (res.data) {
            notification.success({
                message: '推薦が完了しました。',
            });
            setIsModalVisible(false);
        } else {
            notification.error({
                message: 'エラー',
                description: '操作中に問題が発生しました。',
            });
        }
    };

    return (
        <div className="flex items-center -mt-24 justify-center h-screen">
            <div className="text-center">
                <span className="text-xl font-bold italic text-gray-800 mb-4 block">
                    推薦したい方がいらっしゃいましたら、以下のボタンをクリックしていただき、
                    <br />
                    総務からのご連絡をお待ちください。
                </span>
                <Button type="primary" onClick={showModal}>
                    推薦する
                </Button>
            </div>
            <Modal
                title="推薦確認"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText="はい"
                cancelText="キャンセル"
            >
                <p>推薦したい方がいらっしゃいますか？</p>
            </Modal>
        </div>
    );
};

export default Recommendations;
