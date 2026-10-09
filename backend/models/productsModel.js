

const db = require("../config/db");

function getAllProducts(callback){
    const query = "SELECT * FROM products";
    db.query(query, callback);  
}


function getProductById(id, callback){
    const query = "SELECT * FROM products WHERE id = ?";
    db.query(query, [id], callback);
}



