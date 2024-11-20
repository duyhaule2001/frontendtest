import React from 'react';

const TitleCus = ({ title }) => {
    return (
        <div className="text-white w-full text-center bg-gradient-to-r from-cyan-300 to-blue-500 h-20 flex items-center justify-center text-2xl font-semibold">
            {title}
        </div>
    );
};

export default TitleCus;
