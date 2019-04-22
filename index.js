const falcor = require('falcor');
const bodyParser = require('body-parser');
const express = require('express');
const routeDataSource = require('./routeDataSource');

const app = express();
const dataSource = new falcor.Model({
    cache: {
        todos: [
            {
                name: 'get milk from corner store',
                done: false
            },
            {
                name: 'withdraw money from ATM',
                done: true
            }
        ]
    }
}).asDataSource();

app.use(bodyParser.text({ type: 'text/*' }))
app.use('/pathEvaluator', routeDataSource(dataSource));

const server = app.listen(9090, function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Navigate to http://localhost:9090")
});