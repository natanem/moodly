import mongoose, {Schema, model} from "mongoose";


const moodSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: [true, "Mood text is required"]},
    image: {type: String, default: null},
    tags: [{type: String}],
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comment: {
        user: {type: Schema.Types.ObjectId, ref: "User", required: true},
        text: {type: String, required: [true, "comment text is required"]},
        createdAt: {type: Date, default: Date.now()}
    },
    visibility: {
        type: String, enum: ["public", "private", "friends"], default: "public"
    },
    location: {
        type:String, default: null
    },
    likeCount: {type: Number, default: 0},
    commentCount: {type: Number, default: 0}
},
{
    timestamps: true
})

// Middleware: Automatically creating created at

moodSchema.pre("save", function(next) {
    this.likeCount = this.likes.length
    this.commentCount = this.comments.length
    next()
})




// moodSchema.add({
//     deleted: { type: Boolean, default: false }
// });

// // Soft delete method
// moodSchema.methods.softDelete = async function () {
//     this.deleted = true;
//     await this.save();
// };

// Method: Summary of Mood
moodSchema.methods.getSummary = function () {
    return `${this.user} felt ${this.mood} on ${this.createdAt.toLocaleDateString()}`;
};

moodSchema.methods.toggleLike = async function(user) {
    this.likes = this.likes.includes(user) ? this.likes.filter(u => u.toString() !== user.toString()) : [...this.likes, user]
    this.likeCount = this.likes.length
    await this.save()
}

moodSchema.methods.addComment = async function(user, text) {
    this.comments.push({user, text})
    this.commentCount = this.comments.length
    await this.save()
}

moodSchema.methods.addComment = async function(commentId) {
    this.comments = this.comments.filter(c => c_id.toString() !== commentId.toString()) 
    this.commentCount = this.comments.length
    await this.save()
}
// Finding Moods by a User
moodSchema.statics.findMoodsByUser = async function(user) {
    return await this.find({user: user}).populate("user", "username").sort({createdAt: -1})
}



const Mood = model("Mood", moodSchema)

export default Mood