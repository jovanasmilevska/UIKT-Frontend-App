import React, {useEffect} from "react";
import './MainPage.css'
import SubjectService from '../../repository/SubjectRepository'
import {Link, useLocation} from "react-router-dom";
import {AiFillStar} from 'react-icons/ai';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ImageList} from '@material-ui/core';
import ImageListItem from '@material-ui/core/ImageListItem'
import {FadeLoader} from "react-spinners";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import YearService from "../../repository/YearRepository";
import SemesterTypeService from "../../repository/SemesterType";
import UserService from "../../repository/UserRepository";

const MainPage = () => {

    const [subjects, setSubjects] = React.useState([])
    const [year, setYear] = React.useState(undefined)
    const [type, setType] = React.useState(undefined)
    const [search, setSearch] = React.useState("")
    const [areFavorites, setAreFavorites] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [loading2, setLoading2] = React.useState(true)
    const [showPagination, setShowPagination] = React.useState(false)
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(0)
    const [sizeOnPage, setSizeOnPage] = React.useState(30)
    const [totalSubjects, setTotalSubjects] = React.useState(0)

    const queryParams = decodeURI(useLocation().search)
    const yearQuery = new URLSearchParams(queryParams).get('year')
    const typeQuery = new URLSearchParams(queryParams).get('type')
    const searchQuery = new URLSearchParams(queryParams).get('search')


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getPaginatedSubjects(newPage, sizeOnPage)
    }

    const changeSizePerPage = (event) => {
        let p = event.target.value
        setSizeOnPage(p)
        setPage(1);
        setTotalPages(Math.ceil(totalSubjects / p))
        getPaginatedSubjects(1, p)
    };

    const getQueryParam = () => {
        setShowPagination(false)
        if (searchQuery !== null) {
            setSearch(searchQuery)
            searchFilter(searchQuery)
        } else if (typeQuery === "favorites") {
            setAreFavorites(true)
            fetchFavorites()
        } else if (yearQuery !== null) {
            filterByYearAndSemester(yearQuery, typeQuery)
            getYear(yearQuery)
            getSemesterType(typeQuery)
        } else {
            setShowPagination(true)
            getPaginatedSubjects(page, sizeOnPage)
        }
    }

    const addToFavorites = (e) => {
        let id = e.target.parentNode.id.substring(4)
            UserService.addFavoriteSubject(id, localStorage.getItem("id")).then(() => {
                document.getElementById(e.target.parentNode.id).style.color = "#e3d802"
            })
    }

    const removeFavorites = (e) => {
        let id = e.target.parentNode.id.substring(4)

            UserService.removeFavoriteSubject(localStorage.getItem("id"), id).then(() => {
                document.getElementById(e.target.parentNode.id).style.color = "black"
            })

    }

    const filterByYearAndSemester = (y, type) => {
        SubjectService.getAllSubjectsByYearAndSemester(y, type).then(r => {
            setSubjects(r.data)
        }).then(() => {
            setLoading(false)
        })
    }

    const searchFilter = (val) => {
        SubjectService.getAllSubjectsWithSearch(val).then(r => {
            setSubjects(r.data)
        }).then(() => {
            setLoading(false)
        })
    }

    const fetchFavorites = () => {
        setLoading(true)
        console.log(areFavorites, "fav")
        if (localStorage.getItem("username")) {
            UserService.takeFavoriteSubjects(localStorage.getItem("id")).then(s => {
                setSubjects(s.data)
                console.log("subjectfav", s.data)
            }).then(() => {
                setLoading(false)
            })
        }
    }

    const getTotalSubjects = () => {
        SubjectService.getTotalSubjects().then(r => {
            setTotalSubjects(r.data)
            setTotalPages(Math.ceil(r.data / sizeOnPage))
            setLoading2(false)
        })
    }

    const getPaginatedSubjects = (p, s) => {
        SubjectService.getPaginatedSubjects(p, s).then(r => {
            setSubjects(r.data)
            getFavoriteSubjects()
        }).then(() => {
            setLoading(false)
        })
    }

    const getYear = (id) => {
        YearService.getYear(id).then(r => {
            setYear(r.data.name.toLowerCase())
        })
    }

    const getSemesterType = (id) => {
        if (id !== null) {
            SemesterTypeService.getSemesterType(id).then(r => {
                setType(r.data.name.toLowerCase())
            })
        }
    }

    const getFavoriteSubjects = () => {
        if(localStorage.getItem("username")) {
            UserService.takeFavoriteSubjects(localStorage.getItem("id")).then(s => {
                s.data.map((f) => {
                    if(document.getElementById("main"+f.id)) {
                        document.getElementById("main" + f.id).style.color = "#e3d802"
                        console.log("ime na pred", f)
                    }
                })
            })
        }
    }

    useEffect(() => {
        getQueryParam()
        getTotalSubjects()
        getFavoriteSubjects()
    }, [])

    return (
        <div className="container">
            {loading === true || loading2 === true ?
                <div id="div_loader">
                    <FadeLoader speedMultiplier={2} color={"#2a439a"}/>
                    <div id="loading_mess">Се вчитува...</div>
                </div>
                :
                <div className="row">
                    <div className="col">
                        <h1 id="main_page_title">Предмети</h1>

                        {localStorage.getItem("role") === "ROLE_ADMIN" && areFavorites === false ?
                            <div>
                                <Link className="btn main_page_add_subject_btn" to="/add/subject">Додади предмет</Link>
                            </div>
                            : null}

                        <div style={{marginBottom: "30px"}}>
                            {areFavorites === true ? <h3>Мои предмети:</h3>
                                :
                                <div style={{marginBottom: "20px"}}>
                                    <h3>Предмети од {year === undefined ? "сите години" : year + " година "}
                                        {type !== undefined ? "(" + type + " семестар)" : null}: </h3>
                                    {search !== "" ? <h5 id="search_message">-пребарување по "{search}"</h5> : null}
                                </div>
                            }

                            {subjects.length === 0 ?
                                areFavorites === true ?
                                    <h1 id="main_page_subjects_not_found" className="danger">Немате внесено ваши
                                        предмети</h1>
                                    :
                                    <h1 id="main_page_subjects_not_found" className="danger">Нема предмети по даденото
                                        пребарување</h1> :
                                <ImageList cols={3} className="main_page_subject_list">
                                    {subjects.map((s) => {
                                        return (
                                            <ImageListItem key={s.id} className="main_page_list_item">
                                                {
                                                    localStorage.getItem("username") ?
                                                        areFavorites === false ?
                                                            <>
                                                                <AiFillStar size="22" onClick={addToFavorites}
                                                                            className="main_page_star"
                                                                            id={"main"+s.id}/>
                                                            </>
                                                            : areFavorites === true ?
                                                            <AiFillStar size="22" onClick={removeFavorites}
                                                                        className="favorites_star"
                                                                        id={"favr"+s.id}/>
                                                            : null
                                                        : null
                                                }

                                                <Link className="link_subject" to={`/subject/${s.id}`}>
                                                    {s.name}
                                                </Link>

                                            </ImageListItem>
                                        )
                                    })}
                                </ImageList>
                            }
                            {showPagination === true ?
                                <div id="main_page_pagination_div">
                                    <Pagination id="main_page_pagination"
                                                count={totalPages} page={page}
                                                color={'primary'} variant="outlined"
                                                onChange={handleChangePage}
                                                renderItem={(item) => (
                                                    <PaginationItem
                                                        getAllData                 component={Link}
                                                        to={`/subjects?page=${item.page}`}
                                                        {...item}
                                                    />
                                                )}
                                    />
                                    <div id="main_page_selection">
                                        <h5>Прикажи по страна:</h5>
                                        <select id="main_page_select" onChange={changeSizePerPage}>
                                            <option value="15">15</option>
                                            <option defaultValue="30" selected>30</option>
                                            <option value="45">45</option>
                                            <option value="60">60</option>
                                            <option value="75">75</option>
                                            <option value="90">90</option>
                                        </select>
                                    </div>
                                </div> : null}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default MainPage
