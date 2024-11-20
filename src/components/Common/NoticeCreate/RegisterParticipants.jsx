import { Button, Input, List, Modal, notification } from 'antd';
import React, { useState } from 'react';
import { registerParticipants } from '../../../services/hr.service';
import { searchUsersByNameApi } from '../../../services/common.service';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import AvatarNav from '../Layout/AvatarNav';

const RegisterParticipants = ({ registerOpen, setRegisterOpen, selectActivate, fetchParticipants }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const handleSearch = async (term) => {
        try {
            const res = await searchUsersByNameApi(term);
            if (res.data && Array.isArray(res.data)) {
                setSearchResults(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            handleSearch(term);
        }, 800);

        setDebounceTimeout(newTimeout);
    };

    const handleAddParticipant = (employee) => {
        if (!selectedParticipants.some((participant) => participant.id === employee.id)) {
            setSelectedParticipants([...selectedParticipants, employee]);
        }
    };

    const handleRegisterParticipants = async () => {
        try {
            const formatData = { list_user: selectedParticipants.map((participant) => participant.id) };
            const response = await registerParticipants(selectActivate.id, formatData);
            if (response.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: { width: 270 },
                });
                fetchParticipants();
                setRegisterOpen(false);
                setSearchTerm('');
                setSearchResults([]);
                setSelectedParticipants([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal
            title="申し込み"
            open={registerOpen}
            onCancel={() => {
                setRegisterOpen(false);
                setSearchTerm('');
                setSearchResults([]);
                setSelectedParticipants([]);
            }}
            okText="申込"
            cancelText="キャンセル"
            onOk={handleRegisterParticipants}
        >
            <Input placeholder="社員名を入力してください" value={searchTerm} onChange={handleInputChange} />
            <List
                itemLayout="horizontal"
                dataSource={searchResults}
                renderItem={(employee) => (
                    <List.Item
                        actions={[<Button icon={<PlusOutlined />} onClick={() => handleAddParticipant(employee)} />]}
                    >
                        <div className="flex items-center space-x-3">
                            <AvatarNav src={employee.img_path} name={employee.name} key={employee.id} />
                            <span>{employee.name}</span>
                        </div>
                    </List.Item>
                )}
            />
            <span className="text-sm font-semibold">選択した社員:</span>
            <List
                itemLayout="horizontal"
                dataSource={selectedParticipants}
                renderItem={(participant) => (
                    <List.Item
                        actions={[
                            <Button
                                icon={<MinusOutlined />}
                                onClick={() =>
                                    setSelectedParticipants(selectedParticipants.filter((p) => p.id !== participant.id))
                                }
                            />,
                        ]}
                    >
                        <div className="flex w-full items-center space-x-3">
                            <AvatarNav src={participant.img_path} name={participant.name} key={participant.id} />
                            <div className="flex w-full justify-between">
                                <span>{participant.name}</span>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default RegisterParticipants;
