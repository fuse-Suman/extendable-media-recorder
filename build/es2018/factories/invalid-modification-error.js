export const createInvalidModificationError = (message = '') => {
    try {
        return new DOMException(message, 'InvalidModificationError');
    }
    catch (err) {
        // @todo Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 13;
        err.message = message;
        err.name = 'InvalidModificationError';
        return err;
    }
};
//# sourceMappingURL=/build/es2018/factories/invalid-modification-error.js.map