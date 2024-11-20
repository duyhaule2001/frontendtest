import React from 'react';
import { Form, Modal, notification, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { createNoticeAPI } from '../../../services/hr.service';

const CreateNotice = ({ setCreateNotice, createNotice, fetchData, selectedDate }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        };

        try {
            const response = await createNoticeAPI(formattedValues);

            if (response.data) {
                notification.success({
                    message: '作成が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setCreateNotice(false);
                form.resetFields();
                await fetchData(selectedDate);
            } else {
                notification.error({
                    message: '作成が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            notification.error({
                message: '作成が失敗しました。',
            });
        }
    };

    return (
        <Modal
            title="新規お知らせ登録"
            maskClosable={false}
            open={createNotice}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                form.resetFields();
                setCreateNotice(false);
            }}
            width={'50%'}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    initialValue={dayjs()}
                    label="日付"
                    name="date"
                    rules={[{ required: true, message: '日付を選択してください' }]}
                >
                    <DatePicker placeholder="" />
                </Form.Item>
                <Form.Item label="区分" name="type" rules={[{ required: true, message: '区分を選択してください' }]}>
                    <Select>
                        <Select.Option value="activate">社内活動</Select.Option>
                        <Select.Option value="notice">お知らせ</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="内容" name="content" rules={[{ required: true }]}>
                    <TextArea rows={14} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateNotice;
