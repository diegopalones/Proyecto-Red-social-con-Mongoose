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

    // role: {
    //   type: String,
    //   required: true
    // },

    confirmed: {
      type: Boolean,
    },

    tokens: [],
    postIds: [{ type: ObjectId, ref: "Post" }],
  },

  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this._doc;

  delete user.tokens;

  delete user.password;

  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
