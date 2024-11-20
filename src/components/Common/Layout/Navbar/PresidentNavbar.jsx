import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Drawer, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import LogoNav from '../LogoNav';
import NavLinkCus from '../NavLinkCus';
import DropdownMenu from '../DropdownMenu';
import UserInfoEmp from '../../UserInfo/UserInfo';
import { useSelector } from 'react-redux';
import AvatarNav from '../AvatarNav';

const PresidentNavbar = () => {
    const [visible, setVisible] = useState(false);
    const [isReportApproval, setIsReportApproval] = useState(false);
    const [isOfficeWorkManagement, setIsOfficeWorkManagement] = useState(false);
    const [isTechnicianManagement, setIsTechnicianManagement] = useState(false);
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

    const reportApproval = [
        // { name: '人事日報', path: 'hrReportApproval' },
        { name: '役員日報', path: 'executiveDailyReport' },
        // { name: '営業部日報', path: 'saleReportApproval' },
    ];

    const officeWorkManagement = [
        { name: '勤怠', path: 'attendance' },
        { name: '勤怠管理', path: 'attendanceManagement' },
        { name: '会議記録管理', path: 'meetingRecordManagement' },
        { name: 'アカウント作成', path: 'accountCreate' },
    ];

    const technicianManagement = [
        { name: '稼働リスト', path: 'workingList' },
        { name: '入退場リスト', path: 'entranceAndExitList' },
        { name: '新入社員情報', path: 'newEmployeeInfo' },
        { name: '要員参画状況', path: 'participation' },
        { name: '社内教育権限管理', path: 'internalTrainingAuthority' },
    ];

    const Customer = [
        { name: 'お客ギフト', path: 'customerGift' },
        { name: 'お客様情報', path: 'customerInformation' },
    ];
    return (
        <div className="fixed top-0 z-10 h-16 w-full border-b-2 border-indigo-300 bg-white">
            <div className="flex h-16 items-center justify-between px-5">
                <LogoNav logoLink={'/president'} />
                <div className="hidden items-center lg:flex lg:justify-end" id="navbar-default">
                    <div className="flex space-x-5 font-medium">
                        {/* <NavLinkCus to={'generalInformation'} name={'一般情報'} /> */}
                        <NavLinkCus to={'internalSharing'} name={'内務共有'} />
                        {/* <NavLinkCus to={'retirementApproval'} name={'退職承認'} /> */}
                        {/* <DropdownMenu width={'w-28'} menuTitle={'日報承認'} menuItems={reportApproval} /> */}
                        {/* <DropdownMenu width={'w-32'} menuTitle={'内勤管理'} menuItems={officeWorkManagement} /> */}
                        {/* <DropdownMenu width={'w-36'} menuTitle={'技術者管理'} menuItems={technicianManagement} /> */}
                        {/* <DropdownMenu width={'w-32'} menuTitle={'お客様'} menuItems={Customer} /> */}
                        <AvatarNav src={user.image} name={user.name} onClick={handleOpenModal} key={user.id} />
                    </div>
                </div>
                <div className="lg:hidden">
                    <MenuOutlined onClick={showDrawer} className="cursor-pointer text-2xl" />
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
                        {/* <NavLink to="generalInformation" className="mb-2 block" onClick={onClose}>
                            一般情報
                        </NavLink> */}
                        <NavLink to="internalSharing" className="mb-2 block" onClick={onClose}>
                            内務共有
                        </NavLink>
                        {/* <NavLink to="retirementApproval" className="mb-2 block" onClick={onClose}>
                            退職承認
                        </NavLink> */}
                        <div>
                            {/* <div
                                onClick={() => setIsReportApproval(!isReportApproval)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                日報承認
                            </div>
                            {isReportApproval && (
                                <div className="ml-4">
                                    <NavLink to="hrReportApproval" className="mb-2 block" onClick={onClose}>
                                        人事日報
                                    </NavLink>
                                    <NavLink to="saleReportApproval" className="mb-2 block" onClick={onClose}>
                                        営業部日報
                                    </NavLink>
                                    <NavLink to="executiveDailyReport" className="mb-2 block" onClick={onClose}>
                                        役員日報
                                    </NavLink>
                                </div>
                            )} */}
                        </div>
                        <div>
                            {/* <div
                                onClick={() => setIsOfficeWorkManagement(!isOfficeWorkManagement)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                内勤管理
                            </div>
                            {isOfficeWorkManagement && (
                                <div className="ml-4">
                                    <NavLink to="attendance" className="mb-2 block" onClick={onClose}>
                                        勤怠
                                    </NavLink>
                                    <NavLink to="attendanceManagement" className="mb-2 block" onClick={onClose}>
                                        勤怠管理
                                    </NavLink>
                                    <NavLink to="meetingRecordManagement" className="mb-2 block" onClick={onClose}>
                                        会議記録管理
                                    </NavLink>
                                    <NavLink to="accountCreate" className="mb-2 block" onClick={onClose}>
                                        アカウント作成
                                    </NavLink>
                                </div>
                            )} */}
                        </div>
                        <div>
                            {/* <div
                                onClick={() => setIsTechnicianManagement(!isTechnicianManagement)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                技術者管理
                            </div>
                            {isTechnicianManagement && (
                                <div className="ml-4">
                                    <NavLink to="workingList" className="mb-2 block" onClick={onClose}>
                                        稼働リスト
                                    </NavLink>
                                    <NavLink to="entranceAndExitList" className="mb-2 block" onClick={onClose}>
                                        入退場リスト
                                    </NavLink>

                                    <NavLink to="newEmployeeInfo" className="mb-2 block" onClick={onClose}>
                                        新入社員情報
                                    </NavLink>
                                    <NavLink to="participation" className="mb-2 block" onClick={onClose}>
                                        要員参画状況
                                    </NavLink>
                                    <NavLink to="internalTrainingAuthority" className="mb-2 block" onClick={onClose}>
                                        社内教育権限管理
                                    </NavLink>
                                </div>
                            )} */}
                        </div>
                        <div>
                            <div
                                onClick={() => setIsGroupOpen(!isGroupOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                お客様
                            </div>
                            {Customer && (
                                <div className="ml-4">
                                    <NavLink to="customerGift" className="mb-2 block" onClick={onClose}>
                                        お客ギフト
                                    </NavLink>
                                    <NavLink to="customerInformation" className="mb-2 block" onClick={onClose}>
                                        お客様情報
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <NavLink to="customerGift" className="mb-2 block" onClick={onClose}>
                            ギフト
                        </NavLink>
                        <NavLink to="customerInformation" className="mb-2 block" onClick={onClose}>
                            お客様情報
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

export default PresidentNavbar;
