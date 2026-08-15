from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

from werkzeug.utils import secure_filename

from models import (
    db,
    Product,
    User,
    Order,
    OrderItem,
    Wishlist
)

import bcrypt
import os


# ==========================
# CREATE APP
# ==========================

app = Flask(__name__)


# ==========================
# CORS CONFIGURATION
# ==========================

CORS(app)


@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")

    allowed_origins = [
        "https://e-commerce-platform-pi-sooty.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
    else:
        response.headers["Access-Control-Allow-Origin"] = "*"

    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization"
    )

    response.headers["Access-Control-Allow-Methods"] = (
        "GET, POST, PUT, DELETE, OPTIONS"
    )

    return response



# ==========================
# DATABASE CONFIGURATION
# ==========================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///products.db"
)

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql://",
        1
    )

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# ==========================
# JWT CONFIGURATION
# ==========================

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    "dev-secret-key-change-this"
)


# ==========================
# UPLOAD CONFIGURATION
# ==========================

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "uploads"
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==========================
# INITIALIZE DATABASE
# ==========================

db.init_app(app)


# ==========================
# INITIALIZE JWT
# ==========================

jwt = JWTManager(app)


# ==========================
# CREATE DATABASE TABLES
# AND DEFAULT ADMIN
# ==========================

with app.app_context():

    db.create_all()

    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    admin_username = os.getenv(
        "ADMIN_USERNAME",
        "admin"
    )

    if admin_email and admin_password:

        admin = User.query.filter_by(
            email=admin_email
        ).first()

        if not admin:

            hashed_password = bcrypt.hashpw(
                admin_password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

            admin = User(
                username=admin_username,
                email=admin_email,
                password=hashed_password,
                role="admin"
            )

            db.session.add(admin)
            db.session.commit()

            print("✅ Default admin account created.")

        else:

            admin.username = admin_username
            admin.role = "admin"

            admin.password = bcrypt.hashpw(
                admin_password.encode("utf-8"),
                bcrypt.gensalt()
            ).decode("utf-8")

            db.session.commit()

            print("✅ Admin account updated.")

# ==========================
# ADMIN REQUIRED FUNCTION
# ==========================

def admin_required():

    claims = get_jwt()

    if claims.get("role") != "admin":

        return jsonify({
            "message": "Admin access required."
        }), 403

    return None


# ==========================
# HOME / API TEST
# ==========================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "🚀 ShopSphere API Running!"
    })


# ==========================
# GET ALL PRODUCTS
# ==========================

@app.route("/products", methods=["GET"])
def get_products():

    products = Product.query.all()

    return jsonify([
        product.to_dict()
        for product in products
    ])


# ==========================
# ADD PRODUCT - ADMIN
# ==========================

@app.route("/products", methods=["POST"])
@jwt_required()
def add_product():

    check = admin_required()

    if check:
        return check

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No product data received."
        }), 400

    required_fields = [
        "name",
        "price",
        "category",
        "image"
    ]

    for field in required_fields:

        if field not in data:

            return jsonify({
                "message": f"{field} is required."
            }), 400

    product = Product(
        name=data["name"],
        price=data["price"],
        category=data["category"],
        image=data["image"],
        rating=data.get("rating", 5),
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(product.to_dict()), 201


# ==========================
# UPDATE PRODUCT - ADMIN
# ==========================

@app.route("/products/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):

    check = admin_required()

    if check:
        return check

    product = Product.query.get_or_404(id)

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "No product data received."
        }), 400

    product.name = data.get(
        "name",
        product.name
    )

    product.price = data.get(
        "price",
        product.price
    )

    product.category = data.get(
        "category",
        product.category
    )

    product.image = data.get(
        "image",
        product.image
    )

    product.rating = data.get(
        "rating",
        product.rating
    )

    db.session.commit()

    return jsonify(product.to_dict())


# ==========================
# DELETE PRODUCT - ADMIN
# ==========================

@app.route("/products/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):

    check = admin_required()

    if check:
        return check

    product = Product.query.get_or_404(id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted successfully."
    })


# ==========================
# UPLOAD IMAGE - ADMIN
# ==========================

@app.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():

    check = admin_required()

    if check:
        return check

    if "image" not in request.files:

        return jsonify({
            "message": "No image uploaded."
        }), 400

    file = request.files["image"]

    if file.filename == "":

        return jsonify({
            "message": "No selected file."
        }), 400

    filename = secure_filename(file.filename)

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        filename
    )

    file.save(filepath)

    image_url = (
        f"{request.host_url.rstrip('/')}"
        f"/uploads/{filename}"
    )

    return jsonify({
        "message": "Image uploaded successfully.",
        "image": image_url
    })


# ==========================
# GET UPLOADED IMAGE
# ==========================

@app.route("/uploads/<filename>", methods=["GET"])
def uploaded_file(filename):

    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


# ==========================
# REGISTER USER
# ==========================

@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "No registration data received."
        }), 400

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not username or not email or not password:

        return jsonify({
            "message": (
                "Username, email and password "
                "are required."
            )
        }), 400

    existing = User.query.filter_by(
        email=email
    ).first()

    if existing:

        return jsonify({
            "message": "Email already exists."
        }), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = User(
        username=username,
        email=email,
        password=hashed_password,
        role="user"
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully.",
        "user": user.to_dict()
    }), 201


