require('dotenv').config()
const accountSid =process.env.ACCOUNT
const authToken = process.env.TOKEN;
const verifySid = process.env.VERIFY;
const client = require("twilio")(accountSid, authToken);

module.exports={
    sendotp: (number)=> {
      client.verify.v2
            .services(verifySid)
            .verifications.create({ to: `+91${number}`, channel: "sms" })
    },
 
    check: async (otpCode,number) => {
        try{
  const status = await client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: `+91${number}`, code: otpCode });
             return status
        }catch(err){
            console.log(err);
        }   
    }

}