//create connection pooling, to handle sudden burst of traffic
var spicedPg = require("spiced-pg");
//postges:username:password@port/database
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/messaround"
);

exports.addRegister = function(firstName, lastName, email, passW) {
    let q = `INSERT INTO registered (firstN, lastN, email, pw) VALUES ($1, $2, $3, $4) RETURNING * ;`;
    let params = [firstName, lastName, email, passW];
    return db.query(q, params);
};

exports.getLogged = function(email) {
    let q = `SELECT email, pw, id FROM registered WHERE email = $1;`;
    let params = [email];
    return db.query(q, params);
};

exports.getUserInfo = function(id) {
    let q = `SELECT firstN, lastN, id, avatarUrl, bioText FROM registered WHERE id = $1;`;
    let params = [id];
    return db.query(q, params);
};

exports.addImage = function(url, id) {
    let q = `UPDATE registered SET avatarUrl = $1 where id = $2 RETURNING avatarurl ;`;
    let params = [url, id];
    return db.query(q, params);
};

exports.addBio = function(bio, id) {
    let q = `UPDATE registered SET bioText = $1 where id = $2 RETURNING bioText ;`;
    let params = [bio, id];
    return db.query(q, params);
};

//viewer can be sender or recipient. Same goes with owner
exports.getFriendStatus = function(viewer, owner) {
    let q = `SELECT * FROM friends WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1);`;
    let params = [viewer, owner];
    return db.query(q, params);
};

//handle "send Friend Request"
exports.requestFriend = function(viewer, owner) {
    let q = `INSERT INTO friends (sender_id, recipient_id) VALUES ($1, $2) RETURNING * ;`;
    let params = [viewer, owner];
    return db.query(q, params);
};

//handle "Accept Friend Request"
exports.acceptFriend = function(tableId, bool) {
    let q = `UPDATE friends SET accepted = $2 WHERE id = $1 RETURNING * ;`;
    let params = [tableId, bool];
    return db.query(q, params);
};

//handle "Unfriend" or "Cancel Friend Request"
exports.delete = function(tableId) {
    let q = `Delete FROM friends WHERE id = $1; `;
    let params = [tableId];
    return db.query(q, params);
};

exports.getFriends = function(viewer_id) {
    let q = `
        SELECT registered.id, firstN, lastN, avatarUrl, accepted
        FROM friends
        JOIN registered
        ON (accepted IS NULL AND recipient_id = $1 AND sender_id = registered.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = registered.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = registered.id)
    ; `;
    let params = [viewer_id];
    return db.query(q, params);
};
//the registered.id, firstN, lastN, avatarUrl should belong to owners/your friends NOT viewer/current user/yourself
//!!!important when the data is null, dont use equal sign accepted = null is wrong. Instead use IS NULL

//////////////socket IO, do it without axios///////////////
exports.getUsersByIds = function(arrayOfIds) {
    const query = `SELECT id, firstN, lastN, avatarUrl FROM registered WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};
//ANY function loops through the array and match the passed ID. If more than one same id existing, it ignores and takes the very first one it found

exports.addComment = function(com, userid, forumid) {
    let q = `INSERT INTO comments (comment, user_id, forum_id) VALUES ($1, $2, $3) RETURNING comments.id ;`;
    let params = [com, userid, forumid];
    return db.query(q, params);
};

exports.getTop10Comments = function(title_id) {
    let q = `SELECT comment, comments.id AS commentId, firstN, lastN, avatarUrl FROM registered
    JOIN comments ON registered.id = comments.user_id LEFT JOIN forum ON forum.id = comments.forum_id WHERE forum.id = $1 ORDER BY comments.id DESC;`;
    let params = [title_id];
    return db.query(q, params);
};

exports.getComment = function(com_id) {
    let q = `SELECT comment, comments.id AS commentId, firstN, lastN, avatarUrl FROM registered
    JOIN comments ON registered.id = comments.user_id LEFT JOIN forum ON forum.id = comments.forum_id WHERE comments.id = $1;`;
    return db.query(q, [com_id]);
};

exports.getPMs = function(userID, otherID) {
    //registered.id is the sender id (always true)
    let q = `SELECT pm.id AS pm_id, pm, firstN, lastN, avatarUrl FROM registered
    JOIN pm ON (sender_id=$1 AND recipient_id = $2 AND registered.id = $1) OR (sender_id = $2 AND recipient_id = $1 AND registered.id = $2) ORDER BY pm.id DESC LIMIT 20;`;
    let params = [userID, otherID];
    return db.query(q, params);
};

exports.addPM = function(msg, userID, otherID) {
    let q = `INSERT INTO pm (pm, sender_id, recipient_id) VALUES ($1, $2, $3);`;
    let params = [msg, userID, otherID];
    return db.query(q, params);
};

exports.searchFriend = function(char) {
    let q = `SELECT firstN, lastN, id, avatarUrl FROM registered WHERE Lower(firstN) LIKE Lower($1) LIMIT 5;`;
    let params = [char + "%"];
    return db.query(q, params);
    //%sign means all kind characters
};

exports.addForumTitle = function(char) {
    let q = `INSERT INTO forum (title) VALUES ($1) RETURNING * ;`;
    let params = [char];
    return db.query(q, params);
};

exports.getForumTitle = function() {
    let q = `SELECT id, title FROM forum;`;
    return db.query(q);
};

exports.addDrawing = function(url, id) {
    let q = `INSERT INTO canvas (masterpiece, user_id) VALUES ($1, $2);`;
    let params = [url, id];
    return db.query(q, params);
};

exports.getDrawing = function(id) {
    let q = `SELECT id, masterpiece FROM canvas WHERE user_id = $1;`;
    let params = [id];
    return db.query(q, params);
};
//////////////////////////////////////////////////////////

// INSERT INTO comments (comment, user_id) VALUES ('fhsdhkdsuf', 21);
// INSERT INTO comments (comment, user_id) VALUES ('znb nmtrz', 1);
// INSERT INTO comments (comment, user_id) VALUES ('I start the forum first', 1);
// INSERT INTO comments (comment, user_id) VALUES ('dont give up bro', 1);
// INSERT INTO comments (comment, user_id) VALUES ('i hate you', 21);
// INSERT INTO comments (comment, user_id) VALUES ('world', 16);
// INSERT INTO comments (comment, user_id) VALUES ('heelo', 16);
// INSERT INTO comments (comment, user_id) VALUES ('duck', 21);
// INSERT INTO comments (comment, user_id) VALUES ('disco', 1);
// INSERT INTO comments (comment, user_id) VALUES ('chicken', 21);
// INSERT INTO comments (comment, user_id) VALUES ('funky', 16);
// INSERT INTO comments (comment, user_id) VALUES ('fdbgbhgfhnuk', 1);
