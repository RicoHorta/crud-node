const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const PORT = process.env.PORT || 3000;

//handlebars config
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
})); app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.send('ola mundo');
})

app.listen(PORT, () => {
    console.log('Express server listening http://192.168.0.166:' + PORT);
});