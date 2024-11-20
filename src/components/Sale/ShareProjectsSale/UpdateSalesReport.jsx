import { Col, Form, Image, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { updateSaleReport } from '../../../services/sale.service';

const UpdateSalesReport = ({ openModalUpdate, setOpenModalUpdate, itemUpdate, fetchReport, selectedDate }) => {
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (itemUpdate) {
            form.setFieldsValue(itemUpdate);
            setPreviewImage(itemUpdate.departmentKnowledge);
        }
    }, [itemUpdate, openModalUpdate]);

    const onFinish = async (values) => {
        try {
            const res = await updateSaleReport(values.id, values);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalUpdate(false);
                setPreviewImage('');
                await fetchReport(selectedDate);
            } else {
                notification.error({
                    message: '登録が失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                title="情報修正"
                width={'50vw'}
                okText="登録"
                cancelText="キャンセル"
                maskClosable={false}
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields('');
                    setPreviewImage('');
                }}
            >
                <Form onFinish={onFinish} autoComplete="off" layout="vertical" form={form}>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item hidden label="id" name="id">
                                <Input />
                            </Form.Item>
                        </Col>
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
                                <Input disabled />
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

export default UpdateSalesReport;
