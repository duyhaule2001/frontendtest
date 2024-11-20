import axios from './axios.customize';

// お知らせ管理
export const getAllNoticesAPI = (year, month) => {
    return axios.get(`/notices?year=${year}&month=${month}`);
};
export const createNoticeAPI = (data) => {
    return axios.post(`/notices`, data);
};
export const deleteNoticeAPI = (id, type) => {
    return axios.delete(`/notices?id=${id}&type=${type}`);
};
export const updateNoticeAPI = (id, data) => {
    return axios.put(`/notices?id=${id}`, data);
};
export const getAllParticipationActivate = (id) => {
    return axios.get(`/activateParticipation?id=${id}`);
};
export const removeParticipant = (id) => {
    return axios.delete(`/activateParticipation?id=${id}`);
};
export const registerParticipants = (activateId, data) => {
    return axios.put(`/activateParticipation?activateId=${activateId}`, data);
};
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

//--------------
//管理有給休暇

//データ表示
//戻り値：
// [
// {
//     "id": "",
//     "date": "",
//     "cause": "",
//     "vacation_time": "",
//     "file": ""
//   }
// ]
export const getPaidLeaveManagement = (employeeNumber) => {
    return axios.get(`/paidLeaveManagement?employeeNumber=${employeeNumber}`);
};

//新規登録
export const createPaidManagement = (employeeNumber, data) => {
    return axios.post(`/paidLeaveManagement?employeeNumber=${employeeNumber}`, data);
};

//修正
export const updatePaidManagement = (paidLeaveId, data) => {
    return axios.put(`/paidLeaveManagement/${paidLeaveId}`, data);
};

//削除
export const deletePaidManagement = (paidLeaveId) => {
    return axios.delete(`/paidLeaveManagement/${paidLeaveId}`);
};

//--------------
//技術者有給休暇
//データ表示
//戻り値：
// [
// {
//     "id": "",
//     "date": "",
//     "cause": "",
//     "vacation_time": "",
//     "file": ""
//   }
// ]
export const getPaidLeaveTech = (employeeNumber) => {
    return axios.get(`/paidLeaveTech?employeeNumber=${employeeNumber}`);
};

//新規登録
export const createPaidTech = (employeeNumber, data) => {
    return axios.post(`/paidLeaveTech?employeeNumber=${employeeNumber}`, data);
};

//修正
export const updatePaidTech = (paidLeaveId, data) => {
    return axios.put(`/paidLeaveTech/${paidLeaveId}`, data);
};

//削除
export const deletePaidTech = (paidLeaveId) => {
    return axios.delete(`/paidLeaveTech/${paidLeaveId}`);
};

//-------------

//PC管理
//リスト表示
export const getPcAPI = () => {
    return axios.get('/pc_management');
};

//新規登録
export const registerPC = async (data) => {
    return await axios.post('/pc_management', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updatePcApi = (data) => {
    return axios.put('/pc_management', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const handleDelete = (id) => {
    return axios.delete(`/pc_management/${id}`);
};

//返却状態
export const returnStatusPc = (id, status) => {
    return axios.patch(`/pc_management/${id}`, status);
};

//人事部 技術者稼働管理
export const getAllEngineers = () => {
    return axios.get(`/engineer`);
};
export const createEngineer = (data) => {
    return axios.post(`/engineer`, data);
};
export const updateEngineer = (data, id) => {
    return axios.put(`/engineer?id=${id}`, data);
};
export const deleteEngineer = (id) => {
    return axios.delete(`/engineer?id=${id}`);
};
export const getEngineerByName = (technician_name) => {
    return axios.get(`/engineer?technician_name=${technician_name}`);
};
export const getSugEngineerByName = (technician_name) => {
    return axios.get(`/engineer?technician_name_like=${technician_name}`);
};
