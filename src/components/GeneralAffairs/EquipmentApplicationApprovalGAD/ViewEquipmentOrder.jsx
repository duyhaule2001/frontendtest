import React from 'react';
import { Descriptions, Drawer } from 'antd';
import dayjs from 'dayjs';

const ViewEquipmentOrder = ({ setOpenViewModal, openViewModal, selectedOrder }) => {
    const items = [
        {
            key: '1',
            label: '申請日',
            children: dayjs(selectedOrder?.createdDate).format('YYYY-MM-DD') || '',
        },
        {
            key: '2',
            label: '申請備品',
            children: selectedOrder?.equipmentName || '',
        },
        {
            key: '3',
            label: '数量',
            children: selectedOrder?.quantity || '',
        },
        {
            key: '4',
            label: '単位',
            children: selectedOrder?.unit || '',
        },
        {
            key: '5',
            label: '申請者名',
            children: selectedOrder?.applicantName || '',
        },
        {
            key: '6',
            label: '部署名',
            children: selectedOrder?.department || '',
        },
        {
            key: '7',
            label: '利用者',
            children: selectedOrder?.userName || '',
        },
        {
            key: '8',
            label: '価格',
            children: selectedOrder?.price || '',
        },
        {
            key: '9',
            label: '目的',
            children: selectedOrder?.purpose || '',
        },
        {
            key: '10',
            label: '備考',
            children: selectedOrder?.note || '',
        },
        {
            key: '11',
            label: '承認',
            children: selectedOrder?.approverStatus ? '承認済み' : '未承認',
        },
        {
            key: '12',
            label: '承認者名',
            children: selectedOrder?.approverName || '',
        },
        {
            key: '13',
            label: '注文',
            children: selectedOrder?.orderStatus ? '注文済み' : '未注文',
        },
        {
            key: '14',
            label: '注文者名',
            children: selectedOrder?.orderName || '',
        },
        {
            key: '15',
            label: '到着',
            children: selectedOrder?.deliveryStatus ? '到着済み' : '未到着',
        },
        {
            key: '16',
            label: '到着者名',
            children: selectedOrder?.deliveryName || '',
        },
    ];

    return (
        <Drawer width={'50%'} title="申請備品の詳細情報" onClose={() => setOpenViewModal(false)} open={openViewModal}>
            <Descriptions bordered items={items} column={1} size="default" />
        </Drawer>
    );
};

export default ViewEquipmentOrder;
