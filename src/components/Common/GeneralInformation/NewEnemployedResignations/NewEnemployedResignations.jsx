import { getNewEnemployedResignations } from '../../../../services/common.service';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import NewEmployeeInfo from './NewEmployeeInfo';
import EnemployeeNotHired from './EnemployeeNotHired';
import Resignations from './Resignations';
import dayjs from 'dayjs';

const NewEnemployedResignations = ({ date }) => {
    const [loading, setLoading] = useState(false);

    //新入社員
    const [newEmpList, setNewEmpList] = useState([]);
    const [sapTotal, setSapTotal] = useState();
    const [openTotal, setOpenTotal] = useState();
    const [managementTotal, setManagementTotal] = useState();
    const [newEmployeeTotal, setNewEmployeeTotal] = useState();

    //採用不可
    const [notHiredList, setNotHiredList] = useState([]);
    const [notHiredSapTotal, setNotHiredSapTotal] = useState();
    const [notHiredOpenTotal, setNotHiredOpenTotal] = useState();
    const [notHiredManagementTotal, setNotHiredManagementTotal] = useState();
    const [notHiredTotal, setNotHiredTotal] = useState();

    //離職
    const [resignationList, setResignationList] = useState([]);
    const [resignationSapTotal, setResignationSapTotal] = useState();
    const [resignationOpenTotal, setResignationOpenTotal] = useState();
    const [resignationManagementTotal, setResignationManagementTotal] = useState();
    const [resignationTotal, setResignationTotal] = useState();

    useEffect(() => {
        const fetchData = async (date) => {
            setLoading(true);
            try {
                const res = await getNewEnemployedResignations(dayjs(date).format('YYYY-MM'));
                if (res.data) {
                    // 新入社員
                    const maxLengthNewEmployee = Math.max(
                        res.data.newEmployees.sap.length,
                        res.data.newEmployees.open.length,
                        res.data.newEmployees.management.length,
                    );

                    const formattedDataNewEmployee = Array.from({ length: maxLengthNewEmployee }, (_, index) => ({
                        key: index,
                        sap: res.data.newEmployees.sap[index] || { name: null, other: null },
                        open: res.data.newEmployees.open[index] || { name: null, other: null },
                        management: res.data.newEmployees.management[index] || { name: null, other: null },
                    }));
                    setSapTotal(res.data.newEmployees.new_sap_total);
                    setOpenTotal(res.data.newEmployees.new_open_total);
                    setManagementTotal(res.data.newEmployees.new_management_total);
                    setNewEmployeeTotal(res.data.newEmployees.new_employee_total);
                    setNewEmpList(formattedDataNewEmployee);

                    //採用不可
                    const maxLengthNotHired = Math.max(
                        res.data.notHired.sap.length,
                        res.data.notHired.open.length,
                        res.data.notHired.management.length,
                    );

                    const formattedDataNotHired = Array.from({ length: maxLengthNotHired }, (_, index) => ({
                        key: index,
                        sap: res.data.notHired.sap[index] || { name: null, other: null },
                        open: res.data.notHired.open[index] || { name: null, other: null },
                        management: res.data.notHired.management[index] || { name: null, other: null },
                    }));
                    setNotHiredSapTotal(res.data.notHired.notHired_sap_total);
                    setNotHiredOpenTotal(res.data.notHired.notHired_open_total);
                    setNotHiredManagementTotal(res.data.notHired.notHired_management_total);
                    setNotHiredTotal(res.data.notHired.notHired_total);
                    setNotHiredList(formattedDataNotHired);

                    //離職
                    const maxLengthResignation = Math.max(
                        res.data.resignation.sap.length,
                        res.data.resignation.open.length,
                        res.data.resignation.management.length,
                    );

                    const formattedDataResignation = Array.from({ length: maxLengthResignation }, (_, index) => ({
                        key: index,
                        sap: res.data.resignation.sap[index] || { name: null, other: null },
                        open: res.data.resignation.open[index] || { name: null, other: null },
                        management: res.data.resignation.management[index] || { name: null, other: null },
                    }));
                    setResignationSapTotal(res.data.resignation.resignation_sap_total);
                    setResignationOpenTotal(res.data.resignation.resignation_open_total);
                    setResignationManagementTotal(res.data.resignation.resignation_management_total);
                    setResignationTotal(res.data.resignation.resignation_total);
                    setResignationList(formattedDataResignation);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        fetchData(date);
    }, [date]);

    return (
        <>
            <Spin spinning={loading}>
                <div className="grid grid-cols-3 gap-10">
                    <NewEmployeeInfo
                        newEmpList={newEmpList}
                        sapTotal={sapTotal}
                        openTotal={openTotal}
                        managementTotal={managementTotal}
                        newEmployeeTotal={newEmployeeTotal}
                    />
                    <EnemployeeNotHired
                        notHiredList={notHiredList}
                        notHiredSapTotal={notHiredSapTotal}
                        notHiredOpenTotal={notHiredOpenTotal}
                        notHiredManagementTotal={notHiredManagementTotal}
                        notHiredTotal={notHiredTotal}
                    />

                    <Resignations
                        resignationList={resignationList}
                        resignationSapTotal={resignationSapTotal}
                        resignationOpenTotal={resignationOpenTotal}
                        resignationManagementTotal={resignationManagementTotal}
                        resignationTotal={resignationTotal}
                    />
                </div>
            </Spin>
        </>
    );
};

export default NewEnemployedResignations;
