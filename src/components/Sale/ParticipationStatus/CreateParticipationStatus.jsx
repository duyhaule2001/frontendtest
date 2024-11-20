import React, { useState } from 'react';
import { Modal, Input, DatePicker, Row, Col, notification, Select, InputNumber, Button, Rate, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { createParticipationStatus } from '../../../services/sale.service';

const { Option } = Select;

const CreateParticipationStatus = ({ openCreateModal, setOpenCreateModal, fetchData }) => {
    const [form] = Form.useForm();
    const [isCustomAffiliation, setIsCustomAffiliation] = useState(false);

    const [averageScore, setAverageScore] = useState(0);
    const [userInputs, setUserInputs] = useState(['']);
    const [upperCompanyInputs, setUpperCompanyInputs] = useState(['']);
    const [bpCompanyInputs, setBpCompanyInputs] = useState(['']);
    const [remarks, setRemarks] = useState('');

    const suggestions = ['スキルアップできました。', '増員できました。', 'メンバーフォローしました。'];

    const resetInputs = () => {
        setUserInputs(['']);
        setUpperCompanyInputs(['']);
        setBpCompanyInputs(['']);
        setAverageScore(0);
        setRemarks('');
    };
    const handleSuggestionClick = (suggestion) => {
        setRemarks((prevRemarks) => prevRemarks + (prevRemarks ? '\n' : '') + suggestion);
    };

    const handleSubmit = async (values) => {
        const formattedValues = {
            ...values,
            remarks,
            businessFlow: `商流: ${[
                ...userInputs.filter(Boolean),
                ...upperCompanyInputs.filter(Boolean),
                '株式会社スカイテック',
                ...bpCompanyInputs.filter(Boolean),
            ].join('←')}`,
            participationPeriod: values.participationPeriod
                ? dayjs(values.participationPeriod).format('YYYY-MM-DD')
                : null,
            exitSchedule: values.exitSchedule ? dayjs(values.exitSchedule).format('YYYY-MM-DD') : null,
        };
        try {
            const response = await createParticipationStatus(formattedValues);
            if (response.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenCreateModal(false);
                form.resetFields('');
                resetInputs();
                await fetchData();
            } else {
                notification.error({
                    message: '登録が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleAddInput = (type) => {
        if (type === 'user') {
            setUserInputs([...userInputs, '']);
        } else if (type === 'upper') {
            setUpperCompanyInputs([...upperCompanyInputs, '']);
        } else if (type === 'bp') {
            setBpCompanyInputs([...bpCompanyInputs, '']);
        }
    };

    const handleInputChange = (index, event, type) => {
        if (type === 'user') {
            const newInputs = [...userInputs];
            newInputs[index] = event.target.value;
            setUserInputs(newInputs);
        } else if (type === 'upper') {
            const newInputs = [...upperCompanyInputs];
            newInputs[index] = event.target.value;
            setUpperCompanyInputs(newInputs);
        } else if (type === 'bp') {
            const newInputs = [...bpCompanyInputs];
            newInputs[index] = event.target.value;
            setBpCompanyInputs(newInputs);
        }
    };

    const handleRateChange = () => {
        const values = form.getFieldsValue();
        const scores = [values.attendant, values.workAttitude, values.performance, values.leadership, values.other];
        const total = scores.reduce((acc, score) => acc + (score || 0), 0);
        const count = scores.filter((score) => score > 0).length;
        const avg = count > 0 ? (total / count).toFixed(1) : 0;
        setAverageScore(avg);
    };

    return (
        <Modal
            title="新規登録"
            maskClosable={false}
            open={openCreateModal}
            onOk={() => form.submit()}
            okText="登録"
            cancelText="キャンセル"
            onCancel={() => {
                setOpenCreateModal(false);
                resetInputs();
                form.resetFields('');
            }}
            width={'60%'}
            className="-mt-9"
        >
            <Form form={form} name="create-participation-status" onFinish={handleSubmit} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="氏名"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '氏名を入力してください！',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="営業番号"
                            name="salesNumber"
                            rules={[
                                {
                                    required: true,
                                    message: '営業番号を入力してください！',
                                },
                            ]}
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
                                    message: '所属種別を番号で入力してください！',
                                },
                            ]}
                        >
                            <InputNumber className="w-full" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="所属"
                            name="affiliation"
                            rules={[
                                {
                                    required: true,
                                    message: '所属を入力してください！',
                                },
                            ]}
                        >
                            {!isCustomAffiliation ? (
                                <Select
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
                    <TextArea autoSize />
                </Form.Item>
                <Form.Item label="提案単価" name="proposedUnitPrice">
                    <InputNumber
                        className="w-full"
                        formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item label="商流">
                    {/* Input for ユーザー */}
                    <div className="flex flex-wrap items-center">
                        <span className="w-20">ユーザー：</span>
                        {userInputs.map((input, index) => (
                            <Input
                                key={index}
                                value={input}
                                onChange={(event) => handleInputChange(index, event, 'user')}
                                className="mb-2 mr-2 flex-1 basis-1/3"
                            />
                        ))}
                        <Button onClick={() => handleAddInput('user')} className="mb-2">
                            追加
                        </Button>
                    </div>
                    {/* Input for 上位会社 */}
                    <div className="flex flex-wrap items-center">
                        <span className="w-20">上位会社：</span>
                        {upperCompanyInputs.map((input, index) => (
                            <Input
                                key={index}
                                value={input}
                                onChange={(event) => handleInputChange(index, event, 'upper')}
                                className="mb-2 mr-2 flex-1 basis-1/3"
                            />
                        ))}
                        <Button onClick={() => handleAddInput('upper')} className="mb-2">
                            追加
                        </Button>
                    </div>
                    <div className="mb-1 flex flex-wrap items-center">
                        <span className="w-20">自社：</span>
                        <span>株式会社スカイテック</span>
                    </div>

                    {/* Input for BP会社 */}
                    <div className="flex flex-wrap items-center">
                        <span className="w-20">BP会社：</span>
                        {bpCompanyInputs.map((input, index) => (
                            <Input
                                key={index}
                                value={input}
                                onChange={(event) => handleInputChange(index, event, 'bp')}
                                className="mb-2 mr-2 flex-1 basis-1/3"
                            />
                        ))}
                        <Button onClick={() => handleAddInput('bp')} className="mb-2">
                            追加
                        </Button>
                    </div>
                </Form.Item>
                <Form.Item label="お客様評価" name="customerEvaluation">
                    <TextArea autoSize />
                </Form.Item>
                <div className="flex items-center space-x-5">
                    <span>担当営業評価</span>
                    <span>平均点数：{averageScore}</span>
                </div>
                <div className="ml-5">
                    <Form.Item style={{ marginBottom: 0 }} name={'attendant'}>
                        <div className="flex items-center">
                            <span className="mr-3">勤怠</span>
                            <Rate
                                count={10}
                                onChange={(value) => {
                                    form.setFieldsValue({ attendant: value });
                                    handleRateChange();
                                }}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'attendantComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'workAttitude'}>
                        <div className="flex items-center">
                            <span className="mr-3">作業態度</span>
                            <Rate
                                count={10}
                                onChange={(value) => {
                                    form.setFieldsValue({ workAttitude: value });
                                    handleRateChange();
                                }}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'workAttitudeComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'performance'}>
                        <div className="flex items-center">
                            <span className="mr-3">パフォーマンス</span>
                            <Rate
                                count={10}
                                onChange={(value) => {
                                    form.setFieldsValue({ performance: value });
                                    handleRateChange();
                                }}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'performanceComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'leadership'}>
                        <div className="flex items-center">
                            <span className="mr-3">リーダーシップ</span>
                            <Rate
                                count={10}
                                onChange={(value) => {
                                    form.setFieldsValue({ leadership: value });
                                    handleRateChange();
                                }}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'leadershipComment'}>
                        <TextArea className="my-2" autoSize={{ minRows: 1, maxRows: 3 }} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }} name={'other'}>
                        <div className="flex items-center">
                            <span className="mr-3">そのほか</span>
                            <Rate
                                count={10}
                                onChange={(value) => {
                                    form.setFieldsValue({ other: value });
                                    handleRateChange();
                                }}
                            />
                        </div>
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
                    <TextArea autoSize />
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
                    <TextArea autoSize value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateParticipationStatus;
