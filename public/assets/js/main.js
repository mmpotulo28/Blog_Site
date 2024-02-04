const latestHeadlines = document.querySelector( '.latest-headlines' );
const loader = document.querySelector( '.loader-pop-up' );
const loaderIcon = document.querySelector( '.loader-pop-up .loader-icon i' );
const categories = document.querySelector( '.categories' );
const topAuthors = document.querySelector( '.top-authors' );
const popularPosts = document.querySelector( '.popular' );

function headlineAnimation () {
    // Get the container element that holds the headlines
    const headlinesContainer = document.querySelector( '.latest-headlines' );
    // Get the headlines inside the container
    const headlines = headlinesContainer.querySelectorAll( 'li' );

    // Calculate the total width of all headlines
    let totalWidth = 0;
    headlines.forEach( headline => {
        totalWidth += headline.offsetWidth;
    } );

    // Set the initial position of the headlines container
    let position = 0;
    headlinesContainer.style.transform = `translateX(${ position }px)`;

    // Define the animation function
    function animateHeadlines () {
        // Move the headlines container to the left
        position -= 1;
        headlines.forEach( headline => {
            headline.style.transform = `translateX(${ position }px)`;
        } );

        // Reset the position if the container has scrolled past the headlines
        if ( position <= -( totalWidth + ( headlinesContainer.offsetLeft ) * 2 ) ) {
            // set position to be the width of the container
            position = headlinesContainer.offsetWidth + headlinesContainer.offsetLeft;
        }

        window.requestAnimationFrame( animateHeadlines );
    }

    animateHeadlines();
}

function setHeadlines ( title ) {
    latestHeadlines.innerHTML += `
    <li>${ title }</li>`;
}

const getPostss = async () => {
    fetch( 'http://localhost:8080/posts' )
        .then( response => response.json() )
        .then( posts => {
            posts.forEach( post => {
                setHeadlines( post.post_title );
            } );

            headlineAnimation();
            getAllCategories( posts );
            setTopAuthors( posts );
            setPopularPosts( posts );
        } )
        .catch( error => {
            throw new Error( 'Error:', error );
        } );
};

document.addEventListener( 'DOMContentLoaded', getPostss );

// getAll post categories
function getAllCategories ( posts ) {
    const categoriesArray = [];

    posts.forEach( post => {
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

function setTopAuthors ( posts ) {
    const authorsArray = [];
    topAuthors.innerHTML = `<h1 class="sec-heading">Top Authors</h1>`;

    posts.forEach( post => {
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

function setPopularPosts ( posts ) {
    popularPosts.innerHTML = `<h1 class="sec-heading">Popular</h1>`;

    posts.forEach( post => {
        popularPosts.innerHTML += `
        <a href="#">${ post.post_title.slice(0, 20) }...</a>
        `;
    } );
}