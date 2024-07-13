const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "KAlana#23",
    database: "crud"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database.");
});

// Signup 
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO signn (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error("Error inserting data into signn table:", err);
            return res.status(500).json({ error: "Error signing up user" });
        }
        return res.json({ message: "User signed up successfully", userId: result.insertId });
    });
});

// Login 
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id FROM signn WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Error selecting data from signn table:", err);
            return res.status(500).json({ error: "Error logging in user" });
        }
        if (result.length > 0) {
            return res.json({ message: "Success", userId: result[0].id });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

// Add product to cart 
app.post("/cart/add", (req, res) => {
    const { usid, pid } = req.body;
    const checkCartSql = "SELECT * FROM cart WHERE usid = ? AND pid = ?";
    db.query(checkCartSql, [usid, pid], (err, result) => {
        if (err) {
            console.error("Error checking cart:", err);
            return res.status(500).json({ error: "Error checking cart" });
        }
        if (result.length > 0) {
            const updateCartSql = "UPDATE cart SET quantity = quantity + 1 WHERE usid = ? AND pid = ?";
            db.query(updateCartSql, [usid, pid], (err, result) => {
                if (err) {
                    console.error("Error updating cart:", err);
                    return res.status(500).json({ error: "Error updating cart" });
                }
                return res.json({ message: "Product quantity updated in cart" });
            });
        } else {
            const insertCartSql = "INSERT INTO cart (usid, pid, quantity) VALUES (?, ?, 1)";
            db.query(insertCartSql, [usid, pid], (err, result) => {
                if (err) {
                    console.error("Error inserting into cart:", err);
                    return res.status(500).json({ error: "Error inserting into cart" });
                }
                return res.json({ message: "Product added to cart" });
            });
        }
    });
});

// Remove product from cart 
app.post("/cart/remove", (req, res) => {
    const { usid, pid } = req.body;
    const sql = "DELETE FROM cart WHERE usid = ? AND pid = ?";
    db.query(sql, [usid, pid], (err, result) => {
        if (err) {
            console.error("Error deleting from cart:", err);
            return res.status(500).json({ error: "Error deleting from cart" });
        }
        return res.json({ message: "Product removed from cart" });
    });
});

// Get cart items 
app.get("/cart/:usid", (req, res) => {
    const { usid } = req.params;
    const sql = `
        SELECT p.id, p.name, p.price, c.quantity
        FROM cart c
        JOIN products p ON c.pid = p.id
        WHERE c.usid = ?
    `;
    db.query(sql, [usid], (err, results) => {
        if (err) {
            console.error("Error fetching cart items:", err);
            return res.status(500).json({ error: "Error fetching cart items" });
        }
        // Calculate total price
        const totalPrice = results.reduce((total, item) => total + item.price * item.quantity, 0);
        return res.json({ items: results, totalPrice: totalPrice });
    });
});

// Fetch all products 
app.get("/products", (req, res) => {
    const sql = "SELECT id, name, price FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: "Error fetching products" });
        }
        return res.json(results);
    });
});

// Get cart item count 
app.get("/cart/count/:usid", (req, res) => {
    const { usid } = req.params;
    const sql = "SELECT COUNT(*) AS count FROM cart WHERE usid = ?";
    db.query(sql, [usid], (err, result) => {
        if (err) {
            console.error("Error fetching cart item count:", err);
            return res.status(500).json({ error: "Error fetching cart item count" });
        }
        return res.json(result[0]);
    });
});



//  to place an order
app.post("/orders/place", (req, res) => {
    const { usid, items } = req.body; // Assuming `usid` and `items` are passed in the request body
    
    // Start a transaction to ensure atomicity of operations
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error beginning transaction:", err);
            return res.status(500).json({ error: "Error placing order" });
        }

        // Step 1: Insert into `orders` table
        const orderSql = "INSERT INTO ordes (usid, tprice) VALUES (?, ?)";
        const totalPrice = items.reduce((total, item) => total + (item.quantity * item.uprice), 0);
        
        db.query(orderSql, [usid, totalPrice], (err, result) => {
            if (err) {
                db.rollback(() => {
                    console.error("Error inserting data into ordes table:", err);
                    return res.status(500).json({ error: "Error placing order" });
                });
            } else {
                const orderId = result.insertId;

                // Step 2: Insert into `orderitems` table
                const orderItemsSql = "INSERT INTO orderitems (oid, pid, quantity, uprice) VALUES ?";
                const values = items.map(item => [orderId, item.pid, item.quantity, item.uprice]);

                db.query(orderItemsSql, [values], (err, result) => {
                    if (err) {
                        db.rollback(() => {
                            console.error("Error inserting data into orderitems table:", err);
                            return res.status(500).json({ error: "Error placing order" });
                        });
                    } else {
                        // Commit the transaction if everything is successful
                        db.commit((err) => {
                            if (err) {
                                db.rollback(() => {
                                    console.error("Error committing transaction:", err);
                                    return res.status(500).json({ error: "Error placing order" });
                                });
                            } else {
                                return res.json({ message: "Order placed successfully", orderId: orderId });
                            }
                        });
                    }
                });
            }
        });
    });
});


// Route to fetch product details by ID
app.get("/products/:pid", (req, res) => {
    const productId = req.params.pid;
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ error: "Error fetching product" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.json(result[0]); // Assuming single product is returned
    });
});

// Endpoint to handle payment data insertion
app.post('/api/payment', (req, res) => {
    const { orderId, amount } = req.body;

    // Insert payment data into the database
    const insertQuery = `INSERT INTO payment (oid, amount) VALUES (?, ?)`;
    db.query(insertQuery, [orderId, amount], (err, result) => {
        if (err) {
            console.error('Error inserting payment:', err);
            res.status(500).json({ error: 'Error inserting payment' });
            return;
        }

        console.log('Payment inserted successfully');
        res.status(201).json({ message: 'Payment inserted successfully' });
    });
});



const port = 8081;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
