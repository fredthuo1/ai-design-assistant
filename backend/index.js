const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('AI Design Assistant Backend');
});

app.post('/suggestions', (req, res) => {
    const { design } = req.body;

    // Dummy suggestions for now
    const suggestions = [
        'Consider using a lighter background color',
        'Align text to the center for better symmetry',
        'Use a bolder font for the title'
    ];

    res.json(suggestions);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
