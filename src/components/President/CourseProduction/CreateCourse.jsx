import { Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import React, { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { searchManagerAccount, searchTeacherAccount } from '../../../services/common.service';

import { createCourse } from '../../../services/common.service';

const CreateCourse = ({ openCreateModal, setOpenCreateModal, fetchCourse }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [teacherAccountOptions, setTeacherAccountOptions] = useState([]);
    const [managementAccountOptions, setManagementAccountOptions] = useState([]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formattedData = {
                ...values,
                teacherAccount: values.teacherAccount || null,
                managementAccount: values.managementAccount || null,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
                endPeriod: values.endPeriod ? dayjs(values.endPeriod).format('YYYY-MM-DD') : null,
            };
            const res = await createCourse(formattedData);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                form.resetFields('');
                setOpenCreateModal(false);
                fetchCourse();
                setTeacherAccountOptions([]);
                setManagementAccountOptions([]);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleCloseModal = () => {
        setOpenCreateModal(false);
        form.resetFields('');
    };

    //管理account検索
    const handleManagementAccountSearch = useCallback(
        debounce(async (searchText) => {
            if (searchText.trim() !== '') {
                try {
                    const res = await searchManagerAccount(searchText);
                    if (res.data) {
                        const options = res.data.map((manager) => ({
                            value: manager.emp_no,
                            label: manager.name,
                        }));
                        setManagementAccountOptions(options);
                    }
                } catch (error) {
                    console.log('Error fetching teacher accounts:', error);
                }
            } else {
                setManagementAccountOptions([]);
            }
        }, 500), // 500ms delay
        [],
    );

    //先生account検索
    const handleTeacherAccountSearch = useCallback(
        debounce(async (searchText) => {
            if (searchText.trim() !== '') {
                try {
                    const res = await searchTeacherAccount(searchText);
                    if (res.data) {
                        const options = res.data.map((teacher) => ({
                            value: teacher.emp_no,
                            label: teacher.name,
                        }));
                        setTeacherAccountOptions(options);
                    }
                } catch (error) {
                    console.log('Error fetching teacher accounts:', error);
                }
            } else {
                setTeacherAccountOptions([]);
            }
        }, 500), // 500ms delay
        [],
    );

    return (
        <div>
            <Modal
                title="講座作成"
                width={'50vw'}
                okText="登録"
                onOk={() => form.submit()}
                maskClosable={false}
                open={openCreateModal}
                onCancel={handleCloseModal}
                confirmLoading={loading}
            >
                <Form autoComplete="off" layout="vertical" onFinish={onFinish} form={form}>
                    <Row gutter={25}>
                        <Col span={12}>
                            <Form.Item
                                label="日付"
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: '日付を選択してください',
                                    },
                                ]}
                                initialValue={dayjs()}
                            >
                                <DatePicker className="w-full" placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="授業名"
                                name="courseName"
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
                                label="必要時間"
                                name="requiredTime"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="URL"
                                name="url"
                                rules={[
                                    {
                                        required: true,
                                    },
                                    {
                                        type: 'url',
                                        message: '正しいURL形式で入力してください!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="teacherAccount"
                                label="先生アカウント"
                                rules={[
                                    {
                                        required: true,
                                        message: '先生アカウントを選択してください',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    filterOption={false}
                                    onSearch={handleTeacherAccountSearch}
                                    allowClear
                                    options={teacherAccountOptions}
                                    notFoundContent="アカウント名を入力してください"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="managementAccount"
                                label="管理者アカウント"
                                rules={[
                                    {
                                        required: true,
                                        message: '管理者アカウントを選択してください',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    filterOption={false}
                                    onSearch={handleManagementAccountSearch}
                                    allowClear
                                    options={managementAccountOptions}
                                    notFoundContent="アカウント名を入力してください"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="授業項目"
                                name="courseItem"
                                rules={[
                                    {
                                        required: true,
                                        message: '授業項目を選択してください',
                                    },
                                ]}
                                initialValue={0}
                            >
                                <Select>
                                    <Select.Option value={0}>SAP</Select.Option>
                                    <Select.Option value={1}>OPEN系</Select.Option>
                                    <Select.Option value={2}>AI教育</Select.Option>
                                    <Select.Option value={3}>Salesforce</Select.Option>
                                    <Select.Option value={4}>セキュリティ教育</Select.Option>
                                    <Select.Option value={5}>現場用日本語教育</Select.Option>
                                    <Select.Option value={6}>ビジネスマナー教育</Select.Option>
                                    <Select.Option value={7}>その他</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="最終日"
                                name="endPeriod"
                                rules={[
                                    {
                                        required: true,
                                        message: '最終日を選択してください',
                                    },
                                ]}
                            >
                                <DatePicker className="w-full" placeholder="" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CreateCourse;
