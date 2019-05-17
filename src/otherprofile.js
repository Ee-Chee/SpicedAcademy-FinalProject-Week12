import React from "react";
import axios from "./axios";
import Friendship from "./friendship";
import Pm from "./pm";
import { socket } from "./socket";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // console.log(this.props); //when /:X triggered, the props get passed match, location, history properties
        const id = this.props.match.params.idnum;
        axios
            .get("/api/user/" + id)
            .then(resp => {
                ///api/ to prevent user making request directly to server (if server route is /user/:id)
                if (resp.data.redirect) {
                    this.props.history.push("/");
                } else {
                    //else is used to prevent error when redirect back to "/". 0 properties not defined error
                    //location.replace isnt used here because it reloads the page while history.push() doesnt
                    // console.log(resp.data.rows[0]);
                    this.setState({
                        ln: resp.data.rows[0].lastn,
                        fn: resp.data.rows[0].firstn,
                        id: resp.data.rows[0].id,
                        avatarurl: resp.data.rows[0].avatarurl,
                        biodata: resp.data.rows[0].biotext
                    });
                }
            })
            .catch(() => {
                // console.log("here");
                this.props.history.push("/");
                //to handle user types /user/37473687 or /87668hjhbkjbk (out of range)
            });
        socket.emit("getMasterPiece", id);
        socket.on("deployDrawing", arrObj => {
            this.setState({ masterpiece: arrObj });
        });
    }

    componentWillUnmount() {
        //remove or stop listening when unmounting
        socket.off("getMasterPiece");
        socket.off("deployDrawing");
    }

    render() {
        if (!this.state.id || !this.state.masterpiece) {
            // console.log("test");
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
            // console.log("test2", this.state.id, this.state.masterpiece);
            return (
                <div>
                    <div className="content-container-horizontal">
                        <img
                            src={this.state.avatarurl || "/default-user.png"}
                            height={200}
                            width={200}
                        />
                        <div id="profile">
                            <h3>
                                {this.state.fn} {this.state.ln}
                            </h3>
                            {this.state.biodata}
                            <div className="buttons">
                                <button
                                    onClick={() =>
                                        this.setState({ pmVisible: true })
                                    }
                                >
                                    private-chat
                                </button>
                                <Friendship profileOwnerId={this.state.id} />
                            </div>
                            {this.state.pmVisible && (
                                <Pm
                                    profileOwnerId={this.state.id}
                                    change={boolean =>
                                        this.setState({ pmVisible: boolean })
                                    }
                                />
                            )}
                        </div>
                    </div>
                    {this.state.masterpiece.length && (
                        <div className="content-container">
                            <h2>His Masterpieces</h2>
                            <div className="wrap-nicely">
                                {this.state.masterpiece.map(drawing => (
                                    <div
                                        className="friend-center"
                                        key={drawing.id}
                                    >
                                        <img
                                            src={drawing.masterpiece}
                                            height={400}
                                            width={250}
                                            alt="my masterpiece"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    }
}
