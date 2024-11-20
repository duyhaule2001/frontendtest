import React from 'react';
import { Form, InputNumber, Modal, notification } from 'antd';
import dayjs from 'dayjs';
import { submitDailyReportSaleWhenCheckOut } from '../../../services/sale.service';

const ReportSaleCheckout = ({ dailyReportSaleOpen, setDailyReportSaleOpen, performCheckout }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const formattedData = {
            date: dayjs().format('YYYY-MM-DD'),
            ...values,
        };
        const response = await submitDailyReportSaleWhenCheckOut(formattedData);
        if (response.data) {
            notification.success({
                message: '日報登録が成功しました。',
                style: {
                    width: 330,
                },
            });
            setDailyReportSaleOpen(false);
            form.resetFields();

            performCheckout();
        } else {
            notification.error({
                message: '登録が失敗しました。',
            });
        }
    };

    return (
        <Modal
            title="営業日報登録"
            maskClosable={false}
            open={dailyReportSaleOpen}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                form.resetFields();
                setDailyReportSaleOpen(false);
            }}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-3">
                <Form.Item label="打合せメール数" name="emailCount" rules={[{ required: true }]}>
                    <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item label="お客様別の電話掛け" name="callsToCustomers" rules={[{ required: true }]}>
                    <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item label="提案数" name="proposalCount" rules={[{ required: true }]}>
                    <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item label="面談数" name="meetingCount" rules={[{ required: true }]}>
                    <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item label="トラブル対応数" name="troubleResponseCount" rules={[{ required: true }]}>
                    <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item label="決まり数" name="closedDealsCount" rules={[{ required: true }]}>
                    <InputNumber className="w-full" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ReportSaleCheckout;
