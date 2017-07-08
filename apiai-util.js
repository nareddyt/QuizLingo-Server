/**
 * Created by tejun on 7/8/2017.
 */
module.exports = {
    /**
     * Sends a fulfillment response with a followup back to api.ai
     */
    sendFollowupResponse: function (res, followupEvent, parameters) {
        let json = {};

        let event = {};
        event.name = followupEvent;
        json.followupEvent = event;

        if (parameters) {
            let size = Object.keys(parameters).length;
            if (size > 0) {
                event.data = parameters;
            }
        }

        res.json(json);
    }
};