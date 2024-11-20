import React, { useEffect, useState } from 'react';
import TitleCus from '../../Common/Layout/TitleCus';
import { Button, Col, Divider, Form, Popconfirm, Radio, Row, Spin, Tag, notification } from 'antd';
import CreateGroupReport from './CreateGroupReport';
import { deleteMemberReport, getMemberGroup } from '../../../services/employee.service';
import { useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';

const GroupStatusReports = () => {
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [leader, setLeader] = useState(null);
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedReportType, setSelectedReportType] = useState('personalReports');

    // ログインしているユーザーの社員番号を取得
    const currentEmpNo = useSelector((state) => state.account.user.emp_no);

    useEffect(() => {
        if (currentEmpNo) {
            fetchGroupData(currentEmpNo);
        }
    }, [currentEmpNo]);

    const fetchGroupData = async (empNo, selectedEmpNo = selectedMember?.emp_no) => {
        setLoading(true);
        try {
            const { data } = await getMemberGroup(empNo);
            if (data) {
                setLeader(data.leader);
                setMembers(data.members);
                setSelectedMember(data.members.find((member) => member.emp_no === selectedEmpNo) || data.leader);
            }
        } catch (error) {
            console.error('Failed to fetch group data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMemberChange = (empNo) => {
        setSelectedMember(empNo === leader.emp_no ? leader : members.find((member) => member.emp_no === empNo));
        setSelectedReportType('personalReports');
    };

    const handleDeleteReport = async (yearMonth) => {
        setLoading(true);
        try {
            const { data } = await deleteMemberReport(selectedMember.emp_no, selectedReportType, yearMonth);
            if (data) {
                notification.success({
                    message: '削除が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                await fetchGroupData(currentEmpNo, selectedMember.emp_no);
            }
        } catch (error) {
            console.error('Failed to delete report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full xl:px-0">
            <TitleCus title="グループ報告" />
            <Spin spinning={loading}>
                <div className="p-5">
                    <Row gutter={[16, 16]} className="flex flex-col lg:flex-row">
                        {/* 左側：グループメンバー一覧 */}
                        <Col xs={24} md={6}>
                            <Form.Item className="mb-6">
                                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
                                    <h2 className="mb-4 text-center text-lg font-semibold text-gray-800">
                                        グループメンバー
                                    </h2>
                                    <Divider />
                                    <Radio.Group
                                        direction="vertical"
                                        className="w-full space-y-5"
                                        onChange={(e) => handleMemberChange(e.target.value)}
                                        value={selectedMember?.emp_no || null}
                                    >
                                        {leader && (
                                            <Radio key={leader.emp_no} value={leader.emp_no}>
                                                {leader.username}
                                                <Tag className="ml-2" color="blue">
                                                    リーダー
                                                </Tag>
                                            </Radio>
                                        )}

                                        {members.map((member) => (
                                            <Radio key={member.emp_no} value={member.emp_no}>
                                                {member.username}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Col>
                        {/* 右側：報告履歴 */}
                        <Col xs={24} md={18}>
                            <div className="h-full rounded-lg border border-gray-200 bg-white p-4 shadow-lg md:p-8">
                                <h2 className="text-center text-xl font-bold text-gray-800 md:text-2xl">報告履歴</h2>
                                <div className="mb-5 mt-5 flex items-center justify-end text-gray-600 md:mt-10">
                                    <Button onClick={() => setOpenModalCreate(true)} type="primary">
                                        状況報告登録
                                    </Button>
                                </div>

                                {/* 選択されたメンバーのレポートリスト */}
                                {selectedMember?.[selectedReportType]?.map((report, index) => (
                                    <div
                                        key={index}
                                        className="mb-5 flex flex-col justify-between rounded-xl p-4 shadow-md md:flex-row"
                                    >
                                        <div>
                                            <div className="mb-3 flex items-center">
                                                <span className="text-gray-500">{report.yearMonth}</span>
                                            </div>
                                            <span style={{ whiteSpace: 'pre-wrap' }}>{report.reportContent}</span>
                                        </div>
                                        <Popconfirm
                                            placement="bottomRight"
                                            title="確認"
                                            okText="削除"
                                            cancelText="キャンセル"
                                            description={`${report.yearMonth}の報告を削除してもよろしいですか？`}
                                            onConfirm={() => handleDeleteReport(report.yearMonth)}
                                        >
                                            <DeleteOutlined className="mt-4 text-red-500 md:mt-0" />
                                        </Popconfirm>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Spin>

            <CreateGroupReport
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                selectedMember={selectedMember}
                fetchGroupData={fetchGroupData}
                currentEmpNo={currentEmpNo}
            />
        </div>
    );
};

export default GroupStatusReports;
