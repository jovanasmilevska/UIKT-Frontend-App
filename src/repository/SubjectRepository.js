import axios from "../custom-axios/axios";

const SubjectService = {

    getPaginatedSubjects: (pageNo, pageSize) => {
        return axios.get(`/subject/page/${pageNo}/${pageSize}`)
    },
    getTotalSubjects: () => {
        return axios.get(`subject/totalSubjects`)
    },

    getSubjectById: (id) => {
        return axios.get(`/subject/${id}`)
    },

    getAllSubjectsByYearAndSemester: (year, semester) => {
        return axios.get(`/subject/filter/semester`, {params: {yearId: year, semesterId: semester}})
    },

    getAllSubjectsWithSearch: (value) => {
        return axios.get(`/subject/search`, {params: {value: value}})
    },

    addSubject: (form) => {
        return axios.post(`/subject/add`, form)
    },

    editSubject: (form) => {
        return axios.post(`/subject/edit`, form)
    },

    deleteSubject: (id) => {
     return axios.get(`/subject/delete/${id}`)
    }

}

export default SubjectService
