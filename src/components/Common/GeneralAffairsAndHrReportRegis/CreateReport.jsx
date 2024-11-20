import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Modal, Select, DatePicker, Row, Col, InputNumber, notification, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { createDailyReportRegis } from '../../../services/api.service';
import dayjs from 'dayjs';

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
            const res = await createDailyReportRegis(formattedValues);
            if (res.data) {
                notification.success({
                    message: '作成が成功しました。',
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
                title="新規登録"
                width={'90vw'}
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
                    <Form.List name="tasks">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <React.Fragment key={key}>
                                        <Row
                                            gutter={5}
                                            key={key}
                                            style={{ display: 'flex', marginBottom: 8 }}
                                            align="top"
                                        >
                                            <Col span={2} style={{ width: '100%' }}>
                                                <Form.Item
                                                    initialValue={'AM'}
                                                    {...restField}
                                                    name={[name, 'time']}
                                                    label="午前/午後"
                                                >
                                                    <Select style={{ width: '100%' }}>
                                                        <Select.Option value="AM">AM</Select.Option>
                                                        <Select.Option value="PM">PM</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={4} style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'jobDescription']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '仕事内容を入力してください',
                                                        },
                                                    ]}
                                                    label="仕事内容"
                                                >
                                                    <Input.TextArea
                                                        autoSize={{
                                                            minRows: 1,
                                                            maxRows: 6,
                                                        }}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col span={2} style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'quantity']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '何件(数/人)を入力してください',
                                                        },
                                                    ]}
                                                    label="何件(数/人)"
                                                >
                                                    <InputNumber min={1} style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>

                                            <Col span={3} style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'timeSchedule']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '必要時間予定を入力してください',
                                                        },
                                                    ]}
                                                    label="必要時間予定"
                                                >
                                                    <Input style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>

                                            <Col span={3} style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'actualCompletionTime']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '実際完成時間を入力してください',
                                                        },
                                                    ]}
                                                    label="実際完成時間"
                                                >
                                                    <Input style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>

                                            <Col span={3} style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'reason']}
                                                    label="完成できない理由"
                                                >
                                                    <Input.TextArea autoSize style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>

                                            <Col span={3} style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'informationSharing']}
                                                    label="情報共有事項"
                                                >
                                                    <Input.TextArea autoSize style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>

                                            <Col span={3} style={{ width: '100%' }}>
                                                <Form.Item {...restField} name={[name, 'other']} label="備考">
                                                    <Input.TextArea autoSize style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>

                                            <Col span={1} className="mt-9 flex">
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Col>
                                        </Row>
                                        {fields.length > 1 && index !== fields.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        タスク追加
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default CreateReport;
