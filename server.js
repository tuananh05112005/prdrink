const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const util = require("util");

const app = express();
const port = 5000;

// Middleware

app.use(
  cors({
    origin: "http://localhost:3000", // Cho phép frontend truy cập
    methods: ["GET", "POST", "PUT", "DELETE"], // Cho phép các phương thức
    credentials: true, // Cho phép gửi cookie và header xác thực
  })
);
app.use(express.json());
app.use(bodyParser.json());

// Kết nối MySQL
const db = mysql.createConnection({
  host: "localhost", // Địa chỉ MySQL server
  user: "root", // Tên người dùng MySQL
  password: "05112005", // Mật khẩu MySQL
  database: "pr", // Tên cơ sở dữ liệu
});
const query = util.promisify(db.query).bind(db);
// Kiểm tra kết nối MySQL
db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL:", err);
  } else {
    console.log("Đã kết nối thành công đến MySQL!");
  }
});

// API để lấy danh sách sản phẩm
app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products"; // Thay "products" bằng tên bảng của bạn
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn MySQL:", err);
      res.status(500).send("Lỗi server");
    } else {
      res.json(results);
    }
  });
});

app.post("/api/products", (req, res) => {
  const { image, code, name, price, description, size } = req.body;
  const query =
    "INSERT INTO products (image, code, name, price, description, size) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [image, code, name, price, description, size],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi thêm sản phẩm:", err);
        res.status(500).send("Lỗi server");
      } else {
        res.status(201).json({ id: results.insertId, ...req.body });
      }
    }
  );
});
app.put("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  // Kiểm tra xem sản phẩm có tồn tại không
  const checkSql = "SELECT * FROM products WHERE id = ?";
  db.query(checkSql, [productId], (err, result) => {
    if (err) {
      console.error("Lỗi khi kiểm tra sản phẩm:", err);
      return res.status(500).send({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Kiểm tra trùng lặp mã sản phẩm hoặc tên sản phẩm
    const checkDuplicateSql =
      "SELECT * FROM products WHERE (code = ? OR name = ?) AND id != ?";
    db.query(
      checkDuplicateSql,
      [updatedProduct.code, updatedProduct.name, productId],
      (err, duplicateResults) => {
        if (err) {
          console.error("Lỗi khi kiểm tra trùng lặp:", err);
          return res.status(500).send({ message: "Server error" });
        }

        if (duplicateResults.length > 0) {
          return res.status(400).send({
            message: "Mã sản phẩm hoặc tên sản phẩm đã tồn tại",
          });
        }

        // Nếu không trùng lặp, thực hiện cập nhật
        const updateSql = "UPDATE products SET ? WHERE id = ?";
        db.query(updateSql, [updatedProduct, productId], (err, result) => {
          if (err) {
            console.error("Lỗi khi cập nhật sản phẩm:", err);
            return res.status(500).send({ message: "Server error" });
          }

          res.status(200).send({ message: "Product updated successfully" });
        });
      }
    );
  });
});
app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn MySQL:", err);
      return res.status(500).send("Lỗi server");
    }
    if (results.length === 0) {
      return res.status(404).send("Không tìm thấy sản phẩm");
    }
    res.json(results[0]); // Trả về sản phẩm đầu tiên
  });
});
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;

  // Xóa các bản ghi liên quan trong bảng payments
  db.query(
    "DELETE FROM payments WHERE product_id = ?",
    [productId],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa payments:", err);
        return res.status(500).json({ message: "Lỗi server khi xóa payments" });
      }

      // Xóa sản phẩm
      db.query(
        "DELETE FROM products WHERE id = ?",
        [productId],
        (err, result) => {
          if (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            return res
              .status(500)
              .json({ message: "Lỗi server khi xóa sản phẩm" });
          }

          res.status(200).json({ message: "Xóa sản phẩm thành công" });
        }
      );
    }
  );
});
// Thêm sản phẩm vào giỏ hàng
app.post("/api/cart/add", (req, res) => {
  const { user_id, product_id, quantity, size } = req.body;
  console.log("Dữ liệu nhận được:", req.body); // Debug

  const query =
    "INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?, ?, ?, ? )";
  db.query(query, [user_id, product_id, quantity, size], (err, results) => {
    if (err) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", err);
      res.status(500).send("Lỗi server");
    } else {
      console.log("Sản phẩm đã được thêm vào giỏ hàng:", results); // Debug
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  });
});

// Lấy giỏ hàng của người dùng
app.get("/api/cart/:user_id", (req, res) => {
  const { user_id } = req.params;
  const query = `
      SELECT cart.id, cart.quantity, cart.size, cart.status, cart.order_date, products.id AS product_id, products.code, products.name, products.price, products.image
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = ?
    `;
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
      res.status(500).send("Lỗi server");
    } else {
      console.log("Kết quả truy vấn:", results); // Debug
      res.json(results);
    }
  });
});

// Lấy tất cả đơn hàng (cho admin)
app.get("/api/admin/orders", (req, res) => {
  const query = `
      SELECT cart.id, cart.user_id, cart.quantity, cart.size, cart.status, cart.order_date, 
             products.id AS product_id, products.code, products.name, products.price, products.image
      FROM cart
      JOIN products ON cart.product_id = products.id
    `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
      res.status(500).send("Lỗi server");
    } else {
      res.json(results);
    }
  });
});

// Cập nhật trạng thái thanh toán
app.put("/api/cart/update-status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE cart SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", err);
      res.status(500).send("Lỗi server");
    } else {
      res
        .status(200)
        .json({ message: "Trạng thái thanh toán đã được cập nhật" });
    }
  });
});

//Cập nhật trạng thái thanh toán của từng sản phẩm
app.put("/api/cart/checkout-item/:id", (req, res) => {
  const { id } = req.params;

  const query = "UPDATE cart SET status = 'completed' WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Lỗi khi thanh toán sản phẩm:", err);
      res.status(500).send("Lỗi server");
    } else {
      res.status(200).json({ message: "Thanh toán sản phẩm thành công" });
    }
  });
});
// Cập nhật trạng thái đơn hàng
app.put("/api/admin/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE cart SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      res.status(500).send("Lỗi server");
    } else {
      res.status(200).json({ message: "Trạng thái đơn hàng đã được cập nhật" });
    }
  });
});

// Tính tổng doanh thu
app.get("/api/admin/revenue", (req, res) => {
  const query = `
      SELECT SUM(products.price * cart.quantity) AS total_revenue
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.status = 'received'
    `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi tính tổng doanh thu:", err);
      res.status(500).send("Lỗi server");
    } else {
      res.json(results[0]);
    }
  });
});

//Cập nhất số lượng sản phẩm trong giỏ hàng
app.put("/api/cart/update/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  console.log("Dữ liệu nhận được:", { id, quantity }); // Debug

  if (!id || !quantity || isNaN(quantity)) {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }

  const query = "UPDATE cart SET quantity = ? WHERE id = ?";
  db.query(query, [quantity, id], (err, results) => {
    if (err) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", err);
      res.status(500).send("Lỗi server");
    } else {
      res.status(200).json({ message: "Số lượng sản phẩm đã được cập nhật" });
    }
  });
});

// Lấy thông tin thanh toán
app.post("/api/payments", (req, res) => {
  const { user_id, product_id, name, address, phone, payment_method, amount } =
    req.body;

  const query = `
      INSERT INTO payments (user_id, product_id, name, address, phone, payment_method, amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  db.query(
    query,
    [user_id, product_id, name, address, phone, payment_method, amount],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi lưu thông tin thanh toán:", err);
        res.status(500).send("Lỗi server");
      } else {
        res
          .status(201)
          .json({ message: "Thông tin thanh toán đã được lưu thành công" });
      }
    }
  );
});

// Hủy đơn hàng và lưu lý do hủy
app.put("/api/cart/cancel/:id", (req, res) => {
  const { id } = req.params;
  const { cancellation_reason } = req.body;

  const query =
    "UPDATE cart SET status = 'cancelled', cancellation_reason = ? WHERE id = ?";
  db.query(query, [cancellation_reason, id], (err, results) => {
    if (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      res.status(500).send("Lỗi server");
    } else {
      res.status(200).json({ message: "Đơn hàng đã được hủy thành công" });
    }
  });
});

// server.js (hoặc file xử lý API của bạn)
app.put("/api/cart/received/:id", (req, res) => {
  const { id } = req.params;

  const query = "UPDATE cart SET status = 'received' WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      res
        .status(500)
        .json({ message: "Lỗi server khi cập nhật trạng thái đơn hàng" });
    } else {
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại" });
      }
      res
        .status(200)
        .json({ message: "Cập nhật trạng thái đơn hàng thành công" });
    }
  });
});
// API để lấy danh sách người dùng
app.get("/api/users", (req, res) => {
  const query = "SELECT id, name FROM users"; // Lấy id và username từ bảng users
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn MySQL:", err);
      res
        .status(500)
        .json({ message: "Lỗi server khi lấy danh sách người dùng" });
    } else {
      res.json(results);
    }
  });
});

// server.js (hoặc file API của bạn)
app.get("/api/admin/statistics", async (req, res) => {
  try {
    // Lấy tổng số người dùng (chỉ tính role là 'user')
    const totalUsersResult = await query(
      "SELECT COUNT(*) as total FROM users WHERE role = 'user'"
    );
    const totalUsers = totalUsersResult[0].total;

    // Lấy tổng số sản phẩm đã bán
    const totalProductsSoldResult = await query(
      "SELECT SUM(quantity) as total FROM cart WHERE status = 'received'"
    );
    const totalProductsSold = totalProductsSoldResult[0].total || 0;

    // Lấy tổng doanh thu
    const totalRevenueResult = await query(
      "SELECT SUM(products.price * cart.quantity) as total FROM cart JOIN products ON cart.product_id = products.id WHERE cart.status = 'received'"
    );
    const totalRevenue = totalRevenueResult[0].total || 0;

    // Lấy tổng số đơn hàng bị hủy
    const totalCancelledOrdersResult = await query(
      "SELECT COUNT(*) as total FROM cart WHERE status = 'cancelled'"
    );
    const totalCancelledOrders = totalCancelledOrdersResult[0].total || 0;

    res.json({
      totalUsers,
      totalProductsSold,
      totalRevenue,
      totalCancelledOrders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu thống kê" });
  }
});
// Đăng ký
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).send("Server error");
    res.status(200).send({ message: "User registered successfully" });
  });
});

// Đăng nhập
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).send("Server error");
    if (result.length === 0) return res.status(404).send("User not found");

    const user = result[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send("Invalid password");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "your_secret_key",
      { expiresIn: 86400 }
    ); // Thêm role vào token
    //     res.status(200).send({ auth: true, token, role: user.role }); // Trả về role
    //   });

    // Trả về thêm user_id
    res.status(200).send({
      auth: true,
      token,
      role: user.role,
      user_id: user.id, // Thêm user_id vào phản hồi
    });
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
