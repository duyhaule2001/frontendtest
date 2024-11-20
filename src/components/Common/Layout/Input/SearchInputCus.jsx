import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Form, Input } from 'antd';

const SearchInputCus = ({ label, placeholder, handleSearch, onSearch, options, loading }) => {
    const [form] = Form.useForm();
    const [searchValue, setSearchValue] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const handleDebouncedSearch = (value) => {
        setSearchValue(value);
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            onSearch(value);
        }, 500);
        setDebounceTimeout(newTimeout);
    };

    const onFinish = (values) => {
        handleSearch(values.searchValue);
    };

    return (
        <>
            <Form name="検索" form={form} onFinish={onFinish} className="flex space-x-3">
                <Form.Item label={label} name="searchValue" initialValue={searchValue}>
                    <AutoComplete
                        style={{ width: 200 }}
                        options={options}
                        value={searchValue}
                        onSearch={handleDebouncedSearch}
                        placeholder={placeholder}
                        filterOption={(inputValue, option) =>
                            option && option.value && option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    >
                        <Input />
                    </AutoComplete>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        <SearchOutlined /> 検索
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default SearchInputCus;
