const AWS = require('aws-sdk')


const credentials = new AWS.Credentials(
    "AKIAJJQGBH2XB2H6WRFQ",
    "4bJQHCZlvuFTrHpLUEgmv9HR7zQJZE0UOMST4nCQ"
)

const s3 = new AWS.s3 ({
    credentials: credentials,
    region: "s3.eu-central-1.amazonaws.com" //endpoint. Maybe it should be something else?
})

s3.putOb