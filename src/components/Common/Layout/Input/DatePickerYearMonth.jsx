import { DatePicker, Form, ConfigProvider } from 'antd';
import React from 'react';
import locale from 'antd/es/date-picker/locale/ja_JP';
import dayjs from 'dayjs';

const monthsInJapanese = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const DatePickerYearMonth = ({ onSearch }) => {
    const [form] = Form.useForm();

    const handleDateChange = (date) => {
        if (date) {
            const selectedDate = date.toDate();
            const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
            onSearch(formattedDate);
        } else {
            // 年月を消すー> 今月のデータが出る
            const currentMonth = dayjs().format('YYYY-MM');
            onSearch(currentMonth);
        }
    };

    const monthCellRender = (date) => {
        const month = date.month();
        return <div>{monthsInJapanese[month]}</div>;
    };

    return (
        <ConfigProvider locale={locale}>
            <Form form={form} autoComplete="off">
                <div className="flex space-x-3">
                    <Form.Item label={<span className="font-sans text-xl">年月</span>} name="date">
                        <DatePicker
                            picker="month"
                            format="YYYY-MM"
                            placeholder="年月選択"
                            cellRender={monthCellRender}
                            onChange={handleDateChange}
                        />
                    </Form.Item>
                </div>
            </Form>
        </ConfigProvider>
    );
};

export default DatePickerYearMonth;
