const AWS = require('aws-sdk')


const credentials = new AWS.Credentials(
    "AKIAJJQGBH2XB2H6WRFQ",
    "4bJQHCZlvuFTrHpLUEgmv9HR7zQJZE0UOMST4nCQ"
)

const sts = new AWS.STS ({
    credentials: credentials,
    region: "eu-central-1" 
})

const policy = `{ 
    "Version": "2012-10-17",
    "Statement": [{
        "Action": [
            "s3:PutObject"
        ],
        "Effect": "Allow",
        "Resource": "arn:aws:s3:::wallet-fox-images"
    }]
}`

const assumeRole = sts.assumeRole({
    RoleArn: "arn:aws:iam::373772666655:role/justtesting",
    RoleSessionName: 'bucketUploadSession',
    DurationSeconds: 15 * 60, // 15 minutes
    Policy: policy
}, function(error, data) {

    /* Send the following to client:
    data.Credentials.AccessKeyId
    data.Credentials.SecretAccessKey
    data.Credentials.SessionToken */

    if (error) {
        print(error)
    } else {
        var tempCreds = {
            AccessKeyId: data.Credentials.AccessKeyId,
            SecretAccessKey: data.Credentials.SecretAccessKey,
            SessionToken: data.Credentials.SessionToken
        }
        return tempCreds
    }

})

module.exports.assumeRole = assumeRole