// get table tbody element from html
const tbody = document.querySelector( 'tbody' );

// get all posts from the database
fetch( `http://127.0.0.1:8080/posts` )
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
