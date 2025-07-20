```markdown
# 🛒 Admin E-Commerce System – Full Stack Developer Practical Test

This is an **Admin-side E-Commerce Management System** built with **React.js**, **Node.js (Express)**, and **MySQL**.  
It allows administrators to **manage product categories** (with multi-level nesting) and **perform CRUD operations on products** with image uploads and multi-category assignment.

---

## 📁 Project Structure

---

## 🚀 Tech Stack

- **Frontend**: React.js, Axios, React Router DOM, React Toastify
- **Backend**: Node.js, Express.js, MySQL2, Multer, Dotenv, Cors
- **Database**: MySQL

---

## ⚙️ Setup Instructions

### 🔹 Prerequisites

- Node.js & npm installed
- MySQL server running
- (Optional) `nodemon` for backend auto-reloading

---

## 🖥️ Backend Setup (`/backend`)

### 1. Install dependencies

```bash
cd backend
npm install
````

### 2. Configure environment variables

Create a `.env` file in the `backend/` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecommerce
```

### 3. Import MySQL schema

Import `ecommerce.sql` into your local MySQL server using MySQL Workbench or CLI:

```bash
mysql -u root -p ecommerce < ecommerce.sql
```

### 4. Run backend server

```bash
npm start
```

This will start the server on `http://localhost:8180`.

If you’re using `index.js` as your entry file:

```bash
node index.js
```

---

## 🌐 Frontend Setup (`/frontend`)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Update API base URL

In your React app (e.g., in `axios` instance or `.env`):

```js
REACT_APP_API_BASE_URL=http://localhost:8180/api
```

Make sure your React components use this base URL for making requests.

### 3. Start frontend

```bash
npm start
```

App will run at `http://localhost:3000`.

---

## 📡 API Endpoints

### 📂 Category Routes

```
GET     /api/categories
POST    /api/categories
PUT     /api/categories/:id
DELETE  /api/categories/:id
```

### 📦 Product Routes

```
GET     /api/products
POST    /api/products
PUT     /api/products/:id
DELETE  /api/products/:id
```

---

## 📸 Image Uploads

* Images are uploaded using `multer` to the `public/images/` directory (or any custom path).

---

## ✅ Features Summary

* Multi-level category management
* Product management with multi-category assignment
* Image upload for products
* Backend and frontend validations
* Responsive admin interface (optional enhancement)

---

## 📬 Author

Kalana Kalhara
Full Stack Developer Practical Test
