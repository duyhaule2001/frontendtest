import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Drawer, Modal } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import LogoNav from '../LogoNav';
import NavLinkCus from '../NavLinkCus';
import DropdownMenu from '../DropdownMenu';
import { useSelector } from 'react-redux';
import UserInfoEmp from '../../UserInfo/UserInfo';
import AvatarNav from '../AvatarNav';

const EmployeePageNavbar = () => {
    const [visible, setVisible] = useState(false);
    const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
    const [isSubmissionMenuOpen, setIsSubmissionMenuOpen] = useState(false);
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

    const internalCommunicationItems = [
        { name: '悩み相談', path: 'consultationForConcerns' },
        { name: '人材推薦', path: 'recommendations' },
        { name: 'アイディア募集', path: 'ideaSubmission' },
        { name: 'プロジェクト増員', path: 'projectStaffingExpansion' },
    ];

    const submissionItems = [
        { name: '作業報告書', path: 'workingReport' },
        { name: '交通費報告書', path: 'transportationExpenseReport' },
    ];

    if (user.permissions === 6) {
        submissionItems.splice(0, 0, { name: '日報', path: 'dailyReport' });
    }

    return (
        <div className="fixed top-0 z-10 h-16 w-full border-b-2 border-indigo-300 bg-white">
            <div className="flex h-16 w-full items-center justify-between px-4">
                <LogoNav logoLink={'notice'} />
                <div className="hidden lg:flex lg:justify-end">
                    <div className="flex space-x-5 font-medium">
                        <NavLinkCus to={'notice'} name={'お知らせ'} />
                        <DropdownMenu width={'w-36'} menuTitle={'社内連絡'} menuItems={internalCommunicationItems} />
                        <NavLinkCus to={'companyTraining'} name={'社内教育'} />
                        <NavLinkCus to={'companyActivities'} name={'社内活動'} />
                        <DropdownMenu width={'w-32'} menuTitle={'提出'} menuItems={submissionItems} />
                        {user.managerial_position === 'リーダー' && (
                            <NavLinkCus to={'groupStatusReport'} name={'グループ状況報告'} />
                        )}
                        <NavLinkCus to={'annualSchedule'} name={'年間スケジュール'} />
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
                        <NavLink to="notice" className="mb-2 block" onClick={onClose}>
                            お知らせ
                        </NavLink>
                        <div>
                            <div
                                onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                社内連絡
                            </div>
                            {isContactMenuOpen && (
                                <div className="ml-4">
                                    <NavLink to="ideaSubmission" className="mb-2 block" onClick={onClose}>
                                        アイディア募集
                                    </NavLink>
                                    <NavLink to="projectStaffingExpansion" className="mb-2 block" onClick={onClose}>
                                        プロジェクト増員
                                    </NavLink>
                                    <NavLink to="consultationForConcerns" className="mb-2 block" onClick={onClose}>
                                        悩み相談
                                    </NavLink>
                                    <NavLink to="recommendations" className="mb-2 block" onClick={onClose}>
                                        人材推薦
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <NavLink to="companyTraining" className="mb-2 block" onClick={onClose}>
                            社内教育
                        </NavLink>
                        <NavLink to="companyActivities" className="mb-2 block" onClick={onClose}>
                            社内活動
                        </NavLink>
                        <div>
                            <div
                                onClick={() => setIsSubmissionMenuOpen(!isSubmissionMenuOpen)}
                                className="mb-2 cursor-pointer text-gray-900"
                            >
                                提出
                            </div>
                            {isSubmissionMenuOpen && (
                                <div className="ml-4">
                                    <NavLink to="transportationExpenseReport" className="mb-2 block" onClick={onClose}>
                                        交通費報告書
                                    </NavLink>
                                    <NavLink to="workingReport" className="mb-2 block" onClick={onClose}>
                                        作業報告書
                                    </NavLink>
                                    {user.permissions === 6 && (
                                        <NavLink to="dailyReport" className="mb-2 block" onClick={onClose}>
                                            日報
                                        </NavLink>
                                    )}
                                </div>
                            )}
                        </div>
                        {user.managerial_position === 'リーダー' && (
                            <NavLink to="groupStatusReport" className="mb-2 block" onClick={onClose}>
                                グループ状況報告
                            </NavLink>
                        )}
                        <NavLink to="annualSchedule" className="mb-2 block" onClick={onClose}>
                            年間スケジュール
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

export default EmployeePageNavbar;
