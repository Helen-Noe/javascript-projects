class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');

        // create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class = "delete">X<a></td>
            `;

        list.appendChild(row);
    }
    showAlert(message, className){
        // Create div
        const div = document.createElement('div');
        // Add Classes
        div.className = `alert ${className}`;
        // add Text
        div.appendChild(document.createTextNode(message));
        // get parent
        const container = document.querySelector('.container');
        // get form
        const form = document.querySelector('#book-form');
        // insert alert
        container.insertBefore(div, form);

        // timeout after 3s
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000)
    }
    deleteBook(target){
        if (target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
    clearField(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// local storage class
class Store{
    static getBook(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBook(){
        const books = Store.getBook();
        books.forEach(function(book){
            const ui = new UI();
            // add book to ui
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
         const books = Store.getBook();
         books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// // Check book already Exist
// function checkBook(isbn){
//     const books = Store.getBook();
//     books.forEach(function(book){
//         // console.log(isbn);
//         if(book.isbn === isbn){
//             console.log('In function');
//             return true;
//         }
//         else{
//             return false;
//         }
//     });
// }

// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBook);

// event listener for add book
document.getElementById('book-form').addEventListener('submit', function(e){
    //get form values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    // instantiate book
    const book = new Book(title, author, isbn);

    // instantiate UI
    const ui = new UI();

    // console.log(checkBook(isbn));

    // Validate
    if(title == '' || author === '' || isbn === ''){
        // error alert
        ui.showAlert('Please fill in all fields', 'error');
    }
    // else if(checkBook(isbn) === true){
    //     console.log('in loop');
    //     ui.showAlert('Book already exist!', 'error');
    // }
    else{
        // add book to UI
        ui.addBookToList(book);

        // add to local storage
        Store.addBook(book);

        // show success
        ui.showAlert('Book Added!', 'success');

        // clear field
        ui.clearField();
    }

    // console.log(book);
    e.preventDefault();
});

// Event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
    // Instantiate UI
    const ui = new UI();

    // Delete Book
    ui.deleteBook(e.target);

    //delete from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show message
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
})
