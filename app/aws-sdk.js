const AWS = require('aws-sdk')


const credentials = new AWS.Credentials(
    "AKIAJJQGBH2XB2H6WRFQ",
    "4bJQHCZlvuFTrHpLUEgmv9HR7zQJZE0UOMST4nCQ"
)

const sts = new AWS.STS ({
    credentials: credentials,
    region: "eu-central-1" // Maybe this should be something else?
})

userid = "123"

const policy = `{ "Version": "2012-10-17",
    "Statement": [{
        "Action": [
            "s3:PutObject"
        ],
    "Effect": "Allow",
    "Resource": "arn:aws:s3:::wallet-fox-images/` + userid + `"
    }]
}`

function getUploadCredentials() {
    return new Promise (function(resolve, reject) {
        sts.assumeRole({
            RoleArn: "arn:aws:iam::373772666655:role/justtesting",
            RoleSessionName: "rainmaker-upload",
            DurationSeconds: 15 * 60, // 15 minutes
            Policy: policy
        }, function(error, data) {
            if (error) {
                reject(error)
            } else {
                const body = {
                    AccessKeyId: data.Credentials.AccessKeyId,
                    SecretAccessKey: data.Credentials.SecretAccessKey,
                    SessionToken: data.Credentials.SessionToken,
                    Expiration: data.Credentials.Expiration // date is in GMT
                }
                resolve(body)
            }

        })  
    })
} 


// const fileToUploadName = "placeholder"
// const fileToUpLoadBody = "också placeholder"

// s3.putObject({
//     Bucket: "arn:aws:s3:::wallet-fox-images",
//     Key: fileToUpload,        
//     Body: fileToUpLoadBody 
// }, function(error, data) {
//     if(error){
//         print(":(")
//     } else {
//         print(":)")
//     }
// })

module.exports.getUploadCredentials = getUploadCredentials