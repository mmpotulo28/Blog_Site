// animate loader icon
const loader = document.querySelector( '.loader-pop-up' );
const loaderIcon = document.querySelector( '.loader-pop-up .loader-icon i' );

animateLoaderIcon();
function animateLoaderIcon () {
    // get display of loader from css
    const dis = window.getComputedStyle( loader ).display;

    if ( dis === 'flex' ) {
        loaderIcon.classList.add( 'rotateAnimation' );
    } else {
        loaderIcon.classList.remove( 'rotateAnimation' );
    }

    requestAnimationFrame( animateLoaderIcon );
}