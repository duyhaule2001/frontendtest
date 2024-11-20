import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, notification, Popconfirm, Row, Table } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';

import SearchNameInput from '../../Layout/Input/SearchNameInput';
import { createReputation, getOneUserById } from '../../../../services/common.service';

const MaternityLeaveList = ({ maternityLeaveList, fetchData, date }) => {
    const [openModal, setOpenModal] = useState(false);
    const [form] = Form.useForm();
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await getOneUserById(userId);
            if (response.data) {
                form.setFieldsValue({
                    username: response.data.name || '',
                    emp_no: response.data.emp_no || '',
                });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const onFinish = async (values) => {
        try {
            const formattedData = {
                ...values,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
            };
            const res = await createReputation(formattedData);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                fetchData(date);
                setShowConfirm(false);
                setOpenModal(false);
                form.resetFields('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegister = () => {
        form.validateFields()
            .then(() => {
                setShowConfirm(true);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const columns = [
        {
            title: '氏名',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: '社員番号',
            dataIndex: 'emp_no',
            key: 'emp_no',
            align: 'center',
        },
        {
            title: '住民税未払い月数',
            dataIndex: 'unpaid_resident_tax_months',
            key: 'unpaid_resident_tax_months',
            align: 'center',
        },
    ];

    return (
        <div className="w-full">
            <div className="-mb-4 flex items-center justify-end">
                <Button type="primary" onClick={() => setOpenModal(true)}>
                    <PlusCircleOutlined />
                    新規登録
                </Button>
            </div>
            <Table
                dataSource={maternityLeaveList}
                columns={columns}
                pagination
                bordered
                className="mt-5 items-center justify-center"
                rowKey={'emp_no'}
            />
            <Modal
                title="産休登録"
                open={openModal}
                maskClosable={false}
                onCancel={() => setOpenModal(false)}
                footer={
                    <>
                        <Button onClick={() => setOpenModal(false)}>キャンセル</Button>
                        <Popconfirm
                            title="確認"
                            description={
                                <span>
                                    登録後は編集や削除ができません。
                                    <br />
                                    もう一度確認してから [確定] ボタンを押してください。
                                </span>
                            }
                            okText="Ok"
                            cancelText="キャンセル"
                            open={showConfirm}
                            onConfirm={() => {
                                form.submit();
                                setShowConfirm(false);
                            }}
                            onCancel={() => setShowConfirm(false)}
                        >
                            <Button type="primary" onClick={handleRegister}>
                                登録
                            </Button>
                        </Popconfirm>
                    </>
                }
            >
                <Form onFinish={onFinish} autoComplete="off" layout="vertical" className="mt-5" form={form}>
                    <Row gutter={24}>
                        <Col>
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
                                <DatePicker className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="氏名"
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

                        <Col span={24}>
                            <Form.Item label="社員番号" name="emp_no">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default MaternityLeaveList;
