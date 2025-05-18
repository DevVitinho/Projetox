// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Verificar se o modelo já existe
let User;
try {
    User = mongoose.model('User');
} catch {
    const UserSchema = new mongoose.Schema({
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
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

    UserSchema.pre('save', async function(next) {
        if (!this.isModified('password')) return next();
        
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    });

    UserSchema.methods.comparePassword = async function(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    };

    User = mongoose.model('User', UserSchema);
}

module.exports = User;