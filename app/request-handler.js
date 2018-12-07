function checkRequestParams(paramsArr, requestObj) {
    const keys = Object.keys(requestObj)
    var missingParams = [];
    var isMissingParams = false;
    paramsArr.forEach(function(param) {
        if(!keys.includes(param))
        {
            isMissingParams = true
            missingParams.push(param)
        }
    })

    if(isMissingParams) {
        return missingParams
    } else {
        return false
    }
}

module.exports.checkRequestParams = checkRequestParams