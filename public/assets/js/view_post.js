const mainColumn = document.querySelector( '.main-column' );

function createPost ( post ) {
    // separate time and date from created_at
    const date = post.created_at.split( 'T' )[ 0 ];
    const time = post.created_at.split( 'T' )[ 1 ].split( '.' )[ 0 ];
    // limit the post content to 200 characters and add'...' at the end
    const postContent = post.post_content

    // get images and sererate them with a comma if there are more than one
    let image = post.post_image;
    if ( image.includes( ',' ) ) {
        image = image.split( ',' );
    }

    console.log( "images:", image );


    const postContainer = `
<div class="post">
     <a href="./pages/view-post.html?postID=${ post.id }" class="post-title"><h3>${ post.post_title }</h3></a>

     <div class="post-labels">
      <p class="post-category">${ post.category }</p>
      <p class="post-time">${ date } | ${ time }</p>
      <p class="post-author">${ post.post_author }</p>
     </div>

     <div class="post-images">
     ${ Array.isArray( image ) ? image.map( img => `<img src="../${ img }" alt="" class="post-image" />` ).join( '' ) : `<img src="../${ image }" alt="" class="post-image" />` }
     </div>
     
     <p class="post-content">${ postContent }</p>
    </div>
`;

    mainColumn.innerHTML += postContainer;
}

// get postID form the url
const url = new URL( window.location.href );
const postID = url.searchParams.get( 'postID' );
console.log( postID );

fetch( `http://127.0.0.1:8080/posts` )
    .then( ( response ) => response.json() )
    .then( ( data ) => {
        data.forEach( post => {
            if ( post.id == postID ) {
                createPost( post );
                return;
            }
        } );
    } );
