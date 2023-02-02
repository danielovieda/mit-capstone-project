const dayjs = require('dayjs');
const bcrypt = require('bcrypt');

const MongoClient = require('mongodb').MongoClient;
const url         = 'mongodb+srv://dev:p4ssw3ird0@bank.zorxwxs.mongodb.net/?retryWrites=true&w=majority';
let db            = null;
 
// connect to mongo
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
    console.log("Connected successfully to db server");

    // connect to myproject database
    db = client.db('bad-bank');
});

// create user account
async function createUser(name, email, password) {
    const hashedPassword = await hashPassword(password);
    const userExists = await db.collection('users').findOne({email})
    if (userExists) {
        log(`${email} (${name})`, 'account create attempt. duplicate email.')
        return false;
    }
    log(email, 'new account created.')
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, password: hashedPassword};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

async function createTransaction(type, amount, timestamp) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('transactions');
        const doc = {type, amount, timestamp};
        collection.insertOne(doc, {w:1}, (err, result) => {
            err ? reject(err) : resolve(doc)
        })
    })
}


// all users
function all(){
    return new Promise((resolve, reject) => {    
        const customers = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}

async function login(email, password) {
    //find user account by email
    //match password
    const user = await db.collection('users').findOne({email: email})
    const match = await comparePassword(password, user.password);
    match ? log(email, 'logged in successfully') : log(email, 'wrong password given');
    return match;
}

function logout(email) {
    return log(email, 'logged out');
}

function log(user, action) {
    return new Promise((resolve, reject) => {    
        const collection = db.collection('logs');
        const doc = {user, action, timestamp: dayjs().format()};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

async function deleteUser(email, password) {
    const user = await db.collection('users').findOne({email: email});
    const match = await comparePassword(password, user.password);
    if (match) {
        log(email, 'account deleted.')
        return await db.collection('users').deleteOne({email: email})
    } else {
        return false
    }
}

async function updateUser(name, email, password) {
    return true;
}



async function comparePassword(password, hash) {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}

async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }




module.exports = {createUser, login, logout, createTransaction, deleteUser, updateUser};