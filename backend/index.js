
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const { authenticate, router: authRoutes } = require('./routes/auth');  
const { saveRepoRoute, getSavedReposRoute } = require('./routes/repos');  

const app = express();
app.use(cors());
app.use(express.json());  
const PORT = 5000;


const mongoDBUri = 'mongodb://localhost:27017/Git_Repo';  


mongoose.connect(mongoDBUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);  
    });


app.use('/api/auth', authRoutes);  


app.post('/api/save-repo', authenticate, saveRepoRoute);  
app.get('/api/saved-repos', authenticate, getSavedReposRoute);  


app.get('/api/repos', async (req, res) => {
    const { limit } = req.query;
    
    
    const perPage = limit || 10;
    
    try {
        const response = await axios.get(`https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=${perPage}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        res.status(500).json({ message: 'Error fetching repositories from GitHub' });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
