const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
const cors = require( 'cors' );
const port = 3000;

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

app.get( '/users', ( req, res ) => {
    // if method is get, fetch all users from the database
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

app.get( '/users/:id', ( req, res ) => {
    const id = req.params.id;

    db.query( 'SELECT * FROM Users WHERE id = ?', [ id ], ( err, results ) => {
        if ( err ) throw err;
        res.json( results );
    } );
} );

// close the database connection
app.get( '/closecon', ( req, res ) => {
    db.end( ( err ) => {
        if ( err ) throw err;
        console.log( 'Database connection closed!' );
    } );
} );