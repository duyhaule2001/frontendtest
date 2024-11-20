import React, { useEffect, useState } from 'react';
import { Button, notification, Popconfirm, Select, Table } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import CreateRetirement from './CreateRetirement';
import UpdateRetirement from './UpdateRetirement';
import TitleCus from '../Layout/TitleCus';
import SearchInputCus from '../Layout/Input/SearchInputCus';
import { deleteRetirement, getRetirement, updateRetirementApproval } from '../../../services/api.service';
import { useSelector } from 'react-redux';

const RetirementTable = ({ viewTitle = false }) => {
    const [listRetirement, setListRetirement] = useState([]);
    const [filteredRetirement, setFilteredRetirement] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectedItemUpdate, setSelectedItemUpdate] = useState(null);
    const [selectedType, setSelectedType] = useState('内勤');
    const [options, setOptions] = useState([]);
    const user = useSelector((state) => state.account.user);

    useEffect(() => {
        fetchListRetirement(selectedType);
    }, [selectedType]);

    const fetchListRetirement = async (selectedType) => {
        setLoading(true);
        try {
            const res = await getRetirement(selectedType);
            if (res.data && Array.isArray(res.data)) {
                // データ準場整理
                const sortedData = res.data.sort((a, b) => {
                    const approvalA = (a.manager_approval ? 1 : 0) + (a.president_approval ? 1 : 0);
                    const approvalB = (b.manager_approval ? 1 : 0) + (b.president_approval ? 1 : 0);

                    return approvalA - approvalB;
                });

                setListRetirement(sortedData);
                setFilteredRetirement(sortedData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteRetirement(id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchListRetirement(selectedType);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // テーブルで名前を検索
    const handleSearch = (searchValue) => {
        if (!searchValue) {
            setFilteredRetirement(listRetirement);
            setOptions([]);
            return;
        }

        // 名前に基づいて filter
        const filteredOptions = listRetirement
            .filter((item) => item.username.toLowerCase().includes(searchValue.toLowerCase()))
            .map((item) => ({ value: item.username }));

        setOptions(filteredOptions);

        // テーブルにデータをアップデートする
        const filteredData = listRetirement.filter((item) =>
            item.username.toLowerCase().includes(searchValue.toLowerCase()),
        );

        setFilteredRetirement(filteredData);
    };

    //検索提案
    const handleOnSearch = (value) => {
        if (!value) {
            setOptions([]);
            return;
        }

        const filteredOptions = listRetirement
            .filter((item) => item.username.toLowerCase().includes(value.toLowerCase()))
            .map((item) => ({ value: item.username }));

        setOptions(filteredOptions);
    };

    const handleClear = () => {
        fetchListRetirement(selectedType);
    };

    const columns = [
        { title: '社員番号', align: 'center', dataIndex: 'emp_no' },
        { title: <span className="flex items-center justify-center">名前</span>, dataIndex: 'username', width: 130 },
        { title: <span className="flex items-center justify-center">メールアドレス</span>, dataIndex: 'mail' },
        { title: '雇用形態', dataIndex: 'contract_related', align: 'center' },
        { title: '退職日', dataIndex: 'retirement_date', width: 120, align: 'center' },
        { title: <span className="flex items-center justify-center">理由</span>, dataIndex: 'reason' },
        {
            title: '退職手続き',
            dataIndex: 'retirement_procedure',
            align: 'center',
            render: (text) =>
                text ? (
                    <CheckCircleOutlined className="text-green-500" />
                ) : (
                    <CloseCircleOutlined className="text-red-500" />
                ),
        },
        { title: '備考', dataIndex: 'other', align: 'center' },
        {
            title: '承認状態',
            children: [
                {
                    title: '社長',
                    dataIndex: 'president_approval',
                    align: 'center',
                    render: (approved) =>
                        approved ? (
                            <CheckCircleOutlined className="text-green-500" />
                        ) : (
                            <CloseCircleOutlined className="text-red-500" />
                        ),
                },
                {
                    title: '部長',
                    dataIndex: 'manager_approval',
                    align: 'center',
                    render: (approved) =>
                        approved ? (
                            <CheckCircleOutlined className="text-green-500" />
                        ) : (
                            <CloseCircleOutlined className="text-red-500" />
                        ),
                },
            ],
        },
    ];
    if (!viewTitle) {
        columns.push({
            title: '',
            render: (record) => (
                <div className="flex space-x-3">
                    {!record.president_approval && !record.manager_approval ? (
                        <EditOutlined
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setSelectedItemUpdate(record);
                            }}
                            className="text-blue-700"
                        />
                    ) : (
                        <EditOutlined className="text-gray-400" />
                    )}
                    <Popconfirm
                        title="確認"
                        okText="削除"
                        placement="bottom"
                        cancelText="キャンセル"
                        description={`${record.username}を削除してもよろしいですか？`}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <DeleteOutlined className="text-red-500" />
                    </Popconfirm>
                </div>
            ),
        });
    }

    return (
        <>
            {!viewTitle && <TitleCus title="退職リスト" />}
            <div className="p-10">
                <div className="mb-2">
                    <div className="space-y-2">
                        <Select
                            defaultValue={selectedType}
                            style={{ width: 140 }}
                            onChange={(value) => setSelectedType(value)}
                            options={[
                                { value: '内勤', label: '内勤' },
                                { value: '技術者OPEN系', label: '技術者OPEN系' },
                                { value: '技術者SAP', label: '技術者SAP' },
                            ]}
                        />
                        <SearchInputCus
                            placeholder="お名前を入力してください"
                            handleSearch={handleSearch}
                            options={options}
                            onSearch={handleOnSearch}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>{selectedType} リスト</span>
                        <div className="flex space-x-2">
                            <Button type="primary">
                                <ReloadOutlined onClick={handleClear} />
                            </Button>
                            {!viewTitle && (
                                <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                                    <PlusCircleOutlined />
                                    新規登録
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <Table
                    dataSource={filteredRetirement}
                    columns={columns}
                    pagination={{ pageSize: 30 }}
                    loading={loading}
                    rowKey="id"
                />

                <CreateRetirement
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchListRetirement={fetchListRetirement}
                    selectedType={selectedType}
                />

                <UpdateRetirement
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    selectedItemUpdate={selectedItemUpdate}
                    fetchListRetirement={fetchListRetirement}
                    selectedType={selectedType}
                />
            </div>
        </>
    );
};

export default RetirementTable;
