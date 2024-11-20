import { Avatar } from 'antd';
import React, { useState } from 'react';

const AvatarNav = ({ src, name, onClick }) => {
    const [isImageError, setIsImageError] = useState(false);
    return (
        <Avatar
            className="cursor-pointer transition duration-300 hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50"
            size="small"
            src={!isImageError ? src : undefined}
            style={{ backgroundColor: src && !isImageError ? undefined : '#f56a00' }}
            onClick={onClick}
            onError={() => setIsImageError(true)}
        >
            {!src || isImageError ? name.charAt(0) : null}
        </Avatar>
    );
};

export default AvatarNav;
