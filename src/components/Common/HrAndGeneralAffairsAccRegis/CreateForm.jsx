import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, notification, Row, Select, Upload } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { createAccount } from '../../../services/generalAffairs.service';

const CreateForm = ({ openModalCreate, setOpenModalCreate, fetchAccount }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isTeacher, setIsTeacher] = useState(false);

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        if (values.mail && !values.mail.includes('@sky-tech.co.jp')) {
            values.mail = `${values.mail}@sky-tech.co.jp`;
        }

        if (values.date) {
            const formattedDate = dayjs(values.date).format('YYYY-MM-DD'); //date フォーマット
            formData.append('date', formattedDate);
        }

        if (values.gender) {
            values.gender === 'その他' ? null : values.gender;
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
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                form.resetFields();
                setFileList([]);
                setOpenModalCreate(false);
                fetchAccount();
            } else {
                notification.error({
                    message: '登録が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePermissionChange = (value) => {
        if (value === 20) {
            setIsTeacher(true);
            form.setFieldsValue({
                department: undefined,
                role: undefined,
            });
        } else {
            setIsTeacher(false);
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
                                        message: '権限を選択してください',
                                    },
                                ]}
                            >
                                <Select onChange={handlePermissionChange}>
                                    <Select.Option value={6}>正社員</Select.Option>
                                    <Select.Option value={7}>契約社員</Select.Option>
                                    <Select.Option value={8}>ビジネスパートナー</Select.Option>
                                    <Select.Option value={9}>個人事業主</Select.Option>
                                    <Select.Option value={20}>先生</Select.Option>
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
                                        message: '入社日を選択してください',
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
                                        required: isTeacher ? false : true,
                                        message: '部門を選択してください',
                                    },
                                ]}
                            >
                                <Select disabled={isTeacher}>
                                    <Select.Option value="Open系">Open系</Select.Option>
                                    <Select.Option value="Sap">Sap</Select.Option>
                                    <Select.Option value="InfuraCloud">Infura、Cloud</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="役職"
                                rules={[
                                    {
                                        required: isTeacher ? false : true,
                                        message: '役職を選択してください',
                                    },
                                ]}
                            >
                                <Select disabled={isTeacher}>
                                    <Select.Option value="メンバー">メンバー</Select.Option>
                                    <Select.Option value="リーダー">リーダー</Select.Option>
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
                                        message: '性別を選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={true}>男性</Select.Option>
                                    <Select.Option value={false}>女性</Select.Option>
                                    <Select.Option value={'その他'}>その他</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="写真" name="img_path">
                                <Upload
                                    listType="picture"
                                    fileList={fileList}
                                    onChange={handleChange}
                                    beforeUpload={(file) => {
                                        const isJpgOrPngOrPdf =
                                            file.type === 'image/jpeg' ||
                                            file.type === 'image/png' ||
                                            file.type === 'application/pdf';

                                        if (!isJpgOrPngOrPdf) {
                                            message.error(' JPG と PNG 以外のファイルはアップロードできません。');
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

export default CreateForm;
