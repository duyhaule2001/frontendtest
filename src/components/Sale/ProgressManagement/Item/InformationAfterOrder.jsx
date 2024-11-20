import React from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';

const InformationAfterOrder = () => {
    return (
        <Row gutter={[90, 10]} className="mt-3">
            <Col span={12}>
                <Form.Item name="order_date" label="受注日" labelAlign="left" labelCol={{ span: 5 }} colon={false}>
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="site_name" label="入場先名" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="quote_request_date"
                    label="見積書依頼日"
                    labelAlign="left"
                    labelCol={{ span: 5 }}
                    colon={false}
                >
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="entry_date" label="入場日" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="contract_date" label="契約日" labelAlign="left" labelCol={{ span: 5 }} colon={false}>
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="entry_id_card"
                    label="入場身分証明書（有無）"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 9 }}
                >
                    <Select>
                        <Select.Option value="有">有</Select.Option>
                        <Select.Option value="無">無</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="contract_period"
                    label="契約期間"
                    labelAlign="left"
                    labelCol={{ span: 5 }}
                    colon={false}
                >
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="entry_security_training"
                    label="入場セキュリティ教育(有無)"
                    labelAlign="left"
                    labelCol={{ span: 9 }}
                    colon={false}
                >
                    <Select>
                        <Select.Option value="有">有</Select.Option>
                        <Select.Option value="無">無</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="technician_id"
                    label="技術者番号"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 5 }}
                >
                    <InputNumber className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="onsite_email"
                    label="現場メール"
                    labelAlign="left"
                    labelCol={{ span: 5 }}
                    colon={false}
                    rules={[
                        {
                            type: 'email',
                            message: 'メールアドレスの形式が正しくありません',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="contract_type" label="契約形態" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Select>
                        <Select.Option value="SES契約">SES契約</Select.Option>
                        <Select.Option value="請負契約">請負契約</Select.Option>
                        <Select.Option value="準委任契約">準委任契約</Select.Option>
                        <Select.Option value="労働者派遣契約">労働者派遣契約</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="onsite_phone_number"
                    label="現場電話番号"
                    labelAlign="left"
                    labelCol={{ span: 5 }}
                    colon={false}
                >
                    <InputNumber className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="overtime_hours"
                    label="残業時間"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 5 }}
                >
                    <InputNumber className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="exit_scheduled_date"
                    label="退場予定日"
                    labelAlign="left"
                    labelCol={{ span: 5 }}
                    colon={false}
                >
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default InformationAfterOrder;
