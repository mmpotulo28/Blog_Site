// check if user is logged in
const user_id = sessionStorage.getItem( 'user_id' );
if ( !user_id ) {
    window.location.href = '../login/login.html';
}

// get all elements
const name = document.querySelector( '#name' );
const surname = document.querySelector( '#surname' );
const username = document.querySelector( '#username' );
const email = document.querySelector( '#email' );
const userProfileForm = document.querySelector( '.user-profile-form' );

// update user profile
userProfileForm.addEventListener( 'submit', ( event ) => {
    event.preventDefault();

    // get form values
    const userProfile = {
        name: name.value,
        surname: surname.value,
        username: username.value,
        email: email.value,
    };

    // validate form values
    const inputs = userProfileForm.querySelectorAll( 'input' );
    inputs.forEach( ( input ) => {
        validateInput( input );
    } );

    // if there are no errors
    const errorMessages = userProfileForm.querySelectorAll( '.error-text' );
    let errorCount = 0;
    errorMessages.forEach( ( message ) => {
        if ( message.innerText != '' ) {
            errorCount++;
        }
    } );

    // if there are no errors in the form
    if ( errorCount == 0 ) {
        // combine name and surname
        userProfile.fullname = `${userProfile.name} ${userProfile.surname}`;
        updateUserProfile( userProfile );
    } else {
        return;
    }

} );

const validateInput = ( input ) => {
    const inputID = input.getAttribute( 'id' );

    switch ( inputID ) {
        case 'name':
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
        case 'surname':
            // make sure name is longer than 6 characters
            if ( input.value.length < 3 || input.value.length > 40 ) {
                showError( input, 'Surname must be between (6-40) charecters long' );
            } // make sure name contains only letters including spaces
            else if ( !input.value.match( /^[a-zA-Z\s]*$/ ) ) {
                showError( input, 'Surname must contain only letters' );
            } else {
                removeError( input );
            }
            break;
        case 'username':
            // make sure username is longer than 3 characters
            if ( input.value.length < 3 || input.value.length > 20 ) {
                showError( input, 'Username must be between (3-20) charecters long' );
            } else {
                removeError( input );
            }
            break;
        case 'email':
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

const showError = ( input, message ) => {
    // get the closest p tag
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

// update user profile
const updateUserProfile = ( userProfile ) => {
    // get user information
    fetch( `http://127.0.0.1:8080/update-users?userID=${user_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( userProfile ),
    } )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
            // display user information
            console.log( data );
            alert( 'Profile updated successfully' );
        } )
        .catch( ( error ) => {
            console.error( 'User Update Error:', error );
        } );
};

// get user information
fetch( `http://localhost:8080/users`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
} )
    .then( ( response ) => response.json() )
    .then( ( data ) => {
        // get user information
        data.forEach( user => {
            if ( user.id == user_id ) {
                // display user information
                console.log( user );
                displayUserInformation( user );
            }
        } );

    } )
    .catch( ( error ) => {
        console.error( 'Error:', error );
    } );


// display user information
const displayUserInformation = ( user ) => {
    // separate name and surname form full name
    const fullname = user.fullname.split( ' ' );

    // display user information
    name.value = fullname[ 0 ];
    surname.value = fullname[ 1 ];
    username.value = user.username;
    email.value = user.email;

    console.log('info displayed')
};
