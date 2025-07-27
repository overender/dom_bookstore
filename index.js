const form = document.getElementById('book-form');
const booksContainer = document.getElementById('books-container');
const API_URL = 'http://localhost:3000/books';

function fetchBooks() {
  fetch(API_URL)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      booksContainer.innerHTML = '';
      data.forEach(book => renderBook(book));
    })
    .catch(error => console.error('Error fetching books:', error));
}

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

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();

  if (!title || !author) {
    alert("Both fields are required.");
    return;
  }

  const newBook = { title, author };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBook),
  })
    .then(async res => {
      const data = await res.json();
      console.log('POST status:', res.status);
      console.log('POST response:', data);
      if (!res.ok) throw new Error(data.message || 'Failed to add book');
      fetchBooks();
      form.reset();
    })
    .catch(error => {
      console.error('Error adding book:', error.message);
      alert('Could not add book. See console for details.');
    });
});

function deleteBook(bookId) {
  fetch(`${API_URL}/${bookId}`, {
    method: 'DELETE',
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to delete: ${res.status}`);
      }
      return res.json();
    })
    .then(() => {
      console.log(`Deleted book with ID: ${bookId}`);
      fetchBooks();
    })
    .catch(error => console.error('Error deleting book:', error));
}

fetchBooks();
