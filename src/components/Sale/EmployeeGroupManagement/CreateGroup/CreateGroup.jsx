import { Form, Modal, Select, notification } from 'antd';
import React, { useState } from 'react';
import { createGroupManagement, getEmployeeName } from '../../../../services/sale.service';

const CreateGroup = ({ openModalCreate, setOpenModalCreate, fetchGroups }) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);

    const onFinish = async (values) => {
        try {
            const data = {
                leaderInfo: values.leader ? [values.leader] : [],
                members: values.members.map((memberInfo) => ({
                    memberInfo: memberInfo,
                })),
            };
            const res = await createGroupManagement(data);
            if (res.data) {
                notification.success({
                    message: '作成が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalCreate(false);
                form.resetFields();
                await fetchGroups();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ユーザーが入力をやめるまで待ってから API を呼び出します
    const handleDebouncedSearch = (value) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        if (!value) {
            setOptions([]);
            return;
        }

        const newTimeout = setTimeout(() => {
            onSearch(value);
        }, 500);
        setSearchTimeout(newTimeout);
    };

    // 選択変更処理
    const onChange = (value) => {
        // console.log('Selected Leader:', value);
        setOptions([]);
    };

    // 社員を検索
    const onSearch = async (value) => {
        if (value) {
            try {
                const res = await getEmployeeName(value);
                if (res.data) {
                    const formattedData = res.data.map((user) => ({
                        value: `${user.username} - ${user.emp_no}`,
                        label: `${user.username} - ${user.emp_no}`,
                    }));
                    setOptions(formattedData);
                }
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            setOptions([]);
        }
    };

    return (
        <>
            <Modal
                title="グループ作成"
                okText={'登録'}
                cancelText={'キャンセル'}
                maskClosable={false}
                open={openModalCreate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields('');
                }}
            >
                <Form layout="vertical" className="mt-5" form={form} onFinish={onFinish}>
                    <Form.Item label="リーダー" name="leader">
                        <Select
                            showSearch
                            allowClear
                            placeholder="お名前または社員番号を入力してください"
                            onChange={onChange}
                            onSearch={handleDebouncedSearch}
                            options={options.filter((option) => !form.getFieldValue('members')?.includes(option.value))}
                            filterOption={(inputValue, option) =>
                                option && option.value && option.value.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            notFoundContent={null}
                        />
                    </Form.Item>

                    <Form.Item label="メンバー" name="members">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="お名前または社員番号を入力してください"
                            onChange={onChange}
                            onSearch={handleDebouncedSearch}
                            options={options.filter((option) => form.getFieldValue('leader') !== option.value)}
                            filterOption={(inputValue, option) =>
                                option && option.value && option.value.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            notFoundContent={null}
                        />
                    </Form.Item>

                    <div className="text-[0.8rem] text-red-500">
                        ＊グループリーダーやグループメンバー以外のメンバーのみを選択できます。
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default CreateGroup;
