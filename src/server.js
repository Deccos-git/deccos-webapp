const express = require('express');
const app = express();

app.get('/:id',function(req,res)
{
    res.sendFile('index.html', { root: __dirname });
});