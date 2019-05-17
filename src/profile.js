import React from "react";
import Friends from "./friends";
// import Avatar from "./avatar"; //not necessarry if we're using the short-cut approach here, i.e. passing the whole component in props.
import { socket } from "./socket";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        socket.emit("getMasterPiece", this.props.userId);
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
        if (!this.state.masterpiece) {
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
        return (
            <div>
                <div className="content-container-horizontal">
                    {this.props.profilePic}
                    <div id="profile">
                        <div>
                            {this.props.firstN} {this.props.lastN}
                        </div>
                        {this.props.bio}
                    </div>
                </div>
                {this.state.masterpiece.length && (
                    <div className="content-container">
                        <h2>My Masterpieces</h2>
                        <div className="wrap-nicely">
                            {this.state.masterpiece.map(drawing => (
                                <div className="friend-center" key={drawing.id}>
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
                <Friends />
            </div>
        );
    }
}
