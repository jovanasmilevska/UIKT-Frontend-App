import axios from "../custom-axios/axios";


const UserService = {

    login: (request) => {

        return axios.post(`/rest/user/login`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + request
            }
        })
    },

    register: (email, password, body) => {
        return axios.post(`/user/register`, body, {
            headers: {
                email: email,
                password: password
            }
        })
    },

    logout: () => {
        return axios.get(`/user/logout`)
    },

    userDetails: () => {
        return axios.get(`/user/details`)
    },

    takeFavoriteSubjects: (id)=>{
        return axios.get(`/user/${id}/subjects`)
    },

    addFavoriteSubject: (sId,uId) =>{
        return axios.get(`/user/takeSubject`, {params: {userId: uId, subjectId: sId}})
    },
    removeFavoriteSubject: (uId, sId) => {
        return axios.get(`/user/removeSubject`, {params: {userId: uId, subjectId: sId}})
    }

}

export default UserService
