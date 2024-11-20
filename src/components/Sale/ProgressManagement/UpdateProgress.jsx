import { Button, Form, Modal, notification, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { updateProgress } from '../../../services/sale.service';
import BasicInformation from './Item/BasicInformation';
import Bant from './Item/Bant';
import InformationAfterOrder from './Item/InformationAfterOrder';

const UpdateProgress = ({ openModalUpdate, setOpenModalUpdate, fetchData, selectedItem, selectedDate }) => {
    const [form] = Form.useForm();
    const [currentTab, setCurrentTab] = useState('1');

    useEffect(() => {
        if (selectedItem && selectedItem.id) {
            const formattedItem = {
                ...selectedItem,
                register_date: selectedItem.register_date ? dayjs(selectedItem.register_date) : null,
                expected_order_period: selectedItem.expected_order_period
                    ? dayjs(selectedItem.expected_order_period)
                    : null,
                order_time: selectedItem.order_time ? dayjs(selectedItem.order_time) : null,
                selection_start_time: selectedItem.selection_start_time
                    ? dayjs(selectedItem.selection_start_time)
                    : null,
                order_date: selectedItem.order_date ? dayjs(selectedItem.order_date) : null,
                quote_request_date: selectedItem.quote_request_date ? dayjs(selectedItem.quote_request_date) : null,
                entry_date: selectedItem.entry_date ? dayjs(selectedItem.entry_date) : null,
                contract_date: selectedItem.contract_date ? dayjs(selectedItem.contract_date) : null,
                exit_scheduled_date: selectedItem.exit_scheduled_date ? dayjs(selectedItem.exit_scheduled_date) : null,
            };
            form.setFieldsValue(formattedItem);
        }
    }, [openModalUpdate, selectedItem]);

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
            const res = await updateProgress(selectedItem.id, formValues);
            if (res.data) {
                notification.success({
                    message: '修正が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalUpdate(false);
                await fetchData(selectedDate);
                setCurrentTab('1');
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                title="情報修正"
                width={'75vw'}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields('');
                    setCurrentTab('1');
                }}
                maskClosable={false}
                open={openModalUpdate}
                style={{ top: 20 }}
                okText="登録"
                cancelText="キャンセル"
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
                                    修正
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default UpdateProgress;
