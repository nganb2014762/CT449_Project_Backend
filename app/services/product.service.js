const { ObjectId } = require("mongodb");

class BookService {
    constructor(client) {
        this.Book = client.db().collection("products");
    }

    extractBookData(payload) {
        const book = {
            title: payload.title,
            author: payload.author,
            nxb: payload.nxb,
            imageUrl: payload.imageUrl,
            namxb: payload.namxb,
            dongia: payload.dongia,
            quantity: payload.quantity
        };

        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );

        return book;
    }

    async create(payload) {
        const book = this.extractBookData(payload);
        const result = await this.Book.insertOne(book);
        return result.insertedId.toString();
    }

    async find(filter) {
        const cursor = await this.Book.find(filter);
        return await cursor.toArray();
    }

    async findByTitle(title) {
        const query = { title: { $regex: title, $options: 'i' } };
        const books = await this.Book.find(query).toArray();
        return books;
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = BookService;