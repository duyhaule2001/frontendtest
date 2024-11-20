import axios from './axios.customize';

//お知らせ
export const getNoticeAPI = (year, month) => {
    return axios.post(`/notice?year=${year}&month=${month}`);
};

//社内活動
export const getCompanyActivities = (year, month) => {
    return axios.post(`/events?year=${year}&month=${month}`);
};
export const submitApplyActivate = (id) => {
    return axios.post(`/activateParticipation?id=${id}`);
};

//社内教育
export const getCourseItems = () => {
    return axios.post('/items');
};

//アイディア募集
export const submitIdea = (formData) => {
    return axios.post('/idea', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//プロジェクト増員
export const submitProjectStaffingExpansion = (data) => {
    return axios.post('/projectStaffingExpansion', data);
};

//悩み相談
export const submitConsultation = (data) => {
    return axios.post('/consultationForConcerns', data);
};

//人材推薦
export const recommenDationsApi = () => {
    return axios.post('/recommendations');
};

//交通費を取得
export const getTrainReport = (year, month) => {
    return axios.get(`/trainReport?year=${year}&month=${month}`);
};
//交通費をアップ
export const submitTrainReport = (data) => {
    return axios.put('/trainReport', data);
};
//交通費アップファイル
export const uploadFileTrainAPI = (formData, year, month) => {
    return axios.post(`/fileTrain?year=${year}&month=${month}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
//交通費アップファイル削除
export const deleteFileTrainAPI = (fileId) => {
    return axios.delete(`/fileTrain?fileId=${fileId}`);
};
//交通費アップファイル呼び出し
export const getFileTrainAPI = (year, month) => {
    return axios.get(`/fileTrain?year=${year}&month=${month}`);
};

//作業報告書を取得
export const getWorkingReport = (year, month) => {
    return axios.get(`/workingReport?year=${year}&month=${month}`);
};
//作業報告書をアップ
export const submitWorkingReport = (formData) => {
    return axios.post('/workingReport', formData);
};

//日報提出
export const createDailyReport = (data) => {
    return axios.put(`/dailyReport`, data);
};
//提出した日報を全部取得、戻り値は日付リストだけ
export const getAllDailyReportOfEmployee = () => {
    return axios.get(`/dailyReport`);
};
// 提出した日報を取得
export const getOneDailyReportByDate = (dateReport) => {
    return axios.post(`/dailyReport`, dateReport);
};

//グループ報告
//グループメンバー取得
//戻り値：
// {
//     "group_id": "",
//     "leader": {
//       "emp_no": "",
//       "username": "",
//       "personalReports": [
//         {
//           "yearMonth": "",
//           "reportContent": ""
//         }
//       ],
//       "contributionEvaluation": [
//         {
//           "yearMonth": "",
//           "reportContent": ""
//         }
//       ],
//       "onsiteEvaluation": [
//         {
//           "yearMonth": "",
//           "reportContent": ""
//         }
//       ]
//     },
//     "members": [
//       {
//         "emp_no": "",
//         "username": "",
//         "personalReports": [
//           {
//             "yearMonth": "",
//             "reportContent": ""
//           }
//         ],
//         "contributionEvaluation": [
//           {
//             "yearMonth": "",
//             "reportContent": ""
//           }
//         ],
//         "onsiteEvaluation": [
//           {
//             "yearMonth": "",
//             "reportContent": ""
//           }
//         ]
//       }
//     ]
//   }
export const getMemberGroup = (leaderEmpNumber) => {
    return axios.post('/groupManagement', { leaderEmpNumber });
};

//状況報告作成
export const createMemberReport = (empNo, reportType, content) => {
    return axios.post('/groupManagement', { empNo, reportType, content });
};

//報告削除
export const deleteMemberReport = (empNo, reportType, yearMonth) => {
    return axios.delete('/groupManagement', {
        data: { empNo, reportType, yearMonth },
    });
};
