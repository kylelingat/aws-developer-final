const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const AWS = require('aws-sdk');
const path = require('path');
const home = require('./routes/home');
const order = require('./routes/new-order');
AWS.config.loadFromPath('./config.json');
AWS.config.update({region: 'us-west-2'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

app.use(bodyParser.urlencoded({extended:true}))
app.use("/public", express.static(path.join(__dirname, 'public')));

app.set('view engine', '.hbs');

app.engine('.hbs', exphbs({
  extname:'.hbs',
  defaultLayout:'main',
}))

app.use('/home', home)
app.use('/order', order)

app.listen(PORT, () => {
    console.log(`Server started, listening on ${PORT}`);
})

function createSqsQueue() {
	var params = {
	  QueueName: 'SQS_queue_kyle',
	  Attributes: {
	    'DelaySeconds': '60',
	    'MessageRetentionPeriod': '86400'
	  }
	};

	sqs.createQueue(params, function(err, data) {
	  if (err) {
	    console.log("Error", err);
	  } else {
	    console.log("Success", data.QueueUrl);
	  }
	});
}

createSqsQueue()
