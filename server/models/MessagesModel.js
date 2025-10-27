import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
      recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:false
    },
    messageType:{
        type:String,
        enum : ["text","file"],
        required:true
    },
    content:{
        type:String,
        required:function(){
            return this.messageType === "text"
        },
    },
    fileUrl:{
        type:String,
        required: function(){
            return this.messageType === "file";
        },
    },
    // timestamps:{
    //     type:Date,
    //     default:Date.now,
    // },
      createdAt: {  // rename timestamps -> createdAt
    type: Date,
    default: Date.now,
    index: { expires: '1d' } // auto-delete 24 hours after creation
  }
});


const Message = mongoose.model("Messages",messageSchema);

export default Message