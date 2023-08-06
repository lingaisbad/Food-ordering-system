import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./Home.jsx";
import Signin from "./Signin.jsx";
import InitSignup from "./InitSignup.jsx";
import StoreHome from "./StoreHome.jsx"
import UserHome from "./UserHome.jsx";

function App() {
    const userInfo = document.querySelector("meta[name='user-info']").getAttribute("value");
    const userInfoJson = userInfo == "{}" ? null : JSON.parse(userInfo);
    return <div className="app-body">
        <ToastContainer />
        <Router>
            <Switch>
                <Route path={"/user-signin"} render={() => <Signin userType="user" />} />
                <Route path={"/user-signup"} render={() => <InitSignup url={"/user/"} redirectTo={"/user"} />} />
                <Route path={"/store-signin"} render={() => <Signin userType="store" />} />
                <Route path={"/user"} render={(props) => <UserHome userInfo={userInfoJson} {...props} />} />
                <Route path={"/store"} render={(props) => <StoreHome userInfo={userInfoJson} {...props} />} />
                <Route path={"/"} render={Home} />
            </Switch>
        </Router>
    </div>
}

ReactDom.render(<App />, document.getElementById("container"));
