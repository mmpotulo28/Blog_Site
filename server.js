const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
const cors = require( 'cors' );
const port = 8080;

app.use( cors() );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.listen( port, () => {
    console.log( `Server is running on port ${ port }` );
} );

const mysql = require( 'mysql' );
const db = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blogsite'
} );

db.connect( ( err ) => {
    if ( err ) throw err;
    console.log( 'Connected to the database!' );
} );

app.use( express.static( 'public' ) );

// if method is get, fetch all users from the database
app.get( '/users', ( req, res ) => {
    db.query( 'SELECT * FROM Users', ( err, results ) => {
        if ( err ) throw err;
        res.json( results );
    } );
} );

// if method is post, add a new user to the database
app.post( '/users', ( req, res ) => {
    const username = req.body.username;
    const password = req.body.password;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const number = req.body.number;

    // check if the username already exists in the database
    let checks = 0;
    db.query( 'SELECT * FROM Users WHERE username = ?', [ username ], ( err, results ) => {
        if ( err ) throw err;
        if ( results.length > 0 ) {
            checks++;
            console.log( 'Username already exists' );
            res.send( 'Username already exists' );
        }
    } );

    // check if the email already exists in the database
    db.query( 'SELECT * FROM Users WHERE email = ?', [ email ], ( err, results ) => {
        if ( err ) throw err;
        if ( results.length > 0 ) {
            checks++;
            console.log( 'Email already exists' );
            res.send( 'Email already exists' );
        }
    } );

    // check if the number already exists in the database
    db.query( 'SELECT * FROM Users WHERE phoneNumber = ?', [ number ], ( err, results ) => {
        if ( err ) throw err;
        if ( results.length > 0 ) {
            checks++;
            console.log( 'Number already exists' );
            res.send( 'Number already exists' );
        }
    } );

    // if the username, email and number are unique, add the user to the database
    if ( checks == 0 ) {
        db.query( 'INSERT INTO Users (username, password, fullname, email, number) VALUES (?, ?, ?, ?, ?)', [ username, password, fullname, email, number ], ( err, results ) => {
            if ( err ) throw err;
            console.log( 'User added to the database: ', results );
            res.send( 'User added to the database' );
        } );
    }
} );

app.post( '/update-users', ( req, res ) => {
    const id = req.query.userID;
    const username = req.body.username;
    const fullname = req.body.fullname;
    const email = req.body.email;

    db.query( 'UPDATE Users SET username = ?, fullname = ?, email = ? WHERE id = ?', [ username, fullname, email, id ], ( err, results ) => {
        if ( err ) throw err;
        console.log( 'User updated: ', results );
        res.json( { message: 'updated' } );
    } );
} );

app.get( '/posts', ( req, res ) => {
    db.query( 'SELECT * FROM Posts', ( err, results ) => {
        if ( err ) throw err;
        res.json( results );
    } );
} );

// image upload
const multer = require( 'multer' );
const path = require( 'path' );

const storage = multer.diskStorage( {
    destination: './public/assets/images',
    filename: ( req, file, cb ) => {
        cb( null, file.originalname ); // Save with original name
    }
} );

const upload = multer( {
    storage: storage
} ).single( 'image' );

app.post( '/upload', ( req, res ) => {
    upload( req, res, ( err ) => {
        if ( err ) throw err;
        res.send( 'Image uploaded' );
    } );
} );

// create post
app.post( '/create-post', ( req, res ) => {
    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;
    const author = req.body.author;
    const author_id = req.body.author_id;
    const category = req.body.category;

    db.query(
        'INSERT INTO posts (post_title, post_content, post_image, post_author, author_id, category) VALUES (?, ?, ?, ?, ?, ?)',
        [ title, content, image, author, author_id, category ],
        ( err, results ) => {
            if ( err ) throw err;
            console.log( 'Post added to the database: ', results );
            res.send( 'Post added to the database' );
        }
    );
} );

// update post
app.post( '/update-post', ( req, res ) => {
    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;
    const author = req.body.author;
    const postID = req.query.postID;
    const category = req.body.category;

    db.query(
        'UPDATE posts SET post_title = ?, post_content = ?, post_image = ?, post_author = ?, category = ? WHERE id = ?',
        [ title, content, image, author,category, postID ],
        ( err, results ) => {
            if ( err ) throw err;
            console.log( 'Post updated: ', results );
            res.send( 'Post updated' );
        }
    );
} );

// delete post
app.delete( '/delete-post', ( req, res ) => {
    const postID = req.query.postID;

    db.query( 'DELETE FROM posts WHERE id = ?', [ postID ], ( err, results ) => {
        if ( err ) throw err;
        console.log( 'Post deleted: ', results );
        res.send( 'Post deleted' );
    } );
} );