import React, { useEffect } from 'react';
import { Form, Modal, notification, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { updateNoticeAPI } from '../../../services/hr.service';

const UpdateNotice = ({ setUpdateNotice, updateNotice, selectedNotice, fetchData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedNotice) {
            form.setFieldsValue({
                date: selectedNotice.date ? dayjs(selectedNotice.date) : null,
                type: selectedNotice.type,
                content: selectedNotice.content,
            });
        }
    }, [selectedNotice, updateNotice, form]);

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        };

        try {
            const response = await updateNoticeAPI(selectedNotice.id, formattedValues);
            if (response.data) {
                notification.success({
                    message: '更新が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setUpdateNotice(false);
                await fetchData();
            } else {
                notification.error({
                    message: '更新が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            notification.error({
                message: '更新が失敗しました。',
            });
        }
    };

    return (
        <Modal
            title="お知らせ情報修正"
            maskClosable={false}
            open={updateNotice}
            onOk={() => form.submit()}
            okText="更新"
            cancelText="キャンセル"
            onCancel={() => {
                {
                    setUpdateNotice(false);
                    form.resetFields();
                }
            }}
            width={'50%'}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="日付" name="date" rules={[{ required: true, message: '日付を入力してください！' }]}>
                    <DatePicker placeholder="日付を選択してください" className="w-full" />
                </Form.Item>
                <Form.Item label="区分" name="type" rules={[{ required: true, message: '区分を選択してください！' }]}>
                    <Select placeholder="区分を選択してください">
                        <Select.Option value="activate">社内活動</Select.Option>
                        <Select.Option value="notice">お知らせ</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '内容を入力してください！' }]}
                >
                    <TextArea rows={14} placeholder="内容を入力してください" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateNotice;
