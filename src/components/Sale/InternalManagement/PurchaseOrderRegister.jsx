import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, InputNumber, message, notification, Row, Upload } from 'antd';
import React, { useState } from 'react';
import { submitPurchaseOrder, uploadPdfPurchaseOrder } from '../../../services/sale.service.js';

const PurchaseOrderRegister = () => {
    const [fileList, setFileList] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [backendData, setBackendData] = useState([]);
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    //PDF送信
    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error('ファイルを選択してください。');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileList[0]);

        setIsLoading(true);
        try {
            const res = await uploadPdfPurchaseOrder(formData);
            if (res.data) {
                setBackendData(res.data);

                // ページでPDF表示
                const tempUrl = URL.createObjectURL(fileList[0].originFileObj);
                setPdfUrl(tempUrl);

                form.setFieldsValue({
                    companyName: res.data.companyName,
                    totalAmount: res.data.totalAmount,
                    projectName: res.data.projectName,
                    deliverables: res.data.deliverables,
                    paymentTerms: res.data.paymentTerms,
                    referenceEstimate: res.data.referenceEstimate,
                    contractPeriod: res.data.contractPeriod,
                    contractType: res.data.contractType,
                    number: res.data.number,
                    personnel: res.data.personnel,
                    unitPrice: res.data.unitPrice,
                    quantity: res.data.quantity,
                    unit: res.data.unit,
                    amount: res.data.amount,
                    settlementRange: res.data.settlementRange,
                    deductionSettlement: res.data.deductionSettlement,
                    workLocation: res.data.workLocation,
                    orderNumber: res.data.orderNumber,
                    orderDate: res.data.orderDate,
                    unitMinutes: res.data.unitMinutes,
                });

                notification.success({
                    message: 'ファイル送信が成功しました。',
                });
            }
        } catch (error) {
            notification.error({
                message: 'ファイル送信が失敗しました。',
            });
        }
        setIsLoading(false);
    };

    //PDFとデータ登録
    const handleSubmit = async (values) => {
        setIsLoading(true);
        if (fileList.length === 0) {
            message.error('ファイルを選択してください。');
            return;
        }

        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });

        formData.append('file', fileList[0].originFileObj);

        //チェック登録データ
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            const res = await submitPurchaseOrder(formData);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setFileList([]);
                setPdfUrl(null);
            }
        } catch (error) {
            notification.error({
                message: '登録が失敗しました。',
                style: {
                    width: 270,
                },
            });
        }
        setIsLoading(false);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isPdf = file.type === 'application/pdf';

            if (isPdf) {
                setFileList([file]);
                return false;
            }

            if (!isPdf) {
                message.error('PDFファイルのみを選択してください。');
            }
            return isPdf || Upload.LIST_IGNORE;
        },
        onRemove: () => {
            setFileList([]);
            setPdfUrl(null);
        },
        fileList,
        onChange: ({ fileList }) => {
            setFileList(fileList.filter((file) => file.type === 'application/pdf'));
        },
    };

    return (
        <div className="mt-20 flex flex-col items-center justify-center space-y-3">
            <Upload {...uploadProps} onRemove={() => setFileList([])} fileList={fileList} maxCount={1}>
                <Button icon={<UploadOutlined />}>PDFをアップロード</Button>
            </Upload>

            {fileList && fileList.length > 0 && (
                <Button loading={isLoading} onClick={handleUpload} type="primary">
                    ファイル送信
                </Button>
            )}

            {pdfUrl && (
                <Row gutter={16} className="mt-10 p-5">
                    <Col span={12}>
                        <iframe
                            src={`${pdfUrl}#zoom=100`}
                            className="h-full w-full"
                            title="Uploaded PDF"
                            style={{ minHeight: '600px' }}
                        />
                    </Col>
                    <Col span={12}>
                        <Card title="注文詳細確認">
                            {backendData ? (
                                <Form form={form} onFinish={handleSubmit} layout="vertical">
                                    <Row gutter={24}>
                                        <>
                                            <Col span={12}>
                                                <Form.Item label="会社名" name="companyName">
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item label="合計金額" name="totalAmount">
                                                    <InputNumber
                                                        className="w-full"
                                                        formatter={(value) =>
                                                            `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                        }
                                                        parser={(value) => value.replace(/￥\s?|(,*)/g, '')}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </>

                                        <Divider
                                            style={{
                                                borderColor: '#D1D5DB',
                                            }}
                                        >
                                            案件および契約情報
                                        </Divider>

                                        <>
                                            <Col span={12}>
                                                <Form.Item label="案件名" name="projectName">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="参照見積" name="referenceEstimate">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="提供物" name="deliverables">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="契約期間" name="contractPeriod">
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item label="支払い条件" name="paymentTerms">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="契約形態" name="contractType">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </>

                                        <Divider
                                            style={{
                                                borderColor: '#D1D5DB',
                                            }}
                                        >
                                            費用明細
                                        </Divider>

                                        <>
                                            <Col span={12}>
                                                <Form.Item label="社員番号" name="number">
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item label="要員" name="personnel">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="単価" name="unitPrice">
                                                    <InputNumber
                                                        className="w-full"
                                                        formatter={(value) =>
                                                            `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                        }
                                                        parser={(value) => value.replace(/￥\s?|(,*)/g, '')}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="数量" name="quantity">
                                                    <InputNumber className="w-full" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="単位" name="unit">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="金額" name="amount">
                                                    <InputNumber
                                                        className="w-full"
                                                        formatter={(value) =>
                                                            `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                        }
                                                        parser={(value) => value.replace(/￥\s?|(,*)/g, '')}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item label="合計金額" name="totalAmount">
                                                    <InputNumber
                                                        className="w-full"
                                                        formatter={(value) =>
                                                            `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                        }
                                                        parser={(value) => value.replace(/￥\s?|(,*)/g, '')}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </>

                                        <Divider
                                            style={{
                                                borderColor: '#D1D5DB',
                                            }}
                                        >
                                            契約および注文情報{' '}
                                        </Divider>

                                        <>
                                            <Col span={12}>
                                                <Form.Item label="精算幅" name="settlementRange">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="作業場所" name="workLocation">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="控除精算" name="deductionSettlement">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="注文番号" name="orderNumber">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="単位" name="unitMinutes">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label="注文日付" name="orderDate">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                        </>
                                        <Col span={24}>
                                            <Button
                                                loading={isLoading}
                                                type="primary"
                                                htmlType="submit"
                                                style={{ float: 'right' }}
                                            >
                                                登録
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            ) : (
                                <p>データがありません。</p>
                            )}
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default PurchaseOrderRegister;
