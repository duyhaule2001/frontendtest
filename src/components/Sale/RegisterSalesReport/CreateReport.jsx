import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Modal, Select, DatePicker, Row, Col, InputNumber, notification, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createReportsList } from '../../../services/sale.service';

const CreateReport = (props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { openModalCreate, setOpenModalCreate, fetchRegisList, selectedDate } = props;

    useEffect(() => {
        if (openModalCreate) {
            const tasks = form.getFieldValue('tasks');
            if (!tasks || tasks.length === 0) {
                form.setFieldsValue({ tasks: [{}] });
            }
        }
    }, [openModalCreate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formattedValues = values.tasks.map((task) => ({
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
                ...task,
            }));
            const res = await createReportsList(formattedValues);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                form.resetFields('');
                setOpenModalCreate(false);
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
                style={{ maxWidth: '1200px' }}
                okText="登録"
                maskClosable={false}
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalCreate(false);
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
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <React.Fragment key={key}>
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
                                                    key={`${key}-time`}
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
                                                    style={{ minWidth: '240px' }}
                                                    label="対応予定"
                                                    key={`${key}-jobDescription`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: (
                                                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                                                    対応予定を入力してください
                                                                </span>
                                                            ),
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea
                                                        autoSize
                                                        placeholder="前日まで記入 (具体的な仕事内容)"
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'requiredTime']}
                                                    style={{ minWidth: '90px' }}
                                                    label="必要時間"
                                                    key={`${key}-requiredTime`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: (
                                                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                                                    時間を入力してください
                                                                </span>
                                                            ),
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
                                                    key={`${key}-handledCompany`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: (
                                                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                                                    会社名を入力してください
                                                                </span>
                                                            ),
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea autoSize={{ maxRows: 3 }} />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'handledDepartment']}
                                                    style={{ minWidth: '140px' }}
                                                    label="対応・担当部署"
                                                    key={`${key}-handledDepartment`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: (
                                                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                                                    対応・担当部署を入力してください
                                                                </span>
                                                            ),
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea autoSize={{ maxRows: 2 }} />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'meetingPerson']}
                                                    style={{ minWidth: '140px' }}
                                                    label="対応・面談者名"
                                                    key={`${key}-meetingPerson`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: (
                                                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                                                    対応・面談者名を入力してください
                                                                </span>
                                                            ),
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea autoSize={{ maxRows: 3 }} />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'details']}
                                                    style={{ minWidth: '500px' }}
                                                    label="対応業務内容"
                                                    key={`${key}-details`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea
                                                        autoSize
                                                        placeholder="引き合い詳細、会話・会談内容、成約可否、定量的情報など (詳細記載必須)"
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'futureActions']}
                                                    style={{ minWidth: '350px' }}
                                                    label="今後の対応、アクション、提案、リカバリ内容等"
                                                    key={`${key}-futureActions`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'この項目は空にできません。',
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea autoSize placeholder="詳細記載必須" />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'notes']}
                                                    style={{ minWidth: '250px' }}
                                                    label="留意点や社内関係者への共有事項等"
                                                    key={`${key}-notes`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: (
                                                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                                                    留意点や社内関係者への共有事項等を入力してください
                                                                </span>
                                                            ),
                                                        },
                                                    ]}
                                                >
                                                    <Input.TextArea autoSize />
                                                </Form.Item>
                                                <MinusCircleOutlined
                                                    className="mt-2"
                                                    onClick={() => remove(name)}
                                                    key={`${key}-remove-icon`}
                                                />
                                            </div>
                                            {fields.length > 1 && index !== fields.length - 1 && (
                                                <Divider className="min-w-[2014px]" key={`${key}-divider`} />
                                            )}
                                        </React.Fragment>
                                    ))}

                                    <Form.Item>
                                        <div style={{ width: '100%', minWidth: '2014px', textAlign: 'center' }}>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                タスク追加
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default CreateReport;
