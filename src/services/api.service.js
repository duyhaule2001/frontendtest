import axios from './axios.customize';
import axiosHoliday from 'axios';
export const getHolidaysAPI = () => {
    return axiosHoliday.get('https://holidays-jp.github.io/api/v1/date.json');
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

//アカウントの個人情報を取得
export const getAccountAPI = () => {
    return axios.post('/account');
};

//パスワード更新
export const changePasswordAPI = (data) => {
    return axios.put('/account', data);
};

//-----------------------
//人事ー総務：日報登録
//リスト表示

export const getDailyReportRegis = (date) => {
    return axios.get(`/dailyReportRegis?date=${date}`);
};

//登録
export const createDailyReportRegis = (data) => {
    return axios.post('/dailyReportRegis', data);
};

//削除
export const deleteDailyReportRegis = (id) => {
    return axios.delete(`/dailyReportRegis?id=${id}`);
};

//修正
export const updateDailyReportRegis = (id, data) => {
    return axios.put(`/dailyReportRegis?id=${id}`, data);
};

//社長ーリーダ承認
export const getAllReportApprovalByDate = (date, type) => {
    return axios.get(`/reportApproval?date=${date}&type=${type}`);
};
export const updateReportApproval = (id) => {
    return axios.put(`/reportApproval?id=${id}`);
};

//-----------------------
//退職リスト
//表示
export const getRetirement = (contract_related) => {
    return axios.get(`/retirementList?contract_related=${contract_related}`);
};

export const getAllRetirementList = () => {
    return axios.get(`/retirementList`);
};

//作contract_related成
export const createRetirement = (data) => {
    return axios.post('/retirementList', data);
};

//削除
export const deleteRetirement = (id) => {
    return axios.delete(`/retirementList/${id}`);
};

//修正
export const updateRetirement = (id, data) => {
    return axios.put(`/retirementList/${id}`, data);
};

export const updateRetirementApproval = (id) => {
    return axios.patch(`/retirementList?id=${id}`);
};

//----------------------
//管理職

//社長ー総務部 アカウント作成
//アカウントリスト表示
export const getAccountList = () => {
    return axios.get('/account');
};

//アカウント 検索提案
export const suggestionAccountName = (name) => {
    return axios.get(`/account?name=${name}`);
};

//アカウント　検索
export const searchAccountName = (name) => {
    return axios.post(`/account?name=${name}`);
};

//新登録
export const createAccount = (data) => {
    return axios.post('/account', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updateAccount = (id, data) => {
    return axios.put(`/account/${id}`, data);
};

//削除
export const deleteAccount = (id) => {
    return axios.delete(`/account/${id}`);
};

//営業日報管理
//リスト表示
export const getReportList = () => {
    return axios.get('/salesDailyReport');
};

//登録
export const createReportSaleList = (data) => {
    return axios.post('/salesDailyReport', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const deleteReport = async (id, data) => {
    return axios.patch(`/salesDailyReport/${id}`, data);
};

//修正
export const updateSaleReport = async (id, data) => {
    return axios.put(`/salesDailyReport/${id}`, data);
};

//----------------------
//従業員従業員メッセージング
//ユーザ表示
export const getUserMails = (department, permissions) => {
    return axios.post('/usersMails', { department, permissions });
};

//メッセージング 送信
export const sendMessage = async (formData) => {
    try {
        const response = await axios.post('/sendMail', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.log('メッセージの送信中にエラーが発生しました:', error);
        throw error;
    }
};

//有給休暇管理

//-----------
//管理職 検索提案
export const suggestionManagerUserAPI = (name) => {
    return axios.get(`/managerPaidLeave?name=${name}`);
};

//管理職 検索
export const searchManagerUserAPI = (name) => {
    return axios.post(`/managerPaidLeave?name=${name}`);
};

//管理職 リスト表示
export const getManagerPaiLeaveAPI = () => {
    return axios.get('/managerPaidLeave');
};

//管理職 User追加
export const createUserManager = (data) => {
    return axios.post('/managerPaidLeave', data);
};

//管理者　修正
export const updateUserManager = (id, data) => {
    return axios.put(`/managerPaidLeave/${id}`, data);
};

//管理者 削除
export const deleteUserManager = (id) => {
    return axios.delete(`/managerPaidLeave/${id}`);
};

//管理職ー有給休暇
//新規登録
export const createPaidLeaveManager = (managerId, data) => {
    return axios.post(`/managerPaidLeave/${managerId}/paid_leave_lists`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updatePaidLeaveManager = (managerId, leaveId, data) => {
    return axios.put(`/managerPaidLeave/${managerId}/paid_leave_lists/${leaveId}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const deletePaidLeaveManager = (managerId, leaveId) => {
    return axios.delete(`/managerPaidLeave/${managerId}/paid_leave_lists/${leaveId}`);
};

//-----------
//技術 検索提案
export const suggestionTechUserAPI = (name) => {
    return axios.get(`/techPaidLeave?name=${name}`);
};

//技術　検索
export const searchTechUserAPI = (name) => {
    return axios.post(`/techPaidLeave?name=${name}`);
};

//技術者リスト表示
export const getTechPaiLeaveAPI = () => {
    return axios.get('/techPaidLeave');
};

//技術Tech追加
export const createUserTech = (data) => {
    return axios.post('/techPaidLeave', data);
};

//技術者　修正
export const updateUserTech = (id, data) => {
    return axios.put(`/techPaidLeave/${id}`, data);
};

//技術者 削除
export const deleteUserTech = (id) => {
    return axios.delete(`/techPaidLeave/${id}`);
};

//技術者有給休暇
//新規登録
export const createPaidLeaveTech = (techId, data) => {
    return axios.post(`/techPaidLeave/${techId}/paid_leave_lists`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updatePaidLeaveTech = (TechId, leaveId, data) => {
    return axios.put(`/techPaidLeave/${TechId}/paid_leave_lists/${leaveId}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const deletePaidLeaveTech = (TechId, leaveId) => {
    return axios.delete(`/techPaidLeave/${TechId}/paid_leave_lists/${leaveId}`);
};

//-------------
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
    return axios.delete(`/technicianManagementSale/${id}`);
};

//修正

export const updateTechnician = (id, data) => {
    return axios.put(`/technicianManagementSale/${id}`, data);
};

//-----
//PC管理
export const getPcAPI = () => {
    return axios.get('/pc_management');
};

export const handleDelete = (id) => {
    return axios.delete(`/pc_management/${id}`);
};

//検索
export const searchAPI = (name) => {
    return axios.get(`/pc_management?name=${name}`);
};

export const registerPC = async (data) => {
    return await axios.post('/pc_management', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updatePcApi = (data) => {
    return axios.put('/pc_management', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//---------------------

//労働時間管理
//年月検索
export const searchTimeWorkingHours = (date) => {
    return axios.post(`/workingHoursManagement?search_date=${date}`);
};

//名前検索提案
export const suggestionWorkingUser = (searchText) => {
    return axios.patch(`/workingHoursManagementSearch?name=${searchText}`);
};

//名前検索
export const searchWorkingUser = (name) => {
    return axios.put(`/workingHoursManagementSearch?name=${name}`);
};

//修正
export const updateWorkingUser = (id, data) => {
    return axios.put(`/workingHoursManagement/${id}`, data);
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

//-------

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

//現場入場管理
export const createOnsiteInfo = (data) => {
    return axios.post(`/onsiteInfo`, data);
};
export const getOnsiteInfo = (year, month) => {
    return axios.get(`/onsiteInfo?year=${year}&month=${month}`);
};
export const updateOnsiteInfo = (data, id) => {
    return axios.put(`/onsiteInfo?id=${id}`, data);
};
export const deleteOnsiteInfo = (id) => {
    return axios.delete(`/onsiteInfo?id=${id}`);
};
export const getOnsiteInfoByName = (technicianName) => {
    return axios.post(`/onsiteInfo?technicianName=${technicianName}`);
};
export const getSugOnsiteInfoByName = (technicianName) => {
    return axios.get(`/onsiteInfo?technicianName=${technicianName}`);
};
//現場退場管理
export const createOutSiteInfo = (data) => {
    return axios.post(`/outSiteInfo`, data);
};
export const getOutSiteInfo = (year, month) => {
    return axios.get(`/outSiteInfo?year=${year}&month=${month}`);
};
export const updateOutSiteInfo = (data, id) => {
    return axios.put(`/outSiteInfo/${id}`, data);
};
export const deleteOutSiteInfo = (id) => {
    return axios.delete(`/outSiteInfo/${id}`);
};
export const getOutSiteInfoByName = (technicianName) => {
    return axios.post(`/outSiteInfo?technicianName=${technicianName}`);
};
export const getSugOutSiteInfoByName = (technicianName) => {
    return axios.get(`/outSiteInfo?technicianName=${technicianName}`);
};
//営業システム

export const getNoticeSales = () => {
    return axios.get('/noticeSales');
};
