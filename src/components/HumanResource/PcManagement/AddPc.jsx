import { Button, DatePicker, Form, Input, Modal, notification, Radio, Select, Upload } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { registerPC } from '../../../services/hr.service';
import { UploadOutlined } from '@ant-design/icons';

const AddPc = ({ setOpenAddPc, openAddPc, fetchData }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
            application_date: values.application_date ? dayjs(values.application_date).format('YYYY-MM-DD') : null,
            return_date: values.return_date ? dayjs(values.return_date).format('YYYY-MM-DD') : null,
        };

        const data = new FormData();
        Object.keys(formattedValues).forEach((key) => {
            if (formattedValues[key] !== null) {
                data.append(key, formattedValues[key]);
            }
        });

        if (fileList.length > 0) {
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    data.append('file', file.originFileObj);
                }
            });
        }

        try {
            console.error(data);
            await registerPC(data);
            notification.success({
                message: '登録が成功しました。',
            });
            setOpenAddPc(false);
            await fetchData();
            form.resetFields('');
            setFileList([]);
        } catch (error) {
            console.error('エラーが発生しました。', error);
        }
    };

    return (
        <>
            <Modal
                title="新規登録"
                okText="登録"
                cancelText="キャンセル"
                width={'50%'}
                maskClosable={false}
                open={openAddPc}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenAddPc(false);
                    form.resetFields('');
                    setFileList([]);
                }}
            >
                <Form
                    form={form}
                    name="PC貸出登録"
                    layout="vertical"
                    className="grid grid-cols-2 gap-x-9 gap-y-4"
                    onFinish={handleSubmit}
                    initialValues={{
                        returnStatus: '未',
                    }}
                >
                    <Form.Item
                        label="登録日付"
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: '日付を選択してください！',
                            },
                        ]}
                        initialValue={dayjs()}
                    >
                        <DatePicker placeholder="" className="w-full" />
                    </Form.Item>
                    <Form.Item
                        label="メールアドレス"
                        name="mail"
                        rules={[
                            {
                                type: 'email',
                                required: true,
                                message: 'メールアドレスは有効なメールではありません',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="氏名"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '氏名を入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="管理番号（パソコンの番号）"
                        name="pc_num"
                        rules={[
                            {
                                required: true,
                                message: '管理番号を入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="申請日"
                        name="application_date"
                        rules={[
                            {
                                required: true,
                                message: '申請日を選択してください！',
                            },
                        ]}
                    >
                        <DatePicker placeholder="" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="場所"
                        name="location"
                        rules={[
                            {
                                required: true,
                                message: '場所を選択してください！',
                            },
                        ]}
                    >
                        <Select className="w-full">
                            <Select.Option value="社内">社内</Select.Option>
                            <Select.Option value="社外">社外</Select.Option>
                            <Select.Option value="自宅">自宅</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="使用者区分"
                        name="user_classification"
                        rules={[
                            {
                                required: true,
                                message: '使用者区分を選択してください！',
                            },
                        ]}
                    >
                        <Select className="w-full">
                            <Select.Option value={1}>営業</Select.Option>
                            <Select.Option value={3}>役員</Select.Option>
                            <Select.Option value={4}>技術者</Select.Option>
                            <Select.Option value={2}>管理本部</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="使用者の担当営業名"
                        name="user_sale"
                        rules={[
                            {
                                required: true,
                                message: '使用者の担当営業を入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="前使用者の担当営業名"
                        name="before_user_sale"
                        rules={[
                            {
                                required: true,
                                message: '前使用者の担当営業を入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="前使用者の返却日"
                        name="return_date"
                        rules={[
                            {
                                required: true,
                                message: '前使用者の返却日を入力してください！',
                            },
                        ]}
                    >
                        <DatePicker placeholder="" className="w-full" />
                    </Form.Item>
                    <Form.Item
                        label="アカウント名"
                        name="account"
                        rules={[
                            {
                                required: true,
                                message: 'アカウント名を入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="PCパスワード"
                        name="pc_password"
                        rules={[
                            {
                                required: true,
                                message: 'PC パスワードを入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="管理者アカウント名"
                        name="manager_account"
                        rules={[
                            {
                                required: true,
                                message: '管理者アカウント名を入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="管理者パスワード"
                        name="manager_password"
                        rules={[
                            {
                                required: true,
                                message: '管理者パスワードを入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="備考" name="other">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="担当者名"
                        name="manager"
                        rules={[
                            {
                                required: true,
                                message: '担当者の名前を入力してください！',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="本人確認"
                        name="confirmation"
                        rules={[
                            {
                                required: true,
                                message: '確認してください！',
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={0}> 未確認 </Radio>
                            <Radio value={1}> 確認済み </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="写真" name="file">
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
                            <Button icon={<UploadOutlined />}>ファイル選択</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddPc;
