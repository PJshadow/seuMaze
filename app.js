const express = require('express');
const app = express();
const path = require('path');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
// Serve bootstrap from node_modules if needed, or use CDN in view. 
// For simplicity and performance in dev, usually static folder or CDN.
// Let's use CDN in layout for easier setup or serve static if preferred.
// Using CDN is robust for this level of task.

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = 3596;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
