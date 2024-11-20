import { Col, DatePicker, Form, Input, Modal, notification, Row, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { updateMeetingRecord } from '../../../../services/sale.service';
import dayjs from 'dayjs';
import { suggestionAccountName } from '../../../../services/common.service';

const UpdateMeeting = ({ openUpdateModal, setOpenUpdateModal, fetchListMeetings, selectedItem, selectedDate }) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const debounceTimeout = useRef(null);

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

    useEffect(() => {
        if (selectedItem && selectedItem.id) {
            const formattedData = {
                ...selectedItem,
                date: selectedItem.date ? dayjs(selectedItem.date) : null,
            };
            form.setFieldsValue(formattedData);
        }
    }, [openUpdateModal, selectedItem]);

    const onFinish = async (values) => {
        try {
            const formattedValues = {
                ...values,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
            };
            const res = await updateMeetingRecord(values.id, formattedValues);
            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenUpdateModal(false);
                await fetchListMeetings(selectedDate);
                form.resetFields();
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
                maskClosable={false}
                open={openUpdateModal}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenUpdateModal(false);
                    form.resetFields('');
                }}
                className="-mt-9"
            >
                <Form onFinish={onFinish} form={form} autoComplete="off" layout="vertical">
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item label="id" name="id" hidden>
                                <Input />
                            </Form.Item>
                        </Col>
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
                                    options={options}
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

export default UpdateMeeting;
