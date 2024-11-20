import React, { useEffect, useState } from 'react';

import { Table, Button, Popconfirm, notification, Popover } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import TechnicianUpdate from './TechnicianUpdate.jsx';
import { CreateTechnician } from './CreateTechnician.jsx';
import SearchInputCus from '../Layout/Input/SearchInputCus.jsx';
import TitleCus from '../Layout/TitleCus.jsx';
import {
    deleteTechnician,
    getTechnicianData,
    searchTechnician,
    suggestionTechnician,
} from '../../../services/common.service.js';

const WorkingList = ({ canModify }) => {
    const [technicianData, setTechnicianData] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const [openCreateModal, setOpenCreateModal] = useState(false);

    useEffect(() => {
        loadTechnicianData();
    }, []);

    const loadTechnicianData = async () => {
        setLoading(true);
        try {
            const res = await getTechnicianData();
            if (res.data) {
                setTechnicianData(res.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await deleteTechnician(id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                const updateData = technicianData.filter((item) => item.id !== id);
                setTechnicianData(updateData);
            } else {
                notification.error({
                    message: '削除が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const onSearchTechnician = async (textSearch) => {
        if (!textSearch) {
            setOptions([]);
            return;
        }
        try {
            const res = await suggestionTechnician(textSearch);
            if (res.data) {
                setOptions(
                    res.data.map((item) => ({
                        value: item.name,
                    })),
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async (name) => {
        try {
            const res = await searchTechnician(name);
            if (res.data) {
                setTechnicianData(res.data);
            } else {
                setTechnicianData([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'technician_name',
            width: 90,
        },
        {
            title: <span className="flex items-center justify-center">上位顧客</span>,
            dataIndex: 'customer_company_name',
        },
        {
            title: <span className="flex items-center justify-center">担当者名</span>,
            dataIndex: 'name_of_person_in_charge',

            width: 90,
        },

        {
            title: <span className="flex items-center justify-center whitespace-nowrap">プロジェクト名</span>,
            dataIndex: 'project_name',
        },

        {
            title: '契約形態',
            dataIndex: 'contract_related',
            align: 'center',
            width: 70,
        },
        {
            title: '入場日',
            align: 'center',
            dataIndex: 'admission_date',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: <span>正/個/BP</span>,
            align: 'center',
            width: 70,
            dataIndex: 'occupational_classification',
        },

        {
            title: <span>リリース予定</span>,
            dataIndex: 'release_schedule',
            align: 'center',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: <span>契約更新日</span>,
            dataIndex: 'contract_renewal_date',
            align: 'center',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: (
                <span>
                    人事
                    <br />
                    承認
                </span>
            ),
            align: 'center',
            dataIndex: 'personnel_confirm',
            width: 50,
            render: (text) =>
                text ? (
                    <CheckCircleOutlined className="text-green-500" />
                ) : (
                    <CloseCircleOutlined className="text-red-500" />
                ),
        },
        {
            title: '単価',
            align: 'center',
            dataIndex: 'unit_price',
        },
        {
            title: '人/月',
            dataIndex: 'person_month',
            align: 'center',
            render: (text) => {
                const value = parseFloat(text);
                return <span className={value < 1 ? 'font-bold text-red-500' : ''}>{text}</span>;
            },

            width: 50,
        },

        {
            title: (
                <span>
                    精算
                    <br />
                    範囲
                </span>
            ),
            dataIndex: 'calculation_range',
            align: 'center',
            width: 70,
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },

        {
            title: <span>精算月日</span>,
            align: 'center',
            dataIndex: 'settlement_date',
            render: (text) => <span className="whitespace-nowrap">{text}</span>,
        },
        {
            title: <span>入場担当</span>,
            align: 'center',
            dataIndex: 'admission_officer',
            width: 90,
        },

        {
            title: <span className="flex items-center justify-center">備考</span>,
            dataIndex: 'remarks',

            width: 50,
            ellipsis: true,
            render: (text) => (
                <Popover content={text} trigger="hover">
                    <span>{text}</span>
                </Popover>
            ),
        },
        ...(canModify
            ? [
                  {
                      title: '',
                      width: 65,
                      render: (_, record) => (
                          <div className="flex items-center justify-center space-x-3">
                              <EditOutlined
                                  onClick={() => {
                                      setOpenUpdate(true);
                                      setDataUpdate(record);
                                  }}
                                  className="text-blue-700"
                              />
                              <Popconfirm
                                  placement="bottomRight"
                                  title="確認"
                                  okText="削除"
                                  cancelText="キャンセル"
                                  description={`${record.technician_name}を削除してもよろしいですか？`}
                                  onConfirm={() => handleDelete(record.id)}
                              >
                                  <DeleteOutlined className="text-red-500" />
                              </Popconfirm>
                          </div>
                      ),
                      onHeaderCell: () => ({
                          style: { textAlign: 'center' },
                      }),
                  },
              ]
            : []),
    ];

    return (
        <div className="w-full">
            <TitleCus title={'稼働リスト'} />
            <div className="flex flex-col justify-center p-3">
                <div className="mt-5 p-3">
                    <div className="-mb-3 flex justify-between">
                        <SearchInputCus
                            placeholder={'氏名検索'}
                            options={options}
                            onSearch={onSearchTechnician}
                            handleSearch={handleSearch}
                        />
                        <div className="space-x-2">
                            {canModify && (
                                <Button onClick={() => setOpenCreateModal(true)} type="primary">
                                    <PlusOutlined />
                                    新規登録
                                </Button>
                            )}
                            <Button onClick={() => loadTechnicianData()} type="primary">
                                <ReloadOutlined />
                            </Button>
                        </div>
                    </div>
                    <Table
                        size="small"
                        rowKey={'id'}
                        columns={columns}
                        dataSource={technicianData}
                        loading={loading}
                        locale={{
                            emptyText: 'データがありません。',
                        }}
                    />
                </div>
                <TechnicianUpdate
                    setOpenUpdate={setOpenUpdate}
                    openUpdate={openUpdate}
                    dataUpdate={dataUpdate}
                    setDataUpdate={setDataUpdate}
                    loadTechnicianData={loadTechnicianData}
                />
                <CreateTechnician
                    setOpenCreateModal={setOpenCreateModal}
                    openCreateModal={openCreateModal}
                    loadTechnicianData={loadTechnicianData}
                />
            </div>
        </div>
    );
};

export default WorkingList;
