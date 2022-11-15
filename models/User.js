const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;
 


const UserSchema = new mongoose.Schema(
  {
    username: {

      type: String,
      
      required: [true, "Por favor rellena tu nombre"],
      
      },

      password: {

        type: String,
        
        required: [true, "Por favor rellena tu contraseña"],
        
        },

    email: {

      type: String,
      
      match: [/.+\@.+\..+/, "Este correo no es válido"],
      
      unique: true,
      
      required: [true, "Por favor rellena tu correo"],
      
      },

    tokens:[],
    postIds: [{type: ObjectId, ref:"Post"}],

    
  },

  { timestamps: true }

);

const User = mongoose.model("User", UserSchema);

module.exports = User;