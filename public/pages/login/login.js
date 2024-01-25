const registerForm = document.querySelector( '#register-form' );
const loginForm = document.querySelector( '#login-form' );

const credentials = {
    username: 'admin',
    password: 'admin',
};

registerForm.addEventListener( 'submit', ( event ) => {
    event.preventDefault();

    // get all inputs
    const inputs = registerForm.querySelectorAll( 'input' );
    inputs.forEach( ( input ) => {
        validateInput( input );
    } );

    // if there are no errors in the form add information to the database
    // check all error messages if they are empty
    const errorMessages = registerForm.querySelectorAll( '.error-text' );
    let errorCount = 0;
    errorMessages.forEach( ( message ) => {
        if ( message.innerText != '' ) {
            errorCount++;
        }
    } );

    // if there are no errors in the form
    if ( errorCount == 0 ) {
        const newUser = {
            fullname: document.querySelector( '#reg-fullname' ).value,
            username: document.querySelector( '#reg-username' ).value,
            email: document.querySelector( '#reg-email' ).value,
            number: document.querySelector( '#reg-number' ).value,
            password: document.querySelector( '#reg-password' ).value,
        };

        // add data to the database
        fetch( 'http://127.0.0.1:3000/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( newUser ),
        } )
            .then( ( response ) => response.json() )
            .then( ( data ) => {
                alert( 'Success:', data );
                window.location.reload();
            } )
            .catch( ( error ) => {
                console.error( 'Error:', error );
            } );
    }
} );

const validateInput = ( input ) => {
    const inputID = input.getAttribute( 'id' );

    switch ( inputID ) {
        case 'reg-fullname':
            // make sure name is longer than 6 characters
            if ( input.value.length < 3 || input.value.length > 40 ) {
                showError( input, 'Name must be between (6-40) charecters long' );
            } // make sure name contains only letters including spaces
            else if ( !input.value.match( /^[a-zA-Z\s]*$/ ) ) {
                showError( input, 'Name must contain only letters' );
            } else {
                removeError( input );
            }
            break;
        case 'reg-username':
            // make sure username is longer than 3 characters
            if ( input.value.length < 3 || input.value.length > 20 ) {
                showError( input, 'Username must be between (3-20) charecters long' );
            } else {
                removeError( input );
            }
            break;
        case 'reg-email':
            // validate email format
            if ( input.value.match( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ ) ) {
                removeError( input );
            } else {
                showError( input, 'Invalid email format' );
            }
            break;
        case 'reg-number':
            // make sure number meet the south african number format
            if ( !input.value.match( /^(\+27|27|0)[6-8][0-9]{8}$/ ) ) {
                showError( input, 'Invalid south african number' );
            } else {
                removeError( input );
            }
            break;
        case 'reg-password':
            // if password is less than 6 characters and has no number and special character and no uppercase
            if ( input.value.length < 6 || !input.value.match( /[0-9]/g ) || !input.value.match( /[A-Z]/g ) || !input.value.match( /[!@#$%^&*]/g ) ) {
                showError( input, 'Password must be at least 6 characters long and contain at least one number and one special character' );
            } else {
                removeError( input );
            }
            break;
        case 'confirm-pass':
            // if password and confirm password are not the same
            if ( input.value != document.querySelector( '#reg-password' ).value ) {
                showError( input, 'Passwords do not match' );
            } else {
                removeError( input );
            }
            break;
        default:
            break;
    }
};

loginForm.addEventListener( 'submit', ( event ) => {
    event.preventDefault();
    console.log( 'login' );

    // get username and password
    const username = document.querySelector( '#login-username' );
    const password = document.querySelector( '#login-password' );

    // fecth data from the database on /users from API using get method
    fetch( 'http://127.0.0.1:3000/users/', {
        method: 'GET',
    } )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
            // check if username and password match the ones in the database
            data.forEach( ( user ) => {
                if ( username.value == user.username && password.value == user.password ) {
                    console.log( 'Success:', user );
                    // hide all error messages
                    removeError( username );
                    removeError( password );
                    window.location.href = '../user/user-dashboard.html';
                } else {
                    console.log( 'Invalid username or password' );
                    showError( username, 'Invalid username or password' );
                    showError( password, 'Invalid username or password' );
                }
            } );
        } ).catch( ( error ) => {
            console.error( 'Error:', error );
        } );
} );

const showError = ( input, message ) => {
    // get the cloest p tag
    const formControl = input.parentElement;
    const errorMessage = formControl.querySelector( '.error-text' );
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
};

const removeError = ( input ) => {
    const formControl = input.parentElement;
    const errorMessage = formControl.querySelector( '.error-text' );
    errorMessage.innerText = '';
    errorMessage.style.display = 'none';
};
