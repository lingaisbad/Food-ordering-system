import React from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Request from "./Request";
import "./style/signin.css";
import Signup from "./Signup.jsx"


export default class InitSignup extends React.Component {

    state = {
        showOTPfield: false,
        email: "",
        otp: "",
        verified: false,
    }

    setInput = (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        this.setState({ [name]: value })
    }

    handleInitSignup = (e) => {
        e.preventDefault();
        if (!this.state.email.endsWith("@ssn.edu.in")) {
            return toast.error("Email-ID should be SSN offical Email-ID")
        }
        Request.post(this.props.url + "init-signup", {
            "email": this.state.email,
        }).then((res) => {
            this.setState({ showOTPfield: true });
            toast.success(res.message);
        }).catch(err => toast.error(err.message || "unexpected error"))
    }

    handleVerifyOTP = (e) => {
        e.preventDefault();
        Request.post(this.props.url + "verifyOTP", {
            otp: this.state.otp
        }).then((res) => {
            this.setState({ verified: true })
        }).catch(err => toast.error(err.message || "unexpected error"))


    }

    render() {
        return <div className="signin-container">
            {!this.state.verified ?
                <form className="signin" id="signin-form" onSubmit={this.state.showOTPfield == true ? this.handleVerifyOTP : this.handleInitSignup}>
                    <div className="head group">
                        <img src="../assets/images/logo.png" alt="logo" width="150px" />
                        <div>
                            <p>Sign Up To Continue</p>
                        </div>
                    </div>
                    <div className={"" + (this.state.showOTPfield ? "hide" : "group")}>
                        <label htmlFor="email-field">Email</label><br />
                        <input type="email" name="email" id="username-field" value={this.state.email} required onChange={this.setInput} />
                    </div>
                    <div className={"" + (this.state.showOTPfield ? "group" : "hide")}>
                        <label htmlFor="otp-field">Enter OTP:</label><br />
                        <input type="number" name="otp" value={this.state.otp} onChange={this.setInput} />
                    </div>
                    <div className="group">
                        <button id="submit"><span>{this.state.showOTPfield ? "verify OTP" : "send OTP"}</span></button>
                    </div>

                    <div className="group sign-up-link">
                        <p>Existing User? <Link to="/user-signin">Signin</Link></p>
                    </div>
                </form> : ""}
            {this.state.verified ?
                <Signup url={this.props.url} redirectTo={this.props.redirectTo}/>
                : ""}
        </div>
    }
}