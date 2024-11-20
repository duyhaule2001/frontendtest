import { Button, Col, Form, Input, Modal, notification, Row, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { updateCustomer } from '../../../services/common.service';
import { UploadOutlined } from '@ant-design/icons';

const UpdateCustomer = ({ openModalUpdate, setOpenModalUpdate, fetchData, selectedCustomer }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (selectedCustomer && selectedCustomer.id) {
            form.setFieldsValue(selectedCustomer);
            if (selectedCustomer.organizationChart) {
                const existingFile = {
                    uid: '-1',
                    name: '組織図',
                    status: 'done',
                    url: selectedCustomer.organizationChart,
                };
                setFileList([existingFile]);
            }
        }
    }, [openModalUpdate, selectedCustomer]);

    //写真帰る
    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const onFinish = async (values) => {
        const formData = new FormData();

        // 写真あればフォームに追加
        Object.keys(values).forEach((key) => {
            if (key !== 'organizationChart') {
                formData.append(key, values[key]);
            }
        });

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('organizationChart', fileList[0].originFileObj);
        } else if (selectedCustomer.organizationChart) {
            formData.append('organizationChart', selectedCustomer.organizationChart);
        }
        try {
            const res = await updateCustomer(selectedCustomer.id, formData);
            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                form.resetFields();
                fetchData();
                setOpenModalUpdate(false);
            } else {
                notification.error({
                    message: '修正が失敗しました。',
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
                title="お客様情報修正"
                okText="修正"
                width={'50vw'}
                maskClosable={false}
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields('');
                }}
            >
                <Form form={form} onFinish={onFinish} layout="vertical" className="mt-5">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="companyName" label="会社名">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="name" label="名前">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="position" label="役職">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="department" label="所属部属">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="subDepartment" label="部属">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="contact" label="連絡先" initialValue={'会社電話'}>
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
                                <Input />
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
                                            notification.error(' JPG と PNG 以外のファイルはアップロードできません。');
                                        }

                                        return false;
                                    }}
                                    multiple={true}
                                    maxCount={1}
                                    onPreview={(file) => {
                                        window.open(file.url || file.thumbUrl);
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>画像またはPDFをアップロード</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default UpdateCustomer;
