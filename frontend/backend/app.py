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

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "uploads"
)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db.init_app(app)

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "https://e-commerce-platform-pi-sooty.vercel.app",
            ],
            "methods": [
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
            ],
            "allow_headers": [
                "Content-Type",
                "Authorization",
            ],
        }
    }
)

jwt = JWTManager(app)

with app.app_context():
    db.create_all()

    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    admin_username = os.getenv("ADMIN_USERNAME", "admin")

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

        elif admin.role != "admin":
            admin.role = "admin"
            db.session.commit()

            print("✅ Existing account promoted to admin.")



def admin_required():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({
            "message": "Admin access required."
        }), 403

    return None


# ==========================
# HOME
# ==========================
@app.route("/")
def home():
    return {
        "message": "🚀 ShopSphere API Running!"
    }


# ==========================
# GET ALL PRODUCTS
# ==========================
@app.route("/products", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])


# ==========================
# ADD PRODUCT
# ==========================
@app.route("/products", methods=["POST"])
@jwt_required()
def add_product():

    check = admin_required()

    if check:
        return check

    data = request.get_json()

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
# UPDATE PRODUCT
# ==========================
@app.route("/products/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):

    check = admin_required()

    if check:
        return check
    product = Product.query.get_or_404(id)

    data = request.get_json()

    product.name = data["name"]
    product.price = data["price"]
    product.category = data["category"]
    product.image = data["image"]
    product.rating = data.get("rating", product.rating)

    db.session.commit()

    return jsonify(product.to_dict())


# ==========================
# DELETE PRODUCT
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
        "message": "Product deleted successfully"
    })


# ==========================
# UPLOAD IMAGE
# ==========================
@app.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():

    check = admin_required()

    if check:
        return check

    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400

    file = request.files["image"]

    if file.filename == "":
        return {"error": "No selected file"}, 400

    filename = secure_filename(file.filename)

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        filename
    )

    file.save(filepath)

    return {
    "image": f"{request.host_url.rstrip('/')}/uploads/{filename}"
}


# ==========================
# SERVE UPLOADED IMAGES
# ==========================
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )

# ==========================
# REGISTER
# ==========================
@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    # check email

    existing = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing:
        return {
            "message": "Email already exists."
        }, 400

    # hash password

    hashed_password = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = User(
        username=data["username"],
        email=data["email"],
        password=hashed_password,
        role="user"
    )

    db.session.add(user)
    db.session.commit()

    return {
        "message": "User registered successfully."
    }, 201

# ==========================
# LOGIN
# ==========================
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    # Hanapin ang user gamit ang email
    user = User.query.filter_by(
        email=data["email"]
    ).first()

    if not user:
        return {
            "message": "Invalid email or password."
        }, 401

    # I-check ang password
    if not bcrypt.checkpw(
        data["password"].encode("utf-8"),
        user.password.encode("utf-8")
    ):
        return {
            "message": "Invalid email or password."
        }, 401

    # Gumawa ng JWT token
    access_token = create_access_token(
    identity=str(user.id),
    additional_claims={
        "role": user.role
    }
)

    return {
        "message": "Login successful.",
        "token": access_token,
        "user": user.to_dict()
    }, 200


    # ==========================
# ==========================
# GET MY WISHLIST
# ==========================

@app.route("/wishlist", methods=["GET"])
@jwt_required()
def get_wishlist():

    user_id = int(get_jwt_identity())

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

    user_id = int(get_jwt_identity())

    data = request.get_json()

    product_id = data.get("product_id")

    if not product_id:
        return {
            "message": "Product ID is required."
        }, 400

    product = Product.query.get(product_id)

    if not product:
        return {
            "message": "Product not found."
        }, 404

    existing = Wishlist.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if existing:
        return {
            "message": "Product already in wishlist."
        }, 400

    wishlist = Wishlist(
        user_id=user_id,
        product_id=product_id
    )

    db.session.add(wishlist)
    db.session.commit()

    return {
        "message": "Added to wishlist.",
        "wishlist": wishlist.to_dict()
    }, 201

    # ==========================
# REMOVE FROM WISHLIST
# ==========================

@app.route("/wishlist/<int:product_id>", methods=["DELETE"])
@jwt_required()
def remove_from_wishlist(product_id):

    user_id = int(get_jwt_identity())

    wishlist = Wishlist.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if not wishlist:
        return {
            "message": "Product is not in wishlist."
        }, 404

    db.session.delete(wishlist)
    db.session.commit()

    return {
        "message": "Removed from wishlist."
    }

    # ==========================
# CHECKOUT
# ==========================
@app.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():

    data = request.get_json()

    cart_items = data.get("items", [])

    if not cart_items:
        return {
            "message": "Cart is empty."
        }, 400

    user_id = int(get_jwt_identity())

    total = 0

    order = Order(
        user_id=user_id,
        total=0
    )

    db.session.add(order)
    db.session.flush()

    for item in cart_items:

        product = Product.query.get(item["id"])

        if not product:
            continue

        quantity = item["quantity"]

        total += product.price * quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price=product.price
        )

        db.session.add(order_item)

    order.total = total

    db.session.commit()

    return {
        "message": "Order placed successfully.",
        "order": order.to_dict()
    }, 201

    # ==========================
# MY ORDERS
# ==========================
@app.route("/my-orders", methods=["GET"])
@jwt_required()
def my_orders():

    user_id = int(get_jwt_identity())

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
# GET ALL ORDERS (ADMIN)
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
# UPDATE ORDER STATUS
# ==========================
@app.route("/orders/<int:id>", methods=["PUT"])
@jwt_required()
def update_order(id):

    check = admin_required()

    if check:
        return check

    order = Order.query.get_or_404(id)

    data = request.get_json()

    order.status = data["status"]

    db.session.commit()

    return jsonify(order.to_dict())


if __name__ == "__main__":
    app.run(debug=True)