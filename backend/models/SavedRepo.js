
const mongoose = require('mongoose');

const SavedRepoSchema = new mongoose.Schema({
    repoId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    html_url: { type: String },
    stargazers_count: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
});

const SavedRepo = mongoose.model('SavedRepo', SavedRepoSchema);
module.exports = SavedRepo;
