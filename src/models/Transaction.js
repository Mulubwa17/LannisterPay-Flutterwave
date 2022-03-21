const mongoose = require('mongoose');

const { Schema } = mongoose;

const TransactionSchema = new Schema(
{
    ID: { type: Number, required: true },
    Amount: { type: String, required: true },
    Currency: { type: String, required: true },
    CurrencyCountry: { type: String, required: true },
    Customer: {
        ID: { type: Number, required: true },
        EmailAddress: { type: String, required: true },
        FullName: { type: String, required: true },
        BearsFee: { type: Boolean, required: true },
    },
    PaymentEntity: {
        ID: { type: Number, required: true },
        Issuer: { type: String, required: true },
        Brand: { type: String, required: true },
        Number: { type: String, required: true },
        SixID: { type: Number, required: true },
        Type: { type: String, enum: ["CREDIT-CARD", "DEBIT-CARD", "BANK-ACCOUNT", "USSD", "WALLET-ID", "*"], required: true },
        Country: { type: String, required: true },
    }
})

const Transaction = mongoose.model('transaction', TransactionSchema);

module.exports = Transaction;