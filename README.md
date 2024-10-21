# Fullstack development

# Myjamii Store E-commerce App

Welcome to your no.1 most trusted online store. We are more than proud to serve you, our dear beloved customer.

In the following is a well-outlined structure of the app and how it works.

## App Structure
```arduino
myjamii-store/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── Signup.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   ├── images/
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── .gitignore
│   ├── eslint.config.js
├── server/
│   ├── migrations/
│   ├── models.py
│   ├── app.py
│   ├── alembic.ini
│   ├── seed.py
│   ├── Pipfile
│   ├── Pipfile.lock
│   ├── requirements.txt
├── images/
│   ├── image.jpg


```
# FRONTEND CONFIGURATION
## Description

- *App*: The main component that renders the overall layout of the application.
- *Navbar*: Provides navigation links.
- *Main Content*: Uses a flex container to display the primary content and sidebar.
  - *CategoryFilter*: Allows users to filter products by category.
  - *Outlet*: Renders dynamic content based on the route.
    - *Products*: Displays a list of products with their details and an "Add to Cart" button.
    - *ProductDetail*: Shows detailed information about a single product.
    - *AddProduct*: Contains a form for adding new products.
    - *Checkout*: Manages the checkout process with a cart summary and a checkout form.
- *Sidebar*: Displays the shopping cart.
  - *Cart*: Lists cart items, shows the total, and includes a "Proceed to Checkout" button.
- *Footer*: Contains additional information and links.

## Component Details

### App.jsx

The App component is the main component that serves as the central hub for managing application state and rendering various parts of the UI.

*Purpose*:
- Manage Application State: Handles the state for products, cart items, categories, and the selected category.
- Fetch Data: Retrieves product data and categories from the server.
- Rendering: Displays the main content area, including a category filter, product list, and shopping cart.

*Logic and Functionality*:
- State Management
- Data Fetching with useEffect
- Cart Management Functions
- Category Handling
- Rendering the UI

### Products.jsx

The Products component is designed to display a list of products, with the ability to filter products by category and add products to a shopping cart.

*Purpose*:
- Display Products: Renders a list of product cards.
- Filter Products: Shows products based on the selected category.
- Add to Cart: Allows users to add products to their shopping cart.
- Product Details: Provides a link to view detailed information about each product.

*Logic and Functionality*:
- Context Access
- Filtering Products
- Rendering Product Cards

### ProductDetail.jsx

The ProductDetail component is designed to display detailed information about a specific product.

*Purpose*:
- Retrieve and display detailed information for a specific product.

*Logic and Functionality*:
- Extracting the Product ID
- Managing State
- Fetching Product Data
- Loading State
- Rendering Product Details

### AddProduct.jsx

The AddProduct component allows users to input details about a new product and submit these details to a backend server.

*Purpose*:
- Enable users or administrators to add new products to the database.

*Logic and Functionality*:
- State Management
- Handle Input Changes
- Handle Form Submission
- Form JSX

### CategoryFilter.jsx

The CategoryFilter component allows users to filter products based on their categories.

*Purpose*:
- Provide a dropdown menu for users to select a category and filter products.

*Logic and Functionality*:
- Props
- Rendering the Dropdown
- Populating the Dropdown
- Display and Layout

### Cart.jsx

The Cart component is designed to display the shopping cart's contents, calculate the total price of the items, and provide options to remove

*Purpose*:
- Display the shopping cart's contents
- Calculate the total price of items
- Provide options to remove items or proceed to checkout

*Logic and Functionality*:
- Props
- Total Calculation
- Render Logic
- Conditional Rendering
- CSS Styling (Inline)

### Checkout.jsx

The Checkout component is designed to handle the checkout process for a shopping cart.

*Purpose*:
- Display a summary of cart items
- Calculate the total amount
- Provide a form for users to enter payment information

*Logic and Functionality*:
- Using Outlet Context
- Handling Form Submission
- Displaying Cart Summary
- Rendering the Checkout Form

### Main.jsx

The Root component sets up the routing and state management for the React application.

*Purpose*:
- Routing Configuration
- State Management
- Render Main Application

*Logic and Functionality*:
- State Management
- Cart Management Functions
- Router Setup
- Route Configuration
- Rendering the Component Tree

## Styling (index.css)

### Media Queries

Media queries are used to apply different styles based on the screen width, ensuring that the layout adapts to various devices.

- For screens up to 1200px
- For screens up to 992px
- For screens up to 768px
- For screens up to 576px
- Checkout page adjustments for up to 768px

### Global Styles

- Body
- Navigation
- Main Content and Layout
- Product Cards
- Buttons and Links
- Forms and Inputs

## Summary

The Myjamii Store E-commerce App is a comprehensive online shopping platform with the following key features:

1. Responsive Design: Adapts to different screen sizes for optimal user experience.
2. Product Management: Displays products, allows filtering by category, and provides detailed product views.
3. Shopping Cart: Users can add items to cart, view cart contents, and proceed to checkout.
4. Checkout Process: Simulates a payment process (for demonstration purposes).
5. Admin Functionality: Includes an interface for adding new products to the store.
6. State Management: Efficiently manages application state for products, cart, and user interactions.
7. Routing: Utilizes React Router for seamless navigation between different views.

