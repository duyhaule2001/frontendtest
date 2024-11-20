import axios from './axios.customize';

//待機有無
export const getStandbyState = (year, month) => {
    return axios.get(`/standbyState?year=${year}&month=${month}`);
};

//申請承認
//リスト表示
export const getApplicationList = () => {
    return axios.get('/companyEquipmentApplication');
};

//承認処理
export const setStatusApplicationList = (id, data) => {
    return axios.patch(`/companyEquipmentApplication/${id}`, data);
};

//技術者管理
//表示
export const getEmployeeListWithDate = (date) => {
    return axios.get(`/employeeReport/${date}`);
};

//社長ー総務部 アカウント作成
//アカウントリスト表示
export const getAccountList = () => {
    return axios.get('/accountCreate');
};

//アカウント 検索提案
// export const suggestionAccountName = (name) => {
//     return axios.get(`/account?name=${name}`);
// };

//アカウント　検索
export const searchAccountName = (name) => {
    return axios.patch(`/account?name=${name}`);
};

//新登録
export const createAccount = (data) => {
    return axios.post('/accountCreate', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updateAccount = (id, data) => {
    return axios.put(`/accountCreate/${id}`, data);
};

//削除
export const deleteAccount = (id) => {
    return axios.delete(`/accountCreate/${id}`);
};
