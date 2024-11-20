import React, { useEffect, useState } from 'react';
import TitleCus from '../Layout/TitleCus';
import { Button, notification, Popconfirm, Select, Table } from 'antd';
import SearchInputCus from '../Layout/Input/SearchInputCus';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getRetirement, updateRetirementApproval } from '../../../services/api.service';
import { useSelector } from 'react-redux';

const RetirementApproval = () => {
    const [listRetirement, setListRetirement] = useState([]);
    const [filteredRetirement, setFilteredRetirement] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState('内勤');
    const [options, setOptions] = useState([]);
    const currentRole = useSelector((state) => state.account.user.managerial_position);

    useEffect(() => {
        fetchListRetirement(selectedType);
    }, [selectedType]);

    const fetchListRetirement = async (selectedType) => {
        setLoading(true);
        try {
            const res = await getRetirement(selectedType);
            if (res.data && Array.isArray(res.data)) {
                let sortedData = res.data;
                if (currentRole === '社長') {
                    sortedData = res.data.sort((a, b) => {
                        return a.president_approval === b.president_approval ? 0 : a.president_approval ? 1 : -1;
                    });
                }
                if (currentRole === '部長') {
                    sortedData = res.data.sort((a, b) => {
                        return a.manager_approval === b.manager_approval ? 0 : a.manager_approval ? 1 : -1;
                    });
                }
                setListRetirement(sortedData);
                setFilteredRetirement(sortedData);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try {
            const res = await updateRetirementApproval(id);
            if (res && res.data) {
                notification.success({
                    message: '承認が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchListRetirement(selectedType);
            } else {
                notification.error({
                    message: '承認に失敗しました。',
                    style: {
                        width: 270,
                    },
                });
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
            title: '',
            dataIndex: 'approval',
            align: 'center',
            width: 60,
            render: (text, record) => {
                if (currentRole === '社長') {
                    return record.president_approval ? (
                        <></>
                    ) : (
                        <Popconfirm
                            title="確認"
                            okText="承認"
                            cancelText="キャンセル"
                            placement="bottomRight"
                            description="この退職を承認してもよろしいですか？"
                            onConfirm={() => handleApprove(record.id)}
                        >
                            <Button type="primary">承認</Button>
                        </Popconfirm>
                    );
                }

                if (currentRole === '部長') {
                    return record.manager_approval ? (
                        <></>
                    ) : (
                        <Popconfirm
                            title="確認"
                            okText="承認"
                            cancelText="キャンセル"
                            placement="bottomRight"
                            description="この退職を承認してもよろしいですか？"
                            onConfirm={() => handleApprove(record.id)}
                        >
                            <Button type="primary">承認</Button>
                        </Popconfirm>
                    );
                }

                return null;
            },
        },
    ];
    return (
        <>
            <TitleCus title="退職承認" />
            <div className="p-10">
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
                    <div className="flex items-center justify-between">
                        <SearchInputCus
                            placeholder="お名前を入力してください"
                            handleSearch={handleSearch}
                            options={options}
                            onSearch={handleOnSearch}
                        />
                        <Button type="primary">
                            <ReloadOutlined onClick={handleClear} />
                        </Button>
                    </div>
                </div>
                <Table
                    dataSource={filteredRetirement}
                    columns={columns}
                    pagination={{ pageSize: 30 }}
                    loading={loading}
                    rowKey="id"
                />
            </div>
        </>
    );
};

export default RetirementApproval;
