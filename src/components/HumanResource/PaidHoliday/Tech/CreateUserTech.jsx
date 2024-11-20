import { DatePicker, Divider, Form, Input, Modal, notification } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import { createUserTech } from '../../../../services/hr.service.js';
import SearchNameInput from '../../../Common/Layout/Input/SearchNameInput.jsx';
import { getOneUserById } from '../../../../services/common.service.js';

const CreateUserTech = ({ openCreateUserTech, setOpenCreateUserTech, fetchPaidLeaveManagement }) => {
    const [form] = Form.useForm();

    const fetchUserDetails = async (userId) => {
        try {
            const response = await getOneUserById(userId);
            if (response.data) {
                form.setFieldsValue({
                    employeeNumber: response.data.emp_no || '',
                    joiningDate: response.data.hire_date ? dayjs(response.data.hire_date) : null,
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const onFinish = async (values) => {
        const formattedValues = {
            ...values,
            joiningDate: values.joiningDate ? dayjs(values.joiningDate).format('YYYY-MM-DD') : null,
            previousYearGrantDate: values.previousYearGrantDate
                ? dayjs(values.previousYearGrantDate).format('YYYY-MM-DD')
                : null,
            previousYearExpiryDate: values.previousYearExpiryDate
                ? dayjs(values.previousYearExpiryDate).format('YYYY-MM-DD')
                : null,
            currentYearGrantDate: values.currentYearGrantDate
                ? dayjs(values.currentYearGrantDate).format('YYYY-MM-DD')
                : null,
            currentYearExpiryDate: values.currentYearExpiryDate
                ? dayjs(values.currentYearExpiryDate).format('YYYY-MM-DD')
                : null,
        };
        try {
            const res = await createUserTech(formattedValues);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenCreateUserTech(false);
                form.resetFields();
                await fetchPaidLeaveManagement();
            } else {
                notification.error({
                    message: res.error,
                    style: {
                        width: 320,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Modal
                title="技術者登録"
                open={openCreateUserTech}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    setOpenCreateUserTech(false);
                    form.resetFields();
                }}
                maskClosable={false}
                okText="登録"
                cancelText="キャンセル"
            >
                <Divider />
                <Form onFinish={onFinish} form={form} layout="vertical">
                    <Form.Item
                        label="氏名"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '名前を入力してください',
                            },
                        ]}
                    >
                        <SearchNameInput onSelectUser={fetchUserDetails} />
                    </Form.Item>

                    <Form.Item label="社員番号" name="employeeNumber">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="入社日" name="joiningDate">
                        <DatePicker style={{ width: '100%' }} placeholder="" disabled />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateUserTech;