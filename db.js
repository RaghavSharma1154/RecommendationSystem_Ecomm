const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://127.0.0.1:27017'; // Change this if your MongoDB instance is hosted elsewhere

// Database Name
const dbName = 'raghav';

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');
});


module.exports = {client};