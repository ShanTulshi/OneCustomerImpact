const querystring = require('querystring');
const fetch = require('node-fetch');

const SLACK_SLASH_TOKEN = "SLACK_SLASH_TOKEN";
const FLOW_URL = "FLOW_URL";

function parseHookBody(body) {
    const qs = querystring.parse(body);

    return qs && qs.token && qs.token == SLACK_SLASH_TOKEN && 
           qs.command && qs.text;
}

function getFlowArguments(body) {
    const split = body.split(" ");

    const icmId = split.shift();
    const icmType = split.join(" ");

    return {
        icm_id: icmId,
        icm_type: icmType
    };
}

function submitFlowRequest(args) {
    return fetch(FLOW_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(args)
    });
}

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const slashInput = req.body && parseHookBody(req.body) || null;

    if (slashInput) {
        context.log("Input successfully validated.");

        const flowArgs = getFlowArguments(slashInput);
        const flowRequest = submitFlowRequest(flowArgs);

        flowRequest.then((response) => {
            context.log("Flow request complete.");
            context.log(response);

            context.res = {
                // status: 200, /* Defaults to 200 */
                body: "Flow completed with status code " + response.status
            };
            context.done();

            response.text().then((text) => {
                context.log("Response: " + text);
            });
        });
    }
    else {
        context.log("Input could not be validated.");

        context.res = {
            status: 400,
            body: "Bad request"
        };
        context.done();
    }
};
