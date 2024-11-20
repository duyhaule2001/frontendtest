import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Image, Input, Modal, Row, Select, Upload, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { updateAccount } from '../../../services/generalAffairs.service';

const UpdateAccPresident = ({ openModalUpdate, setOpenModalUpdate, selectedItemUpdate, fetchAccount }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState(selectedItemUpdate?.img_path || '');

    useEffect(() => {
        if (selectedItemUpdate) {
            const formattedData = {
                ...selectedItemUpdate,
                mail: selectedItemUpdate.mail ? selectedItemUpdate.mail.split('@sky-tech.co.jp')[0] : '',
                date: selectedItemUpdate.date ? dayjs(selectedItemUpdate.date) : null,
            };
            form.setFieldsValue(formattedData);
            setPreviewImage(selectedItemUpdate.img_path || '');
        }
    }, [selectedItemUpdate, openModalUpdate]);

    //先生を選ぶと部門と役職が選べない
    const permissionsValue = Form.useWatch('permissions', form);
    React.useEffect(() => {
        if (permissionsValue === 20) {
            form.setFieldsValue({
                department: undefined,
                role: undefined,
            });
        }
    }, [permissionsValue]);

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            const newImage = URL.createObjectURL(fileList[0].originFileObj);
            setPreviewImage(newImage);
        }
    };

    const onFinish = async (values) => {
        const formattedValues = {
            ...values,
            date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        };

        if (values.mail && !values.mail.includes('@sky-tech.co.jp')) {
            formattedValues.mail = `${values.mail}@sky-tech.co.jp`;
        }

        const formData = new FormData();

        Object.keys(formattedValues).forEach((key) => {
            formData.append(key, formattedValues[key]);
        });

        if (fileList.length > 0) {
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('img_path', file.originFileObj);
                }
            });
        }

        try {
            const res = await updateAccount(selectedItemUpdate.id, formData);
            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalUpdate(false);
                setFileList([]);
                setPreviewImage('');
                await fetchAccount();
            } else {
                notification.error({
                    message: '修正が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                title="情報修正"
                width={'50%'}
                okText="登録"
                cancelText="キャンセル"
                maskClosable={false}
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields();
                    setFileList([]);
                    setPreviewImage('');
                }}
            >
                <Form form={form} onFinish={onFinish} layout="vertical" className="mt-2 w-full">
                    <Row gutter={40}>
                        <Col span={12}>
                            <Form.Item name="name" label="名前">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="mail" label="メールアドレス">
                                <Input addonAfter="@sky-tech.co.jp" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="permissions" label="権限">
                                <Select>
                                    <Select.Option value={20}>先生</Select.Option>
                                    <Select.Option value={0}>役員</Select.Option>
                                    <Select.Option value={2}>人事部</Select.Option>
                                    <Select.Option value={3}>総務部</Select.Option>
                                    <Select.Option value={1}>BP推進部</Select.Option>
                                    <Select.Option value={10}>DX事業部</Select.Option>
                                    <Select.Option value={4}>営業部(Sap)</Select.Option>
                                    <Select.Option value={5}>営業部(Open)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="date" label="入社日">
                                <DatePicker className="w-full" placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="department"
                                label="部門"
                                rules={[
                                    {
                                        required: permissionsValue !== 20,
                                        message: 'このフィールドは空白にできません。',
                                    },
                                ]}
                            >
                                <Select disabled={permissionsValue === 20}>
                                    <Select.Option value="役員">役員</Select.Option>
                                    <Select.Option value="財務部">財務部</Select.Option>
                                    <Select.Option value="総務部">総務部</Select.Option>
                                    <Select.Option value="人事部">人事部</Select.Option>
                                    <Select.Option value="DX営業部">DX営業部</Select.Option>
                                    <Select.Option value="ERP営業部">ERP営業部</Select.Option>
                                    <Select.Option value="エンドユーザー様営業部">エンドユーザー様営業部</Select.Option>
                                    <Select.Option value="ITソリューション営業部">ITソリューション営業部</Select.Option>
                                    <Select.Option value="ビジネスパートナ推進部">ビジネスパートナ推進部</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="役職"
                                rules={[
                                    {
                                        required: permissionsValue !== 20,
                                        message: 'このフィールドは空白にできません。',
                                    },
                                ]}
                            >
                                <Select disabled={permissionsValue === 20}>
                                    <Select.Option value="部長">部長</Select.Option>
                                    <Select.Option value="課長">課長</Select.Option>
                                    <Select.Option value="系長">系長</Select.Option>
                                    <Select.Option value="部員">部員</Select.Option>
                                    <Select.Option value="役員">役員</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="gender" label="性別">
                                <Select>
                                    <Select.Option value={true}>男性</Select.Option>
                                    <Select.Option value={false}>女性</Select.Option>
                                    <Select.Option value={null}>その他</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="enrollmentStatus" label="在籍状態">
                                <Select>
                                    <Select.Option value={true}>在籍</Select.Option>
                                    <Select.Option value={false}>退職</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="" name="img_path" className="flex flex-col items-center">
                                <div className="flex flex-col items-center">
                                    {previewImage && (
                                        <Image
                                            width={50}
                                            height={50}
                                            src={previewImage}
                                            alt="Current Image"
                                            className="mb-2 rounded-full"
                                            preview={{
                                                mask: <EyeOutlined style={{ fontSize: 15, color: 'white' }} />,
                                            }}
                                        />
                                    )}
                                    <Upload
                                        listType="picture"
                                        fileList={fileList}
                                        onChange={handleChange}
                                        beforeUpload={(file) => {
                                            const isJpgOrPngOrPdf =
                                                file.type === 'image/jpeg' || file.type === 'image/png';

                                            if (!isJpgOrPngOrPdf) {
                                                message.error(' JPG と PNG 以外のファイルはアップロードできません。');
                                            }

                                            return false;
                                        }}
                                        className="mt-2"
                                        multiple={false}
                                        maxCount={1}
                                    >
                                        <Button icon={<UploadOutlined />}>新しい写真をアップロード</Button>
                                    </Upload>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateAccPresident;
