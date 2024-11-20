import React from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';

const Bant = () => {
    return (
        <Row gutter={[90, 10]} className="mt-3">
            <Col span={12}>
                <Form.Item name="budget" label="予算" labelAlign="left" labelCol={{ span: 4 }} colon={false}>
                    <Select>
                        <Select.Option value="把握済み">把握済み</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="order_time" label="発注時間" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="budget_detail" label="予算詳細" labelAlign="left" labelCol={{ span: 4 }} colon={false}>
                    <InputNumber
                        className="w-full"
                        addonAfter="¥"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="selection_start_time"
                    label="選定開始時間"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 5 }}
                >
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="position" label="立場" labelAlign="left" labelCol={{ span: 4 }} colon={false}>
                    <Select>
                        <Select.Option value="決裁者">決裁者</Select.Option>
                        <Select.Option value="その他">その他</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="competitors" label="競合" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Input.TextArea
                        autoSize={{
                            maxRows: 10,
                        }}
                    />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="issues" label="課題" labelAlign="left" labelCol={{ span: 4 }} colon={false}>
                    <Select>
                        <Select.Option value="人材不足">人材不足</Select.Option>
                        <Select.Option value="残業時間">残業時間</Select.Option>
                        <Select.Option value="スキル不足">スキル不足</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="other_issues"
                    label="課題その他"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 5 }}
                >
                    <Input.TextArea
                        autoSize={{
                            maxRows: 10,
                        }}
                    />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="others" label="その他" labelAlign="left" labelCol={{ span: 4 }} colon={false}>
                    <Input.TextArea
                        autoSize={{
                            maxRows: 10,
                        }}
                    />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="referrer" label="紹介者" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Input />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default Bant;
