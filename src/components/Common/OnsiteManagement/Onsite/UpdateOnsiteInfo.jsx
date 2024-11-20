import React, { useEffect } from 'react';
import { Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { updateOnsiteInfo } from '../../../../services/common.service';

const UpdateOnsiteInfo = ({ isInfoOpen, setIsInfoOpen, selectedOnsiteInfo, fetchData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedOnsiteInfo) {
            form.setFieldsValue({
                number: selectedOnsiteInfo.number,
                technicianName: selectedOnsiteInfo.technicianName,
                admissionDate: selectedOnsiteInfo.admissionDate ? dayjs(selectedOnsiteInfo.admissionDate) : null,
                projectName: selectedOnsiteInfo.projectName,
                customerNames: selectedOnsiteInfo.customerNames,
                docVeriOfficer: selectedOnsiteInfo.docVeriOfficer,
                admissionOfficer: selectedOnsiteInfo.admissionOfficer,
                unitPrice: selectedOnsiteInfo.unitPrice,
                payOff: selectedOnsiteInfo.payOff,
                workingReport: selectedOnsiteInfo.workingReport,
                requestQuote: selectedOnsiteInfo.requestQuote,
                orderConfirm: selectedOnsiteInfo.orderConfirm,
                orderNumber: selectedOnsiteInfo.orderNumber,
                orderDate: selectedOnsiteInfo.orderDate ? dayjs(selectedOnsiteInfo.orderDate) : null,
                weeklyOrMonthlyReport: selectedOnsiteInfo.weeklyOrMonthlyReport,
                systemProcessingDeadline: selectedOnsiteInfo.systemProcessingDeadline
                    ? dayjs(selectedOnsiteInfo.systemProcessingDeadline)
                    : null,
                other: selectedOnsiteInfo.other,
                processingComplete: selectedOnsiteInfo.processingComplete,
            });
        }
    }, [selectedOnsiteInfo, isInfoOpen, form]);

    const handleSubmit = async (values) => {
        const updatedOnsiteInfo = {
            ...selectedOnsiteInfo,
            ...values,
            admissionDate: values.admissionDate ? values.admissionDate.format('YYYY-MM-DD') : null,
            orderDate: values.orderDate ? values.orderDate.format('YYYY-MM-DD') : null,
            systemProcessingDeadline: values.systemProcessingDeadline
                ? values.systemProcessingDeadline.format('YYYY-MM-DD')
                : null,
        };

        const response = await updateOnsiteInfo(updatedOnsiteInfo, selectedOnsiteInfo.id);
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
    };

    return (
        <Modal
            title="現場情報修正"
            maskClosable={false}
            open={isInfoOpen}
            onOk={() => form.submit()}
            cancelText="キャンセル"
            onCancel={() => {
                setIsInfoOpen(false);
                form.resetFields('');
            }}
            okText="登録"
            width={'50%'}
        >
            <Form form={form} name="現場入場修正" onFinish={handleSubmit} layout="vertical">
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="技術者名" name="technicianName">
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="社員番号" name="number">
                            <Input disabled />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="入場日"
                            name="admissionDate"
                            rules={[
                                {
                                    required: true,
                                    message: '入場日期を選択してください！',
                                },
                            ]}
                        >
                            <DatePicker placeholder="" className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="案件名" name="projectName">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="上位顧客名" name="customerNames">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="書類確認担当" name="docVeriOfficer">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="入場担当" name="admissionOfficer">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="単価(月/H)" name="unitPrice">
                            <InputNumber className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="精算(140~200)H" name="payOff">
                            <InputNumber className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="作業報告書" name="workingReport">
                            <Input.TextArea autoSize />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="注文番号" name="orderNumber">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="注文日"
                            name="orderDate"
                            rules={[
                                {
                                    required: true,
                                    message: '注文日期を選択してください！',
                                },
                            ]}
                        >
                            <DatePicker placeholder="" className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="周報／月報"
                            name="weeklyOrMonthlyReport"
                            rules={[
                                {
                                    required: true,
                                    message: '周報／月報を選択してください！',
                                },
                            ]}
                        >
                            <Select className="w-full">
                                <Select.Option value={1}>周報</Select.Option>
                                <Select.Option value={2}>月報</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="システム処理期限日"
                            name="systemProcessingDeadline"
                            rules={[
                                {
                                    required: true,
                                    message: 'システム処理期限日を選択してください',
                                },
                            ]}
                        >
                            <DatePicker placeholder="" className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="備考" name="other">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12} className="mt-6 flex space-x-6">
                        <Form.Item name="requestQuote" valuePropName="checked">
                            <Checkbox>見積書依頼</Checkbox>
                        </Form.Item>

                        <Form.Item name="orderConfirm" valuePropName="checked">
                            <Checkbox>注文請書/見積書</Checkbox>
                        </Form.Item>
                    </Col>

                    <Col span={24} className="flex items-center justify-center">
                        <Form.Item name="processingComplete" valuePropName="checked">
                            <Checkbox>処理完了</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateOnsiteInfo;
