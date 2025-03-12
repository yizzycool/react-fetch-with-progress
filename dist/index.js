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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchWithProgress = void 0;
const react_1 = require("react");
const useFetchWithProgress = () => {
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [eta, setETA] = (0, react_1.useState)(0);
    const [response, setResponse] = (0, react_1.useState)(null);
    const fetchWithProgress = (resource, options, callback) => _fetchWithProgress(resource, options, callback, {
        setProgress,
        setETA,
        setResponse,
    });
    return { progress, eta, response, fetchWithProgress };
};
exports.useFetchWithProgress = useFetchWithProgress;
const _fetchWithProgress = (resource = "", options = {}, callback = () => { }, { setProgress, setETA, setResponse }) => {
    const responsePromise = fetch(resource, options);
    _processReponse(responsePromise, callback, {
        setProgress,
        setETA,
        setResponse,
    });
    return responsePromise;
};
const _processReponse = (responsePromise_1, callback_1, _a) => __awaiter(void 0, [responsePromise_1, callback_1, _a], void 0, function* (responsePromise, callback, { setProgress, setETA, setResponse }) {
    var _b;
    const response = yield responsePromise;
    setResponse(response);
    const clonedResponse = response.clone();
    const reader = (_b = clonedResponse.body) === null || _b === void 0 ? void 0 : _b.getReader();
    if (!reader)
        return;
    const contentLength = +(clonedResponse.headers.get("content-length") || 0);
    let receivedLength = 0;
    let chunks = [];
    const startTime = performance.now();
    while (true) {
        const { done, value } = yield reader.read();
        const periodTime = performance.now() - startTime;
        if (done) {
            setProgress(100);
            setETA(0);
            break;
        }
        chunks.push(value);
        receivedLength += value.length;
        const progress = (receivedLength * 100) / contentLength;
        const eta = (periodTime * (contentLength - receivedLength)) / receivedLength;
        setProgress(progress);
        setETA(eta);
        callback({ progress, eta });
    }
});
exports.default = useFetchWithProgress;
