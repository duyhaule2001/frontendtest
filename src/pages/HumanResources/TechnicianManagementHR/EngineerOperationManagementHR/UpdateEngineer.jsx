import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, notification, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { updateEngineer } from '../../../../services/hr.service';

const UpdateEngineer = ({ setOpenUpdate, openUpdate, selectedDataUpdate, loadTechnicianData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedDataUpdate) {
            form.setFieldsValue({
                technician_name: selectedDataUpdate.technician_name,
                occupational_classification: selectedDataUpdate.occupational_classification,
                admission_date: selectedDataUpdate.admission_date ? dayjs(selectedDataUpdate.admission_date) : null,
                settlement_date: selectedDataUpdate.settlement_date ? dayjs(selectedDataUpdate.settlement_date) : null,
                contract_related: selectedDataUpdate.contract_related,
                person_month: selectedDataUpdate.person_month,
                unit_price: selectedDataUpdate.unit_price,
                calculation_range: selectedDataUpdate.calculation_range,
                settlement_amount: selectedDataUpdate.settlement_amount,
                contract_renewal_date: selectedDataUpdate.contract_renewal_date
                    ? dayjs(selectedDataUpdate.contract_renewal_date)
                    : null,
            });
        }
    }, [selectedDataUpdate, form]);

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            admission_date: values.admission_date ? dayjs(values.admission_date).format('YYYY-MM-DD') : null,
            settlement_date: values.settlement_date ? dayjs(values.settlement_date).format('YYYY-MM-DD') : null,
            contract_renewal_date: values.contract_renewal_date
                ? dayjs(values.contract_renewal_date).format('YYYY-MM-DD')
                : null,
        };
        try {
            const response = await updateEngineer(formattedValues, selectedDataUpdate.id);
            if (response.data) {
                notification.success({
                    message: '更新が成功しました。',
                });
                setOpenUpdate(false);
                form.resetFields();
                loadTechnicianData();
            } else {
                notification.error({
                    message: '更新が失敗しました。',
                });
            }
        } catch (error) {
            notification.error({
                message: '更新が失敗しました。',
            });
        }
    };

    return (
        <Modal
            title="技術者情報の修正"
            open={openUpdate}
            onOk={() => form.submit()}
            okText="更新"
            cancelText="キャンセル"
            onCancel={() => {
                setOpenUpdate(false);
            }}
            width={'50%'}
        >
            <Form
                form={form}
                name="update_engineer"
                onFinish={handleSubmit}
                layout="vertical"
                className="grid grid-cols-2 gap-x-9 gap-y-4"
            >
                <Form.Item
                    label="技術者名"
                    name="technician_name"
                    rules={[
                        {
                            required: true,
                            message: '技術者名を入力してください！',
                        },
                    ]}
                >
                    <Input placeholder="技術者名を入力してください" />
                </Form.Item>
                <Form.Item
                    label="正/個/BP"
                    name="occupational_classification"
                    rules={[
                        {
                            required: true,
                            message: 'この項目は空欄にできません。',
                        },
                    ]}
                >
                    <Select placeholder="正/個/BPを選択してください">
                        <Select.Option value="正">正</Select.Option>
                        <Select.Option value="個">個</Select.Option>
                        <Select.Option value="BP">BP</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="入場日"
                    name="admission_date"
                    rules={[
                        {
                            required: true,
                            message: '入場日を入力してください！',
                        },
                    ]}
                >
                    <DatePicker className="w-full" placeholder="入場日を選択してください" />
                </Form.Item>
                <Form.Item
                    label="精算月日"
                    name="settlement_date"
                    rules={[
                        {
                            required: true,
                            message: '精算月日を入力してください！',
                        },
                    ]}
                >
                    <DatePicker className="w-full" placeholder="精算月日を選択してください" />
                </Form.Item>
                <Form.Item
                    label="契約形態"
                    name="contract_related"
                    rules={[
                        {
                            required: true,
                            message: 'この項目は空欄にできません。',
                        },
                    ]}
                >
                    <Select placeholder="契約形態を選択してください">
                        <Select.Option value="契約">契約</Select.Option>
                        <Select.Option value="派遣">派遣</Select.Option>
                        <Select.Option value="正">正</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="人/月"
                    name="person_month"
                    rules={[
                        {
                            required: true,
                            message: '人/月を入力してください！',
                        },
                    ]}
                >
                    <InputNumber placeholder="人/月を入力してください" className="w-full" />
                </Form.Item>
                <Form.Item
                    label="単価"
                    name="unit_price"
                    rules={[
                        {
                            required: true,
                            message: '単価を入力してください！',
                        },
                    ]}
                >
                    <Input placeholder="単価を入力してください" />
                </Form.Item>
                <Form.Item
                    label="精算範囲"
                    name="calculation_range"
                    rules={[
                        {
                            required: true,
                            message: '精算範囲を入力してください！',
                        },
                    ]}
                >
                    <Input placeholder="精算範囲を入力してください" />
                </Form.Item>
                <Form.Item
                    label="精算金額"
                    name="settlement_amount"
                    rules={[
                        {
                            required: true,
                            message: '精算金額を入力してください！',
                        },
                    ]}
                >
                    <InputNumber placeholder="精算金額を入力してください" className="w-full" />
                </Form.Item>
                <Form.Item
                    label="契約更新日"
                    name="contract_renewal_date"
                    rules={[
                        {
                            required: true,
                            message: '契約更新日を入力してください！',
                        },
                    ]}
                >
                    <DatePicker className="w-full" placeholder="契約更新日を選択してください" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateEngineer;
