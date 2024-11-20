import React from 'react';
import backgroundImage from '/teacherPage.png';

const TeacherSystem = () => {
    return (
        <div
            className="min-h-screen bg-opacity-75 bg-cover bg-center p-4 text-center shadow-md"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <p className="mt-40 text-lg leading-loose text-gray-50">
                <b className="mb-3 block animate-fadeIn">教師の皆様へ、</b>
                <b className="mb-3 block animate-fadeInDelay1">いつもお忙しい中、私たちのためにお時間をいただき、</b>
                <b className="mb-3 block animate-fadeInDelay1">ありがとうございます。</b>
                <b className="mb-3 block animate-fadeInDelay2">あなたの努力と献身に心から感謝いたします。</b>
                <b className="block animate-fadeInDelay3">これからもどうぞよろしくお願いいたします。</b>
            </p>
        </div>
    );
};

export default TeacherSystem;
