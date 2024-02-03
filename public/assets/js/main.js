const latestHeadlines = document.querySelector( '.latest-headlines' );

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

fetch( 'http://localhost:8080/posts' )
    .then( response => response.json() )
    .then( posts => {
        posts.forEach( post => {
            setHeadlines( post.post_title );
        } );

        headlineAnimation();
    } )
    .catch( error => {
        throw new Error( 'Error:', error );
    } );
