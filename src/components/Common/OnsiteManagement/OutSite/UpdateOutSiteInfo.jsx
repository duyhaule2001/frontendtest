import React, { useEffect } from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { updateOutSiteInfo } from '../../../../services/common.service';

const UpdateOutSiteInfo = ({ setIsInfoOpen, isInfoOpen, selectedOutSiteInfo, fetchData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedOutSiteInfo) {
            form.setFieldsValue({
                employeeNumber: selectedOutSiteInfo.employeeNumber,
                technicianName: selectedOutSiteInfo.technicianName,
                exitDate: selectedOutSiteInfo.exitDate ? dayjs(selectedOutSiteInfo.exitDate) : null,
                skillSheetUpdate: selectedOutSiteInfo.skillSheetUpdate,
                priceAdjustment: selectedOutSiteInfo.priceAdjustment,
                contactName: selectedOutSiteInfo.contactName,
                referenceUnitPrice: selectedOutSiteInfo.referenceUnitPrice,
            });
        }
    }, [selectedOutSiteInfo, isInfoOpen, form]);

    const handleSubmit = async (values) => {
        const updatedOutSiteInfo = {
            ...selectedOutSiteInfo,
            ...values,
            exitDate: values.exitDate ? values.exitDate.format('YYYY-MM-DD') : null,
        };

        const response = await updateOutSiteInfo(updatedOutSiteInfo, selectedOutSiteInfo.id);
        try {
            if (response.data) {
                notification.success({
                    message: '更新が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setIsInfoOpen(false);
                await fetchData();
            } else {
                notification.error({
                    message: '更新が失敗しました。',
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
        <Modal
            title="情報修正"
            open={isInfoOpen}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                setIsInfoOpen(false);
                form.resetFields('');
            }}
            maskClosable={false}
            width={'50%'}
        >
            <Form form={form} name="退場情報修正" onFinish={handleSubmit} layout="vertical">
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="技術者名"
                            name="technicianName"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="社員番号"
                            name="employeeNumber"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="退場日"
                            name="exitDate"
                            rules={[
                                {
                                    required: true,
                                    message: '退場日を選択してください',
                                },
                            ]}
                        >
                            <DatePicker placeholder="" className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="前担当者名"
                            name="contactName"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="スキルシート更新"
                            name="skillSheetUpdate"
                            rules={[
                                {
                                    required: true,
                                    message: 'スキルシート更新を選択してください！',
                                },
                            ]}
                        >
                            <Select className="w-full">
                                <Select.Option value={1}>◯</Select.Option>
                                <Select.Option value={2}>✖️</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="単価調整"
                            name="priceAdjustment"
                            rules={[
                                {
                                    required: true,
                                    message: '単価調整を選択してください！',
                                },
                            ]}
                        >
                            <Select className="w-full">
                                <Select.Option value={1}>◯</Select.Option>
                                <Select.Option value={2}>✖️</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="参考単価"
                            name="referenceUnitPrice"
                            rules={[
                                {
                                    required: true,
                                    message: '金額を入力してください',
                                },
                            ]}
                        >
                            <InputNumber
                                className="w-full"
                                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateOutSiteInfo;
