setTimeout(function() {
    new MetaTraderWebTerminal("webterminal", {
        version: 5,
        server: "MetaQuotes-Demo",
        demoAllServers: true,
        startMode: "open_demo",
        lang: "en",
        colorScheme: "green_on_black"
    });
}, 1000);

//set timeout because it needs to wait until MetaTraderWebTerminal is defined. Otherwise, first page loading doesnt pop the trading window
