import React from 'react';
import { Descriptions, Drawer } from 'antd';

const ViewPc = ({ setOpenViewModal, openViewModal, selectedView }) => {
    const userClassificationMap = {
        1: '営業',
        2: '管理本部',
        3: '役員',
        4: '技術者',
    };

    const getUserClassificationLabel = (value) => {
        return userClassificationMap[value] || '';
    };

    const items = [
        {
            key: '1',
            label: '登録日付',
            children: selectedView?.date || '',
        },
        {
            key: '2',
            label: 'メールアドレス',
            children: selectedView?.mail || '',
        },
        {
            key: '3',
            label: '氏名',
            children: selectedView?.name || '',
        },
        {
            key: '4',
            label: '管理番号',
            children: selectedView?.pc_num || '',
        },
        {
            key: '5',
            label: '申請日',
            children: selectedView?.application_date || '',
        },
        {
            key: '6',
            label: '場所',
            children: selectedView?.location || '',
        },
        {
            key: '7',
            label: '使用者区分',
            children: getUserClassificationLabel(selectedView?.user_classification),
        },
        {
            key: '8',
            label: '使用者（担当営業',
            children: selectedView?.user_sale || '',
        },
        {
            key: '9',
            label: '前使用者（担当営業',
            children: selectedView?.before_user_sale || '',
        },
        {
            key: '10',
            label: '前使用者の返却日',
            children: selectedView?.return_date || '',
        },
        {
            key: '11',
            label: 'アカウント名',
            children: selectedView?.account || '',
        },
        {
            key: '12',
            label: 'PCパスワード',
            children: selectedView?.pc_password || '',
        },
        {
            key: '13',
            label: '管理者アカウント名',
            children: selectedView?.manager_account || '',
        },
        {
            key: '14',
            label: '管理者パスワード',
            children: selectedView?.manager_password || '',
        },
        {
            key: '15',
            label: '担当者',
            children: selectedView?.manager || '',
        },
        {
            key: '16',
            label: '備考',
            children: selectedView?.other === 'undefined' ? '' : selectedView?.other,
        },
        {
            key: '17',
            label: '本人確認',
            children: selectedView?.confirmation === 0 ? '未確認' : '確認済み',
        },
    ];

    return (
        <>
            <Drawer width={'50%'} title="詳細情報" onClose={() => setOpenViewModal(false)} open={openViewModal}>
                <Descriptions bordered items={items} column={1} size="default" />
            </Drawer>
        </>
    );
};

export default ViewPc;
