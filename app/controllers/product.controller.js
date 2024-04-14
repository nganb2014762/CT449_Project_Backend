const BookService = require("../services/product.service");
const MongoBD = require("../utils/connect");
const ApiError = require("../api-error");

//Create and Save a new Contact
exports.create = async (req, res, next) => {
    if (!req.body?.title || !req.body?.author || !req.body?.nxb || !req.body?.imageUrl || !req.body?.quantity) {
        return next(new ApiError(400, "Thông tin sách cần điền vào đầy đủ!"));
    }

    try {
        const bookService = new BookService(MongoBD.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the Book")
        );
    }
};

//Find all book
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const bookService = new BookService(MongoBD.client);
        documents = await bookService.find({});
    } catch (error) {
        return next(
            new ApiError(500, "An errer occured while retrieving books")
        );
    }
    return res.send(documents);
};

//Find Book
exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoBD.client);
        const document = await bookService.findByTitle(req.body.title);
        if (document.length > 0) {
            res.send(document);
        } else {
            return next(new ApiError(400, `Không tìm thấy sách với tiêu đề là ${req.body.title}`));
        }
    } catch (error) {
        return next(new ApiError(500, `An error occurred while finding books by title`));
    }
}

//Find book by ID
exports.findById = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoBD.client);
        const document = await bookService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(400, "Book not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error retrieving book with id=${req.params.id}`));
    }
};

//Update book
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be emtpy"));
    }
    try {
        const bookService = new BookService(MongoBD.client);
        const document = await bookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating book with id=${req.params.id}`)
        );
    }
};

//Delete book
exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoBD.client);
        const document = await bookService.delete(req.params.id);
        if (!document) {
            return next(new (404, "Book not found"));
        }
        return res.send({ message: "Book was deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, `Could not delete book with id=${req.params.id}`));
    }
};
