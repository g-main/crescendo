import crypto from 'crypto';

function generateId(bytes, inUseIds) {
    const id = crypto.randomBytes(bytes).toString('hex');
    return !inUseIds[id] ? id : generateId(bytes, inUseIds);
}

export { generateId };
