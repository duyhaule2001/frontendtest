import {
    DatePicker,
    Divider,
    Form,
    Input,
    Modal,
    Upload,
    Button,
    notification,
    InputNumber,
    Row,
    Col,
    Image,
} from 'antd';
import { EyeOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { updatePaidManagement } from '../../../../services/hr.service';

const UpdatePaidLeaveManager = ({
    setOpenModalUpdatePaidLeave,
    updatePaidLeave,
    openModalUpdatePaidLeave,
    setOpenManagerView,
    fetchPaidLeaveManagement,
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState(updatePaidLeave?.file || '');

    useEffect(() => {
        if (updatePaidLeave && updatePaidLeave.date) {
            form.setFieldsValue({
                ...updatePaidLeave,
                date: updatePaidLeave.date ? dayjs(updatePaidLeave.date) : null,
            });
            setPreviewImage(updatePaidLeave.file || '');
        }
    }, [updatePaidLeave, openModalUpdatePaidLeave]);

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('date', values.date ? values.date.format('YYYY-MM-DD') : null);
            formData.append('cause', values.cause);
            formData.append('vacation_time', values.vacation_time);

            // Append file if it exists in fileList
            if (fileList.length > 0) {
                formData.append('file', fileList[0].originFileObj);
            }

            const res = await updatePaidManagement(updatePaidLeave.id, formData);
            if (res.data) {
                notification.success({
                    message: '有給修正が成功しました。',
                    style: {
                        width: 310,
                    },
                });
                setOpenModalUpdatePaidLeave(false);
                setOpenManagerView(false);
                fetchPaidLeaveManagement();
            } else {
                notification.error({
                    message: '有給修正が失敗しました。',
                    style: {
                        width: 310,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = ({ fileList }) => {
        setFileList(fileList);
        if (fileList.length > 0) {
            const newImage = URL.createObjectURL(fileList[0].originFileObj);
            setPreviewImage(newImage);
        }
    };

    return (
        <>
            <Modal
                title="管理者有給休暇修正"
                open={openModalUpdatePaidLeave}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    setOpenModalUpdatePaidLeave(false);
                    setFileList([]);
                    form.resetFields('');
                }}
                maskClosable={false}
                okText="登録"
                cancelText="キャンセル"
            >
                <Divider />
                <Form onFinish={onFinish} form={form} layout="vertical">
                    <Row gutter={10}>
                        <Col span={24}>
                            <Form.Item label="日付" name="date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={19}>
                            <Form.Item label="原因" name="cause">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={5}>
                            <Form.Item label="休暇時間" name="vacation_time">
                                <InputNumber />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="" className="flex flex-col items-center">
                                <div className="flex flex-col items-center">
                                    {previewImage && (
                                        <Image
                                            width={50}
                                            height={50}
                                            src={previewImage}
                                            alt="Current Image"
                                            className="mb-2 rounded-full"
                                            preview={{
                                                mask: <EyeOutlined style={{ fontSize: 15, color: 'white' }} />,
                                            }}
                                        />
                                    )}
                                    <Upload
                                        listType="picture"
                                        fileList={fileList}
                                        onChange={handleChange}
                                        beforeUpload={(file) => {
                                            const isJpgOrPngOrPdf =
                                                file.type === 'image/jpeg' || file.type === 'image/png';

                                            if (!isJpgOrPngOrPdf) {
                                                message.error(' JPG と PNG 以外のファイルはアップロードできません。');
                                            }

                                            return false;
                                        }}
                                        className="mt-2"
                                        multiple={false}
                                        maxCount={1}
                                    >
                                        <Button icon={<UploadOutlined />}>新しい写真をアップロード</Button>
                                    </Upload>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default UpdatePaidLeaveManager;
