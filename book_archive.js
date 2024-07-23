const apiKey = '' //ask alex;
const books = [
    { title: 'Howls Moving Castle', author: 'Diana Wynne Jones' },
    { title: 'Mrs Dalloway', author: 'Virginia Woolf'},
    { title: 'Giovannis Room', author: 'James Baldwin'},
    { title: 'A Man Called Ove', author: 'Fredrik Backman' },
    { title: 'Orlando ', author: 'Virginia Woolf' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson' },
    { title: 'The Master and Margarita', author: 'Mikhail Bulgakov' },
    { title: 'The Bell Jar', author: 'Sylvia Plath'},
    { title: 'And Then There Were None', author: 'Agatha Christie'},
    { title: 'Paradise Rot', author: 'Jenny Hval'},
    { title: 'Bluets', author: 'Maggie Nelson'},
    { title: 'A Clockwork Orange', author: 'Anthony Burgess'},
    { title: 'American Psycho', author: 'Bret Easton Ellis'},
    { title: 'No Longer Human', author: 'Osamu Dazai'},
    { title: 'Fight CLub', author: 'Chuck Palahniuk'}, 
    { title: 'Girl Interrupted', author: 'Susanna Kaysen'},
    { title: 'The Secret History', author: 'Donna Tartt'},
    { title: 'The Idiot', author: 'Fyodor Dostoevsky'}
];

async function fetchBook(title, author) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}&langRestrict=en&key=${apiKey}`);
    const data = await response.json();
    return data.items ? data.items[0] : null;
}

async function displayBooks() {
    const bookshelf = document.getElementById('bookshelf');
    const bookPromises = books.map(book => fetchBook(book.title, book.author));

    const results = await Promise.all(bookPromises);

    results.forEach(book => {
        if (book) {
            const bookInfo = book.volumeInfo;
            const title = bookInfo.title;
            const author = bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author';
            const coverUrl = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x193?text=No+Cover';

            const bookElement = document.createElement('div');
            bookElement.className = 'book';
            bookElement.innerHTML = `
                <img src="${coverUrl}" alt="${title} cover">
                <div><strong>${title}</strong></div>
                <div>${author}</div>
            `;
            bookshelf.appendChild(bookElement);
        }
    });
}

displayBooks();