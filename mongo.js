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
    const userExists = await db.collection('users').findOne({email})
    if (userExists) {
        log(`${email} (${name})`, 'account create attempt. duplicate email.')
        return false;
    }
    const hashedPassword = await hashPassword(password);
    log(email, 'new account created.')
    return new Promise((resolve, reject) => {    
        const collection = db.collection('users');
        const doc = {name, email, password: hashedPassword};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });    
    })
}

async function createTransaction(email, type, amount) {
    if (type === 'deposit' & amount <= 0) return {message: 'Deposit amount must be more than zero.'};
    if (type === 'withdrawal' & amount >= 0) return {message: 'Withdrawal amount must be negative.'};
    if (email == null || type == null || amount == null ) return {message: 'Missing something.'}
    const timestamp = dayjs().format();
    const doc = {email, type, amount, timestamp};
    const transactions = await getTransactions(email);
    let sum = +amount;
    if (transactions) {
        sum += getBalance(transactions);
    }

    
    if (type === 'withdrawal' && (sum - +amount >= 0)) {
         await db.collection('transactions').insertOne(doc, {w:1});
        const updatedTransactions = await db.collection('transactions').find({email}).toArray()
        return {transactions: updatedTransactions, balance: sum}
    } else if (type === 'deposit') {
        await db.collection('transactions').insertOne(doc, {w:1});
        const updatedTransactions = await db.collection('transactions').find({email}).toArray()
        return {transactions: updatedTransactions, balance: sum}
    } else {
        return {message: 'Unable to make a transaction.'}
    }
}


function getTransactions(email){
    return new Promise((resolve, reject) => {    
        db
            .collection('transactions')
            .find({email})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
        });    
    })
}

async function login(email, password) {
    //find user account by email
    //match password
    const user = await db.collection('users').findOne({email: email})
    if (!user) {
        log(email, `Email account doesn't exist.`)
        return {error: 'Email does not exist.'}
    }
    const match = await comparePassword(password, user.password);
    if (match) {
        log(email, 'logged in successfully');
        const transactions = await getTransactions(email);
        const balance = getBalance(transactions);
        delete user.password;
        return {...user, transactions, balance}
    } else {
        log(email, 'wrong password given');
        return {error: 'Wrong password.'}
    }
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

async function deleteUser(email) {
    log(email, 'account deletion requested.')
    const deletedTransactions = await db.collection('transactions').deleteMany({email: email});
    if (deletedTransactions) log(email, 'all transactions deleted')
    const deletedUser = await db.collection('users').deleteOne({email: email})
    if (deletedUser) log(email, 'account deleted.')
    if (deletedTransactions && deletedUser) {
        return true;
    } else {
        return false;
    }
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

function getBalance(transactions) {
    let balance = 0;
    transactions.forEach(item => {
        balance += +item.amount;
    })
    return balance;
}




module.exports = {createUser, login, logout, createTransaction, deleteUser, getTransactions};