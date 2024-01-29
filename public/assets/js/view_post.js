const mainColumn = document.querySelector( '.main-column' );

function createPost ( post ) {
    // fix image path
    let image = post.post_image.replace( 'assets', '../assets' );

    // seperate time and date from created_at
    const date = post.created_at.split( 'T' )[ 0 ];
    const time = post.created_at.split( 'T' )[ 1 ].split( '.' )[ 0 ];


    const postContainer = `
<div class="post">
     <a href="./pages/view-post.html?postID=${ post.id }" class="post-title"
      ><h3>${ post.post_title }</h3></a
     >
     <div class="post-labels">
      <p class="post-caregoty">What's Hot</p>
      <p class="post-category">Education</p>
      <p class="post-time">${ date } | ${ time }</p>
      <p class="post-author">${ post.post_author }</p>
     </div>
     <img
      src="${ image }"
      alt=""
      class="post-image"
     />
     <p class="post-content">${ post.post_content }</p>
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
