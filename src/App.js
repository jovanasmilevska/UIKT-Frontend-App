import './App.css';
import './assets/general.css'
import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom"
import {Routes, Navigate} from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import Subject from "./components/Subject/Subject";
import Register from "./components/Register/Register";
import AddSubject from "./components/AddSubject/AddSubject";
import EditSubject from "./components/EditSubject/EditSubject";

class App extends Component {

    render() {
        
        if (localStorage.getItem('lng') === null) {
            localStorage.setItem('lng', 'mk')
        }

        let routes = (
            <Router>
                <NavBar/>

                <Routes>
                    <Route path='/subjects' element={<MainPage/>}/>
                    <Route path='/subject/:id' element={<Subject/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>

                    <Route path="*" element={<Navigate to="/subjects?page=1"/>}/>
                </Routes>
            </Router>
        )

        const userRole = localStorage.getItem('role')

        if (userRole === "ROLE_ADMIN") {
            routes = this.adminRoutes()
        }

        return (
            <div>
                {routes}
            </div>
        )
    }

    adminRoutes = () => {

        return (
            <Router>
                <NavBar/>

                <Routes>
                    <Route path='/subjects' element={<MainPage/>}/>
                    <Route path='/subject/:id' element={<Subject/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/add/subject' element={<AddSubject/>}/>
                    <Route path='/subject/:id/edit' element={<EditSubject/>}/>

                    <Route path="*" element={<Navigate to="/subjects?page=1"/>}/>
                </Routes>
            </Router>
        )
    }

}

export default App;
