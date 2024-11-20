import React from 'react';
import { Descriptions, Drawer } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const ViewOnsiteInfo = ({ setOpenViewModal, openViewModal, selectedView }) => {
    const items = [
        {
            key: '1',
            label: '社員番号',
            children: selectedView?.number || 'N/A',
        },
        {
            key: '2',
            label: '技術者名',
            children: selectedView?.technicianName || 'N/A',
        },
        {
            key: '3',
            label: '入場日',
            children: selectedView?.admissionDate || 'N/A',
        },
        {
            key: '4',
            label: '案件名',
            children: selectedView?.projectName || 'N/A',
        },
        {
            key: '5',
            label: '上位顧客名',
            children: selectedView?.customerNames || 'N/A',
        },
        {
            key: '6',
            label: '書類確認担当',
            children: selectedView?.docVeriOfficer || 'N/A',
        },
        {
            key: '7',
            label: '入場担当',
            children: selectedView?.admissionOfficer || 'N/A',
        },
        {
            key: '8',
            label: '単価(月/H)',
            children: selectedView?.unitPrice || 'N/A',
        },
        {
            key: '9',
            label: '精算(140~200)H',
            children: selectedView?.payOff || 'N/A',
        },
        {
            key: '10',
            label: '作業報告書',
            children: selectedView?.workingReport || 'N/A',
        },
        {
            key: '11',
            label: '注文番号',
            children: selectedView?.orderNumber || 'N/A',
        },
        {
            key: '12',
            label: '注文日',
            children: selectedView?.orderDate || 'N/A',
        },
        {
            key: '13',
            label: '周報／月報',
            children: selectedView?.weeklyOrMonthlyReport === 1 ? '周報' : '月報',
        },
        {
            key: '14',
            label: 'システム処理期限日',
            children: selectedView?.systemProcessingDeadline || 'N/A',
        },
        {
            key: '15',
            label: '備考',
            children: selectedView?.other || 'N/A',
        },
        {
            key: '17',
            label: '見積書依頼',
            children: selectedView?.requestQuote ? '有' : '無',
        },
        {
            key: '18',
            label: '注文請書/見積書',
            children: selectedView?.orderConfirm ? '有' : '無',
        },
        {
            key: '16',
            label: '処理完了',
            children: selectedView?.processingComplete ? <CheckCircleOutlined /> : <CloseCircleOutlined />,
        },
    ];

    return (
        <Drawer width={'50%'} title="詳細情報" onClose={() => setOpenViewModal(false)} open={openViewModal}>
            <Descriptions bordered items={items} column={1} size="default" />
        </Drawer>
    );
};

export default ViewOnsiteInfo;
