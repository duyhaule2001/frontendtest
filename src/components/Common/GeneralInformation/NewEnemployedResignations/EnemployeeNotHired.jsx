import { Table, Tooltip } from 'antd';
import React from 'react';

const EnemployeeNotHired = ({
    notHiredList,
    notHiredSapTotal,
    notHiredOpenTotal,
    notHiredManagementTotal,
    notHiredTotal,
}) => {
    const notHiredColumns = [
        {
            title: <span>SAP ({notHiredSapTotal})</span>,
            align: 'center',
            width: 140,
            children: [
                {
                    title: '名前',
                    dataIndex: ['sap', 'name'],
                    key: 'sap-name',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '備考',
                    dataIndex: ['sap', 'other'],
                    key: 'sap-other',
                    align: 'center',
                    render: (text) => {
                        const spanRef = React.createRef();

                        const content = (
                            <span
                                ref={spanRef}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'inline-block',
                                    maxWidth: '60px',
                                }}
                            >
                                {text}
                            </span>
                        );

                        return (
                            <span>
                                {spanRef.current && spanRef.current.scrollWidth > 60 ? (
                                    <Tooltip title={text}>{content}</Tooltip>
                                ) : (
                                    content
                                )}
                            </span>
                        );
                    },
                },
            ],
        },
        {
            title: <span>OPEN系 ({notHiredOpenTotal})</span>,
            align: 'center',
            width: 140,
            children: [
                {
                    title: '名前',
                    dataIndex: ['open', 'name'],
                    key: 'open-name',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '備考',
                    dataIndex: ['open', 'other'],
                    key: 'open-other',
                    align: 'center',
                    render: (text) => {
                        const spanRef = React.createRef();

                        const content = (
                            <span
                                ref={spanRef}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'inline-block',
                                    maxWidth: '60px',
                                }}
                            >
                                {text}
                            </span>
                        );

                        return (
                            <span>
                                {spanRef.current && spanRef.current.scrollWidth > 60 ? (
                                    <Tooltip title={text}>{content}</Tooltip>
                                ) : (
                                    content
                                )}
                            </span>
                        );
                    },
                },
            ],
        },
        {
            title: <span>内勤 ({notHiredManagementTotal})</span>,
            align: 'center',
            width: 140,
            children: [
                {
                    title: '名前',
                    dataIndex: ['management', 'name'],
                    key: 'management-name',
                    align: 'center',
                    width: 80,
                },
                {
                    title: '備考',
                    dataIndex: ['management', 'other'],
                    key: 'management-other',
                    align: 'center',
                    render: (text) => {
                        const spanRef = React.createRef();

                        const content = (
                            <span
                                ref={spanRef}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'inline-block',
                                    maxWidth: '60px',
                                }}
                            >
                                {text}
                            </span>
                        );

                        return (
                            <span>
                                {spanRef.current && spanRef.current.scrollWidth > 60 ? (
                                    <Tooltip title={text}>{content}</Tooltip>
                                ) : (
                                    content
                                )}
                            </span>
                        );
                    },
                },
            ],
        },
    ];

    return (
        <>
            <Table
                dataSource={notHiredList}
                columns={notHiredColumns}
                size="small"
                bordered
                title={() => (
                    <div className="flex h-14 items-center justify-center text-blue-500">
                        採用不可 ({notHiredTotal})
                    </div>
                )}
                pagination={false}
                rowKey="key"
            />
        </>
    );
};

export default EnemployeeNotHired;
