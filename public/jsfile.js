setTimeout(function() {
    new MetaTraderWebTerminal("webterminal", {
        version: 5,
        server: "MetaQuotes-Demo",
        demoAllServers: true,
        startMode: "login",
        lang: "en",
        colorScheme: "black_on_white"
    });
}, 1000);

//set timeout because it needs to wait until MetaTraderWebTerminal is defined. Otherwise, first page loading doesnt pop the trading window
