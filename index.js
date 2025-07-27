const form = document.getElementById('book-form');
const booksContainer = document.getElementById('books-container');
const BOOKS_KEY = 'bookstoreBooks';

// Load books from localStorage or books.json
async function loadBooks() {
  const storedBooks = localStorage.getItem(BOOKS_KEY);
  if (storedBooks) {
    return JSON.parse(storedBooks);
  } else {
    const res = await fetch('books.json');
    const books = await res.json();
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    return books;
  }
}

// Save books to localStorage
function saveBooks(books) {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

// Render all books
function renderBooks(books) {
  booksContainer.innerHTML = '';
  books.forEach(book => renderBook(book));
}

// Render a single book
function renderBook(book) {
  const bookDiv = document.createElement('div');
  bookDiv.className = 'p-4 border rounded bg-gray-50';
  bookDiv.innerHTML = `
    <p class="font-semibold">${book.title}</p>
    <p class="text-sm text-gray-600">by ${book.author}</p>
    <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-600">
      Delete
    </button>
  `;
  const deleteBtn = bookDiv.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteBook(book.id));
  booksContainer.appendChild(bookDiv);
}

// Add a new book
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !author) {
    alert("Both fields are required.");
    return;
  }

  const books = await loadBooks();
  const newBook = {
    id: Date.now(),
    title,
    author
  };

  books.push(newBook);
  saveBooks(books);
  renderBooks(books);
  form.reset();
});

// Delete a book
async function deleteBook(bookId) {
  const books = await loadBooks();
  const updatedBooks = books.filter(book => book.id !== bookId);
  saveBooks(updatedBooks);
  renderBooks(updatedBooks);
}

// Initial load
loadBooks().then(renderBooks);
