import axios from './axios.customize';

import axiosCus from 'axios';
//祝日習得
export const getHolidaysAPI = () => {
    return axiosCus.get('https://holidays-jp.github.io/api/v1/date.json');
};

//ログイン
export const loginAPI = (username, password, mail) => {
    const data = {
        username: username,
        password: password,
        mail: mail,
    };
    return axios.post('/login', data);
};

//認証コード
export const verifyAuthCodeAPI = (confirmationCode) => {
    const data = {
        confirmationCode: confirmationCode,
    };
    return axios.post('/confirm', data);
};

// search user
export const searchUsersByNameApi = (name) => {
    return axios.get(`/searchUser?name=${name}`);
};
export const getOneUserById = (id) => {
    return axios.post(`/searchUser?id=${id}`);
};

// search company by name
export const searchCompanyApi = (company_name) => {
    return axios.patch(`/customerInformation?company_name=${company_name}`);
};

//-----------------
//一般情報
//新入社員・採用不可・離職
export const getNewEnemployedResignations = (month) => {
    return axios.get(`/newEnemployedResignations?month=${month}`);
};

//SAP表示
export const getSapInformation = (month) => {
    return axios.get(`/sapInformation?month=${month}`);
};

//Open表示
export const getOpenInformation = (month) => {
    return axios.get(`/openInformation?month=${month}`);
};

//CloudInfra表示
export const getCloudInfraInformation = (month) => {
    return axios.get(`/cloudInfraInformation?month=${month}`);
};

//社内(内勤、営業）
export const getWithinCompanyInformation = (month) => {
    return axios.get(`/withinCompany?month=${month}`);
};

//月報表示
export const getMonthlyReportInformation = (year) => {
    return axios.get(`/monthlyReport?year=${year}`);
};

//産休登録
export const createReputation = (data) => {
    return axios.post('/reputation', data);
};

//-----------------

//在庫管理
//リスト表示
export const getEquipmentList = () => {
    return axios.get('/equipmentManagement');
};

