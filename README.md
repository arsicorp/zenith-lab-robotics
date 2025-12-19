# Zenith Lab

A full-stack ecommerce platform for buying and selling humanoid robots. Built for both individual consumers and businesses who need specialized robotics solutions.

## About the Project

Zenith Lab is an online marketplace where people and organizations can browse, compare, and purchase humanoid robots designed for different purposes - from household assistance to industrial automation to medical applications. The platform handles the complex business rules around who can purchase which types of robots (some robots require business licenses or medical certifications to buy).

The site features six flagship robot models:
- **KODA** - Household assistant robot for cleaning, cooking, and elderly care
- **SERVO** - Industrial robot for manufacturing and warehouse automation
- **NOVA** - Medical robot for surgical assistance and patient care
- **MAGMA** - Construction robot for heavy lifting and demolition work
- **EPSI-9** - Tactical unit for military and defense operations
- **SAGE** - Research platform for laboratories and field studies

Plus 16 accessories like charging stations, battery packs, and upgrade modules.

## Why This Project Exists

Selling advanced robotics isn't like selling regular products. Different robots have different legal requirements - you can't just let anyone buy a military-grade tactical robot or a medical surgical assistant. The platform solves this by validating buyer qualifications at checkout time.

When you create an account, you specify what type of buyer you are (personal, business, medical facility, or government agency). Then when you try to check out, the system verifies you're authorized to purchase everything in your cart. If not, it tells you exactly what account type you need.

## Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.x
- MySQL 8.0 database
- JWT authentication with BCrypt password hashing
- RESTful API design

**Frontend:**
- Vanilla JavaScript (no frameworks)
- Custom CSS with mobile-first responsive design
- Fetch API for HTTP requests

**Tools:**
- IntelliJ IDEA for development
- Insomnia for API testing
- MySQL Workbench for database management
- Git for version control

## Database Design

The database has 10 tables that work together:

**User management:**
- Users table stores login credentials and roles
- Profiles table stores personal info and the critical account_type field

**Product catalog:**
- Categories table for organizing products
- Products table with robot specs and buyer requirements

**Shopping experience:**
- Shopping_cart table links users to products with quantities
- Orders table stores completed purchases
- Order_line_items table stores what was in each order

**Extra features:**
- Jobs table for career postings
- Job_applications table for people applying to work here
- Sales_inquiries table for enterprise customers to contact us

The key innovation is the buyer_requirement field on products and account_type field on profiles. These two fields work together to enforce purchasing restrictions.

## Interesting Code: Buyer Restriction Validation

This is the heart of the business logic. When someone tries to check out, we validate every product in their cart against their account type:

```java
// get the user's cart and profile
ShoppingCart cart = shoppingCartDao.getByUserId(userId);
Profile profile = profileDao.getByUserId(userId);
String accountType = profile.getAccountType();

// check each product in the cart
for (ShoppingCartItem item : cart.getItems()) {
    Product product = item.getProduct();
    String buyerRequirement = product.getBuyerRequirement();
    
    // if product requires business account but user doesn't have one
    if ("BUSINESS".equals(buyerRequirement) && !"BUSINESS".equals(accountType)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
            "product " + product.getName() + " requires a business account");
    }
    
    // medical products require medical accounts
    if ("MEDICAL".equals(buyerRequirement) && !"MEDICAL".equals(accountType)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
            "product " + product.getName() + " requires a medical account");
    }
    
    // government products require government accounts
    if ("GOVERNMENT".equals(buyerRequirement) && !"GOVERNMENT".equals(accountType)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
            "product " + product.getName() + " requires a government account");
    }
}

// if we get here, all products passed validation
// create the order...
```

Notice the validation uses `"BUSINESS".equals(accountType)` instead of `accountType.equals("BUSINESS")`. This prevents null pointer exceptions if accountType is null - the string literal can never be null, so it's always safe to call equals on it.

This approach means the buyer restriction check happens at checkout, not when browsing products. Everyone can see all products, but only authorized buyers can complete purchases. This is better for the user experience since people can browse the full catalog and learn about different robots even if they can't buy certain models.

## Features

**For shoppers:**
- Browse products by category
- Filter by price range and color
- Compare up to three products side by side
- Add products to cart and manage quantities
- Secure checkout with address information
- View order history
- Update account profile
- Apply for jobs at Zenith Lab
- Submit sales inquiries for custom solutions

