import React, { useEffect, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, List, Modal, notification } from 'antd';
import {
    getGrantedUserList,
    revokeViewPermissionApi,
    searchUsersNoGrantedByName,
    setGrantViewPermissionApi,
} from '../../../services/sale.service';

const GrantViewPermission = ({ grantPermissionModal, setGrantPermissionModal }) => {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [grantedUsers, setGrantedUsers] = useState([]);
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

    useEffect(() => {
        if (grantPermissionModal) {
            fetchGrantedUsers();
        }
    }, [grantPermissionModal]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 750);
        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    useEffect(() => {
        if (debouncedSearchValue) {
            handleSearch(debouncedSearchValue);
        }
    }, [debouncedSearchValue]);

    const handleSearch = async (name) => {
        try {
            const res = await searchUsersNoGrantedByName(name);
            if (res.data && Array.isArray(res.data)) setUsers(res.data);
        } catch (error) {
            console.error('Failed to search users:', error);
        }
    };

    const fetchGrantedUsers = async () => {
        try {
            const res = await getGrantedUserList();
            if (res.data && Array.isArray(res.data)) setGrantedUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch granted users:', error);
        }
    };

    const handleGrantPermission = async (userId) => {
        try {
            const res = await setGrantViewPermissionApi(userId);
            if (res.data) {
                notification.success({
                    message: '権限付与登録が成功しました。',
                    style: {
                        width: 320,
                    },
                });
                fetchGrantedUsers();
            } else {
                notification.error({
                    message: res.error,
                });
            }
        } catch (error) {
            console.error('Failed to grant permission:', error);
        }
    };

    const handleRevokePermission = async (userId) => {
        try {
            const res = await revokeViewPermissionApi(userId);
            if (res.data) {
                notification.success({
                    message: '権限削除が成功しました。',
                    style: {
                        width: 290,
                    },
                });
                fetchGrantedUsers();
            }
        } catch (error) {
            notification.error({
                message: '削除が失敗しました。',
            });
            console.error('Failed to revoke permission:', error);
        }
    };

    const handleCloseModal = () => {
        setSearchValue('');
        setUsers([]);
        setGrantPermissionModal(false);
    };

    //ユーザーのリストをフィルタリングして、権限を付与されているユーザーを削除する
    const filteredUsers = users.filter((user) => !grantedUsers.some((grantedUser) => grantedUser.id === user.id));

    return (
        <Modal title="権限付与" open={grantPermissionModal} onCancel={handleCloseModal} footer={null}>
            <Input
                placeholder="社員名検索"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ marginBottom: '16px' }}
            />
            {searchValue.trim() && (
                <List
                    bordered
                    dataSource={filteredUsers}
                    renderItem={(user) => (
                        <List.Item
                            actions={[
                                <PlusOutlined
                                    className="text-blue-500"
                                    onClick={() => handleGrantPermission(user.id)}
                                />,
                            ]}
                        >
                            {user.name}
                        </List.Item>
                    )}
                    style={{ marginBottom: '16px', maxHeight: '150px', overflowY: 'scroll' }}
                />
            )}

            <List
                header={<div className="font-semibold">権限が付与されている社員</div>}
                bordered
                dataSource={grantedUsers}
                renderItem={(user) => (
                    <List.Item
                        actions={[
                            <DeleteOutlined className="text-red-500" onClick={() => handleRevokePermission(user.id)} />,
                        ]}
                    >
                        {user.name}
                    </List.Item>
                )}
                style={{ maxHeight: '300px', overflowY: 'scroll' }}
            />
        </Modal>
    );
};

export default GrantViewPermission;
