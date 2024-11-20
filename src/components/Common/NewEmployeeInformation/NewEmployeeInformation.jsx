import { Button, DatePicker, notification, Popconfirm, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import CreateNewEmployee from './CreateNewEmployee';
import UpdateEmployee from './UpdateEmployee';
import TitleCus from '../Layout/TitleCus';
import { getNewEmployee, deleteNewEmployee } from '../../../services/common.service';

const NewEmployeeInformation = ({ canModify, viewModal = false }) => {
    const [listEmployee, setListEmployee] = useState([]);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [updateUser, setUpdateUser] = useState(null);

    const [selectedDate, setSelectedDate] = useState(dayjs());

    useEffect(() => {
        fetchEmployee(selectedDate);
    }, [selectedDate]);

    const fetchEmployee = async (selectedDate) => {
        try {
            const res = await getNewEmployee(dayjs(selectedDate).format('YYYY-MM'));
            if (res.data) {
                const sortedData = res.data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
                setListEmployee(sortedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteNewEmployee(id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchEmployee(selectedDate);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const columns = [
        {
            title: <span className="whitespace-nowrap">社員番号</span>,
            align: 'center',
            dataIndex: 'number',
        },
        {
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'name',
            width: 100,
        },
        {
            title: <span className="flex items-center justify-center">フリガナ</span>,
            dataIndex: 'furigana',
            width: 100,
        },
        {
            title: '性別',
            dataIndex: 'gender',
            width: 60,
            render: (text) => (text === true ? '男' : text === false ? '女' : 'その他'),
            align: 'center',
        },
        {
            title: '年齢',
            width: 60,
            dataIndex: 'age',
            align: 'center',
        },
        {
            title: '国籍',
            dataIndex: 'nationality',
            align: 'center',
        },
        {
            title: (
                <span className="whitespace-nowrap">
                    スキル
                    <br />
                    シート
                </span>
            ),
            dataIndex: 'skill_sheet',
            render: (text) => {
                if (text === true) {
                    return '有';
                } else if (text === false) {
                    return '無';
                } else {
                    return '';
                }
            },
            align: 'center',
        },
        {
            title: (
                <span>
                    経験
                    <br />
                    年数
                </span>
            ),
            width: 70,
            dataIndex: 'years_of_experience',
            align: 'center',
            render: (text) => <span>{text ? `${text}年` : ''}</span>,
        },
        {
            title: (
                <span>
                    稼働
                    <br />
                    開始日
                </span>
            ),
            dataIndex: 'start_date',
            width: 115,
            align: 'center',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: (
                <span>
                    得意
                    <br />
                    言語
                </span>
            ),
            align: 'center',
            dataIndex: 'preferred_language',
        },
        {
            title: '所属',
            align: 'center',
            dataIndex: 'affiliation',
        },
        {
            title: (
                <span>
                    採用
                    <br />
                    形式
                </span>
            ),
            dataIndex: 'employment_type',
            render: (text) => {
                if (text === true) {
                    return '新卒';
                } else if (text === false) {
                    return '中途';
                } else {
                    return '';
                }
            },
            align: 'center',
        },

        ...(canModify
            ? [
                  {
                      title: '仕入れ',
                      align: 'center',
                      dataIndex: 'procurement',
                      render: (value) =>
                          new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value),
                  },
                  {
                      title: '',
                      align: 'center',
                      render: (record) => {
                          return (
                              <div className="flex space-x-3">
                                  <EditOutlined
                                      onClick={() => {
                                          setOpenUpdateModal(true);
                                          setUpdateUser(record);
                                      }}
                                      className="text-blue-700"
                                  />
                                  <Popconfirm
                                      title="確認"
                                      description={`${record.name} を削除してもよろしいですか？`}
                                      okText="削除"
                                      cancelText="キャンセル"
                                      placement="leftTop"
                                      onConfirm={() => handleDelete(record.id)}
                                  >
                                      <DeleteOutlined className="text-red-500" />
                                  </Popconfirm>
                              </div>
                          );
                      },
                  },
              ]
            : []),
    ];
    return (
        <>
            {!viewModal && <TitleCus title={'新入社員情報'} />}
            <div className="p-10">
                <div className="mb-3 flex justify-between space-x-3">
                    <DatePicker picker="month" onChange={handleDateChange} value={selectedDate} />
                    {canModify && (
                        <>
                            <Button onClick={() => setOpenModalCreate(true)} type="primary">
                                <PlusOutlined />
                                新規登録
                            </Button>
                        </>
                    )}
                </div>

                <Table
                    dataSource={listEmployee}
                    columns={columns}
                    rowKey={'id'}
                    locale={{
                        emptyText: 'データがありません。',
                    }}
                />
                {canModify && (
                    <>
                        <CreateNewEmployee
                            openModalCreate={openModalCreate}
                            setOpenModalCreate={setOpenModalCreate}
                            fetchEmployee={fetchEmployee}
                            selectedDate={selectedDate}
                        />
                        <UpdateEmployee
                            openUpdateModal={openUpdateModal}
                            setOpenUpdateModal={setOpenUpdateModal}
                            updateUser={updateUser}
                            fetchEmployee={fetchEmployee}
                            selectedDate={selectedDate}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default NewEmployeeInformation;
