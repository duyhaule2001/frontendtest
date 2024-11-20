import axios from './axios.customize';

export const submitDataCourse = (data) => {
    console.log(data);
    return axios.post(`/course`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAllCourse = () => {
    return axios.get(`/course`);
};

export const getAllStudentInformation = () => {
    return axios.get(`/studentInformation`);
};

export const submitStudentEvaluation = (data) => {
    return axios.post(`/studentEvaluation`, data);
};
