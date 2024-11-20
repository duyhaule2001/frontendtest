import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, notification, Popconfirm, Row, Upload } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';

import { createEquipment } from '../../../services/common.service';

const CreateEquipment = ({ openModalCreate, setOpenModalCreate, fetchData, equipments }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const onFinish = async (values) => {
        const formData = new FormData();

        const formattedValues = {
            ...values,
            purchase_date: values.purchase_date ? dayjs(values.purchase_date).format('YYYY-MM-DD') : null,
        };

        delete formattedValues.image;

        Object.keys(formattedValues).forEach((key) => {
            const value =
                formattedValues[key] !== undefined && formattedValues[key] !== null ? formattedValues[key] : '';
            formData.append(key, value);
        });

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('image', fileList[0].originFileObj);
        }

        try {
            // Check if the equipment with the same name and URL already exists
            const existingEquipment = equipments.find(
                (item) => item.equipment_name === values.equipment_name && item.purchase_url === values.purchase_url
            );

            if (existingEquipment) {
                // Update the existing equipment's quantity in the database
                const updatedQuantity = parseInt(existingEquipment.stock_quantity, 10) + parseInt(values.stock_quantity, 10);
                // Update the existing equipment's quantity in the database
                await createEquipment({
                    ...existingEquipment,
                    stock_quantity: updatedQuantity,
                    img_path: fileList.length > 0 && fileList[0].originFileObj ? fileList[0].originFileObj : existingEquipment.img_path,
                    unit: values.unit !== undefined ? values.unit : existingEquipment.unit,
                    amount: values.amount !== undefined ? values.amount : existingEquipment.amount,
                    management_location: values.management_location !== undefined ? values.management_location : existingEquipment.management_location,
                    usefulness: values.usefulness !== undefined ? values.usefulness : existingEquipment.usefulness,
                    contant: values.contant !== undefined ? values.contant : existingEquipment.contant,
                    purchase_date: values.purchase_date ? dayjs(values.purchase_date).format('YYYY-MM-DD') : existingEquipment.purchase_date
                });
                notification.success({
                    message: '在庫数量が更新されました。',
                });
            } else {
                // Create new equipment
                const res = await createEquipment(formData);
                if (res.data) {
                    notification.success({
                        message: '登録が完成しました。',
                    });
                }
            }
            await fetchData();
            setOpenModalCreate(false);
            form.resetFields('');
            setFileList([]);
        } catch (error) {
            console.log(error);
        }
    };

    const confirmSubmit = () => {
        form.submit();
    };

    return (
        <Modal
            title="新規登録"
            width={'50vw'}
            okText="登録"
            maskClosable={false}
            open={openModalCreate}
            onCancel={() => {
                setOpenModalCreate(false);
                form.resetFields('');
                setFileList([]);
            }}
            footer={[
                <Button
                    key="cancel"
                    className="mr-1"
                    onClick={() => {
                        setOpenModalCreate(false);
                        form.resetFields('');
                    }}
                >
                    キャンセル
                </Button>,
                <Popconfirm
                    key="popconfirm"
                    placement="bottom"
                    title="確認"
                    description={
                        <span>
                            登録後は内容の変更ができません。
                            <br />
                            もう一度ご確認の上、「登録」ボタンを押してください。
                        </span>
                    }
                    okText="登録"
                    cancelText="キャンセル"
                    onConfirm={confirmSubmit}
                >
                    <Button type="primary" key="register">
                        登録
                    </Button>
                </Popconfirm>,
            ]}
        >
            <Form form={form} onFinish={onFinish} layout="vertical" className="mt-5">
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="equipment_name"
                            label="備品名"
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
                        <Form.Item name="stock_quantity" label="在庫数量">
                            <InputNumber className="w-full" min={0} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="unit"
                            label="単位"
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
                            name="amount"
                            label="金額"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber
                                className="w-full"
                                formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\¥\s?|(,*)/g, '')}
                                min={0}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="management_location" label="管理場所">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="purchase_date"
                            label="購入日"
                            rules={[
                                {
                                    required: true,
                                    message: '購入日を選択してください',
                                },
                            ]}
                            initialValue={dayjs()}
                        >
                            <DatePicker className="w-full" placeholder="" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="purchase_url"
                            label="購入先URL"
                            rules={[
                                {
                                    required: true,
                                    type: 'url',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="usefulness" label="用途">
                            <Input.TextArea autoSize />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="contant" label="備考">
                            <Input.TextArea autoSize />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="img_path" label="画像">
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
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined />}>
                                    ファイル選択
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateEquipment;
