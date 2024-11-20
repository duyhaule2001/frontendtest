import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd';
import React, { useState } from 'react';
import RetirementTable from '../../RetirementManagement/RetirementTable';

const RetirementInfo = ({ retirementInfo, showButton = true }) => {
    const [openModal, setOpenModal] = useState(false);
    const columns = [
        {
            title: '氏名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '社員番号',
            dataIndex: 'emp_no',
            key: 'emp_no',
            align: 'center',
        },
    ];
    return (
        <>
            {showButton && (
                <div className="mb-3 flex items-center justify-end">
                    <Button type="primary" onClick={() => setOpenModal(true)}>
                        退職リスト
                        <EyeOutlined />
                    </Button>
                </div>
            )}
            <Table dataSource={retirementInfo} columns={columns} pagination bordered rowKey="emp_no" />
            <Modal
                open={openModal}
                onCancel={() => setOpenModal(false)}
                maskClosable={true}
                width={'80vw'}
                footer={false}
                className="-mt-9"
            >
                <RetirementTable viewTitle={true} />
            </Modal>
        </>
    );
};

export default RetirementInfo;
