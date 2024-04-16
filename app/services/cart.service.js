const { ObjectId } = require("mongodb");

class CartService {
    constructor(client) {
        this.CartService = client.db().collection("carts");
    }

    extractCartServiceData(payload) {
        const cartService = {
            userId: payload.userId,
            books: payload.books,
        };
        return cartService;
    }

    async create(payload) {
        const cartService = this.extractCartServiceData(payload);
        const filter = { userId: cartService.userId };

        let currentCart = await this.CartService.findOne(filter);

        if (!currentCart) {
            currentCart = { userId: cartService.userId, books: [] };
        }

        cartService.books.forEach(book => {
            const existingBookIndex = currentCart.books.findIndex(item => item.bookId === book.bookId);
            if (existingBookIndex !== -1) {
                currentCart.books[existingBookIndex].quantity = book.quantity;
            } else {
                currentCart.books.push({
                    bookId: book.bookId,
                    quantity: book.quantity
                });
            }
        });

        currentCart = await this.CartService.findOneAndUpdate(
            filter,
            { $set: { books: currentCart.books } },
            { returnDocument: "after", upsert: true }
        );

        return currentCart;
    }

    async removeItem(userId, bookId) {
        try {
            // Tìm giỏ hàng của người dùng
            const cart = await this.CartService.findOne({ userId: userId });

            // Nếu không tìm thấy giỏ hàng hoặc giỏ hàng không có mặt hàng với bookId, không cần phải làm gì cả
            if (!cart || !cart.books.find(book => book.bookId === bookId)) {
                return;
            }

            // Loại bỏ mặt hàng với bookId khỏi danh sách sách trong giỏ hàng
            cart.books = cart.books.filter(book => book.bookId !== bookId);

            // Cập nhật lại giỏ hàng trong cơ sở dữ liệu
            await this.CartService.updateOne({ userId: userId }, { $set: { books: cart.books } });

            return { success: true };
        } catch (error) {
            throw new Error("Failed to remove item from cart");
        }
    }

    async findAll(userId) {
        try {
            const cartService = await this.CartService.findOne({ userId: userId });
            if (!cartService) {
                return [];
            }
            return cartService.books;
        } catch (error) {
            throw new Error("Failed to find user's favorites");
        }
    }

    async deleteCart(id) {
        const result = await this.CartService.findOneAndDelete({
            userId: id,
        })
        return result;
    }
}

module.exports = CartService;
