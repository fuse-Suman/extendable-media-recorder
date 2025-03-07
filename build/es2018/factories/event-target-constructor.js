export const createEventTargetConstructor = (createEventTarget, wrapEventListener) => {
    return class EventTarget {
        constructor(nativeEventTarget = null) {
            this._nativeEventTarget = (nativeEventTarget === null) ? createEventTarget() : nativeEventTarget;
            this._listeners = new WeakMap();
        }
        addEventListener(type, listener, options) {
            if (listener !== null) {
                let wrappedEventListener = this._listeners.get(listener);
                if (wrappedEventListener === undefined) {
                    wrappedEventListener = wrapEventListener(this, listener);
                    if (typeof listener === 'function') {
                        this._listeners.set(listener, wrappedEventListener);
                    }
                }
                this._nativeEventTarget.addEventListener(type, wrappedEventListener, options);
            }
        }
        dispatchEvent(event) {
            return this._nativeEventTarget.dispatchEvent(event);
        }
        removeEventListener(type, listener, options) {
            const wrappedEventListener = (listener === null) ? undefined : this._listeners.get(listener);
            this._nativeEventTarget.removeEventListener(type, (wrappedEventListener === undefined) ? null : wrappedEventListener, options);
        }
    };
};
//# sourceMappingURL=/build/es2018/factories/event-target-constructor.js.map