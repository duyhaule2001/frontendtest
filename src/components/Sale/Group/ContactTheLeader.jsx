import React from 'react';
import TitleCus from '../../Common/Layout/TitleCus';
import { Button, Col, DatePicker, Form, Input, notification, Popconfirm, Row } from 'antd';
import dayjs from 'dayjs';
import { createContactTheLeader } from '../../../services/sale.service';

const ContactForLeader = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const formattedData = {
                ...values,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
            };
            const res = await createContactTheLeader(formattedData);
            if (res.data) {
                notification.success({
                    message: '送信が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                form.resetFields('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleConfirm = () => {
        form.submit();
    };

    return (
        <>
            <TitleCus title={'リーダーに連絡'} />
            <div className="mt-10 flex items-center justify-center">
                <Form
                    onFinish={onFinish}
                    form={form}
                    autoComplete="off"
                    layout="vertical"
                    className="w-full max-w-2xl rounded-lg border border-gray-300 bg-white p-6 shadow-lg"
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="日付"
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: '日付を選択してください',
                                    },
                                ]}
                            >
                                <DatePicker placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="連絡事項"
                                name="content"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    autoSize={{
                                        minRows: 10,
                                        maxRows: 20,
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24} className="flex items-center justify-end">
                            <Form.Item>
                                <Popconfirm
                                    title="確認"
                                    description="送信後は修正できないため、送信してよろしいですか？"
                                    okText="登録"
                                    cancelText="キャンセル"
                                    placement="bottom"
                                    onConfirm={handleConfirm}
                                >
                                    <Button type="primary">登録</Button>
                                </Popconfirm>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default ContactForLeader;