**For administrators:**
- Create, update, and delete products
- Manage product categories
- View all orders across all customers
- Review job applications
- Handle sales inquiries

## API Endpoints

**Authentication:**
- POST /register - Create new account
- POST /login - Get JWT token

**Products:**
- GET /products - List all (supports filters: cat, minPrice, maxPrice, color)
- GET /products/{id} - Get specific product
- GET /products/compare?ids=1,2,3 - Compare products
- POST /products - Create product (admin only)
- PUT /products/{id} - Update product (admin only)
- DELETE /products/{id} - Delete product (admin only)

**Categories:**
- GET /categories - List all categories
- GET /categories/{id} - Get specific category
- POST /categories - Create category (admin only)
- PUT /categories/{id} - Update category (admin only)
- DELETE /categories/{id} - Delete category (admin only)

**Shopping cart:**
- GET /cart - View cart
- POST /cart/products/{id} - Add to cart
- PUT /cart/products/{id} - Update quantity
- DELETE /cart - Clear cart

**Orders:**
- POST /orders - Place order (validates buyer restrictions)
- GET /orders - View your orders
- GET /orders/{id} - View order details

**Profile:**
- GET /profile - View profile
- PUT /profile - Update profile

**Jobs and inquiries:**
- GET /jobs - List open positions
- GET /jobs/{id} - Get job details
- POST /job-applications - Apply for job (no login required)
- POST /sales-inquiries - Contact sales (no login required)

**Admin:**
- GET /admin/orders - View all orders
- GET /admin/job-applications - View applications
- GET /admin/sales-inquiries - View inquiries

All endpoints except register, login, jobs, job-applications, and sales-inquiries require authentication via JWT token in the Authorization header.

## Setup Instructions

**Prerequisites:**
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

**Database setup:**
1. Start MySQL server
2. Open MySQL Workbench or MySQL command line
3. Run the SQL script:
   ```sql
   source /path/to/database_zenithlab.sql
   ```
4. verify the database was created:
   ```sql
   USE zenithlab;
   SHOW TABLES;
   ```
   You should see 10 tables

**Backend setup:**
1. Open the zenith-api folder in IntelliJ
2. Wait for Maven to download dependencies
3. Update application.properties if needed:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/zenithlab
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   ```
4. Run ZenithLabApplication.java
5. Backend should start on port 8080

**Frontend setup:**
1. Open zenith-client-web folder in IntelliJ
2. Right-click index.html
3. Select "Open in Browser"
4. IntelliJ will start a web server automatically

Alternatively, use Python:
```bash
cd zenith-client-web
python -m http.server 8000
```
Then open http://localhost:8000 in your browser

**Test it works:**
1. Go to http://localhost:8000 (or whatever port IntelliJ chose)
2. Click "Products" in the navigation
3. You should see six robots displayed
4. Click "Login" and use credentials: username "user", password "password"
5. Add a product to cart
6. Go to cart and proceed to checkout
7. Enter an address and place the order
8. Check your profile to see the order in your order history

## Demo Accounts

All accounts use password "password":

- **admin** - Administrator account, can manage products and categories
- **user** - Regular personal account, can only buy KODA (household robot)
- **businessuser** - Business account, can buy KODA, SERVO, MAGMA, and SAGE
- **medicaluser** - Medical facility account, can buy KODA and NOVA
- **govuser** - Government account, can buy all robots including EPSI-9

## Bugs Fixed During Development

**Bug 1: Product search filters broken**
- Problem: Price filters weren't working correctly
- Cause: SQL query used wrong comparison operators and missing maxPrice check
- Fix: Changed query to properly check both minPrice and maxPrice bounds
- Location: MySqlProductDao.java search() method

**Bug 2: Updating products created duplicates**
- Problem: Admin product updates created new products instead of modifying existing ones
- Cause: Controller called dao.create() instead of dao.update()
- Fix: Changed ProductsController.updateProduct() to call the correct method
- Location: ProductsController.java line 86

**Bug 3: Authentication always failed**
- Problem: Login always returned 401 unauthorized even with correct credentials
- Cause: BCrypt password hash in database didn't match the application's encoder
- Fix: Regenerated hash using application's encoder and updated all users
- Lesson: Always test password hashing after database setup

**Bug 4: Buyer restrictions not enforced**
- Problem: Checkout allowed unauthorized purchases
- Cause: Shopping cart DAO wasn't loading buyer_requirement field from database
- Fix: Added buyer_requirement to the SQL SELECT statement and mapped to product
- Location: MySqlShoppingCartDao.java

## Project Structure

```
zenith-lab-robotics/
├── zenith-api/                      # Spring Boot backend
│   ├── src/main/java/com/zenithlab/
│   │   ├── configurations/          # Database config
│   │   ├── controllers/             # REST endpoints
│   │   ├── data/                    # DAO interfaces
│   │   │   └── mysql/               # MySQL implementations
│   │   ├── models/                  # Java classes
│   │   └── security/                # JWT authentication
│   ├── src/main/resources/
│   │   └── application.properties
│   └── database/
│       └── database_zenithlab.sql
│
└── zenith-client-web/               # JavaScript frontend
    ├── index.html
    ├── products.html
    ├── product-detail.html
    ├── cart.html
    ├── checkout.html
    ├── auth.html
    ├── compare.html
    ├── careers.html
    ├── contact.html
    ├── profile.html
    ├── css/
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   └── pages.css
    └── js/
        ├── config.js
        ├── utils.js
        ├── auth.js
        ├── api.js
        ├── nav.js
        └── pages/
            └── [page-specific javascript files]
