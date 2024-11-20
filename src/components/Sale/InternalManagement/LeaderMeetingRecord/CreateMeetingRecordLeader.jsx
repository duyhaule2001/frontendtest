import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Form, Input, Modal, notification, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { createLeaderMeetingRecord, getLeaderNameMeetingRecord, getSaleName } from '../../../../services/sale.service';

const CreateMeetingRecordLeader = ({ openModalCreate, setOpenModalCreate, fetchListMeetings, selectedDate }) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [saleOptions, setSaleOptions] = useState([]);
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const [selectedAbsentees, setSelectedAbsentees] = useState([]);
    const [leadersContent, setLeadersContent] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (openModalCreate && !isDataLoaded) {
            const fetchNameOptions = async () => {
                try {
                    const [resLeader, resSale] = await Promise.all([getLeaderNameMeetingRecord(), getSaleName()]);

                    if (resLeader.data) {
                        const leaderOptions = resLeader.data.map((name) => ({
                            label: name,
                            value: name,
                        }));
                        setOptions(leaderOptions);
                    }

                    if (resSale.data) {
                        const saleOptions = resSale.data.map((sale) => ({
                            label: sale,
                            value: sale,
                        }));
                        setSaleOptions(saleOptions);
                    }
                    setIsDataLoaded(true);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchNameOptions();
        }
    }, [openModalCreate, isDataLoaded]);

    const filteredAttendeesOptions = options.filter((option) => !selectedAbsentees.includes(option.value));

    const filteredAbsenteesOptions = options.filter((option) => !selectedAttendees.includes(option.value));

    const onFinish = async (values) => {
        try {
            const formattedData = {
                attendees: values.attendees,
                absentees: values.absentees,
                chairmanship: values.chairmanship,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
                leaderReports: selectedAttendees.map((leader) => ({
                    leaderName: leader,
                    content: leadersContent[leader] || '',
                })),
            };
            const res = await createLeaderMeetingRecord(formattedData);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                await fetchListMeetings(selectedDate);
                setOpenModalCreate(false);
                form.resetFields();
                setSelectedAttendees([]);
                setSelectedAbsentees([]);
                setLeadersContent({});
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAttendeesChange = (selected) => {
        setSelectedAttendees(selected);
    };

    const handleAbsenteesChange = (selected) => {
        setSelectedAbsentees(selected);
    };

    const handleContentChange = (leader, value) => {
        setLeadersContent({
            ...leadersContent,
            [leader]: value,
        });
    };

    return (
        <>
            <div className="px-96 py-10">
                <Modal
                    title="会議記録登録"
                    cancelText={'キャンセル'}
                    okText={'登録'}
                    width={'50vw'}
                    maskClosable={false}
                    onOk={() => form.submit()}
                    open={openModalCreate}
                    onCancel={() => {
                        setOpenModalCreate(false);
                        form.resetFields();
                        setSelectedAttendees([]);
                        setSelectedAbsentees([]);
                        setLeadersContent({});
                    }}
                >
                    <Form onFinish={onFinish} form={form} autoComplete="off" layout="vertical" className="mt-5">
                        <Row gutter={30}>
                            <Col span={24}>
                                <Form.Item
                                    label="日付"
                                    name="date"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'この項目は空にできません!',
                                        },
                                    ]}
                                    initialValue={dayjs()}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="司会"
                                    name="chairmanship"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'この項目は空にできません!',
                                        },
                                    ]}
                                >
                                    <Select allowClear style={{ width: '100%' }} options={saleOptions} />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="参加人員"
                                    name="attendees"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'この項目は空にできません!',
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        options={filteredAttendeesOptions}
                                        onChange={handleAttendeesChange}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="欠席人員" name="absentees">
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        options={filteredAbsenteesOptions}
                                        onChange={handleAbsenteesChange}
                                    />
                                </Form.Item>
                            </Col>

                            {selectedAttendees.length > 0 &&
                                selectedAttendees.map((leader, index) => (
                                    <Col span={24} key={index}>
                                        <Form.Item
                                            label={`${leader}リーダ`}
                                            name={`${leader}content_${index}`}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'この項目は空にできません!',
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                autoSize={{ minRows: 1, maxRows: 20 }}
                                                value={leadersContent[leader] || ''}
                                                onChange={(e) => handleContentChange(leader, e.target.value)}
                                            />
                                        </Form.Item>
                                    </Col>
                                ))}
                        </Row>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default CreateMeetingRecordLeader;
