import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import TitleCus from '../Common/Layout/TitleCus';
import { getAllCourse, submitDataCourse } from '../../services/teacher.service';

const DocumentUpdate = () => {
    const [form] = Form.useForm();
    const [classifications, setClassifications] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const getCourse = async () => {
        try {
            const res = await getAllCourse();
            if (res.data && Array.isArray(res.data)) {
                setClassifications(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCourse();
    }, []);

    const handleFileChange = (info) => {
        if (info.file.status === 'done') {
            setSelectedFile(info.file.originFileObj);
        }
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();

        formData.append('course', values.classification);
        formData.append('teacher_name', values.teacherName);
        formData.append('file_path', selectedFile);

        try {
            const response = await submitDataCourse(formData);
            if (response.data) {
                notification.success({
                    message: 'アップロードが成功しました。',
                });
                form.resetFields();
            } else {
                notification.error({
                    message: 'アップロードが失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-16">
            <TitleCus title={'資料アップデート'} />
            <div className="mt-10 flex justify-center">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="w-full max-w-md rounded-lg bg-white p-6 shadow-md"
                >
                    <Form.Item
                        label="分類"
                        name="classification"
                        rules={[{ required: true, message: 'コース分類を選択してください' }]}
                    >
                        <Select placeholder="コース分類を選択してください">
                            {classifications.map((classification) => (
                                <Select.Option key={classification.id} value={classification.title}>
                                    {classification.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="氏名" name="teacherName" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="ファイルアップロード"
                        name="file"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList}
                        rules={[{ required: true, message: 'ファイルをアップロードしてください' }]}
                    >
                        <Upload beforeUpload={() => false} onChange={handleFileChange}>
                            <Button icon={<UploadOutlined />}>ファイルを選択</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            アップロード
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default DocumentUpdate;
