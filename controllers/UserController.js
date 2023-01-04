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

      res.status(201).send({msg:"Usuario confirmado"});
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
        return res.status(400).send({msg:"Correo o contraseña incorrectos"});
      }

      if (!user.confirmed) {
        return res.status(400).send({ msg: "Debes confirmar tu correo" });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
   
      if (!isMatch) {
        return res.status(400).send({msg:"Correo o contraseña incorrectos"});
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      if (user.tokens.length > 4) user.tokens.shift();

      user.tokens.push(token);

      await user.save();

      res.send({ msg: "Bienvenid@ " + user.username, token, user });
    } catch (error) {
      console.error(error);
    }
  },

  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });

      res.send({ msg: "Desconectado con éxito" });
    } catch (error) {
      console.error(error);

      res.status(500).send({
        msg: "Hubo un problema al intentar desconectar al usuario",
      });
    }
  },

  async getInfo(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate({
          path: "postIds",

          populate: {
            path: "comments.userId",
          },
        })
        .populate("followers", "username")
        .populate("following", "username");
      res.send({message: "information", user});
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem",
      });
    }
  },
  async follow(req, res) {
    try {
      const existUser = await User.findById(req.params._id); // get id from params
      if (!existUser.followers.includes(req.user._id)) {
        // if the id of user is not already in followers
        const user = await User.findByIdAndUpdate(
          req.params._id,
          { $push: { followers: req.user._id } }, //push user on to following list
          { new: true } // update and show updat
        );
        await User.findByIdAndUpdate(
          req.user._id,
          { $push: { following: req.params._id } }, //push user on to following list
          { new: true } // update and show updat
        );
        res.send(user);
      } else {
        res.status(400).send({ message: "You already follow this person!" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem with following this person." });
    }
  },
  async unFollow(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params._id,
        { $pull: { followers: req.user._id } },
        { new: true }
      );
      res.send(user);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send({ message: "There was a problem with your unfollow" });
    }
  },
};

module.exports = UserController;
