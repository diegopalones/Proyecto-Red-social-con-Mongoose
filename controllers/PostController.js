const Post = require("../models/Post");

const PostController = {
  async create(req, res) {
    try {
      const post = await Post.create(req.body);
      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Ha habido un problema al crear la publicación" });
    }
  },

  async getAll(req, res) {
    try {
      const posts = await Post.find();
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
};
module.exports = PostController;