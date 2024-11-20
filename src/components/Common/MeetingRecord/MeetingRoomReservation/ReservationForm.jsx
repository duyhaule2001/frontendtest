import { Col, DatePicker, Form, Input, Modal, notification, Row, Select, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { createReservation } from '../../../../services/common.service';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const ReservationForm = ({ isModalVisible, setIsModalVisible, fetchData, selectedDate }) => {
    const [form] = Form.useForm();
    const createByName = useSelector((state) => state.account.user.username);

    const [startTime, setStartTime] = useState(null);

    const today = dayjs().startOf('day');

    useEffect(() => {
        form.setFieldsValue({
            date: selectedDate.isBefore(today) ? today : selectedDate,
        });
    }, [selectedDate, form]);

    // Disable dates before today
    const disabledDate = (current) => {
        return current && current < today;
    };

    //開始時間を選択したら、終了時間が表示変更
    useEffect(() => {
        if (startTime) {
            form.setFieldsValue({
                end_time: startTime,
            });
        }
    }, [startTime, isModalVisible, form]);

    const onFinish = async (values) => {
        try {
            const formattedData = {
                ...values,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
                start_time: values.start_time ? dayjs(values.start_time).format('HH:mm') : null,
                end_time: values.end_time ? dayjs(values.end_time).format('HH:mm') : null,
            };
            const res = await createReservation(values.meeting_room_no, formattedData);
            if (res.data) {
                notification.success({
                    message: '予約が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setIsModalVisible(false);
                form.resetFields();
                await fetchData(selectedDate);
            } else {
                notification.error({
                    message: res.error,
                    style: {
                        width: 445,
                    },
                });
            }
        } catch (error) {
            console.log('APIと接続できませんでした。');
        }
    };

    return (
        <div>
            <Modal
                title="ルーム予約"
                maskClosable={false}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                width={'50vw'}
                okText="登録"
            >
                <Form layout="vertical" className="mt-5" onFinish={onFinish} form={form}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="日付"
                                name="date"
                                initialValue={selectedDate.isBefore(today) ? today : selectedDate}
                                rules={[
                                    {
                                        required: true,
                                        message: '日付を選択してください',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || value >= today) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('過去の日付を選択することはできません'));
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker className="w-full" disabledDate={disabledDate} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="作成者" name="create_by" initialValue={createByName}>
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="ルーム"
                                name="meeting_room_no"
                                rules={[
                                    {
                                        required: true,
                                        message: 'ルームを選択してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value={1}>5F 会議室</Select.Option>
                                    <Select.Option value={2}>5F 応接室</Select.Option>
                                    <Select.Option value={3}>2F 右ルーム</Select.Option>
                                    <Select.Option value={4}>2F 左ルーム</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="タイトル"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'タイトルを入力してください',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="内容" name="content">
                                <Select>
                                    <Select.Option value="面接">面接</Select.Option>
                                    <Select.Option value="面談">面談</Select.Option>
                                    <Select.Option value="打ち合わせ">打ち合わせ</Select.Option>
                                    <Select.Option value="技術者練習用">技術者練習用</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="種別"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: '内容を入力してください',
                                    },
                                ]}
                            >
                                <Select>
                                    <Select.Option value="来客">
                                        <span className="text-red-500">来客</span>
                                    </Select.Option>
                                    <Select.Option value="社内">
                                        <span className="text-yellow-500">社内</span>
                                    </Select.Option>
                                    <Select.Option value="オンライン">
                                        <span className="text-sky-500">オンライン</span>
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="利用者"
                                name="appointments_name"
                                rules={[
                                    {
                                        required: true,
                                        message: '予約者を入力してください',
                                    },
                                ]}
                            >
                                <Input placeholder="例：木村 鈴木" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="備考" name="other">
                                <Input.TextArea
                                    autoSize={{
                                        maxRows: 10,
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="開始時間"
                                name="start_time"
                                initialValue={dayjs()}
                                rules={[
                                    {
                                        required: true,
                                        message: '開始時間を選択してください',
                                    },
                                ]}
                            >
                                <TimePicker
                                    showNow={false}
                                    format="HH:mm"
                                    className="w-full"
                                    minuteStep={15}
                                    onChange={(time) => setStartTime(time)}
                                    disabledTime={() => ({
                                        disabledHours: () => [...Array(9).keys()],
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="終了予定時間"
                                name="end_time"
                                rules={[
                                    {
                                        required: true,
                                        message: '終了予定時間を選択してください',
                                    },
                                ]}
                            >
                                <TimePicker showNow={false} format="HH:mm" className="w-full" minuteStep={15} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ReservationForm;
