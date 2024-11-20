import React from 'react';
import logo from '../../../assets/logo.png';
import { Link } from 'react-router-dom';

const LogoNav = ({ logoLink }) => {
    return (
        <div className="flex w-full items-center justify-between">
            <Link className="flex items-center space-x-3 rtl:space-x-reverse" to={logoLink}>
                <img src={logo} className="h-8" alt="Logo" />
                <span className="self-center whitespace-nowrap text-2xl font-semibold">株式会社スカイテック</span>
            </Link>
        </div>
    );
};

export default LogoNav;
