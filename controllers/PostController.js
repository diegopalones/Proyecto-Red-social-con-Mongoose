const Post = require("../models/Post");
const User = require("../models/User");

const PostController = {
  
  async create(req, res, next) {
    try {
      const post = await Post.create({
        ...req.body,
        userId: req.user._id,
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { postIds: post._id },
      });
      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      next(error)
    }
  },

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const posts = await Post.find()
      .populate("comments.userId")
      .limit(limit)

      .skip((page - 1) * limit);
      
      res.send(posts);
    } catch (error) {
      console.error(error);
    }
  },

  async getById(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      res.send(post);
    } catch (error) {
      console.error(error);
    }
  },

  async getPostsByUserName(req, res) {
    try {
      if (req.params.username.length > 20) {
        return res.status(400).send("Busqueda demasiado larga");
      }
      const username = new RegExp(req.params.username, "i");
      const post = await Post.find({ username });
      res.send(post);
    } catch (error) {
      console.log(error);
    }
  },

  async delete(req, res) {
    try {
      
      const post = await Post.findByIdAndDelete(req.params._id);
      res.send({ post, message: 'post eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'Hubo un problema al eliminar el post',
      });
    }
  },


  async update(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res.send({ message: "Publicación actualizada correctamente", post });
    } catch (error) {
      console.error(error);
    }
  },

  async insertComment(req, res) {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params._id,
        {
          $push: {
            comments: { comment: req.body.comment, userId: req.user._id },
          },
        },
        { new: true }
      );
      res.send({msg:"Gracias por comentar",post});
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "No se ha podido comentar la publicación" });
    }
  },
};
module.exports = PostController;