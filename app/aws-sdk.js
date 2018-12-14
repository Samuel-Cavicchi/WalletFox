const AWS = require('aws-sdk')

const credentials = new AWS.Credentials(
    "AKIAJJQGBH2XB2H6WRFQ",
    "4bJQHCZlvuFTrHpLUEgmv9HR7zQJZE0UOMST4nCQ"
)

const sts = new AWS.STS ({
    credentials: credentials,
    region: "eu-central-1" 
})

function getUploadCredentials(userid) { 

    // Creates policy which allows user to upload an image with the same name as their user ID
    const policy = `{ "Version": "2012-10-17",
        "Statement": [{
            "Action": [
                "s3:PutObject"
            ],
        "Effect": "Allow",
        "Resource": "arn:aws:s3:::wallet-fox-images/` + userid + `"
        }]
    }`

    return new Promise (function(resolve, reject) {
        sts.assumeRole({
            RoleArn: "arn:aws:iam::373772666655:role/justtesting",
            RoleSessionName: "rainmaker-upload",
            DurationSeconds: 60 * 60,
            Policy: policy
        }, function(error, data) {
            if (error) {
                reject(error)
            } else {
                const body = {
                    AccessKeyId: data.Credentials.AccessKeyId,
                    SecretAccessKey: data.Credentials.SecretAccessKey,
                    SessionToken: data.Credentials.SessionToken,
                    Expiration: data.Credentials.Expiration
                }
                resolve(body)
            }

        })  
    })
} 

module.exports.getUploadCredentials = getUploadCredentials