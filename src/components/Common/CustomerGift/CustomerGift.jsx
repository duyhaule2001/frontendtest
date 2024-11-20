import React, { useState } from 'react';
import { Select } from 'antd';
import TitleCus from '../Layout/TitleCus';
import SpecialCustomer from './SpecialCustomer/SpecialCustomer';
import { useSelector } from 'react-redux';
import Gift from './Gift/Gift';

const CustomerGift = () => {
    const user = useSelector((state) => state.account.user);
    const [selectedSite, setSelectedSite] = useState('flower');
    const handleChange = (value) => {
        setSelectedSite(value);
    };
    const showSpecialCustomer = user.managerial_position === '社長' || user.is_share_cus === true;
    const options = [
        {
            value: 'flower',
            label: <span>お花注文</span>,
        },
        {
            value: 'candy',
            label: <span>お菓子注文</span>,
        },
        {
            value: 'souvenir',
            label: <span>お土産注文</span>,
        },
        ...(showSpecialCustomer
            ? [
                  {
                      value: 'specialCustomer',
                      label: <span>特別客様</span>,
                  },
              ]
            : []),
    ];

    return (
        <div>
            <div className="mb-10">
                <TitleCus title={'お客ギフト'} />
            </div>
            <div className="absolute px-8">
                <Select
                    style={{
                        width: 150,
                    }}
                    defaultValue="flower"
                    onChange={handleChange}
                    options={options}
                />
            </div>
            <div>
                {selectedSite === 'flower' && <Gift type={'flower'} />}
                {selectedSite === 'candy' && <Gift type={'candy'} />}
                {selectedSite === 'souvenir' && <Gift type={'souvenir'} />}
                {selectedSite === 'specialCustomer' && <SpecialCustomer />}
            </div>
        </div>
    );
};

export default CustomerGift;
