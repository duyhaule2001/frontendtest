import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber, notification } from 'antd';
import dayjs from 'dayjs';
import { updateReportsList } from '../../../services/sale.service';

const UpdateReports = ({ openModalUpdate, setOpenModalUpdate, fetchRegisList, selectedDate, selectedReport }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedReport && selectedReport.id && openModalUpdate) {
            form.setFieldsValue({
                date: selectedReport?.date ? dayjs(selectedReport.date, 'YYYY-MM-DD') : null,
                tasks: [
                    {
                        time: selectedReport?.time || '',
                        jobDescription: selectedReport?.jobDescription || '',
                        quantity: selectedReport?.quantity || '',
                        requiredTime: selectedReport?.requiredTime || '',
                        handledCompany: selectedReport?.handledCompany || '',
                        handledDepartment: selectedReport?.handledDepartment || '',
                        meetingPerson: selectedReport?.meetingPerson || '',
                        details: selectedReport?.details || '',
                        futureActions: selectedReport?.futureActions || '',
                        notes: selectedReport?.notes || '',
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

            const res = await updateReportsList(selectedReport.id, mergedData);
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
                title="日報登録"
                width={'90vw'}
                okText="登録"
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
                        rules={[
                            {
                                required: true,
                                message: <span className="text-xs">この項目は空にできません。</span>,
                            },
                        ]}
                        initialValue={dayjs()}
                    >
                        <DatePicker />
                    </Form.Item>
                    <div style={{ overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <Form.List name="tasks">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                marginBottom: '8px',
                                                flexWrap: 'nowrap',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <Form.Item
                                                initialValue={'AM'}
                                                {...restField}
                                                name={[name, 'time']}
                                                label="時間"
                                                style={{ minWidth: '70px' }}
                                            >
                                                <Select style={{ width: '100%' }}>
                                                    <Select.Option value="AM">AM</Select.Option>
                                                    <Select.Option value="PM">PM</Select.Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'jobDescription']}
                                                style={{ minWidth: '300px' }}
                                                label="対応予定"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    autoSize={{
                                                        maxRows: 50,
                                                    }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'requiredTime']}
                                                style={{ minWidth: '80px' }}
                                                label="必要時間"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <InputNumber min={1} className="w-full" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'handledCompany']}
                                                style={{ minWidth: '170px' }}
                                                label="対応・訪問会社名"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    autoSize={{
                                                        maxRows: 3,
                                                    }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'handledDepartment']}
                                                style={{ minWidth: '140px' }}
                                                label="対応・担当部署"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    autoSize={{
                                                        maxRows: 2,
                                                    }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'meetingPerson']}
                                                style={{ minWidth: '140px' }}
                                                label="対応・面談者名"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    autoSize={{
                                                        maxRows: 3,
                                                    }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'details']}
                                                style={{ minWidth: '570px' }}
                                                label="対応業務内容"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    autoSize={{
                                                        maxRows: 50,
                                                    }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'futureActions']}
                                                style={{ minWidth: '420px' }}
                                                label="今後の対応、アクション、提案、リカバリ内容等"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    autoSize={{
                                                        maxRows: 50,
                                                    }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'notes']}
                                                style={{ minWidth: '240px' }}
                                                label="留意点や社内関係者への共有事項等"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    autoSize={{
                                                        maxRows: 50,
                                                    }}
                                                />
                                            </Form.Item>
                                        </div>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default UpdateReports;
