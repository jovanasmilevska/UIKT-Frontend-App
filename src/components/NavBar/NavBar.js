import Navbar from 'react-bootstrap/Navbar'
import './NavBar.css'
import {Container, Nav, NavDropdown} from "react-bootstrap";
import React, {useEffect} from "react";
import {FaSearch} from 'react-icons/fa';
import YearService from "../../repository/YearRepository";
import SemesterTypeService from "../../repository/SemesterType";
import UserService from "../../repository/UserRepository";



const NavBar = () => {
    const username = localStorage.getItem("username")

    const [searchValue, setSearchValue] = React.useState("")
    const [years, setYears] = React.useState([])
    const [semesterTypes, setSemesterTypes] = React.useState([])

    const search = () => {
        if (searchValue !== "") {
            window.location.href = "/subjects?search=" + searchValue
        } else {
            window.location.href = "/subjects?page=1"
        }
    }

    const onValueChange = (e) => {
        setSearchValue(e.target.value)
    }

    const enterHandler = (e) => {
        if (e.key === "Enter") {
            search()
        }
    }

    const fetchAllYears = () => {
        YearService.getAllYears().then((year) => {
            setYears(year.data)
        })
    }

    const fetchAllSemesterTypes = () => {
        SemesterTypeService.getAllSemesterTypes().then((type) => {
            setSemesterTypes(type.data)
        })
    }

    const logout = () => {
        // let lang = localStorage.getItem('lng')
        UserService.logout().then(() => {
            localStorage.clear()
            // localStorage.setItem('lng', lang)
            window.location.href = "/login"
        })

    }

    useEffect(() => {
            fetchAllSemesterTypes()
            fetchAllYears()
        }, []
    )

    return (
        <Navbar id="nav_bar" variant="dark" expand="md" className="mb-4">
            <Container>
                <Navbar.Brand href="/subjects?page=1">Предметник</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"/>
                <Navbar.Collapse>
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <NavDropdown title='Предмети'>
                            {years.map((y, ind) => {
                                return (
                                    <NavDropdown.Item href={"/subjects?year=" + y.id} key={y.id}
                                                      className={"navBar_item" + ind}>{y.name} година
                                        <div className="floatDiv">
                                            {semesterTypes.map((t, index) => {
                                                return (
                                                    <NavDropdown.Item
                                                        href={"/subjects?year=" + y.id + "&type=" + t.id}
                                                        key={t.id}>{t.name} семестар</NavDropdown.Item>
                                                )
                                            })}
                                        </div>
                                    </NavDropdown.Item>
                                )
                            })}
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="/subjects?page=1">Сите предмети</NavDropdown.Item>
                        </NavDropdown>
                        {localStorage.getItem("role") ?
                            <Nav.Link href="/subjects?type=favorites">Мои предмети</Nav.Link> : null}
                    </Nav>
                    <div className="d-flex">
                        <input
                            type="text"
                            placeholder='Пребарувај...'
                            className="me-2 form-control"
                            aria-label="Search"
                            value={searchValue}
                            onChange={onValueChange}
                            onKeyPress={enterHandler}
                        />
                        <div><FaSearch id="nav_bar_search_icon" size={19} cursor="pointer" onClick={search}/></div>
                    </div>
                    <div>
                        {localStorage.getItem("role") ?
                            <span className="nav_bar_username">Корисник :  {username}</span>
                            : null
                        }
                    </div>

                    <Nav
                        className="my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <NavDropdown title='Мени'>

                            {localStorage.getItem("role") ? <>
                                    <NavDropdown.Header
                                        className="nav_bar_username">Корисник : {username}</NavDropdown.Header>
                                    <NavDropdown.Divider/>

                                    <NavDropdown.Item className="nav_bar_login_link"
                                                      onClick={logout}>Одјави се</NavDropdown.Item>
                                </>
                                :
                                <>
                                    <NavDropdown.Item className="nav_bar_login_link"
                                                      href="/login">Најави се</NavDropdown.Item>
                                    <NavDropdown.Item className="nav_bar_login_link"
                                                      href="/register">Регистрирај се</NavDropdown.Item>
                                </>}

                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar
