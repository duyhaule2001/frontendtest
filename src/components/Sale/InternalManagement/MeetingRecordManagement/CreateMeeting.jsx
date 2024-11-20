import { Col, DatePicker, Form, Input, Modal, notification, Row, Select } from 'antd';
import React, { useRef, useState } from 'react';
import { createMeetingRecord } from '../../../../services/sale.service';
import dayjs from 'dayjs';
import { suggestionAccountName } from '../../../../services/common.service';

const CreateMeeting = ({ openCreateModal, setOpenCreateModal, selectedDate, fetchListMeetings }) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null);

    const [selectedAttendees, setSelectedAttendees] = useState([]);

    const onSearch = (value) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            if (!value) {
                setOptions([]);
                setShowDropdown(false);
                return;
            }

            try {
                const res = await suggestionAccountName(value);
                if (res.data) {
                    setOptions(
                        res.data.map((item) => ({
                            value: item.name,
                        })),
                    );
                } else {
                    setOptions([]);
                }
            } catch (error) {
                console.log(error);
                setOptions([]);
            }
        }, 500);
    };

    const onAttendeesChange = (value) => {
        setSelectedAttendees(value);
    };

    const onFinish = async (values) => {
        try {
            const formattedValues = {
                ...values,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
            };
            const res = await createMeetingRecord(formattedValues);
            if (res.data) {
                notification.success({
                    message: '作成が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenCreateModal(false);
                fetchListMeetings(selectedDate);
                form.resetFields();
                setSelectedAttendees([]);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Modal
                title="会議記録登録"
                width={'75vw'}
                okText="登録"
                maskClosable={false}
                open={openCreateModal}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenCreateModal(false);
                    form.resetFields('');
                    setSelectedAttendees([]);
                }}
                className="-mt-9"
            >
                <Form onFinish={onFinish} form={form} autoComplete="off" layout="vertical">
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="日付"
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空にできません',
                                    },
                                ]}
                                initialValue={dayjs()}
                            >
                                <DatePicker />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="主義テーマ"
                                name="topic"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空にできません',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="会議場所"
                                name="location"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空にできません',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="会議主題"
                                name="subject"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空にできません',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 2,
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="会議目的"
                                name="reason"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空にできません',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 2,
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="参加人員"
                                name="attendees"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空にできません',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    onSearch={onSearch}
                                    options={options}
                                    onChange={onAttendeesChange}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="欠席人員" name="absentees">
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    onSearch={onSearch}
                                    options={options.filter((option) => !selectedAttendees.includes(option.value))}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="会議内容"
                                name="content"
                                rules={[
                                    {
                                        required: true,
                                        message: 'この項目は空にできません',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 10,
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="部門向け共通事項" name="departmentNotes">
                                <Input.TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 6,
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="全社共通事項" name="companyNotes">
                                <Input.TextArea
                                    autoSize={{
                                        minRows: 1,
                                        maxRows: 6,
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default CreateMeeting;
