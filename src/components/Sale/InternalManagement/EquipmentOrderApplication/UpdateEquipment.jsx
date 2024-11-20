import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Row, Col, notification, Upload, Button, Image } from 'antd';
import { updateEquipmentOrder } from '../../../../services/common.service';
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';

const UpdateEquipment = ({ setUpdateEquipmentOpen, updateEquipmentOpen, fetchData, selectedEquipment, date }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            const newImage = URL.createObjectURL(fileList[0].originFileObj);
            setPreviewImage(newImage);
        }
    };

    useEffect(() => {
        if (selectedEquipment) {
            form.setFieldsValue({
                equipmentName: selectedEquipment.equipmentName,
                quantity: selectedEquipment.quantity,
                userName: selectedEquipment.userName,
                productURL: selectedEquipment.productURL,
                price: selectedEquipment.price,
                purpose: selectedEquipment.purpose,
                note: selectedEquipment.note,
                unit: selectedEquipment.unit,
            });
            setPreviewImage(selectedEquipment.imageUrl || '');
        }
    }, [selectedEquipment, updateEquipmentOpen]);

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
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        try {
            const response = await updateEquipmentOrder(selectedEquipment.id, formData);
            if (response.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setUpdateEquipmentOpen(false);
                await fetchData(date);
                setFileList([]);
            } else {
                notification.error({
                    message: '更新が失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="備品情報修正"
            open={updateEquipmentOpen}
            onOk={() => form.submit()}
            okText="更新"
            cancelText="キャンセル"
            onCancel={() => {
                setUpdateEquipmentOpen(false);
                setFileList([]);
                setPreviewImage('');
            }}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

                <Form.Item label="画像">
                    {previewImage && (
                        <Image
                            width={50}
                            height={50}
                            src={previewImage}
                            alt="Current Image"
                            className="rounded-full"
                            preview={{
                                mask: <EyeOutlined style={{ fontSize: 15, color: 'white' }} />,
                            }}
                        />
                    )}
                </Form.Item>

                <Form.Item name="image">
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

export default UpdateEquipment;
