import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = { valid: true };
        this.inputs = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(e) {
        this.inputs[e.target.name] = e.target.value;
    }

    submit(e) {
        e.preventDefault();
        axios.post("/register", this.inputs).then(resp => {
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
                    <p className="error">
                        Invalid inputs! No empty strings allowed and email
                        address must be in its standard format: ...@...
                    </p>
                )}
                <form className="col">
                    <input
                        type="text"
                        placeholder="First Name"
                        name="fN"
                        onChange={this.handleChange}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lN"
                        onChange={this.handleChange}
                    />
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
                    <button onClick={this.submit}>Sign Up</button>
                </form>
                <Link className="link" to="/login" style={{ color: "#00e6e6" }}>
                    Already a Messer? Login here.
                </Link>
            </div>
        );
    }
}
