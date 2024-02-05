const express = require( 'express' );
const { json, urlencoded } = require( 'body-parser' );
const app = express();
const cors = require( 'cors' );
const port = 8080;

app.use( cors() );
app.use( urlencoded( { extended: true } ) );
app.use( json() );

app.listen( port, () => {
    console.log( `Server is running on port ${ port }` );
} );

const sql = require( 'mssql' );

const config = {
    user: 'blogsite_asmin',
    password: 'Manelisi@22',
    server: "mysqlblogserver.database.windows.net",
    database: 'flaze_blog',
    port: 1433,
    options: {
        encrypt: true
    }
};

sql.connect( config, function ( err ) {
    if ( err ) throw new Error( err );
    console.log( 'Connected to the database' );

} );

app.use( express.static( 'public' ) );

// if method is get, fetch all users from the database
app.get( '/users', ( req, res ) => {
    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.query( 'SELECT * FROM Users' ).then( ( result ) => {
            res.json( result.recordset );
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool.close();
        } );
    } ).catch( ( err ) => {
        throw err;
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
    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.query( 'SELECT * FROM Users WHERE username = ?', [ username ] ).then( ( result ) => {
            if ( result.recordset.length > 0 ) {
                checks++;
                console.log( 'Username already exists' );
                res.send( 'Username already exists' );
            }
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool.close();
        } );
    } ).catch( ( err ) => {
        throw err;
    } );

    // check if the email already exists in the database
    const pool2 = new sql.ConnectionPool( config );
    pool2.connect().then( () => {
        const request = new sql.Request( pool2 );
        request.query( 'SELECT * FROM Users WHERE email = ?', [ email ] ).then( ( result ) => {
            if ( result.recordset.length > 0 ) {
                checks++;
                console.log( 'Email already exists' );
                res.send( 'Email already exists' );
            }
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool2.close();
        } );
    } ).catch( ( err ) => {
        throw err;
    } );

    // check if the number already exists in the database
    const pool3 = new sql.ConnectionPool( config );
    pool3.connect().then( () => {
        const request = new sql.Request( pool3 );
        request.query( 'SELECT * FROM Users WHERE phoneNumber = ?', [ number ] ).then( ( result ) => {
            if ( result.recordset.length > 0 ) {
                checks++;
                console.log( 'Number already exists' );
                res.send( 'Number already exists' );
            }
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool3.close();
        } );
    } ).catch( ( err ) => {
        throw err;
    } );

    // if the username, email and number are unique, add the user to the database
    if ( checks == 0 ) {
        const pool4 = new sql.ConnectionPool( config );
        pool4.connect().then( () => {
            const request = new sql.Request( pool4 );
            request.query( 'INSERT INTO Users (username, password, fullname, email, number) VALUES (?, ?, ?, ?, ?)', [ username, password, fullname, email, number ] ).then( ( result ) => {
                console.log( 'User added to the database: ', result );
                res.send( 'User added to the database' );
            } ).catch( ( err ) => {
                throw err;
            } ).finally( () => {
                pool4.close();
            } );
        } ).catch( ( err ) => {
            throw err;
        } );
    }
} );

app.post( '/update-users', ( req, res ) => {
    const id = req.query.userID;
    const username = req.body.username;
    const fullname = req.body.fullname;
    const email = req.body.email;

    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.query( 'UPDATE Users SET username = ?, fullname = ?, email = ? WHERE id = ?', [ username, fullname, email, id ] ).then( ( result ) => {
            console.log( 'User updated: ', result );
            res.json( { message: 'updated' } );
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool.close();
        } );
    } ).catch( ( err ) => {
        throw err;
    } );
} );

app.get( '/posts', ( req, res ) => {
    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.query( 'SELECT * FROM Posts' ).then( ( result ) => {
            res.json( result.recordset );
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool.close();
        } );
    } ).catch( ( err ) => {
        throw err;
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
} ).array( 'images', 10 ); // Allow up to 10 images to be uploaded

