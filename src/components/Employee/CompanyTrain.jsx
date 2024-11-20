import React, { useEffect, useState } from 'react';

import { getCourseItems } from '../../services/employee.service';
import TitleCus from '../Common/Layout/TitleCus';
import { Card, Col, Row, Spin } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const CompanyTrain = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [animationStates, setAnimationStates] = useState([]);

    // Fetch data
    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {
        setLoading(true);
        try {
            const res = await getCourseItems();
            if (res.data) {
                setItems(res.data);
                setAnimationStates(Array(res.data.length).fill(false)); // Khởi tạo trạng thái animation
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    // Thực hiện animation sau khi dữ liệu được tải
    useEffect(() => {
        if (items.length > 0) {
            items.forEach((_, index) => {
                setTimeout(() => {
                    setAnimationStates((prev) => {
                        const newState = [...prev];
                        newState[index] = true; // Bật animation cho từng card
                        return newState;
                    });
                }, index * 350); // Delay giữa các Card (150ms)
            });
        }
    }, [items]);

    return (
        <>
            <TitleCus title={'社内教育'} />
            <div className="p-16">
                <Spin spinning={loading}>
                    <Row gutter={[48, 48]}>
                        {items.length > 0 ? (
                            items.map((item, index) => (
                                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                        }}
                                    >
                                        <Card
                                            className={`flex h-full w-full transform flex-col justify-between overflow-hidden rounded-lg bg-gray-50 shadow-md transition-all duration-700 ease-out ${
                                                animationStates[index]
                                                    ? 'translate-y-0 opacity-100'
                                                    : 'translate-y-10 opacity-0'
                                            }`}
                                            cover={
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        height: '200px',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <img
                                                        alt={item.title}
                                                        src={item.image_path}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </div>
                                            }
                                        >
                                            <div
                                                className="flex items-center justify-center text-xl font-bold"
                                                style={{ minHeight: '50px', textAlign: 'center' }}
                                            >
                                                {item.title}
                                            </div>
                                            <span className="mt-3 flex items-center justify-between">
                                                <div>
                                                    <ClockCircleOutlined className="mr-1" />
                                                    {item.study_time}時間
                                                </div>
                                                <div>
                                                    <span>終了日: {item.date}</span>
                                                </div>
                                            </span>
                                        </Card>
                                    </a>
                                </Col>
                            ))
                        ) : (
                            <span>
                                現在利用可能なコースがありません。 <br /> 新しいコースが追加されるのをお待ちください。
                            </span>
                        )}
                    </Row>
                </Spin>
            </div>
        </>
    );
};

export default CompanyTrain;
