const mongoose = require('mongoose');
const argon2 = require('argon2')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        birthday:{ 
            type: Date,
            require: true
        },
        address: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            required: true
        },
        image: {
            type: String,
            default: null
        }
    }, {timestamps: { createdAt: 'create_at', updatedAt: 'update_at' }}
)

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await argon2.hash(this.password)
            next()
        } catch (error) {
            return next(error)
        }
    } else {
        next()
    }
})

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password) {
        try {
            update.password = await argon2.hash(update.password);
            this.setUpdate(update);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await argon2.verify(this.password, candidatePassword)
    } catch (error) {
        throw error
    }
}

userSchema.index({ username: 'text' })

const User = mongoose.model('User', userSchema)

module.exports = User;