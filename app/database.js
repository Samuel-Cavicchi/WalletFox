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
    CREATE TABLE IF NOT EXISTS wallet_members (
        walletMemberId INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        walletId INT,
        FOREIGN KEY (userId) REFERENCES users(userId),
        FOREIGN KEY (walletId) REFERENCES wallets(walletId)
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


function getUsers(name) {
    var query = ""
    var values = null
    if (name) {
        query = "SELECT * FROM users WHERE name = ?"
        values = [name]
    } else {
        query = "SELECT * FROM users"
    }
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
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
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

function getUser(userId) {
    const query = `
        SELECT *
        FROM users
        WHERE userId = ?
    `
    const values = [userId]
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result[0])
            }
        })
    })
}

function updateUser(userId, updatedObject) {
    var query = `
        UPDATE users
        SET email = ?, name = ?, password = ?, imageURL = ?
        WHERE userId = ?
    `
    var values = [
        updatedObject.email,
        updatedObject.name,
        updatedObject.password,
        updatedObject.imageURL,
        userId
    ]

    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

function deleteUser(userId) {
    const query = `
        DELETE FROM users
        WHERE userId = ?
    `
    const values = [userId]
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}


function addWalletMember(userId, walletId) {
    return new Promise(function (resolve, reject) {
        const query = "INSERT INTO users (userId, walletId) VALUES (?, ?)"
        const values = [userId, walletId]
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

function getWalletMember(walletMemberId) {
    const query = `
        SELECT *
        FROM wallet_members
        WHERE walletMemberId = ?
    `
    const values = [walletMemberId]
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result[0])
            }
        })
    })
}

function updateWalletMember(walletMemberId, isAdmin) {
    var query = `
        UPDATE wallet_members
        SET isAdmin = ?
        WHERE walletMemberId = ?
    `
    var values = [isAdmin, walletMemberId]

    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

function deleteWalletMember(walletMemberId) {
    const query = `
        DELETE FROM wallet_members
        WHERE walletMemberId = ?
    `
    const values = [walletMemberId]
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}


// To Complete:
function getWallets(id) {
    var query = `SELECT * FROM wallets, users, wallet_members
        WHERE walletId = wallet_members.walletId, 
        AND wallet_members.userId = users.userId
        AND users.userId = ?`
    var values = [id]
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}
// To Complete:
function addWallet(user) {
    return new Promise(function (resolve, reject) {
        const query = "INSERT INTO users (email, password, name, isActive) VALUES (?, ?, ?, ?)"
        const values = [user.email, user.password, user.name, true]
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}
// To Complete:
function getWallet(userId) {
    const query = `
        SELECT *
        FROM users
        WHERE userId = ?
    `
    const values = [userId]
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result[0])
            }
        })
    })
}
// To Complete:
function updateWallet(userId, updatedObject) {
    var query = `
        UPDATE users
        SET email = ?, name = ?, password = ?, imageURL = ?
        WHERE userId = ?
    `
    var values = [
        updatedObject.email,
        updatedObject.name,
        updatedObject.password,
        updatedObject.imageURL,
        userId
    ]

    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}
// To Complete:
function deleteWallet(userId) {
    const query = `
        DELETE FROM users
        WHERE userId = ?
    `
    const values = [userId]
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

exports.getUsers = getUsers
exports.addUser = addUser
exports.getUser = getUser
exports.updateUser = updateUser
exports.deleteUser = deleteUser

exports.addWalletMember = addWalletMember
exports.getWalletMember = getWalletMember
exports.updateWalletMember = updateWalletMember
exports.deleteWalletMember = deleteWalletMember

exports.getWallets = getWallets
exports.addWallet = addWallet
exports.getWallet = getWallet
exports.updateWallet = updateWallet
exports.deleteWallet = deleteWallet