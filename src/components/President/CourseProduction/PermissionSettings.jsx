import { Modal, Form, notification, Button, Radio } from 'antd';
import React, { useState } from 'react';
import { courseSetting } from '../../../services/common.service';
import UserTable from '../../HumanResource/SendMessage/UserTable';
import { SearchOutlined } from '@ant-design/icons';
import { getUserMails } from '../../../services/hr.service';

const PermissionSettings = ({ openModalSetting, setOpenModalSetting, courseId, fetchData }) => {
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    //参加者検索
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

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                const selectedUsers = users.filter((user) => selectedRowKeys.includes(user.employee_number));

                const employeeNumbers = selectedUsers.map((user) => user.employee_number);

                const dataToSend = {
                    courseId: courseId ? courseId : null,
                    employeeNumbers: employeeNumbers, // 社員番号
                };

                try {
                    const res = await courseSetting(dataToSend);
                    if (res.data) {
                        notification.success({
                            message: '登録が成功しました。',
                            style: {
                                width: 270,
                            },
                        });
                        setOpenModalSetting(false);
                        form.resetFields('');
                        setUsers([]);
                        setSelectedRowKeys([]);
                        fetchData(courseId);
                    }
                } catch (error) {
                    notification.error({
                        description: 'データ送信が失敗しました。',
                    });
                    console.log('Error:', error);
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <>
            <Modal
                title="生徒追加"
                width="70vw"
                okText="登録"
                open={openModalSetting}
                onCancel={() => {
                    setOpenModalSetting(false);
                    form.resetFields('');
                    setUsers([]);
                    setSelectedRowKeys([]);
                    setManagementAccountOptions([]);
                    setTeacherAccountOptions([]);
                }}
                maskClosable={false}
                onOk={handleOk}
            >
                <Form
                    form={form}
                    className="mt-5"
                    onFinish={handleSearch}
                    initialValues={{ department: 'O', permissions: 6 }}
                >
                    <div className="mt-5 flex items-center justify-center">
                        <div className="w-full max-w-md rounded-lg p-5 shadow-lg">
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
                        </div>
                    </div>
                </Form>
                {users.length > 0 && (
                    <div className="mt-10 w-full max-w-4xl">
                        <UserTable
                            users={users}
                            selectedRowKeys={selectedRowKeys}
                            setSelectedRowKeys={setSelectedRowKeys}
                        />
                    </div>
                )}
            </Modal>
        </>
    );
};

export default PermissionSettings;
