import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, notification, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { submitProjectStaffingExpansion } from '../../../services/employee.service';
import TitleCus from '../../../components/Common/Layout/Title/TitleCus';

const ProjectStaffingExpansion = () => {
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
                message: '送信が成功しました。',
            });
            form.resetFields();
        } else {
            notification.error({
                message: 'エラー',
                description: '送信中にエラーが発生しました。',
            });
        }
    };

    return (
        <>
            <TitleCus title={'プロジェクト増員数登録'} />
            <div className="mx-auto flex max-w-screen-lg items-center justify-center px-4 py-8">
                <Form form={form} onFinish={handleSubmit} layout="vertical" className="space-y-8">
                    <Row gutter={[30, 30]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="日付"
                                name="date"
                                rules={[{ required: true, message: '日付を選択してください!' }]}
                            >
                                <DatePicker className="w-full" format="YYYY/MM/DD" placeholder="日付を選択" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="現場名"
                                name="siteName"
                                rules={[{ required: true, message: '現場名を入力してください!' }]}
                            >
                                <Input placeholder="現場名" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="担当営業の名前"
                                name="salesPersonName"
                                rules={[{ required: true, message: '担当営業の名前を入力してください!' }]}
                            >
                                <Input placeholder="担当営業の名前" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="増員数"
                                name="increaseNumber"
                                rules={[{ required: true, message: '増員数を入力してください!' }]}
                            >
                                <InputNumber className="w-full" placeholder="増員数" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <div className="flex items-center justify-center">
                                <Button type="primary" htmlType="submit">
                                    送信
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default ProjectStaffingExpansion;
