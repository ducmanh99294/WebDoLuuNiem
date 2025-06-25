const axios = require("axios");
const crypto = require("crypto");

const createPayment = async (req, res) => {
    const { amount, orderId = Date.now().toString() } = req.body;

    const { PARTNER_CODE, ACCESS_KEY, SECRET_KEY, ENDPOINT, RETURN_URL, NOTIFY_URL } = process.env;

    const requestId = Date.now().toString();
    const orderInfo = "Pay with MoMo";
    const extraData = ""; // Custom data

    // Bước 1: Tạo raw signature string
    const rawSignature = `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${NOTIFY_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${PARTNER_CODE}&redirectUrl=${RETURN_URL}&requestId=${requestId}&requestType=captureWallet`;

    // Bước 2: Tạo signature bằng HMAC SHA256
    const signature = crypto.createHmac("sha256", SECRET_KEY)
        .update(rawSignature)
        .digest("hex");

    const requestBody = {
        partnerCode: PARTNER_CODE,
        accessKey: ACCESS_KEY,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl: RETURN_URL,
        ipnUrl: NOTIFY_URL,
        extraData,
        requestType: "captureWallet",
        signature,
        lang: "en"
    };

    try {
        const response = await axios.post(ENDPOINT, requestBody);
        return res.json({
        payUrl: response.data.payUrl,
        ...response.data,
        });
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        return res.status(500).json({ message: "Payment error" });
    }
}

const paymentNotify = async (req, res) => {
    res.status(200).send("OK");
}

const paymentReturn = async (req, res) => {
    res.send("Thanh toán hoàn tất! Momo đã redirect về đây.");
}

module.exports = {
    createPayment,
    paymentNotify,
    paymentReturn
};