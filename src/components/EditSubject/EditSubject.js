import {Card, CardBody} from "reactstrap";
import {useLocation} from "react-router-dom";
import React, {useEffect} from "react";
import SubjectService from "../../repository/SubjectRepository";
import {FadeLoader} from "react-spinners";
import YearService from "../../repository/YearRepository";
import Swal from "sweetalert2";
import SemesterTypeService from "../../repository/SemesterType";

const EditSubject = () => {
    const state = useLocation().state
    const subject = state.subject
    const id = subject.id
    const [loading1, setLoading1] = React.useState(true)
    const [loading2, setLoading2] = React.useState(true)
    const [semesterTypeName, setSemesterTypeName] = React.useState(subject.semesterType.name)
    const [yearName, setYearName] = React.useState(subject.year.name)
    const [subjectName, setSubjectName] = React.useState(subject.name)
    const [formData, setFormData] = React.useState(subject)
    const [allTypes, setAllTypes] = React.useState([])
    const [years, setYears] = React.useState([])


    useEffect(() => {
        fetchAllYears()
        getAllSemesterTypes()

    }, [])

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            editSubjectHandler()
        }
    }

    const editSubjectHandler = (e) => {
        e.preventDefault()
        if (formData.name === '') {
            Swal.fire(
                'Грешка!',
                'Името на предметот е невалидно.',
                'error'
            )
        } else if (semesterTypeName === 'Изберете го типот на семестарот') {
            Swal.fire(
                'Грешка!',
                'Изберете валиден тип на семестар.',
                'error'
            )
        } else if ((formData.name !== subject.name) || (formData.year.name !== subject.year.name)
            || (formData.semesterType.name !== subject.semesterType.name)) {
            SubjectService.editSubject(formData).then(s => {
                Swal.fire(
                    'Успешно!',
                    'Предметот е успешно променет.',
                    'success'
                ).then(() => {
                    window.location.href = "/subject/" + id
                })
            })
        } else {
            Swal.fire(
                'Грешка!',
                'Предметот нема промена.',
                'error'
            )
        }
    }

    const updateSemesterType = (e) => {
        setFormData({
            ...formData,
            semesterType: e.target.options[e.target.selectedIndex].value
        })
        setSemesterTypeName(e.target.options[e.target.selectedIndex].value)
    }

    const updateYears = (y) => {
        setFormData({
            ...formData,
            [y.target.name]: y.target.value
        })
        setYearName(y.target.value)
    }

    const updateName = (n) => {
        setFormData({
            ...formData,
            [n.target.name]: n.target.value
        })
        setSubjectName(n.target.value)
    }

    const fetchAllYears = () => {
        YearService.getAllYears().then((year) => {
            setYears(year.data)
        }).then(() => setLoading1(false))
    }

    const getAllSemesterTypes = () => {
        SemesterTypeService.getAllSemesterTypes().then(r => {
            setAllTypes(r.data)
        }).then(() => setLoading2(false))
    }

    return (
        <div onKeyPress={handleKeyPress}>
            {loading1 === true || loading2 === true ?
                <div id="div_loader">
                    <FadeLoader speedMultiplier={2} color={"#2a439a"}/>
                    <div id="loading_mess">Loading...</div>
                </div>
                :
                <div className="container">
                    <div className="row ">
                        <div className="col add_sub_positions">
                            <Card id="login_card">
                                <div className="row">
                                    <h1 id="login_title">{subject.name}</h1>
                                </div>
                                <CardBody>
                                    <form id="add_sub_form">
                                        <div className="row add_sub_element">
                                            <input name="name" type="text" value={subjectName} onChange={updateName}
                                                   className="form-control "/>

                                        </div>
                                        <div className="row add_sub_element">
                                            <select name="semesterType" className="form-control form-select"
                                                    onChange={updateSemesterType} value={semesterTypeName} required>
                                                <option defaultValue="">Изберете го типот на семестарот</option>
                                                {allTypes.map((t, index) => {
                                                    return (
                                                        <option name="semesterType" id={t.id}
                                                                key={index} value={t.name}>{t.name} семестар
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <div className="row add_sub_element">
                                            <h6>Одберете ја годината во која се предава предметот:</h6>
                                            {
                                                years.map((y) => {
                                                    return (
                                                        <label key={y.id}>
                                                            <input name="year" value={y.name} type="radio"
                                                                   checked={yearName === y.name}
                                                                   onChange={updateYears}/> {y.name} година
                                                        </label>
                                                    )
                                                })
                                            }
                                        </div>
                                        <button type="submit" className="rounded add_subject add_sub_element"
                                                onClick={editSubjectHandler}>Измени
                                        </button>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                </div>
            }
        </div>
    )
}

export default EditSubject
