import crypto from 'crypto';

export default function generateId(bytes, inUseIds) {
    const id = crypto.randomBytes(bytes).toString('hex');
    return !inUseIds[id] ? id : generateId(bytes, inUseIds);
}
