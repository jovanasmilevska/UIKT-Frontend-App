import {Card, CardBody} from "reactstrap";
import './Login.css'
import {FaBookReader} from 'react-icons/fa';
import {useRef} from "react";
import UserService from "../../repository/UserRepository";
import {Buffer} from "buffer";
import Swal from "sweetalert2";

const Login = () => {
    const emailInput = useRef()
    const passwordInput = useRef()

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            loginHandler(e)
        }
    }

    const loginHandler = async (e) => {
        e.preventDefault()
        const email = emailInput.current.value
        const password = passwordInput.current.value
        const data = email + ":" + password
        const request = Buffer.from(data).toString('base64')
        await UserService.login(request).then(r => {
            localStorage.setItem("token", r.data)
        }).then(() => {
            UserService.userDetails().then(details => {
                localStorage.setItem("role", details.data.roles[0])
                localStorage.setItem("username", details.data.username)
                localStorage.setItem("id",details.data.id)
                window.location.href = "/subjects"
            })
        }).catch(() => {
            Swal.fire(
                'Грешка!',
                'Е-поштата не се совпаѓа со лозинката. Обидете се повторно.',
                'error'
            )
        })
    }

    return (
        <div onKeyPress={handleKeyPress}>
            <div className="container">
                <div className="row ">
                    <div className="col login_positions">
                        <Card id="login_card">
                            <div className="row">
                                <h1 id="login_title">Најави се</h1>
                                <FaBookReader size="35" id="login_reader_icon"/>
                            </div>
                            <CardBody>
                                <form id="login_form">
                                    <div className="row login_form_element">
                                        <input ref={emailInput} name="username" type="text" className="form-control "
                                               placeholder='Внеси мејл'/>
                                    </div>
                                    <div className="row login_password_input login_form_element">
                                        <input ref={passwordInput} name="password" type="password"
                                               className="form-control" placeholder='Внеси лозинка'/>
                                    </div>
                                    <div className="row login_form_element" id="login_btn_div">
                                        <button type="submit" className="form-control login_btn"
                                                onClick={loginHandler}>Најави се
                                        </button>
                                    </div>
                                    <div className="row login_form_element">
                                        <a className="btn btn-success form-control login_register_btn "
                                           href={'/register'}>Регистрирај се</a>
                                    </div>
                                </form>

                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
