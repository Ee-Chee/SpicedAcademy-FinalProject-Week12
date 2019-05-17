import React from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getFriends, makeUnfriend, makeFriend } from "./actions";
import Friendship from "./friendship";
import { Link } from "react-router-dom";

class Friends extends React.Component {
    componentDidMount() {
        this.props.dispatch(getFriends());
        // this.props.dispatch(getRequestingFriends());
    }
    render() {
        // console.log("CHECK HERE: ", this.props);
        //dont console.log this.props in mounted function, rerender occurs after a short while the data is retrieved
        const currentFriends = this.props.existingFriends;
        const requestingFriends = this.props.requestingFriends;

        if (!currentFriends) {
            return (
                <div className="center">
                    <img
                        src="/circle-loading-gif.gif"
                        height={200}
                        width={200}
                    />
                </div>
            );
        } //to handle undefined data while waiting for axios retrieving data. Otherwise, error prompted for currentFriends.map undefined below
        const myFriends = (
            <div className="content-container extra-margin-top">
                <h2>My added Messers</h2>
                <div className="wrap-nicely">
                    {currentFriends.map(friend => (
                        <div className="friend-center" key={friend.id}>
                            <Link
                                className="friend-link"
                                to={"/user/" + friend.id}
                            >
                                <img
                                    src={
                                        friend.avatarurl || "/default-user.png"
                                    }
                                    height={120}
                                    width={120}
                                />
                                {friend.firstn} {friend.lastn}
                                <Friendship
                                    handleError={true}
                                    profileOwnerId={friend.id}
                                    // change={boolean => {
                                    //     console.log("heresf", boolean);
                                    //     this.forceUpdate();
                                    // }}
                                    makeReduxStateChange={boolean => {
                                        if (boolean) {
                                            this.props.dispatch(
                                                makeUnfriend(friend.id)
                                            );
                                        }
                                    }}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
        //////////////////////////////////////////////////////////////////////////////////////
        const friendRequesters = (
            <div className="content-container">
                <h2>These people wanna mess-around together with you</h2>
                <div className="wrap-nicely">
                    {requestingFriends.map(friend => (
                        <div className="friend-center" key={friend.id}>
                            <Link
                                className="friend-link"
                                to={"/user/" + friend.id}
                            >
                                <img
                                    src={
                                        friend.avatarurl || "/default-user.png"
                                    }
                                    height={120}
                                    width={120}
                                />
                                {friend.firstn} {friend.lastn}
                                <Friendship
                                    handleError={true}
                                    profileOwnerId={friend.id}
                                    // change={boolean => {
                                    //     console.log("heresf", boolean);
                                    //     this.forceUpdate();
                                    // }}
                                    makeReduxStateChange={boolean => {
                                        if (boolean) {
                                            this.props.dispatch(
                                                makeFriend(friend.id)
                                            );
                                        }
                                    }}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
        return (
            <div className="content-container">
                {!currentFriends.length && (
                    <div>
                        <h3>
                            You have nobody to mess-around with. You might want
                            to check out other Messers&apos; profile.
                        </h3>
                        <Link className="center nemo-button" to="/online">
                            <button>Finding Nemo</button>
                        </Link>
                    </div>
                )}
                {!!currentFriends.length && myFriends}
                {!requestingFriends.length && (
                    <h3>You have no friend-requesters at the moment.</h3>
                )}
                {!!requestingFriends.length && friendRequesters}
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        existingFriends:
            state.allKnownFriends &&
            state.allKnownFriends.filter(friend => friend.accepted),
        //it wouldnt rerender when you unfriend one of your friend because Frienship is a child component here. No state changes on this current page/js file
        //forceUpdate() is used for rerendering without any state change. But it is not working here because axios is in mounted function.
        //Rerendering doesnt make mounted function runs.Hence the updated data (ie. accepted = false) isnt fetched. It remains "true" while forced rerendering
        //Solution: passing a boolean from friendship component(child) to friend(parent) to trigger the makeUnfriend action. And this will update redux state and rerender again
        requestingFriends:
            state.allKnownFriends &&
            state.allKnownFriends.filter(friend => friend.accepted === null)
        //null is important here. If user accepts the friend request, the profile goes to "added friends" and if user unfriends further, the profile should disappear.
        //To make the profile gone, !friend.accepted doesnt work because it triggers when !null, !false, !undefined. I make reducer returns false when it happens so that state-change doesnt happen.
    };
};

//Provider passes store (with states info) to connect(). Connect() connects both side and changes the states info to props and pass props to Friends components
export default connect(mapStateToProps)(Friends);
