export const createEventTargetFactory = (window) => {
    return () => {
        if (window === null) {
            throw new Error('A native EventTarget could not be created.');
        }
        return window.document.createElement('p');
    };
};
//# sourceMappingURL=/build/es2018/factories/event-target-factory.js.map