import React, { useState } from 'react';
import { Image } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import no_image from '../../../assets/No_Image_Available.jpg';

const ImageCus = ({ img_path, borderRadius, className }) => {
    const [isError, setIsError] = useState(false);

    return (
        <div className={className}>
            <Image
                width={40}
                height={40}
                src={img_path && !isError ? img_path : no_image}
                preview={{
                    mask: <EyeOutlined style={{ fontSize: 15, color: 'white' }} />,
                }}
                onError={() => setIsError(true)}
                style={{
                    ...(borderRadius ? { borderRadius } : {}),
                    objectFit: 'cover',
                }}
            />
        </div>
    );
};

export default ImageCus;
