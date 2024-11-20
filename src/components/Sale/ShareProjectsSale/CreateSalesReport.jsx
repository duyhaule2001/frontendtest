import { EyeOutlined } from '@ant-design/icons';
import { Col, Form, Image, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { createReportSaleList } from '../../../services/sale.service';
import SearchCompanyInput from '../../Common/Layout/Input/SearchCompanyInput';

const CreateSalesReport = ({ openModalCreate, setOpenModalCreate, fetchReport, selectedDate }) => {
    const [form] = Form.useForm();

    const [previewImage, setPreviewImage] = useState('');

    const handleCompanySelect = (option) => {
        form.setFieldsValue({
            companyName: option.value,
            department: option.department,
            name: option.name,
            departmentKnowledge: option.organizationChart,
        });
        setPreviewImage(option.organizationChart);
    };

    const onFinish = async (values) => {
        // 現在時刻を取得する
        const currentTime = dayjs();
        const noon = dayjs().hour(12).minute(0).second(0); // 12:00
        let registrationDate;

        // 午後なら当日、午前なら昨日
        if (currentTime.isAfter(noon)) {
            registrationDate = dayjs();
        } else {
            registrationDate = dayjs().subtract(1, 'day');
        }

        try {
            const formattedData = {
                ...values,
                registrationDate: registrationDate ? registrationDate.format('YYYY-MM-DD') : null,
            };
            const res = await createReportSaleList(formattedData);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalCreate(false);
                form.resetFields('');
                setPreviewImage('');
                fetchReport(selectedDate);
            } else {
                notification.error({
                    message: '登録が失敗しました。',
                });
            }
        } catch (error) {
            console.error('Error occurred while sending form:', error);
        }
    };

    return (
        <>
            <Modal
                title="新規登録"
                width={'50vw'}
                okText="登録"
                cancelText="キャンセル"
                maskClosable={false}
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields('');
                    setPreviewImage('');
                }}
            >
                <Form onFinish={onFinish} autoComplete="off" layout="vertical" form={form}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="会社名"
                                name="companyName"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <SearchCompanyInput onSelect={handleCompanySelect} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="部署" name="department">
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="氏名" name="name">
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="条件内容"
                                name="conditionDetails"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 10 }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="緊急度"
                                name="urgency"
                                rules={[
                                    {
                                        required: true,
                                        message: '緊急度を選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="高">高</Select.Option>
                                    <Select.Option value="中">中</Select.Option>
                                    <Select.Option value="低">低</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="テレワーク"
                                name="telework"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空にできません',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="面談回数"
                                name="interviewCount"
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
                            <Form.Item label="その他" name="otherDetails">
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 10 }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="社内対応方法"
                                name="internalResponse"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 10 }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="注意点" name="notes">
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 10 }} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            {previewImage && (
                                <Form.Item label="組織図" name="departmentKnowledge">
                                    <Image
                                        width={50}
                                        height={50}
                                        src={previewImage}
                                        alt="Current Image"
                                        className="mb-2 rounded-full"
                                        preview={{
                                            mask: <EyeOutlined style={{ fontSize: 15, color: 'white' }} />,
                                        }}
                                    />
                                </Form.Item>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default CreateSalesReport;