app.post( '/upload', ( req, res ) => {
    upload( req, res, ( err ) => {
        if ( err ) throw err;
        const images = req.files.map( file => file.originalname ).join( ',' ); // Get the original names of the uploaded files and join them with a comma
        res.send( 'Images uploaded', images );
        // Insert the images into the database here
    } );
} );

// create post
app.post( '/create-post', ( req, res ) => {
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;
    const author_id = req.body.author_id;
    const category = req.body.category;
    const images = req.body.images;

    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.query( 'INSERT INTO posts (post_title, post_content, post_image, post_author, author_id, category) VALUES (?, ?, ?, ?, ?, ?)', [ title, content, images, author, author_id, category ] ).then( ( result ) => {
            console.log( 'Post added to the database: ', result );
            res.send( 'Post added to the database' );
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool.close();
        } );
    } ).catch( ( err ) => {
        throw err;
    } );
} );

// update post
app.post( '/update-post', ( req, res ) => {
    const title = req.body.title;
    const content = req.body.content;
    const images = req.body.images;
    const author = req.body.author;
    const postID = req.query.postID;
    const category = req.body.category;

    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.query( 'UPDATE posts SET post_title = ?, post_content = ?, post_image = ?, post_author = ?, category = ? WHERE id = ?', [ title, content, images, author, category, postID ] ).then( ( result ) => {
            console.log( 'Post updated: ', result );
            res.send( 'Post updated' );
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool.close();
        } );
    } ).catch( ( err ) => {
        throw err;
    } );
} );

// delete post
app.delete( '/delete-post', ( req, res ) => {
    const postID = req.query.postID;

    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.query( 'DELETE FROM posts WHERE id = ?', [ postID ] ).then( ( result ) => {
            console.log( 'Post deleted: ', result );
            res.send( 'Post deleted' );
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool.close();
        } );
    } ).catch( ( err ) => {
        throw err;
    } );
} );

// like post
app.put( '/like-post', ( req, res ) => {
    const postID = req.query.postID;
    const likes = parseInt( req.query.likes );

    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.input( 'likes', sql.Int, likes ); // Declare the scalar variable
        request.input( 'postID', sql.Int, postID ); // Declare the scalar variable
        request.query( 'UPDATE posts SET likes = @likes WHERE id = @postID' ).then( ( result ) => {
            console.log( 'Likes updated: ', result );
            res.send( 'Likes updated' );
        } ).catch( ( err ) => {
            throw err;
        } ).finally( () => {
            pool.close();
        } );
    } ).catch( ( err ) => {
        throw err;
    } );
} );

// comment on post
app.post( '/comment-on-post', ( req, res ) => {
    const postID = req.query.postID;
    const authorID = req.query.userID;
    const comment = req.query.comment;
    let commentID = 0;

    const pool = new sql.ConnectionPool( config );
    pool.connect().then( () => {
        const request = new sql.Request( pool );
        request.input( 'comment', sql.VarChar, comment ); // Declare the scalar variable
        request.input( 'postID', sql.Int, postID ); // Declare the scalar variable
        request.input( 'authorID', sql.Int, authorID ); // Declare the scalar variable

        request.query( 'INSERT INTO comments (comment, post_id, author_id) VALUES (@comment, @postID, @authorID)' )
            .then( ( result ) => {
                console.log( 'Comment added to the database: ', result );
                // set comment ID
                commentID = result.insertId;

                const request = new sql.Request( pool );
                request.input( 'commentID', sql.Int, commentID ); // Declare the scalar variable
                request.input( 'postID', sql.Int, postID ); // Declare the scalar variable

                request.query( 'UPDATE posts SET comment_id = @commentID WHERE id = @postID' )
                    .then( ( result ) => {
                        console.log( 'Comments updated: ', result );
                        console.log('comment ID: ', commentID);
                        res.send( 'Comments updated' );
                    } )
                    .finally( () => {
                        pool.close();
                    } )
                    .catch( ( err ) => {
                        throw err;
                    } );
            } )
            .catch( ( err ) => {
                throw err;
            } );
    } ).catch( ( err ) => {
        throw err;
    } );
} );
