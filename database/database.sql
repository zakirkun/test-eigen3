CREATE TABLE `members` (
  `id` int(6) PRIMARY KEY AUTO_INCREMENT,
  `code` varchar(50) NOT NULL UNIQUE,
  `name` varchar(100) NOT NULL,
  `penalty_end_date` datetime,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `books` (
  `id` int(6) PRIMARY KEY AUTO_INCREMENT,
  `code` varchar(50) NOT NULL UNIQUE,
  `title` varchar(100) NOT NULL,
  `author` varchar(100) NOT NULL,
  `stock` int NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE `borrow` (
  `id` int(6) PRIMARY KEY AUTO_INCREMENT,
  `code_book` varchar(50) UNIQUE,
  `code_member` varchar(50) UNIQUE,
  `borrow_date` datetime,
  `status` varchar(50) NOT NULL DEFAULT 'NOT_RETURNED',
  `created_at` timestamp
);

ALTER TABLE `borrow` ADD FOREIGN KEY (`code_book`) REFERENCES `books` (`code`);
ALTER TABLE `borrow` ADD FOREIGN KEY (`code_member`) REFERENCES `members` (`code`);

INSERT INTO members (code, name) VALUES 
('M001', 'Angga'),
('M002', 'Ferry'),
('M003', 'Putri');

INSERT INTO books (code, title, author, stock) VALUES 
('JK-45', 'Harry Potter', 'J.K Rowling', 10),
('SHR-1', 'A Study in Scarlet', 'Arthur Conan Doyle', 10),
('TW-11', 'Twilight', 'Stephenie Meyer', 15),
('HOB-83', 'The Hobbit, or There and Back Again', 'J.R.R. Tolkien', 20),
('NRN-7', 'The Lion, the Witch and the Wardrobe', 'C.S. Lewis', 5);