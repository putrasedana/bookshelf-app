// Inisialisasi elemen-elemen DOM dan data dari localStorage
const form = document.querySelector(".input-form");
const completeBtn = document.querySelector(".btn-green");

const incompleteListDiv = document.getElementById("incomplete-list");
const completeListDiv = document.getElementById("complete-list");

const completeList = JSON.parse(localStorage.getItem("completeList")) || [];
const incompleteList = JSON.parse(localStorage.getItem("incompleteList")) || [];

const deleteBtn = document.getElementById("confirm-delete");
const cancelBtn = document.getElementById("cancel-delete");
const confirmDelete = document.getElementById("confirmation-popup");

// Fungsi untuk membuat buku baru
function createBookItem(id, title, author, year, isComplete) {
  const bookItem = document.createElement("article");
  bookItem.className = "book-item";
  bookItem.dataset.id = id;

  const heading = document.createElement("h3");
  heading.textContent = title;

  const authorPara = document.createElement("p");
  authorPara.textContent = "Penulis: " + author;

  const yearPara = document.createElement("p");
  yearPara.textContent = "Tahun: " + year;

  const actionDiv = document.createElement("div");
  actionDiv.className = "action";

  const finishButton = document.createElement("button");
  finishButton.className = "btn-green";
  finishButton.innerText = isComplete ? "Belum selesai" : "Selesai dibaca";

  const editButton = document.createElement("button");
  editButton.className = "btn-yellow";
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn-red";
  deleteButton.textContent = "Hapus";

  actionDiv.appendChild(finishButton);
  actionDiv.appendChild(editButton);
  actionDiv.appendChild(deleteButton);
  bookItem.appendChild(heading);
  bookItem.appendChild(authorPara);
  bookItem.appendChild(yearPara);
  bookItem.appendChild(actionDiv);

  return bookItem;
}

// Fungsi untuk menampilkan alert di form input
function showAlert(message, className, parentElement) {
  const div = document.createElement("div");
  div.className = `alert-${className}`;
  div.appendChild(document.createTextNode(message));

  const inputSection = document.querySelector(parentElement);
  const h2Element = inputSection.querySelector("h2");
  inputSection.insertBefore(div, h2Element.nextSibling);

  setTimeout(() => div.remove(), 3000);
}

// Mengambil data dari form
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const titleInput = document.getElementById("book-title");
  const authorInput = document.getElementById("book-author");
  const yearInput = document.getElementById("book-year");
  const isCompleteCheckbox = document.getElementById("book-iscomplete");

  const title = titleInput.value;
  const author = authorInput.value;
  const year = yearInput.value;
  const isComplete = isCompleteCheckbox.checked;

  if (title == "" || author == "" || year == "") {
    showAlert("Tolong isi semua field!", "red", ".input-section");
  } else {
    addBook(title, author, parseInt(year), isComplete);

    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteCheckbox.checked = false;

    const bookShelfSectionId = isComplete ? "complete-shelf" : "incomplete-shelf";
    const bookShelfSection = document.getElementById(bookShelfSectionId);
    bookShelfSection.scrollIntoView({ behavior: "smooth" });
  }
});

