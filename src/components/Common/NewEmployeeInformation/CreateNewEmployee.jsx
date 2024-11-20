import React, { useState } from 'react';
import { Col, Form, Input, Modal, Row, Select, DatePicker, notification, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { createNewEmployee, getOneUserById } from '../../../services/common.service';
import SearchNameInput from '../Layout/Input/SearchNameInput';

const CreateNewEmployee = ({ openModalCreate, setOpenModalCreate, fetchEmployee, selectedDate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await getOneUserById(userId);
            if (response.data) {
                form.setFieldsValue({
                    name: response.data.name || '',
                    number: response.data.emp_no || '',
                    gender: response.data.gender ? true : false,
                    affiliation: response.data.department || '',
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        const birthday = `${values.birthdayYear}-${String(values.birthdayMonth).padStart(2, '0')}-${String(values.birthdayDay).padStart(2, '0')}`;
        const formattedValues = {
            ...values,
            birthday,
            start_date: values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : null,
        };
        try {
            const res = await createNewEmployee(formattedValues);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalCreate(false);
                form.resetFields();
                await fetchEmployee(selectedDate);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => currentYear - i);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <>
            <Modal
                title="新規登録"
                okText="登録"
                cancelText="キャンセル"
                width={'50vw'}
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields('');
                }}
                maskClosable={false}
                loading={loading}
            >
                <Form onFinish={onFinish} form={form} autoComplete="off" className="mt-5" layout="vertical">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="氏名"
                                name="name"
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
                            <Form.Item label="番号" name="number">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="フリガナ"
                                name="furigana"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="性別" name="gender">
                                <Select disabled>
                                    <Select.Option value={true}>男</Select.Option>
                                    <Select.Option value={false}>女</Select.Option>
                                    <Select.Option value={null}>その他</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="生年月日" required>
                                <div className="flex items-center space-x-3">
                                    <Form.Item
                                        name="birthdayYear"
                                        rules={[{ required: true, message: '年を選択してください!' }]}
                                        noStyle
                                    >
                                        <Select placeholder="選択">
                                            {years.map((year) => (
                                                <Select.Option key={year} value={year}>
                                                    {year}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <span className="text-[1rem]">年</span>

                                    <Form.Item
                                        name="birthdayMonth"
                                        rules={[{ required: true, message: '月を選択してください!' }]}
                                        noStyle
                                    >
                                        <Select placeholder="月">
                                            {months.map((month) => (
                                                <Select.Option key={month} value={month}>
                                                    {month}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <span className="text-[1rem]">月</span>

                                    <Form.Item
                                        name="birthdayDay"
                                        rules={[{ required: true, message: '日を選択してください!' }]}
                                        noStyle
                                    >
                                        <Select placeholder="日">
                                            {days.map((day) => (
                                                <Select.Option key={day} value={day}>
                                                    {day}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <span className="text-[1rem]">日</span>
                                </div>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="国籍"
                                name="nationality"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="スキルシート有無"
                                name="skill_sheet"
                                rules={[
                                    {
                                        required: true,
                                        message: 'スキルシート状態を選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={true}>有</Select.Option>
                                    <Select.Option value={false}>無</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="経験年数"
                                name="years_of_experience"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber addonAfter="年" className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="稼働開始日"
                                name="start_date"
                                rules={[
                                    {
                                        required: true,
                                        message: '稼働開始日を選択してください',
                                    },
                                ]}
                            >
                                <DatePicker className="w-full" placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="得意な言語"
                                name="preferred_language"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="所属" name="affiliation">
                                <Select disabled>
                                    <Select.Option value="SAP">SAP</Select.Option>
                                    <Select.Option value="OPEN系">OPEN系</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="採用形式"
                                name="employment_type"
                                rules={[
                                    {
                                        required: true,
                                        message: '採用形式を選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={true}>新卒</Select.Option>
                                    <Select.Option value={false}>中途</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="仕入れ"
                                name="procurement"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber
                                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\¥\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default CreateNewEmployee;
