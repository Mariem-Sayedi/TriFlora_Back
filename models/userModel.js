const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

const userSchema= new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name required'],
        },
        slug: {
            type: String,
            lowerCase: true,
        },
        email: {
            type: String,
            required: [true, 'email required'],
            unique: true,
            lowercase: true,
        },
        phone: String,
        profileImg: String,
        password: {
            type: String,
            required: [true, 'password required'],
            minLength: [6, 'too short password'],
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'seller'],
            default: "user",
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();
    //hashing user password
    this.password= await bcrypt.hash(this.password, 12);
    next();
});



const UserModel= mongoose.model('User', userSchema);

module.exports= UserModel;