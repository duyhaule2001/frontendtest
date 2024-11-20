import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Drawer, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import NavLinkCus from '../NavLinkCus';
import LogoNav from '../LogoNav';
import UserInfoEmp from '../../UserInfo/UserInfo';
import { useSelector } from 'react-redux';
import AvatarNav from '../AvatarNav';

const RecommendationDepartmentNavbar = () => {
    const [visible, setVisible] = useState(false);
    const user = useSelector((state) => state.account.user);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    return (
        <div className="fixed top-0 z-10 h-16 w-full border-b-2 border-indigo-300 bg-white">
            <div className="flex h-16 w-full items-center justify-between px-4">
                <LogoNav logoLink={'internalSharing'} />
                <div className="lg:hidden">
                    <MenuOutlined onClick={showDrawer} className="cursor-pointer text-2xl" />
                </div>
                <div className="hidden lg:flex lg:justify-end">
                    <div className="flex space-x-5 font-medium">
                        <NavLinkCus to={'internalSharing'} name={'内務共有'} />
                        {/* <NavLinkCus to={'dailyReport'} name={'日報提出'} /> */}
                        <NavLinkCus to={'projectInfo'} name={'案件共有'} />
                        <NavLinkCus to={'meeting'} name={'会議記録管理'} />
                        <NavLinkCus to={'attendance'} name={'勤怠'} />
                        <AvatarNav src={user.image} name={user.name} onClick={handleOpenModal} key={user.id} />
                    </div>
                </div>
                <Drawer
                    title={
                        <div className="flex justify-between">
                            <span>メニュー</span>
                            <AvatarNav
                                src={user.image}
                                name={user.name}
                                key={user.id}
                                onClick={() => {
                                    handleOpenModal();
                                    onClose();
                                }}
                            />
                        </div>
                    }
                    placement="right"
                    onClose={onClose}
                    open={visible}
                >
                    <div className="p-2">
                        <NavLink to="internalSharing" className="mb-2 block" onClick={onClose}>
                            内務共有
                        </NavLink>
                        {/* <NavLink to="dailyReport" className="mb-2 block" onClick={onClose}>
                            日報提出
                        </NavLink> */}
                        <NavLink to="projectInfo" className="mb-2 block" onClick={onClose}>
                            案件共有
                        </NavLink>
                        <NavLink to="meeting" className="mb-2 block" onClick={onClose}>
                            会議記録管理
                        </NavLink>
                        <NavLink to="attendance" className="mb-2 block" onClick={onClose}>
                            勤怠
                        </NavLink>
                    </div>
                </Drawer>
            </div>
            <Modal
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                closable={false}
                mask={false}
                width={360}
                style={{
                    position: 'absolute',
                    top: 46,
                    right: 20,
                    margin: 0,
                    padding: 0,
                    height: 'auto',
                }}
            >
                <UserInfoEmp />
            </Modal>
        </div>
    );
};

export default RecommendationDepartmentNavbar;
