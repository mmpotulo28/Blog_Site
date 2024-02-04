const contactForm = document.querySelector( '#contacts-form' );
const contactName = document.querySelector( '#contact-name' );
const contactEmail = document.querySelector( '#contact-email' );
const contactMessage = document.querySelector( '#contact-message' );
const loader = document.querySelector( '.loader-pop-up' );
const loaderIcon = document.querySelector( '.loader-pop-up .loader-icon i' );

document.addEventListener( 'DOMContentLoaded', () => {
    loader.style.display = 'none'
})

contactForm.addEventListener( 'submit', ( event ) => {
    event.preventDefault();

    const formData = {
        name: contactName.value,
        email: contactEmail.value,
        message: contactMessage.value
    };

    validateInput( formData.name, formData.email, formData );
} );

const emailError = document.querySelector( '#email-error' );
const nameError = document.querySelector( '#name-error' );

async function validateInput ( name, email, formData ) {
    let nameArr = name.split( ' ' );
    name = nameArr.join( '' ).trim();
    email = email.trim();

    try {
        await new Promise( ( resolve, reject ) => {
            if ( !/^[a-zA-Z]+$/.test( name ) ) {
                nameError.style.display = 'block';
                nameError.textContent = 'Please enter a valid name';
            } else {
                nameError.style.display = 'none';
                nameError.textContent = '';
            }

            if ( !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email ) ) {
                emailError.style.display = 'block';
                emailError.textContent = 'Please enter a valid email';
            } else {
                emailError.style.display = 'none';
                emailError.textContent = '';
            }

            if ( nameError.style.display === 'none' && emailError.style.display === 'none' ) {
                resolve();
            } else {
                reject( 'form validation error' );
            }
        } );
    } catch ( error ) {
        throw new Error( error );
    }

    sendEmail( formData );
}

async function sendEmail ( formData ) {
    try {
        loader.style.display = 'flex';
        await emailjs.send( 'service_5fplxzq', 'template_59ytvcn', {
            from_name: formData.name,
            to_name: 'Manelisi Mpotulo',
            message: formData.message,
            reply_to: formData.email,
        }, 'o24mx-l8WjlWOujcE' );

        loader.style.display = 'none';
        alert( 'Form submitted successfully, Thank you for your message' );

        contactName.value = '';
        contactEmail.value = '';
        contactMessage.value = '';

    } catch ( error ) {
        alert( 'Something went wrong, please try again later' );
        throw new Error( error );
    }
}