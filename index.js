const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const dB = require("./utilities/db");
const bct = require("./utilities/bcrypt");
//////////////////////////////////////upload image to Amazon s3 cloud
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const cf = require("./config.json");
////////////////////////////////////////socket IO
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8082 m-around.herokuapp.com:*"
});
////////////////////////////////////////////////////

app.use(compression()); //compress size of the file making it downloaded faster on the browser

////////////////////////////////////////////
const cookieSessionMiddleware = cookieSession({
    secret: `I'm wondering...`,
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware); //for http express use

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
///////////////////////////////////////////
app.use(require("body-parser").json()); //for post! body-parser shld come after cookieSession

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("./public")); //store css and etc

//////////////////////heroku
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
//////////////////////////////

app.post("/register", (req, res) => {
    console.log(req.body);
    bct.hashPassword(req.body.pW)
        .then(hashedPW => {
            return dB
                .addRegister(req.body.fN, req.body.lN, req.body.eM, hashedPW)
                .then(data => {
                    // console.log(data.rows[0].id);
                    req.session.userId = data.rows[0].id;
                    res.json({ status: true });
                });
        })
        .catch(err => {
            console.log("Error caught: ", err);
            res.json({ status: false });
        });
});

app.post("/logging", (req, res) => {
    // console.log(req.body);
    dB.getLogged(req.body.eM)
        .then(data => {
            return bct
                .checkPassword(req.body.pW, data.rows[0].pw)
                .then(correctPW => {
                    if (correctPW) {
                        req.session.userId = data.rows[0].id;
                        // console.log(req.session.userId);
                        res.json({ status: true });
                    } else {
                        // console.log("im here");
                        res.json({ status: false });
                    }
                });
        })
        .catch(() => {
            // console.log("Error caught: ", err);
            res.json({ status: false });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("/user", async (req, res) => {
    // console.log(req.session.userId);
    try {
        const data = await dB.getUserInfo(req.session.userId);
        // console.log("here again: ", data.rows[0]);
        res.json(data.rows[0]);
    } catch (err) {
        console.log("Err caught here: ", err);
    }
});

////////////////////////////////uploading avatar img
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/upload", uploader.single("funky"), s3.upload, (req, res) => {
    // console.log(req.file); //an object that multer added to the req
    // console.log(req.body); //show nothing but there is img inside
    const url = cf.s3Url + req.file.filename;
    dB.addImage(url, req.session.userId)
        .then(data => {
            // console.log(data.rows);
            res.json(data.rows);
        })
        .catch(err => {
            console.log("Err caughttt: ", err);
            res.json({ status: false });
        });
});
///////////////////////////////////////////////////

app.post("/bioinput", async (req, res) => {
    // console.log(req.body);
    try {
        const data = await dB.addBio(req.body.bio, req.session.userId);
        res.json(data);
    } catch (err) {
        console.log("Err caught: ", err);
        res.json({ status: false });
    }
});

app.get("/api/user/:id", async (req, res) => {
    if (req.params.id == req.session.userId) {
        return res.json({
            redirect: true
        });
    } //redirect user to their own profile page if they trying to access their page by typing user:(their id) on url
    //return res.json. 'return is essential here to end the function. Otherwise try...catch will run and an error is caught on server'
    try {
        const data = await dB.getUserInfo(req.params.id);
        res.json(data);
    } catch (err) {
        res.json({ redirect: true });
    } //user input /user/njasnkjfndjkfnjkd
});
// //////////////////////////////////////////////handle friendship status
app.get("/friendship/:id", async (req, res) => {
    // console.log(req.session.userId); //viewer
    // console.log(req.params.id); //owner
    try {
        const data = await dB.getFriendStatus(
            req.session.userId,
            req.params.id
        );
        // console.log(data.rows[0]);
        res.json(data.rows[0]);
    } catch (err) {
        console.log("Err caught: ", err);
    }
});

app.post("/handleFriendshipStatus", async (req, res) => {
    // console.log(req.body);
    if (!req.body.trigger) {
        //empty body of trigger => no corresponding id => no data found in friends table
        try {
            const data = await dB.requestFriend(
                req.session.userId,
                req.body.profileownerid
            );
            // console.log(data.rows[0]);
            res.json(data.rows[0]);
        } catch (err) {
            console.log("Err caught: ", err);
        }
    }
    if (req.session.userId === req.body.trigger) {
        try {
            const data = await dB.acceptFriend(req.body.tableid, true);
            res.json(data.rows[0]);
        } catch (err) {
            console.log("Err caught: ", err);
        }
    } else if (req.body.trigger) {
        // console.log("hereeeeee delete");
        try {
            await dB.delete(req.body.trigger);
            res.json({ status: "deleted" });
        } catch (err) {
            console.log("Err caught: ", err);
        }
    }
});

app.get("/api/friends", async (req, res) => {
    // console.log(req.session.userId); //viewer
    // console.log(req.params.id); //owner
    try {
        const data = await dB.getFriends(req.session.userId);
        // console.log(data.rows);
        res.json(data.rows);
    } catch (err) {
        console.log("Err caught: ", err);
    }
});

/////////////////////////////////////Private Messages (NEW!!!!!)
//not using socket because we need pass specific id of the selected chat person.
//socket is used when it is dealing with general data
app.get("/privatemessage/:id", async (req, res) => {
    // console.log(req.session.userId);
    // console.log(req.params.id);
    try {
        const data = await dB.getPMs(req.session.userId, req.params.id);
        // console.log(data.rows);
        res.json(data.rows);
    } catch (err) {
        console.log("Err caught: ", err);
    }
});

app.post("/privatemessage", async (req, res) => {
    // console.log(req.body);
    try {
        await dB.addPM(
            req.body.msg,
            req.session.userId,
            req.body.profileownerid
        );
        const data = await dB.getPMs(
            req.session.userId,
            req.body.profileownerid
        );
        // console.log(data.rows);
        res.json(data.rows);
    } catch (err) {
        console.log("Err caught: ", err);
        res.json({ status: false });
    }
});

app.post("/search", async (req, res) => {
    // console.log(req.body);
    try {
        const data = await dB.searchFriend(req.body.char);
        // console.log(data.rows);
        res.json(data.rows);
    } catch (err) {
        console.log("Err caught: ", err);
        res.json({ status: false });
    }
});
// ///////////////////////////checking log-in status
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        // console.log("Im heree");
        res.redirect("/");
    } else {
        // console.log(2);
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", (req, res) => {
    if (!req.session.userId) {
        // console.log(1);
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
///////////////////////////////////////////////////////

server.listen(process.env.PORT || 8082, function() {
    console.log("I'm your final-project server, sir!");
});

////////////////////////////////////////////socket section///////////////////////////////////////////////////////////
let onlineUsers = {};
io.on("connection", socket => {
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    let listBeforeUpdate = Object.assign({}, onlineUsers);
    let newSocketUser = true;
    const userId = socket.request.session.userId;
    onlineUsers[socket.id] = userId;
    // console.log(`socketId: ${socket.id} is now connected`, userId, onlineUsers);
    ////////////////////////////////////////////////////whenever a new socket connection established(Be it the same user(open new page/reload) or different), get online-users data
    dB.getUsersByIds(Object.values(onlineUsers)).then(data => {
        // console.log(data.rows); //an array of objects. ANY function from query helps to filter out all same IDs of data. Data.rows is pure data now.
        let temp = data.rows.filter(user => user.id != userId); //filter out the current socket-connecting user
        socket.emit("onlineUsers", temp);
    });
    //////////////////////////////////////////////broadcast to others if this socket user is new, to rerender the page of other socket users
    for (let socketID in listBeforeUpdate) {
        if (listBeforeUpdate[socketID] === userId) {
            newSocketUser = false;
        }
    }

    if (newSocketUser) {
        dB.getUsersByIds(Object.values(onlineUsers)).then(data => {
            let temp = data.rows.filter(user => user.id == userId);
            io.sockets.sockets[socket.id].broadcast.emit("userJoined", temp);
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    socket.on("disconnect", () => {
        // console.log(`Disconnected: ${socket.id}`, userId);
        delete onlineUsers[socket.id];
        // console.log(onlineUsers);
        // console.log(userId);
        // console.log(Object.values(onlineUsers).includes(1));
        if (!Object.values(onlineUsers).includes(userId)) {
            io.sockets.emit("userLeft", userId);
        }
        // If there is user opening two pages or more and he shuts down one page, it shldnt remove his profile
    });
    //disconnect is predefined event. It is triggered whenever the client loses socket connection
    //refresh the page has the same effect as open in the new page and then close it.

    ///////////////////////////////////////////////////////////////////////////////////////////Forum
    dB.getForumTitle().then(data => {
        socket.emit("titles", data.rows);
    });

    socket.on("newTitle", async data => {
        // console.log(data);
        try {
            await dB.addForumTitle(data);
            const data2 = await dB.getForumTitle();
            // console.log(data2.rows);
            io.sockets.emit("titles", data2.rows);
        } catch (err) {
            //socket.emit("error", {}); //"error" is reserved. Dont use "error", this name
            socket.emit("handleTextError", { status: false });
        }
    });

    socket.on("getChatMessages", data => {
        // console.log("log", data);
        dB.getTop10Comments(data).then(data2 => {
            socket.emit("top10comments", data2.rows);
        });
    });

    socket.on("newChatMessage", data => {
        // console.log(data, userId);
        dB.addComment(data.msg, userId, data.forumId)
            .then(data => {
                // console.log(data.rows); //returns comment id
                dB.getComment(data.rows[0].id).then(data => {
                    // console.log("here: ", data.rows);
                    io.sockets.emit("chatMessageForRedux", data.rows); //socket.broadcast.emit and io.sockets.sockets[socket.id].broad... same thing, but io is used to send all
                });
            })
            .catch(() => {
                socket.emit("handleChatError", { status: false });
            });
    });
    ///////////////////////////////////////////////////////////////////private message
    socket.on("newPrivateMessage", data => {
        // console.log("here:", data);
        for (let socketID in onlineUsers) {
            if (onlineUsers[socketID] === data.other_id) {
                // console.log("success: ", socketID)
                io.sockets.sockets[socketID].emit("updatePM", {
                    newPM: data.newPM,
                    whoSentIt: userId
                });
            }
        }
    });
    //////////////////////////////////////////////////////////////snowman game test/////////////////////////////////////////////////
    socket.on("reset", () => {
        io.sockets.emit("refresh");
    });

    socket.on("saved", async data => {
        // console.log(userId, data);
        try {
            await dB.addDrawing(data, userId);
        } catch (e) {
            //default drawing is there, so there will be no error
            console.log(e);
        }
    });

    socket.on("getMasterPiece", async data => {
        try {
            const data2 = await dB.getDrawing(data);
            // console.log(data2);
            socket.emit("deployDrawing", data2.rows);
        } catch (e) {
            console.log(e);
        }
    });

    socket.on("snowmanMouseUp", data => {
        socket.broadcast.emit("moving", data);
    });

    socket.on("snowmanMouseDown", data => {
        socket.broadcast.emit("startingPoint", data);
    });

    socket.on("snowmanMouseMove", data => {
        // console.log(data);
        if (data[1]) {
            socket.broadcast.emit("moving", data);
        }
    });
});
