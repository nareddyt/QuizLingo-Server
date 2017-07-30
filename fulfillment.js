/**
 * Created by tejun on 7/8/2017.
 */

const apiaiUtil = require('./apiai-util');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-1'});

module.exports = {
    process: function (req, res) {
        let action = req.body.result.action;
        let contexts = req.body.result.contexts;

        // TODO branch here
        if (action === 'ask_question') {
            console.log('Webhook action: ask_question');

            let language;
            for (const con of contexts) {
                if (con.name === 'save-language') {
                    language = con.parameters.language;
                }
            }
            console.log('language set to ' + language);

            let word = 'NEED TO PICK ' + language + ' WORD FROM DB';

            // Randomly pick word from db based on language
            if (language.toUpperCase() === 'spanish'.toUpperCase()) {
                let id = Math.floor(Math.random() * 4500);

                let params = {
                    Key: {
                        "id": {
                            N: id.toString()
                        }
                    },
                    TableName: "Spanish"
                };

                console.log('Getting word number', id);

                let dynamodb = new AWS.DynamoDB();
                dynamodb.getItem(params, function (err, data) {
                    if (err) {
                        // an error occurred
                        console.log(err, err.stack);
                    } else {
                        // successful response
                        word = data.Item.Spanish.S;
                        let def = data.Item.English.S;
                        console.log('asking about word', word);

                        let params = {
                            toAskWord: word,
                            language: language,
                            definitionOfWord: def
                        };

                        apiaiUtil.sendFollowupResponse(res, 'ask-for-answer', params);
                    }
                });
            }
        } else if (action === 'check_answer') {
            console.log('Webhook action: check_answer');

            let language;
            let word;
            let answer;
            let def;
            for (const con of contexts) {
                if (con.name === 'save-language') {
                    language = con.parameters.language;
                    word = con.parameters.toAskWord;
                    answer = con.parameters.answer;
                    def = con.parameters.definitionOfWord;
                }
            }

            // TODO actual checking logic with a theasurus or something

            // TODO change response based on correctness
            let response = 'Yes, that is correct!';
            let params = {
                feedback: response
            };

            apiaiUtil.sendFollowupResponse(res, 'send_feedback', params);

        } else {
            res.sendStatus(400);
        }
    }
};