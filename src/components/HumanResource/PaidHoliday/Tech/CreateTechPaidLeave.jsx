import { Form, Input, Modal, Upload, Button, notification, DatePicker, Row, Col, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';
import dayjs from 'dayjs';

import { createPaidTech } from '../../../../services/hr.service.js';

const CreateTechPaidLeave = ({
    openCreateTechPaid,
    setOpenCreateTechPaid,
    selectedTech,
    fetchPaidLeaveManagement,
    setOpenTechView,
}) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            const formattedDate = values.date ? dayjs(values.date).format('YYYY-MM-DD') : null;
            formData.append('date', formattedDate);
            formData.append('cause', values.cause);
            formData.append('vacation_time', values.vacation_time);

            if (values.file && values.file.length > 0) {
                formData.append('file', values.file[0].originFileObj);
            }

            const res = await createPaidTech(selectedTech.employeeNumber, formData);
            if (res.data) {
                notification.success({
                    message: '有給登録が成功しました。',
                    style: {
                        width: 310,
                    },
                });
                setOpenCreateTechPaid(false);
                form.resetFields();
                fetchPaidLeaveManagement();
                setOpenTechView(false);
            } else {
                notification.error({
                    message: res.error,
                    style: {
                        width: 320,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                title="技術者有給休暇登録"
                maskClosable={false}
                open={openCreateTechPaid}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenCreateTechPaid(false);
                    form.resetFields();
                }}
                okText="登録"
                cancelText="キャンセル"
            >
                <Form onFinish={onFinish} form={form} layout="vertical">
                    <Row gutter={10}>
                        <Col span={24}>
                            <Form.Item
                                label="日付"
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: '日付を入力してください！',
                                    },
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col span={19}>
                            <Form.Item
                                label="原因"
                                name="cause"
                                rules={[
                                    {
                                        required: true,
                                        message: '原因を入力してください！',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={5}>
                            <Form.Item
                                label="休暇時間"
                                name="vacation_time"
                                rules={[
                                    {
                                        required: true,
                                        message: '休暇時間を入力してください！',
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="ファイルアップロード"
                                name="file"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                        return e;
                                    }
                                    return e?.fileList;
                                }}
                            >
                                <Upload beforeUpload={() => false} listType="text">
                                    <Button icon={<UploadOutlined />}>ファイルを選択</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default CreateTechPaidLeave;
