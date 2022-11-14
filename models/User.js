const mongoose = require("mongoose");
 


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
    
  },

  { timestamps: true }

);

const User = mongoose.model("User", UserSchema);

module.exports = User;