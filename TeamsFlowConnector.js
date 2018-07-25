const fetch = require('node-fetch');
const crypto = require('crypto');

const FLOW_URL = "https://prod-18.westcentralus.logic.azure.com:443/workflows/c84c9084f7a24a309314dcdb208beb2b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-JkFRj-Hv5vcQK2hbHVrcQ6n-8-Gre-ta2J_c8IIOsU";

// Still WIP! Auth does not work for some reason.
function checkAuth(key, payload) {
    let msgBuf = Buffer.from(payload, 'utf8');
	let msgHash = "HMAC " + crypto.createHmac('sha256', bufSecret).update(msgBuf).digest("base64");
    context.log(msgHash);
    context.log(key);
    return (msgHash === key);
}

function getFlowArgs(text, context=console) {
    const split = text.split(' ');
    split.shift();
    context.log(split);
    if(split.length != 2)
        return null;
    else
    {
        return split.map(x => x.trim());
    }
}

function submitFlowRequest([icm_id, icm_type]) {
    return fetch(FLOW_URL, 
                {
                    method: "POST", 
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify({
                        icm_id: icm_id,
                        icm_type: icm_type,
                    })
                });
}

module.exports = function (context, req) {
    context.log(req.headers['Authorization']);
    context.log(JSON.stringify(req.body));
    // if(!req.headers['Authorization'] || !checkAuth(req.headers['Authorization'], req.rawBody)) {
    //     context.res = {
    //         status: 200,
    //         body: {
    //             type: "message",
    //             text: "Unauthorized request!",
    //         }
    //     }
    //     context.done();
    //     return;
    // }
    if(req.body && req.body.text) {
        const flowArgs = getFlowArgs(req.body.text, context);
        context.log(flowArgs);
        if(flowArgs) {
            const flowReq = submitFlowRequest(flowArgs)       
            .then((res) => {
                context.log("Flow request complete");
                context.log(res);
                context.res = {
                    status: 200,
                    body: {
                        type: "message",
                        text: "Request completed with status code " + res.status,
                    },
                };
                context.done();
            });
        }
        else {
            context.res = {
                status: 200,
                body: {
                    type: "message",
                    text: "Usage: @OCI [ICM ID] [ICM type]",
                }
            }
        }
    }
    else {
        context.res = {
            status: 400,
            body: "No text field in request body!",
        }
        context.done();
    }
}
