import React from 'react';

const YearMonthSelector = ({ year, onChangeYear, month, setMonth }) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 mt-4 flex items-center justify-center">
                <button
                    className="rounded bg-sky-300 p-2 text-xl text-white hover:bg-sky-400 md:text-2xl lg:text-3xl"
                    onClick={() => onChangeYear(-1)}
                >
                    &lt;
                </button>
                <h1 className="mx-4 text-4xl text-sky-700 md:text-5xl lg:text-7xl">{year}</h1>
                <button
                    className="rounded bg-sky-300 p-2 text-xl text-white hover:bg-sky-400 md:text-2xl lg:text-3xl"
                    onClick={() => onChangeYear(1)}
                >
                    &gt;
                </button>
            </div>
            <div className="mb-4 flex flex-wrap justify-center">
                {months.map((m) => (
                    <button
                        key={m}
                        onClick={() => setMonth(m)}
                        className={`mx-1 p-2 text-sm md:text-base lg:text-xl ${m === month ? 'bg-sky-500 text-white' : 'bg-sky-200 text-sky-700'} rounded hover:bg-sky-300`}
                    >
                        {m}月
                    </button>
                ))}
            </div>
        </div>
    );
};

export default YearMonthSelector;
