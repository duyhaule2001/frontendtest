import React, { useEffect, useState } from 'react';
import { Button, Card, DatePicker, Divider, Row, Col, Spin, Tag, Tooltip } from 'antd';
import { getGroupList } from '../../../../services/sale.service';
import { UserOutlined } from '@ant-design/icons';
import ViewReport from './ViewReport';
import dayjs from 'dayjs';
import TitleCus from '../../../Common/Layout/TitleCus';

const ViewGroupsReport = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openModalViewReport, setOpenModalViewReport] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        fetchGroups(selectedDate);
    }, [selectedDate]);

    const fetchGroups = async (selectedDate) => {
        setLoading(true);
        try {
            const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM') : null;
            const res = await getGroupList(formattedDate);
            if (res.data) {
                setGroups(res.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    console.log(groups);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <>
            <TitleCus title={'リーダー管理'} />
            <div className="px-10">
                <Spin spinning={loading}>
                    <Row className="mb-7 mt-10">
                        <DatePicker
                            picker="month"
                            placeholder="年月"
                            format="YYYY-MM"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </Row>
                    <Row gutter={[24, 24]}>
                        {groups &&
                            groups.map((group, index) => (
                                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                    <Card className="rounded-lg py-3 shadow-md">
                                        <div className="-mt-5 mb-16 flex h-8 flex-col items-center">
                                            {group?.leader?.img_path ? (
                                                <img
                                                    src={group?.leader?.img_path}
                                                    className="h-[50px] w-[50px] rounded-full"
                                                    alt="Leader"
                                                />
                                            ) : (
                                                <UserOutlined className="text-[50px]" />
                                            )}

                                            <Tooltip
                                                placement="bottom"
                                                color="blue"
                                                className="relative"
                                                title={group?.leader?.username}
                                                destroyTooltipOnHide={true}
                                            >
                                                <Button
                                                    onClick={() => {
                                                        setOpenModalViewReport(true);
                                                        setSelectedUser(group.leader);
                                                        setSelectedGroupId(group.group_id);
                                                        setSelectedRole('leader');
                                                    }}
                                                    className="mt-1 text-sm font-medium hover:cursor-pointer"
                                                >
                                                    {group?.leader?.username}
                                                </Button>
                                            </Tooltip>
                                        </div>
                                        <Divider />
                                        <Row gutter={[8, 8]}>
                                            {group.members &&
                                                group.members.map((member, index) => (
                                                    <Col key={index} xs={12} sm={8}>
                                                        <div className="flex flex-col items-center">
                                                            {member.img_path ? (
                                                                <img
                                                                    src={member.img_path}
                                                                    className="h-[50px] w-[50px] rounded-full"
                                                                    alt="Member"
                                                                />
                                                            ) : (
                                                                <UserOutlined className="text-[50px]" />
                                                            )}

                                                            <Tooltip
                                                                placement="bottom"
                                                                color="blue"
                                                                title={member.username}
                                                            >
                                                                <Tag
                                                                    onClick={() => {
                                                                        setOpenModalViewReport(true);
                                                                        setSelectedUser(member);
                                                                        setSelectedGroupId(group.group_id);
                                                                        setSelectedRole('members');
                                                                    }}
                                                                    className="mt-1 w-full max-w-[80px] truncate px-2 text-xs font-medium hover:cursor-pointer"
                                                                >
                                                                    {member.username}
                                                                </Tag>
                                                            </Tooltip>
                                                        </div>
                                                    </Col>
                                                ))}
                                        </Row>
                                    </Card>
                                </Col>
                            ))}
                    </Row>
                </Spin>
                <ViewReport
                    openModalViewReport={openModalViewReport}
                    setOpenModalViewReport={setOpenModalViewReport}
                    selectedUser={selectedUser}
                    selectedGroupId={selectedGroupId}
                    selectedRole={selectedRole}
                    selectedDate={selectedDate ? selectedDate.format('YYYY-MM') : null}
                />
            </div>
        </>
    );
};

export default ViewGroupsReport;
