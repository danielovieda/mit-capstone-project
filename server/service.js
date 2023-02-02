const mongoose = require('mongoose');

// mongodb: dev@p4ssw3ird0
//
const db = 'mongodb+srv://dev:p4ssw3ird0@bank.zorxwxs.mongodb.net/?retryWrites=true&w=majority';

async function connect() {
    await mongoose.connect(db);
}

export default connect;