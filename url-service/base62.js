// Base62 encoder: converts a numeric ID to a short alphanumeric code
// Characters: 0-9, a-z, A-Z  (62 total)

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const encode = (num) => {
    if (num === 0) return CHARS[0];
    let result = "";
    while (num > 0) {
        result = CHARS[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
};

module.exports = { encode };
