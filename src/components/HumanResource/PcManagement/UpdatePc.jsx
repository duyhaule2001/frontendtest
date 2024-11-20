import { Button, DatePicker, Form, Image, Input, Modal, notification, Radio, Select, Upload } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { updatePcApi } from '../../../services/hr.service';
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';

const UpdatePc = ({ isInfoOpen, setIsInfoOpen, selectedPc, setLoading, fetchData }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState(selectedPc?.img_path || '');

    useEffect(() => {
        if (selectedPc) {
            form.setFieldsValue({
                ...selectedPc,
                application_date: selectedPc.application_date ? dayjs(selectedPc.application_date) : null,
                return_date: selectedPc.return_date ? dayjs(selectedPc.return_date) : null,
                date: selectedPc.date ? dayjs(selectedPc.date) : null,
                confirmation: selectedPc.confirmation === 0 ? 0 : 1,
                other: selectedPc.other === 'undefined' ? '' : selectedPc.other,
            });
        }
    }, [selectedPc, isInfoOpen]);

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            const newImage = URL.createObjectURL(fileList[0].originFileObj);
            setPreviewImage(newImage);
        }
    };

    const onFinish = async (values) => {
        const updatedPcInfo = {
            ...selectedPc,
            ...values,
            application_date: values.application_date ? values.application_date.format('YYYY-MM-DD') : null,
            return_date: values.return_date ? values.return_date.format('YYYY-MM-DD') : null,
            date: values.date ? values.date.format('YYYY-MM-DD') : null,
        };

        const formData = new FormData();
        Object.keys(updatedPcInfo).forEach((key) => {
            formData.append(key, updatedPcInfo[key]);
        });

        if (fileList.length > 0) {
            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('file', file.originFileObj);
                }
            });
        }

        setLoading(true);
        try {
            const res = await updatePcApi(formData);

            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setIsInfoOpen(false);
                await fetchData();
            }
        } catch (error) {
            notification.error({
                message: '修正が失敗しました。',
            });
        }
        setLoading(false);
    };

    return (
        <>
            <Modal
                title="PC情報修正"
                okText="登録"
                width={'50vw'}
                maskClosable={false}
                open={isInfoOpen}
                onOk={() => form.submit()}
                onCancel={() => {
                    setIsInfoOpen(false);
                    setFileList([]);
                }}
            >
                <Form
                    form={form}
                    name="PC貸出修正"
                    onFinish={onFinish}
                    layout="vertical"
                    className="grid grid-cols-2 gap-x-9 gap-y-4"
                >
                    <Form.Item hidden label="id" name="id">
                        <Input />
                    </Form.Item>
                    <Form.Item label="登録日付" name="date">
                        <DatePicker onChange={(date) => form.setFieldValue('date', date)} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="メールアドレス" name="mail">
                        <Input />
                    </Form.Item>
                    <Form.Item label="氏名" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="管理番号" name="pc_num">
                        <Input />
                    </Form.Item>
                    <Form.Item label="申請日" name="application_date">
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item label="場所" name="location">
                        <Select className="w-full">
                            <Select.Option value="社内">社内</Select.Option>
                            <Select.Option value="社外">社外</Select.Option>
                            <Select.Option value="自宅">自宅</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="使用者区分" name="user_classification">
                        <Select className="w-full">
                            <Select.Option value={1}>営業</Select.Option>
                            <Select.Option value={2}>管理本部</Select.Option>
                            <Select.Option value={3}>役員</Select.Option>
                            <Select.Option value={4}>技術者</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="使用者（担当営業)" name="user_sale">
                        <Input />
                    </Form.Item>
                    <Form.Item label="前使用者（担当営業)" name="before_user_sale">
                        <Input />
                    </Form.Item>
                    <Form.Item label="前使用者の返却日" name="return_date">
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item label="アカウント名" name="account">
                        <Input />
                    </Form.Item>
                    <Form.Item label="PC パスワード" name="pc_password">
                        <Input />
                    </Form.Item>
                    <Form.Item label="管理者アカウント名" name="manager_account">
                        <Input />
                    </Form.Item>
                    <Form.Item label="管理者パスワード" name="manager_password">
                        <Input />
                    </Form.Item>
                    <Form.Item label="備考" name="other">
                        <Input />
                    </Form.Item>
                    <Form.Item label="担当者" name="manager">
                        <Input />
                    </Form.Item>
                    <Form.Item label="本人確認" name="confirmation">
                        <Radio.Group>
                            <Radio value={1}> 確認済み </Radio>
                            <Radio value={0}> 未確認 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="画像" name="file">
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
                            multiple={false}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>アップロード</Button>
                        </Upload>
                    </Form.Item>
                    {previewImage && (
                        <Image
                            width={50}
                            height={50}
                            src={previewImage}
                            alt="Current Image"
                            style={{ borderRadius: '50%', marginBottom: '10px' }}
                            preview={{
                                mask: <EyeOutlined style={{ fontSize: 15, color: 'white' }} />,
                            }}
                        />
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default UpdatePc;
