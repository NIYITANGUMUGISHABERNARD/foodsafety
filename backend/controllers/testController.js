const db = require("../config/db");

exports.testConnection = async(req,res)=>{

try{

const [rows] = await db.query("SELECT NOW() currentTime");

res.json(rows);

}

catch(err){

res.status(500).json(err);

}

}