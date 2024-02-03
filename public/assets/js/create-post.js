// get form
const createPostForm = document.querySelector( '.create-post-form' );
const title = document.querySelector( '#title' );
const content = document.querySelector( '#content' );
const author = document.querySelector( '#author' );
const image = document.querySelector( '#image' );
const category = document.querySelector( '#category' );

// if url has an id, then it's an edit post page
const url = new URL( window.location.href );
const postID = url.searchParams.get( 'postID' );

if ( postID ) {
    fetch( `http://127.0.0.1:8080/posts` )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
            data.forEach( post => {
                if ( post.id == postID ) {
                    title.value = post.post_title;
                    content.value = post.post_content;
                    category.value = post.category;
                    return;
                }
            } );
        } );
}

// add event listener to the form
createPostForm.addEventListener( 'submit', async ( e ) => {
    e.preventDefault();

    const user_id = sessionStorage.getItem( 'user_id' );

    const post = {
        title: title.value.substring( 0, 1 ).toUpperCase() + title.value.substring( 1 ),
        content: content.value.substring( 0, 1 ).toUpperCase() + content.value.substring( 1 ),
        category: category.value.substring( 0, 1 ).toUpperCase() + category.value.substring( 1 ),
        author: '',
        author_id: user_id,
        image: image.value.split( '\\' ).pop().length > 0 ? `./assets/images/${ image.value.split( '\\' ).pop() }` : './assets/images/default.png',
    };

    // get author from users table using the user_id from sessionStorage

    await fetch( `http://127.0.0.1:8080/users` )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
            data.forEach( user => {
                if ( user.id == user_id ) {
                    post.author = user.username;
                    return;
                }
            } );
        } );

    // upload the image to the folder assets/images/
    const formData = new FormData();
    formData.append( 'image', image.files[ 0 ] );
    fetch( 'http://127.0.0.1:8080/upload', {
        method: 'POST',
        body: formData
    } ).then( response => response.text() ).then( data => {
    } ).catch( error => {
        throw new Error( error );
    } );

    // send the post to the server
    sendPost( post );
} );

async function sendPost ( post ) {
    if ( postID ) {
        const response = await fetch( `http://127.0.0.1:8080/update-post?postID=${ postID }`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( post )
        } );
        const data = await response.text();
        // window.location.href = './my-posts.html';
        window.location.reload();
        return;
    } else {
        try {
            const response = await fetch( 'http://127.0.0.1:8080/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( post )
            } );
            const data = await response.text();
            alert( 'Post created successfully, click OK to continue' );
            // redirect to my-posts.html
            window.location.href = './my-posts.html';
        } catch ( error ) {
            alert( 'Could not create post!' );
            throw new Error( error );
        }

    }
};