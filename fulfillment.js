/**
 * Created by tejun on 7/8/2017.
 */

var apiaiUtil = require('./apiai-util');

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
            // TODO randomly pick word from db based on language
            if (language.toUpperCase() === 'spanish'.toUpperCase()) {
                word = 'comer';
            }

            console.log('asking about word', word);

            let params = {
                toAskWord: word,
                language: language
            };

            apiaiUtil.sendFollowupResponse(res, 'ask-for-answer', params);
        } else if (action === 'check_answer') {
            console.log('Webhook action: check_answer');

            let language;
            let word;
            let answer;
            for (const con of contexts) {
                if (con.name === 'save-language') {
                    language = con.parameters.language;
                    word = con.parameters.toAskWord;
                    answer = con.parameters.answer;
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