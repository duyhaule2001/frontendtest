import React, { useEffect, useState } from 'react';
import { Modal, Input, List, notification } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
    searchUsersByName,
    grantPermissionApi,
    revokePermission,
    getGrantedUsers,
} from '../../../../services/sale.service';

const GrantPermission = ({ grantPermission, setGrantPermission }) => {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [grantedUsers, setGrantedUsers] = useState([]);
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

    useEffect(() => {
        if (grantPermission) {
            fetchGrantedUsers();
        }
    }, [grantPermission]);

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
            const res = await searchUsersByName(name);
            if (res.data && Array.isArray(res.data)) {
                const filteredUsers = res.data.filter(
                    (user) => !grantedUsers.some((grantedUser) => grantedUser.id === user.id),
                );
                setUsers(filteredUsers);
            }
        } catch (error) {
            console.error('Failed to search users:', error);
        }
    };

    const fetchGrantedUsers = async () => {
        try {
            const res = await getGrantedUsers();
            if (res.data && Array.isArray(res.data)) setGrantedUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch granted users:', error);
        }
    };

    const handleGrantPermission = async (userId) => {
        try {
            const res = await grantPermissionApi(userId);
            if (res.data) {
                notification.success({
                    message: '権限付与登録が成功しました。',
                    style: {
                        width: 320,
                    },
                });
                fetchGrantedUsers();
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            } else {
                notification.error({
                    message: res.error,
                });
            }
        } catch (error) {
            notification.error({
                message: '権限付与登録が失敗しました。',
            });
            console.error('Failed to grant permission:', error);
        }
    };

    const handleRevokePermission = async (userId) => {
        try {
            const res = await revokePermission(userId);
            if (res.data) {
                notification.success({
                    message: '権限削除が成功しました。',
                    style: {
                        width: 310,
                    },
                });

                fetchGrantedUsers();

                const removedUser = grantedUsers.find((user) => user.id === userId);
                if (
                    removedUser &&
                    searchValue.trim() &&
                    removedUser.name.includes(searchValue.trim()) &&
                    !users.some((user) => user.id === removedUser.id)
                ) {
                    setUsers((prevUsers) => [...prevUsers, removedUser]);
                }
            }
        } catch (error) {
            notification.error({
                message: '権限削除が失敗しました。',
                style: {
                    width: 310,
                },
            });
            console.error('Failed to revoke permission:', error);
        }
    };

    const handleCloseModal = () => {
        setSearchValue('');
        setUsers([]);
        setGrantPermission(false);
    };

    return (
        <Modal title="権限付与" open={grantPermission} onCancel={handleCloseModal} footer={null} maskClosable={false}>
            <Input
                placeholder="社員名検索"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ marginBottom: '16px' }}
            />
            {searchValue.trim() && (
                <List
                    bordered
                    dataSource={users}
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

export default GrantPermission;
