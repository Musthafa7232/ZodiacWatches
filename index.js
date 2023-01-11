// const express =require('express')
// const twilio=require('twilio')
// const fast2sms = require('fast-two-sms')

// var options={
//     authorization:"7o9qanzbmewMOIx6fsRApLVhuSZQF8EYkKGr34HUNjWvB50ygC9rZEMnw0hkXFSRgipdI8Kay5GqNjte",
//  message:'this is a otp verification from Timex.Your otp is 1010',
//  numbers:['9544535049']
// };


// fast2sms.sendMessage(options)
// .then((response)=>{
//     console.log(response);
// })
// .catch((error)=>{
//     console.log(error);
// })



const express = require('express')
// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC6c2b00bd23861c2e18e68dfd8af3b226";
const authToken = "500b7167f749b154edb2828c901ae4a4";
const verifySid = "VA6ecddcf42d6a2fde6e4d8e800a500907";
const client = require("twilio")(accountSid, authToken);

sendotp=client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+919544535049", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+919544535049", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });
