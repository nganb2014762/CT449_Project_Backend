const express = require("express");
const cors = require("cors");
const authRouter = require("./app/routes/auth.route");
const bookRouter = require("./app/routes/product.route");
const userFavorite = require('./app/routes/userFavorite.route');
const cartRouter = require('./app/routes/cart.route');
const borrowedBooks = require('./app/routes/borrow.route');
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", authRouter);
app.use("/api/book", bookRouter);
app.use("/api/favorite", userFavorite);
app.use("/api/cart", cartRouter);
app.use("/api/borrow", borrowedBooks);


app.get('/', (req, res) => {
    res.json({ message: "Welcome to contact Book Store. " });
});

// handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

module.exports = app;