```

## Design Philosophy

The design takes inspiration from modern tech companies - lots of white space, minimal navigation, clean typography. The color scheme uses blue and green as primary brand colors, with each robot having its own signature color:

- KODA: Ceramic sand (warm beige)
- SERVO: Raw titanium (industrial gray)
- NOVA: Stellar white (pure white)
- MAGMA: Molten orange (high visibility orange)
- EPSI-9: Phantom black (stealth black)
- SAGE: Boreal green (forest green)

Headers use Cormorant Garamond (a serif font) for a premium feel, while body text uses Inter (sans serif) for readability. Product names are displayed in all caps and bold to make them stand out.

The layout is responsive and works on mobile devices, tablets, and desktop screens. Navigation is fixed at the top for easy access, and the cart badge updates in real-time as you add products.

## Testing with Insomnia

The project includes an Insomnia collection for testing all API endpoints. Import the collection file and you'll have pre-configured requests for:

- Authentication (register and login)
- Product management (CRUD operations)
- Category management
- Shopping cart operations
- Order placement
- Profile management
- Jobs and applications
- Sales inquiries

Each request includes example payloads and documentation on expected responses.

## Future Enhancements

Some ideas for improving the platform:

- Add product reviews and ratings
- Implement a wishlist feature
- Add real-time inventory tracking
- Create an admin dashboard with analytics
- Add email notifications for orders
- Implement product recommendations based on purchase history
- Add support for multiple payment methods
- Create a mobile app version
- Add live chat support
- Implement order tracking with status updates

## Challenges Overcome

**Buyer restriction complexity:**
The hardest part was designing a system that's flexible enough to handle different types of buyers while being simple to maintain. We settled on storing buyer requirements on products and account types on profiles, then validating at checkout. This keeps the logic centralized and easy to test.

**Password hashing:**
Getting BCrypt working correctly took some debugging. The hash format matters - it has to be generated by the same encoder that validates it. We learned to always test authentication immediately after setting up the database.

**Responsive design:**
Making the site look good on all screen sizes required careful CSS planning. We used a mobile-first approach and added breakpoints for larger screens. The product grid automatically adjusts from 1 column on phones to 3 columns on desktop.

**SQL query optimization:**
The product search needed to handle multiple optional filters efficiently. We used conditional logic in the WHERE clause to skip filters when parameters aren't provided, which keeps the queries fast even with a large product catalog.

## What I Learned

Building this project taught me a lot about full-stack development:

- How to design a database schema that supports complex business rules
- How JWT authentication works and why it's better than session-based auth
- How to write clean, maintainable SQL queries with prepared statements
- How to structure a REST API with proper HTTP status codes
- How to handle cross-origin requests between frontend and backend
- How to write JavaScript without relying on frameworks
- How to debug authentication issues systematically
- How to use Git effectively for version control

The biggest lesson was that good planning saves time. We spent time upfront designing the database schema and API structure, which made implementation much smoother. When we hit bugs, we fixed them systematically by testing one thing at a time rather than making random changes.

## Credits

Developed by Arsi
December 2025

Built as a capstone project to demonstrate full-stack development skills including backend API design, database architecture, frontend development, and deployment.

## Contact

For questions or feedback about this project, submit a sales inquiry through the contact page or connect via GitHub.
