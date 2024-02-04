const mainColumn = document.querySelector( '.main-column' );
const categories = document.querySelector( '.categories' );
const topAuthors = document.querySelector( '.top-authors' );
const loader = document.querySelector( '.loader-pop-up' );
const loaderIcon = document.querySelector( '.loader-pop-up .loader-icon i' );

function createPost ( post ) {
    // separate time and date from created_at
    const date = post.created_at.split( 'T' )[ 0 ];
    const time = post.created_at.split( 'T' )[ 1 ].split( '.' )[ 0 ];
    // limit the post content to 200 characters and add'...' at the end
    const postContent = post.post_content.slice( 0, 200 ) + '...';

    // get images and sererate them with a comma if there are more than one
    let image = post.post_image;
    if ( image.includes( ',' ) ) {
        image = image.split( ',' );
    }

    console.log("images:", image)


    const postContainer = `
<div class="post">
     <a href="./pages/view-post.html?postID=${ post.id }" class="post-title"><h3>${ post.post_title }</h3></a>

     <div class="post-labels">
      <p class="post-category">${ post.category }</p>
      <p class="post-time">${ date } | ${ time }</p>
      <p class="post-author">${ post.post_author }</p>
     </div>

     <div class="post-images">
     ${ Array.isArray( image ) ? image.map( img => `<img src="${ img }" alt="" class="post-image" />` ).join( '' ) : `<img src="${ image }" alt="" class="post-image" />` }
     </div>
     
     <p class="post-content">${ postContent } <a href="./pages/view-post.html?postID=${ post.id }" class="post-content-readmore"
      >  Read more</a></p>
    </div>
`;

    mainColumn.innerHTML += postContainer;
}

let allPosts = [];
let categoriesArray = [];
let authorsArray = [];

// Fetch all posts from the API
const getPosts = async () => {
    loader.style.display = 'flex';
    await fetch( 'http://localhost:8080/posts' )
        .then( response => response.json() )
        .then( posts => {
            posts.forEach( post => {
                allPosts.push( post );
            } );

            sortAllPosts();
            // display all posts
            allPosts.forEach( post => {
                createPost( post );
            } );

            // start headline animation
            categoriesArray = getAllCategories();
            setTopAuthors();
        } )
        .catch( error => {
            throw new Error( 'Error:', error );
        } );
    
    loader.style.display = 'none';
};

document.addEventListener( 'DOMContentLoaded', getPosts );

// sort all post
function sortAllPosts () {
    allPosts.sort( ( a, b ) => {
        const dateA = new Date( a.created_at );
        const dateB = new Date( b.created_at );
        return dateB - dateA;
    } );
}

// getAll post categories
function getAllCategories () {
    allPosts.forEach( post => {
        if ( !categoriesArray.includes( post.category ) ) {
            categoriesArray.push( post.category );
        }
    } );

    categories.innerHTML = '<h1 class="sec-heading">Category</h1>';

    categoriesArray.forEach( category => {
        categories.innerHTML += `
        <a href="#">${ category }</a>
        `;
    } );

    return categoriesArray;
}

function setTopAuthors () {
    topAuthors.innerHTML = `<h1 class="sec-heading">Top Authors</h1>`;

    allPosts.forEach( post => {
        if ( !authorsArray.includes( post.post_author ) ) {
            authorsArray.push( post.post_author );
        }
    } );

    authorsArray.forEach( author => {
        topAuthors.innerHTML += `
        <a href="#">${ author }</a>
        `;
    } );
}