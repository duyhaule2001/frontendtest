import React, { useEffect, useState } from 'react';
import { Button, Drawer, notification, Popconfirm, Table } from 'antd';
import { getAllParticipationActivate, removeParticipant } from '../../../services/hr.service';
import { DeleteOutlined } from '@ant-design/icons';
import RegisterParticipants from './RegisterParticipants';
import dayjs from 'dayjs';

const ListParticipationActivate = ({ showList, setShowList, selectActivate }) => {
    const [participants, setParticipants] = useState([]);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [total, setTotal] = useState();

    useEffect(() => {
        if (selectActivate) {
            fetchParticipants();
        }
    }, [selectActivate]);

    const fetchParticipants = async () => {
        try {
            const res = await getAllParticipationActivate(selectActivate.id);
            if (res.data) {
                setTotal(res.data.total);
                setParticipants(res.data.listParticipants);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (record) => {
        try {
            const res = await removeParticipant(record.id);
            if (res.data) {
                fetchParticipants();
                notification.success({
                    message: '削除が成功しました。',
                    style: { width: 270 },
                });
            } else {
                notification.error({
                    message: '削除が失敗しました。',
                    style: { width: 270 },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: '',
            key: 'no',
            render: (text, record, index) => index + 1,
            width: '10%',
        },
        {
            title: '社員番号',
            dataIndex: 'emp_no',
            key: 'emp_no',
            width: '30%',
        },
        {
            title: '氏名',
            dataIndex: 'name',
            key: 'name',
            width: '50%',
        },
        {
            title: '',
            key: 'action',
            width: '10%',
            render: (record) => (
                <Popconfirm
                    title="確認"
                    description={`${record.name} を削除してもよろしいですか？`}
                    okText="削除"
                    cancelText="キャンセル"
                    onConfirm={() => handleDelete(record)}
                >
                    <DeleteOutlined className="text-red-500" />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Drawer
            title={
                <div className="flex justify-between">
                    <span>参加者リスト</span>
                    {selectActivate?.date &&
                        (dayjs(selectActivate.date).isSame(dayjs(), 'day') ||
                            dayjs(selectActivate.date).isAfter(dayjs(), 'day')) && (
                            <Button onClick={() => setRegisterOpen(true)}>申込</Button>
                        )}
                </div>
            }
            placement="right"
            onClose={() => setShowList(false)}
            open={showList}
            width={'40%'}
        >
            <div className="mb-3 flex">
                <span>参加者数の合計: {total}</span>
            </div>
            <Table
                columns={columns}
                dataSource={participants}
                rowKey="id"
                locale={{ emptyText: '参加者がいません。' }}
                pagination={false}
            />
            <RegisterParticipants
                registerOpen={registerOpen}
                setRegisterOpen={setRegisterOpen}
                selectActivate={selectActivate}
                fetchParticipants={fetchParticipants}
            />
        </Drawer>
    );
};

export default ListParticipationActivate;
