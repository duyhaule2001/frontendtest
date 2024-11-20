import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, DatePicker, Row, Col, InputNumber, notification } from 'antd';
import { updateDailyReportRegis } from '../../../services/api.service';
import dayjs from 'dayjs';

const UpdateReport = ({ openModalUpdate, setOpenModalUpdate, fetchRegisList, selectedDate, selectedReport }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const isEditable = selectedReport?.ceoApproval || selectedReport?.leaderApproval;
    useEffect(() => {
        if (selectedReport && selectedReport.id && openModalUpdate) {
            form.setFieldsValue({
                date: selectedReport?.date ? dayjs(selectedReport.date, 'YYYY-MM-DD') : null,
                tasks: [
                    {
                        time: selectedReport?.time || '',
                        jobDescription: selectedReport?.jobDescription || '',
                        quantity: selectedReport?.quantity || '',
                        timeSchedule: selectedReport?.timeSchedule || '',
                        actualCompletionTime: selectedReport?.actualCompletionTime || '',
                        reason: selectedReport?.reason || '',
                        informationSharing: selectedReport?.informationSharing || '',
                        other: selectedReport?.other || '',
                    },
                ],
            });
        }
    }, [openModalUpdate, selectedReport]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const mergedData = {
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
                ...values.tasks[0],
            };

            const res = await updateDailyReportRegis(selectedReport.id, mergedData);
            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalUpdate(false);
                fetchRegisList(selectedDate);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div>
            <Modal
                title="日報修正"
                width={'50vw'}
                maskClosable={false}
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields('');
                }}
                confirmLoading={loading}
            >
                <Form form={form} onFinish={onFinish} autoComplete="off" className="mt-5" layout="vertical">
                    <Form.Item
                        name="date"
                        label="日付"
                        rules={[
                            {
                                required: true,
                                message: '日付を選択してください',
                            },
                        ]}
                    >
                        <DatePicker disabled={isEditable} />
                    </Form.Item>

                    <Form.List name="tasks">
                        {(fields) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row
                                        gutter={24}
                                        key={key}
                                        style={{ display: 'flex', marginBottom: 8 }}
                                        align="middle"
                                    >
                                        <Col span={12}>
                                            <Form.Item {...restField} name={[name, 'time']} label="AM/PM">
                                                <Select style={{ width: '100%' }} disabled={isEditable}>
                                                    <Select.Option value="AM">AM</Select.Option>
                                                    <Select.Option value="PM">PM</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'quantity']}
                                                label="何件(数/人)"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    disabled={isEditable}
                                                    min={1}
                                                    placeholder="何件(数/人)"
                                                    className="w-full"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'timeSchedule']}
                                                label="必要時間予定"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Input disabled={isEditable} />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'actualCompletionTime']}
                                                label="実際完成時間"
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
                                            <Form.Item {...restField} name={[name, 'jobDescription']} label="仕事内容">
                                                <Input.TextArea
                                                    autoSize={{
                                                        minRows: 5,
                                                    }}
                                                    disabled={isEditable}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item {...restField} name={[name, 'reason']} label="完成できない理由">
                                                <Input.TextArea
                                                    autoSize={{
                                                        minRows: 5,
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'informationSharing']}
                                                label="情報共有事項"
                                            >
                                                <Input.TextArea
                                                    autoSize={{
                                                        minRows: 3,
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item {...restField} name={[name, 'other']} label="備考">
                                                <Input.TextArea
                                                    autoSize={{
                                                        minRows: 3,
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default UpdateReport;
