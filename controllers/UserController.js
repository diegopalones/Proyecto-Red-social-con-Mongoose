const User = require("../models/User");
const bcrypt = require("bcryptjs");
const transporter = require("../config/nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserController = {
  async create(req, res, next) {
    try {
      if (req.body.password === undefined) {
        res.status(500).send({ msg: "Debes introducir una contraseña" });
      }
      const password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password,
        confirmed: false,
      });
      const emailToken = jwt.sign(
        { email: req.body.email },
        process.env.JWT_SECRET,
        { expiresIn: "48h" }
      );
      const url = "http://localhost:8080/users/confirm/" + emailToken;
      await transporter.sendMail({
        to: req.body.email,

        subject: "Por favor, confirma el registro",

        html: `<h3>Bienvenido, te queda nada para poder utilizar nuestros servicios... </h3>
        
        <a href="${url}"> Click para confirmar tu registro</a>
        
        `,
      });

      res.status(201).send({
        msg: "Te hemos enviado un correo para confirmar el registro",
        user,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async confirm(req, res) {
    try {
      const token = req.params.email;
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload);

      await User.updateOne(
        {
          email: payload.email,
        },

        { confirmed: true }
      );

      res.status(201).send("Usuario confirmado");
    } catch (error) {
      console.error(error);
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(400).send("Correo o contraseña incorrectos");
      }

      if (!user.confirmed) {
        return res.status(400).send({ message: "Debes confirmar tu correo" });
      }

      const isMatch = bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send("Correo o contraseña incorrectos");
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      if (user.tokens.length > 4) user.tokens.shift();

      user.tokens.push(token);

      await user.save();

      res.send({ message: "Bienvenid@ " + user.username, token, user });
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
      console.log("users");
      const user = await User.findById(req.user._id);
      console.log("user", user);
      res.send({ msg: "user logged", user });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        msg: "Ha habido un problema al consultar el usuario logueado",
        error,
      });
    }
  },
};

module.exports = UserController;
