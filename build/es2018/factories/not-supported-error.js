export const createNotSupportedError = () => {
    try {
        return new DOMException('', 'NotSupportedError');
    }
    catch (err) {
        // @todo Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 9;
        err.name = 'NotSupportedError';
        return err;
    }
};
//# sourceMappingURL=/build/es2018/factories/not-supported-error.js.map