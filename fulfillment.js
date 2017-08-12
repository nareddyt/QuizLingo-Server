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
            let id = -1;
            let params = {};

            if (language.toUpperCase() === 'spanish'.toUpperCase()) {
                id = Math.floor(Math.random() * 4500);

                params = {
                    Key: {
                        "id": {
                            N: id.toString()
                        }
                    },
                    TableName: "Spanish"
                };
            } else if (language.toUpperCase() === 'french'.toUpperCase()) {
                id = Math.floor(Math.random() * 1000);

                params = {
                    Key: {
                        "id": {
                            N: id.toString()
                        }
                    },
                    TableName: "French"
                };
            }

            console.log('Getting word number', id);

            let dynamodb = new AWS.DynamoDB();
            dynamodb.getItem(params, function (err, data) {
                if (err) {
                    // an error occurred
                    console.log(err, err.stack);
                } else {
                    // successful response
                    word = data.Item.Spanish.S;
                    if (word === null) {
                        word = data.Item.French.S;
                    }

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
            // For now, just do a simple comparision
            let response = 'No, it means: ' + def + '.';

            const definitions = def.split(",");
            for (let definition of definitions) {

                // Check for a correct definition
                if (definition.indexOf(answer) > -1) {
                    console.log('Found the defintion:', definition);
                    response = 'Yes, that is correct!';
                    break;
                }

            }

            // Response
            let params = {
                feedback: response
            };

            apiaiUtil.sendFollowupResponse(res, 'send_feedback', params);

        } else {
            res.sendStatus(400);
        }
    }
};
