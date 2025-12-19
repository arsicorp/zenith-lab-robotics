-- zenith lab database
-- humanoid robotics ecommerce platform
-- december 2025

DROP DATABASE IF EXISTS zenithlab;
CREATE DATABASE zenithlab;
USE zenithlab;

-- user authentication tables
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id)
);

-- extended user profile with account type for buyer restrictions
CREATE TABLE profiles (
    user_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    zip VARCHAR(20),
    account_type VARCHAR(50) NOT NULL DEFAULT 'PERSONAL',
    company_name VARCHAR(100),
    tax_id VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- product categories
CREATE TABLE categories (
    category_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    PRIMARY KEY (category_id)
);

-- products including robots and accessories
CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    color VARCHAR(50),
    stock INT NOT NULL DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(200),
    detail_image_url VARCHAR(200),

    -- robot specifications
    ai_model VARCHAR(100),
    height_cm INT,
    weight_kg DECIMAL(6,2),
    payload_kg DECIMAL(6,2),
    battery_hours DECIMAL(4,1),
    speed_kmh DECIMAL(4,1),
    autonomy_level VARCHAR(50),
    
    -- business rules
    buyer_requirement VARCHAR(50) DEFAULT 'NONE',
    warranty_years INT DEFAULT 2,
    use_cases TEXT,
    compatible_robots TEXT,
    
    PRIMARY KEY (product_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    INDEX idx_category (category_id),
    INDEX idx_featured (featured),
    INDEX idx_buyer_requirement (buyer_requirement)
);

-- shopping cart items
CREATE TABLE shopping_cart (
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- order headers
CREATE TABLE orders (
    order_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    zip VARCHAR(20),
    shipping_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    order_total DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_date (date)
);

-- individual order items
CREATE TABLE order_line_items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    sales_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0.00,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- career job postings
CREATE TABLE jobs (
    job_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary_range VARCHAR(100),
    posted_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    PRIMARY KEY (job_id),
    INDEX idx_status (status),
    INDEX idx_department (department)
);

-- job applications (no login required)
CREATE TABLE job_applications (
    application_id INT NOT NULL AUTO_INCREMENT,
    job_id INT NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    resume_url VARCHAR(500),
    cover_letter TEXT,
    applied_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    PRIMARY KEY (application_id),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id),
    INDEX idx_job (job_id),
    INDEX idx_status (status),
    INDEX idx_email (email)
);

-- enterprise sales inquiries
CREATE TABLE sales_inquiries (
    inquiry_id INT NOT NULL AUTO_INCREMENT,
    product_id INT,
    contact_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    inquiry_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW',
    PRIMARY KEY (inquiry_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    INDEX idx_product (product_id),
    INDEX idx_status (status),
    INDEX idx_date (inquiry_date)
);

-- demo users with different account types
-- all passwords are: password
-- BCrypt hash for "password" with cost 10 (verified working hash)
INSERT INTO users (username, hashed_password, role) VALUES
('admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN'),
('user', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER'),
('businessuser', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER'),
('medicaluser', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER'),
('govuser', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER');

INSERT INTO profiles (user_id, first_name, last_name, phone, email, address, city, state, zip, account_type, company_name, verified) VALUES
(1, 'Admin', 'User', '555-0001', 'admin@zenithlab.com', '123 Tech Street', 'San Francisco', 'CA', '94105', 'PERSONAL', NULL, TRUE),
(2, 'Kenji', 'Yamamoto', '555-0002', 'k.yamamoto@email.com', '2847 Pine Street', 'Seattle', 'WA', '98101', 'PERSONAL', NULL, TRUE),
(3, 'Elena', 'Schmidt', '555-0003', 'elena.schmidt@techcorp.com', '1520 Innovation Drive', 'Austin', 'TX', '78701', 'BUSINESS', 'TechCorp Industries', TRUE),
(4, 'Dr. Priya', 'Kapoor', '555-0004', 'p.kapoor@healthplus.com', '890 Medical Plaza', 'Boston', 'MA', '02108', 'MEDICAL', 'HealthPlus Medical Group', TRUE),
(5, 'Marcus', 'Rodriguez', '555-0005', 'm.rodriguez@defense.gov', '1400 Defense Boulevard', 'Arlington', 'VA', '22202', 'GOVERNMENT', 'US Department of Defense', TRUE);

-- product categories
INSERT INTO categories (name, description) VALUES
('Household Robots', 'Advanced humanoid robots designed for home assistance, cleaning, cooking, and elderly care'),
('Industrial Robots', 'Heavy duty robots for manufacturing, warehouse automation, and logistics operations'),
('Medical Robots', 'Precision healthcare robots for surgical assistance, patient care, and laboratory work'),
('Construction Robots', 'Powerful robots built for construction sites, heavy lifting, and demolition work'),
('Military & Defense', 'Elite tactical robots for surveillance, reconnaissance, and security operations'),
('Research Robots', 'Versatile platforms for scientific research, agricultural work, and field studies'),
('Accessories & Components', 'Batteries, charging stations, upgrade modules, and maintenance equipment');

-- flagship robots
INSERT INTO products (name, price, category_id, description, color, stock, featured, image_url, detail_image_url, ai_model, height_cm, weight_kg, payload_kg, battery_hours, speed_kmh, autonomy_level, buyer_requirement, warranty_years, use_cases) VALUES

('KODA Household Robot', 34999.00, 1,
'The ultimate home assistant. KODA seamlessly handles cleaning, cooking, laundry, elderly care, and garden maintenance. Powered by advanced AI, KODA learns your preferences and adapts to your household needs. With its gentle touch and intelligent navigation, KODA becomes an indispensable member of your family.',
'Ceramic Sand', 25, TRUE, 'images/robots/koda-grid.jpg', 'images/robots/koda-detail.jpg',
'Zenith Neural OS v3.2', 165, 58.5, 15.0, 16.0, 4.5, 'Fully Autonomous',
'NONE', 3, 'cleaning,cooking,laundry,elderly care,garden maintenance,home security'),

('SERVO Industrial Robot', 189999.00, 2,
'Complete industrial automation solution. SERVO excels at assembly line work, warehouse logistics, quality control, and heavy material handling. Built for 24/7 operation in demanding environments, SERVO increases productivity while maintaining precision. Industry 4.0 ready with full IoT integration.',
'Raw Titanium', 15, TRUE, 'images/robots/servo-grid.jpg', 'images/robots/servo-detail.jpg',
'Zenith Industrial AI v2.8', 180, 125.0, 250.0, 12.0, 6.0, 'Semi-Autonomous',
'BUSINESS', 5, 'assembly,logistics,quality control,material handling,warehouse automation,manufacturing'),

('NOVA Medical Robot', 349999.00, 3,
'Advanced healthcare automation. NOVA assists with surgical procedures, patient mobility, laboratory automation, and clinical care. FDA compliant with medical grade precision sensors. NOVA reduces staff workload while improving patient outcomes. Seamlessly integrates with hospital systems.',
'Stellar White', 8, TRUE, 'images/robots/nova-grid.jpg', 'images/robots/nova-detail.jpg',
'Zenith MedAI v4.1 (FDA Certified)', 170, 72.0, 35.0, 10.0, 3.5, 'Semi-Autonomous',
'MEDICAL', 5, 'surgical assistance,patient care,mobility assistance,laboratory automation,sterilization,medical transport'),

('MAGMA Construction Robot', 289999.00, 4,
'Total construction powerhouse. MAGMA handles heavy material handling, precision installation, demolition work, and site preparation. Weatherproof and rugged, built for extreme conditions. With 500kg payload capacity, MAGMA replaces multiple workers while ensuring safety and efficiency.',
'Molten Orange', 10, TRUE, 'images/robots/magma-grid.jpg', 'images/robots/magma-detail.jpg',
'Zenith Construction AI v2.5', 210, 185.0, 500.0, 8.0, 5.5, 'Semi-Autonomous',
'BUSINESS', 3, 'material handling,demolition,installation,site preparation,heavy lifting,excavation support'),

('EPSI-9 Tactical Unit', 799999.00, 5,
'Elite tactical operations robot. EPSI-9 provides surveillance, reconnaissance, perimeter security, and tactical support. Military grade durability with encrypted communication systems. ITAR compliant. Requires government authorization for purchase. Trusted by defense forces worldwide.',
'Phantom Black', 5, FALSE, 'images/robots/epsi-9-grid.jpg', 'images/robots/epsi-9-detail.jpg',
'Zenith Tactical AI v5.0 (Classified)', 185, 145.0, 150.0, 18.0, 15.0, 'Semi-Autonomous',
'GOVERNMENT', 5, 'surveillance,reconnaissance,perimeter security,tactical support,bomb disposal,search and rescue'),

('SAGE Research Platform', 99999.00, 6,
'Versatile research and development platform. SAGE is designed for laboratory work, field research, agricultural automation, and scientific studies. Modular design allows extensive customization. Open API for academic and commercial research. Perfect for universities and R&D departments.',
'Boreal Green', 20, TRUE, 'images/robots/sage-grid.jpg', 'images/robots/sage-detail.jpg',
'Zenith Research AI v3.0 (Open API)', 175, 68.0, 40.0, 14.0, 6.0, 'Fully Autonomous',
'BUSINESS', 2, 'laboratory research,field studies,agricultural automation,data collection,environmental monitoring,education');

-- accessories and components
INSERT INTO products (name, price, category_id, description, color, stock, featured, image_url, buyer_requirement, warranty_years, compatible_robots) VALUES

('Universal Charging Station Pro', 4999.00, 7,
'Fast charging station compatible with most Zenith robots. Dual charging ports, smart power management, and automatic scheduling. Charge two robots simultaneously in 4 hours.',
'Charcoal Gray', 50, FALSE, 'images/accessories/charging-station-pro.jpg', 'NONE', 2, 'KODA,SERVO,NOVA,SAGE'),

('Zenith Maintenance Kit Pro', 1499.00, 7,
'Complete maintenance package including cleaning solutions, diagnostic tools, calibration equipment, and replacement filters. Extends robot lifespan and maintains optimal performance.',
'Tool Red', 100, FALSE, 'images/accessories/maintenance-kit.jpg', 'NONE', 1, 'KODA,SERVO,NOVA,MAGMA,EPSI-9,SAGE'),

('AI Vision Upgrade Module v3', 7999.00, 7,
'Enhanced computer vision system with 4K cameras, LiDAR, and thermal imaging. Dramatically improves object recognition and navigation in complex environments.',
'Tech Blue', 30, FALSE, 'images/accessories/vision-upgrade.jpg', 'NONE', 2, 'KODA,SERVO,NOVA,SAGE'),

('Extended Battery Pack - Standard', 2999.00, 7,
'Doubles runtime for household and research robots. Hot swappable design allows continuous operation. Includes smart battery management system.',
'Matte Black', 75, FALSE, 'images/accessories/battery-standard.jpg', 'NONE', 2, 'KODA,SAGE'),

('Extended Battery Pack - Industrial', 5999.00, 7,
'High capacity battery for industrial and construction robots. 50% more runtime. Built for harsh environments with reinforced casing.',
'Steel Gray', 40, FALSE, 'images/accessories/battery-industrial.jpg', 'BUSINESS', 2, 'SERVO,MAGMA'),

('KODA Home Assistant Package', 3499.00, 7,
'Complete home upgrade including advanced cooking attachments, garden tools, pet care accessories, and premium cleaning equipment. Makes KODA even more capable.',
'Pearl White', 35, FALSE, 'images/accessories/koda-package.jpg', 'NONE', 1, 'KODA'),

('SERVO Industrial Gripper Set', 8999.00, 7,
'Professional grade gripper attachments for various industrial tasks. Includes precision grippers, heavy duty clamps, and specialized tools for manufacturing.',
'Industrial Gray', 25, FALSE, 'images/accessories/servo-grippers.jpg', 'BUSINESS', 2, 'SERVO'),

('NOVA Medical Instruments Package', 12999.00, 7,
'FDA approved surgical instruments and diagnostic tools compatible with NOVA. Includes sterilization equipment and medical grade sensors.',
'Clinical White', 15, FALSE, 'images/accessories/nova-instruments.jpg', 'MEDICAL', 3, 'NOVA'),

('MAGMA Heavy Duty Tool Kit', 9999.00, 7,
'Construction grade attachments including jackhammer arm, welding tools, and demolition equipment. Built for extreme worksite conditions.',
'Safety Orange', 20, FALSE, 'images/accessories/magma-tools.jpg', 'BUSINESS', 2, 'MAGMA'),

('EPSI-9 Tactical Equipment Module', 15999.00, 7,
'Military grade equipment package including encrypted communications, night vision, surveillance sensors, and tactical accessories. ITAR restricted.',
'Phantom Black', 8, FALSE, 'images/accessories/epsi9-tactical-kit.jpg', 'GOVERNMENT', 3, 'EPSI-9'),

('Neural Processing Upgrade Core', 11999.00, 7,
'10x AI processing power upgrade. Enables advanced machine learning, faster decision making, and improved autonomous operations. Easy installation.',
'Neural Blue', 25, FALSE, 'images/accessories/processing-upgrade.jpg', 'NONE', 2, 'KODA,SERVO,NOVA,SAGE'),

('Advanced Mobility Package', 6999.00, 7,
'Improved locomotion system with enhanced balance, terrain adaptation, and climbing capabilities. Enables operation in challenging environments.',
'Titanium', 30, FALSE, 'images/accessories/mobility-package.jpg', 'NONE', 2, 'KODA,SERVO,MAGMA,SAGE'),

('Heavy Duty Charging Bay', 8999.00, 7,
'Industrial charging station for construction and military robots. Weatherproof, reinforced construction, fast charging capability. Charges MAGMA in 6 hours, EPSI-9 in 8 hours.',
'Industrial Yellow', 15, FALSE, 'images/accessories/charging-bay-heavy.jpg', 'BUSINESS', 3, 'MAGMA,EPSI-9'),

('Zenith Cloud AI Subscription - Annual', 5999.00, 7,
'Annual subscription to Zenith Cloud AI services. Enables remote monitoring, OTA updates, advanced analytics, and 24/7 cloud based AI assistance.',
'Digital Blue', 999, FALSE, 'images/accessories/cloud-subscription.jpg', 'NONE', 1, 'KODA,SERVO,NOVA,MAGMA,EPSI-9,SAGE'),

('Robotic Docking Station Smart', 3499.00, 7,
'Automated docking and charging station with smart positioning. Robots automatically return for charging. Includes storage for accessories and tools.',
'Modern White', 40, FALSE, 'images/accessories/docking-station.jpg', 'NONE', 2, 'KODA,SERVO,SAGE'),

('Environmental Weatherproofing Kit', 2499.00, 7,
'Complete weatherproofing upgrade for outdoor operations. Waterproof seals, dust protection, temperature resistance upgrades. Essential for field work.',
'Weather Gray', 45, FALSE, 'images/accessories/weatherproof-kit.jpg', 'NONE', 1, 'MAGMA,EPSI-9,SAGE');

-- career opportunities
INSERT INTO jobs (title, department, location, job_type, description, requirements, salary_range, posted_date, status) VALUES

('Senior Robotics Engineer', 'Engineering', 'San Francisco, CA', 'Full-Time',
'Lead the development of next generation humanoid robots at Zenith Lab. Design and implement advanced locomotion systems, sensor integration, and AI driven control algorithms. Work with cutting edge hardware and software to push the boundaries of robotics.',
'PhD or MS in Robotics, Mechanical Engineering, or related field. 5+ years experience in robotics development. Expertise in ROS, C++, Python. Experience with bipedal locomotion and kinematics. Strong problem solving and leadership skills.',
'$150,000 - $220,000', '2025-12-01', 'OPEN'),

('Machine Learning Engineer - AI Systems', 'Artificial Intelligence', 'San Francisco, CA', 'Full-Time',
'Develop and deploy advanced AI models for autonomous robot operations. Focus on computer vision, natural language processing, and reinforcement learning. Shape the intelligence behind Zenith Lab robots.',
'MS or PhD in Computer Science, AI/ML, or related field. 3+ years experience with deep learning frameworks (PyTorch, TensorFlow). Strong background in computer vision and NLP. Experience with edge AI and real time systems. Publications in top tier conferences preferred.',
'$140,000 - $200,000', '2025-12-03', 'OPEN'),

('Embedded Systems Engineer', 'Engineering', 'San Francisco, CA', 'Full-Time',
'Design and develop embedded software for robot control systems. Optimize real time performance, implement safety critical systems, and integrate sensors and actuators.',
'BS/MS in Computer Engineering, Electrical Engineering. 4+ years experience with embedded systems (ARM, RTOS). Proficient in C/C++, embedded Linux. Experience with motor control and sensor fusion. Strong debugging and optimization skills.',
'$130,000 - $180,000', '2025-12-05', 'OPEN'),

('Product Manager - Household Robotics', 'Product', 'San Francisco, CA', 'Full-Time',
'Define product strategy and roadmap for KODA household robot line. Work cross functionally with engineering, design, and business teams. Drive product vision from concept to launch.',
'5+ years product management experience, preferably in robotics or IoT. Strong technical background and user empathy. Experience with agile development and user research. Excellent communication and leadership skills. MBA or relevant experience preferred.',
'$140,000 - $190,000', '2025-12-02', 'OPEN'),

('Mechanical Engineer - Structural Design', 'Engineering', 'San Francisco, CA', 'Full-Time',
'Design mechanical structures and components for humanoid robots. Optimize for strength, weight, and manufacturability. Work with advanced materials and manufacturing processes.',
'BS/MS in Mechanical Engineering. 3+ years CAD experience (SolidWorks, Fusion 360). Knowledge of materials science and FEA analysis. Experience with additive manufacturing and CNC. Passion for robotics and innovation.',
'$110,000 - $160,000', '2025-12-04', 'OPEN'),

('Research Scientist - Reinforcement Learning', 'Research', 'San Francisco, CA', 'Full-Time',
'Conduct cutting edge research in reinforcement learning for robot manipulation and navigation. Publish papers, collaborate with universities, and translate research into production systems.',
'PhD in Computer Science, Robotics, or related field. Strong publication record in RL, robotics, or AI. Experience with sim to real transfer. Proficient in Python, PyTorch/JAX. Passion for advancing the state of the art.',
'$160,000 - $240,000', '2025-12-01', 'OPEN'),

('Manufacturing Operations Manager', 'Operations', 'Austin, TX', 'Full-Time',
'Lead manufacturing operations for Zenith Lab robots. Manage production lines, quality assurance, supply chain, and process optimization. Scale production to meet growing demand.',
'BS in Industrial Engineering, Operations, or related field. 7+ years manufacturing experience, robotics preferred. Experience with lean manufacturing and Six Sigma. Strong leadership and problem solving skills. Ability to scale operations rapidly.',
'$120,000 - $170,000', '2025-12-06', 'OPEN'),

('UX Designer - Robot Interactions', 'Design', 'San Francisco, CA', 'Full-Time',
'Design intuitive human robot interaction experiences. Create interfaces, gestures, and behaviors that make robots feel natural and trustworthy. Shape how millions interact with Zenith robots.',
'4+ years UX design experience, HRI preferred. Portfolio demonstrating interaction design skills. Proficiency in Figma, Sketch, or similar tools. Experience with user research and testing. Passion for robotics and human centered design.',
'$110,000 - $160,000', '2025-12-07', 'OPEN');

-- database setup complete
SELECT 'Database created successfully' as status;
SELECT CONCAT('Total products: ', COUNT(*)) as info FROM products;
SELECT CONCAT('Total jobs: ', COUNT(*)) as info FROM jobs;
SELECT CONCAT('Total users: ', COUNT(*)) as info FROM users;
