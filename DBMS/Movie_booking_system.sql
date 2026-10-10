CREATE DATABASE cinema_db;
USE cinema_db;

CREATE TABLE MOVIE (
    movie_id INT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    genre VARCHAR(20),
    language VARCHAR(20),
    duration INT,
    rating DECIMAL(3,1)
        CHECK (rating BETWEEN 0 AND 10)
);

desc MOVIE;

CREATE TABLE THEATRE (
    theatre_id INT PRIMARY KEY,
    theatre_name VARCHAR(50) NOT NULL,
    city VARCHAR(30),
    phone VARCHAR(15) UNIQUE
);

desc THEATRE;

CREATE TABLE SCREEN (
    screen_id INT PRIMARY KEY,
    screen_name VARCHAR(20) NOT NULL,
    capacity INT CHECK (capacity > 0),
    theatre_id INT,
    FOREIGN KEY (theatre_id)
        REFERENCES THEATRE(theatre_id)
);

DESC SCREEN;

CREATE TABLE SHOWTIME (
    show_id INT PRIMARY KEY,
    movie_id INT,
    screen_id INT,
    show_date DATE,
    show_time TIME,
    ticket_price DECIMAL(8,2)
        CHECK (ticket_price > 0),
    FOREIGN KEY (movie_id)
        REFERENCES MOVIE(movie_id),
    FOREIGN KEY (screen_id)
        REFERENCES SCREEN(screen_id)
);

desc SHOWTIME;

CREATE TABLE SEAT (
    seat_id INT PRIMARY KEY,
    screen_id INT,
    seat_number VARCHAR(10) NOT NULL,
    seat_type VARCHAR(15),
    UNIQUE (screen_id, seat_number),
    FOREIGN KEY (screen_id)
        REFERENCES SCREEN(screen_id)
);

DESC SEAT;

CREATE TABLE CUSTOMER (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE,
    phone VARCHAR(15),
    city VARCHAR(30)
);

DESC CUSTOMER;

ALTER TABLE MOVIE
ADD remarks VARCHAR(100);
DESC MOVIE;

ALTER TABLE MOVIE
MODIFY COLUMN title VARCHAR(100);

desc Movie;

ALTER TABLE MOVIE
RENAME COLUMN genre TO movie_genre;

RENAME TABLE MOVIE TO MOVIE_DETAILS;

show tables;



CREATE TABLE TEST_RENAME (
    test_id INT PRIMARY KEY,
    test_name VARCHAR(30)
);
DROP TABLE TEST_RENAME;

INSERT INTO MOVIE_DETAILS
(movie_id, title, movie_genre, language, duration, rating)
VALUES
(101, 'Inception', 'Sci-Fi', 'English', 148, 8.8),
(102, 'Dangal', 'Drama', 'Hindi', 161, 8.3),
(103, 'Interstellar', 'Sci-Fi', 'English', 169, 8.7),
(104, '3 Idiots', 'Comedy', 'Hindi', 170, 8.4),
(105, 'Drishyam', 'Thriller', 'Hindi', 163, 8.2);

SELECT * FROM MOVIE_DETAILS;

INSERT INTO THEATRE
(theatre_id, theatre_name, city, phone)
VALUES
(201, 'PVR Cinemas', 'Mumbai', '9000000001'),
(202, 'INOX Central', 'Pune', '9000000002'),
(203, 'Cinepolis', 'Thane', '9000000003'),
(204, 'MovieMax', 'Nashik', '9000000004'),
(205, 'CityPride', 'Pune', '9000000005');

SELECT * FROM THEATRE;

INSERT INTO SCREEN
(screen_id, screen_name, capacity, theatre_id)
VALUES
(301, 'Screen 1', 150, 201),
(302, 'Screen 2', 120, 202),
(303, 'Screen 3', 180, 203),
(304, 'Screen 4', 100, 204),
(305, 'Screen 5', 200, 205);

SELECT * FROM SCREEN;

INSERT INTO SHOWTIME
(show_id, movie_id, screen_id, show_date, show_time, ticket_price)
VALUES
(401, 101, 301, '2026-10-11', '10:00:00', 250.00),
(402, 102, 302, '2026-10-11', '13:00:00', 200.00),
(403, 103, 303, '2026-10-12', '16:00:00', 300.00),
(404, 104, 304, '2026-10-12', '19:00:00', 180.00),
(405, 105, 305, '2026-10-13', '21:00:00', 220.00);

