import React, { useState } from 'react';
import YearMonthSelector from '../Layout/Input/YearMonthSelector';
import OnsiteManagement from './Onsite/OnsiteManagement';
import OutSiteManagement from './OutSite/OutSiteManagement';
import { Button } from 'antd';

const OnOutSiteManaPage = () => {
    const [selectedSite, setSelectedSite] = useState('onsite');
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const handleChangeYear = (direction) => {
        setYear(year + direction);
    };

    return (
        <div>
            <YearMonthSelector year={year} onChangeYear={handleChangeYear} month={month} setMonth={setMonth} />
            <div className="mt-5 flex justify-center space-x-5">
                <div>
                    <Button
                        type={selectedSite === 'onsite' ? 'primary' : 'default'}
                        onClick={() => setSelectedSite('onsite')}
                        className="px-6 py-3 text-lg"
                    >
                        現場入場リスト
                    </Button>
                </div>
                <div>
                    <Button
                        type={selectedSite === 'outsite' ? 'primary' : 'default'}
                        onClick={() => setSelectedSite('outsite')}
                        className="px-6 py-3 text-lg"
                    >
                        現場退場リスト
                    </Button>
                </div>
            </div>
            {selectedSite === 'onsite' ? (
                <OnsiteManagement year={year} month={month} />
            ) : (
                <OutSiteManagement year={year} month={month} />
            )}
        </div>
    );
};

export default OnOutSiteManaPage;
