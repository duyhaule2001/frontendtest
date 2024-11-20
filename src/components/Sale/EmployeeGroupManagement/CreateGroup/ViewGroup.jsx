import React, { useEffect, useState } from 'react';
import TitleCus from '../../../Common/Layout/TitleCus';
import { Card, Button, Avatar, Divider, notification, Popconfirm, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import UpdateGroup from './UpdateGroup';
import { getGroupList, deleteGroupList } from '../../../../services/sale.service';
import CreateGroup from './CreateGroup';

const ViewGroup = () => {
    const [groupList, setGroupList] = useState([]);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [expandedGroup, setExpandedGroup] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await getGroupList();
            if (res.data) {
                setGroupList(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    // グループ削除
    const handleDelete = async (group_id) => {
        try {
            const res = await deleteGroupList(group_id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchGroups(); // データを再取得
            }
        } catch (error) {
            console.log(error);
        }
    };

    // グループをクリックした時にメンバーリストを開閉する処理
    const toggleGroupMembers = (groupId) => {
        // 既に開いているグループを閉じる、またはクリックされたグループを開く
        setExpandedGroup((prevGroupId) => (prevGroupId === groupId ? null : groupId));
    };

    return (
        <div className="min-h-screen">
            <TitleCus title={'グループ作成'} />
            <div className="mt-10 px-24">
                <div className="mb-5 flex justify-end">
                    <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                        グループ作成
                    </Button>
                </div>
                <Spin spinning={loading}>
                    <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4">
                        {groupList.map((group, index) => {
                            const isExpanded = expandedGroup === group.id; // 現在開いているグループかどうかを確認する
                            return (
                                <div key={index} className="group">
                                    <Card
                                        bordered={true}
                                        size="small"
                                        className="shadow-lg transition-shadow duration-300 hover:shadow-xl"
                                        actions={[
                                            <EditOutlined
                                                key="edit"
                                                onClick={() => {
                                                    setOpenModalUpdate(true);
                                                    setSelectedGroup(group);
                                                }}
                                                style={{ color: '#1e90ff' }}
                                            />,
                                            <Popconfirm
                                                placement="bottom"
                                                title="確認"
                                                okText="削除"
                                                cancelText="キャンセル"
                                                description={`${group.leader.username}グループを削除してもよろしいですか？`}
                                                onConfirm={() => handleDelete(group.group_id)}
                                            >
                                                <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} />
                                            </Popconfirm>,
                                            isExpanded ? (
                                                <UpOutlined key="up" onClick={() => toggleGroupMembers(group.id)} />
                                            ) : (
                                                <DownOutlined key="down" onClick={() => toggleGroupMembers(group.id)} />
                                            ),
                                        ]}
                                    >
                                        {/* リーダーを表示 */}
                                        <div className="flex items-center justify-center space-x-4">
                                            <Avatar size={'small'} src={group.leader.img_path} />
                                            <span className="text-lg font-medium text-gray-800">
                                                {group.leader.username}
                                            </span>
                                        </div>
                                        {/* グループが開いている場合、メンバーを表示 */}
                                        {isExpanded && (
                                            <>
                                                <Divider />
                                                {group.members.map((member, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className="flex items-center justify-start space-x-4">
                                                            <Avatar size="small" src={member.img_path} />
                                                            <span className="text-base text-gray-600">
                                                                {member.username}
                                                            </span>
                                                        </div>
                                                        {index !== group.members.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </>
                                        )}
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </Spin>
            </div>
            <CreateGroup
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchGroups={fetchGroups}
            />
            <UpdateGroup
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                selectedGroup={selectedGroup}
                fetchGroups={fetchGroups}
            />
        </div>
    );
};

export default ViewGroup;
