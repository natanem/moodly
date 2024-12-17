import mongoose from "mongoose";

const {Schema, model}  = mongoose

const moodSchema = new Schema({
    user: {type: String, required: true},
    mood: {type: String, required: true},
    note: {type: String},
    createdAt: {type: Date}
})

// Middleware: Automatically creating created at

moodSchema.pre("save", function(next) {
    if(!this.createdAt) {
        this.createdAt = new Date()
    }
    next()
})

// Method: Summary of Mood
moodSchema.methods.getSummary = function () {
    return `${this.user} felt ${this.mood} on ${this.createdAt.toLocaleDateString()}`;
};

// Finding Moods by a User
moodSchema.statics.findByUser = function(username) {
    return this.find({user: username})
}

const Mood = model("Mood", moodSchema)

export default Mood