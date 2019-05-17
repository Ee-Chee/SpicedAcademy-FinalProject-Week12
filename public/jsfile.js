setTimeout(function() {
    console.log("here");
    new MetaTraderWebTerminal("webterminal", {
        version: 5,
        server: "MetaQuotes-Demo",
        demoAllServers: true,
        startMode: "open_demo",
        lang: "en",
        colorScheme: "green_on_black"
    });
}, 2000);

//set timeout because it needs to wait until MetaTraderWebTerminal is defined. Otherwise, first page loading doesnt pop the trading window
