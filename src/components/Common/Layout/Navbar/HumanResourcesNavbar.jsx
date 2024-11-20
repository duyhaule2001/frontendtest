import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Drawer, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import LogoNav from '../LogoNav';
import NavLinkCus from '../NavLinkCus';
import DropdownMenu from '../DropdownMenu';
import { useSelector } from 'react-redux';
import UserInfoEmp from '../../UserInfo/UserInfo';
import AvatarNav from '../AvatarNav';

const HumanResourcesNavbar = () => {
    const [visible, setVisible] = useState(false);
    const [isEmployeeInfoOpen, setIsEmployeeInfoOpen] = useState(false);
    const [isEmployeeManagementOpen, setIsEmployeeManagementOpen] = useState(false);
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

    const employeeInformation = [
        { name: '退職管理', path: 'retirementManagement' },
        { name: '有給休暇管理', path: 'paidLeaveManagement' },
        { name: 'アカウント追加', path: 'addAccount' },
    ];

    const engineerManagement = [
        { name: '稼働時間', path: 'workingHoursManagement' },
        { name: '新入社員', path: 'newEmployeeInfo' },
        { name: '現場入場退場', path: 'engineerOnSite' },
    ];
    return (
        <div className="fixed top-0 z-10 h-16 w-full border-b-2 border-indigo-300 bg-white">
            <div className="flex h-16 items-center justify-between px-5">
                <Badge
                    style={{
                        background: '#e5e7eb',
                        color: '#4a4a4a',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        borderRadius: '8px',
                        padding: '3px 8px',
                        lineHeight: '1',
                    }}
                    count={<span className="text-gray-500">人事部</span>}
                    offset={[25, 20]}
                >
                    <LogoNav logoLink={'internalSharing'} />
                </Badge>
                <div className="hidden lg:flex lg:justify-end">
                    <div className="flex space-x-5 font-medium">
                        {user.managerial_position === '部長' && user.permissions === 2 && (
                            <NavLinkCus to={'generalInformation'} name={'一般情報'} />
                        )}
                        <NavLinkCus to={'equipmentManagement'} name={'在庫管理'} />
                        <NavLinkCus to={'meetingRoomReservation'} name={'会議室予約'} />
                        <NavLinkCus to={'internalSharing'} name={'内務共有'} />
                        <NavLinkCus to={'attendance'} name={'勤怠'} />
                        {user.managerial_position === '部長' && user.permissions === 2 && (
                            <NavLinkCus to={'reportApproval'} name={'日報承認'} />
                        )}
                        <NavLinkCus to={'dailyReport'} name={'日報登録'} />
                        <DropdownMenu width={'w-32'} menuTitle={'社員情報'} menuItems={employeeInformation} />
                        <DropdownMenu width={'w-28'} menuTitle={'技術者管理'} menuItems={engineerManagement} />
                        <NavLinkCus to={'pcManagement'} name={'PC管理'} />
                        <NavLinkCus to={'sendEmail'} name={'メール送信'} />
                        <NavLinkCus to={'noticeCreate'} name={'お知らせ制作'} />
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
                        {user.managerial_position === '部長' && user.permissions === 2 && (
                            <NavLink to="generalInformation" className="mb-2 block" onClick={onClose}>
                                一般情報
                            </NavLink>
                        )}
                        <NavLink to="equipmentManagement" className="mb-2 block" onClick={onClose}>
                            在庫管理
                        </NavLink>
                        <NavLink to="meetingRoomReservation" className="mb-2 block" onClick={onClose}>
                            会議室予約
                        </NavLink>
                        <NavLink to="internalSharing" className="mb-2 block" onClick={onClose}>
                            内務共有
                        </NavLink>
                        <NavLink to="attendance" className="mb-2 block" onClick={onClose}>
                            勤怠
                        </NavLink>
                        {user.managerial_position === '部長' && user.permissions === 2 && (
                            <NavLink to="reportApproval" className="mb-2 block" onClick={onClose}>
                                人事日報承認
                            </NavLink>
                        )}
                        <NavLink to="dailyReport" className="mb-2 block" onClick={onClose}>
                            日報登録
                        </NavLink>
                        <div>
                            <div
                                onClick={() => setIsEmployeeInfoOpen(!isEmployeeInfoOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                社員情報
                            </div>
                            {isEmployeeInfoOpen && (
                                <div className="ml-4">
                                    <NavLink to="paidLeaveManagement" className="mb-2 block" onClick={onClose}>
                                        有給休暇管理
                                    </NavLink>
                                    <NavLink to="retirementManagement" className="mb-2 block" onClick={onClose}>
                                        退職管理
                                    </NavLink>

                                    <NavLink to="addAccount" className="mb-2 block" onClick={onClose}>
                                        アカウント追加
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <div>
                            <div
                                onClick={() => setIsEmployeeManagementOpen(!isEmployeeManagementOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                技術者管理
                            </div>
                            {isEmployeeManagementOpen && (
                                <div className="ml-4">
                                    <NavLink to="workingHoursManagement" className="mb-2 block" onClick={onClose}>
                                        稼働時間
                                    </NavLink>
                                    <NavLink to="newEmployeeInfo" className="mb-2 block" onClick={onClose}>
                                        新入社員
                                    </NavLink>
                                    <NavLink to="engineerOnSite" className="mb-2 block" onClick={onClose}>
                                        現場入場退場
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <NavLink to="pcManagement" className="mb-2 block" onClick={onClose}>
                            PC管理
                        </NavLink>
                        <NavLink to="sendEmail" className="mb-2 block" onClick={onClose}>
                            メール送信
                        </NavLink>
                        <NavLink to="noticeCreate" className="mb-2 block" onClick={onClose}>
                            お知らせ制作
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

export default HumanResourcesNavbar;
