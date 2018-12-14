function checkRequestParams(paramData) {
    var missingParams = {}
    var isMissingParams = false
    var missingKeys
    
    if(paramData.requiredBody) {
        missingKeys = checkKeys(paramData.requiredBody, Object.keys(paramData.request.body))
        if(missingKeys) {
            missingParams.body = missingKeys
            isMissingParams = true
        }
    }
    if(paramData.requiredQuery) {
        missingKeys = checkKeys(paramData.requiredQuery, Object.keys(paramData.request.query))
        if(missingKeys) {
            missingParams.query = missingKeys
            isMissingParams = true
        }
    }
    if(paramData.requiredPath) {
        missingKeys = checkKeys(paramData.requiredPath, Object.keys(paramData.request.params))
        if(missingKeys) {
            missingParams.path = missingKeys
            isMissingParams = true
        }
    }


    if(isMissingParams) {
        return { missingParameters: missingParams }
    } else {
        return false
    }
}

function checkKeys(requiredKeys, requestKeys) {
    var missingParams = []
    var isMissingParams = false;

    requiredKeys.forEach(function(requiredKey) {
        if(!requestKeys.includes(requiredKey)) // If the request parameters does not include the required parameter
        {
            isMissingParams = true
            missingParams.push(requiredKey)
        }
    })
    if(isMissingParams) {
        return missingParams
    } else {
        return false
    }
}


module.exports.checkRequestParams = checkRequestParams