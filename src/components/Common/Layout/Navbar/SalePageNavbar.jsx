import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Badge, Drawer, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import NavLinkCus from '../NavLinkCus';
import LogoNav from '../LogoNav';
import DropdownMenu from '../DropdownMenu';
import UserInfoEmp from '../../UserInfo/UserInfo';
import { useSelector } from 'react-redux';
import AvatarNav from '../AvatarNav';

const SalePageNavbar = () => {
    const [visible, setVisible] = useState(false);
    const [isInternalManagementOpen, setIsInternalManagementOpen] = useState(false);
    const [isEmployeeManagementOpen, setIsEmployeeManagementOpen] = useState(false);
    const [isGroupOpen, setIsGroupOpen] = useState(false);
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
    const internalManagement = [
        { name: '日報登録', path: 'dailyReportRegistration' },
        { name: '注文書登録', path: 'purchaseOrderRegis' },
        { name: '社用備品注文申請', path: 'equipmentOrderApplication' },
        { name: '社内会議記録管理', path: 'meetingRecordManagement' },
        { name: 'リーダ会議記録管理', path: 'leaderMeetingRecord' },
    ];

    if (user.managerial_position === '部長') {
        internalManagement.splice(1, 0, { name: '日報承認', path: 'dailyReportRegistrationApproval' });
        internalManagement.splice(5, 0, { name: '社内会議記録承認', path: 'meetingRecordApproval' });
    }

    const GroupMana = [
        { name: 'リーダー管理', path: 'groupManagement' },
        { name: 'メンバー仕分け', path: 'groupCreate' },
        { name: 'リーダー一括送信', path: 'contactTheLeader' },
        { name: '技術者日報管理', path: 'engineerDailyReportManagement' },
    ];

    const engineerManagement = [
        { name: '稼働リスト', path: 'engineerOperation' },
        { name: '現場入退場', path: 'engineerOnSiteSale' },
        { name: '要員参画状況', path: 'participationStatus' },
    ];

    const Customer = [
        { name: 'お客ギフト', path: 'customerGift' },
        { name: 'お客様情報', path: 'customerInformation' },
    ];
    return (
        <div className="fixed top-0 z-10 h-16 w-full border-b-2 border-indigo-300 bg-white">
            <div className="flex h-16 w-full items-center justify-between px-4">
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
                    count={<span className="text-gray-500">営業部</span>}
                    offset={[25, 20]}
                >
                    <LogoNav logoLink={'internalSharing'} />
                </Badge>

                <div className="hidden items-center lg:flex lg:justify-end">
                    <div className="flex space-x-5 font-medium">
                        <NavLinkCus to={'shareProjects'} name={'案件共有'} />
                        <NavLinkCus to={'internalSharing'} name={'内務共有'} />
                        <NavLinkCus to={'progressManagement'} name={'進捗管理'} />
                        <NavLinkCus to={'meetingRoomReservation'} name={'会議室予約'} />
                        <NavLinkCus to={'attendance'} name={'勤怠'} />
                        <DropdownMenu width={'w-40'} menuTitle={'社内管理'} menuItems={internalManagement} />
                        <DropdownMenu width={'w-32'} menuTitle={'技術者管理'} menuItems={engineerManagement} />
                        <DropdownMenu width={'w-36'} menuTitle={'グループ'} menuItems={GroupMana} />
                        <DropdownMenu width={'w-32'} menuTitle={'お客様'} menuItems={Customer} />
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
                        <NavLink to="shareProjects" className="mb-2 block" onClick={onClose}>
                            案件共有
                        </NavLink>
                        <NavLink to="progressManagement" className="mb-2 block" onClick={onClose}>
                            進捗管理
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
                        <div>
                            <div
                                onClick={() => setIsInternalManagementOpen(!isInternalManagementOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                社内管理
                            </div>
                            {isInternalManagementOpen && (
                                <div className="ml-4">
                                    <NavLink to="dailyReportRegistration" className="mb-2 block" onClick={onClose}>
                                        日報登録
                                    </NavLink>
                                    {user.managerial_position === '部長' && (
                                        <NavLink
                                            to="dailyReportRegistrationApproval"
                                            className="mb-2 block"
                                            onClick={onClose}
                                        >
                                            日報承認
                                        </NavLink>
                                    )}

                                    <NavLink to="meetingRecordManagement" className="mb-2 block" onClick={onClose}>
                                        社内会議記録管理
                                    </NavLink>
                                    {user.managerial_position === '部長' && (
                                        <NavLink to="meetingRecordApproval" className="mb-2 block" onClick={onClose}>
                                            社内会議記録承認
                                        </NavLink>
                                    )}
                                    <NavLink to="leaderMeetingRecord" className="mb-2 block" onClick={onClose}>
                                        リーダ会議記録管理
                                    </NavLink>
                                    <NavLink to="equipmentOrderApplication" className="mb-2 block" onClick={onClose}>
                                        社用備品注文申請
                                    </NavLink>
                                    <NavLink to="purchaseOrderRegis" className="mb-2 block" onClick={onClose}>
                                        注文書登録
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
                                    <NavLink to="engineerOperation" className="mb-2 block" onClick={onClose}>
                                        稼働リスト
                                    </NavLink>

                                    <NavLink to="engineerOnSiteSale" className="mb-2 block" onClick={onClose}>
                                        現場入退場
                                    </NavLink>
                                    <NavLink to="participationStatus" className="mb-2 block" onClick={onClose}>
                                        要員参画状況
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <div>
                            <div
                                onClick={() => setIsGroupOpen(!isGroupOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                現場リーダー管理
                            </div>
                            {isGroupOpen && (
                                <div className="ml-4">
                                    <NavLink to="groupManagement" className="mb-2 block" onClick={onClose}>
                                        リーダー管理
                                    </NavLink>
                                    <NavLink to="groupCreate" className="mb-2 block" onClick={onClose}>
                                        メンバー仕分け
                                    </NavLink>
                                    <NavLink to="contactTheLeader" className="mb-2 block" onClick={onClose}>
                                        リーダ一括送信
                                    </NavLink>
                                    <NavLink
                                        to="engineerDailyReportManagement"
                                        className="mb-2 block"
                                        onClick={onClose}
                                    >
                                        技術者日報管理
                                    </NavLink>
                                </div>
                            )}
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

export default SalePageNavbar;