// Fungsi untuk menambahkan buku baru
function addBook(title, author, year, isComplete) {
  const book = {
    id: +new Date(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  if (isComplete) {
    completeList.push(book);
    saveBooksToLocalStorage();
    renderBooks();
    showAlert("Buku sukses ditambahkan!", "green", "#complete-shelf");
  } else {
    incompleteList.push(book);
    saveBooksToLocalStorage();
    renderBooks();
    showAlert("Buku sukses ditambahkan!", "green", "#incomplete-shelf");
  }
}

// Fungsi untuk menyimpan daftar buku ke dalam local storage
function saveBooksToLocalStorage() {
  localStorage.setItem("completeList", JSON.stringify(completeList));
  localStorage.setItem("incompleteList", JSON.stringify(incompleteList));
}

// Fungsi untuk merender semua buku ke dalam tampilan
function renderBooks() {
  completeListDiv.innerHTML = "";
  incompleteListDiv.innerHTML = "";

  if (completeList.length === 0) {
    const noBooksMessage = document.createElement("p");
    noBooksMessage.textContent = "Tidak ada buku.";
    completeListDiv.appendChild(noBooksMessage);
  } else {
    completeList.forEach((book) => {
      const bookItem = createBookItem(book.id, book.title, book.author, book.year, book.isComplete);
      completeListDiv.appendChild(bookItem);
    });
  }

  if (incompleteList.length === 0) {
    const noBooksMessage = document.createElement("p");
    noBooksMessage.textContent = "Tidak ada buku.";
    incompleteListDiv.appendChild(noBooksMessage);
  } else {
    incompleteList.forEach((book) => {
      const bookItem = createBookItem(book.id, book.title, book.author, book.year, book.isComplete);
      incompleteListDiv.appendChild(bookItem);
    });
  }
}

renderBooks();

// Memindahkan buku ke rak belum selesai dibaca
completeListDiv.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-green")) {
    const bookItem = event.target.closest(".book-item");
    const bookId = bookItem.dataset.id;
    const bookIndex = completeList.findIndex((book) => book.id == bookId);

    if (bookIndex !== -1) {
      const { title, author, year } = completeList[bookIndex];
      completeList.splice(bookIndex, 1);
      incompleteList.push({ id: bookId, title: title, author: author, year: year, isComplete: false });

      saveBooksToLocalStorage();
      renderBooks();
      showAlert("Buku sukses dipindahkan!", "green", "#incomplete-shelf");
    }
  }
});

// Memindahkan buku ke rak selesai dibaca
incompleteListDiv.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-green")) {
    const bookItem = event.target.closest(".book-item");
    const bookId = bookItem.dataset.id;
    const bookIndex = incompleteList.findIndex((book) => book.id == bookId);

    if (bookIndex !== -1) {
      const { title, author, year } = incompleteList[bookIndex];
      incompleteList.splice(bookIndex, 1);
      completeList.push({ id: bookId, title: title, author: author, year: year, isComplete: true });

      saveBooksToLocalStorage();
      renderBooks();
      showAlert("Buku sukses dipindahkan!", "green", "#complete-shelf");
    }
  }
});

// Menghapus buku dari rak
deleteBtn.addEventListener("click", () => {
  const bookItem = confirmDelete.bookItem;
  const bookId = bookItem.dataset.id;
  const bookIndex = incompleteList.findIndex((book) => book.id == bookId);
  const bookIndex2 = completeList.findIndex((book) => book.id == bookId);

  if (bookIndex !== -1) {
    incompleteList.splice(bookIndex, 1);
    saveBooksToLocalStorage();
    renderBooks();
    confirmDelete.style.display = "none";
    showAlert("Buku sukses dihapus!", "green", "#incomplete-shelf");
  } else if (bookIndex2 !== -1) {
    completeList.splice(bookIndex2, 1);
    saveBooksToLocalStorage();
    renderBooks();
    confirmDelete.style.display = "none";
    showAlert("Buku sukses dihapus!", "green", "#complete-shelf");
  }
});

cancelBtn.addEventListener("click", () => (confirmDelete.style.display = "none"));

incompleteListDiv.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-red")) {
    const bookItem = event.target.closest(".book-item");
    const bookId = bookItem.dataset.id;
    const bookIndex = incompleteList.findIndex((book) => book.id == bookId);

    if (bookIndex !== -1) {
      confirmDelete.bookItem = bookItem;
      confirmDelete.style.display = "flex";
    }
  }
});

completeListDiv.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-red")) {
    const bookItem = event.target.closest(".book-item");
    const bookId = bookItem.dataset.id;
    const bookIndex = completeList.findIndex((book) => book.id == bookId);

    if (bookIndex !== -1) {
      confirmDelete.bookItem = bookItem;
      confirmDelete.style.display = "flex";
    }
  }
});

