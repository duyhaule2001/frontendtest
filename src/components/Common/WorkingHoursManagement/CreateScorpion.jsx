import { Descriptions, Form, Modal, notification, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getCompanyList, getFileFromBackEnd } from '../../../services/common.service';

const CreateScorpion = ({ openModalCreateFile, setOpenModalCreateFile, selectedRow }) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState();

    useEffect(() => {
        if (openModalCreateFile) {
            const fetchCompanyList = async () => {
                try {
                    const res = await getCompanyList();
                    if (res.data) {
                        const formatOptions = res.data.map((company) => ({ value: company.companyName }));
                        setOptions(formatOptions);
                    } else {
                        setOptions([]);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            fetchCompanyList();
        }
    }, [openModalCreateFile]);

    const handleSubmit = async (values) => {
        const dataToSend = {
            company: selectedCompany,
            employees: selectedRow,
        };

        console.log('check sendData', dataToSend);
        try {
            const res = await getFileFromBackEnd(dataToSend);
            //res チェック
            if (res.status === 200) {
                // PDFファイルをblob形式で受信
                const blob = new Blob([res.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });

                // 一時的なURLを作成してPDFファイルをダウンロード
                const url = window.URL.createObjectURL(blob);

                // ダウンロードをトリガーするために一時的な<a>タグを作成
                const a = document.createElement('a');
                a.href = url;
                a.download = res.data.fileName; // ダウンロード時のファイル名
                document.body.appendChild(a);
                a.click();
                // ダウンロードが完了したらURLと<a>タグを削除
                a.remove();
                window.URL.revokeObjectURL(url);

                notification.success({
                    message: 'ダウンロードが成功しました。',
                });
            } else {
                notification.error({
                    message: 'ダウンロードが失敗しました。',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCompanyChange = (value) => {
        setSelectedCompany(value);
    };

    // Định nghĩa các cột cho bảng Table
    const columns = [
        {
            title: '名前',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '現場名',
            dataIndex: 'site_name',
            key: 'site_name',
        },
        {
            title: '精算月日',
            dataIndex: 'settlement_date',
            key: 'settlement_date',
        },
    ];

    return (
        <>
            <Modal
                title="会社選択"
                okText="ファイル作成"
                width={'50vw'}
                cancelText="キャンセル"
                open={openModalCreateFile}
                onOk={() => form.submit()}
                onCancel={() => setOpenModalCreateFile(false)}
                maskClosable={false}
            >
                <Form onFinish={handleSubmit} form={form} autoComplete="off" className="mt-5">
                    <Form.Item
                        label="会社名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'この項目は空にできません。',
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            style={{
                                width: 200,
                            }}
                            className="w-full"
                            optionFilterProp="label"
                            placeholder="選択"
                            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                            onChange={handleCompanyChange}
                            options={options}
                            filterOption={(inputValue, option) =>
                                option && option.value && option.value.toLowerCase().includes(inputValue.toLowerCase())
                            }
                        />
                    </Form.Item>
                </Form>

                <Descriptions
                    title="情報確認"
                    style={{ width: '100%', maxWidth: '100%', tableLayout: 'fixed' }}
                    bordered
                    column={1}
                >
                    <Descriptions.Item
                        label="会社名"
                        style={{
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            width: '100px',
                        }}
                    >
                        {selectedCompany ? selectedCompany : 'いずれかの会社を選択してください'}
                    </Descriptions.Item>
                </Descriptions>

                <Table columns={columns} dataSource={selectedRow} rowKey="id" className="mt-4" />
            </Modal>
        </>
    );
};

export default CreateScorpion;
