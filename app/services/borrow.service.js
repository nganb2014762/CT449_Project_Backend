const { ObjectId } = require("mongodb");

class BorrowBooks {
    constructor(client) {
        this.BorrowBooks = client.db().collection("borrows");
    }

    extractBorrowBooksData(payload) {
        const borrowBooks = {
            userId: payload.userId,
            name: payload.name,
            ngayMuon: payload.ngayMuon,
            ngayTra: payload.ngayTra,
            books: payload.books,
            status: payload.status,
        };

        Object.keys(borrowBooks).forEach(
            (key) => borrowBooks[key] === undefined && delete borrowBooks[key]
        );

        return borrowBooks;
    }

    async create(payload) {
        const borrowBooks = this.extractBorrowBooksData(payload);
        borrowBooks.status = "Đang đợi duyệt";
        const newOrder = await this.BorrowBooks.insertOne(
            borrowBooks
        );
        return newOrder.value;
    }

    async findById(id) {
        return await this.BorrowBooks.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async find(filter) {
        const cursor = await this.BorrowBooks.find(filter);
        return await cursor.toArray();
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractBorrowBooksData(payload);
        const result = await this.BorrowBooks.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }
}
module.exports = BorrowBooks;