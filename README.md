# E-Commerce Platform

A full-stack e-commerce platform built with React, Flask, SQLite, and JWT authentication.

## 🚀 Features

- User Registration
- User Login
- JWT Authentication
- Product Listing
- Product Search
- Category Filtering
- Product Sorting
- Product Details
- Shopping Cart
- Wishlist
- Checkout
- Order Management
- Admin Dashboard
- Admin Order Management
- Product Management
- Responsive UI
- Dark Mode

## 🛠️ Technologies

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios
- React Icons

### Backend
- Python
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- SQLite
- Flask-CORS

## 📁 Project Structure

```text
E-Commerce-Platform/
│
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── ...
│
├── public/
├── app.py
├── models.py
├── requirements.txt
├── package.json
├── package-lock.json
├── vite.config.js
└── index.html

##⚙️ Installation
Frontend
npm install
npm run dev

The frontend will run on:

http://localhost:5173

###Backend

Create a Python virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

##Install dependencies:

pip install -r requirements.txt

Create a .env file for the JWT secret.

Then run:

python app.py

The backend will run on:

http://127.0.0.1:5000
🔐 Authentication

The application uses JWT authentication for user and admin accounts.

Sensitive environment variables such as JWT secrets should be stored in .env and should not be committed to GitHub.

👨‍💻 Author

Adolfo Reoja

Developer Portfolio Project