# ==========================
# LOGIN
# ==========================

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "Email and password are required."
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:

        return jsonify({
            "message": "Email and password are required."
        }), 400

    # ==========================
    # FIND USER
    # ==========================

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        print(f"❌ Login failed. User not found: {email}")

        return jsonify({
            "message": "Invalid email or password."
        }), 401

    # ==========================
    # CHECK PASSWORD
    # ==========================

    try:

        password_correct = bcrypt.checkpw(
            password.encode("utf-8"),
            user.password.encode("utf-8")
        )

    except Exception as e:

        print("❌ Password check error:", str(e))

        return jsonify({
            "message": "Login failed. Password error."
        }), 500

    if not password_correct:

        print(
            f"❌ Incorrect password for: {email}"
        )

        return jsonify({
            "message": "Invalid email or password."
        }), 401

    # ==========================
    # CREATE JWT TOKEN
    # ==========================

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role
        }
    )

    print(
        f"✅ Login successful: {email} "
        f"| Role: {user.role}"
    )

    return jsonify({
        "message": "Login successful.",
        "token": access_token,
        "user": user.to_dict()
    }), 200


# ==========================
# GET WISHLIST
# ==========================

@app.route("/wishlist", methods=["GET"])
@jwt_required()
def get_wishlist():

    user_id = int(
        get_jwt_identity()
    )

    wishlist_items = Wishlist.query.filter_by(
        user_id=user_id
    ).all()

    return jsonify([
        item.to_dict()
        for item in wishlist_items
    ])


# ==========================
# ADD TO WISHLIST
# ==========================

@app.route("/wishlist", methods=["POST"])
@jwt_required()
def add_to_wishlist():

    user_id = int(
        get_jwt_identity()
    )

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "No wishlist data received."
        }), 400

    product_id = data.get("product_id")

    if not product_id:

        return jsonify({
            "message": "Product ID is required."
        }), 400

    product = Product.query.get(
        product_id
    )

    if not product:

        return jsonify({
            "message": "Product not found."
        }), 404

    existing = Wishlist.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if existing:

        return jsonify({
            "message": "Product already in wishlist."
        }), 400

    wishlist = Wishlist(
        user_id=user_id,
        product_id=product_id
    )

    db.session.add(wishlist)
    db.session.commit()

    return jsonify({
        "message": "Added to wishlist.",
        "wishlist": wishlist.to_dict()
    }), 201


# ==========================
# REMOVE FROM WISHLIST
# ==========================

@app.route(
    "/wishlist/<int:product_id>",
    methods=["DELETE"]
)
@jwt_required()
def remove_from_wishlist(product_id):

    user_id = int(
        get_jwt_identity()
    )

    wishlist = Wishlist.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if not wishlist:

        return jsonify({
            "message": (
                "Product is not in wishlist."
            )
        }), 404

    db.session.delete(wishlist)
    db.session.commit()

    return jsonify({
        "message": "Removed from wishlist."
    })


# ==========================
# CHECKOUT
# ==========================

@app.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():

    data = request.get_json()

    if not data:

        return jsonify({
            "message": "No checkout data received."
        }), 400

    cart_items = data.get("items", [])

    if not cart_items:

        return jsonify({
            "message": "Cart is empty."
        }), 400

    user_id = int(
        get_jwt_identity()
    )

    total = 0

    order = Order(
        user_id=user_id,
        total=0
    )

    db.session.add(order)
    db.session.flush()

    for item in cart_items:

        product_id = item.get("id")
        quantity = item.get("quantity", 1)

        product = Product.query.get(
            product_id
        )

        if not product:
            continue

        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            quantity = 1

        if quantity < 1:
            quantity = 1

        total += (
            product.price * quantity
        )

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price
        )

        db.session.add(order_item)

    if total == 0:

        db.session.rollback()

        return jsonify({
            "message": (
                "No valid products found."
            )
        }), 400

    order.total = total

    db.session.commit()

    return jsonify({
        "message": "Order placed successfully.",
        "order": order.to_dict()
    }), 201


# ==========================
# GET MY ORDERS
# ==========================

@app.route("/my-orders", methods=["GET"])
@jwt_required()
def my_orders():

    user_id = int(
        get_jwt_identity()
    )

    orders = Order.query.filter_by(
        user_id=user_id
    ).order_by(
        Order.created_at.desc()
    ).all()

    return jsonify([
        order.to_dict()
        for order in orders
    ])


# ==========================
# GET ALL ORDERS - ADMIN
# ==========================

@app.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():

    check = admin_required()

    if check:
        return check

    orders = Order.query.order_by(
        Order.created_at.desc()
    ).all()

    return jsonify([
        order.to_dict()
        for order in orders
    ])


# ==========================
# UPDATE ORDER - ADMIN
# ==========================

@app.route(
    "/orders/<int:id>",
    methods=["PUT"]
)
@jwt_required()
def update_order(id):

    check = admin_required()

    if check:
        return check

    order = Order.query.get_or_404(
        id
    )

    data = request.get_json()

    if not data or "status" not in data:

        return jsonify({
            "message": "Status is required."
        }), 400

    order.status = data["status"]

    db.session.commit()

    return jsonify(
        order.to_dict()
    )


# ==========================
# RUN APP
# ==========================

if __name__ == "__main__":

    port = int(
        os.environ.get("PORT", 5000)
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )