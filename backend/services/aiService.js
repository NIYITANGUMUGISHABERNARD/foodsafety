exports.calculateRisk = (temperature, humidity, expiryDate) => {

    let score = 0;

    if (temperature > 35) score += 40;
    if (humidity > 70) score += 30;

    const today = new Date();
    const expiry = new Date(expiryDate);

    const daysLeft = (expiry - today) / (1000 * 60 * 60 * 24);

    if (daysLeft < 0) score += 100;
    else if (daysLeft < 3) score += 40;
    else if (daysLeft < 7) score += 20;

    let risk = "Safe";

    if (score >= 70) risk = "Unsafe";
    else if (score >= 40) risk = "Warning";

    return { risk, score };
};