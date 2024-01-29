// check if user is logged in
const user_id = sessionStorage.getItem( 'user_id' );
if ( !user_id ) {
    window.location.href = '../login/login.html';
}