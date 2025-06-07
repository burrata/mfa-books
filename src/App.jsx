
import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import './index.css';

export default function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPubYear, setSelectedPubYear] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('/books.json')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);
      });
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchQuery, selectedGenre, selectedPubYear, books]);

  const publicationYears = Array.from(new Set(books.map(b => b.publicationYear))).filter(Boolean).sort();
  const genres = ['All', 'Poetry', 'Fiction', 'Poetry/Fiction'];

  const fuse = new Fuse(books, {
    keys: ['fullName', 'title', 'publisher', 'genre', 'publicationYear'],
    threshold: 0.3,
    ignoreLocation: true,
  });

  function filterBooks() {
    const results = searchQuery ? fuse.search(searchQuery).map(r => r.item) : books;
    const filtered = results.filter(b => 
      (selectedGenre === 'all' || b.genre === selectedGenre) &&
      (selectedPubYear === 'all' || b.publicationYear === parseInt(selectedPubYear, 10))
    );
    setFilteredBooks(filtered);
  }

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  }

  return (
    <div className="container">
      <div className="flex space-between items-center">
        <h1 className="text-3xl font-bold mb-4">MFA Alumni Books</h1>
        <button onClick={toggleDarkMode}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="grid-3 mb-2">
        <input
          type="text"
          placeholder="Search by author, title, publisher, etc."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={selectedPubYear} onChange={e => setSelectedPubYear(e.target.value)}>
          <option value="All">Publication Year</option>
          {publicationYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>
        {filteredBooks.length} result{filteredBooks.length !== 1 ? 's' : ''} found
      </p>


      <div className="book-grid">
        {filteredBooks.map((book, i) => (
          <div className="book-card" key={book.Title + book.fullName + i}>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.fullName}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Class year:</strong> {book.classYear}</p>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>Year:</strong> {book.publicationYear}</p>
            {book.Notes && <p><strong>Notes:</strong> {book.Notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
