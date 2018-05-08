-- SCHEMA DATABASE SETUP FOR PRODUCTS DATABASE
-- TABLE (SEEDS) IN /db/seeds.sql FILE

DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  PRIMARY KEY (item_id),
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR (255) NOT NULL,
  price INTEGER(10),
  stock_quantity INTEGER(10)
);



INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wakanda-HerForever T-Shirt", "Womens", 45, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wakanda-Him Forever T-Shirt", "Mens", 55, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wakanda-Kid Forever T-Shirt", "Kids", 15, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("T-Chula Lives T-Shirt", "Mens", 55, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Black Panther Coffee Mug", "Home", 15, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Killmonger Coffee Mug", "Home", 15, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shuri ForeverT-Shirt", "Womens", 45, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nakia Forever T-Shirt", "Womens", 45, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ramonda Is Mom-Dukes T-shirt", "Womens", 45, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chadwick Boseman Is Bae T-Shirt", "Womens", 55, 20);




USE bamazonDB;
SELECT * FROM products;