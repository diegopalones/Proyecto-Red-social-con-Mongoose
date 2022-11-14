const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    username: {

      type: String,
      
      required: [true, "Por favor rellena tu nombre"],
      
      },
      
      body: {

        type: String,
        
        required: [true, "Por favor, introduce tu post"],
        
        },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;