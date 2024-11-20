import axios from './axios.customize';

//リーダに連絡
export const createContactTheLeader = (data) => {
    return axios.post('/contactTheLeader', data);
};

//----------------

//進捗管理
//リスト表示
export const getProgressList = (yearMonth) => {
    return axios.get(`/progressManagement?date=${yearMonth}`);
};

//新規登録
export const createProgress = (data) => {
    return axios.post('/progressManagement', data);
};

//修正
export const updateProgress = (id, data) => {
    return axios.put(`/progressManagement/${id}`, data);
};

//削除
export const deleteProgress = (id) => {
    return axios.delete(`/progressManagement/${id}`);
};

//----------------
//営業日報登録
//表示
//戻り値
// {
//     "date": "2023-10-01",
//     "time": "AM",
//     "jobDescription": "",
//     "requiredTime": 2,
//     "managerApproval": false,
//     "ceoApproval": false,
//     "meetingEmails": 5,
//     "phoneCallsByClient": 3,
//     "proposals": 2,
//     "meetings": 1,
//     "troubleHandling": 0,
//     "finalDecisions": 1,
//     "handledCompany": "",
//     "handledDepartment": "",
//     "meetingPerson": "",
//     "details": "",
//     "futureActions": "",
//     "notes": "",
//     "id": 1
// },
//登録用:年月を送る
export const getReportsList = (yearMonth) => {
    return axios.get(`/saleReportRegister?yearMonth=${yearMonth}`);
};

//登録
export const createReportsList = (data) => {
    return axios.post('/saleReportRegister', data);
};

//修正
export const updateReportsList = (id, data) => {
    return axios.put(`/saleReportRegister?id=${id}`, data);
};
//退勤する時、営業日報を送信のAPI
export const submitDailyReportSaleWhenCheckOut = (data) => {
    return axios.patch(`/saleReportRegister`, data);
};

//削除
export const deleteReports = (id) => {
    return axios.delete(`/saleReportRegister?id=${id}`);
};

//承認
export const approvalReports = (id, data) => {
    return axios.post(`/saleReportApproval?id=${id}`, data);
};

//承認ページ用：日付を送る
export const getReportsListApproval = (date) => {
    return axios.get(`/saleReportApproval?date=${date}`);
};

//----------------
//リーダ会議記録登録
//履歴表示
// [
//     {
//         id: '',
//         attendees: ['千尋', '木村'],
//         absentees: ['千尋'],
//         chairmanship: '鈴木',
//         date: '2024-10-17',
//         leaderReports: [
//             {
//                 leaderName: '',
//                 content: '',
//             },
//             {
//                 leaderName: '',
//                 content: '',
//             },
//         ],
//     },
// ];

export const getLeaderMeetingRecord = (date) => {
    return axios.get(`/leaderMeetingRecord?date=${date}`);
};

//追加
// {
//     "id": "b428",
//     "attendees": [ "千尋", "鈴木" ],
//     "absentees": [ "千尋"],
//     "chairmanship": "",
//     "date": "2024-10-15",
//     "leaderReports": [
//       {
//         "leaderName": "",
//         "content": ""
//       },
//       {
//         "leaderName": "",
//         "content": ""
//       }
//     ]
// }
export const createLeaderMeetingRecord = (data) => {
    return axios.post('/leaderMeetingRecord', data);
};

//削除
export const deleteLeaderMeetingRecord = (absentees, attendees, date) => {
    return axios.delete(`/leaderMeetingRecord?absentees=${absentees}&attendees=${attendees}&date=${date}`);
};

//リーダ名表示
//戻り値: ["a","b","c","d"]
export const getLeaderNameMeetingRecord = () => {
    return axios.get('/listLeaderNameMeetingRecord');
};

//営業名表示
//戻り値: ["a","b","c","d"]
export const getSaleName = () => {
    return axios.get('/listSaleName');
};

//---------------
//会議記録
//表示
export const getMeetingRecord = (year, month) => {
    return axios.get(`/meetingRecord?year=${year}&month=${month}`);
};

//登録
export const createMeetingRecord = (data) => {
    return axios.post('/meetingRecord', data);
};

//修正
export const updateMeetingRecord = (id, data) => {
    return axios.put(`/meetingRecord?id=${id}`, data);
};

//承認
export const approvalMeetingRecord = (id) => {
    return axios.patch(`/meetingRecord?id=${id}`);
};

//-------------------------

//グループ作成
//リーダにユーザ名を提案
// 戻り値: "group_id": "" と　"is_leader":false　の名前 と 社員番号
// [
//     { username: 'abcd', emp_no: '123' },
//     { username: 'xyz', emp_no: '456' },
//     ....
// ];
export const getEmployeeName = (searchTerm) => {
    return axios.get(`/users?username=${searchTerm}`);
};

//グループ作成
//送るデータ：
// {
//     "leaderInfo": [
//       "username - emp_no"
//     ],
//     "members": [
//       {
//         "memberInfo": "username - emp_no"
//       },
//       {
//         "memberInfo": "username - emp_no"
//       },
//       ...
//     ]
//   }
export const createGroupManagement = (data) => {
    return axios.post('/groupManagement', data);
};

//グループ表示
//戻り値：
//[
//     {
//         "id": "group_id_1",
//         "leader": {
//             "username": "Leader 1",
//             "img_path": "path_to_leader_image_1.jpg"
//         },
//         "members": [
//             {
//                 "username": "Member 1",
//                 "img_path": "path_to_member_image_1.jpg"
//             },
//             {
//                 "username": "Member 2",
//                 "img_path": "path_to_member_image_2.jpg"
//             }
//         ]
//     },
//     {
//         "id": "group_id_2",
//         "leader": {
//             "username": "Leader 2",
//             "img_path": "path_to_leader_image_2.jpg"
//         },
//         "members": [
//             {
//                 "username": "Member 3",
//                 "img_path": "path_to_member_image_3.jpg"
//             },
//             {
//                 "username": "Member 4",
//                 "img_path": "path_to_member_image_4.jpg"
//             }
//         ]
//     }
//    ...
// ]
export const getGroupList = () => {
    return axios.get('/groupManagement');
};

