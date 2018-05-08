var inquirer = require('inquirer');
var mysql = require('mysql');
const Table = require('cli-table2');
var validator = require('validator');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazondb'
});

connection.connect(function(err) {
    if (err) throw err;
    showMenuOptions();
});

function displayTable(rows) {
    var productTable = new Table({
        head: [ 'item_id', 'product_name', 'department_name', 'price', 'stock_quantity' ]
    });

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        productTable.push([ row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity ]);
    }

    console.log(productTable.toString());
}


function showMenuOptions() {
    inquirer
        .prompt([
            {
                name: 'task',
                message: 'Choose a task',
                type: 'list',
                choices: ['View Products', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
            }
        ])
        .then(function(answer) {
            switch (answer.task) {
                case 'View Products':
                    return viewProducts();
                case 'View Low Inventory':
                    return viewLowInventory();
                case 'Add to Inventory':
                    return addToInventory();
                case 'Add New Product':
                    return addNewProduct();
            }
        });
}


function viewProducts() {
    connection.query('SELECT * FROM products;', function(err, rows) {
        if (err) throw err;

        displayTable(rows);

        showMenuOptions();
    });
}


function viewLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5;', function(err, rows) {
        if (err) throw err;

        displayTable(rows);

        showMenuOptions();
    });
}


function addToInventory() {
    connection.query('SELECT * FROM products;', function(err, rows) {
        if (err) throw err;

        displayTable(rows);

        var products = rows.map(function(row) {
            return {
                name: row.item_id + ' - ' + row.product_name,
                value: { id: row.item_id, name: row.product_name }
            };
        });
        inquirer.prompt([
            {
                name: 'product',
                message: 'Choose a product to update',
                type: 'list',
                choices: products
            }
        ]).then(function(answer) {
            var product = answer.product;
            var filteredProducts = rows.filter(function(row) {
                return row.item_id === product.id;
            });
            var chosenProductObj = filteredProducts[0];

            inquirer.prompt([
                {
                    name: 'quantity',
                    message: 'How much "' + product.name + '" would you like to add?',
                    type: 'input',
                    validate: validator.isInt
                }
            ]).then(function(secondAnswer) {
                var quantity = Number(secondAnswer.quantity);
                connection.query('UPDATE products set ? WHERE ?;',
                [
                    {
                        stock_quantity: chosenProductObj.stock_quantity + quantity
                    },
                    {
                        item_id: chosenProductObj.item_id
                    }
                ],
                function(err) {
                    if (err) throw err;
                    console.log('There are now ' + chosenProductObj.stock_quantity + quantity + ' "' + chosenProductObj.product_name + '" in the store\'s inventory.')
                    showMenuOptions();
                });
            });
        });
    });
}


function addNewProduct() {
    inquirer.prompt([
        {
            name: 'product_name',
            message: 'Product Name',
            type: 'input'
        },
        {
            name: 'department_name',
            message: "Department Name",
            type: 'input'
        },
        {
            name: 'price',
            message: 'Price',
            type: 'input',
            validate: validator.isDecimal
        },
        {
            name: 'stock_quantity',
            message: 'Quantity',
            type: 'input',
            validate: validator.isInt
        }
    ]).then(function(answer) {
        var product = {
            product_name: answer.product_name,
            department_name: answer.department_name,
            price: answer.price,
            stock_quantity: answer.stock_quantity
        }
        connection.query('INSERT INTO products SET ?;', product, function(err, results, fields) {
            if (err) throw err;
            console.log('You have added "' + answer.product_name + '" to the store inventory.')
            showMenuOptions();
        });
    });
}