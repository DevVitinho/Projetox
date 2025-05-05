// models/Company.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Verificar se o modelo já existe
let Company;
try {
    Company = mongoose.model('Company');
} catch {
    const CompanySchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        cnpj: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            street: String,
            number: String,
            city: String,
            state: String,
            zipCode: String
        },
        phone: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

    CompanySchema.pre('save', async function(next) {
        if (!this.isModified('password')) return next();
        
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    });

    CompanySchema.methods.comparePassword = async function(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    };

    Company = mongoose.model('Company', CompanySchema);
}

module.exports = Company;