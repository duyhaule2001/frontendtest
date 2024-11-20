import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { submitIdea } from '../../../services/employee.service';
import TitleCus from '../../../components/Common/Layout/Title/TitleCus';

const IdeaSubmission = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const currentDate = new Date().toISOString().slice(0, 10);
        form.setFieldsValue({ date: currentDate });
    }, [form]);

    const onFileChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('date', values.date);
        formData.append('contactAddress', values.contactAddress || '');
        formData.append('projectTitle', values.projectTitle);
        formData.append('projectPeriod', values.projectPeriod);
        formData.append('content', values.content);
        if (fileList.length > 0) {
            formData.append('file', fileList[0].originFileObj);
        }

        // Log formData entries
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const res = await submitIdea(formData);
        if (res.data) {
            form.resetFields();
            setFileList([]);
            notification.success({
                message: 'アイディア送信が成功しました。',
            });
        } else {
            notification.error({
                message: 'エラー',
                description: '送信中にエラーが発生しました。',
            });
        }
    };

    return (
        <section className="mt-16 min-h-screen bg-white">
            <TitleCus title={'アイディア募集'} />
            <div className="mx-auto flex max-w-screen-md items-center justify-center px-4 py-8 lg:py-16">
                <div className="w-full">
                    <Form form={form} onFinish={handleSubmit} layout="vertical" className="space-y-8">
                        <Form.Item label="日付" name="date">
                            <Input readOnly />
                        </Form.Item>

                        <Form.Item label="連絡先" name="contactAddress">
                            <Input placeholder="入力しなくても大丈夫です。" />
                        </Form.Item>

                        <Form.Item
                            label="プロジェクトタイトル"
                            name="projectTitle"
                            rules={[{ required: true, message: 'この項目は必須です!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="プロジェクト期間"
                            name="projectPeriod"
                            rules={[{ required: true, message: 'この項目は必須です!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="内容"
                            name="content"
                            rules={[{ required: true, message: 'この項目は必須です!' }]}
                        >
                            <Input.TextArea rows={6} />
                        </Form.Item>

                        <Form.Item label="ファイルをアップロード">
                            <Upload fileList={fileList} beforeUpload={() => false} onChange={onFileChange}>
                                <Button icon={<UploadOutlined />}>ファイルを選択</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="rounded-lg bg-blue-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                            >
                                送信
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </section>
    );
};

export default IdeaSubmission;
