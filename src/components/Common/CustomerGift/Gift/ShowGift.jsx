import { Descriptions, Drawer } from 'antd';
import React from 'react';

const ShowGift = ({ showGiftOpen, setShowGiftOpen, giftData }) => {
    const items = [
        {
            key: '1',
            label: '部署名1',
            children: giftData?.departmentNameOne || '',
        },
        {
            key: '2',
            label: '部署名2',
            children: giftData?.departmentNameTwo || '',
        },
        {
            key: '3',
            label: '役職',
            children: giftData?.jobTitle || '',
        },
        {
            key: '4',
            label: '〒',
            children: giftData?.postcode || '',
        },
        {
            key: '5',
            label: '住所',
            children: giftData?.address || '',
        },
    ];
    return (
        <Drawer width={'50%'} title="詳細情報" onClose={() => setShowGiftOpen(false)} open={showGiftOpen}>
            <Descriptions bordered items={items} column={1} size="default" />
        </Drawer>
    );
};

export default ShowGift;
