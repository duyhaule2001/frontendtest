import React from 'react';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';

const BasicInformation = () => {
    return (
        <Row gutter={[90, 10]} className="mt-3">
            <Col span={12}>
                <Form.Item
                    name="register_date"
                    label="日付"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 6 }}
                    rules={[
                        {
                            required: true,
                            message: '日付を選択してください',
                        },
                    ]}
                >
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="importance" label="重要度" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Select>
                        <Select.Option value="高">高</Select.Option>
                        <Select.Option value="中">中</Select.Option>
                        <Select.Option value="低">低</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="negotiation_name"
                    label="商談名"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 6 }}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="probability" label="確度" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Select>
                        <Select.Option value="25%">25%</Select.Option>
                        <Select.Option value="50%">50%</Select.Option>
                        <Select.Option value="75%">75%</Select.Option>
                        <Select.Option value="100%">100%</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="project_name"
                    label="プロジェクト名"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 6 }}
                >
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="source" label="ソース" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Select>
                        <Select.Option value="DM">DM</Select.Option>
                        <Select.Option value="WEB">WEB</Select.Option>
                        <Select.Option value="紹介">紹介</Select.Option>
                        <Select.Option value="その他">その他</Select.Option>
                        <Select.Option value="展示会">展示会</Select.Option>
                        <Select.Option value="セミナー">セミナー</Select.Option>
                        <Select.Option value="既存願客">既存願客</Select.Option>
                        <Select.Option value="新規テレアポ">新規テレアポ</Select.Option>
                        <Select.Option value="先方からの電話">先方からの電話</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="company_name"
                    label="会社名"
                    labelAlign="left"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    colon={false}
                    labelCol={{ span: 6 }}
                >
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="proposed_engineer"
                    label="提案技術者"
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
                <Form.Item
                    name="client_department"
                    label="願客担当部署"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 6 }}
                >
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="negotiation_amount"
                    label="相談金額"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 5 }}
                >
                    <InputNumber
                        className="w-full"
                        addonAfter="¥"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="client_sales_person"
                    label="願客担当営業"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 6 }}
                >
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="scope_of_work" label="担当範囲" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Select>
                        <Select.Option value="開発">開発</Select.Option>
                        <Select.Option value="基本設計">基本設計</Select.Option>
                        <Select.Option value="保守運用">保守運用</Select.Option>
                        <Select.Option value="移行案件">移行案件</Select.Option>
                        <Select.Option value="コンサルティング">コンサルティング</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="project_category"
                    label="プロジェクト分類"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 6.5 }}
                    rules={[
                        {
                            required: true,
                            message: 'プロジェクト分類を選択してください',
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="SAP">SAP</Select.Option>
                        <Select.Option value="OPEN系">OPEN系</Select.Option>
                        <Select.Option value="InfraCloud">Infra、Cloud</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="contract_period_other"
                    label="契約期間その他"
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
                <Form.Item name="sales_person" label="営業担当" labelAlign="left" colon={false} labelCol={{ span: 6 }}>
                    <Input />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="expected_order_period"
                    label="受注見込期間"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 5 }}
                >
                    <DatePicker placeholder="" className="w-full" />
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item
                    name="negotiation_status"
                    label="商談状況"
                    labelAlign="left"
                    colon={false}
                    labelCol={{ span: 6 }}
                    rules={[
                        {
                            required: true,
                            message: '商談状況を選択してください',
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="面談">面談</Select.Option>
                        <Select.Option value="失注">失注</Select.Option>
                        <Select.Option value="受注">受注</Select.Option>
                        <Select.Option value="発掘案件">発掘案件</Select.Option>
                        <Select.Option value="電話提案">電話提案</Select.Option>
                        <Select.Option value="メール提案">メール提案</Select.Option>
                        <Select.Option value="打ち合わせ">打ち合わせ</Select.Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="lost_reason" label="失注理由" labelAlign="left" colon={false} labelCol={{ span: 5 }}>
                    <Input.TextArea
                        autoSize={{
                            maxRows: 10,
                        }}
                    />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default BasicInformation;
