import axios from 'axios';

//一般情報
//新入社員・採用不可・離職
export const getNewEnemployedResignations = (month) => {
    return axios.get(`http://localhost:4000/newEnemployedResignations?month_like=${month}`);
};

//SAP表示
export const getSapInformation = (month) => {
    return axios.get(`http://localhost:4000/sapInformation?month_like=${month}`);
};

//Open表示
export const getOpenInformation = (month) => {
    return axios.get(`http://localhost:4000/openInformation?month_like=${month}`);
};

//CloudInfra表示
export const getCloudInfraInformation = (month) => {
    return axios.get(`http://localhost:4000/cloudInfraInformation?month_like=${month}`);
};

//社内(内勤、営業）
export const getWithinCompanyInformation = (month) => {
    return axios.get(`http://localhost:4000/withinCompany?month_like=${month}`);
};

//月報表示
export const getMonthlyReportInformation = (year) => {
    return axios.get(`http://localhost:4000/monthlyReport?year_like=${year}`);
};

//産休登録
export const createReputation = (data) => {
    return axios.post('http://localhost:4000/reputation', data);
};

//-------------------
//在庫管理
//リスト表示
export const getEquipmentList = () => {
    return axios.get('http://localhost:4000/equipmentManagement');
};

//登録
export const createEquipment = (data) => {
    return axios.post('http://localhost:4000/equipmentManagement', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//利用履歴登録
//登録
export const createUseRegister = (data) => {
    return axios.post('http://localhost:4000/equipmentUsageHistory', data);
};

//部品番号で利用履歴取得
export const getUseHistory = (recordId) => {
    return axios.get(`http://localhost:4000/equipmentUsageHistory?record_id_like=${recordId}`);
};

//------------

//進捗管理
//リスト表示
export const getProgressList = (yearMonth) => {
    return axios.get(`http://localhost:4000/progressManagement?date_like=${yearMonth}`);
};

//新規登録
export const createProgress = (data) => {
    return axios.post('http://localhost:4000/progressManagement', data);
};

//修正
export const updateProgress = (id, data) => {
    return axios.put(`http://localhost:4000/progressManagement/${id}`, data);
};

//削除
export const deleteProgress = (id) => {
    return axios.delete(`http://localhost:4000/progressManagement/${id}`);
};

//------------------
export const createParticipationStatus = (data) => {
    return axios.post(`http://localhost:4000/participation`, data);
};
export const getAllParticipationStatus = () => {
    return axios.get(`http://localhost:4000/participation`);
};
export const updateParticipationStatus = (id, data) => {
    return axios.put(`http://localhost:4000/participation/${id}`, data);
};
export const deleteParticipationStatus = (id) => {
    return axios.delete(`http://localhost:4000/participation/${id}`);
};

//お客様情報
//リスト表示
export const getCustomerList = () => {
    return axios.get('http://localhost:4000/customerInformation');
};

//新規登録
export const createCustomer = (data) => {
    return axios.post('http://localhost:4000/customerInformation', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updateCustomer = (id, data) => {
    return axios.put(`http://localhost:4000/customerInformation/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const deleteCustomer = (id) => {
    return axios.delete(`http://localhost:4000/customerInformation/${id}`);
};

//----------------

//有給休暇
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
export const getPaidLeaveLists = (employeeNumber) => {
    return axios.get(`http://localhost:4000/paidLeaveLists?employeeNumber_like=${employeeNumber}`);
};

//新規登録
export const createPaidLeaves = (data) => {
    return axios.post('http://localhost:4000/paidLeaveLists', data);
};

//修正
export const updatePaidLeaves = (paidLeaveId, data) => {
    return axios.put(`http://localhost:4000/paidLeaveLists/${paidLeaveId}`, data);
};

//削除
export const deletePaidLeaves = (paidLeaveId) => {
    return axios.delete(`http://localhost:4000/paidLeaveLists/${paidLeaveId}`);
};

//--------------------

//営業日報登録
//表示
//戻り値
// {
//     "date": "2023-10-01",
//     "time": "AM",
//     "jobDescription": "",
//     "requiredTime": 2,
//     "managerApproval": true,
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
// export const getReportsList = (date) => {
//     return axios.get(`http://localhost:4000/saleReportRegister?date=${date}`);
// };

export const getReportsList = (date) => {
    return axios.get(`http://localhost:4000/saleReportRegister?date_like=${date}`);
};

//登録
export const createReportsList = (data) => {
    return axios.post('http://localhost:4000/saleReportRegister', data);
};

//修正
export const updateReportsList = (id, data) => {
    return axios.put(`http://localhost:4000/saleReportRegister/${id}`, data);
};

//削除
export const deleteReports = (id) => {
    return axios.delete(`http://localhost:4000/saleReportRegister/${id}`);
};

//承認
export const approvalReports = (id, data) => {
    return axios.patch(`http://localhost:4000/saleReportRegister/${id}`, data);
};
//----------------------
//会議室予約
//表示
export const getReservation = (date) => {
    return axios.get(`http://localhost:4000/appointments?date=${date}`);
};

//新規予約
//送るデータ

export const createReservation = (recordId, data) => {
    return axios.post(`http://localhost:4000/appointments?recordId=${recordId}`, data);
};

//キャンセル
export const deleteReservation = (id) => {
    return axios.delete(`http://localhost:4000/appointments?id=${id}`);
};

//----------
//社内教育制限管理
//コース設定
//先生account探す
export const searchTeacherAccount = (name) => {
    return axios.get(`http://localhost:4000/teacherAccount?name_like=${name}`);
};

//管理account探す
export const searchManagerAccount = (name) => {
    return axios.get(`http://localhost:4000/managerAccount?name_like=${name}`);
};

//backendにデータを送る
// adminAccount: undefined;
// courseItem: 'ビジネスマナー教育';
// employeeNumbers: (2)[('0112311231232312', '0112312312')];
// teacherAccount: ['123456'];
export const courseSetting = (data) => {
    return axios.post('http://localhost:4000/courseSetting', data);
};

export const getUserMails = (department, permissions) => {
    return axios.get('http://localhost:4000/usersMails', { department, permissions });
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
    return axios.get('http://localhost:4000/courseProduction');
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
    return axios.post('http://localhost:4000/courseProduction', data);
};

//修正
export const updateCourse = (courseId, data) => {
    return axios.put(`http://localhost:4000/courseProduction/${courseId}`, data);
};

//削除
export const deleteCourse = (id) => {
    return axios.delete(`http://localhost:4000/courseProduction/${id}`);
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
    return axios.get(`http://localhost:4000/memberOfCourse?courseId_like=${courseId}`);
};

//生徒削除
export const deleteMemberOfCourse = (memberId) => {
    return axios.delete(`http://localhost:4000/memberOfCourse?memberId=${memberId}`);
};

//---------------------------
//リーダに連絡
export const createContactTheLeader = (data) => {
    return axios.post('http://localhost:4000/contactTheLeader', data);
};

//------
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
    return axios.get(`http://localhost:4000/leaderMeetingRecord?date_like=${date}`);
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
    return axios.post('http://localhost:4000/leaderMeetingRecord', data);
};

//削除
export const deleteLeaderMeetingRecord = (id) => {
    return axios.delete(`http://localhost:4000/leaderMeetingRecord/${id}`);
};

//リーダ名表示
//戻り値: ["a","b","c","d"]
export const getLeaderNameMeetingRecord = () => {
    return axios.get('http://localhost:4000/listLeaderNameMeetingRecord');
};

//---------------

//会議記録
//表示
export const getMeetingRecord = (date) => {
    return axios.get(`http://localhost:4000/meetingRecord?date_like=${date}`);
};

//登録
export const createMeetingRecord = (data) => {
    return axios.post('http://localhost:4000/meetingRecord', data);
};

//修正
export const updateMeetingRecord = (id, data) => {
    return axios.put(`http://localhost:4000/meetingRecord?id=${id}`, data);
};

//承認
export const approvalMeetingRecord = (id) => {
    return axios.patch(`http://localhost:4000/meetingRecord?id=${id}`);
};

//------

//人事ー総務：日報登録
//リスト表示
// export const getDailyReportRegis = (date) => {
//     return axios.get(`http://localhost:4000/dailyReportRegis?date=${date}`);
// };

export const getDailyReportRegis = () => {
    return axios.get('http://localhost:4000/dailyReportRegis');
};

//登録
export const createDailyReportRegis = (data) => {
    return axios.post('http://localhost:4000/dailyReportRegis', data);
};

//削除
export const deleteDailyReportRegis = (id) => {
    return axios.delete(`http://localhost:4000/dailyReportRegis/${id}`);
};

//修正
export const updateDailyReportRegis = (id, data) => {
    return axios.put(`http://localhost:4000/dailyReportRegis/${id}`, data);
};

//--------------

//退職リスト
//表示
export const getRetirement = (contract_related) => {
    return axios.get(`http://localhost:4000/retirementList?contract_related=${contract_related}`);
};

//作contract_related成
export const createRetirement = (data) => {
    return axios.post('http://localhost:4000/retirementList', data);
};

//削除
export const deleteRetirement = (id) => {
    return axios.delete(`http://localhost:4000/retirementList/${id}`);
};

//修正
export const updateRetirement = (id, data) => {
    return axios.put(`http://localhost:4000/retirementList/${id}`, data);
};

//--------------------------------------------

//待機有無
export const getStandbyState = (year, month) => {
    return axios.get(`http://localhost:4000/standbyState?year=${year}&month=${month}`);
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
    return axios.get('http://localhost:4000/groupManagement', { leaderEmpNumber });
};

//状況報告作成
//送るデータ：
//  {
// empNo: '';
// reportType: '';
// content: '';
//  }
export const createMemberReport = (empNo, reportType, content) => {
    return axios.post('http://localhost:4000/groupManagement', { empNo, reportType, content });
};

//報告削除
export const deleteMemberReport = (empNo, reportType, yearMonth) => {
    return axios.delete('http://localhost:4000/groupManagement', {
        data: { empNo, reportType, yearMonth },
    });
};

//グループ作成
//リーダにユーザ名を提案
export const getEmployeeName = (searchTerm) => {
    return axios.get(`http://localhost:4000/users?username_like=${searchTerm}`);
};

//グループ作成
export const createGroupManagement = (data) => {
    return axios.post('http://localhost:4000/groupManagement', data);
};

//グループ表示
export const getGroupList = () => {
    return axios.get('http://localhost:4000/groupManagement');
};

//グループ削除
export const deleteGroupList = (id) => {
    return axios.delete(`http://localhost:4000/groupManagement/${id}`);
};

//グループ修正
export const updateGroupList = (id, data) => {
    return axios.put(`http://localhost:4000/groupManagement/${id}`, data);
};

//報告習得
//戻り値

//リーダの場合:
// [
//     {
//         "leaderContent": "",
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
// export const getContentReport = (groupId, role, empNo, typeReport, yearMonth) => {
//     return axios.get(
//         `http://localhost:4000/groupManagement?group_id=${groupId}&role=${role}&emp_no=${empNo}&typeReport=${typeReport}&yearMonth=${yearMonth}`,
//     );
// };
export const getContentReport = () => {
    return axios.get('http://localhost:4000/leaderReport');
};

//------------------------------

//申請承認
export const getApplicationList = () => {
    return axios.get('http://localhost:4000/companyEquipmentApplication');
};

export const setStatusApplicationList = (id, data) => {
    return axios.patch(`http://localhost:4000/companyEquipmentApplication/${id}`, data);
};

//先生
export const getAllStudentInformation = () => {
    return axios.get('http://localhost:4000/studentInformation');
};

export const submitStudentEvaluation = (data) => {
    return axios.post('http://localhost:4000/studentInformation', data);
};

//総務ー技術者管理
//表示
export const getEmployeeListWithDate = (date) => {
    return axios.get(`http://localhost:4000/employeeReport?submit_date=${date}`);
};

//新入社員情報
//登録
export const createNewEmployee = (data) => {
    return axios.post('http://localhost:4000/NewEmployeeInformation', data);
};

//削除
export const deleteNewEmployee = (id) => {
    return axios.delete(`http://localhost:4000/NewEmployeeInformation/${id}`);
};

//修正
export const updateNewEmployee = (id, data) => {
    return axios.put(`http://localhost:4000/NewEmployeeInformation/${id}`, data);
};

//pc management
//返却状態
export const returnStatusPc = (id, status) => {
    return axios.patch(`http://localhost:4000/pc_management/${id}`, status);
};

export const getPcAPI = () => {
    return axios.get('http://localhost:4000/pc_management');
};

//注文書登録
//PDFファイル送信
export const uploadPdfPurchaseOrder = (pdfFile) => {
    return axios.post('http://localhost:4000/purchaseOrder', pdfFile, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//PDFファイルとフォームデータ登録
export const submitPurchaseOrder = (data) => {
    return axios.post('http://localhost:4000/purchaseOrderSubmit', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//社長ー総務部 アカウント作成
//アカウントリスト表示
export const getAccountList = () => {
    return axios.get('http://localhost:4000/account');
};

//アカウント 検索提案
export const suggestionAccountName = (name) => {
    return axios.get(`http://localhost:4000/account?name_like=${name}`);
};

//アカウント　検索
export const searchAccountName = (name) => {
    return axios.get(`http://localhost:4000/account?name=${name}`);
};

//新登録
export const createAccount = (data) => {
    return axios.post('http://localhost:4000/account', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updateAccount = (id, data) => {
    return axios.put(`http://localhost:4000/account/${id}`, data);
};

//削除
export const deleteAccount = (id) => {
    return axios.delete(`http://localhost:4000/account/${id}`);
};

//営業日報管理
//リスト表示
export const getReportList = () => {
    return axios.get('http://localhost:4000/salesDailyReport');
};

//登録
export const createReportSaleList = (data) => {
    return axios.post('http://localhost:4000/salesDailyReport', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const deleteReport = async (id, data) => {
    return axios.patch(`http://localhost:4000/salesDailyReport/${id}`, data);
};

//修正
export const updateSaleReport = async (id, data) => {
    return axios.put(`http://localhost:4000/salesDailyReport/${id}`, data);
};

//労働時間管理
//年月検索
export const searchTimeWorkingHours = (date) => {
    return axios.get(`http://localhost:4000/workingHoursManagement?settlement_date=${date}`);
};

//名前検索提案
export const suggestionWorkingUser = (searchText) => {
    return axios.get(`http://localhost:4000/workingHoursManagement?name_like=${searchText}`);
};

//修正
export const updateWorkingUser = (id, data) => {
    return axios.put(`http://localhost:4000/workingHoursManagement/${id}`, data);
};

// 交通費表示
export const getWorkDayLog = (data) => {
    return axios.get('http://localhost:4000/workDayLog', data);
};

//会社リスト表示
export const getCompanyList = () => {
    return axios.get('http://localhost:4000/companyList');
};

//データ送信とファイルダウンロード
export const getFileFromBackEnd = (data) => {
    return axios.post('http://localhost:4000/companyList', data, {
        responseType: 'blob',
    });
};

//管理職 検索
export const searchManagerUserAPI = (name) => {
    return axios.get(`http://localhost:4000/managerPaidLeave?name=${name}`);
};

//管理職 リスト表示
export const getManagerPaiLeaveAPI = () => {
    return axios.get('http://localhost:4000/managerPaidLeave');
};

//管理職 User追加
export const createUserManager = (data) => {
    return axios.post('http://localhost:4000/managerPaidLeave', data);
};

//管理者　修正
export const updateUserManager = (id, data) => {
    return axios.put(`http://localhost:4000/managerPaidLeave/${id}`, data);
};

//管理者 削除
export const deleteUserManager = (id) => {
    return axios.delete(`http://localhost:4000/managerPaidLeave/${id}`);
};

//有給休暇
//新規登録
export const createPaidLeaveManager = (managerId, data) => {
    return axios.post(`http://localhost:4000/managerPaidLeave/${managerId}/paid_leave_lists`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updatePaidLeaveManager = (managerId, leaveId, data) => {
    return axios.put(`http://localhost:4000/managerPaidLeave/${managerId}/paid_leave_lists/${leaveId}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const deletePaidLeaveManager = (managerId, leaveId) => {
    return axios.delete(`http://localhost:4000/managerPaidLeave/${managerId}/paid_leave_lists/${leaveId}`);
};

// ------------------------------------------------------------------------------------------------//
// 技術　検索
export const searchTechUserAPI = (name) => {
    return axios.get(`http://localhost:4000/techPaidLeave?name=${name}`);
};

//技術者リスト表示
export const getTechPaiLeaveAPI = () => {
    return axios.get('http://localhost:4000/techPaidLeave');
};

//技術Tech追加
export const createUserTech = (data) => {
    return axios.post('http://localhost:4000/techPaidLeave', data);
};

//技術者　修正
export const updateUserTech = (id, data) => {
    return axios.put(`http://localhost:4000/techPaidLeave/${id}`, data);
};

//技術者 削除
export const deleteUserTech = (id) => {
    return axios.delete(`http://localhost:4000/techPaidLeave/${id}`);
};

//有給休暇
//新規登録
export const createPaidLeaveTech = (techId, data) => {
    return axios.post(`http://localhost:4000/techPaidLeave/${techId}/paid_leave_lists`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//修正
export const updatePaidLeaveTech = (TechId, leaveId, data) => {
    return axios.put(`http://localhost:4000/techPaidLeave/${TechId}/paid_leave_lists/${leaveId}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

//削除
export const deletePaidLeaveTech = (TechId, leaveId) => {
    return axios.delete(`http://localhost:4000/techPaidLeave/${TechId}/paid_leave_lists/${leaveId}`);
};

// ----------------------------------------------------------------
// 現場入場管理
export const createOnsiteInfo = (data) => {
    return axios.post(`http://localhost:4000/onsiteInfo`, data);
};
export const getOnsiteInfo = () => {
    return axios.get(`http://localhost:4000/onsiteInfo`);
};
export const updateOnsiteInfo = (data, id) => {
    return axios.put(`http://localhost:4000/onsiteInfo/${id}`, data);
};
export const deleteOnsiteInfo = (id) => {
    return axios.delete(`http://localhost:4000/onsiteInfo/${id}`);
};
export const getOnsiteInfoByName = (technicianName) => {
    return axios.get(`http://localhost:4000/onsiteInfo?technicianName=${technicianName}`);
};
export const getSugOnsiteInfoByName = (technicianName) => {
    return axios.get(`http://localhost:4000/onsiteInfo?technicianName_like=${technicianName}`);
};

// 現場退場管理
export const createOutSiteInfo = (data) => {
    return axios.post(`http://localhost:4000/outSiteInfo`, data);
};
export const getOutSiteInfo = () => {
    return axios.get(`http://localhost:4000/outSiteInfo`);
};
export const updateOutSiteInfo = (data, id) => {
    return axios.put(`http://localhost:4000/outSiteInfo/${id}`, data);
};
export const deleteOutSiteInfo = (id) => {
    return axios.delete(`http://localhost:4000/outSiteInfo/${id}`);
};
export const getOutSiteInfoByName = (technicianName) => {
    return axios.get(`http://localhost:4000/outSiteInfo?technicianName=${technicianName}`);
};
export const getSugOutSiteInfoByName = (technicianName) => {
    return axios.get(`http://localhost:4000/outSiteInfo?technicianName_like=${technicianName}`);
};

// ----------------------------------------------------------------
//新入社員情報
export const getNewEmployee = () => {
    return axios.get('http://localhost:4000/NewEmployeeInformation1');
};

// ----------------------------------------------------------------
//技術稼働時間管理
// リスト表示;
export const getTechnicianData = () => {
    return axios.get('http://localhost:4000/technicianManagementSale');
};

//検索
//提案
export const suggestionTechnician = (searchText) => {
    return axios.get(`http://localhost:4000/technicianManagementSale?technician_name_like=${searchText}`);
};

//検索
export const searchTechnician = (name) => {
    return axios.get(`http://localhost:4000/technicianManagementSale?technician_name=${name}`);
};

//新規登録
export const createTechnician = (data) => {
    return axios.post('http://localhost:4000/technicianManagementSale', data);
};

//削除
export const deleteTechnician = (id) => {
    return axios.delete(`http://localhost:4000/technicianManagementSale/${id}`);
};

//修正

export const updateTechnician = (id, data) => {
    return axios.put(`http://localhost:4000/technicianManagementSale/${id}`, data);
};

//労働時間管理
export const getWorkingHoursAPI = () => {
    return axios.get('http://localhost:4000/workingHoursManagement');
};

// ----------------------------------------------------------------
//sale customer gift
//flower
export const getAllOrderFlower = () => {
    return axios.get('http://localhost:4000/orderFlower');
};
export const createOrderFlower = (data) => {
    return axios.post('http://localhost:4000/orderFlower', data);
};
export const deleteOrderFlower = (id) => {
    return axios.delete(`http://localhost:4000/orderFlower/${id}`);
};
export const updateOrderFlower = (data, id) => {
    return axios.put(`http://localhost:4000/orderFlower/${id}`, data);
};
//souvenir
export const getAllOrderSouvenir = () => {
    return axios.get(`http://localhost:4000/orderSouvenir`);
};
export const createOrderSouvenir = (data) => {
    return axios.post(`http://localhost:4000/orderSouvenir`, data);
};
export const deleteOrderSouvenir = (id) => {
    return axios.delete(`http://localhost:4000/orderSouvenir/${id}`);
};
export const updateOrderSouvenir = (data, id) => {
    return axios.put(`http://localhost:4000/orderSouvenir/${id}`, data);
};
//candy
export const getAllOrderCandy = () => {
    return axios.get(`http://localhost:4000/orderCandy`);
};
export const createOrderCandy = (data) => {
    return axios.post(`http://localhost:4000/orderCandy`, data);
};
export const deleteOrderCandy = (id) => {
    return axios.delete(`http://localhost:4000/orderCandy/${id}`);
};
export const updateOrderCandy = (data, id) => {
    return axios.put(`http://localhost:4000/orderCandy/${id}`, data);
};
//人事部 技術者稼働管理
export const getAllEngineers = () => {
    return axios.get(`http://localhost:4000/engineer`);
};
export const createEngineer = (data) => {
    return axios.post(`http://localhost:4000/engineer`, data);
};
export const updateEngineer = (data, id) => {
    return axios.put(`http://localhost:4000/engineer/${id}`, data);
};
export const deleteEngineer = (id) => {
    return axios.delete(`http://localhost:4000/engineer/${id}`);
};
export const getEngineerByName = (technician_name) => {
    return axios.get(`http://localhost:4000/engineer?technician_name=${technician_name}`);
};
export const getSugEngineerByName = (technician_name) => {
    return axios.get(`http://localhost:4000/engineer?technician_name_like=${technician_name}`);
};
//日報
export const createDailyReport = (data) => {
    return axios.post(`http://localhost:4000/dailyReport`, data);
};
export const getAllDailyReportOfEmployee = () => {
    return axios.get(`http://localhost:4000/dailyReport`);
};
export const getOneDailyReportByDate = (dateReport) => {
    return axios.get(`http://localhost:4000/dailyReport?dateReport=${dateReport}`);
};
export const getAllDailyReportByDate = (dateReport) => {
    return axios.get(`http://localhost:4000/dailyReport?dateReport=${dateReport}`);
};
export const getAllDailyReportByName = (technician_name) => {
    return axios.get(`http://localhost:4000/dailyReport?technician_name=${technician_name}`);
};
export const getSugDailyReportByName = (technician_name) => {
    return axios.get(`http://localhost:4000/dailyReport?technician_name_like=${technician_name}`);
};

// お知らせ管理
export const getAllNoticesAPI = () => {
    return axios.get(`http://localhost:4000/notices`);
};
export const createNoticeAPI = (data) => {
    return axios.post(`http://localhost:4000/notices`, data);
};
export const deleteNoticeAPI = (id) => {
    return axios.delete(`http://localhost:4000/notices/${id}`);
};
export const updateNoticeAPI = (data, id) => {
    return axios.put(`http://localhost:4000/notices/${id}`, data);
};

export const submitTrainReport = (data) => {
    return axios.post(`http://localhost:4000/listTrainReport`, data);
};

export const createSharingApi = (data) => {
    return axios.post(`http://localhost:4000/sharing`, data);
};

export const getSharingApi = () => {
    return axios.get(`http://localhost:4000/sharing`);
};

export const updateSharingApi = (id, data) => {
    return axios.put(`http://localhost:4000/sharing/${id}`, data);
};

export const deleteSharingApi = (id) => {
    return axios.delete(`http://localhost:4000/sharing/${id}`);
};

export const getAllReportApprovalByDate = () => {
    return axios.get(`http://localhost:4000/reportApproval`);
};
export const updateReportApproval = (id) => {
    return axios.put(`http://localhost:4000/reportApproval/${id}`);
};