This application demonstrates a full-featured e-commerce solution, showcasing React's capabilities in building interactive and dynamic web applications.
## Technologies Used

- React.js
- React Router for navigation
- Axios for API requests
- CSS for styling (with inline styles for components)
- React Icons for UI icons
## Installation and Setup

1. Clone the repository:
2. Navigate to the project directory:
3. Install dependencies:
4. Start the development server:
5. Open http://localhost:3000 in your browser to view the application.

## API Integration

The application integrates with a backend API hosted at https://myjamii-store.onrender.com. Ensure the API is running and accessible for full functionality.

## Contributing

Contributions to Myjamii Store are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: git checkout -b feature-name
3. Make your changes and commit them: git commit -m 'Add some feature'
4. Push to the branch: git push origin feature-name
5. Submit a pull request

## SERVER SIDE CONFIGURATIONS

### ERD DIAGRAM 

[image](./images/image.png)

## RELATIONSHIP
  #### Database Schema
- users stores information about users of the platform.
- carts represents shopping carts created by users. A cart belongs to a user through the user_id foreign key.
- products stores information about products sold on the platform.
- product_categories acts as a bridge between products and categories. A product can belong to multiple categories.
- categories stores information about the different categories of products.
- cart_items stores information about the items added to a cart. A cart item links a cart to a product and specifies the quantity.

    ### Relationship Breakdown

    - One-to-many relationship:

        - A user can have multiple carts.
        - A product can be in multiple carts.
        - A category can have multiple products.
        - A cart can have multiple cart items.
    - Many-to-many relationship:

       -  A product can belong to multiple categories.

# INSTALLATION
1. Clone the repo

2. install all dependancies
```python
pip install flask flask_sqalachemy flask_migrate flask_restful flask_cors gunicorn psycopg2-binary

```
3. Setup database
```python
flask db init
flask db migrate -m'initial migration'
flask db upgrade

```

4. Run the app.py
```python
python app.py

```

# Database Models

1. ### Users

1. User
Represents a user in the system. A user can have multiple carts and has attributes such as username, email, password, and role.

- Fields:

-id: Primary key.
- username: Unique username for each user.
-email: Unique email address.
- password: Hashed password for authentication.
- role: Role of the user (default: 'user').
- Relationships: One-to-many with Cart.

2. ### Product

Represents a product that can be added to a cart and purchased.

   - Fields:

   - id: Primary key.
   - name: Name of the product.
   - description: Optional description.
   -  price: Price of the product.
   - stock: Number of items available.
   -  image_url: Optional URL to the product image.
    - category_id: Foreign key linking to a Category.
    - Relationships:Many-to-one with Category.

    

3. ### Cart
Represents a cart that belongs to a user and contains multiple cart items.

   - Fields:
   - id: Primary key.
    - user_id: Foreign key linking to User.
   - Relationships:One-to-many with CartItem.
    

4. ### CartItem
Represents an item in a cart, associated with a specific product and quantity.

   - Fields:
   - id: Primary key.
    - cart_id: Foreign key linking to Cart.
    - product_id: Foreign key linking to Product.
    - quantity: Number of units for this product in the cart.

5. ### Category
Represents a product category, such as electronics, clothing, etc.

   - Fields:
    - id: Primary key.
    - name: Name of the category.
    - description: Optional description of the category.

6. ### ProductCategory
An association table linking products and categories, implementing a many-to-many relationship.

# API ENDPOINTS
### User Authentication
   - POST /login
Allows users to log in using their username and password.
Example Response:
```python
{
  "message": "User logged in successfully",
  "user": { "id": 1, "username": "test_user", "role": "user" }
}

```
   - POST /signup
Allows new users to sign up by providing a username, email, and password.
Example Response:
```python 
{
  "message": "User created successfully",
  "user": { "id": 1, "username": "test_user", "role": "user" }
}

```
### Product Management
   - GET /products
Retrieves all products. Can also retrieve products by category.

   - POST /products
Creates a new product (requires admin role).
Request body example:
```python
{
  "name": "Product 1",
  "description": "This is a test product",
  "price": 19.99,
  "stock": 100,
  "category_id": 1,
  "image_url": "http://example.com/image.jpg"
}

```
   - PUT /products/<product_id>
Updates an existing product by its ID.

   - DELETE /products/<product_id>
Deletes a product by its ID.

   - POST /products/<product_id>/reduce_stock
Reduces the stock of a product by a specific quantity.

### Category Management
   - GET /categories
Retrieves all categories.

  -  POST /categories
Creates a new category (requires admin role).

   - PUT /categories/<category_id>
Updates a category by its ID.

   - DELETE /categories/<category_id>
Deletes a category by its ID.

# Conclusion
Fullstack development is about understanding the technicalities involved in the user stories. From ideation to sketching and developing the databases to have a working data to be later used in deploying the client side.

one of the most challenging parts of this whole process is actual implemetation and performance of the api endpoints, where to be called and which functionality. All in all is been an awesome experince and to more with this, Cheers.