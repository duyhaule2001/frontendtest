import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Form, Input, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { updateRetirement } from '../../../services/api.service';

const UpdateRetirement = ({
    openModalUpdate,
    setOpenModalUpdate,
    fetchListRetirement,
    selectedItemUpdate,
    selectedType,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedItemUpdate && selectedItemUpdate.id) {
            const initialForm = {
                ...selectedItemUpdate,
                retirement_date: selectedItemUpdate?.retirement_date
                    ? dayjs(selectedItemUpdate?.retirement_date)
                    : null,
            };
            form.setFieldsValue(initialForm);
        }
    }, [selectedItemUpdate, openModalUpdate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formattedValues = {
                ...values,
                retirement_date: values.retirement_date ? dayjs(values.retirement_date).format('YYYY-MM-DD') : null,
            };
            const res = await updateRetirement(selectedItemUpdate?.id, formattedValues);
            if (res?.data) {
                notification.success({
                    message: '更新が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalUpdate(false);
                await fetchListRetirement(selectedType);
                form.resetFields();
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    return (
        <>
            <Modal
                title="詳細修正"
                okText="登録"
                cancelText="キャンセル"
                width="50vw"
                maskClosable={false}
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields();
                }}
                confirmLoading={loading}
            >
                <Form onFinish={onFinish} autoComplete="off" form={form} layout="vertical" className="mt-5">
                    <Row gutter={40}>
                        <Col span={12}>
                            <Form.Item label="社員番号" name="emp_no">
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="名前" name="username">
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="メールアドレス" name="mail">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="所属" name="department">
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="雇用形態" name="contract_related">
                                <Select>
                                    <Select.Option value="正">正</Select.Option>
                                    <Select.Option value="契約">契約</Select.Option>
                                    <Select.Option value="派遣">派遣</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="退職日" name="retirement_date">
                                <DatePicker className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="理由" name="reason">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="退職手続き" name="retirement_procedure" initialValue={false}>
                                <Select>
                                    <Select.Option value={false}>未</Select.Option>
                                    <Select.Option value={true}>済み</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="備考" name="other" rules={[]}>
                                <Input.TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 6,
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateRetirement;
