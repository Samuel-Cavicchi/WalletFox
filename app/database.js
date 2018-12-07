const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "test.cnywqzoih3zx.eu-central-1.rds.amazonaws.com",
    database: "test",
    user: "test",
    password: "justtesting"
});

connection.query(`
    CREATE TABLE IF NOT EXISTS users (
        userId INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        email VARCHAR(100),
        password VARCHAR(100),
        isActive BOOLEAN,
        imageURL VARCHAR(100)
    )`
);
connection.query(`
    CREATE TABLE IF NOT EXISTS wallets (
        walletId INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        currency VARCHAR(20)
    )`
);
connection.query(`
    CREATE TABLE IF NOT EXISTS payments (
        paymentId INT AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR(50),
        paymentDate VARCHAR(100),
        isSettled BOOLEAN,
        walletId INT,
        payeeId INT,
        FOREIGN KEY (walletId) REFERENCES wallets(walletId) ON DELETE CASCADE,
        FOREIGN KEY (payeeId) REFERENCES users(userId)
    )`
);

const walletsTable = [
    {
        id: 1,
        name: "Sam's Wallet",
        currency: "SEK"
    },
    {
        id: 2,
        name: "Group House",
        currency: "AUD"
    }
]

const paymentsTable = [ // A list of all payments
    {
        id: 1,
        wallet: 2, // Wallet ID
        payee: 1324, // uid of the person who is owed money
        description: "Bought lunch",
        paymentDate: new Date().valueOf()
    }
]

const paymentDebtsTable = [
    {
        id: 1,
        userOwing: 1333, // The user who must pay money
        payment: 1, // The corresponding payment (which includes the payee)
        amount: 60.0
    }
]

const usersTable = [
    {
        id: 0,
        name: 'Josef Wakman',
        password: 'randomhash'
    },
    {
        id: 1,
        name: 'Samuel Cavicchi',
        password: 'randomhash'
    }
]

function getUsers() {
    return new Promise(function (resolve, reject) {
        const query = "SELECT * FROM users"
        const values = null;
        connection.query(query, values, function(error, result) {
            if(error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

function addUser(user) {
    return new Promise(function (resolve, reject) {
        const query = "INSERT INTO users (email, password, name, isActive) VALUES (?, ?, ?, ?)"
        const values = [user.email, user.password, user.name, true]
        connection.query(query, values, function(error, result) {
            if(error) {
                console.log('error adding user:', error)
                reject(error)
            } else {
                console.log('adding user:', result)
                resolve(result)
            }
        })
    })
}


// Get specific user
function getUser(userId) {
    return new Promise(function (resolve, reject) {
        const user = usersTable.find(user => user.id == userId)
        if (user) {
            resolve(user)
        } else {
            reject(new Error('Error: User with this ID not found'))
        }
    })
}

function deleteUser(userId) {
    return new Promise(function (resolve, reject) {
        getUser(userId).then(() => {
            // If user is found
            var userToRemove = getUser(userId)
            usersTable.splice(userToRemove, 1) // Delete from database
            resolve() // deleted user successfully
            // reject(new Error("Error: The user with ID", userId, "is still in the database"))
        }).catch(() => {
            reject(new Error("User not found"))
        })
    })
}

function getWallets() {
    return new Promise(function (resolve, reject) {
        if (walletsTable != null) {
            resolve(walletsTable)
        } else {
            reject(new Error("No wallets table found!"))
        }
    })
}

function addWallet(wallet) {
    walletsTable.push(wallet)
}

function getWallet(walletId) {
    return new Promise(function (resolve, reject) {
        const wallet = walletsTable.find(wallet => wallet.id == walletId)
        if (wallet) {
            resolve(wallet)
        } else {
            reject(new Error('Error: Wallet with this ID not found'))
        }
    })
}

function getPayment(paymentId) {
    return new Promise(function (resolve, reject) {
        const payment = paymentsTable.find(payment => payment.id == paymentId)
        if (payment) {
            resolve(payment)
        } else {
            reject(new Error('Error: Payment with this ID not found'))
        }
    })
}

function getPaymentDebt(paymentDebtId) {
    return new Promise(function (resolve, reject) {
        const debt = paymentDebtsTable.find(debt => debt.id == paymentDebtId)
        if (debt) {
            resolve(debt)
        } else {
            reject(new Error('Error: PaymentDebt with this ID not found'))
        }
    })
}

exports.getUsers = getUsers
exports.addUser = addUser
exports.getUser = getUser
exports.deleteUser = deleteUser
exports.getWallets = getWallets
exports.addWallet = addWallet
exports.getWallet = getWallet
exports.getPayment = getPayment
exports.getPaymentDebt = getPaymentDebt