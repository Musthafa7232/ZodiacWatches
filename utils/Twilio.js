const accountSid = "AC6c2b00bd23861c2e18e68dfd8af3b226";
const authToken = "500b7167f749b154edb2828c901ae4a4";
const verifySid = "VA6ecddcf42d6a2fde6e4d8e800a500907";
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