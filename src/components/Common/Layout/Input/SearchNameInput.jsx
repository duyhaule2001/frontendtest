import React, { useState } from 'react';
import { AutoComplete, Avatar, Input } from 'antd';
import { searchUsersByNameApi } from '../../../../services/common.service';

const SearchNameInput = ({ value = '', onChange, onSelectUser }) => {
    const [options, setOptions] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const fetchSearchResults = async (searchValue) => {
        try {
            const response = await searchUsersByNameApi(searchValue);
            if (response.data && Array.isArray(response.data)) {
                const formattedOptions = response.data.map((item) => ({
                    value: item.name,
                    label: (
                        <div className="flex items-center">
                            <Avatar size="small" src={item.img_path} alt={item.name} />
                            <span className="ml-2">{item.name}</span>
                        </div>
                    ),
                    id: item.id,
                }));
                setOptions(formattedOptions);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleDebouncedSearch = (searchValue) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        if (searchValue.trim()) {
            const newTimeout = setTimeout(() => {
                fetchSearchResults(searchValue);
            }, 600);
            setDebounceTimeout(newTimeout);
        } else {
            setOptions([]);
        }
        if (onChange) {
            onChange(searchValue);
        }
    };

    const handleSelect = (selectedValue, option) => {
        if (onChange) {
            onChange(selectedValue);
        }
        if (onSelectUser) {
            onSelectUser(option.id);
        }
    };

    return (
        <AutoComplete
            style={{ width: '100%' }}
            options={options}
            value={value}
            onSearch={handleDebouncedSearch}
            onSelect={handleSelect}
            placeholder="氏名検索"
            filterOption={false}
        >
            <Input />
        </AutoComplete>
    );
};

export default SearchNameInput;
