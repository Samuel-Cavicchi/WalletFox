
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
    return new Promise(resolve, reject => {
        if(usersTable != null) {
            resolve(usersTable)
        } else {
            reject(new Error('No User\'s table found'))
        }
    }) 
}

// Get specific user
function getUser(userId) {
    return new Promise(function(resolve, reject) {
        const user = usersTable.find(user => user.id == userId)
        if(user) {
            resolve(user)
        } else {
            reject(new Error('Error: User with this ID not found'))
        }
    })
}

function getWallet(walletId) {
    return new Promise(function(resolve, reject) {
        const wallet = walletsTable.find(wallet => wallet.id == walletId)
        if (wallet) {
            resolve(wallet)
        } else {
            reject(new Error('Error: Wallet with this ID not found'))
        }
    })
}

function getPayment(paymentId) {
    return new Promise(function(resolve, reject) { 
        const payment = paymentsTable.find(payment => payment.id == paymentId)
        if (payment) {
            resolve(payment)
        } else {
            reject(new Error('Error: Payment with this ID not found'))
        }
    })
}

exports.getUser = getUser
exports.getWallet = getWallet
exports.getPayment = getPayment