const mainColumn = document.querySelector( '.main-column' );
const loader = document.querySelector( '.loader-pop-up' );
const loaderIcon = document.querySelector( '.loader-pop-up .loader-icon i' );
const commentBox = document.querySelector( '.comment-box' );
const commentForm = document.querySelector( '.comment-form' );
const commentContent = document.querySelector( '.comment-form #comment-content' );

function createPost ( post ) {
    // separate time and date from created_at
    const date = post.created_at.split( 'T' )[ 0 ];
    const time = post.created_at.split( 'T' )[ 1 ].split( '.' )[ 0 ];
    // limit the post content to 200 characters and add'...' at the end
    const postContent = post.post_content;

    // get images and separate them with a comma if there are more than one
    let image = post.post_image;
    if ( image.includes( ',' ) ) {
        image = image.split( ',' );
    }

    let comments = 0;

    if ( post.comment_id.includes( ',' ) ) {
        comments = post.comment_id.split( ',' ).length;
    } else {
        comments = post.comment_id.length;
    }

    const postContainer = `
<div class="post">
     <a href="#" class="post-title"><h3>${ post.post_title }</h3></a>

     <div class="post-labels">
      <p class="post-category">${ post.category }</p>
      <p class="post-time">${ date } | ${ time }</p>
      <p class="post-author">${ post.post_author }</p>
     </div>

     <div class="post-images">
     ${ Array.isArray( image ) ? image.map( img => `<img src="../${ img }" alt="" class="post-image" />` ).join( '' ) : `<img src="../${ image }" alt="" class="post-image" />` }
     </div>
     
     <p class="post-content">${ postContent }</p>

    <div class="post-insights">
        <button id="like-btn"><i class="fas fa-thumbs-up"></i> ${ post.likes }</button>
        <button id="comment-btn"><i class="fas fa-comment"></i> ${ comments }</button>
        <button id="view-btn"><i class="fas fa-eye"></i> ${ post.views }</button>
    </div>
    </div>
`;

    mainColumn.innerHTML += postContainer;
}

// get postID form the url
const url = new URL( window.location.href );
const postID = url.searchParams.get( 'postID' );

const getData = async () => {
    loader.style.display = 'flex';
    await fetch( `http://127.0.0.1:8080/posts` )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
            data.forEach( post => {
                if ( post.id == postID ) {
                    createPost( post );
                    return;
                }
            } );
        } );
    loader.style.display = 'none';
};

document.addEventListener( 'DOMContentLoaded', getData );

// handle liking and commenting button
mainColumn.addEventListener( 'click', ( e ) => {
    if ( e.target.id === 'like-btn' ) {
        likePost( postID, e.target );
    } else if ( e.target.id === 'comment-btn' ) {
        commentOnPost( postID );
    }
} );

async function likePost ( postID, btn ) {
    loader.style.display = 'flex';
    const user_id = sessionStorage.getItem( 'user_id' );
    let likes = parseInt( btn.textContent.trim() );

    // add or remove like
    if ( btn.classList.contains( 'liked' ) ) {
        likes--;
        btn.classList.remove( 'liked' );
    } else {
        likes++;
        btn.classList.add( 'liked' );
    }

    btn.innerHTML = `<i class="fas fa-thumbs-up"></i> ${ likes }`;

    try {
        await fetch( `http://127.0.0.1:8080/like-post?postID=${ postID }&likes=${ likes }`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        } );
    } catch ( error ) {
        throw new Error( 'Error:', error );
    }

    loader.style.display = 'none';
}

// create comment
function commentOnPost ( postID ) {
    commentBox.style.display = 'flex';
}

commentForm.addEventListener( 'submit', async ( e ) => {
    e.preventDefault();
    loader.style.display = 'flex';
    const user_id = sessionStorage.getItem( 'user_id' );
    const comment = commentContent.value;

    await fetch( `http://127.0.0.1:8080/comment-on-post?postID=${ postID }&userID=${ user_id }&comment=${ comment }`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    } ).then( () => {
        commentBox.style.display = 'none';
        commentContent.value = '';
        loader.style.display = 'none';
    } ).catch( ( error ) => {
        loader.style.display = 'none';
        throw new Error( 'Error:', error );
    } );

    loader.style.display = 'none';
} );