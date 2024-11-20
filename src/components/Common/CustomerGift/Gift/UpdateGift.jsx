import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, notification, DatePicker, InputNumber, Upload, Button, Select, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import { updateGift } from '../../../../services/sale.service';

const UpdateGift = ({ updateGiftOpen, setUpdateGiftOpen, fetchData, selectedGift }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    useEffect(() => {
        if (selectedGift) {
            form.setFieldsValue({
                orderDate: selectedGift.orderDate ? dayjs(selectedGift.orderDate) : null,
                contactName: selectedGift.contactName,
                companyName: selectedGift.companyName,
                orderNumber: selectedGift.orderNumber,
                name: selectedGift.name,
                productName: selectedGift.productName,
                departmentNameOne: selectedGift.departmentNameOne,
                quantity: selectedGift.quantity,
                departmentNameTwo: selectedGift.departmentNameTwo,
                amount: selectedGift.amount,
                jobTitle: selectedGift.jobTitle,
                reaction: selectedGift.reaction,
                postcode: selectedGift.postcode,
                remarks: selectedGift.remarks,
                address: selectedGift.address,
                type: selectedGift.type,
            });
        }
    }, [selectedGift, updateGiftOpen, form]);

    const handleSubmit = async (values) => {
        const formData = new FormData();
        if (values.orderDate) {
            const formattedDate = dayjs(values.orderDate).format('YYYY-MM-DD');
            formData.append('orderDate', formattedDate);
        }
        Object.keys(values).forEach((key) => {
            if (key !== 'orderDate' && values[key] !== null && values[key] !== undefined) {
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
            const response = await updateGift(selectedGift.id, formData);
            if (response.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setUpdateGiftOpen(false);
                await fetchData();
            } else {
                notification.error({
                    message: '修正が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            notification.error({
                message: '修正が失敗しました。',
            });
        }
    };

    return (
        <Modal
            title="注文情報修正"
            maskClosable={false}
            open={updateGiftOpen}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                form.resetFields();
                setUpdateGiftOpen(false);
                setFileList([]);
            }}
            width={'60%'}
            className="-mt-9"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="注文日"
                            name="orderDate"
                            rules={[{ required: true, message: '注文日を選択してください' }]}
                        >
                            <DatePicker placeholder="" className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="担当者" name="contactName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="会社名及び持参先名" name="companyName" rules={[{ required: true }]}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="注文番号" name="orderNumber" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="氏名" name="name" rules={[{ required: true }]}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="商品名" name="productName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="部署名1" name="departmentNameOne" rules={[{ required: true }]}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="個数" name="quantity" rules={[{ required: true }]}>
                            <InputNumber className="w-full" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="部署名2" name="departmentNameTwo">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="金額" name="amount">
                            <InputNumber
                                className="w-full"
                                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="役職" name="jobTitle" rules={[{ required: true }]}>
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="持参先の反応等" name="reaction">
                            <Input.TextArea autoSize />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="郵便番号" name="postcode" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="備考" name="remarks">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="住所" name="address" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="種類"
                            name="type"
                            rules={[{ required: true, message: '種類を選択してください！' }]}
                        >
                            <Select>
                                <Select.Option value="flower">お花</Select.Option>
                                <Select.Option value="souvenir">お土産</Select.Option>
                                <Select.Option value="candy">お菓子</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="商品写真" name="image">
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
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateGift;
