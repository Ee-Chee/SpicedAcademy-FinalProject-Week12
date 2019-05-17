import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { valid: true };
        this.inputs = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(e) {
        // console.log("try1", this);
        this.inputs[e.target.name] = e.target.value;
    }

    submit(e) {
        e.preventDefault();
        axios.post("/logging", this.inputs).then(resp => {
            this.setState({ valid: resp.data.status });
            if (resp.data.status === true) {
                location.replace("/welcome");
            }
        });
    }

    render() {
        return (
            <div className="content-container">
                {this.state.valid ? (
                    <div />
                ) : (
                    <div className="error">
                        Invalid inputs! Bro, no hacking activities here please.
                    </div>
                )}
                <form className="col">
                    <input
                        type="text"
                        placeholder="Email Address"
                        name="eM"
                        onChange={this.handleChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="pW"
                        onChange={this.handleChange}
                    />
                    <button onClick={this.submit}>Let&apos;s mess up</button>
                </form>
            </div>
        );
    }
}
