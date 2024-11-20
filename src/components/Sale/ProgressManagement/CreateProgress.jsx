import { Form, Modal, notification, Tabs, Button } from 'antd';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { createProgress } from '../../../services/sale.service';
import BasicInformation from './Item/BasicInformation';
import Bant from './Item/Bant';
import InformationAfterOrder from './Item/InformationAfterOrder';

const CreateProgress = ({ openModalCreate, setOpenModalCreate, selectedDate, fetchData }) => {
    const [form] = Form.useForm();
    const [currentTab, setCurrentTab] = useState('1');

    const items = [
        {
            key: '1',
            label: '基本情報',
            children: <BasicInformation />,
        },
        {
            key: '2',
            label: 'BANT',
            children: <Bant />,
        },
        {
            key: '3',
            label: '受注後情報',
            children: <InformationAfterOrder />,
        },
    ];

    const onFinish = async (values) => {
        const formValues = {
            ...values,
            register_date: values.register_date ? dayjs(values.register_date).format('YYYY-MM-DD') : null,
            expected_order_period: values.expected_order_period
                ? dayjs(values.expected_order_period).format('YYYY-MM-DD')
                : null,
            order_time: values.order_time ? dayjs(values.order_time).format('YYYY-MM-DD') : null,
            selection_start_time: values.selection_start_time
                ? dayjs(values.selection_start_time).format('YYYY-MM-DD')
                : null,
            order_date: values.order_date ? dayjs(values.order_date).format('YYYY-MM-DD') : null,
            quote_request_date: values.quote_request_date
                ? dayjs(values.quote_request_date).format('YYYY-MM-DD')
                : null,
            entry_date: values.entry_date ? dayjs(values.entry_date).format('YYYY-MM-DD') : null,
            contract_date: values.contract_date ? dayjs(values.contract_date).format('YYYY-MM-DD') : null,
            exit_scheduled_date: values.exit_scheduled_date
                ? dayjs(values.exit_scheduled_date).format('YYYY-MM-DD')
                : null,
        };

        try {
            const res = await createProgress(formValues);
            if (res.data) {
                notification.success({
                    message: '登録が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalCreate(false);
                form.resetFields('');
                fetchData(selectedDate);
                setCurrentTab('1');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const nextTab = () => {
        form.validateFields()
            .then(() => {
                const next = (parseInt(currentTab, 10) + 1).toString();
                setCurrentTab(next);
            })
            .catch((errorInfo) => {
                console.log('Validate Failed:', errorInfo);
            });
    };

    const prevTab = () => {
        const prev = (parseInt(currentTab, 10) - 1).toString();
        setCurrentTab(prev);
    };

    return (
        <div>
            <Modal
                title=""
                width={'75vw'}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields('');
                    setCurrentTab('1');
                }}
                maskClosable={false}
                open={openModalCreate}
                style={{ top: 20 }}
                footer={null}
            >
                <div>
                    <Form form={form} onFinish={onFinish}>
                        <Tabs activeKey={currentTab} items={items} />
                        <div className="steps-action mt-4 flex justify-end">
                            {currentTab !== '1' && (
                                <Button style={{ margin: '0 8px' }} onClick={prevTab}>
                                    戻る
                                </Button>
                            )}
                            {currentTab !== '3' && (
                                <Button type="primary" onClick={nextTab}>
                                    次へ
                                </Button>
                            )}
                            {currentTab === '3' && (
                                <Button type="primary" onClick={() => form.submit()}>
                                    登録
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default CreateProgress;
