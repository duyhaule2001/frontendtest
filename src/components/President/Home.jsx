import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Row, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getMeetingRecord, getReportsListApproval } from '../../services/sale.service';
import { getAllReportApprovalByDate, getAllRetirementList } from '../../services/api.service';

const TextXL = ({ children }) => <span className="text-[1rem]">{children}</span>;

const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saleUnapprovedCount, setSaleUnapprovedCount] = useState(0);
    const [hrUnapprovedCount, setHrUnapprovedCount] = useState(0);
    const [gadUnapprovedCount, setGadUnapprovedCount] = useState(0);
    const [meetingUnapprovedCount, setMeetingUnapprovedCount] = useState(0);
    const [retirementUnapprovedCount, setRetirementUnapprovedCount] = useState(0);

    const gridStyle = {
        width: '50%',
        textAlign: 'center',
        cursor: 'pointer',
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    useEffect(() => {
        fetchSaleReportList();
        fetchHrReportList();
        fetchGadReportList();
        fetchMeetingList();
        fetchRetirementList();
    }, []);

    const fetchSaleReportList = async () => {
        setLoading(true);
        try {
            const res = await getReportsListApproval(dayjs().format('YYYY-MM-DD'));
            if (res?.data) {
                const unapprovedCount = res.data.filter((report) => report.ceoApproval === false).length;
                setSaleUnapprovedCount(unapprovedCount);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const fetchHrReportList = async () => {
        setLoading(true);
        try {
            const res = await getAllReportApprovalByDate(dayjs().format('YYYY-MM-DD'), 'hr');
            if (res?.data) {
                const unapprovedCount = res.data.filter((report) => report.ceoApproval === false).length;
                setHrUnapprovedCount(unapprovedCount);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const fetchGadReportList = async () => {
        setLoading(true);
        try {
            const res = await getAllReportApprovalByDate(dayjs().format('YYYY-MM-DD'), 'gad');
            if (res?.data) {
                const unapprovedCount = res.data.filter((report) => report.ceoApproval === false).length;
                setGadUnapprovedCount(unapprovedCount);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const fetchMeetingList = async () => {
        setLoading(true);
        try {
            const currentYear = dayjs().year();
            const currentMonth = dayjs().month() + 1;
            const res = await getMeetingRecord(currentYear, currentMonth);
            if (res?.data) {
                const unapprovedCount = res.data.filter((meeting) => meeting.presidentApproval === false).length;
                setMeetingUnapprovedCount(unapprovedCount);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const fetchRetirementList = async () => {
        setLoading(true);
        try {
            const res = await getAllRetirementList();
            if (res?.data) {
                const unapprovedCount = res.data.filter((retirement) => retirement.president_approval === false).length;
                setRetirementUnapprovedCount(unapprovedCount);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className="p-10">
            <Spin spinning={loading}>
                <Row gutter={[100, 100]}>
                    <Col span={12}>
                        <Card
                            title={<TextXL>営業部</TextXL>}
                            styles={{
                                header: {
                                    backgroundColor: '#3d88f6',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('saleReportApproval')}>
                                <Badge count={saleUnapprovedCount} offset={[6, -2]} size="small" showZero={false}>
                                    <TextXL>日報</TextXL>
                                </Badge>
                            </Card.Grid>

                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('saleAttendanceManagement')}>
                                <TextXL>勤怠</TextXL>
                            </Card.Grid>

                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('meetingRecordManagement')}>
                                <Badge count={meetingUnapprovedCount} offset={[6, -2]} size="small" showZero={false}>
                                    <TextXL>会議記録</TextXL>
                                </Badge>
                            </Card.Grid>

                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('customerInformation')}>
                                <TextXL>お客様情報</TextXL>
                            </Card.Grid>
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('customerGift')}>
                                <TextXL>お客様ギフト</TextXL>
                            </Card.Grid>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title={<TextXL>人事部</TextXL>}
                            styles={{
                                header: {
                                    backgroundColor: '#3d88f6',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('hrReportApproval')}>
                                <Badge count={hrUnapprovedCount} offset={[6, -2]} size="small" showZero={false}>
                                    <TextXL>日報</TextXL>
                                </Badge>
                            </Card.Grid>
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('generalInformation')}>
                                <TextXL>一般情報</TextXL>
                            </Card.Grid>

                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('retirementApproval')}>
                                <Badge count={retirementUnapprovedCount} offset={[6, -2]} size="small" showZero={false}>
                                    <TextXL>退職承認</TextXL>
                                </Badge>
                            </Card.Grid>

                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('hrAttendanceManagement')}>
                                <TextXL>勤怠</TextXL>
                            </Card.Grid>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title={<TextXL>総務部</TextXL>}
                            styles={{
                                header: {
                                    backgroundColor: '#3d88f6',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('gadReportApproval')}>
                                <Badge count={gadUnapprovedCount} offset={[6, -2]} size="small" showZero={false}>
                                    <TextXL>日報</TextXL>
                                </Badge>
                            </Card.Grid>

                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('gadAttendanceManagement')}>
                                <TextXL>勤怠</TextXL>
                            </Card.Grid>

                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('accountCreate')}>
                                <TextXL>アカウント作成</TextXL>
                            </Card.Grid>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card
                            title={<TextXL>総技術者</TextXL>}
                            styles={{
                                header: {
                                    backgroundColor: '#3d88f6',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('workingList')}>
                                <TextXL>稼働リスト</TextXL>
                            </Card.Grid>
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('entranceAndExitList')}>
                                <TextXL>入退場リスト</TextXL>
                            </Card.Grid>
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('newEmployeeInfo')}>
                                <TextXL>新入社員情報</TextXL>
                            </Card.Grid>
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('participation')}>
                                <TextXL>要員参画状況</TextXL>
                            </Card.Grid>
                            <Card.Grid style={gridStyle} onClick={() => handleNavigate('internalTrainingAuthority')}>
                                <TextXL>社内教育権限</TextXL>
                            </Card.Grid>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default Home;
