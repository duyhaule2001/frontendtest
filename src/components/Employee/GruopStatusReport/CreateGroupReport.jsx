import { Divider, Form, Input, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { createMemberReport } from '../../../services/employee.service';

const CreateGroupReport = ({ openModalCreate, setOpenModalCreate, selectedMember, fetchGroupData, currentEmpNo }) => {
    const [form] = Form.useForm();

    // フォームに選択されたメンバーの情報を設定
    useEffect(() => {
        if (selectedMember) {
            form.setFieldsValue({
                emp_no: selectedMember.emp_no,
                username: selectedMember.username,
            });
        }
    }, [selectedMember, form]);

    // フォームの送信処理
    const onFinish = async (values) => {
        try {
            const { data } = await createMemberReport(values.emp_no, 'personalReports', values.content);
            if (data) {
                notification.success({
                    message: '作成が成功しました。',
                    style: { width: 270 },
                });
                setOpenModalCreate(false);
                form.resetFields();
                fetchGroupData(currentEmpNo);
            }
        } catch (error) {
            console.error('Error creating report:', error);
        }
    };

    //Responsive
    const modalWidth = window.innerWidth < 640 ? '90vw' : '50vw';

    return (
        <Modal
            title="報告登録"
            okText="登録"
            cancelText="キャンセル"
            maskClosable={false}
            open={openModalCreate}
            onOk={() => form.submit()}
            onCancel={() => setOpenModalCreate(false)}
            style={{ width: modalWidth }}
        >
            <Divider className="-mt-0.5 mb-4" />
            <Form onFinish={onFinish} autoComplete="off" form={form} layout="vertical">
                <Form.Item name="emp_no" hidden rules={[{ required: true, message: 'この項目は空にできません。' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="氏名"
                    name="username"
                    rules={[{ required: true, message: 'この項目は空にできません。' }]}
                    labelCol={{ span: 24 }}
                >
                    <Input disabled className="w-full" />
                </Form.Item>
                <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: 'この項目は空にできません。' }]}
                    labelCol={{ span: 24 }}
                >
                    <Input.TextArea autoSize={{ minRows: 5, maxRows: 10 }} className="w-full" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateGroupReport;
