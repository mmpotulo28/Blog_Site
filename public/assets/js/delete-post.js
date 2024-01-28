// get post id from url
const url = new URL( window.location.href );
const postID = url.searchParams.get( 'postID' );

// get the form element
const deleteYes = document.getElementById( 'post-del-btn-yes' );
const deleteNo = document.getElementById( 'post-del-btn-no' );

// add event listener to the form
deleteYes.addEventListener( 'click', ( e ) => {
    e.preventDefault();
    deletePost();
} );

deleteNo.addEventListener( 'click', ( e ) => {
    e.preventDefault();
    window.location.href = '.my-posts.html';
} );

async function deletePost () {
    const response = await fetch( `http://127.0.0.1:3000/delete-post?postID=${ postID }`, {
        method: 'DELETE'
    } );
    const data = await response.text();
    console.log( data );
    window.location.href = './my-posts.html';
}