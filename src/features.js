import React from "react";

export default function Features() {
    return (
        <div className="content-container">
            <h1>
                So what&apos;s cool about <strong>Mess-Around</strong>?{" "}
            </h1>
            <div className="column">
                <div className="features-container">
                    <i className="fas fa-chart-line icon" />
                    Real-time FOREX market analysis
                </div>
                <div className="features-container">
                    <i className="fas fa-money-check-alt icon" />
                    Free demo Mess-Around account
                </div>
                <div className="features-container">
                    <i className="fas fa-address-card icon" />
                    Portfolio management
                </div>
                <div className="features-container">
                    <i className="fas fa-user-plus icon" />
                    Finding Nemo
                </div>
                <div className="features-container">
                    <i className="fab fa-forumbee icon" />
                    Forex Forum
                </div>
                <div className="features-container">
                    <i className="fab fa-react icon" />
                    React Mess-Around
                </div>
            </div>
        </div>
    );
}
