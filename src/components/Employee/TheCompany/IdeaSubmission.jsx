import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, notification, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { submitIdea } from '../../../services/employee.service';
import TitleCus from '../../Common/Layout/TitleCus';

const IdeaSubmissions = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const user = useSelector((state) => state.account.user);

    useEffect(() => {
        const currentDate = new Date().toISOString().slice(0, 10);
        form.setFieldsValue({ date: currentDate });
    }, [form]);

    const onFileChange = ({ fileList }) => {
        setFileList(fileList);
        form.setFieldsValue({ fileList }); // Đặt giá trị fileList vào form để kiểm tra
    };

    const handleSubmit = async (values) => {
        if (fileList.length === 0) {
            notification.error({
                message: 'ファイルを添付してください',
                style: {
                    width: 270,
                },
            });
            return;
        }

        const formData = new FormData();
        formData.append('date', values.date);
        formData.append('contactAddress', values.contactAddress || '');
        formData.append('projectTitle', values.projectTitle);
        formData.append('projectPeriod', values.projectPeriod);
        formData.append('content', values.content);
        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj);
        }

        const res = await submitIdea(formData);
        if (res.data) {
            form.resetFields();
            setFileList([]);
            notification.success({
                message: '登録が成功しました。',
                style: {
                    width: 270,
                },
            });
        } else {
            notification.error({
                message: '登録が失敗しました。',
                style: {
                    width: 270,
                },
            });
        }
    };

    return (
        <div>
            <TitleCus title={'アイディア募集'} />
            <div className="mx-auto flex max-w-screen-md items-center justify-center px-4 py-8 lg:py-16">
                <div className="w-full">
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        className="space-y-8 rounded-lg border border-gray-300 p-6"
                    >
                        <Row gutter={24}>
                            <Form.Item label="日付" name="date" hidden>
                                <Input readOnly />
                            </Form.Item>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="プロジェクトタイトル"
                                    name="projectTitle"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="プロジェクト期間" name="projectPeriod" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="連絡先" name="contactAddress">
                                    <Input placeholder="入力しなくても大丈夫です。" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="内容" name="content" rules={[{ required: true }]}>
                                    <Input.TextArea autoSize />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="ファイル添付"
                                    name="fileList"
                                    rules={[{ required: true, message: 'ファイルを添付してください' }]}
                                >
                                    <Upload fileList={fileList} beforeUpload={() => false} onChange={onFileChange}>
                                        <Button icon={<UploadOutlined />}>ファイル選択</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item className="flex items-center justify-center">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    >
                                        登録
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default IdeaSubmissions;
