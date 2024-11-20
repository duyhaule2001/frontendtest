import { Button, Col, Form, Input, InputNumber, Modal, notification, Row, Select, Upload } from 'antd';
import React, { useState } from 'react';
import { createCustomer } from '../../../services/common.service';
import { UploadOutlined } from '@ant-design/icons';

const AddCustomer = ({ openModalAdd, setOpenModalAdd, fetchData }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const onFinish = async (values) => {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            const value = values[key] !== undefined && values[key] !== null ? values[key] : '';
            formData.append(key, value);
        });

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('organizationChart', fileList[0].originFileObj);
        }

        try {
            const res = await createCustomer(formData);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                form.resetFields();
                fetchData();
                setOpenModalAdd(false);
                setFileList([]);
            } else {
                notification.error({
                    message: '登録が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'エラーが発生しました。',
            });
        }
    };

    return (
        <div>
            <Modal
                title="新規登録"
                width={'50vw'}
                okText="登録"
                maskClosable={false}
                open={openModalAdd}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalAdd(false);
                    form.resetFields('');
                }}
            >
                <Form form={form} onFinish={onFinish} layout="vertical" className="mt-5">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="companyName"
                                label="会社名"
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
                                name="name"
                                label="名前"
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
                                name="position"
                                label="役職"
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
                                name="department"
                                label="所属部属"
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
                                name="subDepartment"
                                label="部属"
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
                                name="contact"
                                label="連絡先"
                                initialValue={'会社電話'}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="会社電話">会社電話</Select.Option>
                                    <Select.Option value="個人電話">個人電話</Select.Option>
                                    <Select.Option value="内線電話">内線電話</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="メール">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="capital" label="資本金">
                                <InputNumber
                                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="revenue" label="売上(何年分)">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="capitalPartnership" label="資本連携">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="homepage"
                                label="ホームページ"
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
                                name="latest"
                                label="最新"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空欄にできません',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={true}>◯</Select.Option>
                                    <Select.Option value={false}>✖️</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="organizationChart" label="組織図">
                                <Upload
                                    listType="picture"
                                    fileList={fileList}
                                    onChange={handleChange}
                                    beforeUpload={(file) => {
                                        const isJpgOrPngOrPdf = file.type === 'image/jpeg' || file.type === 'image/png';

                                        if (!isJpgOrPngOrPdf) {
                                            message.error(' JPG と PNG 以外のファイルはアップロードできません。');
                                        }

                                        return false;
                                    }}
                                    multiple={true}
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>ファイル選択</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default AddCustomer;
