import React from 'react';
import { Form, Input, Button, notification } from 'antd';

import TitleCus from '../../Common/Layout/TitleCus';
import { submitConsultation } from '../../../services/employee.service';

const ConsultationForConcern = () => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const consultationForConcerns = {
            content: values.content,
        };

        const res = await submitConsultation(consultationForConcerns);
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
            <TitleCus title={'悩み相談'} />
            <div className="flex items-center justify-center p-2">
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="mt-10 w-full max-w-2xl rounded-lg bg-white p-6 shadow-md"
                >
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ required: true, message: '内容を入力してください' }]}
                    >
                        <Input.TextArea rows={10} className="w-full" />
                    </Form.Item>

                    <div className="flex items-center justify-center">
                        <Button type="primary" htmlType="submit" className="w-full sm:w-auto">
                            登録
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default ConsultationForConcern;
