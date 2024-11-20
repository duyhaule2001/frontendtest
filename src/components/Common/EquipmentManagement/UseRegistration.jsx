import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, notification, Popconfirm, Row } from 'antd';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';

import { createUseRegister } from '../../../services/common.service';

const UseRegistration = ({ openUseRegister, setOpenUseRegister, fetchData, selectedItem }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedItem) {
            form.setFieldsValue({
                equipment_name: selectedItem.equipment_name,
            });
        }
    }, [selectedItem]);

    const onFinish = async (values) => {
        try {
            if (values.stock_quantity > selectedItem.stock_quantity) {
                notification.error({
                    message: '利用数量が在庫数を超えています。利用数量を減らしてください。',
                });
                return;
            }
            const formattedValues = {
                ...values,
                used_date: values.used_date ? dayjs(values.used_date).format('YYYY-MM-DD') : null,
            };
            const res = await createUseRegister(selectedItem.record_id, formattedValues);
            if (res.data) {
                notification.success({
                    message: '登録が完成しました。',
                });
            }
            setOpenUseRegister(false);
            form.resetFields(['used_date', 'stock_quantity', 'user_name', 'contant']);
            await fetchData();
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'エラーが発生しました。もう一度お試しください。',
            });
        }
    };

    const handleCancel = () => {
        setOpenUseRegister(false);
        form.resetFields(['used_date', 'stock_quantity', 'user_name', 'contant']);
    };

    const confirmSubmit = () => {
        form.submit();
    };

    return (
        <Modal
            title="利用登録"
            width={'50vw'}
            okText="登録"
            maskClosable={false}
            open={openUseRegister}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} className="mr-1">
                    キャンセル
                </Button>,
                <Popconfirm
                    key="popconfirm"
                    placement="top"
                    title="確認"
                    description={
                        <span>
                            登録後は内容の変更ができません。
                            <br />
                            もう一度ご確認の上、「登録」ボタンを押してください。
                        </span>
                    }
                    okText="登録"
                    cancelText="キャンセル"
                    onConfirm={confirmSubmit}
                >
                    <Button type="primary" key="register">
                        登録
                    </Button>
                </Popconfirm>,
            ]}
        >
            <Form form={form} onFinish={onFinish} layout="vertical" className="mt-5" initialValues={{ used_date: dayjs(), stock_quantity: undefined }}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="used_date" label="日付">
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="equipment_name" label="備品名">
                            <Input.TextArea autoSize disabled />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="stock_quantity"
                            label="利用数量"
                            rules={[
                                {
                                    required: true,
                                    message: '利用数量を入力してください。',
                                },
                                {
                                    validator(_, value) {
                                        if (!value || value <= selectedItem.stock_quantity) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('利用数量が在庫数を超えています。'));
                                    },
                                },
                            ]}
                        >
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="user_name" label="利用者">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="contant" label="備考">
                            <Input.TextArea autoSize />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UseRegistration;
