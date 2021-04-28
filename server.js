const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const cors = require("cors");
const items = require('./routes/api/items');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');


const app = express();

app.use(cors());
//BodyParser Middleware
app.use(express.json());

//DB Configuration
const db = config.get('mongoURI');

//Connect to db
mongoose.connect(db, { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
     })
    .then(() => console.log('Database connected...'))
    .catch(err => console.log(err));
    
//Use Routes
app.use('/api/items', items);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Serve static asset if in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder 
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port} .`));
