// get table tbody element from html
const tbody = document.querySelector( 'tbody' );

// get all posts from the database
const user_id = sessionStorage.getItem( 'user_id' );

const getData = async () => {
    loader.style.display = 'flex';
    await fetch( `http://mysqlblogserver.database.windows.net:8080/posts` )
        .then( res => res.json() )
        .then( data => {
            // loop through the posts and add them to the table
            data.forEach( post => {
                if ( post.author_id == user_id ) {
                    // format date created
                    const fullDate = new Date( post.created_at );
                    const date = fullDate.toLocaleDateString();

                    tbody.innerHTML += `
                <tr>
                    <td>${ post.id }</td>
                    <td>${ post.post_title }</td>
                    <td>${ date }</td>
                    <td>
                        <a href="./create-post.html?postID=${ post.id }">Edit</a>
                        <a href="./delete-post.html?postID=${ post.id }">Delete</a>
                    </td>  
                </tr>
            `;
                }
            } );
        } )
        .catch( err => console.log( err ) );

    loader.style.display = 'none';
};

document.addEventListener( 'DOMContentLoaded', getData );