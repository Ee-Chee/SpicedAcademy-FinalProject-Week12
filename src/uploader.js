import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { valid: true };
        this.submit = this.submit.bind(this);
        this.filedata;
        this.props.imageUrl;
    }

    submit(e) {
        e.preventDefault();
        // console.log(this.filedata);
        var formData = new FormData();
        formData.append("funky", this.filedata);
        axios
            .post("/upload", formData)
            .then(resp => {
                // console.log("here, ", resp.data[0].avatarurl);
                // if (resp.data.status === false) {
                //     this.setState({ valid: resp.data.status });
                // }
                this.props.handleImage(resp.data[0].avatarurl);
                this.props.change(false);
            })
            .catch(() => {
                this.setState({ valid: false });
            });
    }

    render() {
        return (
            <div className="content-container">
                <h3>Pretty sure you have a nice photo. Update your avatar!</h3>
                {this.state.valid ? (
                    <div />
                ) : (
                    <div className="error">Invalid image! Try again!</div>
                )}
                <form className="col">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            this.filedata = e.target.files[0];
                        }}
                    />
                    <button onClick={this.submit}>Upload!</button>
                    <button
                        onClick={() => {
                            this.props.change(false);
                        }}
                    >
                        close
                    </button>
                </form>
            </div>
        );
    }
}
//onchange event used in input tag
