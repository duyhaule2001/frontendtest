import React from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { createOutSiteInfo, getOneUserById } from '../../../../services/common.service';
import SearchNameInput from '../../Layout/Input/SearchNameInput';

const AddOutSiteInfo = ({ setOpenAddOutSiteInfo, openAddOutSiteInfo, fetchData }) => {
    const [form] = Form.useForm();

    const fetchUserDetails = async (userId) => {
        try {
            const response = await getOneUserById(userId);
            if (response.data) {
                form.setFieldsValue({
                    technicianName: response.data.name || '',
                    employeeNumber: response.data.emp_no || '',
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            exitDate: values.exitDate ? dayjs(values.exitDate).format('YYYY-MM-DD') : null,
        };

        const response = await createOutSiteInfo(formattedValues);
        console.log(response);
        if (response.data) {
            notification.success({
                message: '登録が成功しました。',
                style: {
                    width: 270,
                },
            });
            setOpenAddOutSiteInfo(false);
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
                open={openAddOutSiteInfo}
                onOk={() => form.submit()}
                okText="登録"
                cancelText="キャンセル"
                onCancel={() => {
                    form.resetFields();
                    setOpenAddOutSiteInfo(false);
                }}
                width={'50%'}
            >
                <Form form={form} name="現場退場登録" onFinish={handleSubmit} layout="vertical">
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
        </>
    );
};

export default AddOutSiteInfo;
