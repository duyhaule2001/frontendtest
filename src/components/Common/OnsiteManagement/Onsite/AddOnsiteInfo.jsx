import React from 'react';
import { Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { createOnsiteInfo, getOneUserById } from '../../../../services/common.service';
import SearchNameInput from '../../Layout/Input/SearchNameInput';

const AddOnsiteInfo = ({ setOpenAddOnsiteInfo, openAddOnsiteInfo, fetchData }) => {
    const [form] = Form.useForm();

    const fetchUserDetails = async (userId) => {
        try {
            const response = await getOneUserById(userId);
            if (response.data) {
                form.setFieldsValue({
                    technicianName: response.data.name || '',
                    number: response.data.emp_no || '',
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            admissionDate: values.admissionDate ? dayjs(values.admissionDate).format('YYYY-MM-DD') : null,
            orderDate: values.orderDate ? dayjs(values.orderDate).format('YYYY-MM-DD') : null,
            systemProcessingDeadline: values.systemProcessingDeadline
                ? dayjs(values.systemProcessingDeadline).format('YYYY-MM-DD')
                : null,
        };

        const response = await createOnsiteInfo(formattedValues);
        console.log(response);
        if (response.data) {
            notification.success({
                message: '登録が成功しました。',
                style: {
                    width: 270,
                },
            });
            setOpenAddOnsiteInfo(false);
            form.resetFields();
            await fetchData();
        } else {
            notification.error({
                message: '登録が失敗しました。',
                style: {
                    width: 270,
                },
            });
        }
    };

    return (
        <>
            <Modal
                title="新規登録"
                maskClosable={false}
                open={openAddOnsiteInfo}
                onOk={() => form.submit()}
                okText="登録"
                cancelText="キャンセル"
                onCancel={() => {
                    form.resetFields();
                    setOpenAddOnsiteInfo(false);
                }}
                width={'50%'}
            >
                <Form form={form} name="現場入場登録" onFinish={handleSubmit} layout="vertical">
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
                                <SearchNameInput onSelectUser={fetchUserDetails} />
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
                            <Form.Item
                                label="案件名"
                                name="projectName"
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
                                label="上位顧客名"
                                name="customerNames"
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
                                label="書類確認担当"
                                name="docVeriOfficer"
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
                                label="入場担当"
                                name="admissionOfficer"
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
                                label="単価(月/H)"
                                name="unitPrice"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="精算(140~200)H"
                                name="payOff"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="作業報告書"
                                name="workingReport"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.TextArea autoSize />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="注文番号"
                                name="orderNumber"
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
        </>
    );
};

export default AddOnsiteInfo;
