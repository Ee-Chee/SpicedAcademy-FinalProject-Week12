import React from "react";
import { connect } from "react-redux";
import { socket } from "./socket";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { valid: true };
        this.msg;
    }

    componentDidMount() {
        if (this.myDiv) {
            this.myDiv.scrollTop = this.myDiv.scrollHeight;
        }
        socket.on("handleChatError", data => {
            this.setState({
                valid: data.status
            });
        });
        const id = this.props.chatId;
        // console.log(id, this.props.allChats);
        socket.emit("getChatMessages", id);
    }

    componentWillUnmount() {
        //remove or stop listening when unmounting
        socket.off("handleChatError");
    }

    componentDidUpdate() {
        this.myDiv.scrollTop = this.myDiv.scrollHeight;
    }

    handleInput(e) {
        this.msg = e.target.value.trim();
        if (e.which === 13) {
            socket.emit("newChatMessage", {
                msg: this.msg,
                forumId: this.props.chatId
            });
            e.target.value = "";
            e.preventDefault();
        }
        this.setState({
            valid: true
        });
    }

    send() {
        socket.emit("newChatMessage", {
            msg: this.msg,
            forumId: this.props.chatId
        });
        this.setState({
            valid: true
        });
        document.getElementById("textfield2").value = "";
    }

    exit() {
        this.props.change(false);
    }

    render() {
        // console.log(this.props.allChats);
        if (!this.props.allChats) {
            return (
                <div className="center">
                    <img
                        src="/circle-loading-gif.gif"
                        height={200}
                        width={200}
                    />
                </div>
            );
        }
        const comments = this.props.allChats;
        const allComments = (
            <div className="messages-background">
                <div className="messages-container">
                    <div
                        className="messages"
                        ref={chatsContainer => (this.myDiv = chatsContainer)}
                    >
                        {!comments.length && (
                            <h3>
                                Nothing at the moment. Take the first move and
                                start the discussion.
                            </h3>
                        )}

                        {comments.map(user => (
                            <div className="row" key={user.commentid}>
                                <img
                                    src={user.avatarurl || "/default-user.png"}
                                    height={100}
                                    width={100}
                                />
                                <div className="col">
                                    <div className="profile">
                                        {user.firstn} {user.lastn}
                                    </div>
                                    {user.comment}
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
                            id="textfield2"
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

const mapStateToProps = function(state) {
    return {
        allChats: state.topComments
    };
};

export default connect(mapStateToProps)(Chat);
