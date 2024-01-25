const mainColumn = document.querySelector( '.main-column' );

function createPost ( post ) {
    const postContainer = `
<div class="post">
     <a href="./pages/view-post.html?postID=1" class="post-title"
      ><h3>${ post.post_title }</h3></a
     >
     <div class="post-labels">
      <p class="post-caregoty">What's Hot</p>
      <p class="post-category">Education</p>
      <p class="post-time">14/01/2024 | 13:02</p>
      <p class="post-author">${post.post_author}</p>
     </div>
     <img
      src="${ post.post_image }"
      alt=""
      class="post-image"
     />
     <p class="post-content">${ post.post_content }</p>
    </div>
`;

    mainColumn.innerHTML += postContainer;
}

// Fetch all posts from the API
fetch( 'http://127.0.0.1:3000/posts' )
    .then( response => response.json() )
    .then( posts => {
        posts.forEach( post => {
            createPost( post );
        } );
    } )
    .catch( error => {
        throw new Error( 'Error:', error );
    } );