//登録
export const createEquipment = (data) => {
    return axios.post('/equipmentManagement', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//利用履歴登録
//登録
export const createUseRegister = (itemId, data) => {
    return axios.post(`/equipmentUsageHistory?id=${itemId}`, data);
};

//部品番号で利用履歴取得
export const getUseHistory = (recordId) => {
    return axios.get(`/equipmentUsageHistory?record_id=${recordId}`);
};

//-----------------
//お客様情報
//リスト表示
export const getCustomerList = () => {
    return axios.get('/customerInformation');
};

//新規登録
export const createCustomer = (data) => {
    return axios.post('/customerInformation', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updateCustomer = (id, data) => {
    return axios.put(`/customerInformation/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const deleteCustomer = (id) => {
    return axios.delete(`/customerInformation/${id}`);
};

//--------------------

//会議室予約
//表示
export const getReservation = (date) => {
    return axios.get(`/appointments?date=${date}`);
};

//新規予約
//送るデータ
export const createReservation = (recordId, data) => {
    return axios.post(`/appointments?recordId=${recordId}`, data);
};

//キャンセル
export const deleteReservation = (id) => {
    return axios.delete(`/appointments?id=${id}`);
};

//----------
//社内教育制限管理

//コース設定
//先生account探す
export const searchTeacherAccount = (name) => {
    return axios.get(`/teacherAccount?name=${name}`);
};

//管理account探す
export const searchManagerAccount = (name) => {
    return axios.get(`/managerAccount?name=${name}`);
};

//backendにデータを送る
// courseId: "";
// employeeNumbers: (2)[('0112311231232312', '0112312312')];
export const courseSetting = (data) => {
    return axios.post('/courseSetting', data);
};

export const getUserMails = (department, permissions) => {
    return axios.get('/usersMails', { department, permissions });
};

//表示
// [
//     {
//       "id": "",
//       "date": "2024-11-13",
//       "courseName": "abcd",
//       "requiredTime": 2,
//       "url": "https://www.youtube.com/",
//       "teacherAccount": [
//         "鈴木"
//       ],
//       "managementAccount": [
//         "千尋"
//       ],
//       "courseItem": 0
//     }
//   ]
export const getRegisteredCourse = () => {
    return axios.get('/courseProduction');
};

//作成
// {
//  courseItem: 0;
//  courseName: 'test';
//  date: '2024-11-13';
//  managementAccount: ['0123'];
//  teacherAccount: ['1234567'];
//  requiredTime: 2;
//  url: 'https://www.youtube.com/';
// }
export const createCourse = (data) => {
    return axios.post('/courseProduction', data);
};

//修正
export const updateCourse = (courseId, data) => {
    return axios.put(`/courseProduction/${courseId}`, data);
};

//削除
export const deleteCourse = (id) => {
    return axios.delete(`/courseProduction/${id}`);
};

//講座参加者リスト
//戻り値:参加者の情報
//  [
//   {
//    id: '1';
//    department: 'O';
//    emp_no: '12345';
//    name: '鈴木 一郎';
//    permissions: 6;
//   }
//  ]
export const getMemberOfCourse = (courseId) => {
    return axios.get(`/memberOfCourse?courseId=${courseId}`);
};

//生徒削除
export const deleteMemberOfCourse = (memberId, courseId) => {
    return axios.delete(`/memberOfCourse?memberId=${memberId}&courseId=${courseId}`);
};

//----------------------

//アカウント 検索提案
export const suggestionAccountName = (name) => {
    return axios.get(`/account?name=${name}`);
};

//アカウントの個人情報を取得
export const getAccountAPI = () => {
    return axios.post('/account');
};

//パスワード更新
export const changePasswordAPI = (data) => {
    return axios.put('/account', data);
};

//パスワードを忘れた場合usernameとemailを送信
export const submitForgotPassword = (data) => {
    return axios.post('/forgotPassword', data);
};

//パスワードを忘れた場合confirmationCodeを送信
export const verifyResetCodeAPI = (data) => {
    return axios.post('/confirmResetCode', data);
};

//パスワードを忘れた場合、認証コードを確認できたら、新しいパスワードを送信
export const resetPassWordAPI = (data) => {
    return axios.post('/resetPass', data);
};

//新入社員情報
//リスト表示
export const getNewEmployee = (yearMonth) => {
    return axios.get(`/NewEmployeeInformation?yearMonth=${yearMonth}`);
};

//登録
export const createNewEmployee = (data) => {
    return axios.post('/NewEmployeeInformation', data);
};

//削除
export const deleteNewEmployee = (id) => {
    return axios.delete(`/NewEmployeeInformation/${id}`);
};

//修正
export const updateNewEmployee = (id, data) => {
    return axios.put(`/NewEmployeeInformation/${id}`, data);
};

//管理職労働管理
export const getAttendance = (data) => {
    return axios.post('/mgReportList', data);
};

export const submitCheckinTime = (data) => {
    return axios.post('/mgReport', data);
};

export const submitCheckoutTime = (data) => {
    return axios.patch('/mgReport', data);
};

export const submitBreakStartTime = (data) => {
    return axios.post('/mgReportBk', data);
};

export const submitBreakEndTime = (data) => {
    return axios.put('/mgReport', data);
};

export const submitDirect = (data) => {
    return axios.post('/mgReportDr', data);
};

export const submitBounce = (data) => {
    return axios.put('/mgReportDr', data);
};

// 勤怠管理
export const getAttendanceByEmpNo = (year, month, empNo) => {
    return axios.get(`/attendanceManagement?year=${year}&month=${month}&emp_no=${empNo}`);
};
// [
//     {
//         "emp_no": "O001",
//         "name": "田中",
//         "department": "人事部"
//         "totalWorkTime": "13:00",
//         "totalOvertime": "01:00"
//     }
// ]
export const getListAttendanceApi = (year, month, type) => {
    return axios.post(`/attendanceManagement?year=${year}&month=${month}&type=${type}`);
};

//労働時間管理
//年月検索
export const searchTimeWorkingHours = (date) => {
    return axios.post(`/workingHoursManagement?settlement_date=${date}`);
};

//名前検索提案
export const suggestionWorkingUser = (searchText) => {
    return axios.post(`/workingHoursManagementSearch?name=${searchText}`);
};

//修正
export const updateWorkingUser = (id, data) => {
    return axios.put(`/workingHoursManagement/${id}`, data);
};

// 交通費表示
export const getWorkDayLog = (data) => {
    return axios.post('/workDayLog', data);
};

//会社リスト表示
export const getCompanyList = () => {
    return axios.get('/companyList');
};

//データ送信とファイルダウンロード
export const getFileFromBackEnd = (data) => {
    return axios.post('/companyList', data, {
        responseType: 'blob',
    });
};

//技術稼働時間管理
//リスト表示
export const getTechnicianData = () => {
    return axios.get('/technicianManagementSale');
};

//検索
//提案
export const suggestionTechnician = (searchText) => {
    return axios.get(`/technicianManagementSale?technician_name=${searchText}`);
};

//検索
export const searchTechnician = (name) => {
    return axios.post(`/technicianManagementSale?technician_name=${name}`);
};

//新規登録
export const createTechnician = (data) => {
    return axios.post('/technicianManagementSale', data);
};

//削除
export const deleteTechnician = (id) => {
    return axios.delete(`/technicianManagementSale?id=${id}`);
};

//修正

export const updateTechnician = (id, data) => {
    return axios.put(`/technicianManagementSale?id=${id}`, data);
};

//現場退場管理
export const createOutSiteInfo = (data) => {
    return axios.post(`/outSiteInfo`, data);
};
export const getOutSiteInfo = (year, month) => {
    return axios.get(`/outSiteInfo?year=${year}&month=${month}`);
};
export const updateOutSiteInfo = (data, id) => {
    return axios.put(`/outSiteInfo?id=${id}`, data);
};
export const deleteOutSiteInfo = (id) => {
    return axios.delete(`/outSiteInfo?id=${id}`);
};
export const getOutSiteInfoByName = (year, month, technicianName) => {
    return axios.post(`/outSiteInfo?year=${year}&month=${month}&technicianName=${technicianName}`);
};
export const getSugOutSiteInfoByName = (year, month, technicianName) => {
    return axios.get(`/outSiteInfo?year=${year}&month=${month}&technicianName=${technicianName}`);
};

//現場入場管理
export const createOnsiteInfo = (data) => {
    return axios.post(`/onsiteInfo`, data);
};
export const getOnsiteInfo = (year, month) => {
    return axios.get(`/onsiteInfo?year=${year}&month=${month}`);
};
// fixed by sun
// export const getOnsiteInfo = (year, month) => {
//     return axios.get(`/onsiteInfo/${year}/${month}`);
// };
export const updateOnsiteInfo = (data, id) => {
    return axios.put(`/onsiteInfo?id=${id}`, data);
};
export const deleteOnsiteInfo = (id) => {
    return axios.delete(`/onsiteInfo?id=${id}`);
};
export const getOnsiteInfoByName = (year, month, technicianName) => {
    return axios.post(`/onsiteInfo?year=${year}&month=${month}&technicianName=${technicianName}`);
};
export const getSugOnsiteInfoByName = (year, month, technicianName) => {
    return axios.get(`/onsiteInfo?year=${year}&month=${month}&technicianName=${technicianName}`);
};

//内務共有API
export const createSharingApi = (data) => {
    return axios.post(`/sharing`, data);
};

export const getSharingApi = (year, month) => {
    return axios.get(`/sharing?year=${year}&month=${month}`);
};

export const updateSharingApi = (id, data) => {
    return axios.put(`/sharing?id=${id}`, data);
};

export const deleteSharingApi = (id) => {
    return axios.delete(`/sharing?id=${id}`);
};

//------------------------------
// 社用備品注文申請
export const getAllEquipmentOrders = (year, month) => {
    return axios.get(`/equipmentOrders?year=${year}&month=${month}`);
};

export const createEquipmentOrder = (data) => {
    return axios.post(`/equipmentOrders`, data);
};

export const updateEquipmentOrder = (id, data) => {
    return axios.put(`/equipmentOrders?id=${id}`, data);
};

export const deleteEquipmentOrder = (id) => {
    return axios.delete(`/equipmentOrders?id=${id}`);
};
// 社用備品申請承認
export const getApplicationList = (year, month) => {
    return axios.get(`/equipmentOrders?year=${year}&month=${month}`);
};
export const setStatusApplicationList = (id, type) => {
    return axios.patch(`/equipmentOrders?id=${id}&type=${type}`);
};

// 役員と副社長　出勤のAPI
export const submitCheckInAPi = () => {
    return axios.post(`/submitCheckIn`);
};

export const getCheckInAPi = () => {
    return axios.get(`/submitCheckIn`);
};
