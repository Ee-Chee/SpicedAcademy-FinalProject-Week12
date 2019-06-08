import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
// import Registration from "./registration";
import Introduction from "./introduction";
import Features from "./features";
import Registration from "./registration";
import Login from "./login";
import About from "./about";

export default function Welcome() {
    return (
        <div>
            <div className="center" id="center-add">
                <div id="logo">M.A.</div>
                <div className="col-center">
                    <div id="mess">Mess</div>
                    <div id="around">Around</div>
                </div>
            </div>

            <HashRouter>
                <div>
                    <div className="nav">
                        <div>
                            <Link className="link link-add" to="/">
                                Introduction
                            </Link>
                            <Link className="link link-add" to="/features">
                                Features
                            </Link>
                            <Link className="link link-add" to="/info">
                                About Me
                            </Link>
                        </div>
                        <div>
                            <Link className="link link-add2" to="/registration">
                                Registration
                            </Link>
                            <Link className="link link-add2" to="/login">
                                Log-in
                            </Link>
                        </div>
                    </div>

                    <Route exact path="/" component={Introduction} />
                    <Route exact path="/features" component={Features} />
                    <Route
                        exact
                        path="/registration"
                        component={Registration}
                    />
                    <Route path="/login" component={Login} />
                    <Route path="/info" component={About} />
                    <div id="be-responsive-bro">
                        <div className="messages-background">
                            <div className="messages-container absolute-center">
                                This website is not responsive. Please use PC or
                                laptop to visit my website. Thank you.
                            </div>
                        </div>
                    </div>
                </div>
            </HashRouter>
        </div>
    );
}