//グループ削除
//送るデータ：group_id
export const deleteGroupList = (group_id) => {
    return axios.delete(`/groupManagement?group_id=${group_id}`);
};

//グループ修正
// {
//     "leaderInfo": [
//       "username - emp_no"
//     ],
//     "members": [
//       {
//         "memberInfo": "username - emp_no"
//       },
//       {
//         "memberInfo": "username - emp_no"
//       },
//       ...
//     ]
//   }
export const updateGroupList = (group_id, data) => {
    return axios.put(`/groupManagement?group_id=${group_id}`, data);
};

//報告習得
//戻り値

//リーダの場合:
// [
//     {
//         "leaderContent": "",
//
//         "member": [
//             {
//                 "name": "",
//                 "content": ""
//             },
//             {
//                 "name": "",
//                 "content": ""
//             },
//             {
//                 "name": "",
//                 "content": ""
//             }
//         ]
//     },
//     {
//         "leaderContent": "",
//
//         "member": [
//             {
//                 "name": "",
//                 "content": ""
//             },
//             {
//                 "name": "",
//                 "content": ""
//             },
//             {
//                 "name": "",
//                 "content": ""
//             }
//         ]
//     }
// ]

//メンバーの場合
// [
//     "新しいタスクの確認待ち。",
//     "現在のタスクはほぼ終了。テスト中。",
//     "タスクDに遅れが出ていますが、調整中です。"
// ]

// };
export const getContentReport = (groupId, role, empNo, typeReport, yearMonth) => {
    return axios.get(
        `/groupManagement?group_id=${groupId}&role=${role}&emp_no=${empNo}&typeReport=${typeReport}&yearMonth=${yearMonth}`,
    );
};

//------------------------------------------

//お知らせ
export const getNoticeSales = () => {
    return axios.get('/noticeSales');
};

//注文書登録
//PDFファイル送信
export const uploadPdfPurchaseOrder = (pdfFile) => {
    return axios.post('/purchaseOrder', pdfFile, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
//PDFファイルとフォームデータ登録
export const submitPurchaseOrder = (data) => {
    return axios.post('/purchaseOrderSubmit', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//営業日報管理
//リスト表示
export const getReportList = (date) => {
    return axios.get(`/salesDailyReport/${date}`);
};

//登録
export const createReportSaleList = (data) => {
    return axios.post('/salesDailyReport', data);
};

//削除 fix by sun
export const deleteReport = async (id, data) => {
    return axios.patch(`/salesDailyReport?id=${id}`, data);
};

//修正
export const updateSaleReport = async (id, data) => {
    return axios.put(`/salesDailyReport?id=${id}`, data);
};

//------------------------------日報管理------------------------
// 日付別の全日報を取得
export const getAllDailyReportByDate = (dateReport) => {
    return axios.put(`/dailyReportManagement`, dateReport);
};
// 社員名前で全日報を取得
export const getAllDailyReportByName = (technician_name) => {
    return axios.post(`/dailyReportManagement`, technician_name);
};

//------------------------------お客ギフト------------------------
export const getAllGift = (type) => {
    return axios.get(`/gift?type=${type}`);
};
export const createGift = (data) => {
    return axios.post(`/gift`, data);
};
export const updateGift = (id, data) => {
    return axios.put(`/gift?id=${id}`, data);
};
export const deleteGift = (id) => {
    return axios.delete(`/gift?id=${id}`);
};

//特別客様API
export const getAllSpecialCustomer = () => {
    return axios.get(`/specialCustomer`);
};
export const createSpecialCustomer = (data) => {
    return axios.post(`/specialCustomer`, data);
};
export const deleteSpecialCustomer = (id) => {
    return axios.delete(`/specialCustomer?id=${id}`);
};
export const updateSpecialCustomer = (id, data) => {
    return axios.put(`/specialCustomer?id=${id}`, data);
};
// 権限付与
export const searchUsersByName = (name) => {
    return axios.post(`/grantPermission?name=${name}`);
};
export const getGrantedUsers = () => {
    return axios.get(`/grantPermission`);
};
export const grantPermissionApi = (id) => {
    return axios.put(`/grantPermission?id=${id}`);
};
export const revokePermission = (id) => {
    return axios.patch(`/grantPermission?id=${id}`);
};

// 要員参画状況のAPI
export const getAllParticipationStatus = () => {
    return axios.get('/participation');
};

export const getParticipationStatusByName = (name) => {
    return axios.get(`/participation?name=${name}`);
};

export const getSugParticipationStatusByName = (name) => {
    return axios.patch(`/participation?name=${name}`);
};

export const createParticipationStatus = (data) => {
    return axios.post('/participation', data);
};

export const updateParticipationStatus = (id, data) => {
    return axios.put(`/participation?id=${id}`, data);
};

export const deleteParticipationStatus = (id) => {
    return axios.delete(`/participation?id=${id}`);
};
// 要員参画状況 権限付与API
export const searchUsersNoGrantedByName = (name) => {
    return axios.post(`/participationGranted?name=${name}`);
};
export const getGrantedUserList = () => {
    return axios.get(`/participationGranted`);
};
export const setGrantViewPermissionApi = (id) => {
    return axios.put(`/participationGranted?id=${id}`);
};
export const revokeViewPermissionApi = (id) => {
    return axios.patch(`/participationGranted?id=${id}`);
};
