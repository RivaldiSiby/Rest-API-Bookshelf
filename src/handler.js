const { nanoid } = require("nanoid");
const books = require("./books");

const addBooks = (request, h) => {
  // struktur buku
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid();
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  //   cek properti name
  if (name == undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }
  //   cek properti readpage
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  //   menyimpan data
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  //   Ketika Berhasil
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  //   gagal memasukan data
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooks = (request, h) => {
  const { reading, finished, name } = request.query;

  const booksall = [];

  //   tarik semua data
  if (reading == undefined && finished == undefined && name == undefined) {
    if (books.length > 0) {
      books.map((book) => {
        booksall.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      });
    }
  }
  //   tarik data buku yang sudah dilihat / belum dilihat
  if (reading == 1) {
    if (books.length > 0) {
      books.map((book) => {
        if (book.reading === true) {
          booksall.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });
    }
  } else if (reading == 0) {
    if (books.length > 0) {
      books.map((book) => {
        if (book.reading === false) {
          booksall.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });
    }
  }
  //  tarik data buku yang sudah selesai dibaca / belum selesai dibaca
  if (finished == 1) {
    if (books.length > 0) {
      books.map((book) => {
        if (book.finished === true) {
          booksall.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });
    }
  } else if (finished == 0) {
    if (books.length > 0) {
      books.map((book) => {
        if (book.finished === false) {
          booksall.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });
    }
  }
  //   tarik data name yang bernama dcoding
  if (name !== undefined) {
    if (books.length > 0) {
      books.map((book) => {
        let dataname = book.name.split(" ");
        const cek = dataname.filter(
          (nm) => nm.toLowerCase() === name.toLowerCase()
        );
        if (cek.length > 0) {
          booksall.push({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          });
        }
      });
    }
  }

  const response = h.response({
    status: "success",
    data: {
      books: booksall,
    },
  });
  response.code(200);
  return response;
};

const getBooksById = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book === undefined) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      book: book,
    },
  });
  return response;
};

const editBooks = (request, h) => {
  // struktur buku
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const { id } = request.params;
  const finished = pageCount === readPage ? true : false;
  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  //   cek apakah ada id yang sama atau tidak
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    const insertedAt = books[index]["insertedAt"];
    books[index] = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBooks = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooks,
  getAllBooks,
  getBooksById,
  editBooks,
  deleteBooks,
};
