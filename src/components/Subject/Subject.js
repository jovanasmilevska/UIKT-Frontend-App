import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import './Subject.css'
import SubjectService from "../../repository/SubjectRepository";
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2'
import {BsTrash} from "react-icons/bs";
import FileService from "../../repository/FileRepository";
import {FadeLoader} from "react-spinners";
import {HiDownload} from "react-icons/hi";
import FileSaver from 'file-saver';
import {FiEdit} from "react-icons/fi";
import {useNavigate} from "react-router";


const Subject = () => {

    const id = parseInt(useParams().id)
    const navigate = useNavigate()
    const role = localStorage.getItem("role")
    const [subject, setSubject] = React.useState()
    const [files1, setFiles1] = React.useState([])
    const [files2, setFiles2] = React.useState([])
    const [files3, setFiles3] = React.useState([])
    const [inputButtonDisable1, setInputButtonDisable1] = React.useState(true)
    const [inputButtonDisable2, setInputButtonDisable2] = React.useState(true)
    const [inputButtonDisable3, setInputButtonDisable3] = React.useState(true)
    const [openInput1, setOpenInput1] = React.useState(false)
    const [openInput2, setOpenInput2] = React.useState(false)
    const [openInput3, setOpenInput3] = React.useState(false)
    const [filesFirst, setFilesFirst] = React.useState([])
    const [filesSecond, setFilesSecond] = React.useState([])
    const [filesExam, setFilesExam] = React.useState([])
    const [loading1, setLoading1] = React.useState(true)
    const [loading2, setLoading2] = React.useState(true)
    useEffect(() => {
        getSubject()
        getFiles()
    }, [])

    const getSubject = () => {
        SubjectService.getSubjectById(id).then((s) => {
            setSubject(s.data)
            setLoading1(false)
        })
    }

    const getFiles = () => {
        let arr1 = []
        let arr2 = []
        let arr3 = []
        FileService.findFiles(id).then((res) => {
            res.data.forEach(r => {
                if (r.examType.id === 1) {
                    arr1.push(r)
                } else if (r.examType.id === 2) {
                    arr2.push(r)
                } else {
                    arr3.push(r)
                }
            })
        }).then(() => {
            setFilesFirst(arr1)
            setFilesSecond(arr2)
            setFilesExam(arr3)
        }).then(() => {
            setLoading2(false)
        })
    }

    const toFormData = (f, type) => {
        let formData = new FormData()
        for (let i = 0; i < f.length; i++) {
            formData.append("files", f[i])
        }
        formData.append("type", type)
        Swal.fire({
            title: 'Дали сте сигурни?',
            text: "Дали сте сигурни дека сакате да ги прикачите фајловите? Оваа акција е неповратна!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Потврди',
            cancelButtonText: 'Откажи'
        }).then((result) => {
            if (result.isConfirmed) {
                FileService.uploadFile(id, formData).then(() => {
                    getFiles()
                    Swal.fire(
                        'Успешно!',
                        'Фајловите беа успешно прикачени.',
                        'success'
                    )
                }).catch(() => {
                    Swal.fire(
                        'Грешка!',
                        'Големината на фајлот е преголема! Обидете се повторно.',
                        'error'
                    )
                })
            }
        })
    }

    const addMaterials = (e) => {
        const buttonId = e.target.id
        if (buttonId === "subject_button1") {
            toFormData(files1, 1)
        } else if (buttonId === "subject_button2") {
            toFormData(files2, 2)
        } else {
            toFormData(files3, 3)
        }
    }

    const deleteMaterials = (e) => {
        let fileId
        if (e.target.id === "") {
            fileId = e.target.parentNode.id
        } else {
            fileId = e.target.id
        }

        FileService.getFile(fileId).then(r => {
            Swal.fire({
                title: 'Дали сте сигурни?',
                text: "Дали сте сигурни дека сакате да го избришете фајлот: \"" + r.data.name + "\". Оваа акција е неповратна!",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Потврди',
                cancelButtonText: 'Откажи'
            }).then((result) => {
                if (result.isConfirmed) {
                    FileService.deleteFile(fileId).then(() => {
                        Swal.fire(
                            'Успешно!',
                            'Фајлот е успешно избришан.',
                            'success'
                        )
                    }).then(() => {
                        getFiles()
                    })
                }
            })
        })
    }

    const fileChange = (e) => {
        const id = e.target.id
        const fil = e.target.files
        let arr = []
        for (let i = 0; i < fil.length; i++) {
            arr.push(fil[i])
        }
        if (id === "first_input") {
            if (fil.length === 0) {
                setFiles1(fil)
                setInputButtonDisable1(true)
            } else {
                setFiles1(arr)
                setInputButtonDisable1(false)
            }
        } else if (id === "second_input") {
            if (fil.length === 0) {
                setFiles2(fil)
                setInputButtonDisable2(true)
            } else {
                setFiles2(arr)
                setInputButtonDisable2(false)
            }
        } else if (id === "third_input") {
            if (fil.length === 0) {
                setFiles3(fil)
                setInputButtonDisable3(true)
            } else {
                setFiles3(arr)
                setInputButtonDisable3(false)
            }
        }
    }

    const showForm = (e) => {
        if (e.target.id === "first_button") {
            if (document.getElementById("first_form_div").style.display === "none") {
                document.getElementById("first_form_div").style.display = "block"
                setOpenInput1(true)
            } else {
                document.getElementById("first_form_div").style.display = "none"
                setOpenInput1(false)
            }
        } else if (e.target.id === "second_button") {
            if (document.getElementById("second_form_div").style.display === "none") {
                document.getElementById("second_form_div").style.display = "block"
                setOpenInput2(true)
            } else {
                document.getElementById("second_form_div").style.display = "none"
                setOpenInput2(false)
            }
        } else {
            if (document.getElementById("third_form_div").style.display === "none") {
                document.getElementById("third_form_div").style.display = "block"
                setOpenInput3(true)
            } else {
                document.getElementById("third_form_div").style.display = "none"
                setOpenInput3(false)
            }
        }
    }

    const downloadFile = async (id, name) => {
        await FileService.downloadFile(id).then((response) => {
            var blob = new Blob([response.data], {type: response.data.type});
            FileSaver.saveAs(blob, name);
        })
    }
    const openFile = async (id) => {
        window.location.href = 'http://localhost:8080/file/openFile/' + id
        // await FileService.openFile(id).then((response) => {
        //     var blob = new Blob([response.data], {type: response.data.type});
        // FileSaver.open(response);
        // })
    }

    const deleteSubject = () => {
        Swal.fire({
            title: 'Дали сте сигурни?',
            text: "Предметот \"" + subject.name + "\" ќе биде избришан.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Потврди',
            cancelButtonText: 'Откажи'
        }).then((result) => {
            if (result.isConfirmed) {
                SubjectService.deleteSubject(id).then(() => {
                    Swal.fire(
                        'Успешно!',
                        'Предметот е успешно избришан.',
                        'success'
                    ).then(() => {
                        window.location.href = "/subjects"
                    })
                })
            }
        })
    }

    return (
        <div className="container">
            {loading1 === true || loading2 === true ?
                <div id="div_loader">
                    <FadeLoader speedMultiplier={2}/>
                    <div id="loading_mess">Loading...</div>
                </div>
                :
                <div className="row">
                    <div className="mb-3">
                        <h1 id="subject_title">{subject.name}</h1>
                        {role === "ROLE_ADMIN" ?
                            <div id="subject_edit_delete_btns">
                                <Link className="btn btn-success" id="subject_edit" to={`/subject/${subject.id}/edit`}
                                      state={{subject: subject}}>Измени</Link>
                                <button className="btn btn-danger" onClick={deleteSubject}>Избриши
                                </button>
                            </div>
                            : null}
                    </div>
                    <div className="col-12 col-md-4 subject_sub_title_border_right">
                        <h3 className="subject_sub_title">Прв колоквиум</h3>
                        {role ? <>
                            <div>
                                <button className="btn btn-outline-primary subject_add_button" id="first_button"
                                        onClick={showForm}>{openInput1 === false ? "Додади материјали" : "Затвори"}
                                </button>
                            </div>
                            <div id="first_form_div" style={{display: "none"}}>
                                <Form.Group className="mb-3 subject_form_group">
                                    <Form.Label><h5>-Додади материјали</h5></Form.Label>
                                    <Form.Control type="file" multiple onChange={fileChange} id="first_input"/>
                                </Form.Group>
                                <button className="btn btn-outline-primary" onClick={addMaterials}
                                        disabled={inputButtonDisable1} id="subject_button1">Додади
                                </button>
                            </div>
                        </> : null
                        }


                        {filesFirst.length === 0 ?
                            <h5 className="subject_empty_text">Моментално нема материјали за овој дел</h5>
                            :
                            <ol className="subject_list list-group">
                                {filesFirst.map((f) => {
                                    return (
                                        <li key={f.id} className="list-group-item">
                                            {localStorage.getItem("role") === "ROLE_ADMIN" ?
                                                <BsTrash className="subject_delete_download_icons" color="red"
                                                         cursor="pointer"
                                                         id={f.id} name={f.name} onClick={deleteMaterials}/> : null}
                                            <HiDownload className="subject_delete_download_icons"
                                                        onClick={() => downloadFile(f.id, f.name)}>
                                            </HiDownload>
                                            <div className="subject_name" onClick={() => openFile(f.id)}>{f.name}</div>
                                        </li>
                                    )
                                })}
                            </ol>
                        }
                    </div>

                    <div className="col-12 col-md-4 subject_sub_title_border_left subject_sub_title_border_right">
                        <h3 className="subject_sub_title">Втор колоквиум</h3>
                        {role ? <>
                            <div>
                                <button className="btn btn-outline-primary subject_add_button" id="second_button"
                                        onClick={showForm}>{openInput2 === false ? "Додади материјали" : "Затвори"}
                                </button>
                            </div>
                            <div id="second_form_div" style={{display: "none"}}>
                                <Form.Group className="mb-3 subject_form_group">
                                    <Form.Label><h5>-Додади материјали</h5></Form.Label>
                                    <Form.Control type="file" multiple onChange={fileChange} id="second_input"/>
                                </Form.Group>
                                <button className="btn btn-outline-primary" onClick={addMaterials}
                                        disabled={inputButtonDisable2} id="subject_button2">Додади
                                </button>
                            </div>
                        </> : null
                        }

                        {filesSecond.length === 0 ?
                            <h5 className="subject_empty_text">Моментално нема материјали за овој дел</h5>
                            :
                            <ol className="subject_list list-group">
                                {filesSecond.map((f) => {
                                    return (
                                        <li key={f.id} className="list-group-item">
                                            {localStorage.getItem("role") === "ROLE_ADMIN" ?
                                                <BsTrash className="subject_delete_download_icons" color="red"
                                                         cursor="pointer"
                                                         id={f.id} name={f.name} onClick={deleteMaterials}/> : null}
                                            <HiDownload className="subject_delete_download_icons"
                                                        onClick={() => downloadFile(f.id, f.name)}>
                                            </HiDownload>
                                            <div className="subject_name" onClick={() => openFile(f.id)}>{f.name}</div>
                                        </li>
                                    )
                                })}
                            </ol>
                        }
                    </div>

                    <div className="col-12 col-md-4 subject_sub_title_border_left">
                        <h3 className="subject_sub_title">Испит</h3>
                        {role ? <>
                            <div>
                                <button className="btn btn-outline-primary subject_add_button" id="third_button"
                                        onClick={showForm}>{openInput3 === false ? "Додади материјали" : "Затвори"}
                                </button>
                            </div>
                            <div id="third_form_div" style={{display: "none"}}>
                                <Form.Group className="mb-3 subject_form_group">
                                    <Form.Label><h5>-Додади материјали</h5></Form.Label>
                                    <Form.Control type="file" multiple onChange={fileChange} id="third_input"/>
                                </Form.Group>
                                <button className="btn btn-outline-primary" onClick={addMaterials}
                                        disabled={inputButtonDisable3} id="subject_button3">Додади
                                </button>
                            </div>
                        </> : null
                        }

                        {filesExam.length === 0 ?
                            <h5 className="subject_empty_text">Моментално нема материјали за овој дел</h5>
                            :
                            <ol className="subject_list list-group">
                                {filesExam.map((f) => {
                                    return (
                                        <li key={f.id} className="list-group-item">
                                            {localStorage.getItem("role") === "ROLE_ADMIN" ?
                                                <BsTrash className="subject_delete_download_icons" color="red"
                                                         cursor="pointer" id={f.id} name={f.name}
                                                         onClick={deleteMaterials}/> : null}
                                            <HiDownload className="subject_delete_download_icons"
                                                        onClick={() => downloadFile(f.id, f.name)}>
                                            </HiDownload>
                                            <div className="subject_name" onClick={() => openFile(f.id)}>{f.name}</div>
                                        </li>
                                    )
                                })}
                            </ol>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Subject
