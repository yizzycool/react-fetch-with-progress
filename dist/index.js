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
/**
 * Fetch with progress (especially suitable for large file fetching)
 */
const useFetchWithProgress = () => {
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [eta, setETA] = (0, react_1.useState)(0);
    const [response, setResponse] = (0, react_1.useState)(null);
    const fetchWithProgress = (resource, options = {}) => _fetchWithProgress(resource, options, { setProgress, setETA, setResponse });
    return { progress, eta, response, fetchWithProgress };
};
exports.useFetchWithProgress = useFetchWithProgress;
const _fetchWithProgress = (resource = "", options = {}, { setProgress, setETA, setResponse }) => {
    // Fetch
    const responsePromise = fetch(resource, options);
    // Asynchronously update progress
    _processReponse(responsePromise, { setProgress, setETA, setResponse });
    return responsePromise;
};
/**
 * Update progress and ETA
 */
const _processReponse = (responsePromise_1, _a) => __awaiter(void 0, [responsePromise_1, _a], void 0, function* (responsePromise, { setProgress, setETA, setResponse }) {
    var _b;
    const response = yield responsePromise;
    setResponse(response);
    const clonedResponse = response.clone();
    const reader = (_b = clonedResponse.body) === null || _b === void 0 ? void 0 : _b.getReader();
    if (!reader)
        return;
    // Get contentLength (in format of number) to calculate progress and ETA
    const contentLength = +(clonedResponse.headers.get("content-length") || 0);
    // Received data length so far
    let receivedLength = 0;
    // Received data chunks so far
    let chunks = [];
    const startTime = performance.now();
    while (true) {
        // Read data chunk
        const { done, value } = yield reader.read();
        const periodTime = performance.now() - startTime;
        // If fetch completed
        if (done) {
            setProgress(100);
            setETA(0);
            break;
        }
        chunks.push(value);
        receivedLength += value.length;
        setProgress((receivedLength * 100) / contentLength);
        setETA((periodTime * (contentLength - receivedLength)) / receivedLength);
    }
});
exports.default = useFetchWithProgress;
