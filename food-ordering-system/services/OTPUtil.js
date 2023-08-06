module.exports.generateOTP = () => {
    const OTP = Math.floor(Math.random() * 1000000);
    return OTP;
}