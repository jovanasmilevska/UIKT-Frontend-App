import axios from "../custom-axios/axios";


const YearService = {

    getAllYears: () => {
        return axios.get(`/year/all`)
    },

    getYear: (id) => {
        return axios.get(`/year/${id}`)
    },

}

export default YearService