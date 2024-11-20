import { DatePicker, Divider, Form, Input, Modal, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { updateUserTech } from '../../../../services/hr.service.js';

const UpdateUserTech = ({ updateTech, fetchPaidLeaveManagement, openUpdateTech, setOpenUpdateTech }) => {
    const [form] = useForm();

    useEffect(() => {
        if (updateTech) {
            form.setFieldsValue({
                ...updateTech,
                joiningDate: updateTech.joiningDate ? dayjs(updateTech.joiningDate) : null,
                previousYearGrantDate: updateTech.previousYearGrantDate
                    ? dayjs(updateTech.previousYearGrantDate)
                    : null,
                previousYearExpiryDate: updateTech.previousYearExpiryDate
                    ? dayjs(updateTech.previousYearExpiryDate)
                    : null,
                currentYearGrantDate: updateTech.currentYearGrantDate ? dayjs(updateTech.currentYearGrantDate) : null,
                currentYearExpiryDate: updateTech.currentYearExpiryDate
                    ? dayjs(updateTech.currentYearExpiryDate)
                    : null,
            });
        }
    }, [updateTech, openUpdateTech, form]);

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
        const res = await updateUserTech(updateTech.id, formattedValues);
        if (res.data) {
            notification.success({
                message: '修正が成功しました。',
                style: {
                    width: 270,
                },
            });
            setOpenUpdateTech(false);
            await fetchPaidLeaveManagement();
        } else {
            notification.error({
                message: 'エラー',
                description: '情報修正が失敗しました。',
                style: {
                    width: 270,
                },
            });
        }
    };

    return (
        <>
            <Modal
                title="技術者情報修正"
                open={openUpdateTech}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    setOpenUpdateTech(false);
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

                        <Form.Item label="入社日" name="joiningDate">
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

export default UpdateUserTech;
