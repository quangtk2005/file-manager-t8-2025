"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDomain = void 0;
const checkDomain = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const referer = req.headers.referer;
    const ALLOWED_TO_TAKE_RESOURCES = (process.env.ALLOWED_TO_TAKE_RESOURCES || "").split(", ");
    if (!referer) {
        res.send("Truy cập không hợp lệ!");
        return;
    }
    try {
        for (var _d = true, ALLOWED_TO_TAKE_RESOURCES_1 = __asyncValues(ALLOWED_TO_TAKE_RESOURCES), ALLOWED_TO_TAKE_RESOURCES_1_1; ALLOWED_TO_TAKE_RESOURCES_1_1 = yield ALLOWED_TO_TAKE_RESOURCES_1.next(), _a = ALLOWED_TO_TAKE_RESOURCES_1_1.done, !_a; _d = true) {
            _c = ALLOWED_TO_TAKE_RESOURCES_1_1.value;
            _d = false;
            const domain = _c;
            if (referer.includes(domain)) {
                next();
                return;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = ALLOWED_TO_TAKE_RESOURCES_1.return)) yield _b.call(ALLOWED_TO_TAKE_RESOURCES_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.send("Truy cập không hợp lệ!");
    return;
});
exports.checkDomain = checkDomain;
