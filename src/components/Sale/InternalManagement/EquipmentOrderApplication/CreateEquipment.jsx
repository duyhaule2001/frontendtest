import React, { useState } from 'react';
import { Form, Input, InputNumber, Modal, Row, Col, notification, Button, Upload } from 'antd';
import { createEquipmentOrder } from '../../../../services/common.service';
import { UploadOutlined } from '@ant-design/icons';

const CreateEquipment = ({ setCreateEquipment, createEquipment, fetchData, date }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (values[key] !== null && values[key] !== undefined) {
                formData.append(key, values[key]);
            }
        });

        if (fileList.length > 0) {
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('image', file.originFileObj);
                }
            });
        }

        try {
            const response = await createEquipmentOrder(formData);
            if (response.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setCreateEquipment(false);
                form.resetFields();
                await fetchData(date);
                setFileList([]);
            } else {
                notification.error({
                    message: '登録が失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="新規備品情報登録"
            maskClosable={false}
            open={createEquipment}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                form.resetFields();
                setCreateEquipment(false);
                setFileList([]);
            }}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-3">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="申請備品名" name="equipmentName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="数量" name="quantity" rules={[{ required: true }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="利用者" name="userName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="商品URL"
                            name="productURL"
                            rules={[
                                {
                                    type: 'url',
                                    message: '正しいURL形式で入力してください！',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="価格" name="price">
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\¥\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="用途" name="purpose" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="備考" name="note">
                            <Input.TextArea autoSize />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="単位" name="unit" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="画像" name="image">
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={(file) => {
                            const isJpgOrPngOrPdf = file.type === 'image/jpeg' || file.type === 'image/png';
                            if (!isJpgOrPngOrPdf) {
                                notification.error({
                                    message: 'JPG と PNG 以外のファイルはアップロードできません。',
                                });
                            }

                            return false;
                        }}
                        multiple={true}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>ファイル選択</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateEquipment;
