import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Row, Col, notification, Select, InputNumber, Rate, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { updateParticipationStatus } from '../../../services/sale.service';

const { Option } = Select;

const UpdateParticipationStatus = ({ setOpenUpdateModal, fetchData, openUpdateModal, selectedData }) => {
    const [form] = Form.useForm();
    const [isCustomAffiliation, setIsCustomAffiliation] = useState(false);
    const [averageScore, setAverageScore] = useState(0);
    const [remarks, setRemarks] = useState('');

    const suggestions = ['スキルアップできました。', '増員できました。', 'メンバーフォローしました。'];
    const handleSuggestionClick = (suggestion) => {
        setRemarks((prevRemarks) => prevRemarks + (prevRemarks ? '\n' : '') + suggestion);
    };
    const handleRateChange = (changedValues) => {
        const values = form.getFieldsValue();
        const scores = [values.attendant, values.workAttitude, values.performance, values.leadership, values.other];
        const total = scores.reduce((acc, score) => acc + (score || 0), 0);
        const count = scores.filter((score) => score > 0).length;
        const avg = count > 0 ? (total / count).toFixed(1) : 0;
        setAverageScore(avg);
    };

    useEffect(() => {
        if (selectedData) {
            form.setFieldsValue({
                name: selectedData.name,
                salesNumber: selectedData.salesNumber,
                affiliationType: selectedData.affiliationType,
                affiliation: selectedData.affiliation,
                participationPeriod: selectedData.participationPeriod ? dayjs(selectedData.participationPeriod) : null,
                exitSchedule: selectedData.exitSchedule ? dayjs(selectedData.exitSchedule) : null,
                projectDetails: selectedData.projectDetails,
                proposedUnitPrice: selectedData.proposedUnitPrice,
                businessFlow: selectedData.businessFlow,
                customerEvaluation: selectedData.customerEvaluation,
                salesEvaluation: selectedData.salesEvaluation,
                entryDate: selectedData.entryDate,
                remarks: selectedData.remarks,
                attendant: selectedData.attendant,
                workAttitude: selectedData.workAttitude,
                performance: selectedData.performance,
                leadership: selectedData.leadership,
                other: selectedData.other,
                attendantComment: selectedData.attendantComment,
                workAttitudeComment: selectedData.workAttitudeComment,
                performanceComment: selectedData.performanceComment,
                leadershipComment: selectedData.leadershipComment,
                otherComment: selectedData.otherComment,
            });
            setIsCustomAffiliation(selectedData.affiliation === 'その他');
            setRemarks(selectedData.remarks || '');
            handleRateChange();
        }
    }, [selectedData, openUpdateModal]);

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            remarks,
            participationPeriod: values.participationPeriod
                ? dayjs(values.participationPeriod).format('YYYY-MM-DD')
                : null,
            exitSchedule: values.exitSchedule ? dayjs(values.exitSchedule).format('YYYY-MM-DD') : null,
        };

        try {
            const response = await updateParticipationStatus(selectedData.id, formattedValues);
            if (response.data) {
                notification.success({
                    message: '要員参画状況更新が成功しました。',
                });
                setOpenUpdateModal(false);
                await fetchData();
            } else {
                notification.error({
                    message: '更新が失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="要員参画状況の更新"
            open={openUpdateModal}
            onOk={() => form.submit()}
            okText="更新"
            cancelText="キャンセル"
            onCancel={() => {
                setOpenUpdateModal(false);
                form.resetFields('');
            }}
            width={'50%'}
            maskClosable={false}
            className="-mt-9"
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} onValuesChange={handleRateChange}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="氏名"
                            name="name"
                            rules={[{ required: true, message: '氏名を入力してください！' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="営業番号"
                            name="salesNumber"
                            rules={[{ required: true, message: '営業番号を入力してください！' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="所属種別"
                            name="affiliationType"
                            rules={[
                                {
                                    required: true,
                                    message: '所属種別を選択してください！',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="所属"
                            name="affiliation"
                            rules={[{ required: true, message: '所属を入力してください！' }]}
                        >
                            {!isCustomAffiliation ? (
                                <Select
                                    placeholder="所属を選択してください"
                                    onChange={(value) => {
                                        if (value === 'その他') {
                                            setIsCustomAffiliation(true);
                                        }
                                    }}
                                    allowClear
                                >
                                    <Option value="正社員">正社員</Option>
                                    <Option value="契約社員">契約社員</Option>
                                    <Option value="1社先社員">1社先社員</Option>
                                    <Option value="個人事業主">個人事業主</Option>
                                    <Option value="2社先社員">2社先社員</Option>
                                    <Option value="その他">その他</Option>
                                </Select>
                            ) : (
                                <Input onBlur={() => setIsCustomAffiliation(false)} />
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="参画時期" name="participationPeriod">
                            <DatePicker className="w-full" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="退場予定" name="exitSchedule">
                            <DatePicker className="w-full" placeholder="" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="プロジェクト詳細、対応部分" name="projectDetails">
                    <TextArea />
                </Form.Item>
                <Form.Item label="提案単価" name="proposedUnitPrice">
                    <InputNumber className="w-full" />
                </Form.Item>

                <Form.Item label="商流" name="businessFlow">
                    <TextArea />
                </Form.Item>

                <Form.Item label="お客様評価" name="customerEvaluation">
                    <TextArea />
                </Form.Item>

                <div className="flex items-center space-x-5">
                    <span>担当営業評価</span>
                    <span>平均点数：{averageScore}</span>
                </div>
                <div className="ml-5">
                    <Form.Item style={{ marginBottom: 0 }} name={'attendant'} label="勤怠" layout="horizontal">
                        <Rate count={10} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'attendantComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'workAttitude'} label="作業態度" layout="horizontal">
                        <Rate count={10} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'workAttitudeComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 0 }}
                        name={'performance'}
                        label="パフォーマンス"
                        layout="horizontal"
                    >
                        <Rate count={10} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'performanceComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 0 }}
                        name={'leadership'}
                        label="リーダーシップ"
                        layout="horizontal"
                    >
                        <Rate count={10} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'leadershipComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'other'} label="その他" layout="horizontal">
                        <Rate count={10} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'otherComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                </div>

                <Form.Item
                    label="記入日期"
                    name="entryDate"
                    rules={[
                        {
                            required: true,
                            message: '記入日期を入力してください！',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item label="備考" name="remarks">
                    <div className="suggestions">
                        {suggestions.map((suggestion, index) => (
                            <Button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{ marginRight: 8, marginBottom: 8 }}
                            >
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                    <TextArea value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateParticipationStatus;