SELECT * FROM SHOWTIME;

INSERT INTO SEAT
(seat_id, screen_id, seat_number, seat_type)
VALUES
(501, 301, 'A1', 'Premium'),
(502, 302, 'B1', 'Regular'),
(503, 303, 'C1', 'Premium'),
(504, 304, 'D1', 'Regular'),
(505, 305, 'E1', 'Recliner');

SELECT * FROM SEAT;

INSERT INTO CUSTOMER
(customer_id, customer_name, email, phone, city)
VALUES
(601, 'Rahul Patil', 'rahul@example.com', '9100000001', 'Mumbai'),
(602, 'Priya Shah', 'priya@example.com', '9100000002', 'Pune'),
(603, 'Amit Naik', 'amit@example.com', '9100000003', 'Thane'),
(604, 'Sneha Rao', 'sneha@example.com', '9100000004', 'Nashik'),
(605, 'Ravi Sharma', 'ravi@example.com', '9100000005', 'Mumbai');

SELECT * FROM CUSTOMER;

INSERT INTO BOOKING
(booking_id, customer_id, show_id, seat_id, booking_date, status)
VALUES
(701, 601, 401, 501, '2026-10-10', 'CONFIRMED'),
(702, 602, 402, 502, '2026-10-10', 'CONFIRMED'),
(703, 603, 403, 503, '2026-10-10', 'CONFIRMED'),
(704, 604, 404, 504, '2026-10-10', 'CANCELLED'),
(705, 601, 405, 505, '2026-10-10', 'CONFIRMED');

SELECT * FROM BOOKINGS;

SHOW TABLES;

USE cinema_db;

CREATE TABLE booking (
    booking_id INT PRIMARY KEY,
    customer_id INT,
    show_id INT,
    seat_id INT,
    booking_date DATE DEFAULT (CURRENT_DATE),
    status VARCHAR(15) DEFAULT 'CONFIRMED',
    FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id),
    FOREIGN KEY (show_id)
        REFERENCES showtime(show_id),
    FOREIGN KEY (seat_id)
        REFERENCES seat(seat_id)
);

INSERT INTO booking
(booking_id, customer_id, show_id, seat_id, booking_date, status)
VALUES
(701, 601, 401, 501, '2026-10-10', 'CONFIRMED'),
(702, 602, 402, 502, '2026-10-10', 'CONFIRMED'),
(703, 603, 403, 503, '2026-10-10', 'CONFIRMED'),
(704, 604, 404, 504, '2026-10-10', 'CANCELLED'),
(705, 605, 405, 505, '2026-10-10', 'CONFIRMED');

SELECT * FROM BOOKING;

CREATE TABLE payment (
    payment_id INT PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(8,2),
    payment_method VARCHAR(20),
    payment_status VARCHAR(15),
    payment_date DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (booking_id)
        REFERENCES booking(booking_id)
);
INSERT INTO payment
(payment_id, booking_id, amount, payment_method, payment_status, payment_date)
VALUES
(801, 701, 200.00, 'UPI', 'SUCCESS', '2026-10-10'),
(802, 702, 250.00, 'Card', 'SUCCESS', '2026-10-10'),
(803, 703, 180.00, 'Cash', 'SUCCESS', '2026-10-10'),
(804, 704, 220.00, 'UPI', 'REFUNDED', '2026-10-10'),
(805, 705, 300.00, 'Card', 'SUCCESS', '2026-10-10');

SELECT * FROM PAYMENT;


UPDATE customer
SET city = 'Pune'
WHERE customer_id = 601;

SELECT * FROM customer;
DELETE FROM customer
WHERE customer_id = 605;

SELECT * FROM CUSTOMER;
DELETE FROM payment
WHERE booking_id = 705;

DELETE FROM booking
WHERE booking_id = 705;

SELECT * FROM customer;

SELECT customer_id, customer_name, city, email
FROM customer;

SELECT DISTINCT city
FROM customer;

SELECT customer_id, customer_name, city
FROM customer
WHERE customer_id > 602;

SELECT customer_id, customer_name, city
FROM customer
WHERE customer_id BETWEEN 601 AND 604;

