import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DatePicker, Form, Input, Button, Row, Col, Select, notification, Drawer, Descriptions, Grid } from 'antd';
import {
    createDailyReport,
    getAllDailyReportOfEmployee,
    getOneDailyReportByDate,
} from '../../../services/employee.service';
import TitleCus from '../../Common/Layout/TitleCus';

const { useBreakpoint } = Grid;

const DailyReports = () => {
    const [form] = Form.useForm();
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportOptions, setReportOptions] = useState([]);
    const [reportDetails, setReportDetails] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const screens = useBreakpoint();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllDailyReportOfEmployee();
                if (res.data) {
                    const options = res.data.map((item) => ({
                        value: item.dateReport,
                        label: dayjs(item.dateReport).format('YYYY-MM-DD'),
                    }));
                    setReportOptions(options);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            dateReport: values.dateReport ? dayjs(values.dateReport).format('YYYY-MM-DD') : null,
        };
        const response = await createDailyReport(formattedValues);
        if (response.data) {
            notification.success({
                message: '日報提出が成功しました。',
                style: {
                    width: 310,
                },
            });
            form.resetFields();
        } else {
            notification.error({
                message: '日報提出が失敗しました。',
            });
        }
    };

    const handleReportSelect = (value) => {
        if (value === selectedReport) {
            setOpenDrawer(true);
        } else {
            setSelectedReport(value);
            setReportDetails(null);
            setOpenDrawer(true);
        }
    };
    useEffect(() => {
        const fetchReportDetails = async () => {
            if (selectedReport) {
                try {
                    const response = await getOneDailyReportByDate({ dateReport: selectedReport });
                    setReportDetails(response.data || {});
                } catch (error) {
                    console.error('Error fetching report details:', error);
                }
            }
        };

        if (openDrawer) {
            fetchReportDetails();
        }
    }, [selectedReport, openDrawer]);

    const closeDrawer = () => {
        setOpenDrawer(false);
        setReportDetails(null);
    };

    return (
        <div className="pb-5">
            <TitleCus title={'日報'} />
            <div className="relative">
                <div className="mx-auto mt-10 w-full max-w-4xl rounded-lg bg-white px-10 py-8 sm:shadow-none md:shadow-lg">
                    <Form form={form} name="daily-report" layout="vertical" onFinish={handleSubmit}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="提出歴">
                                    <Select
                                        style={{ width: '100%' }}
                                        onSelect={handleReportSelect}
                                        value={selectedReport}
                                        options={reportOptions}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="日付"
                                    name="dateReport"
                                    rules={[
                                        {
                                            required: true,
                                            message: '日付を選択してください！',
                                        },
                                    ]}
                                    initialValue={dayjs()}
                                >
                                    <DatePicker placeholder="" className="w-full" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="作業場所" name="address">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item label="本日の作業内容" name="content">
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item label="課題点とそれに向けての取り組み" name="issues">
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item label="参考" name="reference">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="flex justify-end">
                            <Button type="primary" htmlType="submit" className="px-10">
                                提出
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <Drawer
                title="日報詳細"
                width={screens.xs ? '100%' : '50%'}
                onClose={closeDrawer}
                open={openDrawer}
                placement="right"
            >
                {reportDetails && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="日付" labelStyle={{ width: '30%' }} contentStyle={{ width: '70%' }}>
                            {dayjs(reportDetails.dateReport).format('YYYY-MM-DD')}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="作業場所"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.address || ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="本日の作業内容"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.content || ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="課題点とそれに向けての取り組み"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.issues || ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="参考"
                            labelStyle={{ width: '30%' }}
                            contentStyle={{ width: '70%', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        >
                            {reportDetails.reference || ''}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </div>
    );
};

export default DailyReports;
