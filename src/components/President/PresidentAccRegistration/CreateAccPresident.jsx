import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, notification, Row, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { createAccount } from '../../../services/generalAffairs.service';

const CreateAccPresident = ({ openModalCreate, setOpenModalCreate, fetchAccount }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    //権限を選んだら、部門が自動的にセットされる
    const permissionsValue = Form.useWatch('permissions', form);
    useEffect(() => {
        switch (permissionsValue) {
            case 20: // 先生
                form.setFieldsValue({
                    department: undefined,
                    role: undefined,
                });
                break;
            case 2: // 人事部
                form.setFieldsValue({
                    department: '人事部',
                });
                break;
            case 3: // 総務部
                form.setFieldsValue({
                    department: '総務部',
                });
                break;
            case 4: // 営業（SAP）
                form.setFieldsValue({
                    department: 'ERP営業部',
                });
                break;
            case 5: // 営業（Open）
                form.setFieldsValue({
                    department: 'ITソリューション営業部',
                });
                break;
            case 1: // BP推薦部
                form.setFieldsValue({
                    department: 'ビジネスパートナー推薦部',
                });
                break;
            case 10: // DX事業部
                form.setFieldsValue({
                    department: 'DX営業部',
                });
                break;
            case 0: // 役員
                form.setFieldsValue({
                    department: '役員',
                    role: '役員',
                });
                break;
            default:
                form.setFieldsValue({
                    department: undefined,
                });
                break;
        }
    }, [permissionsValue]);

    const onFinish = async (values) => {
        const formData = new FormData();

        if (values.mail && !values.mail.includes('@sky-tech.co.jp')) {
            values.mail = `${values.mail}@sky-tech.co.jp`;
        }

        if (values.date) {
            const formattedDate = dayjs(values.date).format('YYYY-MM-DD'); //date フォーマット
            formData.append('date', formattedDate);
        }

        Object.keys(values).forEach((key) => {
            if (key !== 'date') {
                formData.append(key, values[key]);
            }
        });

        if (fileList.length > 0) {
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('img_path', file.originFileObj);
                }
            });
        }

        try {
            const res = await createAccount(formData);
            if (res.data) {
                notification.success({
                    message: 'アカウント作成が成功しました。',
                    style: {
                        width: 330,
                    },
                });
                form.resetFields();
                fetchAccount();
                setOpenModalCreate(false);
                setFileList([]);
            } else {
                notification.error({
                    message: '作成が失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Modal
                title="新規登録"
                width={'50%'}
                okText="登録"
                cancelText="キャンセル"
                maskClosable={false}
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                    setFileList([]);
                }}
            >
                <Form form={form} onFinish={onFinish} layout="vertical" className="mt-2 w-full">
                    <Row gutter={40}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="名前"
                                rules={[
                                    {
                                        required: true,
                                        message: 'このフィールドは空白にできません。',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="mail"
                                label="メールアドレス"
                                rules={[
                                    {
                                        required: true,
                                        message: 'このフィールドは空白にできません。',
                                    },
                                ]}
                            >
                                <Input addonAfter="@sky-tech.co.jp" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="permissions"
                                label="権限"
                                rules={[
                                    {
                                        required: true,
                                        message: 'このフィールドは空白にできません。',
                                    },
                                ]}
                            >
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
                            <Form.Item
                                name="date"
                                label="入社日"
                                rules={[
                                    {
                                        required: true,
                                        message: 'このフィールドは空白にできません。',
                                    },
                                ]}
                            >
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
                            <Form.Item
                                name="gender"
                                label="性別"
                                rules={[
                                    {
                                        required: true,
                                        message: 'このフィールドは空白にできません。',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={true}>男性</Select.Option>
                                    <Select.Option value={false}>女性</Select.Option>
                                    <Select.Option value={null}>その他</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="画像" name="img_path">
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
                                    <Button icon={<UploadOutlined />}>アップロード</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default CreateAccPresident;
