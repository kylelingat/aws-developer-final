require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var sqs = new AWS.SQS();
var sns = new AWS.SNS();

function sendOrderStatus() {
	var params = {
	  Message: 'Your order has been processed and recieved', /* required */
	  TopicArn: 'arn:aws:sns:us-west-2:179893405685:sns-topic'
	};

	sns.publish(params, (err, data) => {
		if (err) {
			console.log(`Error: ${err}`);
		} else {
			console.log('Success');
		}
	})
}

sendOrderStatus();

router.route('/')
    .get((req, res) => {
        res.render('../views/new-order')
    })
	.post((req, res) => {
		var messageParam = {
			MessageBody: JSON.stringify(req.body.formData),
			QueueUrl: process.env.QUEUE_URL
		};
		sqs.sendMessage(messageParam, (err, data) => {
			if (err) {
				console.log(err)
			}
    		else {
    			console.log(data); 
    			sendOrderStatus();
    		}
		})
    })

module.exports = router;

