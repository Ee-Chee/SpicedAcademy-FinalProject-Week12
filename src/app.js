import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Avatar from "./avatar";
import Uploader from "./uploader";
import Profile from "./profile";
import BioEditor from "./bioeditor";
import OtherProfile from "./otherprofile";
import OnlineFriends from "./onlinefriends";
import Forum from "./forum";
import Chart from "./chart";
import Messaround from "./messaround";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.pendingData = {};
    }
    //life cycle - during mounted. Runs before render()
    componentDidMount() {
        axios.get("/user").then(resp => {
            // console.log("see ", resp.data);
            this.setState({
                ln: resp.data.lastn,
                fn: resp.data.firstn,
                id: resp.data.id,
                avatarurl: resp.data.avatarurl,
                biodata: resp.data.biotext
            });
        });
    }

    render() {
        if (!this.state.id) {
            return (
                <div className="center">
                    <img
                        src="/circle-loading-gif.gif"
                        height={200}
                        width={200}
                    />
                </div>
            );
        } else {
            return (
                <BrowserRouter>
                    <div>
                        <div id="header">
                            <div className="row">
                                <div id="logo2">M.A.</div>
                            </div>
                            <div id="user-container">
                                <div id="user">#{this.state.id}</div>
                                <Avatar
                                    imageUrl={this.state.avatarurl}
                                    clickHandler={() =>
                                        this.setState({ uploaderVisible: true })
                                    }
                                    hi={80}
                                    wif={80}
                                />
                                <div id="user-function">
                                    <a className="link" href="/logout">
                                        <i
                                            className="fas fa-door-open"
                                            style={{
                                                color: "#00e6e6",
                                                fontSize: "18px"
                                            }}
                                        />
                                    </a>
                                    <p
                                        className="link"
                                        onClick={() =>
                                            this.setState({
                                                uploaderVisible: true
                                            })
                                        }
                                    >
                                        <i
                                            className="fas fa-cloud-upload-alt"
                                            style={{
                                                color: "#00e6e6",
                                                fontSize: "18px"
                                            }}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                        {this.state.uploaderVisible && (
                            <Uploader
                                handleImage={url =>
                                    this.setState({ avatarurl: url })
                                }
                                change={boolean =>
                                    this.setState({ uploaderVisible: boolean })
                                }
                            />
                        )}
                        <div className="nav" id="nav">
                            <Link className="link link-add link-add2" to="/">
                                My Profile
                            </Link>
                            <Link
                                className="link link-add"
                                to="/chart-analysis"
                            >
                                Chart Analysis
                            </Link>
                            <Link className="link link-add" to="/online">
                                Finding Nemo
                            </Link>
                            <Link className="link link-add" to="/forum">
                                Forex Forum
                            </Link>
                            <Link
                                className="link link-add"
                                to="/messing-around"
                            >
                                React-SocketIO
                            </Link>
                        </div>
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        /* comment inside JSL */
                                        userId={this.state.id}
                                        firstN={this.state.fn}
                                        lastN={this.state.ln}
                                        profilePic={
                                            <Avatar
                                                className="content-container"
                                                imageUrl={this.state.avatarurl}
                                                clickHandler={() =>
                                                    this.setState({
                                                        uploaderVisible: true
                                                    })
                                                }
                                                hi={200}
                                                wif={200}
                                            />
                                        }
                                        bio={
                                            <BioEditor
                                                bioData={this.state.biodata}
                                                bioHandler={arrBioData => {
                                                    // console.log("im here", arrBioData[0]);
                                                    this.setState({
                                                        biodata: arrBioData[0]
                                                    });
                                                }}
                                            />
                                        }
                                    />
                                );
                            }}
                        />
                        <Route path="/chart-analysis" component={Chart} />
                        <Route path="/user/:idnum" component={OtherProfile} />
                        <Route path="/online" component={OnlineFriends} />
                        <Route path="/forum" component={Forum} />
                        <Route path="/messing-around" component={Messaround} />
                    </div>
                </BrowserRouter>
            );
        }
    }
}
