import { headlineAnimation } from "./main.js";
const mainColumn = document.querySelector( '.main-column' );
const latestHeadlines = document.querySelector( '.latest-headlines' );
const categories = document.querySelector( '.categories' );
const topAuthors = document.querySelector( '.top-authors' );

function createPost ( post ) {
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
      <p class="post-category">${ post.category }</p>
      <p class="post-time">${ date } | ${ time }</p>
      <p class="post-author">${ post.post_author }</p>
     </div>
     <img
      src="${ post.post_image }"
      alt=""
      class="post-image"
     />
     <p class="post-content">${ post.post_content }...<a href="./pages/view-post.html?postID=${ post.id }" class="post-content-readmore"
      >  Read more</a></p>
    </div>
`;

    mainColumn.innerHTML += postContainer;
}

function setHeadlines ( title ) {
    latestHeadlines.innerHTML += `
    <li>${ title }</li>`;
}

const allPosts = [];
const categoriesArray = [];
const authorsArray = [];

// Fetch all posts from the API
await fetch( 'http://localhost:8080/posts' )
    .then( response => response.json() )
    .then( posts => {
        posts.forEach( post => {
            allPosts.push( post );
        } );

        sortAllPosts();
        console.log( allPosts );
        // display all posts
        allPosts.forEach( post => {
            createPost( post );
            setHeadlines( post.post_title );
        } );

        // start headline animation
        getAllCategories();
        setTopAuthors();
        headlineAnimation();

    } )
    .catch( error => {
        throw new Error( 'Error:', error );
    } );


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