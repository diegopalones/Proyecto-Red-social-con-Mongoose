const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,

      required: [true, "Por favor, escribe un post"],
    },

    body: {
      type: String,

      required: [true, "Por favor, tu post debe contener una descrpción"],
    },

    userId: {
      type: ObjectId,
      ref: "User",
    },
    comments: [
      {
        userId: { type: ObjectId, ref: "User" },
        comment: String,
      },
    ],

    likes: [{ type: ObjectId }],
    image_path: { type: String }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
