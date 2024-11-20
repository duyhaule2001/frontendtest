import React, { useState, useEffect } from 'react';
import { Button, notification, Popconfirm, Popover, Table } from 'antd';
import TitleCus from '../../Common/Layout/TitleCus';
import SearchInputCus from '../../Common/Layout/Input/SearchInputCus';
import CreateParticipationStatus from './CreateParticipationStatus';
import UpdateParticipationStatus from './UpdateParticipationStatus';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import {
    deleteParticipationStatus,
    getAllParticipationStatus,
    getParticipationStatusByName,
    getSugParticipationStatusByName,
} from '../../../services/sale.service';
import GrantViewPermission from './GrantViewPermission';
import { useSelector } from 'react-redux';

const ParticipationsStatus = () => {
    const user = useSelector((state) => state.account.user);
    const [data, setData] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedData, setSelectedData] = useState();
    const [grantPermissionModal, setGrantPermissionModal] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllParticipationStatus();
            if (res?.data && Array.isArray(res.data)) {
                setData(res.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDelete = async (deleteId) => {
        try {
            const res = await deleteParticipationStatus(deleteId);
            if (res.data) {
                fetchData();
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            } else {
                notification.error({
                    message: '削除が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async (name) => {
        try {
            const res = await getParticipationStatusByName(name);
            if (res?.data) {
                setData(res.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [options, setOptions] = useState([]);
    const onSearch = async (searchText) => {
        if (!searchText) {
            setOptions([]);
            return;
        }
        const res = await getSugParticipationStatusByName(searchText);
        if (res.data) {
            setOptions(
                res.data.map((item) => ({
                    value: item.name,
                })),
            );
        } else {
            console.log('データが取得できません。');
            setOptions([]);
        }
    };
    const calculateAverageScore = (record) => {
        const scores = [record.attendant, record.workAttitude, record.performance, record.leadership, record.other];

        const validScores = scores.filter((score) => typeof score === 'number');
        const sum = validScores.reduce((acc, score) => acc + score, 0);
        const average = validScores.length > 0 ? sum / validScores.length : 0;

        return average.toFixed(1);
    };

    const formatSalesEvaluation = (record) => {
        const averageScore = calculateAverageScore(record);
        const result = [];

        if (record.createdName) {
            result.push(
                <div key="createdName">
                    営業担当: {record.createdName} 点数:{' '}
                    <span className={averageScore > 5 ? 'text-green-500' : 'text-red-500'}>{averageScore}</span>
                </div>,
            );
        }

        if (record.attendant) {
            result.push(
                <div key="attendant">
                    勤怠: {record.attendant}
                    {record.attendantComment && ` (${record.attendantComment})`}
                </div>,
            );
        }

        if (record.workAttitude) {
            result.push(
                <div key="workAttitude">
                    作業態度: {record.workAttitude}
                    {record.workAttitudeComment && ` (${record.workAttitudeComment})`}
                </div>,
            );
        }

        if (record.performance) {
            result.push(
                <div key="performance">
                    パフォーマンス: {record.performance}
                    {record.performanceComment && ` (${record.performanceComment})`}
                </div>,
            );
        }

        if (record.leadership) {
            result.push(
                <div key="leadership">
                    リーダーシップ: {record.leadership}
                    {record.leadershipComment && ` (${record.leadershipComment})`}
                </div>,
            );
        }

        if (record.other) {
            result.push(
                <div key="other">
                    その他: {record.other}
                    {record.otherComment && ` (${record.otherComment})`}
                </div>,
            );
        }

        return result.length > 0 ? <div>{result}</div> : null;
    };

    const columns = [
        {
            title: <span className="flex items-center justify-center">稼働要員氏名</span>,
            fixed: 'left',
            dataIndex: 'name',
            width: 130,
        },
        {
            title: '営業番号',
            align: 'center',
            fixed: 'left',
            dataIndex: 'salesNumber',
            width: 130,
        },
        {
            title: '所属種別',
            align: 'center',
            dataIndex: 'affiliationType',
            width: 100,
        },
        {
            title: '所属',
            align: 'center',
            dataIndex: 'affiliation',
            width: 130,
        },
        {
            title: <span className="flex items-center justify-center">参画時期</span>,
            dataIndex: 'participationPeriod',
            width: 125,
        },
        {
            title: '退場予定',
            align: 'center',
            dataIndex: 'exitSchedule',
            width: 125,
        },
        {
            title: <span className="flex items-center justify-center">プロジェクト詳細、対応部分</span>,
            dataIndex: 'projectDetails',
            width: 250,
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
        },
        {
            title: (
                <Popover
                    content={
                        <div className="flex items-center justify-center">
                            商流（←の方向）
                            <br />
                            上位：X社（ユーザー←A社Sier←B社←C社）
                            <br />
                            自社以下：無し（有の場合は社名）
                        </div>
                    }
                    className="flex items-center justify-center"
                >
                    <span style={{ cursor: 'pointer' }}>商流</span>
                </Popover>
            ),
            dataIndex: 'businessFlow',
            width: 250,
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
        },
        {
            title: '提案単価',
            align: 'center',
            dataIndex: 'proposedUnitPrice',
            width: 130,
        },
        {
            title: <span className="flex items-center justify-center">お客様評価</span>,
            dataIndex: 'customerEvaluation',
            width: 300,
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
        },
        {
            title: (
                <Popover
                    content={
                        <>
                            担当営業評価（10点満点）
                            <br />
                            ・勤怠
                            <br />
                            ・作業態度
                            <br />
                            ・パフォーマンス
                            <br />
                            ・リーダーシップ
                            <br />
                            ・そのほか
                        </>
                    }
                    className="flex items-center justify-center"
                >
                    担当営業評価
                </Popover>
            ),
            dataIndex: 'salesEvaluation',
            width: 250,
            render: (text, record) => <div style={{ whiteSpace: 'pre-wrap' }}>{formatSalesEvaluation(record)}</div>,
        },
        {
            title: <span className="flex items-center justify-center">記入日期</span>,
            dataIndex: 'entryDate',
            width: 150,
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
        },
        {
            title: <span className="flex items-center justify-center">備考</span>,
            dataIndex: 'remarks',
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
            width: 250,
        },
        {
            title: '',
            align: 'center',
            key: 'action',
            fixed: 'right',
            render: (record) => {
                return (
                    <div className="flex space-x-3">
                        {user.emp_no === record.createdEmpNo && (
                            <>
                                <EditOutlined
                                    onClick={() => {
                                        setOpenUpdateModal(true);
                                        setSelectedData(record);
                                    }}
                                    className="text-blue-700"
                                />
                                <Popconfirm
                                    title="確認"
                                    placement="bottomRight"
                                    description={`${record.name} を削除してもよろしいですか？`}
                                    okText="削除"
                                    cancelText="キャンセル"
                                    onConfirm={() => handleDelete(record.id)}
                                >
                                    <DeleteOutlined className="text-red-500" />
                                </Popconfirm>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];
    return (
        <div>
            <TitleCus title={'要員参画状況'} />
            <div className="p-10">
                <div className="flex justify-between">
                    <span>
                        <SearchInputCus
                            placeholder={'技術者名を入力してください'}
                            handleSearch={handleSearch}
                            onSearch={onSearch}
                            options={options}
                        />
                    </span>
                    <span className="space-x-1">
                        {user.managerial_position == '社長' && (
                            <Button type="primary" onClick={() => setGrantPermissionModal(true)}>
                                <SettingOutlined />
                                権限付与
                            </Button>
                        )}
                        <Button type="primary" onClick={() => setOpenCreateModal(true)}>
                            <PlusOutlined />
                            新規登録
                        </Button>
                        <Button type="primary">
                            <ReloadOutlined onClick={() => fetchData()} />
                        </Button>
                    </span>
                </div>
                <Table
                    rowKey={'id'}
                    columns={columns}
                    dataSource={data}
                    scroll={{ x: 'max-content' }}
                    size="small"
                    loading={loading}
                />
            </div>
            <CreateParticipationStatus
                setOpenCreateModal={setOpenCreateModal}
                fetchData={fetchData}
                openCreateModal={openCreateModal}
            />
            <UpdateParticipationStatus
                setOpenUpdateModal={setOpenUpdateModal}
                fetchData={fetchData}
                openUpdateModal={openUpdateModal}
                selectedData={selectedData}
            />
            <GrantViewPermission
                grantPermissionModal={grantPermissionModal}
                setGrantPermissionModal={setGrantPermissionModal}
            />
        </div>
    );
};

export default ParticipationsStatus;
