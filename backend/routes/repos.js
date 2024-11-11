
const SavedRepo = require('../models/SavedRepo');  
const User = require('../models/User');  


const saveRepoRoute = async (req, res) => {
    const { repoId, name, description, html_url, stargazers_count } = req.body;
    try {
        const user = await User.findById(req.userId);  
        if (!user) return res.status(404).json({ message: 'User not found' });

        const repo = new SavedRepo({
            repoId,
            name,
            description,
            html_url,
            stargazers_count,
            user: user._id,
        });

        await repo.save();
        user.savedRepos.push(repo._id);
        await user.save();
        
        res.status(201).json({ message: 'Repository saved successfully', repo });
    } catch (error) {
        res.status(500).json({ message: 'Error saving repository', error });
    }
};


const getSavedReposRoute = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('savedRepos'); 
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json(user.savedRepos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved repositories', error });
    }
};

module.exports = { saveRepoRoute, getSavedReposRoute };
