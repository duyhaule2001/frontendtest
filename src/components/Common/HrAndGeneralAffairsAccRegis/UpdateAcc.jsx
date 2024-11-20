import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Image, Input, Modal, Row, Select, Upload, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { updateAccount } from '../../../services/generalAffairs.service';

const UpdateAccGad = ({ openModalUpdate, setOpenModalUpdate, selectedItemUpdate, fetchAccount }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState(selectedItemUpdate?.img_path || '');

    useEffect(() => {
        if (selectedItemUpdate) {
            const formattedData = {
                ...selectedItemUpdate,
                mail: selectedItemUpdate.mail ? selectedItemUpdate.mail.split('@sky-tech.co.jp')[0] : '',
                date: selectedItemUpdate.date ? dayjs(selectedItemUpdate.date) : null,
                gender: selectedItemUpdate.gender === null ? 'その他' : selectedItemUpdate.gender,
            };
            form.setFieldsValue(formattedData);
            setPreviewImage(selectedItemUpdate.img_path || '');
        }
    }, [selectedItemUpdate, openModalUpdate]);

    const handleChange = ({ fileList }) => {
        const isValidFile = fileList[0] && (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png');

        if (isValidFile) {
            setFileList(fileList);
            const newImage = URL.createObjectURL(fileList[0].originFileObj);
            setPreviewImage(newImage);
        } else {
            setFileList([]);
            setPreviewImage('');
            message.error('JPG と PNG 以外のファイルはアップロードできません。');
        }
    };

    const onFinish = async (values) => {
        const formattedValues = {
            ...values,
            date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
            gender: values.gender === 'その他' ? null : values.gender,
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
                                    <Select.Option value={6}>正社員</Select.Option>
                                    <Select.Option value={7}>契約社員</Select.Option>
                                    <Select.Option value={8}>ビジネスパートナー</Select.Option>
                                    <Select.Option value={9}>個人事業主</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="date" label="入社日">
                                <DatePicker className="w-full" placeholder="" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="department" label="部門">
                                <Select>
                                    <Select.Option value="Open系">Open系</Select.Option>
                                    <Select.Option value="Sap">Sap</Select.Option>
                                    <Select.Option value="infuraCloud">インフラ、クラウド</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="role" label="役職">
                                <Select>
                                    <Select.Option value="リーダー">リーダー</Select.Option>
                                    <Select.Option value="メンバー">メンバー</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="gender" label="性別">
                                <Select>
                                    <Select.Option value={true}>男性</Select.Option>
                                    <Select.Option value={false}>女性</Select.Option>
                                    <Select.Option value={'その他'}>その他</Select.Option>
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
                                            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                            if (!isJpgOrPng) {
                                                message.error('JPG と PNG 以外のファイルはアップロードできません。');
                                            }
                                            return isJpgOrPng ? false : Upload.LIST_IGNORE;
                                        }}
                                        className="mt-2"
                                        multiple={false}
                                        maxCount={1}
                                    >
                                        <Button icon={<UploadOutlined />}>写真をアップロード</Button>
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

export default UpdateAccGad;
