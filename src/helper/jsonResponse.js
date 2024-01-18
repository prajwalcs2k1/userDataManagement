exports.success = (data = returnedData, message = returnedMessage)=>{
    return {
        data : data,
        message : message,
        status : true
    }
}

exports.failure = (data = returnedData, message = returnedMessage)=>{
    return {
        data : data,
        message : message,
        status : false
    }
}