import mongoose from "mongoose";

const {Schema, model}  = mongoose

const moodSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    mood: {type: String, required: [true, "Mood is required"]},
    note: {type: String},
}, {
    timestamps: true
})

// Middleware: Automatically creating created at

moodSchema.pre("save", function(next) {
    if(!this.createdAt) {
        this.createdAt = new Date()
    }
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


// Finding Moods by a User
moodSchema.statics.findMoodsByUser = async function(user) {
    return await this.find({user: user}).populate("user", "username").sort({createdAt: -1})
}



const Mood = model("Mood", moodSchema)

export default Mood