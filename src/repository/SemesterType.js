import axios from "../custom-axios/axios";


const SemesterTypeService = {

    getAllSemesterTypes: () => {
        return axios.get(`/semester/type/all`)
    },

    getSemesterType: (id) => {
        return axios.get(`/semester/type/${id}`)
    },

}

export default SemesterTypeService