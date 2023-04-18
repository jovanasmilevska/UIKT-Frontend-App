import axios from "../custom-axios/axios";


const FileService = {

    uploadFile: (id, files) => {
        return axios.post(`/file/${id}`, files)
    },

    findFiles: (id) => {
        return axios.get(`/file/${id}`)
    },

    deleteFile: (id) => {
        return axios.delete(`/file/${id}`)
    },

    getFile: (id) => {
        return axios.get(`/file/get/${id}`)
    },

    downloadFile: (id) => {
        return axios.get(`/file/downloadFile/${id}`,
            {
                headers: {
                    "Content-disposition": "attachment; filename=response; charset=UTF-8",
                },
                responseType: 'blob'
            }
        )
    },

}

export default FileService
