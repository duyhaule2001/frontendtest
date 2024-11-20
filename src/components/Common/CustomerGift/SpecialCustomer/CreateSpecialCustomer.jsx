import React from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, notification, Row, Col } from 'antd';
import { createSpecialCustomer } from '../../../../services/sale.service';
import dayjs from 'dayjs';

const CreateSpecialCustomer = ({ setCreateCustomer, createCustomer, fetchData }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        };
        try {
            const response = await createSpecialCustomer(formattedValues);
            if (response.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setCreateCustomer(false);
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
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="新規特別客様情報登録"
            maskClosable={false}
            open={createCustomer}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                form.resetFields();
                setCreateCustomer(false);
            }}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="日付" name="date" rules={[{ required: true }]} initialValue={dayjs()}>
                            <DatePicker placeholder="" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="氏名" name="customerName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="会社名" name="companyName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="担当者名" name="contactName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="肩名" name="jobTitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="郵便番号" name="postcode" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="住所" name="address" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="商品名" name="productName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="価格"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber
                                className="w-full"
                                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/¥\s?|,/g, '')}
                                min={0}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateSpecialCustomer;
