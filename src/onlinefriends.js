//finding nemo
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "./axios";

class OnlineFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = { searchResults: [] };
    }

    handleInput(e) {
        // console.log(e.target.value);
        axios.post("/search", { char: e.target.value }).then(resp => {
            if (resp.data.length === 0) {
                this.setState({ emptyArr: true });
                this.setState({ searchDisplay: false });
            } else {
                this.setState({ emptyArr: false });
                // console.log("return", resp.data);
                this.setState({ searchDisplay: true });
                this.setState({ searchResults: resp.data });
            }
        });
    }

    render() {
        const onlineUsers = this.props.allOnlineFriends;
        if (!onlineUsers) {
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
        const allOnlineUsers = (
            <div className="content-container">
                <input
                    placeholder="search for a Messer here..."
                    onChange={e => this.handleInput(e)}
                />
                {this.state.emptyArr && (
                    <div className="error text">Opps...no results found</div>
                )}
                {this.state.searchDisplay && (
                    <div className="wrap-nicely">
                        {this.state.searchResults.map(user => (
                            <div className="friend-center" key={user.id}>
                                <Link
                                    className="friend-link"
                                    to={"/user/" + user.id}
                                >
                                    <img
                                        src={
                                            user.avatarurl ||
                                            "/default-user.png"
                                        }
                                        height={120}
                                        width={120}
                                    />
                                    <div style={{ color: "#00e6e6" }}>
                                        {user.firstn} {user.lastn}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
                <h1>All online Messers</h1>
                <div className="wrap-nicely">
                    {onlineUsers.map(user => (
                        <div className="friend-center" key={user.id}>
                            <Link
                                className="friend-link"
                                to={"/user/" + user.id}
                            >
                                <img
                                    src={user.avatarurl || "/default-user.png"}
                                    height={120}
                                    width={120}
                                />
                                <div style={{ color: "#00e6e6" }}>
                                    {user.firstn} {user.lastn}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );

        return (
            <div className="content-container">
                {!onlineUsers.length && (
                    <div>
                        <input
                            placeholder="search for a Messer here..."
                            onChange={e => this.handleInput(e)}
                        />
                        {this.state.emptyArr && (
                            <div className="error text">
                                Opps...no results found
                            </div>
                        )}
                        {this.state.searchDisplay && (
                            <div className="wrap-nicely">
                                {this.state.searchResults.map(user => (
                                    <div
                                        className="friend-center"
                                        key={user.id}
                                    >
                                        <Link
                                            className="friend-link"
                                            to={"/user/" + user.id}
                                        >
                                            <img
                                                src={
                                                    user.avatarurl ||
                                                    "/default-user.png"
                                                }
                                                height={120}
                                                width={120}
                                            />
                                            <div style={{ color: "#00e6e6" }}>
                                                {user.firstn} {user.lastn}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                        <h3>
                            Congratulations you are the only one online! This is
                            unusual, hurry, take a photo of it :D
                        </h3>
                    </div>
                )}
                {!!onlineUsers.length && allOnlineUsers}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        allOnlineFriends: state.allOnlineFriends
        // && state.allOnlineFriends.filter(user => user.id == )
    };
};

export default connect(mapStateToProps)(OnlineFriends);
