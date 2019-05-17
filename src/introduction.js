import React from "react";
import { Link } from "react-router-dom";
import Features from "./features";

export default function Introduction() {
    return (
        <div>
            <div id="banner">
                <div id="middle-text">
                    <div>Welcome and mess around with us.</div>{" "}
                    <p>We teach you how to mess around professionally.</p>
                </div>
            </div>

            <Features />

            <div className="content-container">
                <h1>Get an account now! It&apos;s free!</h1>
                <p>
                    Come join us now as a part of <strong>Messer</strong>! Messi
                    has been part of our members. Lets check it out what he said
                    about <strong>Mess-Around</strong>:
                </p>
                <div id="messi">
                    <img id="messi-img" src="/messi.jpg" />
                    <i
                        className="fas fa-quote-left"
                        style={{ fontSize: "20px" }}
                    />
                    <div className="col">
                        <p>
                            As my name suggests, I really like to mess around
                            with something. Nothing can satisfy me until I found
                            <strong> Mess-Around </strong> as it is truly a
                            great platform for messing-around!
                        </p>
                        <div>
                            So, what&apos;re you waiting for? Get an account and
                            check out my profile now!
                        </div>
                        <i
                            className="fas fa-quote-right"
                            style={{ textAlign: "right", fontSize: "20px" }}
                        />
                    </div>
                </div>
                <Link
                    className="link"
                    to="/registration"
                    style={{ color: "#00e6e6" }}
                >
                    Register @ here
                </Link>
            </div>
            <div className="content-container">
                <img id="bee" src="/bee.svg" />
                <div id="copyright">&copy;Dev-Wanna-Bee</div>
            </div>
        </div>
    );
}
