import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd';
import React, { useState } from 'react';
import WaitingStatus from '../../../GeneralAffairs/WaitingStatus';

const WaitingList = ({ waitingList }) => {
    const [openModal, setOpenModal] = useState(false);
    const columns = [
        {
            title: '氏名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '待機開始日',
            dataIndex: 'exit_date',
            key: 'exit_date',
            align: 'center',
        },
    ];

    // add key with index
    const dataWithKey = waitingList.map((employee, index) => ({
        ...employee,
        key: index,
    }));

    return (
        <>
            <div className="mb-3 flex items-center justify-end">
                <Button type="primary" onClick={() => setOpenModal(true)}>
                    待機リスト
                    <EyeOutlined />
                </Button>
            </div>
            <Table dataSource={dataWithKey} columns={columns} pagination bordered />
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                maskClosable={true}
                width={'80vw'}
                footer={false}
                className="-mt-9"
            >
                <WaitingStatus />
            </Modal>
        </>
    );
};

export default WaitingList;
