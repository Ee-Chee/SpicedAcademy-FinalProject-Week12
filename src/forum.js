import React from "react";
import { connect } from "react-redux";
import { socket } from "./socket";
import Chat from "./chat";

class Forum extends React.Component {
    constructor(props) {
        super(props);
        this.state = { valid: true, addTopic: true };
    }

    componentDidMount() {
        //Dont put it in render()
        socket.on("handleTextError", data => {
            this.setState({
                valid: data.status
            });
        });
    }

    componentWillUnmount() {
        //remove or stop listening when unmounting
        socket.off("handleTextError");
    }

    openUpTextArea() {
        this.setState({ addTopic: false });
        this.setState({ textAreaVisible: true });
    }

    handleInput(e) {
        if (e.which === 13) {
            // console.log(e.target.value);
            var newTitle = e.target.value.trim(); //remove all empty spaces in front or back
            socket.emit("newTitle", newTitle);
            this.setState({ textAreaVisible: false });
            this.setState({ addTopic: true });
            this.setState({
                valid: true
            });
        }
    }

    render() {
        if (!this.props.allTitles) {
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

        const topics = this.props.allTitles;
        const textfield = (
            <div className="textinput-container-forum">
                {this.state.valid ? (
                    <div />
                ) : (
                    <p className="error">
                        Hint: Dont leave blank and up to only 200 characters
                    </p>
                )}
                {this.state.addTopic && (
                    <button onClick={() => this.openUpTextArea()}>
                        <i className="fas fa-plus"> Create a new topic here</i>
                    </button>
                )}
                {this.state.textAreaVisible && (
                    <textarea
                        style={{ resize: "none" }}
                        className="textinput"
                        placeholder="Hit enter to submit"
                        onKeyUp={e => this.handleInput(e)}
                    />
                )}
            </div>
        );
        const allTitles = (
            <div className="content-container">
                <h1>Forum Chamber</h1>
                {topics.map(title => (
                    <div className="row" key={title.id}>
                        <button
                            onClick={() =>
                                this.setState({
                                    chatVisible: true,
                                    topicid: title.id
                                })
                            }
                        >
                            Topic {title.id}:{" "}
                            <strong style={{ color: "#0033cc" }}>
                                {title.title}
                            </strong>
                        </button>
                    </div>
                ))}
                {this.state.chatVisible && (
                    <Chat
                        chatId={this.state.topicid}
                        change={boolean =>
                            this.setState({ chatVisible: boolean })
                        }
                    />
                )}
                {textfield}
            </div>
        );
        return (
            <div className="content-container">
                {!topics.length && (
                    <div>
                        <h3>
                            Create a topic, share your thoughts and feelings
                            here!
                        </h3>
                        {textfield}
                    </div>
                )}
                {!!topics.length && allTitles}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        allTitles: state.forumTopics
    };
};

export default connect(mapStateToProps)(Forum);
