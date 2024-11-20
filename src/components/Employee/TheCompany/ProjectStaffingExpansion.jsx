import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, notification, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { submitProjectStaffingExpansion } from '../../../services/employee.service';
import TitleCus from '../../Common/Layout/TitleCus';

const ProjectStaffingExpansions = () => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const data = {
            date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : '',
            siteName: values.siteName,
            salesPersonName: values.salesPersonName,
            increaseNumber: values.increaseNumber,
        };

        const res = await submitProjectStaffingExpansion(data);
        if (res.data) {
            notification.success({
                message: '登録が成功しました。',
                style: {
                    width: 270,
                },
            });
            form.resetFields();
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
            <TitleCus title={'プロジェクト増員数登録'} />
            <div className="mt-10 flex items-center justify-center p-2">
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="space-y-8 rounded-lg border border-gray-300 p-6"
                >
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="日付"
                                name="date"
                                rules={[{ required: true, message: '日付を選択してください' }]}
                            >
                                <DatePicker className="w-full" format="YYYY/MM/DD" placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="現場名" name="siteName" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="担当営業の名前" name="salesPersonName" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="増員数" name="increaseNumber" rules={[{ required: true }]}>
                                <InputNumber className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <div className="flex items-center justify-center">
                                <Button type="primary" htmlType="submit">
                                    登録
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default ProjectStaffingExpansions;
