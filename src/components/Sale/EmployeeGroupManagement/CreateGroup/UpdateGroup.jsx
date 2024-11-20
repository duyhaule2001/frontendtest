import { Form, Modal, Select, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { getEmployeeName, updateGroupList } from '../../../../services/sale.service';

const UpdateGroup = ({ openModalUpdate, setOpenModalUpdate, selectedGroup, fetchGroups }) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        if (openModalUpdate && selectedGroup && selectedGroup.id) {
            const initialData = {
                leader: `${selectedGroup.leader.username} - ${selectedGroup.leader.emp_no}`,
                members: selectedGroup.members.map((member) => `${member.username} - ${member.emp_no}`),
            };
            form.setFieldsValue(initialData);
        }
    }, [selectedGroup, openModalUpdate]);

    const onFinish = async (values) => {
        try {
            const data = {
                leader: values.leader,
                members: values.members.map((memberNumber) => ({
                    memberNumber: memberNumber,
                })),
            };
            const res = await updateGroupList(selectedGroup.group_id, data);
            if (res.data) {
                notification.success({
                    message: '作成が成功しました。',
                    style: {
                        width: 270,
                    },
                });
                setOpenModalUpdate(false);
                fetchGroups();
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
    const onChange = () => {
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
                title="グループ修正"
                okText={'修正'}
                cancelText={'キャンセル'}
                maskClosable={false}
                open={openModalUpdate}
                onOk={() => form.submit()}
                onCancel={() => {
                    setOpenModalUpdate(false);
                }}
            >
                <Form layout="vertical" className="mt-5" form={form} onFinish={onFinish}>
                    <Form.Item label="リーダー" name="leader">
                        <Select
                            disabled // リーダー欄を変更不可に設定
                            placeholder="リーダー情報が表示されます"
                        />
                    </Form.Item>

                    <Form.Item label="メンバー" name="members">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="お名前または社員番号を検索してください"
                            onChange={onChange}
                            onSearch={handleDebouncedSearch}
                            options={options}
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

export default UpdateGroup;
