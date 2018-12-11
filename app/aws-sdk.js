
const AWS = require('aws-sdk')


const credentials = new AWS.Credentials(
    "AKIAJJQGBH2XB2H6WRFQ",
    "4bJQHCZlvuFTrHpLUEgmv9HR7zQJZE0UOMST4nCQ"
)

const sts = new AWS.STS ({
    credentials: credentials,
    region: "eu-central-1" // Maybe this should be something else?
})

const policy = `{ "Version": "2012-10-17",
    "Statement": [{
        "Action": [
            "s3:PutObject"
        ],
    "Effect": "Allow",
    "Resource": "arn:aws:s3:::wallet-fox-images/*"
    }]
}`

sts.assumeRole({
    RoleArn: "arn:aws:iam::373772666655:user/rainmaker",
    RoleSessionName: "rainmaker-upload",
    DurationSeconds: 15 * 60, // 15 minutes
    Policy: policy
}, function(error, data) {
    /* Send the following to client:
    data.Credentials.AccessKeyId
    data.Credentials.SecretAccessKey
    data.Credentials.SessionToken */

    const body = {
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SectretAccessKey,
        sessionToken: data.Credentials.SessionToken
    }

    return body
})


const fileToUploadName = "placeholder"
const fileToUpLoadBody = "också placeholder"

s3.putObject({
    Bucket: "arn:aws:s3:::wallet-fox-images",
    Key: fileToUpload,        
    Body: fileToUpLoadBody 
}, function(error, data) {
    if(error){
        print(":(")
    } else {
        print(":)")
    }
})