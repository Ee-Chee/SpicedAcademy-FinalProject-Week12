import React from "react";
export default class Chart extends React.Component {
    render() {
        const script = document.createElement("script");
        script.id = "script1";
        script.type = "text/javascript";
        script.src = "https://trade.mql5.com/trade/widget.js";
        script.async = true;
        document.body.appendChild(script);

        const script2 = document.createElement("script");
        script2.id = "script2";
        script2.type = "text/javascript";
        script2.src = "jsfile.js";
        script2.async = true;
        document.body.appendChild(script2);

        return (
            <div id="webterminal" style={{ width: "100%", height: "600px" }} />
        );
    }
}
