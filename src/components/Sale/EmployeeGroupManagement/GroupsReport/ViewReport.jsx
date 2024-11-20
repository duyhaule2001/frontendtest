import { Descriptions, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getContentReport } from '../../../../services/sale.service';

const ViewReport = ({
    openModalViewReport,
    setOpenModalViewReport,
    selectedUser,
    selectedDate,
    selectedGroupId,
    selectedRole,
}) => {
    const [reportContent, setReportContent] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (openModalViewReport && selectedUser && selectedDate && selectedGroupId && selectedRole) {
            const empNo = selectedUser.emp_no;

            const fetchContent = async () => {
                setLoading(true);
                try {
                    const res = await getContentReport(selectedGroupId, selectedRole, empNo, 1, selectedDate);
                    if (res?.data) {
                        setReportContent(res?.data);
                    } else {
                        setReportContent(null);
                    }
                } catch (error) {
                    console.log(error);
                }
                setLoading(false);
            };

            fetchContent();
        }
    }, [openModalViewReport, selectedUser, selectedDate, selectedGroupId, selectedRole]);

    const renderReportContent = () => {
        //データが取得できない場合
        if (!reportContent || (Array.isArray(reportContent) && reportContent.length === 0)) {
            return <div style={{ textAlign: 'center', padding: '20px' }}>データがありません。</div>;
        }
        //メンバー選択する場合
        if (Array.isArray(reportContent) && typeof reportContent[0] === 'string') {
            return reportContent.map((content, index) => (
                <Descriptions.Item
                    key={index}
                    label={
                        <>
                            <span>{index + 1}週間目</span>
                        </>
                    }
                >
                    {content}
                </Descriptions.Item>
            ));
        }
        //リーダー選択する場合
        else if (reportContent && Array.isArray(reportContent)) {
            return reportContent.map((report, index) => (
                <Descriptions.Item
                    key={index}
                    label={
                        <>
                            <span>{index + 1}週間目</span>
                        </>
                    }
                >
                    <Descriptions
                        bordered
                        column={2}
                        labelStyle={{
                            width: '11%',
                            textAlign: 'center',
                            lineHeight: '1.5em',
                        }}
                    >
                        <Descriptions.Item span={2} label={<span>リーダ</span>}>
                            {report?.leaderContent}
                        </Descriptions.Item>
                        <Descriptions.Item label={<span>メンバー</span>}>
                            <Descriptions
                                bordered
                                column={1}
                                labelStyle={{
                                    width: '20%',
                                    textAlign: 'center',
                                    lineHeight: '1.5em',
                                }}
                            >
                                {report?.member?.map((member, index) => (
                                    <Descriptions.Item key={index} label={<span>{member.name}</span>}>
                                        {member.content}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        </Descriptions.Item>
                    </Descriptions>
                </Descriptions.Item>
            ));
        } else {
            return <div>データがありません。</div>;
        }
    };
    return (
        <Modal
            title="報告詳細"
            open={openModalViewReport}
            onCancel={() => setOpenModalViewReport(false)}
            footer={null}
            width={'80vw'}
        >
            {loading ? (
                <Spin />
            ) : (
                <Descriptions
                    bordered
                    column={1}
                    labelStyle={{
                        width: '10%',
                        textAlign: 'center',
                        lineHeight: '1.5em',
                    }}
                >
                    {renderReportContent()}
                </Descriptions>
            )}
        </Modal>
    );
};

export default ViewReport;
