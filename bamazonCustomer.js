var inquirer = require('inquirer');
var mysql = require('mysql');
var validator = require('validator');

var connection = mysql.createConnection({
    host: 'localhost',
  ///  port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazondb'
});

connection.connect(function(err) {
    if (err) throw err;
    main();
});

function main() {
    connection.query('SELECT * FROM products;', function(err, rows) {
        if (err) throw err;

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            console.log(row.item_id, row.product_name, row.price, row.stock_quantity);
        }

        askForId(rows);
    });
}

function askForId(rows) {
    inquirer
        .prompt([
            {
                name: 'product_id',
                message: '\n\nPlease type the product ID for the product that you would like to purchase:',
                type: 'input',
                validate: validator.isInt
            }
        ])
        .then(function(answer) {
            askForQuantity(rows, Number(answer.product_id));
        });
}

function askForQuantity(rows, id) {
    var filteredProducts = rows.filter(function(row) {
        return row.item_id === id;
    });

    var product = filteredProducts[0];

    inquirer
        .prompt([
            {
                name: 'quantity',
                message: 'How many "' + product.product_name + '" would you like to purchase?',
                type: 'input',
                validate: validator.isInt
            }
        ])
        .then(function(answer) {
            verifyPurchase(rows, id, Number(answer.quantity));
        });
}

function verifyPurchase(rows, id, quantity) {
    var filteredProducts = rows.filter(function(row) {
        return row.item_id === id;
    });

    var product = filteredProducts[0];

    if (product.stock_quantity < quantity) {
        console.error('\n\nSorry, we do not have the surplus of "' + product.product_name + '" for you to purchase that many.');
        main();
    } else {
        makePurchase(rows, id, quantity);
    }
}

function makePurchase(rows, id, quantity) {
    var filteredProducts = rows.filter(function(row) {
        return row.item_id === id;
    });

    var product = filteredProducts[0];
    var total = product.price * quantity;

    var newProduct = {
        item_id: product.item_id,
        product_name: product.product_name,
        department_name: product.department_name,
        price: product.price,
        stock_quantity: product.stock_quantity - quantity
    };

    console.log('\n\n' + quantity + ' units of "' + product.product_name + '" comes to a total of $' + total + '\n');

    updateDatabase(newProduct);
}

function updateDatabase(product) {
    console.log(product.stock_quantity);
    connection.query(
        'UPDATE products set ? WHERE ?;',
        [
            {
                stock_quantity: product.stock_quantity
            },
            {
                item_id: product.item_id
            }
        ],
        function(err) {
            if (err) throw err;
            main();
        }
    );
}