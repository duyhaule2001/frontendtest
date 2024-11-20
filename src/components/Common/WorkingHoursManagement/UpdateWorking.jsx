import { AutoComplete, Col, DatePicker, Form, Input, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { updateWorkingUser } from '../../../services/common.service';

const UpdateWorking = ({ openUpdateModal, setOpenUpdateModal, itemUpdate, fetchWorkingData, currentMonth }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (itemUpdate && itemUpdate.id) {
            const formattedItemUpdate = {
                ...itemUpdate,
                settlement_date: itemUpdate.settlement_date ? dayjs(itemUpdate.settlement_date) : null,
            };
            form.setFieldsValue(formattedItemUpdate);
        }
    }, [itemUpdate]);

    //計算簡易用
    const numberOptions = [];
    for (let i = 120; i <= 230; i += 10) {
        numberOptions.push(i);
    }

    const handleSubmit = async (values) => {
        const calculationRange = `${values.rangeStart}-${values.rangeEnd}`;
        const formattedValues = {
            ...values,
            calculation_range: calculationRange,
            settlement_date: itemUpdate.settlement_date ? dayjs(itemUpdate.settlement_date).format('YYYY-MM-DD') : null,
        };
        try {
            const res = await updateWorkingUser(values.id, formattedValues);
            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                });
                setOpenUpdateModal(false);
                await fetchWorkingData(currentMonth);
            } else {
                notification.error({
                    message: '修正が失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                title="情報修正"
                width={'50vw'}
                open={openUpdateModal}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenUpdateModal(false);
                }}
                maskClosable={false}
            >
                <Form name="" className="mt-5" onFinish={handleSubmit} form={form} autoComplete="off" layout="vertical">
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label="id" name="id" hidden>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="社員番号" name="employeeNumber">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="氏名" name="name">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="現場" name="site_name">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="合計稼時間" name="total_uptime">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="精算範囲">
                                <div className="flex space-x-3">
                                    <Form.Item
                                        name="rangeStart"
                                        rules={[{ required: true, message: '最小値を入力してください' }]}
                                    >
                                        <AutoComplete
                                            options={numberOptions.map((num) => ({
                                                value: num.toString(),
                                            }))}
                                            filterOption={(inputValue, option) =>
                                                option.value.indexOf(inputValue) !== -1
                                            }
                                        >
                                            <Input
                                                min={120}
                                                max={230}
                                                placeholder="最小値"
                                                style={{
                                                    appearance: 'textfield',
                                                    MozAppearance: 'textfield',
                                                    WebkitAppearance: 'none',
                                                }}
                                            />
                                        </AutoComplete>
                                    </Form.Item>

                                    <Form.Item
                                        name="rangeEnd"
                                        rules={[{ required: true, message: '最大値を入力してください' }]}
                                    >
                                        <AutoComplete
                                            options={numberOptions.map((num) => ({
                                                value: num.toString(),
                                            }))}
                                            filterOption={(inputValue, option) =>
                                                option.value.indexOf(inputValue) !== -1
                                            }
                                        >
                                            <Input min={120} max={230} placeholder="最大値" />
                                        </AutoComplete>
                                    </Form.Item>
                                </div>

                                {/* 精算方法 */}
                                <Form.Item
                                    label="計算方法"
                                    name="calculation_method"
                                    rules={[{ required: true, message: '精算方法を選択してください' }]}
                                >
                                    <Select placeholder="精算方法を選択">
                                        <Select.Option value="上下精算">上下精算</Select.Option>
                                        <Select.Option value="中間精算">中間精算</Select.Option>
                                        <Select.Option value="固定精算">固定精算</Select.Option>
                                        <Select.Option value="日割り精算">日割り精算</Select.Option>
                                        <Select.Option value="時間精算">時間精算</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="精算月日" name="settlement_date">
                                <DatePicker className="w-full" placeholder="" />
                            </Form.Item>
                            <Form.Item label="控除精算" name="deduction_settlement">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24} className="-mt-6">
                            <Form.Item
                                label="精算金額"
                                name="settlement_amount"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="合計精算金額"
                                name="total_price"
                                rules={[
                                    {
                                        required: true,
                                        message: '合計精算金額を入力してください',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="単価" name="price_per_month">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="人・月" name="per_month">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateWorking;
