import React, { useState, useEffect } from 'react';
import { Button, Modal, notification } from 'antd';
import { getAllStudentInformation, submitStudentEvaluation } from '../../services/teacher.service.js';
import TitleCus from '../Common/Layout/TitleCus.jsx';

const StudentEvaluations = () => {
    const [studentEvaluations, setStudentEvaluations] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [changedRows, setChangedRows] = useState({});

    useEffect(() => {
        fetchStudentInformation();
    }, []);

    const fetchStudentInformation = async () => {
        try {
            const response = await getAllStudentInformation();
            if (response.data && Array.isArray(response.data)) {
                setStudentEvaluations(response.data);
            }
        } catch (error) {
            console.error('データの取得中にエラーが発生しました。', error);
        }
    };

    const updateStudentField = (id, field, value) => {
        setStudentEvaluations((prev) =>
            prev.map((student) => (student.id === id ? { ...student, [field]: value } : student)),
        );
        setChangedRows((prev) => ({ ...prev, [id]: true }));
    };

    const handleSubmit = () => {
        setShowConfirmation(true);
    };

    const confirmSubmit = async () => {
        const updatedEvaluations = studentEvaluations.filter((student) => changedRows[student.id]);
        try {
            await Promise.all(
                updatedEvaluations.map((student) =>
                    submitStudentEvaluation({
                        employee_number: student.employee_number,
                        employee_name: student.employee_name,
                        class_date: student.class_date,
                        teacher_evaluation: student.teacher_evaluation,
                        place: student.place,
                        attendance: student.attendance,
                        note: student.note,
                    }),
                ),
            );
            setChangedRows({});
            notification.success({
                message: '送信が成功しました。',
                style: { width: 270 },
            });
            fetchStudentInformation();
        } catch (error) {
            console.error('データの保存中にエラーが発生しました。', error);
            notification.error({
                message: '送信中にエラーが発生しました。',
                style: { width: 270 },
            });
        } finally {
            setShowConfirmation(false);
        }
    };

    return (
        <div className="mt-16">
            <TitleCus title="学生の評価" />
            <div className="mx-auto mt-10 max-w-7xl rounded-lg bg-white p-10 shadow-lg">
                <h2 className="text-center text-2xl font-bold text-sky-800">評価フォーム</h2>
                <form>
                    <table className="mt-6 min-w-full border border-gray-200 bg-white">
                        <thead>
                            <tr>
                                <th className="border-b px-4 py-2">社員番号</th>
                                <th className="border-b px-4 py-2">名前</th>
                                <th className="border-b px-4 py-2">授業日付</th>
                                <th className="border-b px-4 py-2">先生から評価</th>
                                <th className="border-b px-4 py-2">場所</th>
                                <th className="border-b px-1 py-2">出席状況</th>
                                <th className="border-b px-4 py-2">備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentEvaluations.map((student) => (
                                <tr key={student.id}>
                                    <td className="border-b px-4 py-2">
                                        <input
                                            type="text"
                                            value={student.employee_number}
                                            readOnly
                                            className="w-full rounded border px-2 py-1"
                                        />
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        <input
                                            type="text"
                                            value={student.employee_name}
                                            readOnly
                                            className="w-full rounded border px-2 py-1"
                                        />
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        <input
                                            type="date"
                                            value={student.class_date || ''}
                                            onChange={(e) =>
                                                updateStudentField(student.id, 'class_date', e.target.value)
                                            }
                                            className="w-full rounded border px-2 py-1"
                                        />
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        <textarea
                                            value={student.teacher_evaluation || ''}
                                            onChange={(e) =>
                                                updateStudentField(student.id, 'teacher_evaluation', e.target.value)
                                            }
                                            className="w-full rounded border px-2 py-1"
                                        />
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        <select
                                            value={student.place || ''}
                                            onChange={(e) => updateStudentField(student.id, 'place', e.target.value)}
                                            className="w-full rounded border px-2 py-1"
                                        >
                                            <option value="">選択</option>
                                            <option value="社内">社内</option>
                                            <option value="社外">社外</option>
                                        </select>
                                    </td>
                                    <td className="border-b px-1 py-2">
                                        <select
                                            value={student.attendance || ''}
                                            onChange={(e) =>
                                                updateStudentField(student.id, 'attendance', e.target.value)
                                            }
                                            className="w-full rounded border px-2 py-1"
                                        >
                                            <option value="">選択</option>
                                            <option value="出席">出席</option>
                                            <option value="欠席">欠席</option>
                                            <option value="遅刻">遅刻</option>
                                        </select>
                                    </td>
                                    <td className="border-b px-4 py-2">
                                        <textarea
                                            value={student.note || ''}
                                            onChange={(e) => updateStudentField(student.id, 'note', e.target.value)}
                                            className="w-full rounded border px-2 py-1"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-center">
                        <Button onClick={handleSubmit} type="primary">
                            送信
                        </Button>
                    </div>
                </form>
                <Modal
                    title="確認"
                    open={showConfirmation}
                    onOk={confirmSubmit}
                    onCancel={() => setShowConfirmation(false)}
                    okText="送信"
                    cancelText="キャンセル"
                >
                    <p>
                        情報を送信しますか？送信後の取り消しはできません。
                        <br />
                        内容をよくご確認の上、「送信」ボタンをクリックしてください。
                    </p>
                </Modal>
            </div>
        </div>
    );
};

export default StudentEvaluations;
