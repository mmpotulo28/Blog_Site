const loader = document.querySelector( '.loader-pop-up' );
const loaderIcon = document.querySelector( '.loader-pop-up .loader-icon i' );

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
    loader.style.display = 'flex';
    const response = await fetch( `http://127.0.0.1:8080/delete-post?postID=${ postID }`, {
        method: 'DELETE'
    } );
    const data = await response.text();
    loader.style.display = 'none';
    window.location.href = './my-posts.html';
}