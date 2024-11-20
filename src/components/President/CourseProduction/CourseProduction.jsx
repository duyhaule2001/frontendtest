import { Button, Card, Col, notification, Popconfirm, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateCourse from './CreateCourse';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { deleteCourse, getRegisteredCourse } from '../../../services/common.service';
import Meta from 'antd/es/card/Meta';
import UpdateCourse from './UpdateCourse';
import TitleCus from '../../Common/Layout/TitleCus';
import no_image from '../../../assets/No_Image_Available.jpg';
import { useNavigate } from 'react-router';

const CourseProduction = () => {
    const [listCourse, setListCourse] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [openUpdateCourse, setOpenUpdateCourse] = useState(false);
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCourse();
    }, []);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const res = await getRegisteredCourse();
            if (res?.data) {
                setListCourse(res?.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteCourse(id);
            if (res.data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                await fetchCourse();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <TitleCus title={'社内教育権限管理'} />
            <div className="px-20 py-10">
                <div className="mb-5 flex justify-end">
                    <Button type="primary" onClick={() => setOpenCreateModal(true)}>
                        講座作成
                    </Button>
                </div>
                <Spin spinning={loading}>
                    <Row gutter={[56, 56]}>
                        {listCourse &&
                            listCourse.map((course) => (
                                <Col key={course.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                                    <Card
                                        cover={
                                            <img
                                                style={{
                                                    width: '100%',
                                                    height: 210,
                                                    objectFit: 'cover',
                                                }}
                                                alt={course.courseName}
                                                src={course.img && !isError ? course.img : no_image}
                                                onError={() => setIsError(true)}
                                            />
                                        }
                                        className="flex h-full flex-col justify-between"
                                        actions={[
                                            <SettingOutlined
                                                onClick={() => {
                                                    navigate(`course/${course.id}`, {
                                                        state: { courseName: course.courseName },
                                                    });
                                                }}
                                                key="setting"
                                                style={{ color: '#1890ff' }}
                                            />,
                                            <EditOutlined
                                                key="edit"
                                                style={{ color: '#1e90ff' }}
                                                onClick={() => {
                                                    setOpenUpdateCourse(true);
                                                    setSelectedCourse(course);
                                                }}
                                            />,
                                            <Popconfirm
                                                placement="bottom"
                                                title="確認"
                                                description={`${course.courseName}コースを削除してもよろしいですか？`}
                                                okText="削除"
                                                cancelText="キャンセル"
                                                onConfirm={() => handleDelete(course.id)}
                                            >
                                                <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} />
                                            </Popconfirm>,
                                        ]}
                                    >
                                        <Meta
                                            title={
                                                <span className="flex justify-center whitespace-normal break-words text-center text-xl font-bold">
                                                    {course.courseName}
                                                </span>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                    </Row>
                </Spin>
                <CreateCourse
                    openCreateModal={openCreateModal}
                    setOpenCreateModal={setOpenCreateModal}
                    fetchCourse={fetchCourse}
                />

                <UpdateCourse
                    openUpdateCourse={openUpdateCourse}
                    setOpenUpdateCourse={setOpenUpdateCourse}
                    selectedCourse={selectedCourse}
                    fetchCourse={fetchCourse}
                />
            </div>
        </>
    );
};

export default CourseProduction;