// Mengedit buku dari rak belum selesai dibaca
incompleteListDiv.addEventListener("click", (event) => {
  target = event.target;
  if (target.className.includes("btn-yellow")) {
    let bookItem = event.target.closest(".book-item");
    let bookId = bookItem.dataset.id;
    let bookIndex = incompleteList.findIndex((book) => book.id == bookId);

    if (bookIndex !== -1) {
      let editedBook = incompleteList[bookIndex];
      const editForm = document.getElementById("edit-form");
      editForm.style.display = "block";

      document.getElementById("edit-title").value = editedBook.title;
      document.getElementById("edit-author").value = editedBook.author;
      document.getElementById("edit-year").value = editedBook.year;

      editForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newTitle = document.getElementById("edit-title").value;
        const newAuthor = document.getElementById("edit-author").value;
        const newYear = parseInt(document.getElementById("edit-year").value);

        if (editedBook !== null) {
          editedBook.title = newTitle;
          editedBook.author = newAuthor;
          editedBook.year = newYear;
          showAlert("Buku telah diedit!", "yellow", "#incomplete-shelf");
          saveBooksToLocalStorage();
          editForm.style.display = "none";
          renderBooks();
        }

        editedBook = null;
      });

      document.getElementById("cancel-edit").addEventListener("click", () => {
        editForm.style.display = "none";
      });
    }
  }
});

// Mengedit buku dari rak selesai dibaca
completeListDiv.addEventListener("click", (event) => {
  const target = event.target;
  if (target.className.includes("btn-yellow")) {
    const bookItem = event.target.closest(".book-item");
    const bookId = bookItem.dataset.id;
    const bookIndex = completeList.findIndex((book) => book.id == bookId);

    if (bookIndex !== -1) {
      let editedBook = completeList[bookIndex];
      const editForm = document.getElementById("edit-form");
      editForm.style.display = "block";

      document.getElementById("edit-title").value = editedBook.title;
      document.getElementById("edit-author").value = editedBook.author;
      document.getElementById("edit-year").value = editedBook.year;

      editForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newTitle = document.getElementById("edit-title").value;
        const newAuthor = document.getElementById("edit-author").value;
        const newYear = parseInt(document.getElementById("edit-year").value);

        if (editedBook !== null) {
          editedBook.title = newTitle;
          editedBook.author = newAuthor;
          editedBook.year = newYear;
          saveBooksToLocalStorage();
          editForm.style.display = "none";
          renderBooks();
          showAlert("Buku telah diedit!", "yellow", "#complete-shelf");
        }

        editedBook = null;
      });

      document.getElementById("cancel-edit").addEventListener("click", () => {
        editForm.style.display = "none";
      });
    }
  }
});

// Mencari buku berdasarkan judul
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTitle = document.getElementById("search-title").value.trim().toLowerCase();
  const filteredIncompleteBooks = incompleteList.filter((book) => book.title.toLowerCase().includes(searchTitle));
  const filteredCompleteBooks = completeList.filter((book) => book.title.toLowerCase().includes(searchTitle));
  const filteredBooks = [...filteredIncompleteBooks, ...filteredCompleteBooks];

  renderFilteredBooks(filteredBooks);
});

// Fungsi untuk menampilkan daftar buku yang sudah difilter
function renderFilteredBooks(filteredBooks) {
  incompleteListDiv.innerHTML = "";
  completeListDiv.innerHTML = "";

  if (filteredBooks.length === 0) {
    const noBooksMessage = document.createElement("p");
    noBooksMessage.textContent = "Buku tidak ditemukan.";
    incompleteListDiv.appendChild(noBooksMessage);
    completeListDiv.appendChild(noBooksMessage.cloneNode(true));
  } else {
    filteredBooks.forEach((book) => {
      const listDiv = book.isComplete ? completeListDiv : incompleteListDiv;
      const bookItem = createBookItem(book.id, book.title, book.author, book.year, book.isComplete);
      listDiv.appendChild(bookItem);
    });
  }
}
