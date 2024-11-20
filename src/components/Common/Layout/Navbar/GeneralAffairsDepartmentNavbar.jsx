import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, Drawer, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { selectUnapprovedCount } from '../../../../redux/approval/approvalSlice';
import { useSelector } from 'react-redux';
import LogoNav from '../LogoNav';
import NavLinkCus from '../NavLinkCus';
import DropdownMenu from '../DropdownMenu';
import UserInfoEmp from '../../UserInfo/UserInfo';
import AvatarNav from '../AvatarNav';

const GeneralAffairsDepartmentNavbar = () => {
    const [visible, setVisible] = useState(false);
    const [isEmployeeInfoOpen, setIsEmployeeInfoOpen] = useState(false);
    const [isEmployeeManagementOpen, setIsEmployeeManagementOpen] = useState(false);
    const [isAssetManagementOpen, setIsAssetManagementOpen] = useState(false);
    const unapprovedCount = useSelector(selectUnapprovedCount);
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
        { name: 'アカウント作成', path: 'accRegister' },
    ];

    if (user.managerial_position === '部長') {
        employeeInformation.splice(1, 0, { name: '退職承認', path: 'retirementApproval' });
        employeeInformation.splice(0, 0, { name: '一般情報', path: 'generalInformation' });
    }

    const engineerManagement = [
        { name: '現場入場', path: 'engineerOnSite' },
        { name: '稼働時間', path: 'workingHoursManagement' },
        { name: '待機有無', path: 'waitingStatus' },
        { name: '新入社員', path: 'newEmployeeInfo' },
        { name: '技術者管理', path: 'employeeDetailsReport' },
    ];

    const assetManagement = [
        { name: 'PC管理', path: 'pcManagement' },
        { name: '在庫管理', path: 'equipmentManagement' },
        { name: '社用備品申請承認', path: 'equipmentApplicationApproval', count: unapprovedCount },
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
                    count={<span className="text-gray-500">総務部</span>}
                    offset={[25, 20]}
                >
                    <LogoNav logoLink={'internalSharing'} />
                </Badge>
                <div className="hidden lg:flex lg:justify-end">
                    <div className="flex space-x-5 font-medium">
                        <NavLinkCus to={'internalSharing'} name={'内務共有'} />
                        <NavLinkCus to={'attendance'} name={'勤怠'} />
                        <NavLinkCus to={'dailyReport'} name={'日報登録'} />
                        {user.managerial_position === '部長' && user.permissions === 3 && (
                            <NavLinkCus to={'reportApproval'} name={'日報承認'} />
                        )}
                        <DropdownMenu width={'w-32'} menuTitle={'社員情報'} menuItems={employeeInformation} />
                        <DropdownMenu width={'w-28'} menuTitle={'技術者管理'} menuItems={engineerManagement} />
                        <DropdownMenu width={'w-36'} menuTitle={'備品管理'} menuItems={assetManagement} />
                        <NavLinkCus to={'meetingRoomReservation'} name={'会議室予約'} />
                        <NavLinkCus to={'customerGift'} name={'お客ギフト'} />
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
                        <NavLink to="internalSharing" className="mb-2 block" onClick={onClose}>
                            内務共有
                        </NavLink>
                        <NavLink to="attendance" className="mb-2 block" onClick={onClose}>
                            勤怠
                        </NavLink>
                        <NavLink to="dailyReport" className="mb-2 block" onClick={onClose}>
                            日報登録
                        </NavLink>
                        {user.managerial_position === '部長' && (
                            <NavLink to="reportApproval" className="mb-2 block" onClick={onClose}>
                                日報承認
                            </NavLink>
                        )}

                        <div>
                            <div
                                onClick={() => setIsEmployeeInfoOpen(!isEmployeeInfoOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                社員情報
                            </div>
                            {isEmployeeInfoOpen && (
                                <div className="ml-4">
                                    {user.managerial_position === '部長' && (
                                        <NavLink to="generalInformation" className="mb-2 block" onClick={onClose}>
                                            一般情報
                                        </NavLink>
                                    )}
                                    <NavLink to="retirementManagement" className="mb-2 block" onClick={onClose}>
                                        退職管理
                                    </NavLink>
                                    <NavLink to="paidLeaveManagement" className="mb-2 block" onClick={onClose}>
                                        有給休暇管理
                                    </NavLink>
                                    <NavLink to="accRegister" className="mb-2 block" onClick={onClose}>
                                        アカウント作成
                                    </NavLink>
                                    {user.managerial_position === '部長' && (
                                        <NavLink to="retirementApproval" className="mb-2 block" onClick={onClose}>
                                            退職承認
                                        </NavLink>
                                    )}
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
                                    <NavLink to="engineerOnSite" className="mb-2 block" onClick={onClose}>
                                        現場入場
                                    </NavLink>
                                    <NavLink to="workingHoursManagement" className="mb-2 block" onClick={onClose}>
                                        稼働時間
                                    </NavLink>
                                    <NavLink to="waitingStatus" className="mb-2 block" onClick={onClose}>
                                        待機有無
                                    </NavLink>
                                    <NavLink to="newEmployeeInfo" className="mb-2 block" onClick={onClose}>
                                        新入社員
                                    </NavLink>
                                    <NavLink to="employeeDetailsReport" className="mb-2 block" onClick={onClose}>
                                        技術者管理
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <div>
                            <div
                                onClick={() => setIsAssetManagementOpen(!isAssetManagementOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                備品管理
                            </div>
                            {isAssetManagementOpen && (
                                <div className="ml-4">
                                    <NavLink to="pcManagement" className="mb-2 block" onClick={onClose}>
                                        PC管理
                                    </NavLink>
                                    <NavLink to="equipmentManagement" className="mb-2 block" onClick={onClose}>
                                        在庫管理
                                    </NavLink>
                                    <NavLink to="equipmentApplicationApproval" className="mb-2 block" onClick={onClose}>
                                        社用備品申請承認
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <NavLink to="meetingRoomReservation" className="mb-2 block" onClick={onClose}>
                            会議室予約
                        </NavLink>
                        <NavLink to="customerGift" className="mb-2 block" onClick={onClose}>
                            お客ギフト
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

export default GeneralAffairsDepartmentNavbar;
