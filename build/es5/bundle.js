(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/asyncToGenerator'), require('@babel/runtime/regenerator'), require('media-encoder-host'), require('@babel/runtime/helpers/classCallCheck'), require('@babel/runtime/helpers/createClass'), require('@babel/runtime/helpers/assertThisInitialized'), require('@babel/runtime/helpers/possibleConstructorReturn'), require('@babel/runtime/helpers/getPrototypeOf'), require('@babel/runtime/helpers/inherits'), require('@babel/runtime/helpers/slicedToArray'), require('recorder-audio-worklet'), require('standardized-audio-context'), require('@babel/runtime/helpers/toConsumableArray'), require('multi-buffer-data-view')) :
    typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/asyncToGenerator', '@babel/runtime/regenerator', 'media-encoder-host', '@babel/runtime/helpers/classCallCheck', '@babel/runtime/helpers/createClass', '@babel/runtime/helpers/assertThisInitialized', '@babel/runtime/helpers/possibleConstructorReturn', '@babel/runtime/helpers/getPrototypeOf', '@babel/runtime/helpers/inherits', '@babel/runtime/helpers/slicedToArray', 'recorder-audio-worklet', 'standardized-audio-context', '@babel/runtime/helpers/toConsumableArray', 'multi-buffer-data-view'], factory) :
    (global = global || self, factory(global.extendableMediaRecorder = {}, global._asyncToGenerator, global._regeneratorRuntime, global.mediaEncoderHost, global._classCallCheck, global._createClass, global._assertThisInitialized, global._possibleConstructorReturn, global._getPrototypeOf, global._inherits, global._slicedToArray, global.recorderAudioWorklet, global.standardizedAudioContext, global._toConsumableArray, global.multiBufferDataView));
}(this, (function (exports, _asyncToGenerator, _regeneratorRuntime, mediaEncoderHost, _classCallCheck, _createClass, _assertThisInitialized, _possibleConstructorReturn, _getPrototypeOf, _inherits, _slicedToArray, recorderAudioWorklet, standardizedAudioContext, _toConsumableArray, multiBufferDataView) { 'use strict';

    _asyncToGenerator = _asyncToGenerator && Object.prototype.hasOwnProperty.call(_asyncToGenerator, 'default') ? _asyncToGenerator['default'] : _asyncToGenerator;
    _regeneratorRuntime = _regeneratorRuntime && Object.prototype.hasOwnProperty.call(_regeneratorRuntime, 'default') ? _regeneratorRuntime['default'] : _regeneratorRuntime;
    _classCallCheck = _classCallCheck && Object.prototype.hasOwnProperty.call(_classCallCheck, 'default') ? _classCallCheck['default'] : _classCallCheck;
    _createClass = _createClass && Object.prototype.hasOwnProperty.call(_createClass, 'default') ? _createClass['default'] : _createClass;
    _assertThisInitialized = _assertThisInitialized && Object.prototype.hasOwnProperty.call(_assertThisInitialized, 'default') ? _assertThisInitialized['default'] : _assertThisInitialized;
    _possibleConstructorReturn = _possibleConstructorReturn && Object.prototype.hasOwnProperty.call(_possibleConstructorReturn, 'default') ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
    _getPrototypeOf = _getPrototypeOf && Object.prototype.hasOwnProperty.call(_getPrototypeOf, 'default') ? _getPrototypeOf['default'] : _getPrototypeOf;
    _inherits = _inherits && Object.prototype.hasOwnProperty.call(_inherits, 'default') ? _inherits['default'] : _inherits;
    _slicedToArray = _slicedToArray && Object.prototype.hasOwnProperty.call(_slicedToArray, 'default') ? _slicedToArray['default'] : _slicedToArray;
    _toConsumableArray = _toConsumableArray && Object.prototype.hasOwnProperty.call(_toConsumableArray, 'default') ? _toConsumableArray['default'] : _toConsumableArray;

    var createDecodeWebMChunk = function createDecodeWebMChunk(readElementContent, readElementType) {
      return function (dataView, elementType, channelCount) {
        var contents = [];
        var currentElementType = elementType;
        var offset = 0;
        while (offset < dataView.byteLength) {
          if (currentElementType === null) {
            var lengthAndType = readElementType(dataView, offset);
            if (lengthAndType === null) {
              break;
            }
            var length = lengthAndType.length,
              type = lengthAndType.type;
            currentElementType = type;
            offset += length;
          } else {
            var contentAndLength = readElementContent(dataView, offset, currentElementType, channelCount);
            if (contentAndLength === null) {
              break;
            }
            var content = contentAndLength.content,
              _length = contentAndLength.length;
            currentElementType = null;
            offset += _length;
            if (content !== null) {
              contents.push(content);
            }
          }
        }
        return {
          contents: contents,
          currentElementType: currentElementType,
          offset: offset
        };
      };
    };

    var createEventTargetConstructor = function createEventTargetConstructor(createEventTarget, wrapEventListener) {
      return /*#__PURE__*/function () {
        function EventTarget() {
          var nativeEventTarget = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          _classCallCheck(this, EventTarget);
          this._nativeEventTarget = nativeEventTarget === null ? createEventTarget() : nativeEventTarget;
          this._listeners = new WeakMap();
        }
        return _createClass(EventTarget, [{
          key: "addEventListener",
          value: function addEventListener(type, listener, options) {
            if (listener !== null) {
              var wrappedEventListener = this._listeners.get(listener);
              if (wrappedEventListener === undefined) {
                wrappedEventListener = wrapEventListener(this, listener);
                if (typeof listener === 'function') {
                  this._listeners.set(listener, wrappedEventListener);
                }
              }
              this._nativeEventTarget.addEventListener(type, wrappedEventListener, options);
            }
          }
        }, {
          key: "dispatchEvent",
          value: function dispatchEvent(event) {
            return this._nativeEventTarget.dispatchEvent(event);
          }
        }, {
          key: "removeEventListener",
          value: function removeEventListener(type, listener, options) {
            var wrappedEventListener = listener === null ? undefined : this._listeners.get(listener);
            this._nativeEventTarget.removeEventListener(type, wrappedEventListener === undefined ? null : wrappedEventListener, options);
          }
        }]);
      }();
    };

    var createEventTargetFactory = function createEventTargetFactory(window) {
      return function () {
        if (window === null) {
          throw new Error('A native EventTarget could not be created.');
        }
        return window.document.createElement('p');
      };
    };

    var createInvalidModificationError = function createInvalidModificationError() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      try {
        return new DOMException(message, 'InvalidModificationError');
      } catch (err) {
        // @todo Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 13;
        err.message = message;
        err.name = 'InvalidModificationError';
        return err;
      }
    };

    var createInvalidStateError = function createInvalidStateError() {
      try {
        return new DOMException('', 'InvalidStateError');
      } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 11;
        err.name = 'InvalidStateError';
        return err;
      }
    };

    var createIsSupportedPromise = function createIsSupportedPromise(window) {
      if (window !== null && window.hasOwnProperty('MediaStream')) {
        /*
         * Bug #5: Up until v70 Firefox did emit a blob of type video/webm when asked to encode a MediaStream with a video track into an
         * audio codec.
         */
        return new Promise(function (resolve) {
          var canvasElement = document.createElement('canvas');
          // @todo https://bugzilla.mozilla.org/show_bug.cgi?id=1388974
          canvasElement.getContext('2d');
          var mediaStream = canvasElement.captureStream();
          var mimeType = 'audio/webm';
          var mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: mimeType
          });
          mediaRecorder.addEventListener('dataavailable', function (_ref) {
            var data = _ref.data;
            return resolve(data.type === mimeType);
          });
          try {
            mediaRecorder.start();
            setTimeout(function () {
              return mediaRecorder.stop();
            }, 10);
          } catch (err) {
            resolve(err.name === 'NotSupportedError');
          }
        });
      }
      return Promise.resolve(false);
    };

    function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
    function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
    var createMediaRecorderConstructor = function createMediaRecorderConstructor(createNativeMediaRecorder, createNotSupportedError, createWebAudioMediaRecorder, createWebmPcmMediaRecorder, encoderRegexes, eventTargetConstructor, nativeMediaRecorderConstructor) {
      return /*#__PURE__*/function (_eventTargetConstruct) {
        function MediaRecorder(stream) {
          var _this;
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          _classCallCheck(this, MediaRecorder);
          var mimeType = options.mimeType;
          if (nativeMediaRecorderConstructor !== null && (mimeType === undefined || nativeMediaRecorderConstructor.isTypeSupported(mimeType))) {
            var internalMediaRecorder = createNativeMediaRecorder(nativeMediaRecorderConstructor, stream, options);
            _this = _callSuper(this, MediaRecorder, [internalMediaRecorder]);
            _this._internalMediaRecorder = internalMediaRecorder;
          } else if (mimeType !== undefined && encoderRegexes.some(function (regex) {
            return regex.test(mimeType);
          })) {
            _this = _callSuper(this, MediaRecorder);
            if (nativeMediaRecorderConstructor !== null && nativeMediaRecorderConstructor.isTypeSupported('audio/webm;codecs=pcm')) {
              _this._internalMediaRecorder = createWebmPcmMediaRecorder(_assertThisInitialized(_this), nativeMediaRecorderConstructor, stream, mimeType);
            } else {
              _this._internalMediaRecorder = createWebAudioMediaRecorder(_assertThisInitialized(_this), stream, mimeType);
            }
          } else {
            // This is creating a native MediaRecorder just to provoke it to throw an error.
            if (nativeMediaRecorderConstructor !== null) {
              createNativeMediaRecorder(nativeMediaRecorderConstructor, stream, options);
            }
            throw createNotSupportedError();
          }
          _this._ondataavailable = null;
          _this._onerror = null;
          return _assertThisInitialized(_this);
        }
        _inherits(MediaRecorder, _eventTargetConstruct);
        return _createClass(MediaRecorder, [{
          key: "ondataavailable",
          get: function get() {
            return this._ondataavailable === null ? this._ondataavailable : this._ondataavailable[0];
          },
          set: function set(value) {
            if (this._ondataavailable !== null) {
              this.removeEventListener('dataavailable', this._ondataavailable[1]);
            }
            if (typeof value === 'function') {
              var boundListener = value.bind(this);
              this.addEventListener('dataavailable', boundListener);
              this._ondataavailable = [value, boundListener];
            } else {
              this._ondataavailable = null;
            }
          }
        }, {
          key: "onerror",
          get: function get() {
            return this._onerror === null ? this._onerror : this._onerror[0];
          },
          set: function set(value) {
            if (this._onerror !== null) {
              this.removeEventListener('error', this._onerror[1]);
            }
            if (typeof value === 'function') {
              var boundListener = value.bind(this);
              this.addEventListener('error', boundListener);
              this._onerror = [value, boundListener];
            } else {
              this._onerror = null;
            }
          }
        }, {
          key: "state",
          get: function get() {
            return this._internalMediaRecorder.state;
          }
        }, {
          key: "start",
          value: function start(timeslice) {
            return this._internalMediaRecorder.start(timeslice);
          }
        }, {
          key: "stop",
          value: function stop() {
            return this._internalMediaRecorder.stop();
          }
        }], [{
          key: "isTypeSupported",
          value: function isTypeSupported(mimeType) {
            return nativeMediaRecorderConstructor !== null && nativeMediaRecorderConstructor.isTypeSupported(mimeType) || encoderRegexes.some(function (regex) {
              return !regex.test(mimeType);
            });
          }
        }]);
      }(eventTargetConstructor);
    };

    var createNativeMediaRecorderFactory = function createNativeMediaRecorderFactory(createInvalidModificationError, createNotSupportedError) {
      return function (nativeMediaRecorderConstructor, stream, mediaRecorderOptions) {
        var dataAvailableListeners = new WeakMap();
        var errorListeners = new WeakMap();
        var nativeMediaRecorder = new nativeMediaRecorderConstructor(stream, mediaRecorderOptions);
        nativeMediaRecorder.addEventListener = function (addEventListener) {
          return function (type, listener, options) {
            var patchedEventListener = listener;
            if (typeof listener === 'function') {
              if (type === 'dataavailable') {
                // Bug #7 & 8: Chrome fires a dataavailable event before it fires an error event.
                patchedEventListener = function patchedEventListener(event) {
                  return setTimeout(function () {
                    return listener.call(nativeMediaRecorder, event);
                  });
                };
                dataAvailableListeners.set(listener, patchedEventListener);
              } else if (type === 'error') {
                patchedEventListener = function patchedEventListener(event) {
                  // Bug #3 & 4: Chrome throws an error event without any error.
                  if (event.error === undefined) {
                    listener.call(nativeMediaRecorder, new ErrorEvent('error', {
                      error: createInvalidModificationError()
                    }));
                    // Bug #1 & 2: Firefox throws an error event with an UnknownError.
                  } else if (event.error.name === 'UnknownError') {
                    var message = event.error.message;
                    listener.call(nativeMediaRecorder, new ErrorEvent('error', {
                      error: createInvalidModificationError(message)
                    }));
                  } else {
                    listener.call(nativeMediaRecorder, event);
                  }
                };
                dataAvailableListeners.set(listener, patchedEventListener);
              }
            }
            return addEventListener.call(nativeMediaRecorder, type, patchedEventListener, options);
          };
        }(nativeMediaRecorder.addEventListener);
        nativeMediaRecorder.removeEventListener = function (removeEventListener) {
          return function (type, listener, options) {
            var patchedEventListener = listener;
            if (typeof listener === 'function') {
              if (type === 'dataavailable') {
                var dataAvailableListener = dataAvailableListeners.get(listener);
                if (dataAvailableListener !== undefined) {
                  patchedEventListener = dataAvailableListener;
                }
              } else if (type === 'error') {
                var errorListener = errorListeners.get(listener);
                if (errorListener !== undefined) {
                  patchedEventListener = errorListener;
                }
              }
            }
            return removeEventListener.call(nativeMediaRecorder, type, patchedEventListener, options);
          };
        }(nativeMediaRecorder.removeEventListener);
        nativeMediaRecorder.start = function (start) {
          return function (timeslice) {
            /*
             * Bug #6: Chrome will emit a blob without any data when asked to encode a MediaStream with a video track into an audio
             * codec.
             */
            if (mediaRecorderOptions.mimeType !== undefined && mediaRecorderOptions.mimeType.startsWith('audio/') && stream.getVideoTracks().length > 0) {
              throw createNotSupportedError();
            }
            return timeslice === undefined ? start.call(nativeMediaRecorder) : start.call(nativeMediaRecorder, timeslice);
          };
        }(nativeMediaRecorder.start);
        return nativeMediaRecorder;
      };
    };

    var createNativeMediaRecorderConstructor = function createNativeMediaRecorderConstructor(window) {
      if (window === null) {
        return null;
      }
      return window.hasOwnProperty('MediaRecorder') ? window.MediaRecorder : null;
    };

    var createNotSupportedError = function createNotSupportedError() {
      try {
        return new DOMException('', 'NotSupportedError');
      } catch (err) {
        // @todo Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 9;
        err.name = 'NotSupportedError';
        return err;
      }
    };

    var createReadElementContent = function createReadElementContent(readVariableSizeInteger) {
      return function (dataView, offset, type) {
        var channelCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
        var lengthAndValue = readVariableSizeInteger(dataView, offset);
        if (lengthAndValue === null) {
          return lengthAndValue;
        }
        var length = lengthAndValue.length,
          value = lengthAndValue.value;
        if (type === 'master') {
          return {
            content: null,
            length: length
          };
        }
        if (offset + length + value > dataView.byteOffset + dataView.byteLength) {
          return null;
        }
        if (type === 'binary') {
          var numberOfSamples = (value / Float32Array.BYTES_PER_ELEMENT - 1) / channelCount;
          var content = Array.from({
            length: channelCount
          }, function () {
            return new Float32Array(numberOfSamples);
          });
          for (var i = 0; i < numberOfSamples; i += 1) {
            var elementOffset = i * channelCount + 1;
            for (var j = 0; j < channelCount; j += 1) {
              content[j][i] = dataView.getFloat32(offset + length + (elementOffset + j) * Float32Array.BYTES_PER_ELEMENT, true);
            }
          }
          return {
            content: content,
            length: length + value
          };
        }
        return {
          content: null,
          length: length + value
        };
      };
    };

    var createReadElementType = function createReadElementType(readVariableSizeInteger) {
      return function (dataView, offset) {
        var lengthAndValue = readVariableSizeInteger(dataView, offset);
        if (lengthAndValue === null) {
          return lengthAndValue;
        }
        var length = lengthAndValue.length,
          value = lengthAndValue.value;
        if (value === 35) {
          return {
            length: length,
            type: 'binary'
          };
        }
        if (value === 46 || value === 97 || value === 88713574 || value === 106212971 || value === 139690087 || value === 172351395 || value === 256095861) {
          return {
            length: length,
            type: 'master'
          };
        }
        return {
          length: length,
          type: 'unknown'
        };
      };
    };

    var createReadVariableSizeInteger = function createReadVariableSizeInteger(readVariableSizeIntegerLength) {
      return function (dataView, offset) {
        var length = readVariableSizeIntegerLength(dataView, offset);
        if (length === null) {
          return length;
        }
        var firstDataByteOffset = offset + Math.floor((length - 1) / 8);
        if (firstDataByteOffset + length > dataView.byteOffset + dataView.byteLength) {
          return null;
        }
        var firstDataByte = dataView.getUint8(firstDataByteOffset);
        var value = firstDataByte & (1 << 8 - length % 8) - 1; // tslint:disable-line:no-bitwise
        for (var i = 1; i < length; i += 1) {
          value = (value << 8) + dataView.getUint8(firstDataByteOffset + i); // tslint:disable-line:no-bitwise
        }
        return {
          length: length,
          value: value
        };
      };
    };

    // @todo This should live in a separate file.
    var createPromisedAudioNodesEncoderIdAndPort = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(audioContext, mediaStream, mimeType) {
        var _yield$instantiate, encoderId, port, message, mediaStreamAudioSourceNode, length, audioBuffer, audioBufferSourceNode, recorderAudioWorkletNode;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return mediaEncoderHost.instantiate(mimeType, audioContext.sampleRate);
            case 2:
              _yield$instantiate = _context.sent;
              encoderId = _yield$instantiate.encoderId;
              port = _yield$instantiate.port;
              message = 'Missing AudioWorklet support. Maybe this is not running in a secure context.';
              _context.next = 8;
              return recorderAudioWorklet.addRecorderAudioWorkletModule(function (url) {
                if (standardizedAudioContext.addAudioWorkletModule === undefined) {
                  throw new Error(message);
                }
                return standardizedAudioContext.addAudioWorkletModule(audioContext, url);
              });
            case 8:
              if (!(standardizedAudioContext.AudioWorkletNode === undefined)) {
                _context.next = 10;
                break;
              }
              throw new Error(message);
            case 10:
              mediaStreamAudioSourceNode = new standardizedAudioContext.MediaStreamAudioSourceNode(audioContext, {
                mediaStream: mediaStream
              });
              length = Math.max(512, Math.ceil(audioContext.baseLatency * audioContext.sampleRate));
              audioBuffer = new standardizedAudioContext.AudioBuffer({
                length: length,
                sampleRate: audioContext.sampleRate
              });
              audioBufferSourceNode = new standardizedAudioContext.AudioBufferSourceNode(audioContext, {
                buffer: audioBuffer
              });
              recorderAudioWorkletNode = recorderAudioWorklet.createRecorderAudioWorkletNode(standardizedAudioContext.AudioWorkletNode, audioContext);
              return _context.abrupt("return", {
                audioBufferSourceNode: audioBufferSourceNode,
                encoderId: encoderId,
                length: length,
                port: port,
                mediaStreamAudioSourceNode: mediaStreamAudioSourceNode,
                recorderAudioWorkletNode: recorderAudioWorkletNode
              });
            case 16:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function createPromisedAudioNodesEncoderIdAndPort(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }();
    var createWebAudioMediaRecorderFactory = function createWebAudioMediaRecorderFactory(createInvalidModificationError, createInvalidStateError, createNotSupportedError) {
      return function (eventTarget, mediaStream, mimeType) {
        var audioContext = new standardizedAudioContext.MinimalAudioContext({
          latencyHint: 'playback'
        });
        var promisedAudioNodesEncoderIdAndPort = createPromisedAudioNodesEncoderIdAndPort(audioContext, mediaStream, mimeType);
        var abortRecording = null;
        var intervalId = null;
        var promisedAudioNodesAndEncoderId = null;
        var promisedPartialRecording = null; // tslint:disable-line:invalid-void
        var dispatchDataAvailableEvent = function dispatchDataAvailableEvent(arrayBuffers) {
          eventTarget.dispatchEvent(new BlobEvent('dataavailable', {
            data: new Blob(arrayBuffers, {
              type: mimeType
            })
          }));
        };
        var _requestNextPartialRecording = /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(encoderId, timeslice) {
            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.t0 = dispatchDataAvailableEvent;
                  _context2.next = 3;
                  return mediaEncoderHost.encode(encoderId, timeslice);
                case 3:
                  _context2.t1 = _context2.sent;
                  (0, _context2.t0)(_context2.t1);
                  if (promisedAudioNodesAndEncoderId !== null) {
                    promisedPartialRecording = _requestNextPartialRecording(encoderId, timeslice);
                  }
                case 6:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          }));
          return function requestNextPartialRecording(_x4, _x5) {
            return _ref2.apply(this, arguments);
          };
        }();
        var stop = function stop() {
          if (promisedAudioNodesAndEncoderId === null) {
            return;
          }
          if (abortRecording !== null) {
            mediaStream.removeEventListener('addtrack', abortRecording);
            mediaStream.removeEventListener('removetrack', abortRecording);
          }
          if (intervalId !== null) {
            clearTimeout(intervalId);
          }
          if (promisedPartialRecording !== null) {
            promisedPartialRecording["catch"](function () {});
          }
          promisedAudioNodesAndEncoderId.then(/*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(_ref3) {
              var encoderId, mediaStreamAudioSourceNode, recorderAudioWorkletNode;
              return _regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    encoderId = _ref3.encoderId, mediaStreamAudioSourceNode = _ref3.mediaStreamAudioSourceNode, recorderAudioWorkletNode = _ref3.recorderAudioWorkletNode;
                    _context3.next = 3;
                    return recorderAudioWorkletNode.stop();
                  case 3:
                    mediaStreamAudioSourceNode.disconnect(recorderAudioWorkletNode);
                    _context3.t0 = dispatchDataAvailableEvent;
                    _context3.next = 7;
                    return mediaEncoderHost.encode(encoderId, null);
                  case 7:
                    _context3.t1 = _context3.sent;
                    (0, _context3.t0)(_context3.t1);
                  case 9:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function (_x6) {
              return _ref4.apply(this, arguments);
            };
          }());
          promisedAudioNodesAndEncoderId = null;
        };
        return {
          get state() {
            return promisedAudioNodesAndEncoderId === null ? 'inactive' : 'recording';
          },
          start: function start(timeslice) {
            if (promisedAudioNodesAndEncoderId !== null) {
              throw createInvalidStateError();
            }
            if (mediaStream.getVideoTracks().length > 0) {
              throw createNotSupportedError();
            }
            promisedAudioNodesAndEncoderId = Promise.all([audioContext.resume(), promisedAudioNodesEncoderIdAndPort]).then(/*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4(_ref5) {
                var _ref7, _ref7$, audioBufferSourceNode, encoderId, length, port, mediaStreamAudioSourceNode, recorderAudioWorkletNode;
                return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      _ref7 = _slicedToArray(_ref5, 2), _ref7$ = _ref7[1], audioBufferSourceNode = _ref7$.audioBufferSourceNode, encoderId = _ref7$.encoderId, length = _ref7$.length, port = _ref7$.port, mediaStreamAudioSourceNode = _ref7$.mediaStreamAudioSourceNode, recorderAudioWorkletNode = _ref7$.recorderAudioWorkletNode;
                      mediaStreamAudioSourceNode.connect(recorderAudioWorkletNode);
                      _context4.next = 4;
                      return new Promise(function (resolve) {
                        audioBufferSourceNode.onended = resolve;
                        audioBufferSourceNode.connect(recorderAudioWorkletNode);
                        audioBufferSourceNode.start(audioContext.currentTime + length / audioContext.sampleRate);
                      });
                    case 4:
                      audioBufferSourceNode.disconnect(recorderAudioWorkletNode);
                      _context4.next = 7;
                      return recorderAudioWorkletNode.record(port);
                    case 7:
                      if (timeslice !== undefined) {
                        promisedPartialRecording = _requestNextPartialRecording(encoderId, timeslice);
                      }
                      return _context4.abrupt("return", {
                        encoderId: encoderId,
                        mediaStreamAudioSourceNode: mediaStreamAudioSourceNode,
                        recorderAudioWorkletNode: recorderAudioWorkletNode
                      });
                    case 9:
                    case "end":
                      return _context4.stop();
                  }
                }, _callee4);
              }));
              return function (_x7) {
                return _ref6.apply(this, arguments);
              };
            }());
            var tracks = mediaStream.getTracks();
            abortRecording = function abortRecording() {
              stop();
              eventTarget.dispatchEvent(new ErrorEvent('error', {
                error: createInvalidModificationError()
              }));
            };
            mediaStream.addEventListener('addtrack', abortRecording);
            mediaStream.addEventListener('removetrack', abortRecording);
            intervalId = setInterval(function () {
              var currentTracks = mediaStream.getTracks();
              if ((currentTracks.length !== tracks.length || currentTracks.some(function (track, index) {
                return track !== tracks[index];
              })) && abortRecording !== null) {
                abortRecording();
              }
            }, 1000);
          },
          stop: stop
        };
      };
    };

    var createWebmPcmMediaRecorderFactory = function createWebmPcmMediaRecorderFactory(createInvalidModificationError, createNotSupportedError, decodeWebMChunk) {
      return function (eventTarget, nativeMediaRecorderConstructor, mediaStream, mimeType) {
        var nativeMediaRecorder = new nativeMediaRecorderConstructor(mediaStream, {
          mimeType: 'audio/webm;codecs=pcm'
        });
        var audioTracks = mediaStream.getAudioTracks();
        var channelCount = audioTracks.length === 0 ? undefined : audioTracks[0].getSettings().channelCount;
        var sampleRate = audioTracks.length === 0 ? undefined : audioTracks[0].getSettings().sampleRate;
        var promisedDataViewElementTypeEncoderIdAndPort = sampleRate !== undefined ? mediaEncoderHost.instantiate(mimeType, sampleRate) : null;
        var promisedPartialRecording = null; // tslint:disable-line:invalid-void
        var dispatchDataAvailableEvent = function dispatchDataAvailableEvent(arrayBuffers) {
          eventTarget.dispatchEvent(new BlobEvent('dataavailable', {
            data: new Blob(arrayBuffers, {
              type: mimeType
            })
          }));
        };
        var _requestNextPartialRecording = /*#__PURE__*/function () {
          var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(encoderId, timeslice) {
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.t0 = dispatchDataAvailableEvent;
                  _context.next = 3;
                  return mediaEncoderHost.encode(encoderId, timeslice);
                case 3:
                  _context.t1 = _context.sent;
                  (0, _context.t0)(_context.t1);
                  if (nativeMediaRecorder.state !== 'inactive') {
                    promisedPartialRecording = _requestNextPartialRecording(encoderId, timeslice);
                  }
                case 6:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));
          return function requestNextPartialRecording(_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }();
        var stop = function stop() {
          if (nativeMediaRecorder.state === 'inactive') {
            return;
          }
          if (promisedPartialRecording !== null) {
            promisedPartialRecording["catch"](function () {});
          }
          nativeMediaRecorder.stop();
        };
        nativeMediaRecorder.addEventListener('error', function () {
          stop();
          // Bug #3 & 4: Chrome throws an error event without any error.
          eventTarget.dispatchEvent(new ErrorEvent('error', {
            error: createInvalidModificationError()
          }));
        });
        return {
          get state() {
            return nativeMediaRecorder.state;
          },
          start: function start(timeslice) {
            /*
             * Bug #6: Chrome will emit a blob without any data when asked to encode a MediaStream with a video track into an audio
             * codec.
             */
            if (mediaStream.getVideoTracks().length > 0) {
              throw createNotSupportedError();
            }
            if (nativeMediaRecorder.state === 'inactive') {
              nativeMediaRecorder.addEventListener('dataavailable', function (_ref2) {
                var data = _ref2.data;
                if (promisedDataViewElementTypeEncoderIdAndPort !== null) {
                  promisedDataViewElementTypeEncoderIdAndPort = promisedDataViewElementTypeEncoderIdAndPort.then(/*#__PURE__*/function () {
                    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(_ref3) {
                      var _ref3$dataView, dataView, _ref3$elementType, elementType, encoderId, port, multiOrSingleBufferDataView, _decodeWebMChunk, currentElementType, offset, contents, remainingDataView;
                      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) switch (_context2.prev = _context2.next) {
                          case 0:
                            _ref3$dataView = _ref3.dataView, dataView = _ref3$dataView === void 0 ? null : _ref3$dataView, _ref3$elementType = _ref3.elementType, elementType = _ref3$elementType === void 0 ? null : _ref3$elementType, encoderId = _ref3.encoderId, port = _ref3.port;
                            if (!(dataView === null)) {
                              _context2.next = 9;
                              break;
                            }
                            _context2.t1 = DataView;
                            _context2.next = 5;
                            return data.arrayBuffer();
                          case 5:
                            _context2.t2 = _context2.sent;
                            _context2.t0 = new _context2.t1(_context2.t2);
                            _context2.next = 19;
                            break;
                          case 9:
                            _context2.t3 = multiBufferDataView.MultiBufferDataView;
                            _context2.t4 = [];
                            _context2.t5 = _toConsumableArray(dataView.buffers);
                            _context2.next = 14;
                            return data.arrayBuffer();
                          case 14:
                            _context2.t6 = _context2.sent;
                            _context2.t7 = [_context2.t6];
                            _context2.t8 = _context2.t4.concat.call(_context2.t4, _context2.t5, _context2.t7);
                            _context2.t9 = dataView.byteOffset;
                            _context2.t0 = new _context2.t3(_context2.t8, _context2.t9);
                          case 19:
                            multiOrSingleBufferDataView = _context2.t0;
                            _decodeWebMChunk = decodeWebMChunk(multiOrSingleBufferDataView, elementType, channelCount), currentElementType = _decodeWebMChunk.currentElementType, offset = _decodeWebMChunk.offset, contents = _decodeWebMChunk.contents;
                            remainingDataView = offset < multiOrSingleBufferDataView.byteLength ? 'buffer' in multiOrSingleBufferDataView ? new multiBufferDataView.MultiBufferDataView([multiOrSingleBufferDataView.buffer], multiOrSingleBufferDataView.byteOffset + offset) : new multiBufferDataView.MultiBufferDataView(multiOrSingleBufferDataView.buffers, multiOrSingleBufferDataView.byteOffset + offset) : null;
                            contents.forEach(function (content) {
                              return port.postMessage(content, content.map(function (_ref5) {
                                var buffer = _ref5.buffer;
                                return buffer;
                              }));
                            });
                            if (nativeMediaRecorder.state === 'inactive') {
                              mediaEncoderHost.encode(encoderId, null).then(dispatchDataAvailableEvent);
                              port.postMessage([]);
                              port.close();
                            }
                            return _context2.abrupt("return", {
                              dataView: remainingDataView,
                              elementType: currentElementType,
                              encoderId: encoderId,
                              port: port
                            });
                          case 25:
                          case "end":
                            return _context2.stop();
                        }
                      }, _callee2);
                    }));
                    return function (_x3) {
                      return _ref4.apply(this, arguments);
                    };
                  }());
                }
              });
              if (promisedDataViewElementTypeEncoderIdAndPort !== null && timeslice !== undefined) {
                promisedDataViewElementTypeEncoderIdAndPort.then(function (_ref6) {
                  var encoderId = _ref6.encoderId;
                  return promisedPartialRecording = _requestNextPartialRecording(encoderId, timeslice);
                });
              }
            }
            nativeMediaRecorder.start(100);
          },
          stop: stop
        };
      };
    };

    var createWindow = function createWindow() {
      return typeof window === 'undefined' ? null : window;
    };

    var _readVariableSizeIntegerLength = function readVariableSizeIntegerLength(dataView, offset) {
      if (offset > dataView.byteOffset + dataView.byteLength) {
        return null;
      }
      var _byte = dataView.getUint8(offset);
      if (_byte > 127) {
        return 1;
      }
      if (_byte > 63) {
        return 2;
      }
      if (_byte > 31) {
        return 3;
      }
      if (_byte > 15) {
        return 4;
      }
      if (_byte > 7) {
        return 5;
      }
      if (_byte > 3) {
        return 6;
      }
      if (_byte > 1) {
        return 7;
      }
      if (_byte > 0) {
        return 8;
      }
      var length = _readVariableSizeIntegerLength(dataView, offset + 1);
      return length === null ? null : length + 8;
    };

    var wrapEventListener = function wrapEventListener(target, eventListener) {
      return function (event) {
        var descriptor = {
          value: target
        };
        Object.defineProperties(event, {
          currentTarget: descriptor,
          target: descriptor
        });
        if (typeof eventListener === 'function') {
          return eventListener.call(target, event);
        }
        return eventListener.handleEvent.call(target, event);
      };
    };

    var encoderRegexes = [];
    var createNativeMediaRecorder = createNativeMediaRecorderFactory(createInvalidModificationError, createNotSupportedError);
    var createWebAudioMediaRecorder = createWebAudioMediaRecorderFactory(createInvalidModificationError, createInvalidStateError, createNotSupportedError);
    var readVariableSizeInteger = createReadVariableSizeInteger(_readVariableSizeIntegerLength);
    var readElementContent = createReadElementContent(readVariableSizeInteger);
    var readElementType = createReadElementType(readVariableSizeInteger);
    var decodeWebMChunk = createDecodeWebMChunk(readElementContent, readElementType);
    var createWebmPcmMediaRecorder = createWebmPcmMediaRecorderFactory(createInvalidModificationError, createNotSupportedError, decodeWebMChunk);
    var window$1 = createWindow();
    var createEventTarget = createEventTargetFactory(window$1);
    var nativeMediaRecorderConstructor = createNativeMediaRecorderConstructor(window$1);
    var mediaRecorderConstructor = createMediaRecorderConstructor(createNativeMediaRecorder, createNotSupportedError, createWebAudioMediaRecorder, createWebmPcmMediaRecorder, encoderRegexes, createEventTargetConstructor(createEventTarget, wrapEventListener), nativeMediaRecorderConstructor);
    var isSupported = function isSupported() {
      return createIsSupportedPromise(window$1);
    };
    var ports = new WeakMap();
    var deregister = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee(port) {
        var encoderRegex, index;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return mediaEncoderHost.deregister(port);
            case 2:
              encoderRegex = ports.get(port);
              if (encoderRegex !== undefined) {
                index = encoderRegexes.indexOf(encoderRegex);
                encoderRegexes.splice(index, 1);
              }
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function deregister(_x) {
        return _ref.apply(this, arguments);
      };
    }();
    var register = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(port) {
        var encoderRegex;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return mediaEncoderHost.register(port);
            case 2:
              encoderRegex = _context2.sent;
              encoderRegexes.push(encoderRegex);
              ports.set(port, encoderRegex);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function register(_x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    exports.MediaRecorder = mediaRecorderConstructor;
    exports.deregister = deregister;
    exports.isSupported = isSupported;
    exports.register = register;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
