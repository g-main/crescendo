export default {
    generateHostId(bytes, cache) {
        const id = crypto.randomBytes(bytes).toString('hex');
        return !cache[id] ? id : generateHostId(bytes, cache);
    }
};
