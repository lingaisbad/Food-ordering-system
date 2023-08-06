import React from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Request from "./Request";
import "./style/signin.css";


export default class Signup extends React.Component {

    state = {
        showPassword: false,
        pwd: "",
        phone:"",
        cpwd:"",
        name:"",
    }

    toggleShowPassword = () => this.setState({ showPassword: !this.state.showPassword });



    setInput = (e) =>{
        console.log(e.target.value);
        const {name,value}=e.target;
        this.setState({[name]:value})
    }

    handleSignup = (e) => {
        e.preventDefault();
        if(this.state.pwd!=this.state.cpwd){
            return toast.error("Password does not match confirm password")
        }
        Request.post(this.props.url+"signup", {
            "name": this.state.name,
            "pwd": this.state.pwd,
            "phone": this.state.phone,

        }).then(() => {
            location.replace(this.props.redirectTo)
        }).catch(err => toast.error(err.message))
    }


    render() {
        return <form className="signin" id="signin-form" onSubmit={this.handleSignup}>
                <div className="head group">
                    <img src="../assets/images/logo.png" alt="logo" width="150px" />
                    <div>
                    <p>Sign Up To Continue</p>  
                    </div>
                </div>
                <div className="group">
                    <label htmlFor="email-field">Name</label><br />
                    <input type="text" name="name" id="name-field"  value={this.state.name} required onChange={this.setInput} />
                </div>
                <div className="group">
                    <label htmlFor="user-field">Phone.no</label><br />
                    <input type="number" name="phone" id="phoneno-field" value={this.state.phone} required onChange={this.setInput} />
                </div>
                <div className="group">
                    <label htmlFor="password-field">Password</label><br />
                    <input type={this.state.showPassword ? "text" : "password"} name="pwd" id="password-field" value={this.state.pwd} required onChange={this.setInput} />
                    <span onClick={this.toggleShowPassword}><i className={"field-icon fa-solid fa-eye" + (this.state.showPassword ? "-slash" : "")}></i></span>
                </div>


                <div className="group">
                    <label htmlFor="cpassword-field">confirm Password</label><br />
                    <input type={this.state.showPassword ? "text" : "password"} name="cpwd" id="cpassword-field" value={this.state.cpwd} required onChange={this.setInput} />
                    <span onClick={this.toggleShowPassword}><i className={"field-icon fa-solid fa-eye" + (this.state.showPassword ? "-slash" : "")}></i></span>
                </div>
                <div className="group">
                    <button id="submit"><span>SIGN-UP</span></button>
                </div>

                <div className="group sign-up-link">
                    <p>Existing User? <Link to="/user-signin">Signin</Link></p>
                </div>
            </form>
    }
}