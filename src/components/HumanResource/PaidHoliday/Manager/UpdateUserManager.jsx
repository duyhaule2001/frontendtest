import { DatePicker, Divider, Form, Input, Modal, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { updateUserManager } from '../../../../services/hr.service.js';

const UpdateUserManager = ({ updateManager, fetchPaidLeaveManagement, openUpdateManager, setOpenUpdateManager }) => {
    const [form] = useForm();

    useEffect(() => {
        if (updateManager && updateManager.id) {
            form.setFieldsValue({
                ...updateManager,
                joiningDate: updateManager.joiningDate ? dayjs(updateManager.joiningDate) : null,
                previousYearGrantDate: updateManager.previousYearGrantDate
                    ? dayjs(updateManager.previousYearGrantDate)
                    : null,
                previousYearExpiryDate: updateManager.previousYearExpiryDate
                    ? dayjs(updateManager.previousYearExpiryDate)
                    : null,
                currentYearGrantDate: updateManager.currentYearGrantDate
                    ? dayjs(updateManager.currentYearGrantDate)
                    : null,
                currentYearExpiryDate: updateManager.currentYearExpiryDate
                    ? dayjs(updateManager.currentYearExpiryDate)
                    : null,
            });
        }
    }, [updateManager, openUpdateManager]);

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
            const res = await updateUserManager(updateManager.id, formattedValues);
            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenUpdateManager(false);
                await fetchPaidLeaveManagement();
            } else {
                notification.error({
                    message: '修正が失敗しました。',
                    style: {
                        width: 270,
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
                title="管理者情報修正"
                open={openUpdateManager}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    setOpenUpdateManager(false);
                    form.resetFields('');
                }}
                maskClosable={false}
                width={'50%'}
                okText="登録"
                cancelText="キャンセル"
            >
                <Divider />
                <Form className="grid grid-cols-2 gap-10" onFinish={onFinish} form={form} layout="vertical">
                    <div>
                        <Form.Item label="氏名" name="name">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item label="社員番号" name="employeeNumber">
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="入社日"
                            name="joiningDate"
                            rules={[
                                {
                                    required: true,
                                    message: '入社日を入力してください',
                                },
                            ]}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="" disabled />
                        </Form.Item>

                        <Form.Item label="前年度付予日" name="previousYearGrantDate">
                            <DatePicker style={{ width: '100%' }} placeholder="" />
                        </Form.Item>

                        <Form.Item label="前年度付予" name="previousYearDays">
                            <Input />
                        </Form.Item>

                        <Form.Item label="前年度付予有効期間" name="previousYearExpiryDate">
                            <DatePicker style={{ width: '100%' }} placeholder="" />
                        </Form.Item>
                    </div>

                    <div>
                        <Form.Item label="付予日" name="currentYearGrantDate">
                            <DatePicker style={{ width: '100%' }} placeholder="" />
                        </Form.Item>

                        <Form.Item label="年度付予" name="currentYearDays">
                            <Input />
                        </Form.Item>

                        <Form.Item label="有効期間" name="currentYearExpiryDate">
                            <DatePicker style={{ width: '100%' }} placeholder="" />
                        </Form.Item>

                        <Form.Item label="残り日" name="remainingDays">
                            <Input />
                        </Form.Item>

                        <Form.Item label="合計残り日" name="totalRemainingDays">
                            <Input />
                        </Form.Item>
                        <Form.Item label="前年度残り日" name="previousYearRemainingDays">
                            <Input />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateUserManager;
