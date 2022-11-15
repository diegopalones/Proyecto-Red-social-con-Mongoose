const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys')



const UserController = {
  async create(req, res,next) {
    try {
      if(req.body.password === undefined){
        res.status(500).send({msg:'Debes introducir una contraseña'})
      }
      const password = await bcrypt.hash(req.body.password,10);
      const user = await User.create({...req.body,password});
      res.status(201).send(user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async login(req, res) {

    try {
    
    const user = await User.findOne({
    
    email: req.body.email,
    
    });

    if (!user){
     return res.status(400).send("Correo o contraseña incorrectos")

    }

    const isMatch = bcrypt.compare(req.body.password,user.password)
    if(!isMatch){
     return res.status(400).send("Correo o contraseña incorrectos");
    }
    
    const token = jwt.sign({ _id: user._id }, jwt_secret);
    
    if (user.tokens.length > 4) user.tokens.shift();
    
    user.tokens.push(token);
    
    await user.save();
    
    res.send({ message: 'Bienvenid@ ' + user.username, token,user });
    
    } catch (error) {
    
    console.error(error);
    
    }
    
    },

    async logout(req, res) {

      try {
      
      await User.findByIdAndUpdate(req.user._id, {
      
      $pull: { tokens: req.headers.authorization },
      
      });
      
      res.send({ message: "Desconectado con éxito" });
      
      } catch (error) {
      
      console.error(error);
      
      res.status(500).send({
      
      message: "Hubo un problema al intentar desconectar al usuario",
      
      });
      
      }
      
      },

      async loggedIn(req, res) {
        try {
          console.log("users")
          const user = await User.findById(req.user._id)
          console.log("user",user)
          res.send({msg:"user logged",user});
        } catch (error) {
          console.error(error);
          res.status(500).send({
            msg: "Ha habido un problema al consultar el usuario logeado",
            error,
          });
        }
      },

};

module.exports = UserController;