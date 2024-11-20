import React, { useState } from 'react';
import { Button, Form, Radio, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import UserTable from './UserTable';
import MessageModal from './MessageModal';
import { getUserMails, sendMessage } from '../../../services/hr.service';
import TitleCus from '../../Common/Layout/TitleCus';

const SendMessage = () => {
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [messageForm] = Form.useForm();

    const [fileList, setFileList] = useState([]);

    const handleSearch = async (values) => {
        setLoading(true);
        try {
            const res = await getUserMails(values.department, values.permissions);
            if (res.data) {
                setUsers(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleSendMessage = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        messageForm
            .validateFields()
            .then(async (values) => {
                const selectedUsers = users.filter((user) => selectedRowKeys.includes(user.employee_number));

                const formData = new FormData();
                const recipients = selectedUsers.map((user) => user.mail);

                formData.append('title', values.title);
                formData.append('content', values.content);
                formData.append('recipients', JSON.stringify(recipients));

                fileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append('attachment', file.originFileObj);
                    }
                });

                try {
                    await sendMessage(formData);
                    notification.success({
                        message: '送信が成功しました。',
                        style: {
                            width: 270,
                        },
                    });
                    setUsers([]);
                } catch (error) {
                    notification.error({
                        message: '送信が失敗しました。',
                        style: {
                            width: 270,
                        },
                    });
                }

                setIsModalVisible(false);
                setSelectedRowKeys([]);
                messageForm.resetFields();
                setFileList([]);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        messageForm.resetFields('');
        setFileList([]);
    };

    return (
        <>
            <TitleCus title={'メール送信'} />
            <div className="flex w-full flex-col items-center">
                <div className="mt-10 bg-white">
                    <Form
                        form={form}
                        layout="horizontal"
                        className="w-full max-w-md rounded-lg p-5 shadow-lg"
                        onFinish={handleSearch}
                        initialValues={{ department: 'O', permissions: 6 }}
                    >
                        <Form.Item
                            name="department"
                            label="部門"
                            rules={[{ required: true, message: '部門を選択してください' }]}
                        >
                            <Radio.Group>
                                <Radio value="O"> Open系 </Radio>
                                <Radio value="S"> SAP </Radio>
                                <Radio value="その他"> その他 </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="permissions"
                            label="権限"
                            rules={[{ required: true, message: '権限を選択してください' }]}
                        >
                            <Radio.Group>
                                <Radio value={6}> 正社員 </Radio>
                                <Radio value={9}> 個人事業主 </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full"
                                icon={<SearchOutlined />}
                                loading={loading}
                            >
                                検索
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                {users.length > 0 && (
                    <div className="mt-10 w-full max-w-4xl">
                        <UserTable
                            users={users}
                            selectedRowKeys={selectedRowKeys}
                            setSelectedRowKeys={setSelectedRowKeys}
                        />
                        <Button
                            type="primary"
                            className="mt-4"
                            onClick={handleSendMessage}
                            disabled={selectedRowKeys.length === 0}
                        >
                            メール送信
                        </Button>
                    </div>
                )}

                <MessageModal
                    isModalVisible={isModalVisible}
                    handleOk={handleOk}
                    handleCancel={handleCancel}
                    messageForm={messageForm}
                    fileList={fileList}
                    setFileList={setFileList}
                />
            </div>
        </>
    );
};

export default SendMessage;
