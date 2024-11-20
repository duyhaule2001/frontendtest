import React from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from 'antd';

const DropdownMenu = ({ menuTitle, menuItems, width }) => {
    return (
        <div className="group relative mx-5">
            <div className="block cursor-pointer whitespace-nowrap rounded text-gray-900">{menuTitle}</div>
            <div
                id="dropdownHover"
                className={`absolute left-1/2 ${width} hidden -translate-x-1/2 divide-y divide-gray-100 rounded-lg bg-white shadow group-hover:block`}
            >
                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownHoverButton">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            {item.count != null ? (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'block bg-gray-100 px-4 py-2 text-blue-700'
                                            : 'block px-4 py-2 text-gray-900 hover:bg-gray-100'
                                    }
                                >
                                    <Badge count={item.count} offset={[3, -3]} size="small" showZero={false}>
                                        {item.name}
                                    </Badge>
                                </NavLink>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'block bg-gray-100 px-4 py-2 text-blue-700'
                                            : 'block px-4 py-2 text-gray-900 hover:bg-gray-100'
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DropdownMenu;
