import React, { useState } from 'react';
import { submitConsultation } from '../../../services/employee.service';
import { Form, Input, Button, notification } from 'antd';
import TitleCus from '../../../components/Common/Layout/Title/TitleCus';

const ConsultationForConcerns = () => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const consultationForConcerns = {
            content: values.content,
        };

        const res = await submitConsultation(consultationForConcerns);
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
        <section className="mt-16 min-h-screen bg-white">
            <TitleCus title={'悩み相談'} />
            <div className="mx-auto flex max-w-screen-md items-center justify-center px-4 py-8 lg:py-16">
                <div className="w-full">
                    <Form form={form} onFinish={handleSubmit} layout="vertical" className="space-y-8">
                        <Form.Item
                            label="内容"
                            name="content"
                            rules={[{ required: true, message: '内容を入力してください' }]}
                        >
                            <Input.TextArea rows={6} placeholder="内容を入力してください" />
                        </Form.Item>

                        <div className="flex items-center justify-center">
                            <Button type="primary" htmlType="submit">
                                送信
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </section>
    );
};

export default ConsultationForConcerns;
