import { Button, notification, Popconfirm, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import TitleCus from '../../Common/Layout/TitleCus';
import { deleteMemberOfCourse, getMemberOfCourse } from '../../../services/common.service';
import PermissionSettings from './PermissionSettings';
import { DeleteOutlined } from '@ant-design/icons';

const DetailCourse = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [memberList, setMemberList] = useState([]);
    const [openModalSetting, setOpenModalSetting] = useState(false);
    const [teacherAccount, setTeacherAccount] = useState('');
    const [managementAccount, setManagementAccount] = useState('');
    const navigate = useNavigate();

    const location = useLocation();
    const { courseName } = location.state || {};

    useEffect(() => {
        fetchData(id);
    }, [id]);

    const fetchData = async (id) => {
        setLoading(true);
        try {
            const res = await getMemberOfCourse(id);
            if (res?.data) {
                setMemberList(res?.data.memberList);
                setTeacherAccount(res?.data.teacherAccount);
                setManagementAccount(res?.data.managementAccount);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDelete = async (memberId) => {
        const res = await deleteMemberOfCourse(memberId, id);
        if (res.data) {
            notification.success({
                message: '削除が成功しました。',
                style: {
                    width: 270,
                },
            });
            fetchData(id);
        } else {
            notification.error({
                message: '削除が失敗しました。',
                style: {
                    width: 270,
                },
            });
        }
    };

    const columns = [
        {
            title: <span className="flex items-center justify-center">氏名</span>,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '社員番号',
            dataIndex: 'emp_no',
            key: 'emp_no',
            align: 'center',
        },

        {
            title: '部門',
            dataIndex: 'department',
            key: 'department',
            align: 'center',
        },
        {
            title: '権限',
            dataIndex: 'permissions',
            key: 'permissions',
            align: 'center',
            render: (text) => (text === 6 ? '正社員' : '個人事業主'),
        },
        {
            title: '',
            align: 'center',
            width: 60,
            render: (record) => (
                <Popconfirm
                    title="確認"
                    placement="bottomRight"
                    description="削除してもよろしいですか？"
                    okText="削除"
                    cancelText="キャンセル"
                    onConfirm={() => handleDelete(record.id)}
                >
                    <DeleteOutlined className="text-red-500" />
                </Popconfirm>
            ),
        },
    ];
    return (
        <>
            <TitleCus title={courseName} />

            <div className="mt-10 px-16">
                <Button onClick={() => navigate('/president/internalTrainingAuthority')} className="mb-6">
                    前へ戻る
                </Button>
                <>
                    <div className="mb-2">
                        先生アカウント: <Tag color="#108ee9">{teacherAccount}</Tag>
                    </div>
                    <div className="mb-3 flex items-center justify-between">
                        <span>
                            管理者アカウント: <Tag color="#108ee9">{managementAccount}</Tag>
                        </span>
                        <Button onClick={() => setOpenModalSetting(true)} type="primary">
                            生徒追加
                        </Button>
                    </div>
                </>
                <Table dataSource={memberList} columns={columns} loading={loading} rowKey={'id'} />
                <PermissionSettings
                    openModalSetting={openModalSetting}
                    setOpenModalSetting={setOpenModalSetting}
                    courseId={id}
                    fetchData={fetchData}
                />
            </div>
        </>
    );
};

export default DetailCourse;
