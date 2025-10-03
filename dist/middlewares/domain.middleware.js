export const checkDomain = async (req, res, next) => {
    const referer = req.headers.referer;
    const ALLOWED_TO_TAKE_RESOURCES = (process.env.ALLOWED_TO_TAKE_RESOURCES || "").split(", ");
    if (!referer) {
        res.send("Truy cập không hợp lệ!");
        return;
    }
    for await (const domain of ALLOWED_TO_TAKE_RESOURCES) {
        if (referer.includes(domain)) {
            next();
            return;
        }
    }
    res.send("Truy cập không hợp lệ!");
    return;
};
