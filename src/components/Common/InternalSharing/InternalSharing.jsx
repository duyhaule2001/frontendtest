import React, { useEffect, useState } from 'react';
import TitleCus from '../Layout/TitleCus';
import { Button, Col, DatePicker, notification, Popconfirm, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import CreateInternalSharing from './CreateInternalSharing';
import UpdateInternalSharing from './UpdateInternalSharing';
import { useSelector } from 'react-redux';
import { deleteSharingApi, getSharingApi } from '../../../services/common.service';
import { useNavigate } from 'react-router';

const InternalSharing = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.account.user);
    const [data, setData] = useState([]);
    const [createSharing, setCreateSharing] = useState(false);
    const [selectedSharing, setSelectedSharing] = useState();
    const [updateSharing, setUpdateSharing] = useState(false);
    const [yearMonth, setYearMonth] = useState(dayjs());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (yearMonth) {
            const year = yearMonth.year();
            const month = yearMonth.month() + 1;
            fetchData(year, month);
        }
    }, [yearMonth]);

    const fetchData = async (year, month) => {
        setLoading(true);
        try {
            const res = await getSharingApi(year, month);
            if (res.data && Array.isArray(res.data)) {
                setData(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (data.length > 0) {
            data.forEach((event, index) => {
                const elements = document.getElementsByClassName(`event-${event.id}`);
                if (elements.length > 0) {
                    elements[0].classList.remove('animate-fadeInUp');
                }
                setTimeout(() => {
                    if (elements.length > 0) {
                        elements[0].classList.add('animate-fadeInUp');
                    }
                }, index * 200);
            });
        }
    }, [data]);

    const handleDelete = async (sharing) => {
        try {
            const res = await deleteSharingApi(sharing.id);
            if (res.data) {
                fetchData(yearMonth.year(), yearMonth.month() + 1);
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
            } else {
                notification.error({
                    message: '削除が失敗しました。',
                    style: {
                        width: 270,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <TitleCus title={'内務共有'} />
            <div className="w-full px-36 py-10">
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <DatePicker
                            picker="month"
                            placeholder="年月"
                            format="YYYY-MM"
                            value={yearMonth}
                            onChange={(date) => {
                                setYearMonth(date);
                            }}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={16} lg={18}>
                        <div className="flex justify-end space-x-2">
                            <Button type="primary" onClick={() => setCreateSharing(true)}>
                                <PlusOutlined />
                                新規登録
                            </Button>
                            <Button type="primary" onClick={() => navigate('event')}>
                                社内活動
                                <ArrowRightOutlined />
                            </Button>
                            <Button type="primary" onClick={() => fetchData(dayjs().year(), dayjs().month() + 1)}>
                                <ReloadOutlined />
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Spin spinning={loading}>
                    <Row gutter={[16, 16]} className="mt-6">
                        {data.map((sharing) => (
                            <Col xs={24} sm={24} key={sharing.id}>
                                <div className={`rounded-lg p-4 shadow-md event-${sharing.id}`}>
                                    <div className="flex justify-between">
                                        <div className="flex w-full flex-col">
                                            <div className="flex justify-between">
                                                <span className="text-2xl font-normal">{sharing.title}</span>
                                                {user.emp_no === sharing.emp_no && (
                                                    <div className="flex space-x-3">
                                                        <EditOutlined
                                                            onClick={() => {
                                                                setUpdateSharing(true);
                                                                setSelectedSharing(sharing);
                                                            }}
                                                            className="text-blue-700"
                                                        />
                                                        <Popconfirm
                                                            title="確認"
                                                            description={`${sharing.title} を削除してもよろしいですか？`}
                                                            placement="bottom"
                                                            okText="削除"
                                                            cancelText="キャンセル"
                                                            onConfirm={() => handleDelete(sharing)}
                                                        >
                                                            <DeleteOutlined className="text-red-500" />
                                                        </Popconfirm>
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className="my-2 whitespace-pre-wrap break-words"
                                                dangerouslySetInnerHTML={{
                                                    __html: sharing.content.replace(
                                                        /(https?:\/\/[^\s]+)/g,
                                                        '<a href="$1" class="text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer">$1</a>',
                                                    ),
                                                }}
                                            />
                                            <div className="flex justify-end">
                                                <span className="italic text-gray-500">作成者：{sharing.name}</span>
                                                <span className="ml-5 italic text-gray-500">
                                                    作成日：
                                                    {dayjs(sharing.create_date).format('YYYY-MM-DD HH:mm:ss')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Spin>
            </div>

            <CreateInternalSharing
                createSharing={createSharing}
                setCreateSharing={setCreateSharing}
                fetchData={fetchData}
            />
            <UpdateInternalSharing
                updateSharing={updateSharing}
                setUpdateSharing={setUpdateSharing}
                selectedSharing={selectedSharing}
                fetchData={fetchData}
            />
        </>
    );
};

export default InternalSharing;
