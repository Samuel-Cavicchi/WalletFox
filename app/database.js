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
        isAdmin BOOLEAN,
        FOREIGN KEY (userId) REFERENCES users(userId),
        FOREIGN KEY (walletId) REFERENCES wallets(walletId) ON DELETE CASCADE
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
        const query = "INSERT INTO users (email, password, name, isActive, imageURL ) VALUES (?, ?, ?, ?, ?)"
        const values = [user.email, user.password, user.name, true, user.imageURL]
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
function getUserByGoogleId(googleId) {
    const query = `
        SELECT *
        FROM users
        WHERE googleUserId = ?
    `
    const values = [googleId]
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
    UPDATE users
    SET email = null, name = null, password = null, 
    imageURL = null, googleUserId = null, isActive = false
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


function addWalletMember(userId, walletId, isAdmin) {
    if(!isAdmin) {
        isAdmin = false
    }
    return new Promise(function (resolve, reject) {
        const query = "INSERT INTO wallet_members (userId, walletId, isAdmin) VALUES (?, ?, ?)"
        const values = [userId, walletId, isAdmin]
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


function getWallets(userId) {
    var query = `SELECT wallets.walletId, wallets.currency, wallets.name
        FROM wallets, wallet_members
        WHERE wallets.walletId = wallet_members.walletId 
        AND wallet_members.userId = ?
        `
    var values = [userId]
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
function addWallet(wallet) {
    return new Promise(function (resolve, reject) {
        console.log("Adding wallet: ", wallet)
        const query = `INSERT INTO wallets (name, currency) 
        VALUES (?, ?)`
        const values = [wallet.name, wallet.currency]
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}
function getWallet(walletId, userId) {
    const query = `SELECT *
    FROM wallets, wallet_members
    WHERE wallets.walletId = ?
    AND wallets.walletId = wallet_members.walletId 
    AND wallet_members.userId = ?
    `
    const values = [walletId, userId]
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
function updateWallet(walletId, updatedObject) {
    var query = `
        UPDATE wallets
        SET name = ?, currency = ?
        WHERE walletId = ?
    `
    var values = [
        updatedObject.name,
        updatedObject.walletId,
        walletId
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
function deleteWallet(walletId) {
    const query = `
        DELETE FROM wallets
        WHERE walletId = ?
    `
    const values = [walletId]
    return new Promise(function (resolve, reject) {
        connection.query(query, values, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

exports.getUsers = getUsers
exports.addUser = addUser
exports.getUser = getUser
exports.updateUser = updateUser
exports.deleteUser = deleteUser
exports.getUserByGoogleId = getUserByGoogleId

exports.addWalletMember = addWalletMember
exports.getWalletMember = getWalletMember
exports.updateWalletMember = updateWalletMember
exports.deleteWalletMember = deleteWalletMember

exports.getWallets = getWallets
exports.addWallet = addWallet
exports.getWallet = getWallet
exports.updateWallet = updateWallet
exports.deleteWallet = deleteWallet