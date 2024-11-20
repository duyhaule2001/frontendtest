import React from 'react';
import { NavLink } from 'react-router-dom';

const NavLinkCus = ({ to, name }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isActive
                    ? 'whitespace-nowrap text-blue-700'
                    : 'block whitespace-nowrap text-gray-900 hover:text-blue-700'
            }
        >
            {name}
        </NavLink>
    );
};

export default NavLinkCus;
