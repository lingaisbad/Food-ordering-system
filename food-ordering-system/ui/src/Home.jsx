import React from "react";
import { Link } from "react-router-dom";

export default function () {
    return <div className="home-container">
        <nav className="navbar bg-light">
            <div className="container-fluid">
                <a className="navbar-brand">Rishabh Food Court</a>
                <div className="d-flex">
                    <div className="btn btn-outline-success"><Link to={"/user-signin"}>User - signin</Link></div>
                </div>
                <div className="d-flex">
                    <div className="btn btn-outline-info"><Link to={"/store-signin"}>Store - signin</Link></div>
                </div>
            </div>
        </nav>
    </div>
}