import React from "react";
import axios from "./axios";
import { socket } from "./socket";

export default class Pm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { valid: true, newMessageDisplay: false };
        this.msg;
        this.firstPMer = "firstone";
        this.nextPMer;
    }

    componentDidMount() {
        socket.on("updatePM", pm => {
            if (this.firstPMer === "firstone") {
                this.firstPMer = pm.whoSentIt;
            }

            this.nextPMer = pm.whoSentIt;

            if (this.nextPMer == this.firstPMer) {
                this.setState({
                    allChats: pm.newPM
                });
            } else {
                // console.log("You can do bunch of things here");
                // console.log(pm.newPM);
                this.setState({
                    newMessageDisplay: true
                });

                this.setState({
                    latestMsgByOther: pm.newPM[pm.newPM.length - 1].pm
                });

                let temp = this;
                setTimeout(function() {
                    temp.setState({
                        newMessageDisplay: false
                    });
                }, 5000);
            }
        });
        if (this.myDiv) {
            this.myDiv.scrollTop = this.myDiv.scrollHeight;
        }
        const id = this.props.profileOwnerId;
        axios
            .get("/privatemessage/" + id)
            .then(resp => {
                // console.log("test1:", resp.data);
                this.setState({
                    allChats: resp.data.reverse()
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentWillUnmount() {
        //remove or stop listening when unmounting
        socket.off("updatePM");
    }

    componentDidUpdate() {
        this.myDiv.scrollTop = this.myDiv.scrollHeight;
    }

    handleInput(e) {
        //use onKeyUp event instead of onKeyDown. Otherwise last char missing
        // console.log(e.target.value);
        this.msg = e.target.value.trim();
        if (e.which === 13) {
            axios
                .post("/privatemessage", {
                    profileownerid: this.props.profileOwnerId,
                    msg: e.target.value.trim()
                })
                .then(resp => {
                    if (resp.data.status === false) {
                        return this.setState({ valid: false });
                    }
                    this.setState({ valid: true });
                    // console.log("test3:", resp.data);
                    this.setState({
                        allChats: resp.data.reverse()
                    });

                    socket.emit("newPrivateMessage", {
                        newPM: resp.data,
                        other_id: this.props.profileOwnerId
                    });
                    e.persist();
                    document.getElementById("textfield").value = ""; //put here so that it wouldnt wipe off the text if error occurs
                })
                .catch(err => {
                    console.log(err);
                });
            //e.target.value = "";
            e.preventDefault();
        }
    }

    send() {
        axios
            .post("/privatemessage", {
                profileownerid: this.props.profileOwnerId,
                msg: this.msg
            })
            .then(resp => {
                // console.log("test2:", resp.data);
                if (resp.data.status === false) {
                    return this.setState({ valid: false });
                }
                this.setState({ valid: true });
                this.setState({
                    allChats: resp.data.reverse()
                });
                socket.emit("newPrivateMessage", {
                    newPM: resp.data,
                    other_id: this.props.profileOwnerId
                });
                document.getElementById("textfield").value = "";
            })
            .catch(err => {
                console.log(err);
            });
    }

    exit() {
        this.props.change(false);
    }

    render() {
        // console.log("checking:", this.props.profileOwnerId);
        if (!this.state.allChats) {
            return (
                <div className="messages-background absolute-center">
                    <img
                        src="/circle-loading-gif.gif"
                        height={200}
                        width={200}
                    />
                </div>
            );
        }

        const comments = this.state.allChats;
        const allComments = (
            <div className="messages-background">
                {this.state.newMessageDisplay && (
                    <div id="new-message">
                        you got a new message from user #{this.nextPMer}
                        <div>{this.state.latestMsgByOther}</div>
                    </div>
                )}
                <div className="messages-container">
                    <div
                        className="messages"
                        ref={chatsContainer => (this.myDiv = chatsContainer)}
                    >
                        {!comments.length && (
                            <h3>
                                Nothing at the moment. Take the first move and
                                start the conversation.
                            </h3>
                        )}

                        {comments.map(user => (
                            <div className="row" key={user.pm_id}>
                                <img
                                    src={user.avatarurl || "/default-user.png"}
                                    height={100}
                                    width={100}
                                />
                                <div className="col">
                                    <div className="profile">
                                        {user.firstn} {user.lastn}
                                    </div>
                                    {user.pm}
                                </div>
                            </div>
                        ))}
                    </div>
                    {this.state.valid ? (
                        <div />
                    ) : (
                        <p className="error">
                            Hint: Dont leave blank and up to only 300 characters
                        </p>
                    )}
                    <div className="textinput-container">
                        <textarea
                            id="textfield"
                            onKeyUp={e => this.handleInput(e)}
                            className="textinput"
                            placeholder="some nice words here..."
                            style={{ resize: "none" }}
                        />
                        <button
                            className="message-send-button"
                            onClick={() => this.send()}
                        >
                            send
                        </button>
                    </div>
                    <button className="exit" onClick={() => this.exit()}>
                        exit
                    </button>
                </div>
            </div>
        );
        return <div>{allComments}</div>;
    }
}
