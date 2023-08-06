import React from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Request from "./Request";
import "./style/signin.css";


export default class Signin extends React.Component {

    state = {
        showPassword: false,
        email: "",
        password: "",
    }

    toggleShowPassword = () => this.setState({ showPassword: !this.state.showPassword });

    setEmail = (e) => this.setState({ email: e.target.value });

    setPassword = (e) => this.setState({ password: e.target.value });

    handleSignin = (e) => {
        e.preventDefault();
        Request.post("/" + this.props.userType + "/signin", {
            email: this.state.email,
            pwd: this.state.password
        }).then(() => location.replace("/" + this.props.userType)).catch(err => toast.error(err.message))
    }

    render() {
        return <div className="signin-container">
            <form className="signin" id="signin-form" onSubmit={this.handleSignin}>
                <div className="head group">
                    <img src="../assets/images/logo.png" alt="logo" width="200px" />
                    <h2>Welcome Back {this.props.userType == "user" ? "User" : "Store"},</h2>
                    <p>Sign In To Continue</p><br /><br />
                </div>

                <div className="group">
                    <label htmlFor="username-field">Email</label><br />
                    <input type="email" name="username" id="username-field" required onChange={this.setEmail} />
                </div>

                <div className="group">
                    <label htmlFor="password-field">Password</label><br />
                    <input type={this.state.showPassword ? "text" : "password"} name="password" id="password-field" required onChange={this.setPassword} />
                    <span onClick={this.toggleShowPassword}><i className={"field-icon fa-solid fa-eye" + (this.state.showPassword ? "-slash" : "")}></i></span>
                </div>

                <div className="group forgot-pass-link">
                    <a href="#">Forget Password?</a>
                </div>

                <div className="group">
                    <button id="submit"><span>Login</span></button>
                </div>

                <div className="group sign-up-link">
                    <p>New User? <Link to="/user-signup">Signup</Link></p>
                </div>
            </form>
        </div>
    }
}