import React, { useState } from 'react';
import { Col, DatePicker, Form, Input, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { createRetirement } from '../../../services/api.service';
import SearchNameInput from '../Layout/Input/SearchNameInput';
import { getOneUserById } from '../../../services/common.service';

const CreateRetirement = ({ openModalCreate, setOpenModalCreate, fetchListRetirement, selectedType }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await getOneUserById(userId);
            if (response.data) {
                form.setFieldsValue({
                    username: response.data.name || '',
                    emp_no: response.data.emp_no || '',
                    mail: response.data.mail || '',
                    department: response.data.department || '',
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formattedValues = {
                ...values,
                retirement_date: values.retirement_date ? dayjs(values.retirement_date).format('YYYY-MM-DD') : null,
            };
            const res = await createRetirement(formattedValues);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalCreate(false);
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
                title="新規登録"
                okText="登録"
                cancelText="キャンセル"
                width="50vw"
                maskClosable={false}
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                }}
                confirmLoading={loading}
            >
                <Form onFinish={onFinish} autoComplete="off" form={form} layout="vertical" className="mt-5">
                    <Row gutter={40}>
                        <Col span={12}>
                            <Form.Item
                                label="名前"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <SearchNameInput onSelectUser={fetchUserDetails} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="社員番号" name="emp_no">
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
                            <Form.Item
                                label="雇用形態"
                                name="contract_related"
                                rules={[
                                    {
                                        required: true,
                                        message: '雇用形態を選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="正">正</Select.Option>
                                    <Select.Option value="契約">契約</Select.Option>
                                    <Select.Option value="派遣">派遣</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="退職日"
                                name="retirement_date"
                                rules={[
                                    {
                                        required: true,
                                        message: '退職日を選択してください',
                                    },
                                ]}
                            >
                                <DatePicker className="w-full" placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="理由"
                                name="reason"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 6,
                                    }}
                                />
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

                        <Col span={12}>
                            <Form.Item label="備考" name="other" rules={[]}>
                                <Input.TextArea
                                    autoSize={{
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

export default CreateRetirement;
