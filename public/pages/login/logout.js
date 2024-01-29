const logoutBtnYes = document.getElementById( 'logout-btn-yes' );
const logoutBtnNo = document.getElementById( 'logout-btn-no' );

logoutBtnYes.addEventListener( 'click', () => {
    sessionStorage.removeItem( 'user_id' );
    alert( 'Successfully logged out, Goodbye!' );
    window.location.href = './login.html';
} );

logoutBtnNo.addEventListener( 'click', () => {
    window.location.href = '../user/user-dashboard.html';
} );