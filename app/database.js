
const wallets = [
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
];

const payments = [ // A list of all payments
    {
        id: 1,
        wallet: 2, // Wallet ID
        payee: 1324, // uid of the person who is owed money
        description: "Bought lunch",
        paymentDate: new Date().valueOf()
    }
]

const paymentDebt = [
    {
        id: 1,
        userOwing: 1333, // The user who must pay money
        payment: 1, // The corresponding payment (which includes the payee)
        amount: 60.0
    }
]
