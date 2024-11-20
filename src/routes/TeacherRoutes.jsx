import { Navigate } from 'react-router';

import StudentEvaluation from '../pages/Teacher/StudentEvaluation';
import DocumentUpdates from '../pages/Teacher/DocumentUpdates';
import TeacherSystem from '../pages/Teacher/TeacherSystem';

const TeacherRoutes = [
    { index: true, element: <Navigate to="teacherSystem" /> },
    {
        path: 'teacherSystem',
        element: <TeacherSystem />,
    },
    {
        path: 'documentUpdates',
        element: <DocumentUpdates />,
    },
    {
        path: 'studentEvaluation',
        element: <StudentEvaluation />,
    },
];

export default TeacherRoutes;
