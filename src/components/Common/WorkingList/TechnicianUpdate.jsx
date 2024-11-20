import React, { useEffect, useState } from 'react';
import { AutoComplete, Col, DatePicker, Form, Input, InputNumber, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { updateTechnician } from '../../../services/common.service';

const TechnicianUpdate = ({ setOpenUpdate, openUpdate, dataUpdate, setDataUpdate, loadTechnicianData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    //計算簡易用
    const numberOptions = [];
    for (let i = 120; i <= 230; i += 10) {
        numberOptions.push(i);
    }

    useEffect(() => {
        if (openUpdate) {
            form.resetFields();
            if (dataUpdate) {
                form.setFieldsValue({
                    ...dataUpdate,
                    admission_date: dataUpdate.admission_date ? dayjs(dataUpdate.admission_date) : null,
                    settlement_date: dataUpdate.settlement_date ? dayjs(dataUpdate.settlement_date) : null,
                    release_schedule: dataUpdate.release_schedule ? dayjs(dataUpdate.release_schedule) : null,
                    contract_renewal_date: dataUpdate.contract_renewal_date
                        ? dayjs(dataUpdate.contract_renewal_date)
                        : null,
                });
            }
        }
    }, [dataUpdate, openUpdate, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        const calculationRange = `${values.rangeStart}-${values.rangeEnd}`;
        const formattedValues = {
            ...values,
            calculation_range: calculationRange,
            admission_date: values.admission_date ? dayjs(values.admission_date).format('YYYY-MM-DD') : null,
            settlement_date: values.settlement_date ? dayjs(values.settlement_date).format('YYYY-MM-DD') : null,
            release_schedule: values.release_schedule ? dayjs(values.release_schedule).format('YYYY-MM-DD') : null,
            contract_renewal_date: values.contract_renewal_date
                ? dayjs(values.contract_renewal_date).format('YYYY-MM-DD')
                : null,
        };
        try {
            const res = await updateTechnician(dataUpdate.id, formattedValues);
            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                await loadTechnicianData();
                setOpenUpdate(false);
                setDataUpdate(null);
            } else {
                notification.error({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleCancel = () => {
        setOpenUpdate(false);
    };

    return (
        <>
            <Modal
                title="情報アップデット"
                open={openUpdate}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                width={'50%'}
                maskClosable={false}
                okText="登録"
                cancelText="キャンセル"
                confirmLoading={loading}
                className="-mt-9"
            >
                <Form form={form} name="control-hooks" onFinish={handleSubmit} layout="vertical">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="技術者名"
                                name="technician_name"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="社員番号"
                                name="employee_number"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="上位顧客"
                                name="customer_company_name"
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
                            <Form.Item
                                label="担当者名前"
                                name="name_of_person_in_charge"
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
                            <Form.Item
                                label="プロジェクト名"
                                name="project_name"
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
                            <Form.Item
                                label="契約形態"
                                name="contract_related"
                                rules={[
                                    {
                                        required: true,
                                        message: '契約形態を選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="正">正</Select.Option>
                                    <Select.Option value="契約">契約</Select.Option>
                                    <Select.Option value="派遣">派遣</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="契約期間"
                                name="contract_period"
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
                            <Form.Item
                                label="入場日"
                                name="admission_date"
                                rules={[
                                    {
                                        required: true,
                                        message: '入場日を選択してください',
                                    },
                                ]}
                            >
                                <DatePicker placeholder="" className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="リリース予定"
                                name="release_schedule"
                                rules={[
                                    {
                                        required: true,
                                        message: 'リリース予定を選択してください',
                                    },
                                ]}
                            >
                                <DatePicker placeholder="" className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="契約更新日"
                                name="contract_renewal_date"
                                rules={[
                                    {
                                        required: true,
                                        message: '契約更新日を選択してください',
                                    },
                                ]}
                            >
                                <DatePicker placeholder="" className="w-full" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="正/個/BP"
                                name="occupational_classification"
                                rules={[
                                    {
                                        required: true,
                                        message: '正/個/BPを選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="正">正</Select.Option>
                                    <Select.Option value="個">個</Select.Option>
                                    <Select.Option value="BP">BP</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="人事承認"
                                name="personnel_confirm"
                                rules={[
                                    {
                                        required: true,
                                        message: '人事承認を選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={true}>済み</Select.Option>
                                    <Select.Option value={false}>未</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="単価"
                                name="unit_price"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber
                                    className="w-full"
                                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="人/月"
                                name="person_month"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber className="w-full" min={1} max={99} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="精算範囲">
                                <div className="flex space-x-3">
                                    {/* rangeStart */}
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

                                    {/* rangeEnd */}
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

                                <Form.Item
                                    label="計算方法"
                                    name="calculation_method"
                                    rules={[{ required: true, message: '精算方法を選択してください' }]}
                                >
                                    <Select>
                                        <Select.Option value="時間精算">時間精算</Select.Option>
                                        <Select.Option value="上下精算">上下精算</Select.Option>
                                        <Select.Option value="中間精算">中間精算</Select.Option>
                                        <Select.Option value="固定精算">固定精算</Select.Option>
                                        <Select.Option value="日割り精算">日割り精算</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="精算月日"
                                name="settlement_date"
                                rules={[
                                    {
                                        required: true,
                                        message: '精算月日  を選択してください',
                                    },
                                ]}
                            >
                                <DatePicker placeholder="" className="w-full" />
                            </Form.Item>
                            <Form.Item
                                label="入場担当"
                                name="admission_officer"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item label="備考" name="remarks">
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 6 }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default TechnicianUpdate;
