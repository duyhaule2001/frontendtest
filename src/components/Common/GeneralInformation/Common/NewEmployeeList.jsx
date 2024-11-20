import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd';
import React, { useState } from 'react';
import NewEmployeeInformation from '../../NewEmployeeInformation/NewEmployeeInformation';

const NewEmployeeList = ({ newEmployee }) => {
    const [openModal, setOpenModal] = useState(false);
    const columns = [
        {
            title: '氏名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '得意言語',
            dataIndex: 'program_language',
            key: 'program_language',
            align: 'center',
        },
    ];

    // add key with index
    const dataWithKey = newEmployee.map((employee, index) => ({
        ...employee,
        key: index,
    }));

    return (
        <>
            <div className="mb-3 flex items-center justify-end">
                <Button type="primary" onClick={() => setOpenModal(true)}>
                    新入社員リスト
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
                <NewEmployeeInformation viewModal={true} />
            </Modal>
        </>
    );
};

export default NewEmployeeList;