SELECT customer_id, customer_name, city
FROM customer
WHERE city IN ('Mumbai', 'Pune', 'Thane');

SELECT customer_id, customer_name
FROM customer
WHERE customer_name LIKE 'R%';

SELECT customer_id, customer_name, city
FROM customer
WHERE (city = 'Mumbai' OR city = 'Pune')
AND customer_id > 601;


SELECT customer_id, customer_name, city
FROM customer
WHERE city NOT IN ('Mumbai', 'Pune');

SELECT customer_id, customer_name, city
FROM customer
ORDER BY customer_id ASC;

SELECT
    customer_name,
    UPPER(customer_name) AS uppercase_name,
    LOWER(customer_name) AS lowercase_name,
    LENGTH(customer_name) AS name_length
FROM customer;

SELECT
    ticket_price,
    ROUND(ticket_price / 3, 2) AS divided_price,
    MOD(ticket_price, 2) AS price_remainder
FROM showtime;


SELECT
    show_id,
    show_date,
    DATE_ADD(show_date, INTERVAL 1 MONTH) AS next_month_date,
    LAST_DAY(show_date) AS month_end
FROM showtime;

SELECT
    show_id,
    DATE_FORMAT(show_date, '%d-%b-%Y') AS formatted_date,
    IFNULL(show_time, 'Not Available') AS show_time
FROM showtime;


SELECT COUNT(*) AS total_customers
FROM customer;


SELECT COUNT(DISTINCT city) AS unique_cities
FROM customer;

SELECT
    MIN(ticket_price) AS minimum_price,
    MAX(ticket_price) AS maximum_price,
    ROUND(AVG(ticket_price), 2) AS average_price
FROM showtime;

SELECT city, COUNT(*) AS customer_count
FROM customer
GROUP BY city;

SELECT status, COUNT(*) AS booking_count
FROM booking
GROUP BY status;

SELECT show_id, COUNT(*) AS total_bookings
FROM booking
GROUP BY show_id
ORDER BY show_id;

SELECT status, COUNT(*) AS booking_count
FROM booking
GROUP BY status
HAVING COUNT(*) > 1;

SELECT b.show_id,
       ROUND(AVG(p.amount), 2) AS average_payment
FROM booking b
JOIN payment p
    ON b.booking_id = p.booking_id
GROUP BY b.show_id
HAVING AVG(p.amount) > 200;

SELECT status, COUNT(*) AS booking_count
FROM booking
WHERE status = 'CONFIRMED'
GROUP BY status;

SELECT status, COUNT(*) AS booking_count
FROM booking
GROUP BY status
ORDER BY booking_count DESC;

SELECT
    COUNT(*) AS total_shows,
    MIN(ticket_price) AS minimum_price,
    MAX(ticket_price) AS maximum_price,
    ROUND(AVG(ticket_price), 2) AS average_price,
    SUM(ticket_price) AS total_price
FROM showtime;

SELECT c.customer_id,
       c.customer_name,
       b.booking_id,
       b.status
FROM customer c
INNER JOIN booking b
    ON c.customer_id = b.customer_id;
    
SELECT c.customer_id,
       c.customer_name,
       b.booking_id,
       b.status
FROM customer c
LEFT JOIN booking b
    ON c.customer_id = b.customer_id;
    
SELECT c.customer_id,
       c.customer_name,
       b.booking_id,
       b.status
FROM customer c
RIGHT JOIN booking b
    ON c.customer_id = b.customer_id;
    
    
SELECT c.customer_id,
       c.customer_name,
       b.booking_id,
       b.status
FROM customer c
LEFT JOIN booking b
    ON c.customer_id = b.customer_id

UNION

SELECT c.customer_id,
       c.customer_name,
       b.booking_id,
       b.status
FROM customer c
RIGHT JOIN booking b
    ON c.customer_id = b.customer_id;
    
SELECT c1.customer_name AS customer1,
       c2.customer_name AS customer2,
       c1.city
FROM customer c1
JOIN customer c2
    ON c1.city = c2.city
   AND c1.customer_id < c2.customer_id;
   
SELECT customer_id
FROM customer
UNION
SELECT customer_id
FROM booking;

SELECT customer_id
FROM customer
UNION ALL
SELECT customer_id
FROM booking;