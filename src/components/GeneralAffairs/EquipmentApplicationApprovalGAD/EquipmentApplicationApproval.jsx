import React, { useEffect, useState } from 'react';
import { Col, Image, notification, Row, Steps, Button, Popconfirm, Spin, DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import { approveItem, setUnapprovedItems } from '../../../redux/approval/approvalSlice';
import TitleCus from '../../Common/Layout/TitleCus';
import ViewEquipmentOrder from './ViewEquipmentOrder';
import dayjs from 'dayjs';
import { EyeOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getApplicationList, setStatusApplicationList } from '../../../services/common.service';

const EquipmentAppApproval = () => {
    const [applicationList, setApplicationList] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedEquipmentOrder, setSelectedEquipmentOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(dayjs());
    const [imageError, setImageError] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        fetchApplicationList(date);
    }, [date]);

    const fetchApplicationList = async (date) => {
        setLoading(true);
        try {
            const year = date.format('YYYY');
            const month = date.format('MM');
            const res = await getApplicationList(year, month);
            if (res.data && Array.isArray(res.data)) {
                setApplicationList([...res.data]);
                dispatch(setUnapprovedItems(res.data));
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const onChange = (date) => {
        setDate(date);
    };

    const handleApproval = async (id, type) => {
        try {
            const res = await setStatusApplicationList(id, type);
            if (res.status === 200) {
                await fetchApplicationList(date);
                dispatch(approveItem(id));
                notification.success({
                    message: res.data.message,
                    style: {
                        width: 300,
                    },
                });
            } else {
                notification.error({
                    message: res.error,
                    style: {
                        width: 375,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleViewEquipment = (item) => {
        setSelectedEquipmentOrder(item);
        setOpenViewModal(true);
    };

    const getStepItems = (item) => [
        {
            icon: item.approverStatus ? (
                <CheckCircleOutlined style={{ color: '#1890ff' }} />
            ) : (
                <Popconfirm
                    title="確認"
                    okText="承認"
                    cancelText="キャンセル"
                    placement="bottom"
                    description="この申請を承認してもよろしいですか？"
                    onConfirm={(e) => {
                        e.stopPropagation();
                        handleApproval(item.id, 'confirm');
                    }}
                >
                    <Button type="primary" size="small" onClick={(e) => e.stopPropagation()}>
                        承認
                    </Button>
                </Popconfirm>
            ),
        },
        {
            icon: item.orderStatus ? (
                <CheckCircleOutlined style={{ color: '#1890ff' }} />
            ) : (
                <Popconfirm
                    title="確認"
                    okText="注文"
                    cancelText="キャンセル"
                    placement="bottom"
                    description="この申請された備品を注文してもよろしいですか？"
                    onConfirm={(e) => {
                        e.stopPropagation();
                        handleApproval(item.id, 'order');
                    }}
                >
                    <Button type="primary" size="small" onClick={(e) => e.stopPropagation()}>
                        注文
                    </Button>
                </Popconfirm>
            ),
        },
        {
            icon: item.deliveryStatus ? (
                <CheckCircleOutlined style={{ color: '#1890ff' }} />
            ) : (
                <Popconfirm
                    title="確認"
                    okText="到着"
                    cancelText="キャンセル"
                    placement="bottom"
                    description="この申請備品を到着済みにしますか？"
                    onConfirm={(e) => {
                        e.stopPropagation();
                        handleApproval(item.id, 'delivery');
                    }}
                >
                    <Button type="primary" size="small" onClick={(e) => e.stopPropagation()}>
                        到着
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div className="mt-16 h-full w-full bg-white">
            <TitleCus title={'社用備品申請承認'} />
            <div className="px-20 pt-10">
                <div className="flex items-center justify-between">
                    <DatePicker className="mb-4" onChange={onChange} picker="month" value={date} />
                    <Button type="primary" onClick={() => fetchApplicationList(dayjs())}>
                        <ReloadOutlined />
                    </Button>
                </div>
                <Spin spinning={loading}>
                    <Row gutter={[80, 20]}>
                        {applicationList
                            .sort((a, b) => {
                                return (
                                    a.approverStatus - b.approverStatus ||
                                    a.orderStatus - b.orderStatus ||
                                    a.deliveryStatus - b.deliveryStatus
                                );
                            })
                            .map((item, index) => (
                                <Col span={12} key={index}>
                                    <div
                                        className="rounded-lg p-4 shadow-md"
                                        style={{
                                            height: '180px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Row>
                                            <Col span={8}>
                                                {item.imageUrl && !imageError ? (
                                                    <Image
                                                        width={143}
                                                        height={143}
                                                        src={item.imageUrl}
                                                        preview={{
                                                            mask: (
                                                                <EyeOutlined style={{ fontSize: 15, color: 'white' }} />
                                                            ),
                                                        }}
                                                        onError={() => setImageError(true)}
                                                        style={{
                                                            objectFit: 'cover',
                                                            width: '100%',
                                                            height: '100%',
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: 143,
                                                            height: 143,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '1px solid #d9d9d9',
                                                            color: '#8c8c8c',
                                                            fontSize: '16px',
                                                        }}
                                                    >
                                                        未登録
                                                    </div>
                                                )}
                                            </Col>

                                            <Col span={16}>
                                                <div className="space-y-2">
                                                    <div>
                                                        <span>申請日：</span>
                                                        <span>{dayjs(item.createdDate).format('YYYY-MM-DD')}</span>
                                                    </div>
                                                    <div>
                                                        <span>申請備品：</span>
                                                        <span
                                                            onClick={() => handleViewEquipment(item)}
                                                            className="cursor-pointer font-semibold text-blue-500 hover:underline"
                                                        >
                                                            {item.equipmentName}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span>申請者名：</span>
                                                        <span>{item.applicantName}</span>
                                                    </div>
                                                </div>
                                                <Steps
                                                    className="mt-9 w-full"
                                                    style={{ display: 'flex', justifyContent: 'space-between' }}
                                                    size="small"
                                                    labelPlacement="horizontal"
                                                    items={getStepItems(item)}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            ))}
                    </Row>
                </Spin>
            </div>
            <ViewEquipmentOrder
                openViewModal={openViewModal}
                setOpenViewModal={setOpenViewModal}
                selectedOrder={selectedEquipmentOrder}
            />
        </div>
    );
};

export default EquipmentAppApproval;
