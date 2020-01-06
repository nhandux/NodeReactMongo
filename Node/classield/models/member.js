var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var memberSchema = new Schema({
    info: {
        firstname: String,
        lastname: String,
        phone: String,
        company: String,
        address: String,
        cities: [{type: Schema.ObjectId, ref: 'City'}],
        countries: [{type: Schema.ObjectId, ref: 'Country'}], 
    },
    local: {
        email: String,
        password: String,
        activeToken: String,
        activeExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        photo: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
        photo: String
    },
    newsletter: Boolean,
    roles: String,
    status: String
});

//Mã hóa mật khẩu
memberSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

//Giải mã mật khẩu
memberSchema.methods.validcryptPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}
//Kiểm tra trạng thái
memberSchema.methods.isInActivated = function(checkStatus) {
    if(checkStatus == 'INACTIVE'){
        return true;
    } else {
        return false;
    }
}

memberSchema.methods.isSuspended = function(checkStatus){
    if (checkStatus == 'SUSPENDED'){
        return true;
    }else {
        return false;
    }
}

module.exports = mongoose.model('Member', memberSchema);