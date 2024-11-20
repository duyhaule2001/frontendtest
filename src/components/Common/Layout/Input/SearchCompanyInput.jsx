import { AutoComplete, Input } from 'antd';
import React, { useState } from 'react';
import { searchCompanyApi } from '../../../../services/common.service';

const SearchCompanyInput = ({ value = '', onChange, onSelect }) => {
    const [options, setOptions] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const fetchSearchResults = async (searchValue) => {
        try {
            const response = await searchCompanyApi(searchValue);
            if (response.data) {
                const formattedOptions = response.data.map((item) => ({
                    value: item.company_name,
                    label: (
                        <span>
                            {item.company_name} - {item.name} - {item.department}
                        </span>
                    ),
                    ...item,
                    id: item.id,
                }));
                setOptions(formattedOptions);
            }
        } catch (error) {
            console.error('Error:', error);
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
        if (onSelect) {
            onSelect(option);
        }
    };

    return (
        <AutoComplete
            options={options}
            value={value}
            onSearch={handleDebouncedSearch}
            onSelect={handleSelect}
            placeholder="会社名検索"
            style={{ width: '100%' }}
        >
            <Input />
        </AutoComplete>
    );
};

export default SearchCompanyInput;
