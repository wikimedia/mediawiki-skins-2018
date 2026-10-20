/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function() {

window.up = {
    version: '2.7.2'
};


/***/ }),
/* 2 */
/***/ (function() {

up.mockable = function (originalFn) {
    var spy;
    var mockableFn = function () {
        return (spy || originalFn).apply(null, arguments);
    };
    mockableFn.mock = function () { return spy = jasmine.createSpy('mockable', originalFn); };
    document.addEventListener('up:framework:reset', function () { return spy = null; });
    return mockableFn;
};


/***/ }),
/* 3 */
/***/ (function() {

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
up.util = (function () {
    function noop() {
    }
    function asyncNoop() {
        return Promise.resolve();
    }
    function memoize(func) {
        var cachedValue, cached;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (cached) {
                return cachedValue;
            }
            else {
                cached = true;
                return cachedValue = func.apply(this, args);
            }
        };
    }
    function isStandardPort(protocol, port) {
        port = port.toString();
        return (((port === "") || (port === "80")) && (protocol === 'http:')) || ((port === "443") && (protocol === 'https:'));
    }
    var NORMALIZE_URL_DEFAULTS = {
        host: 'cross-domain',
    };
    function normalizeURL(urlOrAnchor, options) {
        options = newOptions(options, NORMALIZE_URL_DEFAULTS);
        var parts = parseURL(urlOrAnchor);
        var normalized = '';
        if (options.host === 'cross-domain') {
            options.host = isCrossOrigin(parts);
        }
        if (options.host) {
            normalized += parts.protocol + "//" + parts.hostname;
            if (!isStandardPort(parts.protocol, parts.port)) {
                normalized += ":".concat(parts.port);
            }
        }
        var pathname = parts.pathname;
        if (options.trailingSlash === false && pathname !== '/') {
            pathname = pathname.replace(/\/$/, '');
        }
        normalized += pathname;
        if (options.search !== false) {
            normalized += parts.search;
        }
        if (options.hash !== false) {
            normalized += parts.hash;
        }
        return normalized;
    }
    function matchURLs(leftURL, rightURL) {
        return normalizeURL(leftURL) === normalizeURL(rightURL);
    }
    var APP_PROTOCOL = location.protocol;
    var APP_HOSTNAME = location.hostname;
    function isCrossOrigin(urlOrAnchor) {
        if (isString(urlOrAnchor) && (urlOrAnchor.indexOf('//') === -1)) {
            return false;
        }
        var parts = parseURL(urlOrAnchor);
        return (APP_HOSTNAME !== parts.hostname) || (APP_PROTOCOL !== parts.protocol);
    }
    function parseURL(urlOrLink) {
        var link;
        if (isJQuery(urlOrLink)) {
            link = up.element.get(urlOrLink);
        }
        else if (urlOrLink.pathname) {
            link = urlOrLink;
        }
        else {
            link = document.createElement('a');
            link.href = urlOrLink;
        }
        if (!link.hostname) {
            link.href = link.href;
        }
        if (link.pathname[0] !== '/') {
            link = pick(link, ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash']);
            link.pathname = '/' + link.pathname;
        }
        return link;
    }
    function normalizeMethod(method) {
        return method ? method.toUpperCase() : 'GET';
    }
    function methodAllowsPayload(method) {
        return (method !== 'GET') && (method !== 'HEAD');
    }
    function assignPolyfill(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
            var source = sources_1[_a];
            for (var key in source) {
                target[key] = source[key];
            }
        }
        return target;
    }
    var assign = Object.assign || assignPolyfill;
    function valuesPolyfill(object) {
        return Object.keys(object).map(function (key) { return object[key]; });
    }
    var objectValues = Object.values || valuesPolyfill;
    function iteratee(block) {
        if (isString(block)) {
            return function (item) { return item[block]; };
        }
        else {
            return block;
        }
    }
    function map(array, block) {
        if (array.length === 0) {
            return [];
        }
        block = iteratee(block);
        var mapped = [];
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            mapped.push(block(element, i));
        }
        return mapped;
    }
    function mapObject(array, pairer) {
        var merger = function (object, pair) {
            object[pair[0]] = pair[1];
            return object;
        };
        return map(array, pairer).reduce(merger, {});
    }
    function each(array, block) {
        for (var i = 0; i < array.length; i++) {
            block(array[i], i);
        }
    }
    function eachIterator(iterator, callback) {
        var entry;
        while ((entry = iterator.next()) && !entry.done) {
            callback(entry.value);
        }
    }
    function isNull(object) {
        return object === null;
    }
    function isUndefined(object) {
        return object === undefined;
    }
    var isDefined = negate(isUndefined);
    function isMissing(object) {
        return isUndefined(object) || isNull(object);
    }
    var isGiven = negate(isMissing);
    function isBlank(value) {
        if (isMissing(value)) {
            return true;
        }
        if (isObject(value) && value[isBlank.key]) {
            return value[isBlank.key]();
        }
        if (isString(value) || isList(value)) {
            return value.length === 0;
        }
        if (isOptions(value)) {
            return Object.keys(value).length === 0;
        }
        return false;
    }
    isBlank.key = 'up.util.isBlank';
    function presence(value, tester) {
        if (tester === void 0) { tester = isPresent; }
        if (tester(value)) {
            return value;
        }
    }
    var isPresent = negate(isBlank);
    function isFunction(object) {
        return typeof (object) === 'function';
    }
    function isString(object) {
        return (typeof (object) === 'string') || object instanceof String;
    }
    function isBoolean(object) {
        return (typeof (object) === 'boolean') || object instanceof Boolean;
    }
    function isNumber(object) {
        return (typeof (object) === 'number') || object instanceof Number;
    }
    function isOptions(object) {
        return (typeof (object) === 'object') && !isNull(object) && (isUndefined(object.constructor) || (object.constructor === Object));
    }
    function isObject(object) {
        var typeOfResult = typeof (object);
        return ((typeOfResult === 'object') && !isNull(object)) || (typeOfResult === 'function');
    }
    function isElement(object) {
        return object instanceof Element;
    }
    function isRegExp(object) {
        return object instanceof RegExp;
    }
    function isJQuery(object) {
        return up.browser.canJQuery() && object instanceof jQuery;
    }
    function isElementish(object) {
        var _a;
        return !!(object && (object.addEventListener || ((_a = object[0]) === null || _a === void 0 ? void 0 : _a.addEventListener)));
    }
    function isPromise(object) {
        return isObject(object) && isFunction(object.then);
    }
    var isArray = Array.isArray;
    function isFormData(object) {
        return object instanceof FormData;
    }
    function toArray(value) {
        return isArray(value) ? value : copyArrayLike(value);
    }
    function isList(value) {
        return isArray(value) ||
            isNodeList(value) ||
            isArguments(value) ||
            isJQuery(value) ||
            isHTMLCollection(value);
    }
    function isNodeList(value) {
        return value instanceof NodeList;
    }
    function isHTMLCollection(value) {
        return value instanceof HTMLCollection;
    }
    function isArguments(value) {
        return Object.prototype.toString.call(value) === '[object Arguments]';
    }
    function nullToUndefined(value) {
        if (!isNull(value)) {
            return value;
        }
    }
    function wrapList(value) {
        if (isList(value)) {
            return value;
        }
        else if (isMissing(value)) {
            return [];
        }
        else {
            return [value];
        }
    }
    function copy(value) {
        if (isObject(value) && value[copy.key]) {
            value = value[copy.key]();
        }
        else if (isList(value)) {
            value = copyArrayLike(value);
        }
        else if (isOptions(value)) {
            value = assign({}, value);
        }
        return value;
    }
    function copyArrayLike(arrayLike) {
        return Array.prototype.slice.call(arrayLike);
    }
    copy.key = 'up.util.copy';
    Date.prototype[copy.key] = function () { return new Date(+this); };
    function merge() {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i] = arguments[_i];
        }
        return assign.apply(void 0, __spreadArray([{}], sources, false));
    }
    function mergeDefined() {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i] = arguments[_i];
        }
        var result = {};
        for (var _a = 0, sources_2 = sources; _a < sources_2.length; _a++) {
            var source = sources_2[_a];
            if (source) {
                for (var key in source) {
                    var value = source[key];
                    if (isDefined(value)) {
                        result[key] = value;
                    }
                }
            }
        }
        return result;
    }
    function newOptions(object, defaults) {
        if (defaults) {
            return merge(defaults, object);
        }
        else if (object) {
            return copy(object);
        }
        else {
            return {};
        }
    }
    function parseArgIntoOptions(args, argKey) {
        var options = extractOptions(args);
        if (isDefined(args[0])) {
            options = copy(options);
            options[argKey] = args[0];
        }
        return options;
    }
    function findInList(list, tester) {
        tester = iteratee(tester);
        var match;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var element = list_1[_i];
            if (tester(element)) {
                match = element;
                break;
            }
        }
        return match;
    }
    function some(list, tester) {
        return !!findResult(list, tester);
    }
    function findResult(array, tester) {
        tester = iteratee(tester);
        for (var i = 0; i < array.length; i++) {
            var result = tester(array[i], i);
            if (result) {
                return result;
            }
        }
    }
    function every(list, tester) {
        tester = iteratee(tester);
        var match = true;
        for (var i = 0; i < list.length; i++) {
            if (!tester(list[i], i)) {
                match = false;
                break;
            }
        }
        return match;
    }
    function compact(array) {
        return filterList(array, isGiven);
    }
    function compactObject(object) {
        return pickBy(object, isGiven);
    }
    function uniq(array) {
        if (array.length < 2) {
            return array;
        }
        return setToArray(arrayToSet(array));
    }
    function uniqBy(array, mapper) {
        if (array.length < 2) {
            return array;
        }
        mapper = iteratee(mapper);
        var seenElements = new Set();
        return filterList(array, function (elem, index) {
            var mapped = mapper(elem, index);
            if (seenElements.has(mapped)) {
                return false;
            }
            else {
                seenElements.add(mapped);
                return true;
            }
        });
    }
    function setToArray(set) {
        var array = [];
        set.forEach(function (elem) { return array.push(elem); });
        return array;
    }
    function arrayToSet(array) {
        var set = new Set();
        array.forEach(function (elem) { return set.add(elem); });
        return set;
    }
    function filterList(list, tester) {
        tester = iteratee(tester);
        var matches = [];
        each(list, function (element, index) {
            if (tester(element, index)) {
                return matches.push(element);
            }
        });
        return matches;
    }
    function reject(list, tester) {
        tester = negate(iteratee(tester));
        return filterList(list, tester);
    }
    function intersect(array1, array2) {
        return filterList(array1, function (element) { return contains(array2, element); });
    }
    function scheduleTimer(millis, callback) {
        return setTimeout(callback, millis);
    }
    function queueTask(task) {
        return setTimeout(task);
    }
    function queueMicrotask(task) {
        return Promise.resolve().then(task);
    }
    function abortableMicrotask(task) {
        var aborted = false;
        queueMicrotask(function () { if (!aborted) {
            return task();
        } });
        return function () { return aborted = true; };
    }
    function last(array) {
        return array[array.length - 1];
    }
    function contains(value, subValue) {
        return value.indexOf(subValue) >= 0;
    }
    function objectContains(object, subObject) {
        var reducedValue = pick(object, Object.keys(subObject));
        return isEqual(subObject, reducedValue);
    }
    function pick(object, keys) {
        var filtered = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (key in object) {
                filtered[key] = object[key];
            }
        }
        return filtered;
    }
    function pickBy(object, tester) {
        tester = iteratee(tester);
        var filtered = {};
        for (var key in object) {
            var value = object[key];
            if (tester(value, key, object)) {
                filtered[key] = object[key];
            }
        }
        return filtered;
    }
    function omit(object, keys) {
        return pickBy(object, function (_value, key) { return !contains(keys, key); });
    }
    function unresolvablePromise() {
        return new Promise(noop);
    }
    function remove(array, element) {
        var index = array.indexOf(element);
        if (index >= 0) {
            array.splice(index, 1);
            return element;
        }
    }
    function evalOption(value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return isFunction(value) ? value.apply(void 0, args) : value;
    }
    var ESCAPE_HTML_ENTITY_MAP = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#x27;'
    };
    function escapeHTML(string) {
        return string.replace(/[&<>"']/g, function (char) { return ESCAPE_HTML_ENTITY_MAP[char]; });
    }
    function escapeRegExp(string) {
        return string.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    function pluckKey(object, key) {
        var value = object[key];
        delete object[key];
        return value;
    }
    function renameKey(object, oldKey, newKey) {
        return object[newKey] = pluckKey(object, oldKey);
    }
    function extractLastArg(args, tester) {
        if (tester(last(args))) {
            return args.pop();
        }
    }
    function extractCallback(args) {
        return extractLastArg(args, isFunction);
    }
    function extractOptions(args) {
        return extractLastArg(args, isOptions) || {};
    }
    function identity(arg) {
        return arg;
    }
    function sequence(functions) {
        if (functions.length === 1) {
            return functions[0];
        }
        return function () { return map(functions, function (fn) { return fn(); }); };
    }
    function flatten(array) {
        var flattened = [];
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var object = array_1[_i];
            if (isList(object)) {
                flattened.push.apply(flattened, object);
            }
            else {
                flattened.push(object);
            }
        }
        return flattened;
    }
    function flatMap(array, block) {
        return flatten(map(array, block));
    }
    function isTruthy(object) {
        return !!object;
    }
    function always(promise, callback) {
        return promise.then(callback, callback);
    }
    function muteRejection(promise) {
        return promise === null || promise === void 0 ? void 0 : promise.catch(noop);
    }
    function newDeferred() {
        var resolveFn;
        var rejectFn;
        var nativePromise = new Promise(function (givenResolve, givenReject) {
            resolveFn = givenResolve;
            rejectFn = givenReject;
        });
        nativePromise.resolve = resolveFn;
        nativePromise.reject = rejectFn;
        nativePromise.promise = function () { return nativePromise; };
        return nativePromise;
    }
    function asyncify(block) {
        try {
            return Promise.resolve(block());
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    function isBasicObjectProperty(k) {
        return Object.prototype.hasOwnProperty(k);
    }
    function isEqual(a, b) {
        if (a === null || a === void 0 ? void 0 : a.valueOf) {
            a = a.valueOf();
        }
        if (b === null || b === void 0 ? void 0 : b.valueOf) {
            b = b.valueOf();
        }
        if (typeof (a) !== typeof (b)) {
            return false;
        }
        else if (isList(a) && isList(b)) {
            return isEqualList(a, b);
        }
        else if (isObject(a) && a[isEqual.key]) {
            return a[isEqual.key](b);
        }
        else if (isOptions(a) && isOptions(b)) {
            var aKeys = Object.keys(a);
            var bKeys = Object.keys(b);
            if (isEqualList(aKeys, bKeys)) {
                return every(aKeys, function (aKey) { return isEqual(a[aKey], b[aKey]); });
            }
            else {
                return false;
            }
        }
        else {
            return a === b;
        }
    }
    isEqual.key = 'up.util.isEqual';
    function isEqualList(a, b) {
        return (a.length === b.length) && every(a, function (elem, index) { return isEqual(elem, b[index]); });
    }
    function splitValues(value, separator) {
        if (separator === void 0) { separator = ' '; }
        if (isString(value)) {
            value = value.split(separator);
            value = map(value, function (v) { return v.trim(); });
            value = filterList(value, isPresent);
            return value;
        }
        else {
            return wrapList(value);
        }
    }
    function endsWith(string, search) {
        return string.substring(string.length - search.length) === search;
    }
    function simpleEase(x) {
        return x < 0.5 ? 2 * x * x : (x * (4 - (x * 2))) - 1;
    }
    function wrapValue(constructor) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (args[0] instanceof constructor) ? args[0] : new (constructor.bind.apply(constructor, __spreadArray([void 0], args, false)))();
    }
    var nextUid = 0;
    function uid() {
        return nextUid++;
    }
    function reverse(list) {
        return copy(list).reverse();
    }
    function renameKeys(object, renameKeyFn) {
        var renamed = {};
        for (var key in object) {
            renamed[renameKeyFn(key)] = object[key];
        }
        return renamed;
    }
    function camelToKebabCase(str) {
        return str.replace(/[A-Z]/g, function (char) { return '-' + char.toLowerCase(); });
    }
    function prefixCamelCase(str, prefix) {
        return prefix + upperCaseFirst(str);
    }
    function unprefixCamelCase(str, prefix) {
        var pattern = new RegExp('^' + prefix + '(.+)$');
        var match = str.match(pattern);
        if (match) {
            return lowerCaseFirst(match[1]);
        }
    }
    function lowerCaseFirst(str) {
        return str[0].toLowerCase() + str.slice(1);
    }
    function upperCaseFirst(str) {
        return str[0].toUpperCase() + str.slice(1);
    }
    function defineGetter(object, prop, get) {
        Object.defineProperty(object, prop, { get: get });
    }
    function defineDelegates(object, props, targetProvider) {
        wrapList(props).forEach(function (prop) {
            Object.defineProperty(object, prop, {
                get: function () {
                    var target = targetProvider.call(this);
                    var value = target[prop];
                    if (isFunction(value)) {
                        value = value.bind(target);
                    }
                    return value;
                },
                set: function (newValue) {
                    var target = targetProvider.call(this);
                    target[prop] = newValue;
                }
            });
        });
    }
    function stringifyArg(arg) {
        var string;
        var maxLength = 200;
        var closer = '';
        if (isString(arg)) {
            string = arg.replace(/[\n\r\t ]+/g, ' ');
            string = string.replace(/^[\n\r\t ]+/, '');
            string = string.replace(/[\n\r\t ]$/, '');
        }
        else if (isUndefined(arg)) {
            string = 'undefined';
        }
        else if (isNumber(arg) || isFunction(arg)) {
            string = arg.toString();
        }
        else if (isArray(arg)) {
            string = "[".concat(map(arg, stringifyArg).join(', '), "]");
            closer = ']';
        }
        else if (isJQuery(arg)) {
            string = "$(".concat(map(arg, stringifyArg).join(', '), ")");
            closer = ')';
        }
        else if (isElement(arg)) {
            string = "<".concat(arg.tagName.toLowerCase());
            for (var _i = 0, _a = ['id', 'name', 'class']; _i < _a.length; _i++) {
                var attr = _a[_i];
                var value = arg.getAttribute(attr);
                if (value) {
                    string += " ".concat(attr, "=\"").concat(value, "\"");
                }
            }
            string += ">";
            closer = '>';
        }
        else if (isRegExp(arg)) {
            string = arg.toString();
        }
        else {
            try {
                string = JSON.stringify(arg);
            }
            catch (error) {
                if (error.name === 'TypeError') {
                    string = '(circular structure)';
                }
                else {
                    throw error;
                }
            }
        }
        if (string.length > maxLength) {
            string = "".concat(string.substr(0, maxLength), " \u2026");
            string += closer;
        }
        return string;
    }
    var SPRINTF_PLACEHOLDERS = /%[oOdisf]/g;
    function secondsSinceEpoch() {
        return Math.floor(Date.now() * 0.001);
    }
    function sprintf(message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return sprintfWithFormattedArgs.apply(void 0, __spreadArray([identity, message], args, false));
    }
    function sprintfWithFormattedArgs(formatter, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!message) {
            return '';
        }
        var i = 0;
        return message.replace(SPRINTF_PLACEHOLDERS, function () {
            var arg = args[i];
            arg = formatter(stringifyArg(arg));
            i += 1;
            return arg;
        });
    }
    function allSettled(promises) {
        return Promise.all(map(promises, muteRejection));
    }
    function negate(fn) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return !fn.apply(void 0, args);
        };
    }
    return {
        parseURL: parseURL,
        normalizeURL: normalizeURL,
        matchURLs: matchURLs,
        normalizeMethod: normalizeMethod,
        methodAllowsPayload: methodAllowsPayload,
        assign: assign,
        assignPolyfill: assignPolyfill,
        copy: copy,
        copyArrayLike: copyArrayLike,
        merge: merge,
        mergeDefined: mergeDefined,
        options: newOptions,
        parseArgIntoOptions: parseArgIntoOptions,
        each: each,
        eachIterator: eachIterator,
        map: map,
        flatMap: flatMap,
        mapObject: mapObject,
        findResult: findResult,
        some: some,
        every: every,
        find: findInList,
        filter: filterList,
        reject: reject,
        intersect: intersect,
        compact: compact,
        compactObject: compactObject,
        uniq: uniq,
        uniqBy: uniqBy,
        last: last,
        isNull: isNull,
        isDefined: isDefined,
        isUndefined: isUndefined,
        isGiven: isGiven,
        isMissing: isMissing,
        isPresent: isPresent,
        isBlank: isBlank,
        presence: presence,
        isObject: isObject,
        isFunction: isFunction,
        isString: isString,
        isBoolean: isBoolean,
        isNumber: isNumber,
        isElement: isElement,
        isJQuery: isJQuery,
        isElementish: isElementish,
        isPromise: isPromise,
        isOptions: isOptions,
        isArray: isArray,
        isFormData: isFormData,
        isNodeList: isNodeList,
        isArguments: isArguments,
        isList: isList,
        isRegExp: isRegExp,
        timer: scheduleTimer,
        contains: contains,
        objectContains: objectContains,
        toArray: toArray,
        pick: pick,
        pickBy: pickBy,
        omit: omit,
        unresolvablePromise: unresolvablePromise,
        remove: remove,
        memoize: memoize,
        pluckKey: pluckKey,
        renameKey: renameKey,
        extractOptions: extractOptions,
        extractCallback: extractCallback,
        noop: noop,
        asyncNoop: asyncNoop,
        identity: identity,
        escapeHTML: escapeHTML,
        escapeRegExp: escapeRegExp,
        sequence: sequence,
        evalOption: evalOption,
        flatten: flatten,
        isTruthy: isTruthy,
        newDeferred: newDeferred,
        always: always,
        muteRejection: muteRejection,
        asyncify: asyncify,
        isBasicObjectProperty: isBasicObjectProperty,
        isCrossOrigin: isCrossOrigin,
        task: queueTask,
        microtask: queueMicrotask,
        abortableMicrotask: abortableMicrotask,
        isEqual: isEqual,
        splitValues: splitValues,
        endsWith: endsWith,
        wrapList: wrapList,
        wrapValue: wrapValue,
        simpleEase: simpleEase,
        values: objectValues,
        arrayToSet: arrayToSet,
        setToArray: setToArray,
        uid: uid,
        upperCaseFirst: upperCaseFirst,
        lowerCaseFirst: lowerCaseFirst,
        getter: defineGetter,
        delegate: defineDelegates,
        reverse: reverse,
        prefixCamelCase: prefixCamelCase,
        unprefixCamelCase: unprefixCamelCase,
        camelToKebabCase: camelToKebabCase,
        nullToUndefined: nullToUndefined,
        sprintf: sprintf,
        sprintfWithFormattedArgs: sprintfWithFormattedArgs,
        renameKeys: renameKeys,
        timestamp: secondsSinceEpoch,
        allSettled: allSettled,
        negate: negate,
    };
})();


/***/ }),
/* 4 */
/***/ (function() {

up.error = (function () {
    var u = up.util;
    function build(message, props) {
        if (props === void 0) { props = {}; }
        if (u.isArray(message)) {
            message = u.sprintf.apply(u, message);
        }
        var error = new Error(message);
        u.assign(error, props);
        return error;
    }
    function errorInterface(name, init) {
        if (init === void 0) { init = build; }
        var fn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var error = init.apply(void 0, args);
            error.name = name;
            return error;
        };
        fn.is = function (error) { return error.name === name; };
        fn.async = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return Promise.reject(fn.apply(void 0, args));
        };
        return fn;
    }
    var failed = errorInterface('up.Failed');
    var aborted = errorInterface('AbortError', function (message) {
        return build(message || 'Aborted');
    });
    var notImplemented = errorInterface('up.NotImplemented');
    var notApplicable = errorInterface('up.NotApplicable', function (change, reason) {
        return build("Cannot apply change: ".concat(change, " (").concat(reason, ")"));
    });
    var invalidSelector = errorInterface('up.InvalidSelector', function (selector) {
        return build("Cannot parse selector: ".concat(selector));
    });
    function emitGlobal(error) {
        var message = error.message;
        up.emit(window, 'error', { message: message, error: error, log: false });
    }
    function fail() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        throw up.error.failed(args);
    }
    return {
        fail: fail,
        failed: failed,
        aborted: aborted,
        invalidSelector: invalidSelector,
        notApplicable: notApplicable,
        notImplemented: notImplemented,
        emitGlobal: emitGlobal
    };
})();
up.fail = up.error.fail;


/***/ }),
/* 5 */
/***/ (function() {

up.migrate = { config: {} };


/***/ }),
/* 6 */
/***/ (function() {

up.browser = (function () {
    var u = up.util;
    function submitForm(form) {
        form.submit();
    }
    function isIE11() {
        return 'ActiveXObject' in window;
    }
    function isEdge18() {
        return u.contains(navigator.userAgent, ' Edge/');
    }
    function canPushState() {
        return history.pushState && up.protocol.initialRequestMethod() === 'GET';
    }
    function canPromise() {
        return !!window.Promise;
    }
    var canFormatLog = u.negate(isIE11);
    var canPassiveEventListener = u.negate(isIE11);
    function canJQuery() {
        return !!window.jQuery;
    }
    var canEval = u.memoize(function () {
        try {
            return new Function('return true')();
        }
        catch (_a) {
            return false;
        }
    });
    function popCookie(name) {
        var _a;
        var value = (_a = document.cookie.match(new RegExp(name + "=(\\w+)"))) === null || _a === void 0 ? void 0 : _a[1];
        if (value) {
            document.cookie = name + '=;Max-Age=0;Path=/';
            return value;
        }
    }
    var getJQuery = function () {
        if (!canJQuery()) {
            up.fail('jQuery must be published as window.jQuery');
        }
        return jQuery;
    };
    function assertConfirmed(options) {
        var confirmed = !options.confirm || window.confirm(options.confirm);
        if (!confirmed) {
            throw up.error.aborted('User canceled action');
        }
        return true;
    }
    return {
        submitForm: submitForm,
        canPushState: canPushState,
        canFormatLog: canFormatLog,
        canPassiveEventListener: canPassiveEventListener,
        canJQuery: canJQuery,
        canPromise: canPromise,
        canEval: canEval,
        assertConfirmed: assertConfirmed,
        popCookie: popCookie,
        get jQuery() { return getJQuery(); },
        isIE11: isIE11,
        isEdge18: isEdge18,
    };
})();


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
__webpack_require__(8);
up.element = (function () {
    var u = up.util;
    var MATCH_FN_NAME = up.browser.isIE11() ? 'msMatchesSelector' : 'matches';
    function first() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var selector = args.pop();
        var root = args[0] || document;
        return root.querySelector(selector);
    }
    function all() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var selector = args.pop();
        var root = args[0] || document;
        return root.querySelectorAll(selector);
    }
    function subtree(root, selector) {
        var results = [];
        if (matches(root, selector)) {
            results.push(root);
        }
        results.push.apply(results, all(root, selector));
        return results;
    }
    function isInSubtree(root, selectorOrElement) {
        var element = getOne(selectorOrElement);
        return root.contains(element);
    }
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        else if (matches(element, selector)) {
            return element;
        }
        else {
            return ancestor(element, selector);
        }
    }
    function matches(element, selector) {
        var _a;
        return (_a = element[MATCH_FN_NAME]) === null || _a === void 0 ? void 0 : _a.call(element, selector);
    }
    function ancestor(element, selector) {
        var parentElement = element.parentElement;
        if (parentElement) {
            if (matches(parentElement, selector)) {
                return parentElement;
            }
            else {
                return ancestor(parentElement, selector);
            }
        }
    }
    function around(element, selector) {
        return getList(closest(element, selector), subtree(element, selector));
    }
    function getOne() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var value = args.pop();
        if (u.isElement(value)) {
            return value;
        }
        else if (u.isString(value)) {
            return first.apply(void 0, __spreadArray(__spreadArray([], args, false), [value], false));
        }
        else if (u.isList(value)) {
            if (value.length > 1) {
                up.fail('up.element.get(): Cannot cast multiple elements (%o) to a single element', value);
            }
            return value[0];
        }
        else {
            return value;
        }
    }
    function getList() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return u.flatMap(args, valueToList);
    }
    function valueToList(value) {
        if (u.isString(value)) {
            return all(value);
        }
        else {
            return u.wrapList(value);
        }
    }
    function remove(element) {
        var parent = element.parentNode;
        if (parent) {
            parent.removeChild(element);
        }
    }
    function hide(element) {
        element.setAttribute('hidden', '');
    }
    function show(element) {
        element.removeAttribute('hidden');
        if (element.style.display === 'none') {
            element.style.display = '';
        }
    }
    function toggle(element, newVisible) {
        if (newVisible == null) {
            newVisible = !isVisible(element);
        }
        (newVisible ? show : hide)(element);
    }
    function toggleClass(element, klass, newPresent) {
        var list = element.classList;
        if (newPresent == null) {
            newPresent = !list.contains(klass);
        }
        if (newPresent) {
            return list.add(klass);
        }
        else {
            return list.remove(klass);
        }
    }
    function toggleAttr(element, attr, value, newPresent) {
        if (newPresent == null) {
            newPresent = !element.hasAttribute(attr);
        }
        if (newPresent) {
            return element.setAttribute(attr, value);
        }
        else {
            return element.removeAttribute(attr);
        }
    }
    function setAttrs(element, attrs) {
        for (var key in attrs) {
            var value = attrs[key];
            if (u.isGiven(value)) {
                element.setAttribute(key, value);
            }
            else {
                element.removeAttribute(key);
            }
        }
    }
    function setTemporaryAttrs(element, attrs) {
        var oldAttrs = {};
        for (var _i = 0, _a = Object.keys(attrs); _i < _a.length; _i++) {
            var key = _a[_i];
            oldAttrs[key] = element.getAttribute(key);
        }
        setAttrs(element, attrs);
        return function () { return setAttrs(element, oldAttrs); };
    }
    function metaContent(name) {
        var _a;
        var selector = "meta" + attributeSelector('name', name);
        return (_a = first(selector)) === null || _a === void 0 ? void 0 : _a.getAttribute('content');
    }
    function insertBefore(existingElement, newElement) {
        existingElement.insertAdjacentElement('beforebegin', newElement);
    }
    function replace(oldElement, newElement) {
        oldElement.parentElement.replaceChild(newElement, oldElement);
    }
    function createFromSelector(selector, attrs) {
        var attrValues = [];
        var selectorWithoutAttrValues = selector.replace(/\[([\w-]+)(?:[~|^$*]?=(["'])?([^\2\]]*?)\2)?\]/g, function (_match, attrName, _quote, attrValue) {
            attrValues.push(attrValue || '');
            return "[".concat(attrName, "]");
        });
        var depths = selectorWithoutAttrValues.split(/[ >]+/);
        var rootElement;
        var depthElement;
        var previousElement;
        var _loop_1 = function (depthSelector) {
            var tagName;
            depthSelector = depthSelector.replace(/^[\w-]+/, function (match) {
                tagName = match;
                return '';
            });
            depthElement = document.createElement(tagName || 'div');
            if (!rootElement) {
                rootElement = depthElement;
            }
            depthSelector = depthSelector.replace(/#([\w-]+)/, function (_match, id) {
                depthElement.id = id;
                return '';
            });
            depthSelector = depthSelector.replace(/\.([\w-]+)/g, function (_match, className) {
                depthElement.classList.add(className);
                return '';
            });
            if (attrValues.length) {
                depthSelector = depthSelector.replace(/\[([\w-]+)\]/g, function (_match, attrName) {
                    depthElement.setAttribute(attrName, attrValues.shift());
                    return '';
                });
            }
            if (depthSelector !== '') {
                throw up.error.invalidSelector(selector);
            }
            previousElement === null || previousElement === void 0 ? void 0 : previousElement.appendChild(depthElement);
            previousElement = depthElement;
        };
        for (var _i = 0, depths_1 = depths; _i < depths_1.length; _i++) {
            var depthSelector = depths_1[_i];
            _loop_1(depthSelector);
        }
        if (attrs) {
            var value = void 0;
            if (value = u.pluckKey(attrs, 'class')) {
                for (var _a = 0, _b = u.wrapList(value); _a < _b.length; _a++) {
                    var klass = _b[_a];
                    rootElement.classList.add(klass);
                }
            }
            if (value = u.pluckKey(attrs, 'style')) {
                setInlineStyle(rootElement, value);
            }
            if (value = u.pluckKey(attrs, 'text')) {
                rootElement.textContent = value;
            }
            if (value = u.pluckKey(attrs, 'content')) {
                rootElement.innerHTML = value;
            }
            setAttrs(rootElement, attrs);
        }
        return rootElement;
    }
    function affix(parent) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var position, selector;
        var attributes = u.extractOptions(args);
        if (args.length === 2) {
            position = args[0], selector = args[1];
        }
        else {
            position = 'beforeend';
            selector = args[0];
        }
        var element = createFromSelector(selector, attributes);
        parent.insertAdjacentElement(position, element);
        return element;
    }
    function toSelector() {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = up.fragment).toTarget.apply(_a, args);
    }
    var SINGLETON_TAG_NAMES = ['HTML', 'BODY', 'HEAD', 'TITLE'];
    var SINGLETON_PATTERN = new RegExp('\\b(' + SINGLETON_TAG_NAMES.join('|') + ')\\b', 'i');
    var isSingleton = up.mockable(function (element) { return matches(element, SINGLETON_TAG_NAMES.join(',')); });
    function isSingletonSelector(selector) {
        return SINGLETON_PATTERN.test(selector);
    }
    function elementTagName(element) {
        return element.tagName.toLowerCase();
    }
    function attributeSelector(attribute, value) {
        value = value.replace(/"/g, '\\"');
        return "[".concat(attribute, "=\"").concat(value, "\"]");
    }
    function trueAttributeSelector(attribute) {
        return "[".concat(attribute, "]:not([").concat(attribute, "=false])");
    }
    function idSelector(id) {
        if (id.match(/^[a-z0-9\-_]+$/i)) {
            return "#".concat(id);
        }
        else {
            return attributeSelector('id', id);
        }
    }
    function classSelector(klass) {
        klass = klass.replace(/:/g, '\\:');
        return ".".concat(klass);
    }
    function createDocumentFromHTML(html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }
    function createFromHTML(html) {
        var range = document.createRange();
        range.setStart(document.body, 0);
        var fragment = range.createContextualFragment(html.trim());
        var elements = fragment.childNodes;
        if (elements.length !== 1) {
            throw new Error('HTML must have a single root element');
        }
        return elements[0];
    }
    function getRoot() {
        return document.documentElement;
    }
    function paint(element) {
        element.offsetHeight;
    }
    function concludeCSSTransition(element) {
        var undo = setTemporaryStyle(element, { transition: 'none' });
        paint(element);
        return undo;
    }
    function hasCSSTransition(elementOrStyleHash) {
        var styleHash;
        if (u.isOptions(elementOrStyleHash)) {
            styleHash = elementOrStyleHash;
        }
        else {
            styleHash = computedStyle(elementOrStyleHash);
        }
        var prop = styleHash.transitionProperty;
        var duration = styleHash.transitionDuration;
        var noTransition = ((prop === 'none') || ((prop === 'all') && (duration === 0)));
        return !noTransition;
    }
    function fixedToAbsolute(element) {
        var elementRectAsFixed = element.getBoundingClientRect();
        element.style.position = 'absolute';
        var offsetParentRect = element.offsetParent.getBoundingClientRect();
        setInlineStyle(element, {
            left: elementRectAsFixed.left - computedStyleNumber(element, 'margin-left') - offsetParentRect.left,
            top: elementRectAsFixed.top - computedStyleNumber(element, 'margin-top') - offsetParentRect.top,
            right: '',
            bottom: ''
        });
    }
    function setMissingAttrs(element, attrs) {
        for (var key in attrs) {
            setMissingAttr(element, key, attrs[key]);
        }
    }
    function setMissingAttr(element, key, value) {
        if (u.isMissing(element.getAttribute(key))) {
            element.setAttribute(key, value);
        }
    }
    function unwrap(wrapper) {
        var parent = wrapper.parentNode;
        var wrappedNodes = u.toArray(wrapper.childNodes);
        u.each(wrappedNodes, function (wrappedNode) { return parent.insertBefore(wrappedNode, wrapper); });
        parent.removeChild(wrapper);
    }
    function wrapChildren(element, wrapperSelector) {
        if (wrapperSelector === void 0) { wrapperSelector = 'up-wrapper'; }
        var childNode;
        var wrapper = createFromSelector(wrapperSelector);
        while ((childNode = element.firstChild)) {
            wrapper.appendChild(childNode);
        }
        element.appendChild(wrapper);
        return wrapper;
    }
    function stringAttr(element, attribute) {
        return u.nullToUndefined(element.getAttribute(attribute));
    }
    function booleanAttr(element, attribute, pass) {
        var value = stringAttr(element, attribute);
        switch (value) {
            case 'false': {
                return false;
            }
            case 'true':
            case '':
            case attribute: {
                return true;
            }
            default: {
                if (pass) {
                    return value;
                }
            }
        }
    }
    function booleanOrStringAttr(element, attribute) {
        return booleanAttr(element, attribute, true);
    }
    function numberAttr(element, attribute) {
        var value = element.getAttribute(attribute);
        if (value) {
            value = value.replace(/_/g, '');
            if (value.match(/^[\d.]+$/)) {
                return parseFloat(value);
            }
        }
    }
    function jsonAttr(element, attribute) {
        var _a, _b;
        var json = (_b = (_a = element.getAttribute) === null || _a === void 0 ? void 0 : _a.call(element, attribute)) === null || _b === void 0 ? void 0 : _b.trim();
        if (json) {
            return JSON.parse(json);
        }
    }
    function callbackAttr(link, attr, exposedKeys) {
        var _a;
        if (exposedKeys === void 0) { exposedKeys = []; }
        var code = link.getAttribute(attr);
        if (code) {
            var callback_1 = (_a = up.NonceableCallback.fromString(code)).toFunction.apply(_a, __spreadArray(['event'], exposedKeys, false));
            return function (event) {
                var exposedValues = u.values(u.pick(event, exposedKeys));
                return callback_1.call.apply(callback_1, __spreadArray([link, event], exposedValues, false));
            };
        }
    }
    function closestAttr(element, attr) {
        var _a;
        return (_a = closest(element, '[' + attr + ']')) === null || _a === void 0 ? void 0 : _a.getAttribute(attr);
    }
    function setTemporaryStyle(element, newStyles) {
        var oldStyles = inlineStyle(element, Object.keys(newStyles));
        setInlineStyle(element, newStyles);
        return function () { return setInlineStyle(element, oldStyles); };
    }
    function computedStyle(element, props) {
        var style = window.getComputedStyle(element);
        return extractFromStyleObject(style, props);
    }
    function computedStyleNumber(element, prop) {
        var rawValue = computedStyle(element, prop);
        if (u.isGiven(rawValue)) {
            return parseFloat(rawValue);
        }
    }
    function inlineStyle(element, props) {
        var style = element.style;
        return extractFromStyleObject(style, props);
    }
    function extractFromStyleObject(style, keyOrKeys) {
        if (u.isString(keyOrKeys)) {
            return style[keyOrKeys];
        }
        else {
            return u.pick(style, keyOrKeys);
        }
    }
    function setInlineStyle(element, props) {
        if (u.isString(props)) {
            element.setAttribute('style', props);
        }
        else {
            var style = element.style;
            for (var key in props) {
                var value = props[key];
                value = normalizeStyleValueForWrite(key, value);
                style[key] = value;
            }
        }
    }
    function normalizeStyleValueForWrite(key, value) {
        if (u.isMissing(value)) {
            value = '';
        }
        else if (CSS_LENGTH_PROPS.has(key.toLowerCase().replace(/-/, ''))) {
            value = cssLength(value);
        }
        return value;
    }
    var CSS_LENGTH_PROPS = u.arrayToSet([
        'top', 'right', 'bottom', 'left',
        'padding', 'paddingtop', 'paddingright', 'paddingbottom', 'paddingleft',
        'margin', 'margintop', 'marginright', 'marginbottom', 'marginleft',
        'borderwidth', 'bordertopwidth', 'borderrightwidth', 'borderbottomwidth', 'borderleftwidth',
        'width', 'height',
        'maxwidth', 'maxheight',
        'minwidth', 'minheight',
    ]);
    function cssLength(obj) {
        if (u.isNumber(obj) || (u.isString(obj) && /^\d+$/.test(obj))) {
            return obj.toString() + "px";
        }
        else {
            return obj;
        }
    }
    function isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }
    function upAttrs(element) {
        var upAttributePattern = /^up-/;
        var attrs = {};
        for (var _i = 0, _a = element.attributes; _i < _a.length; _i++) {
            var attribute = _a[_i];
            var name = attribute.name;
            if (name.match(upAttributePattern)) {
                attrs[name] = attribute.value;
            }
        }
        return attrs;
    }
    function isDetached(element) {
        return (element !== document) && !getRoot().contains(element);
    }
    return {
        all: all,
        subtree: subtree,
        isInSubtree: isInSubtree,
        closest: closest,
        closestAttr: closestAttr,
        matches: matches,
        ancestor: ancestor,
        around: around,
        get: getOne,
        list: getList,
        remove: remove,
        toggle: toggle,
        toggleClass: toggleClass,
        hide: hide,
        show: show,
        metaContent: metaContent,
        replace: replace,
        insertBefore: insertBefore,
        createFromSelector: createFromSelector,
        setAttrs: setAttrs,
        setTemporaryAttrs: setTemporaryAttrs,
        affix: affix,
        toSelector: toSelector,
        idSelector: idSelector,
        classSelector: classSelector,
        isSingleton: isSingleton,
        isSingletonSelector: isSingletonSelector,
        attributeSelector: attributeSelector,
        trueAttributeSelector: trueAttributeSelector,
        tagName: elementTagName,
        createDocumentFromHTML: createDocumentFromHTML,
        createFromHTML: createFromHTML,
        get root() { return getRoot(); },
        paint: paint,
        concludeCSSTransition: concludeCSSTransition,
        hasCSSTransition: hasCSSTransition,
        fixedToAbsolute: fixedToAbsolute,
        setMissingAttrs: setMissingAttrs,
        setMissingAttr: setMissingAttr,
        unwrap: unwrap,
        wrapChildren: wrapChildren,
        attr: stringAttr,
        booleanAttr: booleanAttr,
        numberAttr: numberAttr,
        jsonAttr: jsonAttr,
        callbackAttr: callbackAttr,
        booleanOrStringAttr: booleanOrStringAttr,
        setTemporaryStyle: setTemporaryStyle,
        style: computedStyle,
        styleNumber: computedStyleNumber,
        inlineStyle: inlineStyle,
        setStyle: setInlineStyle,
        isVisible: isVisible,
        upAttrs: upAttrs,
        toggleAttr: toggleAttr,
        isDetached: isDetached
    };
})();


/***/ }),
/* 8 */
/***/ (function() {



/***/ }),
/* 9 */
/***/ (function() {

var u = up.util;
up.Record = (function () {
    function Record(options) {
        u.assign(this, this.defaults(options), this.attributes(options));
    }
    Record.prototype.keys = function () {
        throw 'Return an array of keys';
    };
    Record.prototype.defaults = function (_options) {
        return {};
    };
    Record.prototype.attributes = function (source) {
        if (source === void 0) { source = this; }
        return u.pick(source, this.keys());
    };
    Record.prototype[u.copy.key] = function () {
        return this.variant();
    };
    Record.prototype.variant = function (changes) {
        if (changes === void 0) { changes = {}; }
        return new this.constructor(u.merge(this.attributes(), changes));
    };
    Record.prototype[u.isEqual.key] = function (other) {
        return (this.constructor === other.constructor) && u.isEqual(this.attributes(), other.attributes());
    };
    return Record;
}());


/***/ }),
/* 10 */
/***/ (function() {

var u = up.util;
up.Config = (function () {
    function Config(blueprintFn) {
        if (blueprintFn === void 0) { blueprintFn = (function () { return ({}); }); }
        this.blueprintFn = blueprintFn;
        this.reset();
    }
    Config.prototype.reset = function () {
        u.assign(this, this.blueprintFn());
    };
    return Config;
}());


/***/ }),
/* 11 */
/***/ (function() {

var u = up.util;
up.Cache = (function () {
    function Cache(config) {
        if (config === void 0) { config = {}; }
        this.config = config;
        this.store = this.config.store || new up.store.Memory();
    }
    Cache.prototype.size = function () {
        return this.store.size();
    };
    Cache.prototype.maxSize = function () {
        return u.evalOption(this.config.size);
    };
    Cache.prototype.expiryMillis = function () {
        return u.evalOption(this.config.expiry);
    };
    Cache.prototype.normalizeStoreKey = function (key) {
        if (this.config.key) {
            return this.config.key(key);
        }
        else {
            return key.toString();
        }
    };
    Cache.prototype.isEnabled = function () {
        return (this.maxSize() !== 0) && (this.expiryMillis() !== 0);
    };
    Cache.prototype.clear = function () {
        this.store.clear();
    };
    Cache.prototype.keys = function () {
        return this.store.keys();
    };
    Cache.prototype.each = function (fn) {
        var _this = this;
        u.each(this.keys(), function (key) {
            var entry = _this.store.get(key);
            fn(key, entry.value, entry.timestamp);
        });
    };
    Cache.prototype.makeRoomForAnotherEntry = function () {
        if (this.hasRoomForAnotherEntry()) {
            return;
        }
        var oldestKey;
        var oldestTimestamp;
        this.each(function (key, request, timestamp) {
            if (!oldestTimestamp || (oldestTimestamp > timestamp)) {
                oldestKey = key;
                oldestTimestamp = timestamp;
            }
        });
        if (oldestKey) {
            this.store.remove(oldestKey);
        }
    };
    Cache.prototype.hasRoomForAnotherEntry = function () {
        var maxSize = this.maxSize();
        return !maxSize || (this.size() < maxSize);
    };
    Cache.prototype.alias = function (oldKey, newKey) {
        var value = this.get(oldKey, { silent: true });
        if (u.isDefined(value)) {
            this.set(newKey, value);
        }
    };
    Cache.prototype.timestamp = function () {
        return (new Date()).valueOf();
    };
    Cache.prototype.set = function (key, value) {
        if (this.isEnabled()) {
            this.makeRoomForAnotherEntry();
            var storeKey = this.normalizeStoreKey(key);
            var entry = {
                timestamp: this.timestamp(),
                value: value
            };
            this.store.set(storeKey, entry);
        }
    };
    Cache.prototype.remove = function (key) {
        var storeKey = this.normalizeStoreKey(key);
        this.store.remove(storeKey);
    };
    Cache.prototype.isFresh = function (entry) {
        var millis = this.expiryMillis();
        if (millis) {
            var timeSinceTouch = this.timestamp() - entry.timestamp;
            return timeSinceTouch < millis;
        }
        else {
            return true;
        }
    };
    Cache.prototype.get = function (key) {
        var storeKey = this.normalizeStoreKey(key);
        var entry = this.store.get(storeKey);
        if (entry) {
            if (this.isFresh(entry)) {
                return entry.value;
            }
            else {
                this.remove(key);
            }
        }
    };
    return Cache;
}());


/***/ }),
/* 12 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
up.Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rect.prototype.keys = function () {
        return [
            'left',
            'top',
            'width',
            'height'
        ];
    };
    Object.defineProperty(Rect.prototype, "bottom", {
        get: function () {
            return this.top + this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        get: function () {
            return this.left + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Rect.fromElement = function (element) {
        return new (this)(element.getBoundingClientRect());
    };
    return Rect;
}(up.Record));


/***/ }),
/* 13 */
/***/ (function() {

var e = up.element;
up.BodyShifter = (function () {
    function BodyShifter() {
        this.unshiftFns = [];
        this.reset();
    }
    BodyShifter.prototype.reset = function () {
        this.unshiftNow();
        this.shiftCount = 0;
    };
    BodyShifter.prototype.shift = function () {
        this.shiftCount++;
        if (this.shiftCount > 1) {
            return;
        }
        var scrollbarTookSpace = up.viewport.rootHasReducedWidthFromScrollbar();
        var overflowElement = up.viewport.rootOverflowElement();
        this.changeStyle(overflowElement, { overflowY: 'hidden' });
        if (!scrollbarTookSpace) {
            return;
        }
        var body = document.body;
        var scrollbarWidth = up.viewport.scrollbarWidth();
        var bodyRightPadding = e.styleNumber(body, 'paddingRight');
        var bodyRightShift = scrollbarWidth + bodyRightPadding;
        this.changeStyle(body, { paddingRight: bodyRightShift });
        for (var _i = 0, _a = up.viewport.anchoredRight(); _i < _a.length; _i++) {
            var anchor = _a[_i];
            var elementRight = e.styleNumber(anchor, 'right');
            var elementRightShift = scrollbarWidth + elementRight;
            this.changeStyle(anchor, { right: elementRightShift });
        }
    };
    BodyShifter.prototype.changeStyle = function (element, styles) {
        this.unshiftFns.push(e.setTemporaryStyle(element, styles));
    };
    BodyShifter.prototype.unshift = function () {
        this.shiftCount--;
        if (this.shiftCount == 0) {
            this.unshiftNow();
        }
    };
    BodyShifter.prototype.unshiftNow = function () {
        var unshiftFn;
        while (unshiftFn = this.unshiftFns.pop()) {
            unshiftFn();
        }
    };
    return BodyShifter;
}());


/***/ }),
/* 14 */
/***/ (function() {

var u = up.util;
up.Change = (function () {
    function Change(options) {
        this.options = options;
    }
    Change.prototype.notApplicable = function (reason) {
        return up.error.notApplicable(this, reason);
    };
    Change.prototype.execute = function () {
        throw up.error.notImplemented();
    };
    Change.prototype.onFinished = function () {
        var _a, _b;
        return (_b = (_a = this.options).onFinished) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    Change.prototype.improveHistoryValue = function (existingValue, newValue) {
        if ((existingValue === false) || u.isString(existingValue)) {
            return existingValue;
        }
        else {
            return newValue;
        }
    };
    return Change;
}());


/***/ }),
/* 15 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var u = up.util;
var e = up.element;
up.Change.Addition = (function (_super) {
    __extends(Addition, _super);
    function Addition(options) {
        var _this = _super.call(this, options) || this;
        _this.responseDoc = options.responseDoc;
        _this.acceptLayer = options.acceptLayer;
        _this.dismissLayer = options.dismissLayer;
        _this.eventPlans = options.eventPlans || [];
        return _this;
    }
    Addition.prototype.handleLayerChangeRequests = function () {
        var _this = this;
        if (this.layer.isOverlay()) {
            this.tryAcceptLayerFromServer();
            this.abortWhenLayerClosed();
            this.layer.tryAcceptForLocation();
            this.abortWhenLayerClosed();
            this.tryDismissLayerFromServer();
            this.abortWhenLayerClosed();
            this.layer.tryDismissForLocation();
            this.abortWhenLayerClosed();
        }
        this.layer.asCurrent(function () {
            for (var _i = 0, _a = _this.eventPlans; _i < _a.length; _i++) {
                var eventPlan = _a[_i];
                up.emit(eventPlan);
                _this.abortWhenLayerClosed();
            }
        });
    };
    Addition.prototype.tryAcceptLayerFromServer = function () {
        if (u.isDefined(this.acceptLayer) && this.layer.isOverlay()) {
            this.layer.accept(this.acceptLayer);
        }
    };
    Addition.prototype.tryDismissLayerFromServer = function () {
        if (u.isDefined(this.dismissLayer) && this.layer.isOverlay()) {
            this.layer.dismiss(this.dismissLayer);
        }
    };
    Addition.prototype.abortWhenLayerClosed = function () {
        if (this.layer.isClosed()) {
            throw up.error.aborted('Layer was closed');
        }
    };
    Addition.prototype.setSource = function (_a) {
        var oldElement = _a.oldElement, newElement = _a.newElement, source = _a.source;
        if (source === 'keep') {
            source = (oldElement && up.fragment.source(oldElement));
        }
        if (source) {
            e.setMissingAttr(newElement, 'up-source', u.normalizeURL(source, { hash: false }));
        }
    };
    return Addition;
}(up.Change));


/***/ }),
/* 16 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
up.Change.Removal = (function (_super) {
    __extends(Removal, _super);
    function Removal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Removal;
}(up.Change));


/***/ }),
/* 17 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var e = up.element;
up.Change.DestroyFragment = (function (_super) {
    __extends(DestroyFragment, _super);
    function DestroyFragment(options) {
        var _this = _super.call(this, options) || this;
        _this.layer = up.layer.get(options) || up.layer.current;
        _this.element = _this.options.element;
        _this.animation = _this.options.animation;
        _this.log = _this.options.log;
        return _this;
    }
    DestroyFragment.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.parent = this.element.parentNode;
                        up.fragment.markAsDestroying(this.element);
                        if (!up.motion.willAnimate(this.element, this.animation, this.options)) return [3, 2];
                        this.emitDestroyed();
                        return [4, this.animate()];
                    case 1:
                        _a.sent();
                        this.wipe();
                        this.onFinished();
                        return [3, 3];
                    case 2:
                        this.wipe();
                        this.emitDestroyed();
                        this.onFinished();
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    };
    DestroyFragment.prototype.animate = function () {
        return up.motion.animate(this.element, this.animation, this.options);
    };
    DestroyFragment.prototype.wipe = function () {
        var _this = this;
        this.layer.asCurrent(function () {
            up.syntax.clean(_this.element, { layer: _this.layer });
            if (up.browser.canJQuery()) {
                jQuery(_this.element).remove();
            }
            else {
                e.remove(_this.element);
            }
        });
    };
    DestroyFragment.prototype.emitDestroyed = function () {
        up.fragment.emitDestroyed(this.element, { parent: this.parent, log: this.log });
    };
    return DestroyFragment;
}(up.Change.Removal));


/***/ }),
/* 18 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
up.Change.OpenLayer = (function (_super) {
    __extends(OpenLayer, _super);
    function OpenLayer(options) {
        var _this = _super.call(this, options) || this;
        _this.target = options.target;
        _this.origin = options.origin;
        _this.baseLayer = options.baseLayer;
        return _this;
    }
    OpenLayer.prototype.preflightProps = function () {
        return {
            layer: this.baseLayer,
            mode: this.options.mode,
            context: this.buildLayer().context,
            target: this.target
        };
    };
    OpenLayer.prototype.bestPreflightSelector = function () {
        return this.target;
    };
    OpenLayer.prototype.execute = function (responseDoc, onApplicable) {
        var _this = this;
        if (this.target === ':none') {
            this.content = document.createElement('up-none');
        }
        else {
            this.content = responseDoc.select(this.target);
        }
        if (!this.content || this.baseLayer.isClosed()) {
            throw this.notApplicable();
        }
        onApplicable();
        up.puts('up.render()', "Opening element \"".concat(this.target, "\" in new overlay"));
        this.options.title = this.improveHistoryValue(this.options.title, responseDoc.getTitle());
        if (this.emitOpenEvent().defaultPrevented) {
            throw up.error.aborted('Open event was prevented');
        }
        this.baseLayer.peel();
        this.layer = this.buildLayer();
        up.layer.stack.push(this.layer);
        this.layer.createElements(this.content);
        this.layer.setupHandlers();
        this.handleHistory();
        this.setSource({ newElement: this.content, source: this.options.source });
        responseDoc.finalizeElement(this.content);
        up.hello(this.layer.element, { layer: this.layer, origin: this.origin });
        this.handleLayerChangeRequests();
        this.handleScroll();
        this.layer.startOpenAnimation().then(function () {
            if (_this.layer.isOpen()) {
                _this.handleFocus();
            }
            _this.onFinished();
        });
        this.layer.opening = false;
        this.emitOpenedEvent();
        this.abortWhenLayerClosed();
        return new up.RenderResult({
            layer: this.layer,
            fragments: [this.content]
        });
    };
    OpenLayer.prototype.buildLayer = function () {
        var _this = this;
        var buildOptions = __assign(__assign({}, this.options), { opening: true });
        var beforeNew = function (optionsWithLayerDefaults) {
            return _this.options = up.RenderOptions.finalize(optionsWithLayerDefaults);
        };
        return up.layer.build(buildOptions, beforeNew);
    };
    OpenLayer.prototype.handleHistory = function () {
        if (this.layer.history === 'auto') {
            this.layer.history = up.fragment.hasAutoHistory(this.content);
        }
        this.layer.parent.saveHistory();
        this.layer.updateHistory(this.options);
    };
    OpenLayer.prototype.handleFocus = function () {
        var _a;
        (_a = this.baseLayer.overlayFocus) === null || _a === void 0 ? void 0 : _a.moveToBack();
        this.layer.overlayFocus.moveToFront();
        var fragmentFocus = new up.FragmentFocus({
            fragment: this.content,
            layer: this.layer,
            autoMeans: ['autofocus', 'layer']
        });
        fragmentFocus.process(this.options.focus);
    };
    OpenLayer.prototype.handleScroll = function () {
        var scrollingOptions = __assign(__assign({}, this.options), { fragment: this.content, layer: this.layer, autoMeans: ['hash', 'layer'] });
        var scrolling = new up.FragmentScrolling(scrollingOptions);
        scrolling.process(this.options.scroll);
    };
    OpenLayer.prototype.emitOpenEvent = function () {
        return up.emit('up:layer:open', {
            origin: this.origin,
            baseLayer: this.baseLayer,
            layerOptions: this.options,
            log: "Opening new overlay"
        });
    };
    OpenLayer.prototype.emitOpenedEvent = function () {
        return this.layer.emit('up:layer:opened', {
            origin: this.origin,
            callback: this.layer.callback('onOpened'),
            log: "Opened new ".concat(this.layer)
        });
    };
    return OpenLayer;
}(up.Change.Addition));


/***/ }),
/* 19 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var u = up.util;
var e = up.element;
up.Change.UpdateLayer = (function (_super) {
    __extends(UpdateLayer, _super);
    function UpdateLayer(options) {
        var _this = this;
        options = up.RenderOptions.finalize(options);
        _this = _super.call(this, options) || this;
        _this.layer = options.layer;
        _this.target = options.target;
        _this.placement = options.placement;
        _this.context = options.context;
        _this.parseSteps();
        return _this;
    }
    UpdateLayer.prototype.preflightProps = function () {
        this.matchPreflight();
        return {
            layer: this.layer,
            mode: this.layer.mode,
            context: u.merge(this.layer.context, this.context),
            target: this.bestPreflightSelector(),
        };
    };
    UpdateLayer.prototype.bestPreflightSelector = function () {
        this.matchPreflight();
        return u.map(this.steps, 'selector').join(', ') || ':none';
    };
    UpdateLayer.prototype.execute = function (responseDoc, onApplicable) {
        var _this = this;
        this.responseDoc = responseDoc;
        this.matchPostflight();
        onApplicable();
        up.puts('up.render()', "Updating \"".concat(this.bestPreflightSelector(), "\" in ").concat(this.layer));
        this.options.title = this.improveHistoryValue(this.options.title, this.responseDoc.getTitle());
        this.setScrollAndFocusOptions();
        if (this.options.saveScroll) {
            up.viewport.saveScroll({ layer: this.layer });
        }
        if (this.options.peel) {
            this.layer.peel();
        }
        u.assign(this.layer.context, this.context);
        if (this.options.history === 'auto') {
            this.options.history = this.hasAutoHistory();
        }
        if (this.options.history) {
            this.layer.updateHistory(this.options);
        }
        this.handleLayerChangeRequests();
        var swapPromises = this.steps.map(function (step) { return _this.executeStep(step); });
        Promise.all(swapPromises).then(function () {
            _this.abortWhenLayerClosed();
            return _this.onFinished();
        });
        return new up.RenderResult({
            layer: this.layer,
            fragments: u.map(this.steps, 'newElement')
        });
    };
    UpdateLayer.prototype.executeStep = function (step) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, keepPlan, parent_1, morphOptions, oldWrapper, newWrapper, wrapperStep, wrapper, position;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.setSource(step);
                        _a = step.placement;
                        switch (_a) {
                            case 'swap': return [3, 1];
                            case 'content': return [3, 6];
                            case 'before': return [3, 9];
                            case 'after': return [3, 9];
                        }
                        return [3, 13];
                    case 1:
                        keepPlan = this.findKeepPlan(step);
                        if (!keepPlan) return [3, 3];
                        up.fragment.emitKept(keepPlan);
                        this.handleFocus(step.oldElement, step);
                        return [4, this.handleScroll(step.oldElement, step)];
                    case 2:
                        _b.sent();
                        return [3, 5];
                    case 3:
                        this.transferKeepableElements(step);
                        parent_1 = step.oldElement.parentNode;
                        morphOptions = __assign(__assign({}, step), { beforeStart: function () {
                                up.fragment.markAsDestroying(step.oldElement);
                            }, afterInsert: function () {
                                _this.responseDoc.finalizeElement(step.newElement);
                                step.keepPlans.forEach(_this.reviveKeepable);
                                up.hello(step.newElement, step);
                            }, beforeDetach: function () {
                                up.syntax.clean(step.oldElement, { layer: _this.layer });
                            }, afterDetach: function () {
                                e.remove(step.oldElement);
                                up.fragment.emitDestroyed(step.oldElement, { parent: parent_1, log: false });
                            }, scrollNew: function () {
                                _this.handleFocus(step.newElement, step);
                                return _this.handleScroll(step.newElement, step);
                            } });
                        return [4, up.morph(step.oldElement, step.newElement, step.transition, morphOptions)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3, 14];
                    case 6:
                        oldWrapper = e.wrapChildren(step.oldElement);
                        newWrapper = e.wrapChildren(step.newElement);
                        wrapperStep = __assign(__assign({}, step), { placement: 'swap', oldElement: oldWrapper, newElement: newWrapper, focus: false });
                        return [4, this.executeStep(wrapperStep)];
                    case 7:
                        _b.sent();
                        e.unwrap(newWrapper);
                        return [4, this.handleFocus(step.oldElement, step)];
                    case 8:
                        _b.sent();
                        return [3, 14];
                    case 9:
                        wrapper = e.wrapChildren(step.newElement);
                        position = step.placement === 'before' ? 'afterbegin' : 'beforeend';
                        step.oldElement.insertAdjacentElement(position, wrapper);
                        this.responseDoc.finalizeElement(wrapper);
                        up.hello(wrapper, step);
                        this.handleFocus(wrapper, step);
                        return [4, this.handleScroll(wrapper, step)];
                    case 10:
                        _b.sent();
                        return [4, up.animate(wrapper, step.transition, step)];
                    case 11:
                        _b.sent();
                        return [4, e.unwrap(wrapper)];
                    case 12:
                        _b.sent();
                        return [3, 14];
                    case 13:
                        {
                            up.fail('Unknown placement: %o', step.placement);
                        }
                        _b.label = 14;
                    case 14: return [2];
                }
            });
        });
    };
    UpdateLayer.prototype.findKeepPlan = function (options) {
        if (!options.keep) {
            return;
        }
        var oldElement = options.oldElement, newElement = options.newElement;
        var partnerSelector = e.booleanOrStringAttr(oldElement, 'up-keep');
        if (partnerSelector) {
            if (partnerSelector === true) {
                partnerSelector = '&';
            }
            var lookupOpts = { layer: this.layer, origin: oldElement };
            var partner = void 0;
            if (options.descendantsOnly) {
                partner = up.fragment.get(newElement, partnerSelector, lookupOpts);
            }
            else {
                partner = up.fragment.subtree(newElement, partnerSelector, lookupOpts)[0];
            }
            if (partner && e.matches(partner, '[up-keep]')) {
                var plan = {
                    oldElement: oldElement,
                    newElement: partner,
                    newData: up.syntax.data(partner)
                };
                if (!up.fragment.emitKeep(plan).defaultPrevented) {
                    return plan;
                }
            }
        }
    };
    UpdateLayer.prototype.transferKeepableElements = function (step) {
        var keepPlans = [];
        if (step.keep) {
            for (var _i = 0, _a = step.oldElement.querySelectorAll('[up-keep]'); _i < _a.length; _i++) {
                var keepable = _a[_i];
                var keepPlan = this.findKeepPlan(__assign(__assign({}, step), { oldElement: keepable, descendantsOnly: true }));
                if (keepPlan) {
                    this.hibernateKeepable(keepPlan);
                    var keepableClone = keepable.cloneNode(true);
                    e.replace(keepable, keepableClone);
                    e.replace(keepPlan.newElement, keepable);
                    keepPlans.push(keepPlan);
                }
            }
        }
        step.keepPlans = keepPlans;
    };
    UpdateLayer.prototype.parseSteps = function () {
        this.steps = [];
        for (var _i = 0, _a = u.splitValues(this.target, ','); _i < _a.length; _i++) {
            var simpleTarget = _a[_i];
            if (simpleTarget !== ':none') {
                var expressionParts = simpleTarget.match(/^(.+?)(?::(before|after))?$/);
                if (!expressionParts) {
                    throw up.error.invalidSelector(simpleTarget);
                }
                var step = __assign(__assign({}, this.options), { selector: expressionParts[1], placement: expressionParts[2] || this.placement || 'swap' });
                this.steps.push(step);
            }
        }
    };
    UpdateLayer.prototype.hibernateKeepable = function (keepPlan) {
        var viewports = up.viewport.subtree(keepPlan.oldElement);
        keepPlan.revivers = viewports.map(function (viewport) {
            var scrollTop = viewport.scrollTop, scrollLeft = viewport.scrollLeft;
            return function () { return u.assign(viewport, { scrollTop: scrollTop, scrollLeft: scrollLeft }); };
        });
    };
    UpdateLayer.prototype.reviveKeepable = function (keepPlan) {
        for (var _i = 0, _a = keepPlan.revivers; _i < _a.length; _i++) {
            var reviver = _a[_i];
            reviver();
        }
    };
    UpdateLayer.prototype.matchPreflight = function () {
        if (this.matchedPreflight) {
            return;
        }
        for (var _i = 0, _a = this.steps; _i < _a.length; _i++) {
            var step = _a[_i];
            var finder = new up.FragmentFinder(step);
            step.oldElement || (step.oldElement = finder.find());
            if (!step.oldElement) {
                throw this.notApplicable("Could not find element \"".concat(this.target, "\" in current page"));
            }
        }
        this.resolveOldNesting();
        this.matchedPreflight = true;
    };
    UpdateLayer.prototype.matchPostflight = function () {
        if (this.matchedPostflight) {
            return;
        }
        this.matchPreflight();
        for (var _i = 0, _a = this.steps; _i < _a.length; _i++) {
            var step = _a[_i];
            var newElement = this.responseDoc.select(step.selector);
            if (newElement) {
                step.newElement = newElement;
            }
            else {
                throw this.notApplicable("Could not find element \"".concat(this.target, "\" in server response"));
            }
        }
        if (this.options.hungry) {
            this.addHungrySteps();
        }
        this.resolveOldNesting();
        this.matchedPostflight = true;
    };
    UpdateLayer.prototype.addHungrySteps = function () {
        var hungries = up.fragment.all(up.radio.hungrySelector(), this.options);
        for (var _i = 0, hungries_1 = hungries; _i < hungries_1.length; _i++) {
            var oldElement = hungries_1[_i];
            var selector = up.fragment.toTarget(oldElement);
            var newElement = this.responseDoc.select(selector);
            if (newElement) {
                var transition = e.booleanOrStringAttr(oldElement, 'transition');
                var step = { selector: selector, oldElement: oldElement, newElement: newElement, transition: transition, placement: 'swap' };
                this.steps.push(step);
            }
        }
    };
    UpdateLayer.prototype.containedByRivalStep = function (steps, candidateStep) {
        return u.some(steps, function (rivalStep) {
            return (rivalStep !== candidateStep) &&
                ((rivalStep.placement === 'swap') || (rivalStep.placement === 'content')) &&
                rivalStep.oldElement.contains(candidateStep.oldElement);
        });
    };
    UpdateLayer.prototype.resolveOldNesting = function () {
        var _this = this;
        var compressed = u.uniqBy(this.steps, 'oldElement');
        compressed = u.reject(compressed, function (step) { return _this.containedByRivalStep(compressed, step); });
        this.steps = compressed;
    };
    UpdateLayer.prototype.setScrollAndFocusOptions = function () {
        var _this = this;
        this.steps.forEach(function (step, i) {
            if (i > 0) {
                step.scroll = false;
                step.focus = false;
            }
            if ((step.placement === 'swap') || (step.placement === 'content')) {
                step.scrollBehavior = 'auto';
                _this.focusCapsule || (_this.focusCapsule = up.FocusCapsule.preserveWithin(step.oldElement));
            }
        });
    };
    UpdateLayer.prototype.handleFocus = function (fragment, step) {
        var fragmentFocus = new up.FragmentFocus(__assign(__assign({}, step), { fragment: fragment, layer: this.layer, focusCapsule: this.focusCapsule, autoMeans: up.fragment.config.autoFocus }));
        return fragmentFocus.process(step.focus);
    };
    UpdateLayer.prototype.handleScroll = function (fragment, step) {
        var scrolling = new up.FragmentScrolling(__assign(__assign({}, step), { fragment: fragment, layer: this.layer, autoMeans: up.fragment.config.autoScroll }));
        return scrolling.process(step.scroll);
    };
    UpdateLayer.prototype.hasAutoHistory = function () {
        var oldFragments = u.map(this.steps, 'oldElement');
        return u.some(oldFragments, function (oldFragment) { return up.fragment.hasAutoHistory(oldFragment); });
    };
    return UpdateLayer;
}(up.Change.Addition));


/***/ }),
/* 20 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var u = up.util;
up.Change.CloseLayer = (function (_super) {
    __extends(CloseLayer, _super);
    function CloseLayer(options) {
        var _a;
        var _this = _super.call(this, options) || this;
        _this.verb = options.verb;
        _this.layer = up.layer.get(options);
        _this.origin = options.origin;
        _this.value = options.value;
        _this.preventable = (_a = options.preventable) !== null && _a !== void 0 ? _a : true;
        return _this;
    }
    CloseLayer.prototype.execute = function () {
        var _this = this;
        if (!this.layer.isOpen()) {
            return Promise.resolve();
        }
        up.browser.assertConfirmed(this.options);
        up.network.abort(function (request) { return request.layer === _this.layer; });
        if (this.emitCloseEvent().defaultPrevented && this.preventable) {
            throw up.error.aborted('Close event was prevented');
        }
        var parent = this.layer.parent;
        this.layer.peel();
        this.layer.stack.remove(this.layer);
        parent.restoreHistory();
        this.handleFocus(parent);
        this.layer.teardownHandlers();
        this.layer.destroyElements(this.options);
        this.emitClosedEvent(parent);
    };
    CloseLayer.prototype.emitCloseEvent = function () {
        var event = this.layer.emit(this.buildEvent("up:layer:".concat(this.verb)), {
            callback: this.layer.callback("on".concat(u.upperCaseFirst(this.verb))),
            log: ["Will ".concat(this.verb, " ").concat(this.layer, " with value %o"), this.value]
        });
        this.value = event.value;
        return event;
    };
    CloseLayer.prototype.emitClosedEvent = function (formerParent) {
        var verbPast = "".concat(this.verb, "ed");
        var verbPastUpperCaseFirst = u.upperCaseFirst(verbPast);
        return this.layer.emit(this.buildEvent("up:layer:".concat(verbPast)), {
            baseLayer: formerParent,
            callback: this.layer.callback("on".concat(verbPastUpperCaseFirst)),
            ensureBubbles: true,
            log: ["".concat(verbPastUpperCaseFirst, " ").concat(this.layer, " with value %o"), this.value]
        });
    };
    CloseLayer.prototype.buildEvent = function (name) {
        return up.event.build(name, {
            layer: this.layer,
            value: this.value,
            origin: this.origin
        });
    };
    CloseLayer.prototype.handleFocus = function (formerParent) {
        var _a;
        this.layer.overlayFocus.teardown();
        (_a = formerParent.overlayFocus) === null || _a === void 0 ? void 0 : _a.moveToFront();
        var newFocusElement = this.layer.origin || formerParent.element;
        newFocusElement.focus({ preventScroll: true });
    };
    return CloseLayer;
}(up.Change.Removal));


/***/ }),
/* 21 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var u = up.util;
up.Change.FromContent = (function (_super) {
    __extends(FromContent, _super);
    function FromContent(options) {
        var _this = _super.call(this, options) || this;
        _this.layers = u.filter(up.layer.getAll(_this.options), _this.isRenderableLayer);
        _this.origin = _this.options.origin;
        _this.preview = _this.options.preview;
        _this.mode = _this.options.mode;
        if (_this.origin) {
            _this.originLayer = up.layer.get(_this.origin);
        }
        return _this;
    }
    FromContent.prototype.isRenderableLayer = function (layer) {
        return (layer === 'new') || layer.isOpen();
    };
    FromContent.prototype.getPlans = function () {
        if (!this.plans) {
            this.plans = [];
            if (this.options.fragment) {
                this.options.target = this.getResponseDoc().rootSelector();
            }
            this.expandIntoPlans(this.layers, this.options.target);
            this.expandIntoPlans(this.layers, this.options.fallback);
        }
        return this.plans;
    };
    FromContent.prototype.expandIntoPlans = function (layers, targets) {
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var layer = layers_1[_i];
            for (var _a = 0, _b = this.expandTargets(targets, layer); _a < _b.length; _a++) {
                var target = _b[_a];
                var props = __assign(__assign({}, this.options), { target: target, layer: layer, placement: this.defaultPlacement() });
                var change = layer === 'new' ? new up.Change.OpenLayer(props) : new up.Change.UpdateLayer(props);
                this.plans.push(change);
            }
        }
    };
    FromContent.prototype.expandTargets = function (targets, layer) {
        return up.fragment.expandTargets(targets, { layer: layer, mode: this.mode, origin: this.origin });
    };
    FromContent.prototype.execute = function () {
        if (this.options.preload) {
            return Promise.resolve();
        }
        return this.seekPlan(this.executePlan.bind(this)) || this.postflightTargetNotApplicable();
    };
    FromContent.prototype.executePlan = function (matchedPlan) {
        return matchedPlan.execute(this.getResponseDoc(), this.onPlanApplicable.bind(this, matchedPlan));
    };
    FromContent.prototype.onPlanApplicable = function (plan) {
        var primaryPlan = this.getPlans()[0];
        if (plan !== primaryPlan) {
            up.puts('up.render()', 'Could not match primary target (%s). Updating a fallback target (%s).', primaryPlan.target, plan.target);
        }
    };
    FromContent.prototype.getResponseDoc = function () {
        var _a, _b;
        if (!this.preview && !this.responseDoc) {
            var docOptions = u.pick(this.options, ['target', 'content', 'fragment', 'document', 'html', 'cspNonces']);
            (_b = (_a = up.migrate).handleResponseDocOptions) === null || _b === void 0 ? void 0 : _b.call(_a, docOptions);
            if (this.defaultPlacement() === 'content') {
                docOptions.target = this.firstExpandedTarget(docOptions.target);
            }
            this.responseDoc = new up.ResponseDoc(docOptions);
        }
        return this.responseDoc;
    };
    FromContent.prototype.defaultPlacement = function () {
        if (!this.options.document && !this.options.fragment) {
            return 'content';
        }
    };
    FromContent.prototype.firstExpandedTarget = function (target) {
        return this.expandTargets(target || ':main', this.layers[0])[0];
    };
    FromContent.prototype.preflightProps = function (opts) {
        if (opts === void 0) { opts = {}; }
        var getPlanProps = function (plan) { return plan.preflightProps(); };
        return this.seekPlan(getPlanProps) || opts.optional || this.preflightTargetNotApplicable();
    };
    FromContent.prototype.preflightTargetNotApplicable = function () {
        this.targetNotApplicable('Could not find target in current page');
    };
    FromContent.prototype.postflightTargetNotApplicable = function () {
        this.targetNotApplicable('Could not find common target in current page and response');
    };
    FromContent.prototype.targetNotApplicable = function (reason) {
        if (this.getPlans().length) {
            var planTargets = u.uniq(u.map(this.getPlans(), 'target'));
            var humanizedLayerOption = up.layer.optionToString(this.options.layer);
            up.fail(reason + " (tried selectors %o in %s)", planTargets, humanizedLayerOption);
        }
        else if (this.layers.length) {
            up.fail('No target selector given');
        }
        else {
            up.fail('Layer %o does not exist', this.options.layer);
        }
    };
    FromContent.prototype.seekPlan = function (fn) {
        for (var _i = 0, _a = this.getPlans(); _i < _a.length; _i++) {
            var plan = _a[_i];
            try {
                return fn(plan);
            }
            catch (error) {
                if (!up.error.notApplicable.is(error)) {
                    throw error;
                }
            }
        }
    };
    return FromContent;
}(up.Change));


/***/ }),
/* 22 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var u = up.util;
up.Change.FromURL = (function (_super) {
    __extends(FromURL, _super);
    function FromURL(options) {
        var _this = _super.call(this, options) || this;
        _this.options.layer = up.layer.getAll(_this.options);
        _this.options.normalizeLayerOptions = false;
        _this.successOptions = _this.options;
        _this.failOptions = up.RenderOptions.deriveFailOptions(_this.successOptions);
        return _this;
    }
    FromURL.prototype.execute = function () {
        var _this = this;
        var newPageReason = this.newPageReason();
        if (newPageReason) {
            up.puts('up.render()', newPageReason);
            up.network.loadPage(this.options);
            return u.unresolvablePromise();
        }
        var promise = this.makeRequest();
        if (this.options.preload) {
            return promise;
        }
        return u.always(promise, function (responseOrError) { return _this.onRequestSettled(responseOrError); });
    };
    FromURL.prototype.newPageReason = function () {
        if (u.isCrossOrigin(this.options.url)) {
            return 'Loading cross-origin content in new page';
        }
        if (!up.browser.canPushState()) {
            return 'Loading content in new page to restore history support';
        }
    };
    FromURL.prototype.makeRequest = function () {
        var successAttrs = this.preflightPropsForRenderOptions(this.successOptions);
        var failAttrs = this.preflightPropsForRenderOptions(this.failOptions, { optional: true });
        var requestAttrs = u.merge(this.successOptions, successAttrs, u.renameKeys(failAttrs, up.fragment.failKey));
        this.request = up.request(requestAttrs);
        return this.request;
    };
    FromURL.prototype.preflightPropsForRenderOptions = function (renderOptions, requestAttributesOptions) {
        var preview = new up.Change.FromContent(__assign(__assign({}, renderOptions), { preview: true }));
        return preview.preflightProps(requestAttributesOptions);
    };
    FromURL.prototype.onRequestSettled = function (response) {
        this.response = response;
        if (!(response instanceof up.Response)) {
            throw response;
        }
        else if (this.isSuccessfulResponse()) {
            return this.updateContentFromResponse(['Loaded fragment from successful response to %s', this.request.description], this.successOptions);
        }
        else {
            var log = ['Loaded fragment from failed response to %s (HTTP %d)', this.request.description, this.response.status];
            throw this.updateContentFromResponse(log, this.failOptions);
        }
    };
    FromURL.prototype.isSuccessfulResponse = function () {
        return (this.successOptions.fail === false) || this.response.ok;
    };
    FromURL.prototype.updateContentFromResponse = function (log, renderOptions) {
        this.request.assertEmitted('up:fragment:loaded', {
            callback: this.options.onLoaded,
            response: this.response,
            log: log,
            renderOptions: renderOptions,
        });
        this.augmentOptionsFromResponse(renderOptions);
        return new up.Change.FromContent(renderOptions).execute();
    };
    FromURL.prototype.augmentOptionsFromResponse = function (renderOptions) {
        var responseURL = this.response.url;
        var serverLocation = responseURL;
        var hash = this.request.hash;
        if (hash) {
            renderOptions.hash = hash;
            serverLocation += hash;
        }
        var isReloadable = (this.response.method === 'GET');
        if (isReloadable) {
            renderOptions.source = this.improveHistoryValue(renderOptions.source, responseURL);
        }
        else {
            renderOptions.source = this.improveHistoryValue(renderOptions.source, 'keep');
            renderOptions.history = !!renderOptions.location;
        }
        renderOptions.location = this.improveHistoryValue(renderOptions.location, serverLocation);
        renderOptions.title = this.improveHistoryValue(renderOptions.title, this.response.title);
        renderOptions.eventPlans = this.response.eventPlans;
        var serverTarget = this.response.target;
        if (serverTarget) {
            renderOptions.target = serverTarget;
        }
        renderOptions.document = this.response.text;
        renderOptions.acceptLayer = this.response.acceptLayer;
        renderOptions.dismissLayer = this.response.dismissLayer;
        if (!renderOptions.document && (u.isDefined(renderOptions.acceptLayer) || u.isDefined(renderOptions.dismissLayer))) {
            renderOptions.target = ':none';
        }
        renderOptions.context = u.merge(renderOptions.context, this.response.context);
        renderOptions.cspNonces = this.response.cspNonces;
    };
    return FromURL;
}(up.Change));


/***/ }),
/* 23 */
/***/ (function() {

var u = up.util;
var e = up.element;
up.CompilerPass = (function () {
    function CompilerPass(root, compilers, options) {
        if (options === void 0) { options = {}; }
        this.root = root;
        this.compilers = compilers;
        this.skipSubtrees = options.skip;
        if (!this.skipSubtrees.length || !this.root.querySelector('[up-keep]')) {
            this.skipSubtrees = undefined;
        }
        this.layer = options.layer || up.layer.get(this.root) || up.layer.current;
        this.errors = [];
    }
    CompilerPass.prototype.run = function () {
        var _this = this;
        up.puts('up.hello()', "Compiling fragment %o", this.root);
        this.layer.asCurrent(function () {
            for (var _i = 0, _a = _this.compilers; _i < _a.length; _i++) {
                var compiler = _a[_i];
                _this.runCompiler(compiler);
            }
        });
        if (this.errors.length) {
            throw up.error.failed('Errors while compiling', { errors: this.errors });
        }
    };
    CompilerPass.prototype.runCompiler = function (compiler) {
        var _a, _b;
        var matches = this.select(compiler.selector);
        if (!matches.length) {
            return;
        }
        if (!compiler.isDefault) {
            up.puts('up.hello()', 'Compiling "%s" on %d element(s)', compiler.selector, matches.length);
        }
        if (compiler.batch) {
            this.compileBatch(compiler, matches);
        }
        else {
            for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                var match = matches_1[_i];
                this.compileOneElement(compiler, match);
            }
        }
        return (_b = (_a = up.migrate).postCompile) === null || _b === void 0 ? void 0 : _b.call(_a, matches, compiler);
    };
    CompilerPass.prototype.compileOneElement = function (compiler, element) {
        var elementArg = compiler.jQuery ? up.browser.jQuery(element) : element;
        var compileArgs = [elementArg];
        if (compiler.length !== 1) {
            var data = up.syntax.data(element);
            compileArgs.push(data);
        }
        var result = this.applyCompilerFunction(compiler, element, compileArgs);
        var destructorOrDestructors = this.destructorPresence(result);
        if (destructorOrDestructors) {
            up.destructor(element, destructorOrDestructors);
        }
    };
    CompilerPass.prototype.compileBatch = function (compiler, elements) {
        var elementsArgs = compiler.jQuery ? up.browser.jQuery(elements) : elements;
        var compileArgs = [elementsArgs];
        if (compiler.length !== 1) {
            var dataList = u.map(elements, up.syntax.data);
            compileArgs.push(dataList);
        }
        var result = this.applyCompilerFunction(compiler, elements, compileArgs);
        if (this.destructorPresence(result)) {
            up.fail('Compilers with { batch: true } cannot return destructors');
        }
    };
    CompilerPass.prototype.applyCompilerFunction = function (compiler, elementOrElements, compileArgs) {
        try {
            return compiler.apply(elementOrElements, compileArgs);
        }
        catch (error) {
            this.errors.push(error);
            up.log.error('up.hello()', 'While compiling %o: %o', elementOrElements, error);
            up.error.emitGlobal(error);
        }
    };
    CompilerPass.prototype.destructorPresence = function (result) {
        if (u.isFunction(result) || (u.isArray(result) && (u.every(result, u.isFunction)))) {
            return result;
        }
    };
    CompilerPass.prototype.select = function (selector) {
        var _this = this;
        var matches = e.subtree(this.root, u.evalOption(selector));
        if (this.skipSubtrees) {
            matches = u.reject(matches, function (match) { return _this.isInSkippedSubtree(match); });
        }
        return matches;
    };
    CompilerPass.prototype.isInSkippedSubtree = function (element) {
        var parent;
        if (u.contains(this.skipSubtrees, element)) {
            return true;
        }
        else if ((parent = element.parentElement)) {
            return this.isInSkippedSubtree(parent);
        }
        else {
            return false;
        }
    };
    return CompilerPass;
}());


/***/ }),
/* 24 */
/***/ (function() {

var u = up.util;
var e = up.element;
up.CSSTransition = (function () {
    function CSSTransition(element, lastFrameKebab, options) {
        this.element = element;
        this.lastFrameKebab = lastFrameKebab;
        this.lastFrameKeysKebab = Object.keys(this.lastFrameKebab);
        if (u.some(this.lastFrameKeysKebab, function (key) { return key.match(/A-Z/); })) {
            up.fail('Animation keys must be kebab-case');
        }
        this.finishEvent = options.finishEvent;
        this.duration = options.duration;
        this.easing = options.easing;
        this.finished = false;
    }
    CSSTransition.prototype.start = function () {
        if (this.lastFrameKeysKebab.length === 0) {
            this.finished = true;
            return Promise.resolve();
        }
        this.deferred = u.newDeferred();
        this.pauseOldTransition();
        this.startTime = new Date();
        this.startFallbackTimer();
        this.listenToFinishEvent();
        this.listenToTransitionEnd();
        this.startMotion();
        return this.deferred.promise();
    };
    CSSTransition.prototype.listenToFinishEvent = function () {
        if (this.finishEvent) {
            this.stopListenToFinishEvent = up.on(this.element, this.finishEvent, this.onFinishEvent.bind(this));
        }
    };
    CSSTransition.prototype.onFinishEvent = function (event) {
        event.stopPropagation();
        this.finish();
    };
    CSSTransition.prototype.startFallbackTimer = function () {
        var _this = this;
        var timingTolerance = 100;
        this.fallbackTimer = u.timer((this.duration + timingTolerance), function () {
            _this.finish();
        });
    };
    CSSTransition.prototype.stopFallbackTimer = function () {
        clearTimeout(this.fallbackTimer);
    };
    CSSTransition.prototype.listenToTransitionEnd = function () {
        this.stopListenToTransitionEnd = up.on(this.element, 'transitionend', this.onTransitionEnd.bind(this));
    };
    CSSTransition.prototype.onTransitionEnd = function (event) {
        if (event.target !== this.element) {
            return;
        }
        var elapsed = new Date() - this.startTime;
        if (elapsed <= (0.25 * this.duration)) {
            return;
        }
        var completedPropertyKebab = event.propertyName;
        if (!u.contains(this.lastFrameKeysKebab, completedPropertyKebab)) {
            return;
        }
        this.finish();
    };
    CSSTransition.prototype.finish = function () {
        var _a, _b;
        if (this.finished) {
            return;
        }
        this.finished = true;
        this.stopFallbackTimer();
        (_a = this.stopListenToFinishEvent) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.stopListenToTransitionEnd) === null || _b === void 0 ? void 0 : _b.call(this);
        e.concludeCSSTransition(this.element);
        this.resumeOldTransition();
        this.deferred.resolve();
    };
    CSSTransition.prototype.pauseOldTransition = function () {
        var oldTransition = e.style(this.element, [
            'transitionProperty',
            'transitionDuration',
            'transitionDelay',
            'transitionTimingFunction'
        ]);
        if (e.hasCSSTransition(oldTransition)) {
            if (oldTransition.transitionProperty !== 'all') {
                var oldTransitionProperties = oldTransition.transitionProperty.split(/\s*,\s*/);
                var oldTransitionFrameKebab = e.style(this.element, oldTransitionProperties);
                this.setOldTransitionTargetFrame = e.setTemporaryStyle(this.element, oldTransitionFrameKebab);
            }
            this.setOldTransition = e.concludeCSSTransition(this.element);
        }
    };
    CSSTransition.prototype.resumeOldTransition = function () {
        var _a, _b;
        (_a = this.setOldTransitionTargetFrame) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.setOldTransition) === null || _b === void 0 ? void 0 : _b.call(this);
    };
    CSSTransition.prototype.startMotion = function () {
        e.setStyle(this.element, {
            transitionProperty: Object.keys(this.lastFrameKebab).join(', '),
            transitionDuration: "".concat(this.duration, "ms"),
            transitionTimingFunction: this.easing
        });
        e.setStyle(this.element, this.lastFrameKebab);
    };
    return CSSTransition;
}());


/***/ }),
/* 25 */
/***/ (function() {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var u = up.util;
up.DestructorPass = (function () {
    function DestructorPass(fragment, options) {
        this.fragment = fragment;
        this.options = options;
        this.errors = [];
    }
    DestructorPass.prototype.run = function () {
        for (var _i = 0, _a = this.selectCleanables(); _i < _a.length; _i++) {
            var cleanable = _a[_i];
            var destructors = u.pluckKey(cleanable, 'upDestructors');
            if (destructors) {
                for (var _b = 0, destructors_1 = destructors; _b < destructors_1.length; _b++) {
                    var destructor = destructors_1[_b];
                    this.applyDestructorFunction(destructor, cleanable);
                }
            }
            cleanable.classList.remove('up-can-clean');
        }
        if (this.errors.length) {
            throw up.error.failed('Errors while destroying', { errors: this.errors });
        }
    };
    DestructorPass.prototype.selectCleanables = function () {
        var selectOptions = __assign(__assign({}, this.options), { destroying: true });
        return up.fragment.subtree(this.fragment, '.up-can-clean', selectOptions);
    };
    DestructorPass.prototype.applyDestructorFunction = function (destructor, element) {
        try {
            destructor();
        }
        catch (error) {
            this.errors.push(error);
            up.log.error('up.destroy()', 'While destroying %o: %o', element, error);
            up.error.emitGlobal(error);
        }
    };
    return DestructorPass;
}());


/***/ }),
/* 26 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var u = up.util;
var e = up.element;
up.EventEmitter = (function (_super) {
    __extends(EventEmitter, _super);
    function EventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventEmitter.prototype.keys = function () {
        return [
            'target',
            'event',
            'baseLayer',
            'callback',
            'log',
            'ensureBubbles'
        ];
    };
    EventEmitter.prototype.emit = function () {
        var _this = this;
        this.logEmission();
        if (this.baseLayer) {
            this.baseLayer.asCurrent(function () { return _this.dispatchEvent(); });
        }
        else {
            this.dispatchEvent();
        }
        return this.event;
    };
    EventEmitter.prototype.dispatchEvent = function () {
        var _a;
        this.target.dispatchEvent(this.event);
        if (this.ensureBubbles && e.isDetached(this.target)) {
            document.dispatchEvent(this.event);
        }
        (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, this.event);
    };
    EventEmitter.prototype.assertEmitted = function () {
        var event = this.emit();
        if (event.defaultPrevented) {
            throw up.error.aborted("Event ".concat(event.type, " was prevented"));
        }
    };
    EventEmitter.prototype.logEmission = function () {
        var _a;
        if (!up.log.isEnabled()) {
            return;
        }
        var message = this.log;
        var messageArgs;
        if (u.isArray(message)) {
            _a = message, message = _a[0], messageArgs = _a.slice(1);
        }
        else {
            messageArgs = [];
        }
        var type = this.event.type;
        if (u.isString(message)) {
            up.puts.apply(up, __spreadArray([type, message], messageArgs, false));
        }
        else if (message !== false) {
            up.puts(type, "Event ".concat(type));
        }
    };
    EventEmitter.fromEmitArgs = function (args, defaults) {
        var _a;
        if (defaults === void 0) { defaults = {}; }
        var options = u.extractOptions(args);
        options = u.merge(defaults, options);
        if (u.isElementish(args[0])) {
            options.target = e.get(args.shift());
        }
        else if (args[0] instanceof up.Layer) {
            options.layer = args.shift();
        }
        var layer;
        if (options.layer) {
            layer = up.layer.get(options.layer);
            if (options.target == null) {
                options.target = layer.element;
            }
            if (options.baseLayer == null) {
                options.baseLayer = layer;
            }
        }
        if (options.baseLayer) {
            options.baseLayer = up.layer.get(options.baseLayer);
        }
        if (u.isString(options.target)) {
            options.target = up.fragment.get(options.target, { layer: options.layer });
        }
        else if (!options.target) {
            options.target = document;
        }
        if ((_a = args[0]) === null || _a === void 0 ? void 0 : _a.preventDefault) {
            options.event = args[0];
            if (options.log == null) {
                options.log = args[0].log;
            }
        }
        else if (u.isString(args[0])) {
            options.event = up.event.build(args[0], options);
        }
        else {
            options.event = up.event.build(options);
        }
        return new (this)(options);
    };
    return EventEmitter;
}(up.Record));


/***/ }),
/* 27 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var u = up.util;
var e = up.element;
up.EventListener = (function (_super) {
    __extends(EventListener, _super);
    function EventListener(attributes) {
        var _a;
        var _this = _super.call(this, attributes) || this;
        _this.key = _this.constructor.buildKey(attributes);
        _this.isDefault = up.framework.evaling;
        (_a = _this.beforeBoot) !== null && _a !== void 0 ? _a : (_this.beforeBoot = _this.eventType.indexOf('up:framework:') === 0);
        _this.nativeCallback = _this.nativeCallback.bind(_this);
        return _this;
    }
    EventListener.prototype.keys = function () {
        return [
            'element',
            'eventType',
            'selector',
            'callback',
            'jQuery',
            'guard',
            'baseLayer',
            'passive',
            'once',
            'beforeBoot',
        ];
    };
    EventListener.prototype.bind = function () {
        var _a;
        var _b;
        var map = ((_b = this.element).upEventListeners || (_b.upEventListeners = {}));
        if (map[this.key]) {
            up.fail('up.on(): The %o callback %o cannot be registered more than once', this.eventType, this.callback);
        }
        map[this.key] = this;
        (_a = this.element).addEventListener.apply(_a, this.addListenerArgs());
    };
    EventListener.prototype.addListenerArgs = function () {
        var args = [this.eventType, this.nativeCallback];
        if (this.passive && up.browser.canPassiveEventListener()) {
            args.push({ passive: true });
        }
        return args;
    };
    EventListener.prototype.unbind = function () {
        var _a;
        var map = this.element.upEventListeners;
        if (map) {
            delete map[this.key];
        }
        (_a = this.element).removeEventListener.apply(_a, this.addListenerArgs());
    };
    EventListener.prototype.nativeCallback = function (event) {
        var _a;
        if (up.framework.beforeBoot && !this.beforeBoot) {
            return;
        }
        if (this.once) {
            this.unbind();
        }
        var element = event.target;
        if (this.selector) {
            element = e.closest(element, u.evalOption(this.selector));
        }
        if (this.guard && !this.guard(event)) {
            return;
        }
        if (element) {
            var elementArg = this.jQuery ? up.browser.jQuery(element) : element;
            var args = [event, elementArg];
            var expectedArgCount = this.callback.length;
            if (expectedArgCount !== 1 && expectedArgCount !== 2) {
                var data = up.syntax.data(element);
                args.push(data);
            }
            var applyCallback = (_a = this.callback).bind.apply(_a, __spreadArray([element], args, false));
            if (this.baseLayer) {
                this.baseLayer.asCurrent(applyCallback);
            }
            else {
                applyCallback();
            }
        }
    };
    EventListener.fromElement = function (attributes) {
        var map = attributes.element.upEventListeners;
        if (map) {
            var key = this.buildKey(attributes);
            return map[key];
        }
    };
    EventListener.buildKey = function (attributes) {
        var _a;
        (_a = attributes.callback).upUid || (_a.upUid = u.uid());
        return [
            attributes.eventType,
            attributes.selector,
            attributes.callback.upUid
        ].join('|');
    };
    EventListener.allNonDefault = function (element) {
        var map = element.upEventListeners;
        if (map) {
            var listeners = u.values(map);
            return u.reject(listeners, 'isDefault');
        }
        else {
            return [];
        }
    };
    return EventListener;
}(up.Record));


/***/ }),
/* 28 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var u = up.util;
up.EventListenerGroup = (function (_super) {
    __extends(EventListenerGroup, _super);
    function EventListenerGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventListenerGroup.prototype.keys = function () {
        return [
            'elements',
            'eventTypes',
            'selector',
            'callback',
            'jQuery',
            'guard',
            'baseLayer',
            'passive',
            'once',
            'beforeBoot',
        ];
    };
    EventListenerGroup.prototype.bind = function () {
        var unbindFns = [];
        this.eachListenerAttributes(function (attrs) {
            var listener = new up.EventListener(attrs);
            listener.bind();
            return unbindFns.push(listener.unbind.bind(listener));
        });
        return u.sequence(unbindFns);
    };
    EventListenerGroup.prototype.eachListenerAttributes = function (fn) {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            for (var _b = 0, _c = this.eventTypes; _b < _c.length; _b++) {
                var eventType = _c[_b];
                fn(this.listenerAttributes(element, eventType));
            }
        }
    };
    EventListenerGroup.prototype.listenerAttributes = function (element, eventType) {
        return __assign(__assign({}, this.attributes()), { element: element, eventType: eventType });
    };
    EventListenerGroup.prototype.unbind = function () {
        this.eachListenerAttributes(function (attrs) {
            var listener = up.EventListener.fromElement(attrs);
            if (listener) {
                listener.unbind();
            }
        });
    };
    EventListenerGroup.fromBindArgs = function (args, defaults) {
        args = u.copy(args);
        var callback = args.pop();
        var elements;
        if (args[0].addEventListener) {
            elements = [args.shift()];
        }
        else if (u.isJQuery(args[0]) || (u.isList(args[0]) && args[0][0].addEventListener)) {
            elements = args.shift();
        }
        else {
            elements = [document];
        }
        var eventTypes = u.splitValues(args.shift());
        var fixTypes = up.migrate.fixEventTypes;
        if (fixTypes) {
            eventTypes = fixTypes(eventTypes);
        }
        var options = u.extractOptions(args);
        var selector = args[0];
        var attributes = __assign(__assign({ elements: elements, eventTypes: eventTypes, selector: selector, callback: callback }, options), defaults);
        return new (this)(attributes);
    };
    return EventListenerGroup;
}(up.Record));


/***/ }),
/* 29 */
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var u = up.util;
var e = up.element;
up.FieldObserver = (function () {
    function FieldObserver(fieldOrFields, options, callback) {
        this.scheduleValues = this.scheduleValues.bind(this);
        this.isNewValues = this.isNewValues.bind(this);
        this.callback = callback;
        this.fields = e.list(fieldOrFields);
        this.delay = options.delay;
        this.batch = options.batch;
    }
    FieldObserver.prototype.start = function () {
        var _this = this;
        this.scheduledValues = null;
        this.processedValues = this.readFieldValues();
        this.currentTimer = undefined;
        this.callbackRunning = false;
        this.unbind = up.on(this.fields, 'input change', function () { return _this.check(); });
    };
    FieldObserver.prototype.stop = function () {
        this.unbind();
        this.cancelTimer();
    };
    FieldObserver.prototype.cancelTimer = function () {
        clearTimeout(this.currentTimer);
        this.currentTimer = undefined;
    };
    FieldObserver.prototype.scheduleTimer = function () {
        var _this = this;
        this.cancelTimer();
        this.currentTimer = u.timer(this.delay, function () {
            _this.currentTimer = undefined;
            _this.requestCallback();
        });
    };
    FieldObserver.prototype.scheduleValues = function (values) {
        this.scheduledValues = values;
        this.scheduleTimer();
    };
    FieldObserver.prototype.isNewValues = function (values) {
        return !u.isEqual(values, this.processedValues) && !u.isEqual(this.scheduledValues, values);
    };
    FieldObserver.prototype.requestCallback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var diff, callbackReturnValues, name, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((this.scheduledValues !== null) && !this.currentTimer && !this.callbackRunning)) return [3, 2];
                        diff = this.changedValues(this.processedValues, this.scheduledValues);
                        this.processedValues = this.scheduledValues;
                        this.scheduledValues = null;
                        this.callbackRunning = true;
                        callbackReturnValues = [];
                        if (this.batch) {
                            callbackReturnValues.push(this.callback(diff));
                        }
                        else {
                            for (name in diff) {
                                value = diff[name];
                                callbackReturnValues.push(this.callback(value, name));
                            }
                        }
                        return [4, u.allSettled(callbackReturnValues)];
                    case 1:
                        _a.sent();
                        this.callbackRunning = false;
                        this.requestCallback();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    FieldObserver.prototype.changedValues = function (previous, next) {
        var changes = {};
        var keys = Object.keys(previous);
        keys = keys.concat(Object.keys(next));
        keys = u.uniq(keys);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var previousValue = previous[key];
            var nextValue = next[key];
            if (!u.isEqual(previousValue, nextValue)) {
                changes[key] = nextValue;
            }
        }
        return changes;
    };
    FieldObserver.prototype.readFieldValues = function () {
        return up.Params.fromFields(this.fields).toObject();
    };
    FieldObserver.prototype.check = function () {
        var values = this.readFieldValues();
        if (this.isNewValues(values)) {
            this.scheduleValues(values);
        }
    };
    return FieldObserver;
}());


/***/ }),
/* 30 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var e = up.element;
var PRESERVE_KEYS = ['selectionStart', 'selectionEnd', 'scrollLeft', 'scrollTop'];
function transferProps(from, to) {
    for (var _i = 0, PRESERVE_KEYS_1 = PRESERVE_KEYS; _i < PRESERVE_KEYS_1.length; _i++) {
        var key = PRESERVE_KEYS_1[_i];
        try {
            to[key] = from[key];
        }
        catch (error) {
        }
    }
}
function focusedElementWithin(scopeElement) {
    var focusedElement = document.activeElement;
    if (e.isInSubtree(scopeElement, focusedElement)) {
        return focusedElement;
    }
}
up.FocusCapsule = (function (_super) {
    __extends(FocusCapsule, _super);
    function FocusCapsule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FocusCapsule.prototype.keys = function () {
        return ['selector', 'oldElement'].concat(PRESERVE_KEYS);
    };
    FocusCapsule.prototype.restore = function (scope, options) {
        if (!this.wasLost()) {
            return;
        }
        var rediscoveredElement = e.get(scope, this.selector);
        if (rediscoveredElement) {
            transferProps(this, rediscoveredElement);
            up.focus(rediscoveredElement, options);
            return true;
        }
    };
    FocusCapsule.preserveWithin = function (oldElement) {
        var focusedElement = focusedElementWithin(oldElement);
        if (focusedElement) {
            var plan = { oldElement: oldElement, selector: up.fragment.toTarget(focusedElement) };
            transferProps(focusedElement, plan);
            return new (this)(plan);
        }
    };
    FocusCapsule.prototype.wasLost = function () {
        return !focusedElementWithin(this.oldElement);
    };
    return FocusCapsule;
}(up.Record));


/***/ }),
/* 31 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var u = up.util;
up.FragmentProcessor = (function (_super) {
    __extends(FragmentProcessor, _super);
    function FragmentProcessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FragmentProcessor.prototype.keys = function () {
        return [
            'fragment',
            'autoMeans',
            'origin',
            'layer'
        ];
    };
    FragmentProcessor.prototype.process = function (opt) {
        return this.tryProcess(opt);
    };
    FragmentProcessor.prototype.tryProcess = function (opt) {
        var _this = this;
        if (u.isArray(opt)) {
            return u.find(opt, function (opt) { return _this.tryProcess(opt); });
        }
        if (u.isFunction(opt)) {
            return this.tryProcess(opt(this.fragment, this.attributes()));
        }
        if (u.isElement(opt)) {
            return this.processElement();
        }
        if (u.isString(opt)) {
            if (opt === 'auto') {
                return this.tryProcess(this.autoMeans);
            }
            var match = opt.match(/^(.+?)-if-(.+?)$/);
            if (match) {
                return this.resolveCondition(match[2]) && this.process(match[1]);
            }
        }
        return this.processPrimitive(opt);
    };
    FragmentProcessor.prototype.resolveCondition = function (condition) {
        if (condition === 'main') {
            return up.fragment.contains(this.fragment, ':main');
        }
    };
    FragmentProcessor.prototype.findSelector = function (selector) {
        var lookupOpts = { layer: this.layer, origin: this.origin };
        var match = up.fragment.get(this.fragment, selector, lookupOpts) || up.fragment.get(selector, lookupOpts);
        if (match) {
            return match;
        }
        else {
            up.warn('up.render()', 'Could not find an element matching "%s"', selector);
        }
    };
    return FragmentProcessor;
}(up.Record));


/***/ }),
/* 32 */
/***/ (function() {

var DESCENDANT_SELECTOR = /^([^ >+(]+) (.+)$/;
up.FragmentFinder = (function () {
    function FragmentFinder(options) {
        this.options = options;
        this.origin = this.options.origin;
        this.selector = this.options.selector;
        this.layer = this.options.layer;
    }
    FragmentFinder.prototype.find = function () {
        return this.findAroundOrigin() || this.findInLayer();
    };
    FragmentFinder.prototype.findAroundOrigin = function () {
        if (this.origin && up.fragment.config.matchAroundOrigin && !up.element.isDetached(this.origin)) {
            return this.findClosest() || this.findInVicinity();
        }
    };
    FragmentFinder.prototype.findClosest = function () {
        return up.fragment.closest(this.origin, this.selector, this.options);
    };
    FragmentFinder.prototype.findInVicinity = function () {
        var parts = this.selector.match(DESCENDANT_SELECTOR);
        if (parts) {
            var parent = up.fragment.closest(this.origin, parts[1], this.options);
            if (parent) {
                return up.fragment.getDumb(parent, parts[2]);
            }
        }
    };
    FragmentFinder.prototype.findInLayer = function () {
        return up.fragment.getDumb(this.selector, this.options);
    };
    return FragmentFinder;
}());


/***/ }),
/* 33 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var u = up.util;
var e = up.element;
var PREVENT_SCROLL_OPTIONS = { preventScroll: true };
up.FragmentFocus = (function (_super) {
    __extends(FragmentFocus, _super);
    function FragmentFocus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FragmentFocus.prototype.keys = function () {
        return _super.prototype.keys.call(this).concat([
            'hash',
            'focusCapsule'
        ]);
    };
    FragmentFocus.prototype.processPrimitive = function (opt) {
        switch (opt) {
            case 'keep':
                return this.restoreFocus();
            case 'target':
            case true:
                return this.focusElement(this.fragment);
            case 'layer':
                return this.focusElement(this.layer.getFocusElement());
            case 'main':
                return this.focusSelector(':main');
            case 'hash':
                return this.focusHash();
            case 'autofocus':
                return this.autofocus();
            default:
                if (u.isString(opt)) {
                    return this.focusSelector(opt);
                }
        }
    };
    FragmentFocus.prototype.processElement = function (element) {
        return this.focusElement(element);
    };
    FragmentFocus.prototype.resolveCondition = function (condition) {
        if (condition === 'lost') {
            return this.wasFocusLost();
        }
        else {
            return _super.prototype.resolveCondition.call(this, condition);
        }
    };
    FragmentFocus.prototype.focusSelector = function (selector) {
        var match = this.findSelector(selector);
        if (match) {
            return this.focusElement(match);
        }
    };
    FragmentFocus.prototype.restoreFocus = function () {
        var _a;
        return (_a = this.focusCapsule) === null || _a === void 0 ? void 0 : _a.restore(this.fragment, PREVENT_SCROLL_OPTIONS);
    };
    FragmentFocus.prototype.autofocus = function () {
        var autofocusElement = e.subtree(this.fragment, '[autofocus]')[0];
        if (autofocusElement) {
            up.focus(autofocusElement, PREVENT_SCROLL_OPTIONS);
            return true;
        }
    };
    FragmentFocus.prototype.focusElement = function (element) {
        up.viewport.makeFocusable(element);
        up.focus(element, PREVENT_SCROLL_OPTIONS);
        return true;
    };
    FragmentFocus.prototype.focusHash = function () {
        var hashTarget = up.viewport.firstHashTarget(this.hash, { layer: this.layer });
        if (hashTarget) {
            return this.focusElement(hashTarget);
        }
    };
    FragmentFocus.prototype.wasFocusLost = function () {
        var _a;
        return (_a = this.focusCapsule) === null || _a === void 0 ? void 0 : _a.wasLost();
    };
    return FragmentFocus;
}(up.FragmentProcessor));


/***/ }),
/* 34 */
/***/ (function() {

var e = up.element;
var u = up.util;
up.FragmentPolling = (function () {
    function FragmentPolling(fragment) {
        this.options = {};
        this.state = 'initialized';
        this.setFragment(fragment);
    }
    FragmentPolling.forFragment = function (fragment) {
        return fragment.upPolling || (fragment.upPolling = new this(fragment));
    };
    FragmentPolling.prototype.onPollAttributeObserved = function () {
        this.start();
    };
    FragmentPolling.prototype.onFragmentDestroyed = function () {
        this.stop();
    };
    FragmentPolling.prototype.start = function () {
        if (this.state !== 'started') {
            this.state = 'started';
            this.scheduleReload();
        }
    };
    FragmentPolling.prototype.stop = function () {
        if (this.state === 'started') {
            clearTimeout(this.reloadTimer);
            this.state = 'stopped';
        }
    };
    FragmentPolling.prototype.forceStart = function (options) {
        u.assign(this.options, options);
        this.forceStarted = true;
        this.start();
    };
    FragmentPolling.prototype.forceStop = function () {
        this.stop();
        this.forceStarted = false;
    };
    FragmentPolling.prototype.scheduleReload = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = this.getInterval(); }
        this.reloadTimer = setTimeout(function () { return _this.reload(); }, delay);
    };
    FragmentPolling.prototype.reload = function () {
        var _this = this;
        if (this.state !== 'started') {
            return;
        }
        if (up.radio.shouldPoll(this.fragment)) {
            var reloadOptions = {
                url: this.options.url,
                guardEvent: up.event.build('up:fragment:poll', { log: 'Polling fragment' })
            };
            u.always(up.reload(this.fragment, reloadOptions), function (result) { return _this.onReloaded(result); });
        }
        else {
            up.puts('[up-poll]', 'Polling is disabled');
            var reconsiderDisabledDelay = Math.min(10 * 1000, this.getInterval());
            this.scheduleReload(reconsiderDisabledDelay);
        }
    };
    FragmentPolling.prototype.onReloaded = function (result) {
        var _a;
        var newFragment = (_a = result === null || result === void 0 ? void 0 : result.fragments) === null || _a === void 0 ? void 0 : _a[0];
        if (newFragment) {
            this.onFragmentSwapped(newFragment);
        }
        else {
            this.scheduleReload();
        }
    };
    FragmentPolling.prototype.onFragmentSwapped = function (newFragment) {
        newFragment.upPolling = this;
        delete this.fragment.upPolling;
        this.setFragment(newFragment);
        if (this.state === 'stopped' && this.forceStarted) {
            this.start();
        }
    };
    FragmentPolling.prototype.setFragment = function (newFragment) {
        var _this = this;
        this.fragment = newFragment;
        up.destructor(newFragment, function () { return _this.onFragmentDestroyed(); });
    };
    FragmentPolling.prototype.getInterval = function () {
        var _a, _b;
        return (_b = (_a = this.options.interval) !== null && _a !== void 0 ? _a : e.numberAttr(this.fragment, 'up-interval')) !== null && _b !== void 0 ? _b : up.radio.config.pollInterval;
    };
    return FragmentPolling;
}());


/***/ }),
/* 35 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var u = up.util;
up.FragmentScrolling = (function (_super) {
    __extends(FragmentScrolling, _super);
    function FragmentScrolling(options) {
        var _a, _b;
        var _this = this;
        (_b = (_a = up.migrate).handleScrollOptions) === null || _b === void 0 ? void 0 : _b.call(_a, options);
        _this = _super.call(this, options) || this;
        return _this;
    }
    FragmentScrolling.prototype.keys = function () {
        return _super.prototype.keys.call(this).concat([
            'hash',
            'mode',
            'revealTop',
            'revealMax',
            'revealSnap',
            'scrollBehavior',
            'scrollSpeed'
        ]);
    };
    FragmentScrolling.prototype.process = function (opt) {
        return _super.prototype.process.call(this, opt) || Promise.resolve();
    };
    FragmentScrolling.prototype.processPrimitive = function (opt) {
        switch (opt) {
            case 'reset':
                return this.reset();
            case 'layer':
                return this.revealLayer();
            case 'main':
                return this.revealSelector(':main');
            case 'restore':
                return this.restore();
            case 'hash':
                return this.hash && up.viewport.revealHash(this.hash, this.attributes());
            case 'target':
            case 'reveal':
            case true:
                return this.revealElement(this.fragment);
            default:
                if (u.isString(opt)) {
                    return this.revealSelector(opt);
                }
        }
    };
    FragmentScrolling.prototype.processElement = function (element) {
        return this.revealElement(element);
    };
    FragmentScrolling.prototype.revealElement = function (element) {
        return up.reveal(element, this.attributes());
    };
    FragmentScrolling.prototype.revealSelector = function (selector) {
        var match = this.findSelector(selector);
        if (match) {
            return this.revealElement(match);
        }
    };
    FragmentScrolling.prototype.revealLayer = function () {
        return this.revealElement(this.layer.getBoxElement());
    };
    FragmentScrolling.prototype.reset = function () {
        return up.viewport.resetScroll(__assign(__assign({}, this.attributes()), { around: this.fragment }));
    };
    FragmentScrolling.prototype.restore = function () {
        return up.viewport.restoreScroll(__assign(__assign({}, this.attributes()), { around: this.fragment }));
    };
    return FragmentScrolling;
}(up.FragmentProcessor));


/***/ }),
/* 36 */
/***/ (function() {

var u = up.util;
var e = up.element;
up.HTMLWrapper = (function () {
    function HTMLWrapper(tagName) {
        this.tagName = tagName;
        var openTag = "<".concat(this.tagName, "[^>]*>");
        var closeTag = "</".concat(this.tagName, ">");
        var innerHTML = "(.|\\s)*?";
        this.pattern = new RegExp(openTag + innerHTML + closeTag, 'ig');
        this.attrName = "up-wrapped-".concat(this.tagName);
    }
    HTMLWrapper.prototype.strip = function (html) {
        return html.replace(this.pattern, '');
    };
    HTMLWrapper.prototype.wrap = function (html) {
        return html.replace(this.pattern, this.wrapMatch.bind(this));
    };
    HTMLWrapper.prototype.wrapMatch = function (match) {
        this.didWrap = true;
        return '<meta name="' + this.attrName + '" value="' + u.escapeHTML(match) + '">';
    };
    HTMLWrapper.prototype.unwrap = function (element) {
        if (!this.didWrap) {
            return;
        }
        for (var _i = 0, _a = element.querySelectorAll("meta[name='".concat(this.attrName, "']")); _i < _a.length; _i++) {
            var wrappedChild = _a[_i];
            var originalHTML = wrappedChild.getAttribute('value');
            var restoredElement = e.createFromHTML(originalHTML);
            e.replace(wrappedChild, restoredElement);
        }
    };
    return HTMLWrapper;
}());


/***/ }),
/* 37 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var e = up.element;
var u = up.util;
up.Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        if (!_this.mode) {
            throw "missing { mode } option";
        }
        return _this;
    }
    Layer.prototype.keys = function () {
        return [
            'element',
            'stack',
            'history',
            'mode',
            'context',
            'lastScrollTops'
        ];
    };
    Layer.prototype.defaults = function () {
        return {
            context: {},
            lastScrollTops: new up.Cache({ size: 30, key: up.history.normalizeURL })
        };
    };
    Layer.prototype.setupHandlers = function () {
        up.link.convertClicks(this);
    };
    Layer.prototype.teardownHandlers = function () { };
    Layer.prototype.mainTargets = function () {
        return up.layer.mainTargets(this.mode);
    };
    Layer.prototype.sync = function () {
    };
    Layer.prototype.accept = function () {
        throw up.error.notImplemented();
    };
    Layer.prototype.dismiss = function () {
        throw up.error.notImplemented();
    };
    Layer.prototype.peel = function (options) {
        this.stack.peel(this, options);
    };
    Layer.prototype.evalOption = function (option) {
        return u.evalOption(option, this);
    };
    Layer.prototype.isCurrent = function () {
        return this.stack.isCurrent(this);
    };
    Layer.prototype.isFront = function () {
        return this.stack.isFront(this);
    };
    Layer.prototype.isRoot = function () {
        return this.stack.isRoot(this);
    };
    Layer.prototype.isOverlay = function () {
        return this.stack.isOverlay(this);
    };
    Layer.prototype.isOpen = function () {
        return this.stack.isOpen(this);
    };
    Layer.prototype.isClosed = function () {
        return this.stack.isClosed(this);
    };
    Object.defineProperty(Layer.prototype, "parent", {
        get: function () {
            return this.stack.parentOf(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "child", {
        get: function () {
            return this.stack.childOf(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "ancestors", {
        get: function () {
            return this.stack.ancestorsOf(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "descendants", {
        get: function () {
            return this.stack.descendantsOf(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "index", {
        get: function () {
            return this.stack.indexOf(this);
        },
        enumerable: false,
        configurable: true
    });
    Layer.prototype.getContentElement = function () {
        return this.contentElement || this.element;
    };
    Layer.prototype.getBoxElement = function () {
        return this.boxElement || this.element;
    };
    Layer.prototype.getFocusElement = function () {
        return this.getBoxElement();
    };
    Layer.prototype.getFirstSwappableElement = function () {
        throw up.error.notImplemented();
    };
    Layer.prototype.contains = function (element) {
        return e.closest(element, up.layer.anySelector()) === this.element;
    };
    Layer.prototype.on = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.buildEventListenerGroup(args).bind();
    };
    Layer.prototype.off = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.buildEventListenerGroup(args).unbind();
    };
    Layer.prototype.buildEventListenerGroup = function (args) {
        var _this = this;
        return up.EventListenerGroup.fromBindArgs(args, {
            guard: function (event) { return _this.containsEventTarget(event); },
            elements: [this.element],
            baseLayer: this
        });
    };
    Layer.prototype.containsEventTarget = function (event) {
        return this.contains(event.target);
    };
    Layer.prototype.wasHitByMouseEvent = function (event) {
        var hittableElement = document.elementFromPoint(event.clientX, event.clientY);
        return !hittableElement || this.contains(hittableElement);
    };
    Layer.prototype.buildEventEmitter = function (args) {
        return up.EventEmitter.fromEmitArgs(args, { layer: this });
    };
    Layer.prototype.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.buildEventEmitter(args).emit();
    };
    Layer.prototype.isDetached = function () {
        return e.isDetached(this.element);
    };
    Layer.prototype.saveHistory = function () {
        if (this.isHistoryVisible()) {
            this.savedTitle = document.title;
            this.savedLocation = up.history.location;
        }
    };
    Layer.prototype.restoreHistory = function () {
        if (!this.showsLiveHistory()) {
            return;
        }
        if (this.savedLocation) {
            up.history.push(this.savedLocation);
        }
        if (this.savedTitle) {
            document.title = this.savedTitle;
        }
    };
    Layer.prototype.asCurrent = function (fn) {
        return this.stack.asCurrent(this, fn);
    };
    Layer.prototype.updateHistory = function (options) {
        if (u.isString(options.location)) {
            this.location = options.location;
        }
        if (u.isString(options.title)) {
            this.title = options.title;
        }
    };
    Layer.prototype.isHistoryVisible = function () {
        return this.history && (this.isRoot() || this.parent.isHistoryVisible());
    };
    Layer.prototype.showsLiveHistory = function () {
        return this.isHistoryVisible() && this.isFront() && (up.history.config.enabled || this.isRoot());
    };
    Object.defineProperty(Layer.prototype, "title", {
        get: function () {
            if (this.showsLiveHistory()) {
                return document.title;
            }
            else {
                return this.savedTitle;
            }
        },
        set: function (title) {
            this.savedTitle = title;
            if (this.showsLiveHistory()) {
                document.title = title;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "location", {
        get: function () {
            if (this.showsLiveHistory()) {
                return up.history.location;
            }
            else {
                return this.savedLocation;
            }
        },
        set: function (location) {
            var previousLocation = this.location;
            location = up.history.normalizeURL(location);
            if (previousLocation !== location) {
                this.savedLocation = location;
                this.emit('up:layer:location:changed', { location: location, log: false });
                if (this.showsLiveHistory()) {
                    up.history.push(location);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Layer.prototype.selector = function (part) {
        return this.constructor.selector(part);
    };
    Layer.selector = function (_part) {
        throw up.error.notImplemented();
    };
    Layer.prototype.toString = function () {
        throw up.error.notImplemented();
    };
    Layer.prototype.affix = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return e.affix.apply(e, __spreadArray([this.getFirstSwappableElement()], args, false));
    };
    Layer.prototype[u.isEqual.key] = function (other) {
        return (this.constructor === other.constructor) && (this.element === other.element);
    };
    return Layer;
}(up.Record));


/***/ }),
/* 38 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var e = up.element;
var u = up.util;
up.Layer.Overlay = (function (_super) {
    __extends(Overlay, _super);
    function Overlay(options) {
        var _this = _super.call(this, options) || this;
        if (_this.dismissable === true) {
            _this.dismissable = ['button', 'key', 'outside'];
        }
        else if (_this.dismissable === false) {
            _this.dismissable = [];
        }
        else {
            _this.dismissable = u.splitValues(_this.dismissable);
        }
        if (_this.acceptLocation) {
            _this.acceptLocation = new up.URLPattern(_this.acceptLocation);
        }
        if (_this.dismissLocation) {
            _this.dismissLocation = new up.URLPattern(_this.dismissLocation);
        }
        return _this;
    }
    Overlay.prototype.keys = function () {
        return _super.prototype.keys.call(this).concat([
            'position',
            'align',
            'size',
            'origin',
            'class',
            'backdrop',
            'openAnimation',
            'closeAnimation',
            'openDuration',
            'closeDuration',
            'openEasing',
            'closeEasing',
            'backdropOpenAnimation',
            'backdropCloseAnimation',
            'dismissable',
            'dismissLabel',
            'dismissAriaLabel',
            'onOpened',
            'onAccept',
            'onAccepted',
            'onDismiss',
            'onDismissed',
            'acceptEvent',
            'dismissEvent',
            'acceptLocation',
            'dismissLocation',
            'opening'
        ]);
    };
    Overlay.prototype.callback = function (name) {
        var fn = this[name];
        if (fn) {
            return fn.bind(this);
        }
    };
    Overlay.prototype.createElement = function (parentElement) {
        this.nesting || (this.nesting = this.suggestVisualNesting());
        var elementAttrs = u.compactObject(u.pick(this, ['align', 'position', 'size', 'class', 'nesting']));
        this.element = this.affixPart(parentElement, null, elementAttrs);
    };
    Overlay.prototype.createBackdropElement = function (parentElement) {
        this.backdropElement = this.affixPart(parentElement, 'backdrop');
    };
    Overlay.prototype.createViewportElement = function (parentElement) {
        this.viewportElement = this.affixPart(parentElement, 'viewport', { 'up-viewport': '' });
    };
    Overlay.prototype.createBoxElement = function (parentElement) {
        this.boxElement = this.affixPart(parentElement, 'box');
    };
    Overlay.prototype.createContentElement = function (parentElement, content) {
        this.contentElement = this.affixPart(parentElement, 'content');
        this.contentElement.appendChild(content);
    };
    Overlay.prototype.createDismissElement = function (parentElement) {
        this.dismissElement = this.affixPart(parentElement, 'dismiss', {
            'up-dismiss': '":button"',
            'aria-label': this.dismissAriaLabel
        });
        return e.affix(this.dismissElement, 'span[aria-hidden="true"]', { text: this.dismissLabel });
    };
    Overlay.prototype.affixPart = function (parentElement, part, options) {
        if (options === void 0) { options = {}; }
        return e.affix(parentElement, this.selector(part), options);
    };
    Overlay.selector = function (part) {
        return u.compact(['up', this.mode, part]).join('-');
    };
    Overlay.prototype.suggestVisualNesting = function () {
        var parent = this.parent;
        if (this.mode === parent.mode) {
            return 1 + parent.suggestVisualNesting();
        }
        else {
            return 0;
        }
    };
    Overlay.prototype.setupHandlers = function () {
        var _this = this;
        var _a, _b;
        _super.prototype.setupHandlers.call(this);
        this.overlayFocus = new up.OverlayFocus(this);
        if (this.supportsDismissMethod('button')) {
            this.createDismissElement(this.getBoxElement());
        }
        if (this.supportsDismissMethod('outside')) {
            if (this.viewportElement) {
                up.on(this.viewportElement, 'up:click', function (event) {
                    if (event.target === _this.viewportElement) {
                        _this.onOutsideClicked(event, true);
                    }
                });
            }
            else {
                this.unbindParentClicked = this.parent.on('up:click', function (event, element) {
                    var originClicked = _this.origin && _this.origin.contains(element);
                    _this.onOutsideClicked(event, originClicked);
                });
            }
        }
        if (this.supportsDismissMethod('key')) {
            this.unbindEscapePressed = up.event.onEscape(function (event) { return _this.onEscapePressed(event); });
        }
        this.registerClickCloser('up-accept', function (value, closeOptions) {
            _this.accept(value, closeOptions);
        });
        this.registerClickCloser('up-dismiss', function (value, closeOptions) {
            _this.dismiss(value, closeOptions);
        });
        (_b = (_a = up.migrate).registerLayerCloser) === null || _b === void 0 ? void 0 : _b.call(_a, this);
        this.registerEventCloser(this.acceptEvent, this.accept);
        this.registerEventCloser(this.dismissEvent, this.dismiss);
    };
    Overlay.prototype.onOutsideClicked = function (event, halt) {
        if (halt) {
            up.event.halt(event);
        }
        this.dismiss(':outside', { origin: event.target });
    };
    Overlay.prototype.onEscapePressed = function (event) {
        if (this.isFront()) {
            var field = up.form.focusedField();
            if (field) {
                field.blur();
            }
            else if (this.supportsDismissMethod('key')) {
                up.event.halt(event);
                this.dismiss(':key');
            }
        }
    };
    Overlay.prototype.registerClickCloser = function (attribute, closeFn) {
        var selector = "[".concat(attribute, "]");
        this.on('up:click', selector, function (event) {
            up.event.halt(event);
            var origin = e.closest(event.target, selector);
            var value = e.jsonAttr(origin, attribute);
            var closeOptions = { origin: origin };
            var parser = new up.OptionsParser(closeOptions, origin);
            parser.booleanOrString('animation');
            parser.string('easing');
            parser.number('duration');
            parser.string('confirm');
            closeFn(value, closeOptions);
        });
    };
    Overlay.prototype.registerEventCloser = function (eventTypes, closeFn) {
        var _this = this;
        if (!eventTypes) {
            return;
        }
        return this.on(eventTypes, function (event) {
            event.preventDefault();
            closeFn.call(_this, event);
        });
    };
    Overlay.prototype.tryAcceptForLocation = function () {
        this.tryCloseForLocation(this.acceptLocation, this.accept);
    };
    Overlay.prototype.tryDismissForLocation = function () {
        this.tryCloseForLocation(this.dismissLocation, this.dismiss);
    };
    Overlay.prototype.tryCloseForLocation = function (urlPattern, closeFn) {
        var location, resolution;
        if (urlPattern && (location = this.location) && (resolution = urlPattern.recognize(location))) {
            var closeValue = __assign(__assign({}, resolution), { location: location });
            closeFn.call(this, closeValue);
        }
    };
    Overlay.prototype.teardownHandlers = function () {
        var _a, _b;
        _super.prototype.teardownHandlers.call(this);
        (_a = this.unbindParentClicked) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.unbindEscapePressed) === null || _b === void 0 ? void 0 : _b.call(this);
        this.overlayFocus.teardown();
    };
    Overlay.prototype.destroyElements = function (options) {
        var _this = this;
        var animation = function () {
            return _this.startCloseAnimation(options);
        };
        var onFinished = function () {
            var _a;
            _this.onElementsRemoved();
            (_a = options.onFinished) === null || _a === void 0 ? void 0 : _a.call(options);
        };
        var destroyOptions = __assign(__assign({}, options), { animation: animation, onFinished: onFinished, log: false });
        up.destroy(this.element, destroyOptions);
    };
    Overlay.prototype.onElementsRemoved = function () { };
    Overlay.prototype.startAnimation = function (options) {
        if (options === void 0) { options = {}; }
        var boxDone = up.animate(this.getBoxElement(), options.boxAnimation, options);
        var backdropDone;
        if (this.backdrop && !up.motion.isNone(options.boxAnimation)) {
            backdropDone = up.animate(this.backdropElement, options.backdropAnimation, options);
        }
        return Promise.all([boxDone, backdropDone]);
    };
    Overlay.prototype.startOpenAnimation = function (options) {
        var _this = this;
        var _a;
        if (options === void 0) { options = {}; }
        return this.startAnimation({
            boxAnimation: (_a = options.animation) !== null && _a !== void 0 ? _a : this.evalOption(this.openAnimation),
            backdropAnimation: 'fade-in',
            easing: options.easing || this.openEasing,
            duration: options.duration || this.openDuration
        }).then(function () {
            return _this.wasEverVisible = true;
        });
    };
    Overlay.prototype.startCloseAnimation = function (options) {
        var _a;
        if (options === void 0) { options = {}; }
        var boxAnimation = this.wasEverVisible && ((_a = options.animation) !== null && _a !== void 0 ? _a : this.evalOption(this.closeAnimation));
        return this.startAnimation({
            boxAnimation: boxAnimation,
            backdropAnimation: 'fade-out',
            easing: options.easing || this.closeEasing,
            duration: options.duration || this.closeDuration
        });
    };
    Overlay.prototype.accept = function (value, options) {
        if (value === void 0) { value = null; }
        if (options === void 0) { options = {}; }
        return this.executeCloseChange('accept', value, options);
    };
    Overlay.prototype.dismiss = function (value, options) {
        if (value === void 0) { value = null; }
        if (options === void 0) { options = {}; }
        return this.executeCloseChange('dismiss', value, options);
    };
    Overlay.prototype.supportsDismissMethod = function (method) {
        return u.contains(this.dismissable, method);
    };
    Overlay.prototype.executeCloseChange = function (verb, value, options) {
        options = __assign(__assign({}, options), { verb: verb, value: value, layer: this });
        return new up.Change.CloseLayer(options).execute();
    };
    Overlay.prototype.getFirstSwappableElement = function () {
        return this.getContentElement().children[0];
    };
    Overlay.prototype.toString = function () {
        return "".concat(this.mode, " overlay");
    };
    return Overlay;
}(up.Layer));


/***/ }),
/* 39 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
up.Layer.OverlayWithTether = (function (_super) {
    __extends(OverlayWithTether, _super);
    function OverlayWithTether() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OverlayWithTether.prototype.createElements = function (content) {
        if (!this.origin) {
            up.fail('Missing { origin } option');
        }
        this.tether = new up.Tether({
            anchor: this.origin,
            align: this.align,
            position: this.position
        });
        this.createElement(this.tether.parent);
        this.createContentElement(this.element, content);
        this.tether.start(this.element);
    };
    OverlayWithTether.prototype.onElementsRemoved = function () {
        this.tether.stop();
    };
    OverlayWithTether.prototype.sync = function () {
        if (this.isOpen()) {
            if (this.isDetached() || this.tether.isDetached()) {
                this.dismiss(':detached', {
                    animation: false,
                    preventable: false
                });
            }
            else {
                this.tether.sync();
            }
        }
    };
    return OverlayWithTether;
}(up.Layer.Overlay));


/***/ }),
/* 40 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
up.Layer.OverlayWithViewport = (_a = (function (_super) {
        __extends(OverlayWithViewport, _super);
        function OverlayWithViewport() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OverlayWithViewport.getParentElement = function () {
            return document.body;
        };
        OverlayWithViewport.prototype.createElements = function (content) {
            this.shiftBody();
            this.createElement(this.constructor.getParentElement());
            if (this.backdrop) {
                this.createBackdropElement(this.element);
            }
            this.createViewportElement(this.element);
            this.createBoxElement(this.viewportElement);
            this.createContentElement(this.boxElement, content);
        };
        OverlayWithViewport.prototype.onElementsRemoved = function () {
            this.unshiftBody();
        };
        OverlayWithViewport.prototype.shiftBody = function () {
            this.constructor.bodyShifter.shift();
        };
        OverlayWithViewport.prototype.unshiftBody = function () {
            this.constructor.bodyShifter.unshift();
        };
        OverlayWithViewport.prototype.sync = function () {
            if (this.isDetached() && this.isOpen()) {
                this.constructor.getParentElement().appendChild(this.element);
            }
        };
        return OverlayWithViewport;
    }(up.Layer.Overlay)),
    _a.bodyShifter = new up.BodyShifter(),
    _a);


/***/ }),
/* 41 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
var u = up.util;
var e = up.element;
up.Layer.Root = (_a = (function (_super) {
        __extends(Root, _super);
        function Root(options) {
            var _this = _super.call(this, options) || this;
            _this.setupHandlers();
            return _this;
        }
        Object.defineProperty(Root.prototype, "element", {
            get: function () {
                return e.root;
            },
            enumerable: false,
            configurable: true
        });
        Root.prototype.getFirstSwappableElement = function () {
            return document.body;
        };
        Root.selector = function () {
            return 'html';
        };
        Root.prototype.setupHandlers = function () {
            if (!this.element.upHandlersApplied) {
                this.element.upHandlersApplied = true;
                _super.prototype.setupHandlers.call(this);
            }
        };
        Root.prototype.sync = function () {
            this.setupHandlers();
        };
        Root.prototype.accept = function () {
            this.cannotCloseRoot();
        };
        Root.prototype.dismiss = function () {
            this.cannotCloseRoot();
        };
        Root.prototype.cannotCloseRoot = function () {
            throw up.error.failed('Cannot close the root layer');
        };
        Root.prototype.reset = function () {
            u.assign(this, this.defaults());
        };
        Root.prototype.toString = function () {
            return "root layer";
        };
        return Root;
    }(up.Layer)),
    _a.mode = 'root',
    _a);


/***/ }),
/* 42 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
up.Layer.Modal = (_a = (function (_super) {
        __extends(Modal, _super);
        function Modal() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Modal;
    }(up.Layer.OverlayWithViewport)),
    _a.mode = 'modal',
    _a);


/***/ }),
/* 43 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
up.Layer.Popup = (_a = (function (_super) {
        __extends(Popup, _super);
        function Popup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Popup;
    }(up.Layer.OverlayWithTether)),
    _a.mode = 'popup',
    _a);


/***/ }),
/* 44 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
up.Layer.Drawer = (_a = (function (_super) {
        __extends(Drawer, _super);
        function Drawer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Drawer;
    }(up.Layer.OverlayWithViewport)),
    _a.mode = 'drawer',
    _a);


/***/ }),
/* 45 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
up.Layer.Cover = (_a = (function (_super) {
        __extends(Cover, _super);
        function Cover() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Cover;
    }(up.Layer.OverlayWithViewport)),
    _a.mode = 'cover',
    _a);


/***/ }),
/* 46 */
/***/ (function() {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var u = up.util;
var e = up.element;
up.LayerLookup = (function () {
    function LayerLookup(stack) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.stack = stack;
        var options = u.parseArgIntoOptions(args, 'layer');
        if (options.normalizeLayerOptions !== false) {
            up.layer.normalizeOptions(options);
        }
        this.values = u.splitValues(options.layer);
        this.origin = options.origin;
        this.baseLayer = options.baseLayer || this.originLayer() || this.stack.current;
        if (u.isString(this.baseLayer)) {
            var recursiveOptions = __assign(__assign({}, options), { baseLayer: this.stack.current, normalizeLayerOptions: false });
            this.baseLayer = new this.constructor(this.stack, this.baseLayer, recursiveOptions).first();
        }
    }
    LayerLookup.prototype.originLayer = function () {
        if (this.origin) {
            return this.forElement(this.origin);
        }
    };
    LayerLookup.prototype.first = function () {
        return this.all()[0];
    };
    LayerLookup.prototype.all = function () {
        var _this = this;
        var results = u.flatMap(this.values, function (value) { return _this.resolveValue(value); });
        results = u.compact(results);
        results = u.uniq(results);
        return results;
    };
    LayerLookup.prototype.forElement = function (element) {
        element = e.get(element);
        return u.find(this.stack.reversed(), function (layer) { return layer.contains(element); });
    };
    LayerLookup.prototype.forIndex = function (value) {
        return this.stack[value];
    };
    LayerLookup.prototype.resolveValue = function (value) {
        if (value instanceof up.Layer) {
            return value;
        }
        if (u.isNumber(value)) {
            return this.forIndex(value);
        }
        if (/^\d+$/.test(value)) {
            return this.forIndex(Number(value));
        }
        if (u.isElementish(value)) {
            return this.forElement(value);
        }
        switch (value) {
            case 'any':
                return __spreadArray([this.baseLayer], this.stack.reversed(), true);
            case 'current':
                return this.baseLayer;
            case 'closest':
                return this.stack.selfAndAncestorsOf(this.baseLayer);
            case 'parent':
                return this.baseLayer.parent;
            case 'ancestor':
            case 'ancestors':
                return this.baseLayer.ancestors;
            case 'child':
                return this.baseLayer.child;
            case 'descendant':
            case 'descendants':
                return this.baseLayer.descendants;
            case 'new':
                return 'new';
            case 'root':
                return this.stack.root;
            case 'overlay':
            case 'overlays':
                return u.reverse(this.stack.overlays);
            case 'front':
                return this.stack.front;
            case 'origin':
                return this.originLayer();
            default:
                return up.fail("Unknown { layer } option: %o", value);
        }
    };
    return LayerLookup;
}());


/***/ }),
/* 47 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var u = up.util;
up.LayerStack = (function (_super) {
    __extends(LayerStack, _super);
    function LayerStack() {
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, up.LayerStack.prototype);
        _this.currentOverrides = [];
        _this.push(_this.buildRoot());
        return _this;
    }
    LayerStack.prototype.buildRoot = function () {
        return up.layer.build({ mode: 'root', stack: this });
    };
    LayerStack.prototype.remove = function (layer) {
        u.remove(this, layer);
    };
    LayerStack.prototype.peel = function (layer, options) {
        var descendants = u.reverse(layer.descendants);
        var dismissOptions = __assign(__assign({}, options), { preventable: false });
        for (var _i = 0, descendants_1 = descendants; _i < descendants_1.length; _i++) {
            var descendant = descendants_1[_i];
            descendant.dismiss(':peel', dismissOptions);
        }
    };
    LayerStack.prototype.reset = function () {
        this.peel(this.root, { animation: false });
        this.currentOverrides = [];
        this.root.reset();
    };
    LayerStack.prototype.isOpen = function (layer) {
        return layer.index >= 0;
    };
    LayerStack.prototype.isClosed = function (layer) {
        return !this.isOpen(layer);
    };
    LayerStack.prototype.parentOf = function (layer) {
        return this[layer.index - 1];
    };
    LayerStack.prototype.childOf = function (layer) {
        return this[layer.index + 1];
    };
    LayerStack.prototype.ancestorsOf = function (layer) {
        return u.reverse(this.slice(0, layer.index));
    };
    LayerStack.prototype.selfAndAncestorsOf = function (layer) {
        return __spreadArray([layer], layer.ancestors, true);
    };
    LayerStack.prototype.descendantsOf = function (layer) {
        return this.slice(layer.index + 1);
    };
    LayerStack.prototype.isRoot = function (layer) {
        return this[0] === layer;
    };
    LayerStack.prototype.isOverlay = function (layer) {
        return !this.isRoot(layer);
    };
    LayerStack.prototype.isCurrent = function (layer) {
        return this.current === layer;
    };
    LayerStack.prototype.isFront = function (layer) {
        return this.front === layer;
    };
    LayerStack.prototype.get = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.getAll.apply(this, args)[0];
    };
    LayerStack.prototype.getAll = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new ((_a = up.LayerLookup).bind.apply(_a, __spreadArray([void 0, this], args, false)))().all();
    };
    LayerStack.prototype.sync = function () {
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var layer = _a[_i];
            layer.sync();
        }
    };
    LayerStack.prototype.asCurrent = function (layer, fn) {
        try {
            this.currentOverrides.push(layer);
            return fn();
        }
        finally {
            this.currentOverrides.pop();
        }
    };
    LayerStack.prototype.reversed = function () {
        return u.reverse(this);
    };
    LayerStack.prototype.dismissOverlays = function (value, options) {
        if (value === void 0) { value = null; }
        if (options === void 0) { options = {}; }
        options.dismissable = false;
        for (var _i = 0, _a = u.reverse(this.overlays); _i < _a.length; _i++) {
            var overlay = _a[_i];
            overlay.dismiss(value, options);
        }
    };
    LayerStack.prototype[u.copy.key] = function () {
        return u.copyArrayLike(this);
    };
    Object.defineProperty(LayerStack.prototype, "count", {
        get: function () {
            return this.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayerStack.prototype, "root", {
        get: function () {
            return this[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayerStack.prototype, "overlays", {
        get: function () {
            return this.root.descendants;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayerStack.prototype, "current", {
        get: function () {
            return u.last(this.currentOverrides) || this.front;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayerStack.prototype, "front", {
        get: function () {
            return u.last(this);
        },
        enumerable: false,
        configurable: true
    });
    return LayerStack;
}(Array));


/***/ }),
/* 48 */
/***/ (function() {

up.LinkFeedbackURLs = (function () {
    function LinkFeedbackURLs(link) {
        var normalize = up.feedback.normalizeURL;
        this.isSafe = up.link.isSafe(link);
        if (this.isSafe) {
            var href = link.getAttribute('href');
            if (href && (href !== '#')) {
                this.href = normalize(href);
            }
            var upHREF = link.getAttribute('up-href');
            if (upHREF) {
                this.upHREF = normalize(upHREF);
            }
            var alias = link.getAttribute('up-alias');
            if (alias) {
                this.aliasPattern = new up.URLPattern(alias, normalize);
            }
        }
    }
    LinkFeedbackURLs.prototype.isCurrent = function (normalizedLocation) {
        return this.isSafe && !!((this.href && (this.href === normalizedLocation)) ||
            (this.upHREF && (this.upHREF === normalizedLocation)) ||
            (this.aliasPattern && this.aliasPattern.test(normalizedLocation, false)));
    };
    return LinkFeedbackURLs;
}());


/***/ }),
/* 49 */
/***/ (function() {

var u = up.util;
var e = up.element;
up.LinkPreloader = (function () {
    function LinkPreloader() {
        this.considerPreload = this.considerPreload.bind(this);
    }
    LinkPreloader.prototype.observeLink = function (link) {
        var _this = this;
        if (up.link.isSafe(link)) {
            this.on(link, 'mouseenter', function (event) { return _this.considerPreload(event, true); });
            this.on(link, 'mousedown touchstart', function (event) { return _this.considerPreload(event); });
            this.on(link, 'mouseleave', function (event) { return _this.stopPreload(event); });
        }
    };
    LinkPreloader.prototype.on = function (link, eventTypes, callback) {
        up.on(link, eventTypes, { passive: true }, callback);
    };
    LinkPreloader.prototype.considerPreload = function (event, applyDelay) {
        var link = event.target;
        if (link !== this.currentLink) {
            this.reset();
            this.currentLink = link;
            if (up.link.shouldFollowEvent(event, link)) {
                if (applyDelay) {
                    this.preloadAfterDelay(link);
                }
                else {
                    this.preloadNow(link);
                }
            }
        }
    };
    LinkPreloader.prototype.stopPreload = function (event) {
        if (event.target === this.currentLink) {
            return this.reset();
        }
    };
    LinkPreloader.prototype.reset = function () {
        var _a;
        if (!this.currentLink) {
            return;
        }
        clearTimeout(this.timer);
        if ((_a = this.currentRequest) === null || _a === void 0 ? void 0 : _a.preload) {
            this.currentRequest.abort();
        }
        this.currentLink = undefined;
        this.currentRequest = undefined;
    };
    LinkPreloader.prototype.preloadAfterDelay = function (link) {
        var _this = this;
        var _a;
        var delay = (_a = e.numberAttr(link, 'up-delay')) !== null && _a !== void 0 ? _a : up.link.config.preloadDelay;
        this.timer = u.timer(delay, function () { return _this.preloadNow(link); });
    };
    LinkPreloader.prototype.preloadNow = function (link) {
        var _this = this;
        if (e.isDetached(link)) {
            this.reset();
            return;
        }
        var onQueued = function (request) { return _this.currentRequest = request; };
        up.log.muteUncriticalRejection(up.link.preload(link, { onQueued: onQueued }));
        this.queued = true;
    };
    return LinkPreloader;
}());


/***/ }),
/* 50 */
/***/ (function() {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var u = up.util;
var e = up.element;
up.MotionController = (function () {
    function MotionController(name) {
        this.activeClass = "up-".concat(name);
        this.dataKey = "up-".concat(name, "-finished");
        this.selector = ".".concat(this.activeClass);
        this.finishEvent = "up:".concat(name, ":finish");
        this.finishCount = 0;
        this.clusterCount = 0;
    }
    MotionController.prototype.startFunction = function (cluster, startMotion, memory) {
        var _a;
        if (memory === void 0) { memory = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var mutedAnimator, promise;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cluster = e.list(cluster);
                        mutedAnimator = function () { return up.log.muteUncriticalRejection(startMotion()); };
                        memory.trackMotion = (_a = memory.trackMotion) !== null && _a !== void 0 ? _a : up.motion.isEnabled();
                        if (!(memory.trackMotion === false)) return [3, 2];
                        return [4, u.microtask(mutedAnimator)];
                    case 1:
                        _b.sent();
                        return [3, 5];
                    case 2:
                        memory.trackMotion = false;
                        return [4, this.finish(cluster)];
                    case 3:
                        _b.sent();
                        promise = this.whileForwardingFinishEvent(cluster, mutedAnimator);
                        this.markCluster(cluster, promise);
                        promise = promise.then(function () { return _this.unmarkCluster(cluster); });
                        return [4, promise];
                    case 4: return [2, _b.sent()];
                    case 5: return [2];
                }
            });
        });
    };
    MotionController.prototype.startMotion = function (cluster, motion, memory) {
        if (memory === void 0) { memory = {}; }
        var start = function () { return motion.start(); };
        var finish = function () { return motion.finish(); };
        var unbindFinish = up.on(cluster, this.finishEvent, finish);
        var promise = this.startFunction(cluster, start, memory);
        promise = promise.then(unbindFinish);
        return promise;
    };
    MotionController.prototype.finish = function (elements) {
        this.finishCount++;
        if ((this.clusterCount === 0) || !up.motion.isEnabled()) {
            return Promise.resolve();
        }
        elements = this.expandFinishRequest(elements);
        var allFinished = u.map(elements, this.finishOneElement.bind(this));
        return Promise.all(allFinished);
    };
    MotionController.prototype.expandFinishRequest = function (elements) {
        var _this = this;
        if (elements) {
            return u.flatMap(elements, function (el) { return e.list(e.closest(el, _this.selector), e.all(el, _this.selector)); });
        }
        else {
            return e.all(this.selector);
        }
    };
    MotionController.prototype.isActive = function (element) {
        return element.classList.contains(this.activeClass);
    };
    MotionController.prototype.finishOneElement = function (element) {
        this.emitFinishEvent(element);
        return this.whenElementFinished(element);
    };
    MotionController.prototype.emitFinishEvent = function (element, eventAttrs) {
        if (eventAttrs === void 0) { eventAttrs = {}; }
        eventAttrs = __assign({ target: element, log: false }, eventAttrs);
        return up.emit(this.finishEvent, eventAttrs);
    };
    MotionController.prototype.whenElementFinished = function (element) {
        return element[this.dataKey] || Promise.resolve();
    };
    MotionController.prototype.markCluster = function (cluster, promise) {
        this.clusterCount++;
        for (var _i = 0, cluster_1 = cluster; _i < cluster_1.length; _i++) {
            var element = cluster_1[_i];
            element.classList.add(this.activeClass);
            element[this.dataKey] = promise;
        }
    };
    MotionController.prototype.unmarkCluster = function (cluster) {
        this.clusterCount--;
        for (var _i = 0, cluster_2 = cluster; _i < cluster_2.length; _i++) {
            var element = cluster_2[_i];
            element.classList.remove(this.activeClass);
            delete element[this.dataKey];
        }
    };
    MotionController.prototype.whileForwardingFinishEvent = function (cluster, fn) {
        var _this = this;
        if (cluster.length < 2) {
            return fn();
        }
        var doForward = function (event) {
            if (!event.forwarded) {
                for (var _i = 0, cluster_3 = cluster; _i < cluster_3.length; _i++) {
                    var element = cluster_3[_i];
                    if (element !== event.target && _this.isActive(element)) {
                        _this.emitFinishEvent(element, { forwarded: true });
                    }
                }
            }
        };
        var unbindFinish = up.on(cluster, this.finishEvent, doForward);
        return fn().then(unbindFinish);
    };
    MotionController.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.finish()];
                    case 1:
                        _a.sent();
                        this.finishCount = 0;
                        this.clusterCount = 0;
                        return [2];
                }
            });
        });
    };
    return MotionController;
}());


/***/ }),
/* 51 */
/***/ (function() {

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var u = up.util;
var e = up.element;
up.NonceableCallback = (function () {
    function NonceableCallback(script, nonce) {
        this.script = script;
        this.nonce = nonce;
    }
    NonceableCallback.fromString = function (string) {
        var match = string.match(/^(nonce-([^\s]+)\s)?(.*)$/);
        return new this(match[3], match[2]);
    };
    NonceableCallback.prototype.toFunction = function () {
        var argNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            argNames[_i] = arguments[_i];
        }
        if (up.browser.canEval()) {
            return new (Function.bind.apply(Function, __spreadArray(__spreadArray([void 0], argNames, false), [this.script], false)))();
        }
        else if (this.nonce) {
            var callbackThis_1 = this;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return callbackThis_1.runAsNoncedFunction(this, argNames, args);
            };
        }
        else {
            return this.cannotRun.bind(this);
        }
    };
    NonceableCallback.prototype.toString = function () {
        return "nonce-".concat(this.nonce, " ").concat(this.script);
    };
    NonceableCallback.prototype.cannotRun = function () {
        throw new Error("Your Content Security Policy disallows inline JavaScript (".concat(this.script, "). See https://unpoly.com/csp for solutions."));
    };
    NonceableCallback.prototype.runAsNoncedFunction = function (thisArg, argNames, args) {
        var wrappedScript = "\n      try {\n        up.noncedEval.value = (function(".concat(argNames.join(','), ") {\n          ").concat(this.script, "\n        }).apply(up.noncedEval.thisArg, up.noncedEval.args)\n      } catch (error) {\n        up.noncedEval.error = error\n      }\n    ");
        var script;
        try {
            up.noncedEval = { args: args, thisArg: thisArg };
            script = up.element.affix(document.body, 'script', { nonce: this.nonce, text: wrappedScript });
            if (up.noncedEval.error) {
                throw up.noncedEval.error;
            }
            else {
                return up.noncedEval.value;
            }
        }
        finally {
            up.noncedEval = undefined;
            if (script) {
                up.element.remove(script);
            }
        }
    };
    NonceableCallback.prototype.allowedBy = function (allowedNonces) {
        return this.nonce && u.contains(allowedNonces, this.nonce);
    };
    NonceableCallback.adoptNonces = function (element, allowedNonces) {
        var _this = this;
        if (!(allowedNonces === null || allowedNonces === void 0 ? void 0 : allowedNonces.length)) {
            return;
        }
        var getPageNonce = u.memoize(up.protocol.cspNonce);
        u.each(up.protocol.config.nonceableAttributes, function (attribute) {
            var matches = e.subtree(element, "[".concat(attribute, "^=\"nonce-\"]"));
            u.each(matches, function (match) {
                var attributeValue = match.getAttribute(attribute);
                var callback = _this.fromString(attributeValue);
                var warn = function (message) {
                    var _a;
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    return (_a = up.log).warn.apply(_a, __spreadArray(['up.render()', "Cannot use callback [".concat(attribute, "=\"").concat(attributeValue, "\"]: ").concat(message)], args, false));
                };
                if (!callback.allowedBy(allowedNonces)) {
                    return warn("Callback's CSP nonce (%o) does not match response header (%o)", callback.nonce, allowedNonces);
                }
                var pageNonce = getPageNonce();
                if (!pageNonce) {
                    return warn("Current page's CSP nonce is unknown");
                }
                callback.nonce = pageNonce;
                match.setAttribute(attribute, callback.toString());
            });
        });
    };
    return NonceableCallback;
}());


/***/ }),
/* 52 */
/***/ (function() {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var u = up.util;
var e = up.element;
up.OptionsParser = (function () {
    function OptionsParser(options, element, parserOptions) {
        this.options = options;
        this.element = element;
        this.fail = parserOptions === null || parserOptions === void 0 ? void 0 : parserOptions.fail;
    }
    OptionsParser.prototype.string = function (key, keyOptions) {
        this.parse(e.attr, key, keyOptions);
    };
    OptionsParser.prototype.boolean = function (key, keyOptions) {
        this.parse(e.booleanAttr, key, keyOptions);
    };
    OptionsParser.prototype.number = function (key, keyOptions) {
        this.parse(e.numberAttr, key, keyOptions);
    };
    OptionsParser.prototype.booleanOrString = function (key, keyOptions) {
        this.parse(e.booleanOrStringAttr, key, keyOptions);
    };
    OptionsParser.prototype.json = function (key, keyOptions) {
        this.parse(e.jsonAttr, key, keyOptions);
    };
    OptionsParser.prototype.parse = function (attrValueFn, key, keyOptions) {
        var _a;
        if (keyOptions === void 0) { keyOptions = {}; }
        var attrNames = u.wrapList((_a = keyOptions.attr) !== null && _a !== void 0 ? _a : this.attrNameForKey(key));
        var value = this.options[key];
        if (this.element) {
            for (var _i = 0, attrNames_1 = attrNames; _i < attrNames_1.length; _i++) {
                var attrName = attrNames_1[_i];
                value !== null && value !== void 0 ? value : (value = attrValueFn(this.element, attrName));
            }
        }
        value !== null && value !== void 0 ? value : (value = keyOptions.default);
        var normalizeFn = keyOptions.normalize;
        if (normalizeFn) {
            value = normalizeFn(value);
        }
        if (u.isDefined(value)) {
            this.options[key] = value;
        }
        var failKey;
        if ((keyOptions.fail || this.fail) && (failKey = up.fragment.failKey(key))) {
            var failAttrNames = u.compact(u.map(attrNames, this.deriveFailAttrName));
            var failKeyOptions = __assign(__assign({}, keyOptions), { attr: failAttrNames, fail: false });
            this.parse(attrValueFn, failKey, failKeyOptions);
        }
    };
    OptionsParser.prototype.deriveFailAttrName = function (attr) {
        if (attr.indexOf('up-') === 0) {
            return "up-fail-".concat(attr.slice(3));
        }
    };
    OptionsParser.prototype.attrNameForKey = function (option) {
        return "up-".concat(u.camelToKebabCase(option));
    };
    return OptionsParser;
}());


/***/ }),
/* 53 */
/***/ (function() {

var e = up.element;
var u = up.util;
up.OverlayFocus = (function () {
    function OverlayFocus(layer) {
        this.layer = layer;
        this.focusElement = this.layer.getFocusElement();
    }
    OverlayFocus.prototype.moveToFront = function () {
        var _this = this;
        if (this.enabled) {
            return;
        }
        this.enabled = true;
        this.untrapFocus = up.on('focusin', function (event) { return _this.onFocus(event); });
        this.unsetAttrs = e.setTemporaryAttrs(this.focusElement, {
            'tabindex': '0',
            'role': 'dialog',
            'aria-modal': 'true'
        });
        this.focusTrapBefore = e.affix(this.focusElement, 'beforebegin', 'up-focus-trap[tabindex=0]');
        this.focusTrapAfter = e.affix(this.focusElement, 'afterend', 'up-focus-trap[tabindex=0]');
    };
    OverlayFocus.prototype.moveToBack = function () {
        this.teardown();
    };
    OverlayFocus.prototype.teardown = function () {
        if (!this.enabled) {
            return;
        }
        this.enabled = false;
        this.untrapFocus();
        this.unsetAttrs();
        e.remove(this.focusTrapBefore);
        e.remove(this.focusTrapAfter);
    };
    OverlayFocus.prototype.onFocus = function (event) {
        var target = event.target;
        if (this.processingFocusEvent) {
            return;
        }
        this.processingFocusEvent = true;
        if (target === this.focusTrapBefore) {
            this.focusEnd();
        }
        else if ((target === this.focusTrapAfter) || !this.layer.contains(target)) {
            this.focusStart();
        }
        this.processingFocusEvent = false;
    };
    OverlayFocus.prototype.focusStart = function (focusOptions) {
        up.focus(this.focusElement, focusOptions);
    };
    OverlayFocus.prototype.focusEnd = function () {
        this.focusLastDescendant(this.layer.getBoxElement()) || this.focusStart();
    };
    OverlayFocus.prototype.focusLastDescendant = function (element) {
        for (var _i = 0, _a = u.reverse(element.children); _i < _a.length; _i++) {
            var child = _a[_i];
            if (up.viewport.tryFocus(child) || this.focusLastDescendant(child)) {
                return true;
            }
        }
    };
    return OverlayFocus;
}());


/***/ }),
/* 54 */
/***/ (function() {

var u = up.util;
var e = up.element;
up.Params = (function () {
    function Params(raw) {
        this.clear();
        this.addAll(raw);
    }
    Params.prototype.clear = function () {
        this.entries = [];
    };
    Params.prototype[u.copy.key] = function () {
        return new up.Params(this);
    };
    Params.prototype.toObject = function () {
        var obj = {};
        for (var _i = 0, _a = this.entries; _i < _a.length; _i++) {
            var entry = _a[_i];
            var name = entry.name, value = entry.value;
            if (!u.isBasicObjectProperty(name)) {
                if (this.isArrayKey(name)) {
                    obj[name] || (obj[name] = []);
                    obj[name].push(value);
                }
                else {
                    obj[name] = value;
                }
            }
        }
        return obj;
    };
    Params.prototype.toArray = function () {
        return this.entries;
    };
    Params.prototype.toFormData = function () {
        var formData = new FormData();
        for (var _i = 0, _a = this.entries; _i < _a.length; _i++) {
            var entry = _a[_i];
            formData.append(entry.name, entry.value);
        }
        if (!formData.entries) {
            formData.originalArray = this.entries;
        }
        return formData;
    };
    Params.prototype.toQuery = function () {
        var parts = u.map(this.entries, this.arrayEntryToQuery.bind(this));
        parts = u.compact(parts);
        return parts.join('&');
    };
    Params.prototype.arrayEntryToQuery = function (entry) {
        var value = entry.value;
        if (this.isBinaryValue(value)) {
            return;
        }
        var query = encodeURIComponent(entry.name);
        if (u.isGiven(value)) {
            query += "=";
            query += encodeURIComponent(value);
        }
        return query;
    };
    Params.prototype.isBinaryValue = function (value) {
        return value instanceof Blob;
    };
    Params.prototype.hasBinaryValues = function () {
        var values = u.map(this.entries, 'value');
        return u.some(values, this.isBinaryValue);
    };
    Params.prototype.toURL = function (base) {
        var parts = [base, this.toQuery()];
        parts = u.filter(parts, u.isPresent);
        var separator = u.contains(base, '?') ? '&' : '?';
        return parts.join(separator);
    };
    Params.prototype.add = function (name, value) {
        this.entries.push({ name: name, value: value });
    };
    Params.prototype.addAll = function (raw) {
        var _a, _b;
        if (u.isMissing(raw)) {
        }
        else if (raw instanceof this.constructor) {
            (_a = this.entries).push.apply(_a, raw.entries);
        }
        else if (u.isArray(raw)) {
            (_b = this.entries).push.apply(_b, raw);
        }
        else if (u.isString(raw)) {
            this.addAllFromQuery(raw);
        }
        else if (u.isFormData(raw)) {
            this.addAllFromFormData(raw);
        }
        else if (u.isObject(raw)) {
            this.addAllFromObject(raw);
        }
        else {
            up.fail("Unsupport params type: %o", raw);
        }
    };
    Params.prototype.addAllFromObject = function (object) {
        for (var key in object) {
            var value = object[key];
            var valueElements = u.isArray(value) ? value : [value];
            for (var _i = 0, valueElements_1 = valueElements; _i < valueElements_1.length; _i++) {
                var valueElement = valueElements_1[_i];
                this.add(key, valueElement);
            }
        }
    };
    Params.prototype.addAllFromQuery = function (query) {
        for (var _i = 0, _a = query.split('&'); _i < _a.length; _i++) {
            var part = _a[_i];
            if (part) {
                var _b = part.split('='), name = _b[0], value = _b[1];
                name = decodeURIComponent(name);
                if (u.isGiven(value)) {
                    value = decodeURIComponent(value);
                }
                else {
                    value = null;
                }
                this.add(name, value);
            }
        }
    };
    Params.prototype.addAllFromFormData = function (formData) {
        var _this = this;
        u.eachIterator(formData.entries(), function (value) {
            _this.add.apply(_this, value);
        });
    };
    Params.prototype.set = function (name, value) {
        this.delete(name);
        this.add(name, value);
    };
    Params.prototype.delete = function (name) {
        this.entries = u.reject(this.entries, this.matchEntryFn(name));
    };
    Params.prototype.matchEntryFn = function (name) {
        return function (entry) { return entry.name === name; };
    };
    Params.prototype.get = function (name) {
        if (this.isArrayKey(name)) {
            return this.getAll(name);
        }
        else {
            return this.getFirst(name);
        }
    };
    Params.prototype.getFirst = function (name) {
        var entry = u.find(this.entries, this.matchEntryFn(name));
        return entry === null || entry === void 0 ? void 0 : entry.value;
    };
    Params.prototype.getAll = function (name) {
        if (this.isArrayKey(name)) {
            return this.getAll(name);
        }
        else {
            var entries = u.map(this.entries, this.matchEntryFn(name));
            return u.map(entries, 'value');
        }
    };
    Params.prototype.isArrayKey = function (key) {
        return u.endsWith(key, '[]');
    };
    Params.prototype[u.isBlank.key] = function () {
        return this.entries.length === 0;
    };
    Params.fromForm = function (form) {
        form = up.fragment.get(form);
        return this.fromFields(up.form.fields(form));
    };
    Params.fromFields = function (fields) {
        var params = new (this)();
        for (var _i = 0, _a = u.wrapList(fields); _i < _a.length; _i++) {
            var field = _a[_i];
            params.addField(field);
        }
        return params;
    };
    Params.prototype.addField = function (field) {
        field = e.get(field);
        var name = field.name;
        if (name && !field.disabled) {
            var tagName = field.tagName;
            var type = field.type;
            if (tagName === 'SELECT') {
                for (var _i = 0, _a = field.querySelectorAll('option'); _i < _a.length; _i++) {
                    var option = _a[_i];
                    if (option.selected) {
                        this.add(name, option.value);
                    }
                }
            }
            else if ((type === 'checkbox') || (type === 'radio')) {
                if (field.checked) {
                    this.add(name, field.value);
                }
            }
            else if (type === 'file') {
                for (var _b = 0, _c = field.files; _b < _c.length; _b++) {
                    var file = _c[_b];
                    this.add(name, file);
                }
            }
            else {
                return this.add(name, field.value);
            }
        }
    };
    Params.prototype[u.isEqual.key] = function (other) {
        return (this.constructor === other.constructor) && u.isEqual(this.entries, other.entries);
    };
    Params.fromURL = function (url) {
        var params = new (this)();
        var urlParts = u.parseURL(url);
        var query = urlParts.search;
        if (query) {
            query = query.replace(/^\?/, '');
            params.addAll(query);
        }
        return params;
    };
    Params.stripURL = function (url) {
        return u.normalizeURL(url, { search: false });
    };
    return Params;
}());


/***/ }),
/* 55 */
/***/ (function() {

var e = up.element;
var TRANSITION_DELAY = 300;
up.ProgressBar = (function () {
    function ProgressBar() {
        this.step = 0;
        this.element = e.affix(document.body, 'up-progress-bar');
        this.element.style.transition = "width ".concat(TRANSITION_DELAY, "ms ease-out");
        this.moveTo(0);
        up.element.paint(this.element);
        this.width = 31;
        this.nextStep();
    }
    ProgressBar.prototype.nextStep = function () {
        var diff;
        if (this.width < 80) {
            if (Math.random() < 0.15) {
                diff = 7 + (5 * Math.random());
            }
            else {
                diff = 1.5 + (0.5 * Math.random());
            }
        }
        else {
            diff = 0.13 * (100 - this.width) * Math.random();
        }
        this.moveTo(this.width + diff);
        this.step++;
        var nextStepDelay = TRANSITION_DELAY + (this.step * 40);
        this.timeout = setTimeout(this.nextStep.bind(this), nextStepDelay);
    };
    ProgressBar.prototype.moveTo = function (width) {
        this.width = width;
        this.element.style.width = "".concat(width, "vw");
    };
    ProgressBar.prototype.destroy = function () {
        clearTimeout(this.timeout);
        e.remove(this.element);
    };
    ProgressBar.prototype.conclude = function () {
        clearTimeout(this.timeout);
        this.moveTo(100);
        setTimeout(this.destroy.bind(this), TRANSITION_DELAY);
    };
    return ProgressBar;
}());


/***/ }),
/* 56 */
/***/ (function() {

var u = up.util;
up.RenderOptions = (function () {
    var GLOBAL_DEFAULTS = {
        hungry: true,
        keep: true,
        source: true,
        saveScroll: true,
        fail: 'auto'
    };
    var PRELOAD_OVERRIDES = {
        solo: false,
        confirm: false,
        feedback: false
    };
    var PREFLIGHT_KEYS = [
        'url',
        'method',
        'origin',
        'headers',
        'params',
        'cache',
        'clearCache',
        'fallback',
        'solo',
        'confirm',
        'feedback',
        'origin',
        'baseLayer',
        'fail',
    ];
    var SHARED_KEYS = PREFLIGHT_KEYS.concat([
        'keep',
        'hungry',
        'history',
        'source',
        'saveScroll',
        'navigate'
    ]);
    var CONTENT_KEYS = [
        'url',
        'content',
        'fragment',
        'document'
    ];
    var LATE_KEYS = [
        'history',
        'focus',
        'scroll'
    ];
    function navigateDefaults(options) {
        if (options.navigate) {
            return up.fragment.config.navigateOptions;
        }
    }
    function preloadOverrides(options) {
        if (options.preload) {
            return PRELOAD_OVERRIDES;
        }
    }
    function preprocess(options) {
        var _a, _b;
        (_b = (_a = up.migrate).preprocessRenderOptions) === null || _b === void 0 ? void 0 : _b.call(_a, options);
        var defaults = u.merge(GLOBAL_DEFAULTS, navigateDefaults(options));
        return u.merge(u.omit(defaults, LATE_KEYS), { defaults: defaults }, options, preloadOverrides(options));
    }
    function finalize(preprocessedOptions, lateDefaults) {
        return u.merge(preprocessedOptions.defaults, lateDefaults, preprocessedOptions);
    }
    function assertContentGiven(options) {
        if (!u.some(CONTENT_KEYS, function (contentKey) { return u.isGiven(options[contentKey]); })) {
            if (options.defaultToEmptyContent) {
                options.content = '';
            }
            else {
                up.fail('up.render() needs either { ' + CONTENT_KEYS.join(', ') + ' } option');
            }
        }
    }
    function failOverrides(options) {
        var overrides = {};
        for (var key in options) {
            var value = options[key];
            var unprefixed = up.fragment.successKey(key);
            if (unprefixed) {
                overrides[unprefixed] = value;
            }
        }
        return overrides;
    }
    function deriveFailOptions(preprocessedOptions) {
        return u.merge(preprocessedOptions.defaults, u.pick(preprocessedOptions, SHARED_KEYS), failOverrides(preprocessedOptions));
    }
    return {
        preprocess: preprocess,
        finalize: finalize,
        assertContentGiven: assertContentGiven,
        deriveFailOptions: deriveFailOptions,
    };
})();


/***/ }),
/* 57 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
up.RenderResult = (function (_super) {
    __extends(RenderResult, _super);
    function RenderResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderResult.prototype.keys = function () {
        return [
            'fragments',
            'layer',
        ];
    };
    return RenderResult;
}(up.Record));


/***/ }),
/* 58 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var u = up.util;
up.Request = (function (_super) {
    __extends(Request, _super);
    function Request(options) {
        var _this = _super.call(this, options) || this;
        _this.params = new up.Params(_this.params);
        _this.headers || (_this.headers = {});
        if (_this.preload) {
            _this.cache = true;
        }
        if (_this.wrapMethod == null) {
            _this.wrapMethod = up.network.config.wrapMethod;
        }
        _this.normalizeForCaching();
        if (!options.basic) {
            var layerLookupOptions = { origin: _this.origin };
            _this.layer = up.layer.get(_this.layer, layerLookupOptions);
            _this.failLayer = up.layer.get(_this.failLayer || _this.layer, layerLookupOptions);
            _this.context || (_this.context = _this.layer.context || {});
            _this.failContext || (_this.failContext = _this.failLayer.context || {});
            _this.mode || (_this.mode = _this.layer.mode);
            _this.failMode || (_this.failMode = _this.failLayer.mode);
            _this.deferred = u.newDeferred();
            _this.state = 'new';
        }
        return _this;
    }
    Request.prototype.keys = function () {
        return [
            'method',
            'url',
            'hash',
            'params',
            'target',
            'failTarget',
            'headers',
            'timeout',
            'preload',
            'cache',
            'clearCache',
            'layer',
            'mode',
            'context',
            'failLayer',
            'failMode',
            'failContext',
            'origin',
            'solo',
            'queueTime',
            'wrapMethod',
            'contentType',
            'payload',
            'onQueued'
        ];
    };
    Object.defineProperty(Request.prototype, "xhr", {
        get: function () {
            var _a;
            return (_a = this._xhr) !== null && _a !== void 0 ? _a : (this._xhr = new XMLHttpRequest());
        },
        enumerable: false,
        configurable: true
    });
    Request.prototype.followState = function (sourceRequest) {
        u.delegate(this, ['deferred', 'state', 'preload'], function () { return sourceRequest; });
    };
    Request.prototype.normalizeForCaching = function () {
        this.method = u.normalizeMethod(this.method);
        this.extractHashFromURL();
        this.transferParamsToURL();
        this.url = u.normalizeURL(this.url);
    };
    Request.prototype.evictExpensiveAttrs = function () {
        var _this = this;
        u.task(function () {
            _this.layer = undefined;
            _this.failLayer = undefined;
            return _this.origin = undefined;
        });
    };
    Request.prototype.extractHashFromURL = function () {
        var _a;
        var match = (_a = this.url) === null || _a === void 0 ? void 0 : _a.match(/^([^#]*)(#.+)$/);
        if (match) {
            this.url = match[1];
            return this.hash = match[2];
        }
    };
    Request.prototype.transferParamsToURL = function () {
        if (!this.url || this.allowsPayload() || u.isBlank(this.params)) {
            return;
        }
        this.url = this.params.toURL(this.url);
        this.params.clear();
    };
    Request.prototype.isSafe = function () {
        return up.network.isSafeMethod(this.method);
    };
    Request.prototype.allowsPayload = function () {
        return u.methodAllowsPayload(this.method);
    };
    Request.prototype.will302RedirectWithGET = function () {
        return this.isSafe() || (this.method === 'POST');
    };
    Request.prototype.willCache = function () {
        if (this.cache === 'auto') {
            return up.network.config.autoCache(this);
        }
        else {
            return this.cache;
        }
    };
    Request.prototype.runQueuedCallbacks = function () {
        var _this = this;
        var _a;
        u.always(this, function () { return _this.evictExpensiveAttrs(); });
        (_a = this.onQueued) === null || _a === void 0 ? void 0 : _a.call(this, this);
    };
    Request.prototype.load = function () {
        var _this = this;
        if (this.state !== 'new') {
            return;
        }
        this.state = 'loading';
        new up.Request.XHRRenderer(this).buildAndSend({
            onload: function () { return _this.onXHRLoad(); },
            onerror: function () { return _this.onXHRError(); },
            ontimeout: function () { return _this.onXHRTimeout(); },
            onabort: function () { return _this.onXHRAbort(); }
        });
    };
    Request.prototype.loadPage = function () {
        up.network.abort();
        new up.Request.FormRenderer(this).buildAndSubmit();
    };
    Request.prototype.onXHRLoad = function () {
        var response = this.extractResponseFromXHR();
        var log = ['Server responded HTTP %d to %s %s (%d characters)', response.status, this.method, this.url, response.text.length];
        this.emit('up:request:loaded', { request: response.request, response: response, log: log });
        this.respondWith(response);
    };
    Request.prototype.onXHRError = function () {
        var log = 'Fatal error during request';
        this.deferred.reject(up.error.failed(log));
        this.emit('up:request:fatal', { log: log });
    };
    Request.prototype.onXHRTimeout = function () {
        this.setAbortedState('Requested timed out');
    };
    Request.prototype.onXHRAbort = function () {
        this.setAbortedState();
    };
    Request.prototype.abort = function () {
        if (this.setAbortedState() && this._xhr) {
            this._xhr.abort();
        }
    };
    Request.prototype.setAbortedState = function (reason) {
        if (reason === void 0) { reason = ["Request to %s %s was aborted", this.method, this.url]; }
        if ((this.state !== 'new') && (this.state !== 'loading')) {
            return;
        }
        this.state = 'aborted';
        this.emit('up:request:aborted', { log: reason });
        this.deferred.reject(up.error.aborted(reason));
        return true;
    };
    Request.prototype.respondWith = function (response) {
        if (this.state !== 'loading') {
            return;
        }
        this.state = 'loaded';
        if (response.ok) {
            return this.deferred.resolve(response);
        }
        else {
            return this.deferred.reject(response);
        }
    };
    Request.prototype.csrfHeader = function () {
        return up.protocol.csrfHeader();
    };
    Request.prototype.csrfParam = function () {
        return up.protocol.csrfParam();
    };
    Request.prototype.csrfToken = function () {
        if (!this.isSafe() && !this.isCrossOrigin()) {
            return up.protocol.csrfToken();
        }
    };
    Request.prototype.isCrossOrigin = function () {
        return u.isCrossOrigin(this.url);
    };
    Request.prototype.extractResponseFromXHR = function () {
        var responseAttrs = {
            method: this.method,
            url: this.url,
            request: this,
            xhr: this.xhr,
            text: this.xhr.responseText,
            status: this.xhr.status,
            title: up.protocol.titleFromXHR(this.xhr),
            target: up.protocol.targetFromXHR(this.xhr),
            acceptLayer: up.protocol.acceptLayerFromXHR(this.xhr),
            dismissLayer: up.protocol.dismissLayerFromXHR(this.xhr),
            eventPlans: up.protocol.eventPlansFromXHR(this.xhr),
            context: up.protocol.contextFromXHR(this.xhr),
            clearCache: up.protocol.clearCacheFromXHR(this.xhr)
        };
        var methodFromResponse = up.protocol.methodFromXHR(this.xhr);
        var urlFromResponse = up.protocol.locationFromXHR(this.xhr);
        if (urlFromResponse) {
            if (!methodFromResponse && !u.matchURLs(responseAttrs.url, urlFromResponse)) {
                methodFromResponse = 'GET';
            }
            responseAttrs.url = urlFromResponse;
        }
        if (methodFromResponse) {
            responseAttrs.method = methodFromResponse;
        }
        return new up.Response(responseAttrs);
    };
    Request.prototype.cacheKey = function () {
        return JSON.stringify([
            this.method,
            this.url,
            this.params.toQuery(),
            this.metaProps()
        ]);
    };
    Request.prototype.metaProps = function () {
        var props = {};
        for (var _i = 0, _a = u.evalOption(up.network.config.requestMetaKeys, this); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = this[key];
            if (u.isGiven(value)) {
                props[key] = value;
            }
        }
        return props;
    };
    Request.prototype.buildEventEmitter = function (args) {
        return up.EventEmitter.fromEmitArgs(args, {
            layer: this.layer,
            request: this,
            origin: this.origin
        });
    };
    Request.prototype.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.buildEventEmitter(args).emit();
    };
    Request.prototype.assertEmitted = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.buildEventEmitter(args).assertEmitted();
    };
    Object.defineProperty(Request.prototype, "description", {
        get: function () {
            return this.method + ' ' + this.url;
        },
        enumerable: false,
        configurable: true
    });
    return Request;
}(up.Record));
u.delegate(up.Request.prototype, ['then', 'catch', 'finally'], function () { return this.deferred; });
up.Request.tester = function (condition) {
    if (u.isFunction(condition)) {
        return condition;
    }
    else if (condition instanceof this) {
        return function (request) { return condition === request; };
    }
    else if (u.isString(condition)) {
        var pattern_1 = new up.URLPattern(condition);
        return function (request) { return pattern_1.test(request.url); };
    }
    else {
        return function (_request) { return condition; };
    }
};


/***/ }),
/* 59 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var u = up.util;
up.Request.Cache = (function (_super) {
    __extends(Cache, _super);
    function Cache() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cache.prototype.maxSize = function () {
        return up.network.config.cacheSize;
    };
    Cache.prototype.expiryMillis = function () {
        return up.network.config.cacheExpiry;
    };
    Cache.prototype.normalizeStoreKey = function (request) {
        return u.wrapValue(up.Request, request).cacheKey();
    };
    Cache.prototype.clear = function (condition) {
        var _this = this;
        if (condition === void 0) { condition = true; }
        var tester = up.Request.tester(condition);
        this.each(function (key, request) {
            if (tester(request)) {
                _this.store.remove(key);
            }
        });
    };
    return Cache;
}(up.Cache));


/***/ }),
/* 60 */
/***/ (function() {

var u = up.util;
up.Request.Queue = (function () {
    function Queue(options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        this.concurrency = (_a = options.concurrency) !== null && _a !== void 0 ? _a : (function () { return up.network.config.concurrency; });
        this.badResponseTime = (_b = options.badResponseTime) !== null && _b !== void 0 ? _b : (function () { return up.network.config.badResponseTime; });
        this.reset();
    }
    Queue.prototype.reset = function () {
        this.queuedRequests = [];
        this.currentRequests = [];
        clearTimeout(this.checkSlowTimout);
        this.emittedSlow = false;
    };
    Object.defineProperty(Queue.prototype, "allRequests", {
        get: function () {
            return this.currentRequests.concat(this.queuedRequests);
        },
        enumerable: false,
        configurable: true
    });
    Queue.prototype.asap = function (request) {
        var _this = this;
        request.runQueuedCallbacks();
        u.always(request, function (responseOrError) { return _this.onRequestSettled(request, responseOrError); });
        request.queueTime = new Date();
        this.setSlowTimer();
        if (this.hasConcurrencyLeft()) {
            this.sendRequestNow(request);
        }
        else {
            this.queueRequest(request);
        }
    };
    Queue.prototype.promoteToForeground = function (request) {
        if (request.preload) {
            request.preload = false;
            return this.setSlowTimer();
        }
    };
    Queue.prototype.setSlowTimer = function () {
        var _this = this;
        var badResponseTime = u.evalOption(this.badResponseTime);
        this.checkSlowTimout = u.timer(badResponseTime, function () { return _this.checkSlow(); });
    };
    Queue.prototype.hasConcurrencyLeft = function () {
        var maxConcurrency = u.evalOption(this.concurrency);
        return (maxConcurrency === -1) || (this.currentRequests.length < maxConcurrency);
    };
    Queue.prototype.isBusy = function () {
        return this.currentRequests.length > 0;
    };
    Queue.prototype.queueRequest = function (request) {
        this.queuedRequests.push(request);
    };
    Queue.prototype.pluckNextRequest = function () {
        var request = u.find(this.queuedRequests, function (request) { return !request.preload; });
        request || (request = this.queuedRequests[0]);
        return u.remove(this.queuedRequests, request);
    };
    Queue.prototype.sendRequestNow = function (request) {
        if (request.emit('up:request:load', { log: ['Loading %s %s', request.method, request.url] }).defaultPrevented) {
            request.abort('Prevented by event listener');
        }
        else {
            request.normalizeForCaching();
            this.currentRequests.push(request);
            request.load();
        }
    };
    Queue.prototype.onRequestSettled = function (request, responseOrError) {
        var _this = this;
        u.remove(this.currentRequests, request);
        if ((responseOrError instanceof up.Response) && responseOrError.ok) {
            up.network.registerAliasForRedirect(request, responseOrError);
        }
        this.checkSlow();
        u.microtask(function () { return _this.poke(); });
    };
    Queue.prototype.poke = function () {
        var request;
        if (this.hasConcurrencyLeft() && (request = this.pluckNextRequest())) {
            return this.sendRequestNow(request);
        }
    };
    Queue.prototype.abort = function (conditions) {
        if (conditions === void 0) { conditions = true; }
        var tester = up.Request.tester(conditions);
        var _loop_1 = function (list) {
            var abortableRequests = u.filter(list, tester);
            abortableRequests.forEach(function (abortableRequest) {
                abortableRequest.abort();
                u.remove(list, abortableRequest);
            });
        };
        for (var _i = 0, _a = [this.currentRequests, this.queuedRequests]; _i < _a.length; _i++) {
            var list = _a[_i];
            _loop_1(list);
        }
    };
    Queue.prototype.abortExcept = function (excusedRequest, additionalConditions) {
        if (additionalConditions === void 0) { additionalConditions = true; }
        var excusedCacheKey = excusedRequest.cacheKey();
        this.abort(function (queuedRequest) { return (queuedRequest.cacheKey() !== excusedCacheKey) && u.evalOption(additionalConditions, queuedRequest); });
    };
    Queue.prototype.checkSlow = function () {
        var currentSlow = this.isSlow();
        if (this.emittedSlow !== currentSlow) {
            this.emittedSlow = currentSlow;
            if (currentSlow) {
                up.emit('up:request:late', { log: 'Server is slow to respond' });
            }
            else {
                up.emit('up:request:recover', { log: 'Slow requests were loaded' });
            }
        }
    };
    Queue.prototype.isSlow = function () {
        var now = new Date();
        var delay = u.evalOption(this.badResponseTime);
        var allForegroundRequests = u.reject(this.allRequests, 'preload');
        var timerTolerance = 1;
        return u.some(allForegroundRequests, function (request) { return (now - request.queueTime) >= (delay - timerTolerance); });
    };
    return Queue;
}());


/***/ }),
/* 61 */
/***/ (function() {

var u = up.util;
var e = up.element;
var HTML_FORM_METHODS = ['GET', 'POST'];
up.Request.FormRenderer = (function () {
    function FormRenderer(request) {
        this.request = request;
    }
    FormRenderer.prototype.buildAndSubmit = function () {
        this.params = u.copy(this.request.params);
        var action = this.request.url;
        var method = this.request.method;
        var paramsFromQuery = up.Params.fromURL(action);
        this.params.addAll(paramsFromQuery);
        action = up.Params.stripURL(action);
        if (!u.contains(HTML_FORM_METHODS, method)) {
            method = up.protocol.wrapMethod(method, this.params);
        }
        this.form = e.affix(document.body, 'form.up-request-loader', { method: method, action: action });
        var contentType = this.request.contentType;
        if (contentType) {
            this.form.setAttribute('enctype', contentType);
        }
        var csrfParam, csrfToken;
        if ((csrfParam = this.request.csrfParam()) && (csrfToken = this.request.csrfToken())) {
            this.params.add(csrfParam, csrfToken);
        }
        u.each(this.params.toArray(), this.addField.bind(this));
        up.browser.submitForm(this.form);
    };
    FormRenderer.prototype.addField = function (attrs) {
        e.affix(this.form, 'input[type=hidden]', attrs);
    };
    return FormRenderer;
}());


/***/ }),
/* 62 */
/***/ (function() {

var CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';
var CONTENT_TYPE_FORM_DATA = 'multipart/form-data';
var u = up.util;
up.Request.XHRRenderer = (function () {
    function XHRRenderer(request) {
        this.request = request;
    }
    XHRRenderer.prototype.buildAndSend = function (handlers) {
        var xhr = this.request.xhr;
        this.params = u.copy(this.request.params);
        if (this.request.timeout) {
            xhr.timeout = this.request.timeout;
        }
        xhr.open(this.getMethod(), this.request.url);
        var metaProps = this.request.metaProps();
        for (var key in metaProps) {
            this.addHeader(xhr, up.protocol.headerize(key), metaProps[key]);
        }
        for (var header in this.request.headers) {
            this.addHeader(xhr, header, this.request.headers[header]);
        }
        var csrfHeader, csrfToken;
        if ((csrfHeader = this.request.csrfHeader()) && (csrfToken = this.request.csrfToken())) {
            this.addHeader(xhr, csrfHeader, csrfToken);
        }
        this.addHeader(xhr, up.protocol.headerize('version'), up.version);
        var contentType = this.getContentType();
        if (contentType) {
            this.addHeader(xhr, 'Content-Type', contentType);
        }
        u.assign(xhr, handlers);
        xhr.send(this.getPayload());
    };
    XHRRenderer.prototype.getMethod = function () {
        if (!this.method) {
            this.method = this.request.method;
            if (this.request.wrapMethod && !this.request.will302RedirectWithGET()) {
                this.method = up.protocol.wrapMethod(this.method, this.params);
            }
        }
        return this.method;
    };
    XHRRenderer.prototype.getContentType = function () {
        this.finalizePayload();
        return this.contentType;
    };
    XHRRenderer.prototype.getPayload = function () {
        this.finalizePayload();
        return this.payload;
    };
    XHRRenderer.prototype.addHeader = function (xhr, header, value) {
        if (u.isOptions(value) || u.isArray(value)) {
            value = JSON.stringify(value);
        }
        xhr.setRequestHeader(header, value);
    };
    XHRRenderer.prototype.finalizePayload = function () {
        if (this.payloadFinalized) {
            return;
        }
        this.payloadFinalized = true;
        this.payload = this.request.payload;
        this.contentType = this.request.contentType;
        if (!this.payload && this.request.allowsPayload()) {
            if (!this.contentType) {
                this.contentType = this.params.hasBinaryValues() ? CONTENT_TYPE_FORM_DATA : CONTENT_TYPE_URL_ENCODED;
            }
            if (this.contentType === CONTENT_TYPE_FORM_DATA) {
                this.contentType = null;
                this.payload = this.params.toFormData();
            }
            else {
                this.payload = this.params.toQuery().replace(/%20/g, '+');
            }
        }
    };
    return XHRRenderer;
}());


/***/ }),
/* 63 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
up.Response = (function (_super) {
    __extends(Response, _super);
    function Response() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Response.prototype.keys = function () {
        return [
            'method',
            'url',
            'text',
            'status',
            'request',
            'xhr',
            'target',
            'title',
            'acceptLayer',
            'dismissLayer',
            'eventPlans',
            'context',
            'clearCache',
            'headers'
        ];
    };
    Response.prototype.defaults = function () {
        return { headers: {} };
    };
    Object.defineProperty(Response.prototype, "ok", {
        get: function () {
            return this.status && ((this.status >= 200) && (this.status <= 299));
        },
        enumerable: false,
        configurable: true
    });
    Response.prototype.getHeader = function (name) {
        var _a;
        return this.headers[name] || ((_a = this.xhr) === null || _a === void 0 ? void 0 : _a.getResponseHeader(name));
    };
    Object.defineProperty(Response.prototype, "contentType", {
        get: function () {
            return this.getHeader('Content-Type');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "cspNonces", {
        get: function () {
            return up.protocol.cspNoncesFromHeader(this.getHeader('Content-Security-Policy'));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "json", {
        get: function () {
            return this.parsedJSON || (this.parsedJSON = JSON.parse(this.text));
        },
        enumerable: false,
        configurable: true
    });
    return Response;
}(up.Record));


/***/ }),
/* 64 */
/***/ (function() {

var u = up.util;
var e = up.element;
up.ResponseDoc = (function () {
    function ResponseDoc(options) {
        this.noscriptWrapper = new up.HTMLWrapper('noscript');
        this.scriptWrapper = new up.HTMLWrapper('script');
        this.root =
            this.parseDocument(options) ||
                this.parseFragment(options) ||
                this.parseContent(options);
        this.cspNonces = options.cspNonces;
    }
    ResponseDoc.prototype.parseDocument = function (options) {
        return this.parse(options.document, e.createDocumentFromHTML);
    };
    ResponseDoc.prototype.parseContent = function (options) {
        var content = options.content || '';
        var target = options.target || up.fail("must pass a { target } when passing { content }");
        var matchingElement = e.createFromSelector(target);
        if (u.isString(content)) {
            content = this.wrapHTML(content);
            matchingElement.innerHTML = content;
        }
        else {
            matchingElement.appendChild(content);
        }
        return matchingElement;
    };
    ResponseDoc.prototype.parseFragment = function (options) {
        return this.parse(options.fragment);
    };
    ResponseDoc.prototype.parse = function (value, parseFn) {
        if (parseFn === void 0) { parseFn = e.createFromHTML; }
        if (u.isString(value)) {
            value = this.wrapHTML(value);
            value = parseFn(value);
        }
        return value;
    };
    ResponseDoc.prototype.rootSelector = function () {
        return up.fragment.toTarget(this.root);
    };
    ResponseDoc.prototype.wrapHTML = function (html) {
        html = this.noscriptWrapper.wrap(html);
        if (up.fragment.config.runScripts) {
            html = this.scriptWrapper.wrap(html);
        }
        else {
            html = this.scriptWrapper.strip(html);
        }
        return html;
    };
    ResponseDoc.prototype.getTitle = function () {
        var _a;
        if (!this.titleParsed) {
            this.title = (_a = this.root.querySelector("head title")) === null || _a === void 0 ? void 0 : _a.textContent;
            this.titleParsed = true;
        }
        return this.title;
    };
    ResponseDoc.prototype.select = function (selector) {
        return up.fragment.subtree(this.root, selector, { layer: 'any' })[0];
    };
    ResponseDoc.prototype.finalizeElement = function (element) {
        this.noscriptWrapper.unwrap(element);
        up.NonceableCallback.adoptNonces(element, this.cspNonces);
        this.scriptWrapper.unwrap(element);
    };
    return ResponseDoc;
}());


/***/ }),
/* 65 */
/***/ (function() {

var e = up.element;
var u = up.util;
up.RevealMotion = (function () {
    function RevealMotion(element, options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.element = element;
        this.options = options;
        var viewportConfig = up.viewport.config;
        this.viewport = e.get(this.options.viewport) || up.viewport.get(this.element);
        this.obstructionsLayer = up.layer.get(this.viewport);
        this.snap = (_b = (_a = this.options.snap) !== null && _a !== void 0 ? _a : this.options.revealSnap) !== null && _b !== void 0 ? _b : viewportConfig.revealSnap;
        this.padding = (_d = (_c = this.options.padding) !== null && _c !== void 0 ? _c : this.options.revealPadding) !== null && _d !== void 0 ? _d : viewportConfig.revealPadding;
        this.top = (_f = (_e = this.options.top) !== null && _e !== void 0 ? _e : this.options.revealTop) !== null && _f !== void 0 ? _f : viewportConfig.revealTop;
        this.max = (_h = (_g = this.options.max) !== null && _g !== void 0 ? _g : this.options.revealMax) !== null && _h !== void 0 ? _h : viewportConfig.revealMax;
        this.topObstructions = viewportConfig.fixedTop;
        this.bottomObstructions = viewportConfig.fixedBottom;
    }
    RevealMotion.prototype.start = function () {
        var viewportRect = this.getViewportRect(this.viewport);
        var elementRect = up.Rect.fromElement(this.element);
        if (this.max) {
            var maxPixels = u.evalOption(this.max, this.element);
            elementRect.height = Math.min(elementRect.height, maxPixels);
        }
        this.addPadding(elementRect);
        this.substractObstructions(viewportRect);
        if (viewportRect.height < 0) {
            return up.error.failed.async('Viewport has no visible area');
        }
        var originalScrollTop = this.viewport.scrollTop;
        var newScrollTop = originalScrollTop;
        if (this.top || (elementRect.height > viewportRect.height)) {
            var diff = elementRect.top - viewportRect.top;
            newScrollTop += diff;
        }
        else if (elementRect.top < viewportRect.top) {
            newScrollTop -= (viewportRect.top - elementRect.top);
        }
        else if (elementRect.bottom > viewportRect.bottom) {
            newScrollTop += (elementRect.bottom - viewportRect.bottom);
        }
        else {
        }
        if (u.isNumber(this.snap) && (newScrollTop < this.snap) && (elementRect.top < (0.5 * viewportRect.height))) {
            newScrollTop = 0;
        }
        if (newScrollTop !== originalScrollTop) {
            return this.scrollTo(newScrollTop);
        }
        else {
            return Promise.resolve();
        }
    };
    RevealMotion.prototype.scrollTo = function (newScrollTop) {
        this.scrollMotion = new up.ScrollMotion(this.viewport, newScrollTop, this.options);
        return this.scrollMotion.start();
    };
    RevealMotion.prototype.getViewportRect = function () {
        if (up.viewport.isRoot(this.viewport)) {
            return new up.Rect({
                left: 0,
                top: 0,
                width: up.viewport.rootWidth(),
                height: up.viewport.rootHeight()
            });
        }
        else {
            return up.Rect.fromElement(this.viewport);
        }
    };
    RevealMotion.prototype.addPadding = function (elementRect) {
        elementRect.top -= this.padding;
        elementRect.height += 2 * this.padding;
    };
    RevealMotion.prototype.selectObstructions = function (selectors) {
        var elements = up.fragment.all(selectors.join(','), { layer: this.obstructionsLayer });
        return u.filter(elements, e.isVisible);
    };
    RevealMotion.prototype.substractObstructions = function (viewportRect) {
        for (var _i = 0, _a = this.selectObstructions(this.topObstructions); _i < _a.length; _i++) {
            var obstruction = _a[_i];
            var obstructionRect = up.Rect.fromElement(obstruction);
            var diff = obstructionRect.bottom - viewportRect.top;
            if (diff > 0) {
                viewportRect.top += diff;
                viewportRect.height -= diff;
            }
        }
        for (var _b = 0, _c = this.selectObstructions(this.bottomObstructions); _b < _c.length; _b++) {
            var obstruction = _c[_b];
            var obstructionRect = up.Rect.fromElement(obstruction);
            var diff = viewportRect.bottom - obstructionRect.top;
            if (diff > 0) {
                viewportRect.height -= diff;
            }
        }
    };
    RevealMotion.prototype.finish = function () {
        var _a;
        (_a = this.scrollMotion) === null || _a === void 0 ? void 0 : _a.finish();
    };
    return RevealMotion;
}());


/***/ }),
/* 66 */
/***/ (function() {

var u = up.util;
var SPEED_CALIBRATION = 0.065;
up.ScrollMotion = (function () {
    function ScrollMotion(scrollable, targetTop, options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d;
        this.scrollable = scrollable;
        this.targetTop = targetTop;
        this.behavior = (_b = (_a = options.behavior) !== null && _a !== void 0 ? _a : options.scrollBehavior) !== null && _b !== void 0 ? _b : 'auto';
        this.speed = ((_d = (_c = options.speed) !== null && _c !== void 0 ? _c : options.scrollSpeed) !== null && _d !== void 0 ? _d : up.viewport.config.scrollSpeed) * SPEED_CALIBRATION;
    }
    ScrollMotion.prototype.start = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
            if ((_this.behavior === 'smooth') && up.motion.isEnabled()) {
                _this.startAnimation();
            }
            else {
                _this.finish();
            }
        });
    };
    ScrollMotion.prototype.startAnimation = function () {
        var _this = this;
        this.startTime = Date.now();
        this.startTop = this.scrollable.scrollTop;
        this.topDiff = this.targetTop - this.startTop;
        this.duration = Math.sqrt(Math.abs(this.topDiff)) / this.speed;
        requestAnimationFrame(function () { return _this.animationFrame(); });
    };
    ScrollMotion.prototype.animationFrame = function () {
        var _this = this;
        if (this.settled) {
            return;
        }
        var currentTime = Date.now();
        var timeElapsed = currentTime - this.startTime;
        var timeFraction = Math.min(timeElapsed / this.duration, 1);
        this.frameTop = this.startTop + (u.simpleEase(timeFraction) * this.topDiff);
        if (Math.abs(this.targetTop - this.frameTop) < 0.3) {
            this.finish();
        }
        else {
            this.scrollable.scrollTop = this.frameTop;
            requestAnimationFrame(function () { return _this.animationFrame(); });
        }
    };
    ScrollMotion.prototype.abort = function (reason) {
        this.settled = true;
        this.reject(up.error.aborted(reason));
    };
    ScrollMotion.prototype.finish = function () {
        this.settled = true;
        this.scrollable.scrollTop = this.targetTop;
        this.resolve();
    };
    return ScrollMotion;
}());


/***/ }),
/* 67 */
/***/ (function() {

var e = up.element;
var u = up.util;
up.Selector = (function () {
    function Selector(selectors, filters) {
        if (filters === void 0) { filters = []; }
        this.selectors = selectors;
        this.filters = filters;
        this.unionSelector = this.selectors.join(',') || 'match-none';
    }
    Selector.prototype.matches = function (element) {
        return e.matches(element, this.unionSelector) && this.passesFilter(element);
    };
    Selector.prototype.closest = function (element) {
        var parentElement;
        if (this.matches(element)) {
            return element;
        }
        else if (parentElement = element.parentElement) {
            return this.closest(parentElement);
        }
    };
    Selector.prototype.passesFilter = function (element) {
        return u.every(this.filters, function (filter) { return filter(element); });
    };
    Selector.prototype.descendants = function (root) {
        var _this = this;
        var results = u.flatMap(this.selectors, function (selector) { return e.all(root, selector); });
        return u.filter(results, function (element) { return _this.passesFilter(element); });
    };
    Selector.prototype.subtree = function (root) {
        var results = [];
        if (this.matches(root)) {
            results.push(root);
        }
        results.push.apply(results, this.descendants(root));
        return results;
    };
    return Selector;
}());


/***/ }),
/* 68 */
/***/ (function() {

var u = up.util;
up.store || (up.store = {});
up.store.Memory = (function () {
    function Memory() {
        this.data = {};
    }
    Memory.prototype.clear = function () {
        this.data = {};
    };
    Memory.prototype.get = function (key) {
        return this.data[key];
    };
    Memory.prototype.set = function (key, value) {
        this.data[key] = value;
    };
    Memory.prototype.remove = function (key) {
        delete this.data[key];
    };
    Memory.prototype.keys = function () {
        return Object.keys(this.data);
    };
    Memory.prototype.size = function () {
        return this.keys().length;
    };
    Memory.prototype.values = function () {
        return u.values(this.data);
    };
    return Memory;
}());


/***/ }),
/* 69 */
/***/ (function() {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
up.store.Session = (function (_super) {
    __extends(Session, _super);
    function Session(rootKey) {
        var _this = _super.call(this) || this;
        _this.rootKey = rootKey;
        _this.loadFromSessionStorage();
        return _this;
    }
    Session.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.saveToSessionStorage();
    };
    Session.prototype.set = function (key, value) {
        _super.prototype.set.call(this, key, value);
        this.saveToSessionStorage();
    };
    Session.prototype.remove = function (key) {
        _super.prototype.remove.call(this, key);
        this.saveToSessionStorage();
    };
    Session.prototype.loadFromSessionStorage = function () {
        try {
            var raw = sessionStorage === null || sessionStorage === void 0 ? void 0 : sessionStorage.getItem(this.rootKey);
            if (raw) {
                this.data = JSON.parse(raw);
            }
        }
        catch (error) {
        }
    };
    Session.prototype.saveToSessionStorage = function () {
        var json = JSON.stringify(this.data);
        try {
            return sessionStorage === null || sessionStorage === void 0 ? void 0 : sessionStorage.setItem(this.rootKey, json);
        }
        catch (error) {
        }
    };
    return Session;
}(up.store.Memory));


/***/ }),
/* 70 */
/***/ (function() {

var u = up.util;
var e = up.element;
up.Tether = (function () {
    function Tether(options) {
        var _a, _b;
        (_b = (_a = up.migrate).handleTetherOptions) === null || _b === void 0 ? void 0 : _b.call(_a, options);
        this.anchor = options.anchor;
        this.align = options.align;
        this.position = options.position;
        this.alignAxis = (this.position === 'top') || (this.position === 'bottom') ? 'horizontal' : 'vertical';
        this.viewport = up.viewport.get(this.anchor);
        this.parent = this.viewport === e.root ? document.body : this.viewport;
        this.syncOnScroll = !this.viewport.contains(this.anchor.offsetParent);
    }
    Tether.prototype.start = function (element) {
        this.element = element;
        this.element.style.position = 'absolute';
        this.setOffset(0, 0);
        this.sync();
        this.changeEventSubscription('on');
    };
    Tether.prototype.stop = function () {
        this.changeEventSubscription('off');
    };
    Tether.prototype.changeEventSubscription = function (fn) {
        var doScheduleSync = this.scheduleSync.bind(this);
        up[fn](window, 'resize', doScheduleSync);
        if (this.syncOnScroll) {
            up[fn](this.viewport, 'scroll', doScheduleSync);
        }
    };
    Tether.prototype.scheduleSync = function () {
        clearTimeout(this.syncTimer);
        return this.syncTimer = u.task(this.sync.bind(this));
    };
    Tether.prototype.isDetached = function () {
        return e.isDetached(this.parent) || e.isDetached(this.anchor);
    };
    Tether.prototype.sync = function () {
        var elementBox = this.element.getBoundingClientRect();
        var elementMargin = {
            top: e.styleNumber(this.element, 'marginTop'),
            right: e.styleNumber(this.element, 'marginRight'),
            bottom: e.styleNumber(this.element, 'marginBottom'),
            left: e.styleNumber(this.element, 'marginLeft')
        };
        var anchorBox = this.anchor.getBoundingClientRect();
        var left;
        var top;
        switch (this.alignAxis) {
            case 'horizontal': {
                switch (this.position) {
                    case 'top':
                        top = anchorBox.top - elementMargin.bottom - elementBox.height;
                        break;
                    case 'bottom':
                        top = anchorBox.top + anchorBox.height + elementMargin.top;
                        break;
                }
                switch (this.align) {
                    case 'left':
                        left = anchorBox.left + elementMargin.left;
                        break;
                    case 'center':
                        left = anchorBox.left + (0.5 * (anchorBox.width - elementBox.width));
                        break;
                    case 'right':
                        left = (anchorBox.left + anchorBox.width) - elementBox.width - elementMargin.right;
                        break;
                }
                break;
            }
            case 'vertical': {
                switch (this.align) {
                    case 'top':
                        top = anchorBox.top + elementMargin.top;
                        break;
                    case 'center':
                        top = anchorBox.top + (0.5 * (anchorBox.height - elementBox.height));
                        break;
                    case 'bottom':
                        top = (anchorBox.top + anchorBox.height) - elementBox.height - elementMargin.bottom;
                        break;
                }
                switch (this.position) {
                    case 'left':
                        left = anchorBox.left - elementMargin.right - elementBox.width;
                        break;
                    case 'right':
                        left = anchorBox.left + anchorBox.width + elementMargin.left;
                        break;
                }
                break;
            }
        }
        if (u.isDefined(left) || u.isDefined(top)) {
            this.moveTo(left, top);
        }
        else {
            up.fail('Invalid tether constraints: %o', this.describeConstraints());
        }
    };
    Tether.prototype.describeConstraints = function () {
        return { position: this.position, align: this.align };
    };
    Tether.prototype.moveTo = function (targetLeft, targetTop) {
        var elementBox = this.element.getBoundingClientRect();
        this.setOffset((targetLeft - elementBox.left) + this.offsetLeft, (targetTop - elementBox.top) + this.offsetTop);
    };
    Tether.prototype.setOffset = function (left, top) {
        this.offsetLeft = left;
        this.offsetTop = top;
        e.setStyle(this.element, { left: left, top: top });
    };
    return Tether;
}());


/***/ }),
/* 71 */
/***/ (function() {

var u = up.util;
up.URLPattern = (function () {
    function URLPattern(fullPattern, normalizeURL) {
        if (normalizeURL === void 0) { normalizeURL = u.normalizeURL; }
        this.normalizeURL = normalizeURL;
        this.groups = [];
        var positiveList = [];
        var negativeList = [];
        for (var _i = 0, _a = u.splitValues(fullPattern); _i < _a.length; _i++) {
            var pattern = _a[_i];
            if (pattern[0] === '-') {
                negativeList.push(pattern.substring(1));
            }
            else {
                positiveList.push(pattern);
            }
        }
        this.positiveRegexp = this.buildRegexp(positiveList, true);
        this.negativeRegexp = this.buildRegexp(negativeList, false);
    }
    URLPattern.prototype.buildRegexp = function (list, capture) {
        var _this = this;
        if (!list.length) {
            return;
        }
        list = list.map(function (url) {
            if (url[0] === '*') {
                url = '/' + url;
            }
            url = _this.normalizeURL(url);
            url = u.escapeRegExp(url);
            return url;
        });
        var reCode = list.join('|');
        reCode = reCode.replace(/\\\*/g, '.*?');
        reCode = reCode.replace(/(:|\\\$)([a-z][\w-]*)/ig, function (match, type, name) {
            if (type === '\\$') {
                if (capture) {
                    _this.groups.push({ name: name, cast: Number });
                }
                return '(\\d+)';
            }
            else {
                if (capture) {
                    _this.groups.push({ name: name, cast: String });
                }
                return '([^/?#]+)';
            }
        });
        return new RegExp('^(?:' + reCode + ')$');
    };
    URLPattern.prototype.test = function (url, doNormalize) {
        if (doNormalize === void 0) { doNormalize = true; }
        if (doNormalize) {
            url = this.normalizeURL(url);
        }
        return this.positiveRegexp.test(url) && !this.isExcluded(url);
    };
    URLPattern.prototype.recognize = function (url, doNormalize) {
        if (doNormalize === void 0) { doNormalize = true; }
        if (doNormalize) {
            url = this.normalizeURL(url);
        }
        var match = this.positiveRegexp.exec(url);
        if (match && !this.isExcluded(url)) {
            var resolution_1 = {};
            this.groups.forEach(function (group, groupIndex) {
                var value = match[groupIndex + 1];
                if (value) {
                    return resolution_1[group.name] = group.cast(value);
                }
            });
            return resolution_1;
        }
    };
    URLPattern.prototype.isExcluded = function (url) {
        var _a;
        return (_a = this.negativeRegexp) === null || _a === void 0 ? void 0 : _a.test(url);
    };
    return URLPattern;
}());


/***/ }),
/* 72 */
/***/ (function() {

up.framework = (function () {
    var readyState = 'evaling';
    function emitReset() {
        up.emit('up:framework:reset', { log: false });
    }
    function boot() {
        if (readyState !== 'configuring') {
            console.error('Unpoly has already booted');
            return;
        }
        var supportIssue = up.framework.supportIssue();
        if (!supportIssue) {
            readyState = 'booting';
            up.emit('up:framework:boot', { log: false });
            readyState = 'booted';
        }
        else {
            console.error("Unpoly cannot boot: %s", supportIssue);
        }
    }
    function mustBootManually() {
        var unpolyScript = document.currentScript;
        if (unpolyScript === null || unpolyScript === void 0 ? void 0 : unpolyScript.async) {
            return true;
        }
        if ((unpolyScript === null || unpolyScript === void 0 ? void 0 : unpolyScript.getAttribute('up-boot')) === 'manual') {
            return true;
        }
        if (document.readyState === 'complete') {
            return true;
        }
    }
    function onEvaled() {
        up.emit('up:framework:evaled', { log: false });
        if (mustBootManually()) {
            console.debug('Call up.boot() after you have configured Unpoly');
        }
        else {
            document.addEventListener('DOMContentLoaded', boot);
        }
        readyState = 'configuring';
    }
    function startExtension() {
        if (readyState !== 'configuring') {
            throw new Error('Unpoly extensions must be loaded before booting');
        }
        readyState = 'evaling';
    }
    function stopExtension() {
        readyState = 'configuring';
    }
    function isSupported() {
        return !supportIssue();
    }
    function supportIssue() {
        if (!up.browser.canPromise()) {
            return "Browser doesn't support promises";
        }
        if (document.compatMode === 'BackCompat') {
            return 'Browser is in quirks mode (missing DOCTYPE?)';
        }
        if (up.browser.isEdge18()) {
            return 'Edge 18 or lower is unsupported';
        }
    }
    return {
        onEvaled: onEvaled,
        boot: boot,
        startExtension: startExtension,
        stopExtension: stopExtension,
        reset: emitReset,
        get evaling() { return readyState === 'evaling'; },
        get booted() { return readyState === 'booted'; },
        get beforeBoot() { return readyState !== 'booting' && readyState !== 'booted'; },
        isSupported: isSupported,
        supportIssue: supportIssue,
    };
})();
up.boot = up.framework.boot;


/***/ }),
/* 73 */
/***/ (function() {

up.event = (function () {
    var u = up.util;
    var e = up.element;
    function reset() {
        for (var _i = 0, _a = [window, document, e.root, document.body]; _i < _a.length; _i++) {
            var globalElement = _a[_i];
            for (var _b = 0, _c = up.EventListener.allNonDefault(globalElement); _b < _c.length; _b++) {
                var listener = _c[_b];
                listener.unbind();
            }
        }
    }
    function on() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return buildListenerGroup(args).bind();
    }
    function $on() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return buildListenerGroup(args, { jQuery: true }).bind();
    }
    function off() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return buildListenerGroup(args).unbind();
    }
    function buildListenerGroup(args, options) {
        return up.EventListenerGroup.fromBindArgs(args, options);
    }
    function buildEmitter(args) {
        return up.EventEmitter.fromEmitArgs(args);
    }
    function emit() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return buildEmitter(args).emit();
    }
    function build() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var props = u.extractOptions(args);
        var type = args[0] || props.type || up.fail('Expected event type to be passed as string argument or { type } property');
        var event = document.createEvent('Event');
        event.initEvent(type, true, true);
        u.assign(event, u.omit(props, ['type', 'target']));
        if (up.browser.isIE11()) {
            var originalPreventDefault_1 = event.preventDefault;
            event.preventDefault = function () {
                originalPreventDefault_1.call(event);
                return u.getter(event, 'defaultPrevented', function () { return true; });
            };
        }
        return event;
    }
    function assertEmitted() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return buildEmitter(args).assertEmitted();
    }
    function onEscape(listener) {
        return on('keydown', function (event) {
            if (wasEscapePressed(event)) {
                return listener(event);
            }
        });
    }
    function wasEscapePressed(event) {
        var key = event.key;
        return (key === 'Escape') || (key === 'Esc');
    }
    function halt(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
    }
    var keyModifiers = ['metaKey', 'shiftKey', 'ctrlKey', 'altKey'];
    function isUnmodified(event) {
        return (u.isUndefined(event.button) || (event.button === 0)) &&
            !u.some(keyModifiers, function (modifier) { return event[modifier]; });
    }
    function fork(originalEvent, newType, copyKeys) {
        if (copyKeys === void 0) { copyKeys = []; }
        var newEvent = up.event.build(newType, u.pick(originalEvent, copyKeys));
        newEvent.originalEvent = originalEvent;
        ['stopPropagation', 'stopImmediatePropagation', 'preventDefault'].forEach(function (key) {
            var originalMethod = newEvent[key];
            return newEvent[key] = function () {
                originalEvent[key]();
                return originalMethod.call(newEvent);
            };
        });
        if (originalEvent.defaultPrevented) {
            newEvent.preventDefault();
        }
        return newEvent;
    }
    function executeEmitAttr(event, element) {
        if (!isUnmodified(event)) {
            return;
        }
        var eventType = e.attr(element, 'up-emit');
        var eventProps = e.jsonAttr(element, 'up-emit-props');
        var forkedEvent = fork(event, eventType);
        u.assign(forkedEvent, eventProps);
        up.emit(element, forkedEvent);
    }
    on('up:click', 'a[up-emit]', executeEmitAttr);
    on('up:framework:reset', reset);
    return {
        on: on,
        $on: $on,
        off: off,
        build: build,
        emit: emit,
        assertEmitted: assertEmitted,
        onEscape: onEscape,
        halt: halt,
        isUnmodified: isUnmodified,
        fork: fork,
        keyModifiers: keyModifiers
    };
})();
up.on = up.event.on;
up.$on = up.event.$on;
up.off = up.event.off;
up.$off = up.event.off;
up.emit = up.event.emit;


/***/ }),
/* 74 */
/***/ (function() {

up.protocol = (function () {
    var u = up.util;
    var e = up.element;
    var headerize = function (camel) {
        var header = camel.replace(/(^.|[A-Z])/g, function (char) { return '-' + char.toUpperCase(); });
        return 'X-Up' + header;
    };
    var extractHeader = function (xhr, shortHeader, parseFn) {
        if (parseFn === void 0) { parseFn = u.identity; }
        var value = xhr.getResponseHeader(headerize(shortHeader));
        if (value) {
            return parseFn(value);
        }
    };
    function parseClearCacheValue(value) {
        switch (value) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return value;
        }
    }
    function clearCacheFromXHR(xhr) {
        return extractHeader(xhr, 'clearCache', parseClearCacheValue);
    }
    function contextFromXHR(xhr) {
        return extractHeader(xhr, 'context', JSON.parse);
    }
    function methodFromXHR(xhr) {
        return extractHeader(xhr, 'method', u.normalizeMethod);
    }
    function eventPlansFromXHR(xhr) {
        return extractHeader(xhr, 'events', JSON.parse);
    }
    function acceptLayerFromXHR(xhr) {
        return extractHeader(xhr, 'acceptLayer', JSON.parse);
    }
    function dismissLayerFromXHR(xhr) {
        return extractHeader(xhr, 'dismissLayer', JSON.parse);
    }
    var initialRequestMethod = u.memoize(function () {
        return u.normalizeMethod(up.browser.popCookie('_up_method'));
    });
    function locationFromXHR(xhr) {
        return extractHeader(xhr, 'location') || xhr.responseURL;
    }
    function titleFromXHR(xhr) {
        return extractHeader(xhr, 'title');
    }
    function targetFromXHR(xhr) {
        return extractHeader(xhr, 'target');
    }
    var config = new up.Config(function () { return ({
        methodParam: '_method',
        csrfParam: function () { return e.metaContent('csrf-param'); },
        csrfToken: function () { return e.metaContent('csrf-token'); },
        cspNonce: function () { return e.metaContent('csp-nonce'); },
        csrfHeader: 'X-CSRF-Token',
        nonceableAttributes: ['up-observe', 'up-on-accepted', 'up-on-dismissed', 'up-on-loaded', 'up-on-finished', 'up-observe'],
    }); });
    function csrfHeader() {
        return u.evalOption(config.csrfHeader);
    }
    function csrfParam() {
        return u.evalOption(config.csrfParam);
    }
    function csrfToken() {
        return u.evalOption(config.csrfToken);
    }
    function cspNonce() {
        return u.evalOption(config.cspNonce);
    }
    function cspNoncesFromHeader(cspHeader) {
        var nonces = [];
        if (cspHeader) {
            var parts = cspHeader.split(/\s*;\s*/);
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                if (part.indexOf('script-src') === 0) {
                    var noncePattern = /'nonce-([^']+)'/g;
                    var match = void 0;
                    while (match = noncePattern.exec(part)) {
                        nonces.push(match[1]);
                    }
                }
            }
        }
        return nonces;
    }
    function wrapMethod(method, params) {
        params.add(config.methodParam, method);
        return 'POST';
    }
    function reset() {
        config.reset();
    }
    up.on('up:framework:reset', reset);
    return {
        config: config,
        reset: reset,
        locationFromXHR: locationFromXHR,
        titleFromXHR: titleFromXHR,
        targetFromXHR: targetFromXHR,
        methodFromXHR: methodFromXHR,
        acceptLayerFromXHR: acceptLayerFromXHR,
        contextFromXHR: contextFromXHR,
        dismissLayerFromXHR: dismissLayerFromXHR,
        eventPlansFromXHR: eventPlansFromXHR,
        clearCacheFromXHR: clearCacheFromXHR,
        csrfHeader: csrfHeader,
        csrfParam: csrfParam,
        csrfToken: csrfToken,
        cspNonce: cspNonce,
        initialRequestMethod: initialRequestMethod,
        headerize: headerize,
        wrapMethod: wrapMethod,
        cspNoncesFromHeader: cspNoncesFromHeader,
    };
})();


/***/ }),
/* 75 */
/***/ (function() {

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
up.log = (function () {
    var sessionStore = new up.store.Session('up.log');
    var config = new up.Config(function () { return ({
        enabled: sessionStore.get('enabled'),
        banner: true,
        format: up.browser.canFormatLog()
    }); });
    function reset() {
        config.reset();
    }
    function printToStandard() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (config.enabled) {
            printToStream.apply(void 0, __spreadArray(['log'], args, false));
        }
    }
    var printToWarn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return printToStream.apply(void 0, __spreadArray(['warn'], args, false));
    };
    var printToError = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return printToStream.apply(void 0, __spreadArray(['error'], args, false));
    };
    function printToStream(stream, trace, message) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (message) {
            if (config.format) {
                args.unshift('');
                args.unshift('color: #666666; padding: 1px 3px; border: 1px solid #bbbbbb; border-radius: 2px; font-size: 90%; display: inline-block');
                message = "%c".concat(trace, "%c ").concat(message);
            }
            else {
                message = "[".concat(trace, "] ").concat(message);
            }
            console[stream].apply(console, __spreadArray([message], args, false));
        }
    }
    function printBanner() {
        if (!config.banner) {
            return;
        }
        var logo = " __ _____  ___  ___  / /_ __\n" +
            "/ // / _ \\/ _ \\/ _ \\/ / // /  ".concat(up.version, "\n") +
            "\\___/_//_/ .__/\\___/_/\\_. / \n" +
            "        / /            / /\n\n";
        var text = "";
        if (!up.migrate.loaded) {
            text += "Load unpoly-migrate.js to enable deprecated APIs.\n\n";
        }
        if (config.enabled) {
            text += "Call `up.log.disable()` to disable logging for this session.";
        }
        else {
            text += "Call `up.log.enable()` to enable logging for this session.";
        }
        var color = 'color: #777777';
        if (config.format) {
            console.log('%c' + logo + '%c' + text, 'font-family: monospace;' + color, color);
        }
        else {
            console.log(logo + text);
        }
    }
    up.on('up:framework:boot', printBanner);
    up.on('up:framework:reset', reset);
    function setEnabled(value) {
        sessionStore.set('enabled', value);
        config.enabled = value;
    }
    function enable() {
        setEnabled(true);
    }
    function disable() {
        setEnabled(false);
    }
    function muteUncriticalRejection(promise) {
        return promise.catch(function (error) {
            if ((typeof error !== 'object') || ((error.name !== 'AbortError') && !(error instanceof up.RenderResult) && !(error instanceof up.Response))) {
                throw error;
            }
        });
    }
    return {
        puts: printToStandard,
        error: printToError,
        warn: printToWarn,
        config: config,
        enable: enable,
        disable: disable,
        muteUncriticalRejection: muteUncriticalRejection,
        isEnabled: function () { return config.enabled; },
    };
})();
up.puts = up.log.puts;
up.warn = up.log.warn;


/***/ }),
/* 76 */
/***/ (function() {

up.syntax = (function () {
    var u = up.util;
    var e = up.element;
    var SYSTEM_MACRO_PRIORITIES = {
        '[up-back]': -100,
        '[up-content]': -200,
        '[up-drawer]': -200,
        '[up-modal]': -200,
        '[up-cover]': -200,
        '[up-popup]': -200,
        '[up-tooltip]': -200,
        '[up-dash]': -200,
        '[up-expand]': -300,
        '[data-method]': -400,
        '[data-confirm]': -400,
    };
    var compilers = [];
    var macros = [];
    function registerCompiler() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var compiler = buildCompiler(args);
        return insertCompiler(compilers, compiler);
    }
    function registerJQueryCompiler() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var compiler = registerCompiler.apply(void 0, args);
        compiler.jQuery = true;
    }
    function registerMacro() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var macro = buildCompiler(args);
        if (up.framework.evaling) {
            macro.priority = detectSystemMacroPriority(macro.selector) ||
                up.fail('Unregistered priority for system macro %o', macro.selector);
        }
        return insertCompiler(macros, macro);
    }
    function registerJQueryMacro() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var macro = registerMacro.apply(void 0, args);
        macro.jQuery = true;
        return macro;
    }
    function detectSystemMacroPriority(macroSelector) {
        macroSelector = u.evalOption(macroSelector);
        for (var substr in SYSTEM_MACRO_PRIORITIES) {
            var priority = SYSTEM_MACRO_PRIORITIES[substr];
            if (macroSelector.indexOf(substr) >= 0) {
                return priority;
            }
        }
    }
    var parseCompilerArgs = function (args) {
        var selector = args.shift();
        var callback = args.pop();
        var options = u.extractOptions(args);
        return [selector, options, callback];
    };
    function buildCompiler(args) {
        var _a = parseCompilerArgs(args), selector = _a[0], options = _a[1], callback = _a[2];
        options = u.options(options, {
            selector: selector,
            isDefault: up.framework.evaling,
            priority: 0,
            batch: false,
            jQuery: false
        });
        return u.assign(callback, options);
    }
    function insertCompiler(queue, newCompiler) {
        if (up.framework.booted) {
            up.puts('up.compiler()', 'Compiler %s was registered after booting Unpoly. Compiler will run for future fragments.', newCompiler.selector);
        }
        var existingCompiler;
        var index = 0;
        while ((existingCompiler = queue[index]) && (existingCompiler.priority >= newCompiler.priority)) {
            index += 1;
        }
        queue.splice(index, 0, newCompiler);
        return newCompiler;
    }
    function compile(fragment, options) {
        var orderedCompilers = macros.concat(compilers);
        var pass = new up.CompilerPass(fragment, orderedCompilers, options);
        pass.run();
    }
    function registerDestructor(element, destructor) {
        var destructors = element.upDestructors;
        if (!destructors) {
            destructors = [];
            element.upDestructors = destructors;
            element.classList.add('up-can-clean');
        }
        if (u.isArray(destructor)) {
            destructors.push.apply(destructors, destructor);
        }
        else {
            destructors.push(destructor);
        }
    }
    function clean(fragment, options) {
        if (options === void 0) { options = {}; }
        new up.DestructorPass(fragment, options).run();
    }
    function readData(element) {
        element = up.fragment.get(element);
        return e.jsonAttr(element, 'up-data') || {};
    }
    function reset() {
        compilers = u.filter(compilers, 'isDefault');
        macros = u.filter(macros, 'isDefault');
    }
    up.on('up:framework:reset', reset);
    return {
        compiler: registerCompiler,
        macro: registerMacro,
        $compiler: registerJQueryCompiler,
        $macro: registerJQueryMacro,
        destructor: registerDestructor,
        compile: compile,
        clean: clean,
        data: readData
    };
})();
up.compiler = up.syntax.compiler;
up.$compiler = up.syntax.$compiler;
up.destructor = up.syntax.destructor;
up.macro = up.syntax.macro;
up.$macro = up.syntax.$macro;
up.data = up.syntax.data;


/***/ }),
/* 77 */
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
up.history = (function () {
    var u = up.util;
    var e = up.element;
    var config = new up.Config(function () { return ({
        enabled: true,
        restoreTargets: ['body']
    }); });
    var previousLocation;
    var nextPreviousLocation;
    function reset() {
        config.reset();
        previousLocation = undefined;
        nextPreviousLocation = undefined;
        trackCurrentLocation();
    }
    var DEFAULT_NORMALIZE_OPTIONS = { hash: true };
    function normalizeURL(url, options) {
        options = u.merge(DEFAULT_NORMALIZE_OPTIONS, options);
        return u.normalizeURL(url, options);
    }
    function currentLocation(normalizeOptions) {
        return normalizeURL(location.href, normalizeOptions);
    }
    function trackCurrentLocation() {
        var url = currentLocation();
        if (nextPreviousLocation !== url) {
            previousLocation = nextPreviousLocation;
            nextPreviousLocation = url;
        }
    }
    trackCurrentLocation();
    var ADDITIONAL_NORMALIZE_OPTIONS_FOR_COMPARISON = { trailingSlash: false };
    function isLocation(url, options) {
        options = u.merge(ADDITIONAL_NORMALIZE_OPTIONS_FOR_COMPARISON, options);
        return normalizeURL(url, options) === currentLocation(options);
    }
    function replace(url, options) {
        if (options === void 0) { options = {}; }
        url = normalizeURL(url);
        if (manipulate('replaceState', url) && (options.event !== false)) {
            emit('up:location:changed', { url: url, reason: 'replace', log: "Replaced state for ".concat(url) });
        }
    }
    function push(url) {
        url = normalizeURL(url);
        if (!isLocation(url) && manipulate('pushState', url)) {
            up.emit('up:location:changed', { url: url, reason: 'push', log: "Advanced to location ".concat(url) });
        }
    }
    function manipulate(method, url) {
        if (config.enabled) {
            var state = buildState();
            window.history[method](state, '', url);
            trackCurrentLocation();
            return true;
        }
    }
    function buildState() {
        return { up: {} };
    }
    function restoreStateOnPop(state) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(state === null || state === void 0 ? void 0 : state.up)) return [3, 2];
                        url = currentLocation();
                        return [4, up.render({
                                url: url,
                                history: true,
                                location: url,
                                peel: true,
                                layer: 'root',
                                target: config.restoreTargets,
                                cache: true,
                                scroll: 'restore',
                                saveScroll: false
                            })];
                    case 1:
                        _a.sent();
                        url = currentLocation();
                        emit('up:location:changed', { url: url, reason: 'pop', log: "Restored location ".concat(url) });
                        return [3, 3];
                    case 2:
                        up.puts('pop', 'Ignoring a state not pushed by Unpoly (%o)', state);
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    }
    function onPop(event) {
        trackCurrentLocation();
        up.viewport.saveScroll({ location: previousLocation });
        var state = event.state;
        restoreStateOnPop(state);
    }
    function emit() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var historyLayer = u.find(up.layer.stack.reversed(), 'history');
        return historyLayer.emit.apply(historyLayer, args);
    }
    function register() {
        window.addEventListener('popstate', onPop);
        if (up.protocol.initialRequestMethod() === 'GET') {
            replace(currentLocation(), { event: false });
        }
    }
    up.on('up:framework:boot', function () {
        if ('jasmine' in window) {
            register();
        }
        else {
            setTimeout(register, 100);
        }
    });
    up.macro('a[up-back], [up-href][up-back]', function (link) {
        if (previousLocation) {
            e.setMissingAttrs(link, {
                'up-href': previousLocation,
                'up-scroll': 'restore'
            });
            link.removeAttribute('up-back');
            up.link.makeFollowable(link);
        }
    });
    up.on('up:framework:reset', reset);
    return {
        config: config,
        push: push,
        replace: replace,
        get location() { return currentLocation(); },
        get previousLocation() { return previousLocation; },
        normalizeURL: normalizeURL,
        isLocation: isLocation
    };
})();


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
__webpack_require__(79);
var u = up.util;
var e = up.element;
up.fragment = (function () {
    var config = new up.Config(function () { return ({
        badTargetClasses: [/^up-/],
        navigateOptions: {
            solo: true,
            feedback: true,
            cache: 'auto',
            fallback: true,
            focus: 'auto',
            scroll: 'auto',
            history: 'auto',
            peel: true
        },
        matchAroundOrigin: true,
        runScripts: false,
        autoHistoryTargets: [':main'],
        autoFocus: ['hash', 'autofocus', 'main-if-main', 'target-if-lost'],
        autoScroll: ['hash', 'layer-if-main']
    }); });
    u.delegate(config, 'mainTargets', function () { return up.layer.config.any; });
    function reset() {
        config.reset();
    }
    function sourceOf(element, options) {
        if (options === void 0) { options = {}; }
        element = getSmart(element, options);
        return e.closestAttr(element, 'up-source');
    }
    function timeOf(element) {
        return e.closestAttr(element, 'up-time') || '0';
    }
    var render = up.mockable(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return u.asyncify(function () {
            var options = parseTargetAndOptions(args);
            options = up.RenderOptions.preprocess(options);
            up.browser.assertConfirmed(options);
            var guardEvent = u.pluckKey(options, 'guardEvent');
            if (guardEvent) {
                guardEvent.renderOptions = options;
                up.event.assertEmitted(guardEvent, { target: options.origin });
            }
            up.RenderOptions.assertContentGiven(options);
            return (options.url ? renderRemoteContent : renderLocalContent)(options);
        });
    });
    function renderRemoteContent(options) {
        var execute = function () { return new up.Change.FromURL(options).execute(); };
        return up.feedback.aroundForOptions(options, execute);
    }
    function renderLocalContent(options) {
        up.network.mimicLocalRequest(options);
        return new up.Change.FromContent(options).execute();
    }
    var navigate = up.mockable(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var options = parseTargetAndOptions(args);
        return render(__assign(__assign({}, options), { navigate: true }));
    });
    function hello(element, options) {
        if (options === void 0) { options = {}; }
        element = getSmart(element);
        var keepPlans = options.keepPlans || [];
        var skip = keepPlans.map(function (plan) {
            emitFragmentKept(plan);
            return plan.oldElement;
        });
        up.syntax.compile(element, { skip: skip, layer: options.layer });
        emitFragmentInserted(element, options);
        return element;
    }
    function emitFragmentInserted(element, options) {
        return up.emit(element, 'up:fragment:inserted', {
            log: ['Inserted fragment %o', element],
            origin: options.origin
        });
    }
    function emitFragmentKeep(keepPlan) {
        var log = ['Keeping fragment %o', keepPlan.oldElement];
        var callback = e.callbackAttr(keepPlan.oldElement, 'up-on-keep', ['newFragment', 'newData']);
        return emitFromKeepPlan(keepPlan, 'up:fragment:keep', { log: log, callback: callback });
    }
    function emitFragmentKept(keepPlan) {
        var log = ['Kept fragment %o', keepPlan.oldElement];
        return emitFromKeepPlan(keepPlan, 'up:fragment:kept', { log: log });
    }
    function emitFromKeepPlan(keepPlan, eventType, emitDetails) {
        var keepable = keepPlan.oldElement;
        var event = up.event.build(eventType, {
            newFragment: keepPlan.newElement,
            newData: keepPlan.newData
        });
        return up.emit(keepable, event, emitDetails);
    }
    function emitFragmentDestroyed(fragment, options) {
        var _a;
        var log = (_a = options.log) !== null && _a !== void 0 ? _a : ['Destroyed fragment %o', fragment];
        var parent = options.parent || document;
        return up.emit(parent, 'up:fragment:destroyed', { fragment: fragment, parent: parent, log: log });
    }
    function isDestroying(element) {
        return !!e.closest(element, '.up-destroying');
    }
    var isNotDestroying = u.negate(isDestroying);
    function getSmart() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var options = u.extractOptions(args);
        var selector = args.pop();
        var root = args[0];
        if (u.isElementish(selector)) {
            return e.get(selector);
        }
        if (root) {
            return getDumb(root, selector, options);
        }
        return new up.FragmentFinder({
            selector: selector,
            origin: options.origin,
            layer: options.layer
        }).find();
    }
    function getDumb() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return getAll.apply(void 0, args)[0];
    }
    var CSS_HAS_SUFFIX_PATTERN = /:has\(([^)]+)\)$/;
    function getAll() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var options = u.extractOptions(args);
        var selector = args.pop();
        var root = args[0];
        selector = parseSelector(selector, root, options);
        return selector.descendants(root || document);
    }
    function getSubtree(element, selector, options) {
        if (options === void 0) { options = {}; }
        selector = parseSelector(selector, element, options);
        return selector.subtree(element);
    }
    function contains(element, selector) {
        return getSubtree(element, selector).length > 0;
    }
    function closest(element, selector, options) {
        element = e.get(element);
        selector = parseSelector(selector, element, options);
        return selector.closest(element);
    }
    function destroy() {
        var _a, _b;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var options = parseTargetAndOptions(args);
        if (options.element = getSmart(options.target, options)) {
            new up.Change.DestroyFragment(options).execute();
        }
        return (_b = (_a = up.migrate).formerlyAsync) === null || _b === void 0 ? void 0 : _b.call(_a, 'up.destroy()');
    }
    function parseTargetAndOptions(args) {
        var options = u.parseArgIntoOptions(args, 'target');
        if (u.isElement(options.target)) {
            options.origin || (options.origin = options.target);
        }
        return options;
    }
    function markFragmentAsDestroying(element) {
        element.classList.add('up-destroying');
        element.setAttribute('aria-hidden', 'true');
    }
    function reload() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var options = parseTargetAndOptions(args);
        options.target || (options.target = ':main');
        var element = getSmart(options.target, options);
        options.url || (options.url = sourceOf(element));
        options.headers || (options.headers = {});
        options.headers[up.protocol.headerize('reloadFromTime')] = timeOf(element);
        return render(options);
    }
    function visit(url, options) {
        return navigate(__assign(__assign({}, options), { url: url }));
    }
    function successKey(key) {
        return u.unprefixCamelCase(key, 'fail');
    }
    function failKey(key) {
        if (!key.match(/^fail[A-Z]/)) {
            return u.prefixCamelCase(key, 'fail');
        }
    }
    function toTarget(element) {
        if (u.isString(element)) {
            return element;
        }
        element = e.get(element);
        var value;
        if (e.isSingleton(element)) {
            return e.tagName(element);
        }
        else if (value = element.getAttribute("up-id")) {
            return e.attributeSelector('up-id', value);
        }
        else if (value = element.getAttribute("id")) {
            return e.idSelector(value);
        }
        else if (value = element.getAttribute("name")) {
            return e.tagName(element) + e.attributeSelector('name', value);
        }
        else if (value = u.presence(u.filter(element.classList, isGoodClassForTarget))) {
            var selector = '';
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var goodClass = value_1[_i];
                selector += e.classSelector(goodClass);
            }
            return selector;
        }
        else {
            return e.tagName(element);
        }
    }
    function isGoodClassForTarget(klass) {
        function matchesPattern(pattern) {
            if (u.isRegExp(pattern)) {
                return pattern.test(klass);
            }
            else {
                return pattern === klass;
            }
        }
        return !u.some(config.badTargetClasses, matchesPattern);
    }
    function resolveOriginReference(target, options) {
        if (options === void 0) { options = {}; }
        var origin = options.origin;
        return target.replace(/&|:origin\b/, function (match) {
            if (origin) {
                return toTarget(origin);
            }
            else {
                up.fail('Missing { origin } element to resolve "%s" reference (found in %s)', match, target);
            }
        });
    }
    function expandTargets(targets, options) {
        if (options === void 0) { options = {}; }
        var layer = options.layer;
        if (layer !== 'new' && !(layer instanceof up.Layer)) {
            up.fail('Must pass an up.Layer as { layer } option, but got %o', layer);
        }
        targets = u.copy(u.wrapList(targets));
        var expanded = [];
        while (targets.length) {
            var target = targets.shift();
            if (target === ':main' || target === true) {
                var mode = layer === 'new' ? options.mode : layer.mode;
                targets.unshift.apply(targets, up.layer.mainTargets(mode));
            }
            else if (target === ':layer') {
                if (layer !== 'new' && !layer.opening) {
                    targets.unshift(layer.getFirstSwappableElement());
                }
            }
            else if (u.isElementish(target)) {
                expanded.push(toTarget(target));
            }
            else if (u.isString(target)) {
                expanded.push(resolveOriginReference(target, options));
            }
            else {
            }
        }
        return u.uniq(expanded);
    }
    function parseSelector(selector, element, options) {
        if (options === void 0) { options = {}; }
        var filters = [];
        if (!options.destroying) {
            filters.push(isNotDestroying);
        }
        options.layer || (options.layer = element);
        var layers = up.layer.getAll(options);
        if (options.layer !== 'any' && !(element && e.isDetached(element))) {
            filters.push(function (match) { return u.some(layers, function (layer) { return layer.contains(match); }); });
        }
        var expandedTargets = up.fragment.expandTargets(selector, __assign(__assign({}, options), { layer: layers[0] }));
        expandedTargets = expandedTargets.map(function (target) {
            target = target.replace(CSS_HAS_SUFFIX_PATTERN, function (match, descendantSelector) {
                filters.push(function (element) { return element.querySelector(descendantSelector); });
                return '';
            });
            return target || '*';
        });
        return new up.Selector(expandedTargets, filters);
    }
    function hasAutoHistory(fragment) {
        if (contains(fragment, config.autoHistoryTargets)) {
            return true;
        }
        else {
            up.puts('up.render()', "Will not auto-update history because fragment doesn't contain a selector from up.fragment.config.autoHistoryTargets");
            return false;
        }
    }
    function matches(element, selector, options) {
        if (options === void 0) { options = {}; }
        element = e.get(element);
        selector = parseSelector(selector, element, options);
        return selector.matches(element);
    }
    up.on('up:framework:boot', function () {
        var body = document.body;
        body.setAttribute('up-source', u.normalizeURL(location.href, { hash: false }));
        hello(body);
        if (!up.browser.canPushState()) {
            return up.warn('Cannot push history changes. Next fragment update will load in a new page.');
        }
    });
    up.on('up:framework:reset', reset);
    return {
        config: config,
        reload: reload,
        destroy: destroy,
        render: render,
        navigate: navigate,
        get: getSmart,
        getDumb: getDumb,
        all: getAll,
        subtree: getSubtree,
        contains: contains,
        closest: closest,
        source: sourceOf,
        hello: hello,
        visit: visit,
        markAsDestroying: markFragmentAsDestroying,
        emitInserted: emitFragmentInserted,
        emitDestroyed: emitFragmentDestroyed,
        emitKeep: emitFragmentKeep,
        emitKept: emitFragmentKept,
        successKey: successKey,
        failKey: failKey,
        expandTargets: expandTargets,
        toTarget: toTarget,
        matches: matches,
        hasAutoHistory: hasAutoHistory
    };
})();
up.reload = up.fragment.reload;
up.destroy = up.fragment.destroy;
up.render = up.fragment.render;
up.navigate = up.fragment.navigate;
up.hello = up.fragment.hello;
up.visit = up.fragment.visit;
u.delegate(up, 'context', function () { return up.layer.current; });


/***/ }),
/* 79 */
/***/ (function() {



/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
__webpack_require__(81);
up.viewport = (function () {
    var u = up.util;
    var e = up.element;
    var f = up.fragment;
    var config = new up.Config(function () { return ({
        viewportSelectors: ['[up-viewport]', '[up-fixed]'],
        fixedTop: ['[up-fixed~=top]'],
        fixedBottom: ['[up-fixed~=bottom]'],
        anchoredRight: ['[up-anchored~=right]', '[up-fixed~=top]', '[up-fixed~=bottom]', '[up-fixed~=right]'],
        revealSnap: 200,
        revealPadding: 0,
        revealTop: false,
        revealMax: function () { return 0.5 * window.innerHeight; },
        scrollSpeed: 1
    }); });
    var scrollingController = new up.MotionController('scrolling');
    function reset() {
        config.reset();
        scrollingController.reset();
    }
    function scroll(viewport, scrollTop, options) {
        if (options === void 0) { options = {}; }
        viewport = f.get(viewport, options);
        var motion = new up.ScrollMotion(viewport, scrollTop, options);
        scrollingController.startMotion(viewport, motion, options);
    }
    function anchoredRight() {
        var selector = config.anchoredRight.join(',');
        return f.all(selector, { layer: 'root' });
    }
    function reveal(element, options) {
        options = u.options(options);
        element = f.get(element, options);
        if (!(options.layer = up.layer.get(element))) {
            return up.error.failed.async('Cannot reveal a detached element');
        }
        if (options.peel) {
            options.layer.peel();
        }
        var motion = new up.RevealMotion(element, options);
        return scrollingController.startMotion(element, motion, options);
    }
    function doFocus(element, options) {
        if (options === void 0) { options = {}; }
        if (up.browser.isIE11()) {
            var viewport = closest(element);
            var oldScrollTop = viewport.scrollTop;
            element.focus();
            viewport.scrollTop = oldScrollTop;
        }
        else {
            element.focus({ preventScroll: true });
        }
        if (!options.preventScroll) {
            return reveal(element);
        }
    }
    function tryFocus(element, options) {
        doFocus(element, options);
        return element === document.activeElement;
    }
    function isNativelyFocusable(element) {
        return e.matches(element, 'a[href], button, textarea, input, select');
    }
    function makeFocusable(element) {
        if (!element.hasAttribute('tabindex') && !isNativelyFocusable(element)) {
            element.setAttribute('tabindex', '-1');
            element.classList.add('up-focusable-content');
        }
    }
    function revealHash(hash, options) {
        if (hash === void 0) { hash = location.hash; }
        var match = firstHashTarget(hash, options);
        if (match) {
            return up.reveal(match, { top: true });
        }
    }
    function allSelector() {
        return __spreadArray([rootSelector()], config.viewportSelectors, true).join(',');
    }
    function closest(target, options) {
        if (options === void 0) { options = {}; }
        var element = f.get(target, options);
        return e.closest(element, allSelector());
    }
    function getSubtree(element, options) {
        if (options === void 0) { options = {}; }
        element = f.get(element, options);
        return e.subtree(element, allSelector());
    }
    function getAround(element, options) {
        if (options === void 0) { options = {}; }
        element = f.get(element, options);
        return e.around(element, allSelector());
    }
    function getAll(options) {
        if (options === void 0) { options = {}; }
        return f.all(allSelector(), options);
    }
    function rootSelector() {
        var element;
        if ((element = document.scrollingElement)) {
            return element.tagName;
        }
        else {
            return 'html';
        }
    }
    function getRoot() {
        return document.querySelector(rootSelector());
    }
    function rootWidth() {
        return e.root.clientWidth;
    }
    function rootHeight() {
        return e.root.clientHeight;
    }
    function isRoot(element) {
        return e.matches(element, rootSelector());
    }
    function rootHasReducedWidthFromScrollbar() {
        return window.innerWidth > document.documentElement.offsetWidth;
    }
    function rootOverflowElement() {
        var body = document.body;
        var html = document.documentElement;
        var element = u.find([html, body], wasChosenAsOverflowingElement);
        return element || getRoot();
    }
    function wasChosenAsOverflowingElement(element) {
        var overflowY = e.style(element, 'overflow-y');
        return overflowY === 'auto' || overflowY === 'scroll';
    }
    var scrollbarWidth = u.memoize(function () {
        var outerStyle = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100px',
            height: '100px',
            overflowY: 'scroll'
        };
        var outer = up.element.affix(document.body, '[up-viewport]', { style: outerStyle });
        var width = outer.offsetWidth - outer.clientWidth;
        up.element.remove(outer);
        return width;
    });
    function scrollTopKey(viewport) {
        return up.fragment.toTarget(viewport);
    }
    function fixedElements(root) {
        if (root === void 0) { root = document; }
        var queryParts = ['[up-fixed]'].concat(config.fixedTop).concat(config.fixedBottom);
        return root.querySelectorAll(queryParts.join(','));
    }
    function saveScroll() {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _b = parseOptions(args), viewports = _b[0], options = _b[1];
        var url = options.location || options.layer.location;
        if (url) {
            var tops = (_a = options.tops) !== null && _a !== void 0 ? _a : getScrollTops(viewports);
            options.layer.lastScrollTops.set(url, tops);
        }
    }
    function getScrollTops(viewports) {
        return u.mapObject(viewports, function (viewport) { return [scrollTopKey(viewport), viewport.scrollTop]; });
    }
    function restoreScroll() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseOptions(args), viewports = _a[0], options = _a[1];
        var url = options.layer.location;
        var scrollTopsForURL = options.layer.lastScrollTops.get(url) || {};
        up.puts('up.viewport.restoreScroll()', 'Restoring scroll positions for URL %s to %o', url, scrollTopsForURL);
        return setScrollTops(viewports, scrollTopsForURL);
    }
    function parseOptions(args) {
        var options = u.copy(u.extractOptions(args));
        options.layer = up.layer.get(options);
        var viewports;
        if (args[0]) {
            viewports = [closest(args[0], options)];
        }
        else if (options.around) {
            viewports = getAround(options.around, options);
        }
        else {
            viewports = getAll(options);
        }
        return [viewports, options];
    }
    function resetScroll() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = parseOptions(args), viewports = _a[0], _options = _a[1];
        return setScrollTops(viewports, {});
    }
    function setScrollTops(viewports, tops) {
        var allScrollPromises = u.map(viewports, function (viewport) {
            var key = scrollTopKey(viewport);
            var scrollTop = tops[key] || 0;
            return scroll(viewport, scrollTop, { duration: 0 });
        });
        return Promise.all(allScrollPromises);
    }
    function absolutize(element, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var viewport = closest(element);
        var viewportRect = viewport.getBoundingClientRect();
        var originalRect = element.getBoundingClientRect();
        var boundsRect = new up.Rect({
            left: originalRect.left - viewportRect.left,
            top: originalRect.top - viewportRect.top,
            width: originalRect.width,
            height: originalRect.height
        });
        (_a = options.afterMeasure) === null || _a === void 0 ? void 0 : _a.call(options);
        e.setStyle(element, {
            position: element.style.position === 'static' ? 'static' : 'relative',
            top: 'auto',
            right: 'auto',
            bottom: 'auto',
            left: 'auto',
            width: '100%',
            height: '100%'
        });
        var bounds = e.createFromSelector('up-bounds');
        e.insertBefore(element, bounds);
        bounds.appendChild(element);
        var moveBounds = function (diffX, diffY) {
            boundsRect.left += diffX;
            boundsRect.top += diffY;
            return e.setStyle(bounds, boundsRect);
        };
        moveBounds(0, 0);
        var newElementRect = element.getBoundingClientRect();
        moveBounds(originalRect.left - newElementRect.left, originalRect.top - newElementRect.top);
        u.each(fixedElements(element), e.fixedToAbsolute);
        return {
            bounds: bounds,
            moveBounds: moveBounds
        };
    }
    function firstHashTarget(hash, options) {
        if (options === void 0) { options = {}; }
        if (hash = pureHash(hash)) {
            var selector = [
                e.attributeSelector('id', hash),
                'a' + e.attributeSelector('name', hash)
            ].join(',');
            return f.get(selector, options);
        }
    }
    function pureHash(value) {
        return value === null || value === void 0 ? void 0 : value.replace(/^#/, '');
    }
    var userScrolled = false;
    up.on('scroll', { once: true, beforeBoot: true }, function () { return userScrolled = true; });
    up.on('up:framework:boot', function () {
        u.task(function () {
            if (!userScrolled) {
                return revealHash();
            }
        });
    });
    up.on(window, 'hashchange', function () { return revealHash(); });
    up.on('up:framework:reset', reset);
    return {
        reveal: reveal,
        revealHash: revealHash,
        firstHashTarget: firstHashTarget,
        scroll: scroll,
        config: config,
        get: closest,
        subtree: getSubtree,
        around: getAround,
        all: getAll,
        rootSelector: rootSelector,
        get root() { return getRoot(); },
        rootWidth: rootWidth,
        rootHeight: rootHeight,
        rootHasReducedWidthFromScrollbar: rootHasReducedWidthFromScrollbar,
        rootOverflowElement: rootOverflowElement,
        isRoot: isRoot,
        scrollbarWidth: scrollbarWidth,
        saveScroll: saveScroll,
        restoreScroll: restoreScroll,
        resetScroll: resetScroll,
        anchoredRight: anchoredRight,
        absolutize: absolutize,
        focus: doFocus,
        tryFocus: tryFocus,
        makeFocusable: makeFocusable,
    };
})();
up.focus = up.viewport.focus;
up.scroll = up.viewport.scroll;
up.reveal = up.viewport.reveal;


/***/ }),
/* 81 */
/***/ (function() {



/***/ }),
/* 82 */
/***/ (function() {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
up.motion = (function () {
    var u = up.util;
    var e = up.element;
    var namedAnimations = {};
    var namedTransitions = {};
    var motionController = new up.MotionController('motion');
    var config = new up.Config(function () { return ({
        duration: 175,
        easing: 'ease',
        enabled: !matchMedia('(prefers-reduced-motion: reduce)').matches
    }); });
    function pickDefault(registry) {
        return u.pickBy(registry, function (value) { return value.isDefault; });
    }
    function reset() {
        motionController.reset();
        namedAnimations = pickDefault(namedAnimations);
        namedTransitions = pickDefault(namedTransitions);
        config.reset();
    }
    function isEnabled() {
        return config.enabled;
    }
    function animate(element, animation, options) {
        element = up.fragment.get(element);
        options = u.options(options);
        var animationFn = findAnimationFn(animation);
        var willRun = willAnimate(element, animation, options);
        if (willRun) {
            var runNow = function () { return animationFn(element, options); };
            return motionController.startFunction(element, runNow, options);
        }
        else {
            return skipAnimate(element, animation);
        }
    }
    function willAnimate(element, animationOrTransition, options) {
        applyConfig(options);
        return isEnabled() && !isNone(animationOrTransition) && (options.duration > 0) && !e.isSingleton(element);
    }
    function skipAnimate(element, animation) {
        if (u.isOptions(animation)) {
            e.setStyle(element, animation);
        }
        return Promise.resolve();
    }
    function animateNow(element, lastFrame, options) {
        options = __assign(__assign({}, options), { finishEvent: motionController.finishEvent });
        var cssTransition = new up.CSSTransition(element, lastFrame, options);
        return cssTransition.start();
    }
    function applyConfig(options) {
        options.easing || (options.easing = config.easing);
        options.duration || (options.duration = config.duration);
    }
    function findNamedAnimation(name) {
        return namedAnimations[name] || up.fail("Unknown animation %o", name);
    }
    function finish(element) {
        return motionController.finish(element);
    }
    function morph(oldElement, newElement, transitionObject, options) {
        options = u.options(options);
        applyConfig(options);
        oldElement = up.fragment.get(oldElement);
        newElement = up.fragment.get(newElement);
        var transitionFn = findTransitionFn(transitionObject);
        var willMorph = willAnimate(oldElement, transitionFn, options);
        var beforeStart = u.pluckKey(options, 'beforeStart') || u.noop;
        var afterInsert = u.pluckKey(options, 'afterInsert') || u.noop;
        var beforeDetach = u.pluckKey(options, 'beforeDetach') || u.noop;
        var afterDetach = u.pluckKey(options, 'afterDetach') || u.noop;
        var scrollNew = u.pluckKey(options, 'scrollNew') || u.asyncNoop;
        beforeStart();
        if (willMorph) {
            if (motionController.isActive(oldElement) && (options.trackMotion === false)) {
                return transitionFn(oldElement, newElement, options);
            }
            up.puts('up.morph()', 'Morphing %o to %o with transition %O', oldElement, newElement, transitionObject);
            var viewport_1 = up.viewport.get(oldElement);
            var scrollTopBeforeReveal_1 = viewport_1.scrollTop;
            var oldRemote_1 = up.viewport.absolutize(oldElement, {
                afterMeasure: function () {
                    e.insertBefore(oldElement, newElement);
                    afterInsert();
                }
            });
            var trackable = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var scrollTopAfterReveal;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, scrollNew()];
                            case 1:
                                _a.sent();
                                scrollTopAfterReveal = viewport_1.scrollTop;
                                oldRemote_1.moveBounds(0, scrollTopAfterReveal - scrollTopBeforeReveal_1);
                                return [4, transitionFn(oldElement, newElement, options)];
                            case 2:
                                _a.sent();
                                beforeDetach();
                                e.remove(oldRemote_1.bounds);
                                afterDetach();
                                return [2];
                        }
                    });
                });
            };
            return motionController.startFunction([oldElement, newElement], trackable, options);
        }
        else {
            beforeDetach();
            swapElementsDirectly(oldElement, newElement);
            afterInsert();
            afterDetach();
            return scrollNew();
        }
    }
    function findTransitionFn(object) {
        if (isNone(object)) {
            return undefined;
        }
        else if (u.isFunction(object)) {
            return object;
        }
        else if (u.isArray(object)) {
            return composeTransitionFn.apply(void 0, object);
        }
        else if (u.isString(object)) {
            var namedTransition = void 0;
            if (object.indexOf('/') >= 0) {
                return composeTransitionFn.apply(void 0, object.split('/'));
            }
            else if (namedTransition = namedTransitions[object]) {
                return findTransitionFn(namedTransition);
            }
        }
        else {
            return up.fail("Unknown transition %o", object);
        }
    }
    function composeTransitionFn(oldAnimation, newAnimation) {
        if (!isNone(oldAnimation) && !isNone(newAnimation)) {
            var oldAnimationFn_1 = findAnimationFn(oldAnimation) || u.asyncNoop;
            var newAnimationFn_1 = findAnimationFn(newAnimation) || u.asyncNoop;
            return function (oldElement, newElement, options) { return Promise.all([
                oldAnimationFn_1(oldElement, options),
                newAnimationFn_1(newElement, options)
            ]); };
        }
    }
    function findAnimationFn(object) {
        if (isNone(object)) {
            return undefined;
        }
        else if (u.isFunction(object)) {
            return object;
        }
        else if (u.isString(object)) {
            return findNamedAnimation(object);
        }
        else if (u.isOptions(object)) {
            return function (element, options) { return animateNow(element, object, options); };
        }
        else {
            return up.fail('Unknown animation %o', object);
        }
    }
    var swapElementsDirectly = up.mockable(function (oldElement, newElement) {
        e.replace(oldElement, newElement);
    });
    function registerTransition(name, transition) {
        var fn = findTransitionFn(transition);
        fn.isDefault = up.framework.evaling;
        namedTransitions[name] = fn;
    }
    function registerAnimation(name, animation) {
        var fn = findAnimationFn(animation);
        fn.isDefault = up.framework.evaling;
        namedAnimations[name] = fn;
    }
    up.on('up:framework:boot', function () {
        if (!isEnabled()) {
            up.puts('up.motion', 'Animations are disabled');
        }
    });
    function isNone(animationOrTransition) {
        return !animationOrTransition || animationOrTransition === 'none';
    }
    function registerOpacityAnimation(name, from, to) {
        registerAnimation(name, function (element, options) {
            element.style.opacity = 0;
            e.setStyle(element, { opacity: from });
            return animateNow(element, { opacity: to }, options);
        });
    }
    registerOpacityAnimation('fade-in', 0, 1);
    registerOpacityAnimation('fade-out', 1, 0);
    function translateCSS(dx, dy) {
        return { transform: "translate(".concat(dx, "px, ").concat(dy, "px)") };
    }
    function untranslatedBox(element) {
        e.setStyle(element, translateCSS(0, 0));
        return element.getBoundingClientRect();
    }
    function registerMoveAnimations(direction, boxToTransform) {
        var animationToName = "move-to-".concat(direction);
        var animationFromName = "move-from-".concat(direction);
        registerAnimation(animationToName, function (element, options) {
            var box = untranslatedBox(element);
            var transform = boxToTransform(box);
            return animateNow(element, transform, options);
        });
        registerAnimation(animationFromName, function (element, options) {
            var box = untranslatedBox(element);
            var transform = boxToTransform(box);
            e.setStyle(element, transform);
            return animateNow(element, translateCSS(0, 0), options);
        });
    }
    registerMoveAnimations('top', function (box) {
        var travelDistance = box.top + box.height;
        return translateCSS(0, -travelDistance);
    });
    registerMoveAnimations('bottom', function (box) {
        var travelDistance = up.viewport.rootHeight() - box.top;
        return translateCSS(0, travelDistance);
    });
    registerMoveAnimations('left', function (box) {
        var travelDistance = box.left + box.width;
        return translateCSS(-travelDistance, 0);
    });
    registerMoveAnimations('right', function (box) {
        var travelDistance = up.viewport.rootWidth() - box.left;
        return translateCSS(travelDistance, 0);
    });
    registerTransition('cross-fade', ['fade-out', 'fade-in']);
    registerTransition('move-left', ['move-to-left', 'move-from-right']);
    registerTransition('move-right', ['move-to-right', 'move-from-left']);
    registerTransition('move-up', ['move-to-top', 'move-from-bottom']);
    registerTransition('move-down', ['move-to-bottom', 'move-from-top']);
    up.on('up:framework:reset', reset);
    return {
        morph: morph,
        animate: animate,
        finish: finish,
        finishCount: function () { return motionController.finishCount; },
        transition: registerTransition,
        animation: registerAnimation,
        config: config,
        isEnabled: isEnabled,
        isNone: isNone,
        willAnimate: willAnimate,
        swapElementsDirectly: swapElementsDirectly
    };
})();
up.transition = up.motion.transition;
up.animation = up.motion.animation;
up.morph = up.motion.morph;
up.animate = up.motion.animate;


/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

__webpack_require__(84);
var u = up.util;
up.network = (function () {
    var config = new up.Config(function () { return ({
        concurrency: 4,
        wrapMethod: true,
        cacheSize: 70,
        cacheExpiry: 1000 * 60 * 5,
        badDownlink: 0.6,
        badRTT: 750,
        badResponseTime: 400,
        autoCache: function (request) { return request.isSafe(); },
        clearCache: function (request, _response) { return !request.isSafe(); },
        requestMetaKeys: ['target', 'failTarget', 'mode', 'failMode', 'context', 'failContext'],
        progressBar: true
    }); });
    var queue = new up.Request.Queue();
    var cache = new up.Request.Cache();
    var progressBar = null;
    function reset() {
        abortRequests();
        queue.reset();
        config.reset();
        cache.clear();
        progressBar === null || progressBar === void 0 ? void 0 : progressBar.destroy();
        progressBar = null;
    }
    function makeRequest() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var request = new up.Request(parseRequestOptions(args));
        useCachedRequest(request) || queueRequest(request);
        handleSolo(request);
        return request;
    }
    function mimicLocalRequest(options) {
        handleSolo(options);
        var clearCache = options.clearCache;
        if (clearCache) {
            cache.clear(clearCache);
        }
    }
    function handleSolo(requestOrOptions) {
        var solo = requestOrOptions.solo;
        if (solo && isBusy()) {
            up.puts('up.request()', 'Change with { solo } option will abort other requests');
            if (requestOrOptions instanceof up.Request) {
                queue.abortExcept(requestOrOptions, solo);
            }
            else {
                abortRequests(solo);
            }
        }
    }
    function parseRequestOptions(args) {
        var _a, _b;
        var options = u.extractOptions(args);
        if (!options.url) {
            options.url = args[0];
        }
        (_b = (_a = up.migrate).handleRequestOptions) === null || _b === void 0 ? void 0 : _b.call(_a, options);
        return options;
    }
    function useCachedRequest(request) {
        var cachedRequest;
        if (request.willCache() && (cachedRequest = cache.get(request))) {
            up.puts('up.request()', 'Re-using previous request to %s %s', request.method, request.url);
            if (!request.preload) {
                queue.promoteToForeground(cachedRequest);
            }
            request.followState(cachedRequest);
            return true;
        }
    }
    function queueRequest(request) {
        if (request.preload && !request.isSafe()) {
            up.fail('Will not preload request to %s', request.description);
        }
        handleCaching(request);
        queue.asap(request);
        return true;
    }
    function handleCaching(request) {
        if (request.willCache()) {
            cache.set(request, request);
        }
        return u.always(request, function (response) {
            var _a, _b;
            var clearCache = (_b = (_a = response.clearCache) !== null && _a !== void 0 ? _a : request.clearCache) !== null && _b !== void 0 ? _b : config.clearCache(request, response);
            if (clearCache) {
                cache.clear(clearCache);
            }
            if (request.willCache() || cache.get(request)) {
                cache.set(request, request);
            }
            if (!response.ok) {
                cache.remove(request);
            }
        });
    }
    function isBusy() {
        return queue.isBusy();
    }
    var isIdle = u.negate(isBusy);
    function loadPage(requestsAttrs) {
        new up.Request(requestsAttrs).loadPage();
    }
    function shouldReduceRequests() {
        var netInfo = navigator.connection;
        if (netInfo) {
            return netInfo.saveData ||
                (netInfo.rtt && (netInfo.rtt > config.badRTT)) ||
                (netInfo.downlink && (netInfo.downlink < config.badDownlink));
        }
    }
    function abortRequests() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        queue.abort.apply(queue, args);
    }
    function registerAliasForRedirect(request, response) {
        if (request.cache && response.url && request.url !== response.url) {
            var newRequest = request.variant({
                method: response.method,
                url: response.url
            });
            cache.alias(request, newRequest);
        }
    }
    function isSafeMethod(method) {
        return u.contains(['GET', 'OPTIONS', 'HEAD'], u.normalizeMethod(method));
    }
    function onLate() {
        if (u.evalOption(config.progressBar)) {
            progressBar = new up.ProgressBar();
        }
    }
    function onRecover() {
        progressBar === null || progressBar === void 0 ? void 0 : progressBar.conclude();
    }
    up.on('up:request:late', onLate);
    up.on('up:request:recover', onRecover);
    up.on('up:framework:reset', reset);
    return {
        request: makeRequest,
        cache: cache,
        isIdle: isIdle,
        isBusy: isBusy,
        isSafeMethod: isSafeMethod,
        config: config,
        abort: abortRequests,
        registerAliasForRedirect: registerAliasForRedirect,
        queue: queue,
        shouldReduceRequests: shouldReduceRequests,
        mimicLocalRequest: mimicLocalRequest,
        loadPage: loadPage,
    };
})();
up.request = up.network.request;
up.cache = up.network.cache;


/***/ }),
/* 84 */
/***/ (function() {



/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
__webpack_require__(86);
var u = up.util;
var e = up.element;
up.layer = (function () {
    var LAYER_CLASSES = [
        up.Layer.Root,
        up.Layer.Modal,
        up.Layer.Popup,
        up.Layer.Drawer,
        up.Layer.Cover
    ];
    var config = new up.Config(function () {
        var newConfig = {
            mode: 'modal',
            any: {
                mainTargets: [
                    "[up-main='']",
                    'main',
                    ':layer'
                ]
            },
            root: {
                mainTargets: ['[up-main~=root]'],
                history: true
            },
            overlay: {
                mainTargets: ['[up-main~=overlay]'],
                openAnimation: 'fade-in',
                closeAnimation: 'fade-out',
                dismissLabel: '×',
                dismissAriaLabel: 'Dismiss dialog',
                dismissable: true,
                history: 'auto'
            },
            cover: {
                mainTargets: ['[up-main~=cover]']
            },
            drawer: {
                mainTargets: ['[up-main~=drawer]'],
                backdrop: true,
                position: 'left',
                size: 'medium',
                openAnimation: function (layer) {
                    switch (layer.position) {
                        case 'left': return 'move-from-left';
                        case 'right': return 'move-from-right';
                    }
                },
                closeAnimation: function (layer) {
                    switch (layer.position) {
                        case 'left': return 'move-to-left';
                        case 'right': return 'move-to-right';
                    }
                }
            },
            modal: {
                mainTargets: ['[up-main~=modal]'],
                backdrop: true,
                size: 'medium'
            },
            popup: {
                mainTargets: ['[up-main~=popup]'],
                position: 'bottom',
                size: 'medium',
                align: 'left',
                dismissable: 'outside key'
            }
        };
        for (var _i = 0, LAYER_CLASSES_1 = LAYER_CLASSES; _i < LAYER_CLASSES_1.length; _i++) {
            var Class = LAYER_CLASSES_1[_i];
            newConfig[Class.mode].Class = Class;
        }
        return newConfig;
    });
    var stack = null;
    var handlers = [];
    function mainTargets(mode) {
        return u.flatMap(modeConfigs(mode), 'mainTargets');
    }
    function modeConfigs(mode) {
        if (mode === 'root') {
            return [config.root, config.any];
        }
        else {
            return [config[mode], config.overlay, config.any];
        }
    }
    function normalizeOptions(options) {
        var _a, _b;
        (_b = (_a = up.migrate).handleLayerOptions) === null || _b === void 0 ? void 0 : _b.call(_a, options);
        if (u.isGiven(options.layer)) {
            var match = String(options.layer).match(/^(new|shatter|swap)( (\w+))?/);
            if (match) {
                options.layer = 'new';
                var openMethod = match[1];
                var shorthandMode = match[3];
                options.mode || (options.mode = shorthandMode || config.mode);
                if (openMethod === 'swap') {
                    if (up.layer.isOverlay()) {
                        options.baseLayer = 'parent';
                    }
                }
                else if (openMethod === 'shatter') {
                    options.baseLayer = 'root';
                }
            }
        }
        else {
            if (options.mode) {
                options.layer = 'new';
            }
            else if (u.isElementish(options.target)) {
                options.layer = stack.get(options.target, { normalizeLayerOptions: false });
            }
            else if (options.origin) {
                options.layer = 'origin';
            }
            else {
                options.layer = 'current';
            }
        }
        if (!options.context) {
            options.context = {};
        }
        options.baseLayer = stack.get('current', __assign(__assign({}, options), { normalizeLayerOptions: false }));
    }
    function build(options, beforeNew) {
        var _a;
        var mode = options.mode;
        var Class = config[mode].Class;
        var configs = u.reverse(modeConfigs(mode));
        var handleDeprecatedConfig = up.migrate.handleLayerConfig;
        if (handleDeprecatedConfig) {
            configs.forEach(handleDeprecatedConfig);
        }
        (_a = options.openAnimation) !== null && _a !== void 0 ? _a : (options.openAnimation = u.pluckKey(options, 'animation'));
        options = u.mergeDefined.apply(u, __spreadArray(__spreadArray([], configs, false), [{ mode: mode, stack: stack }, options], false));
        if (beforeNew) {
            options = beforeNew(options);
        }
        return new Class(options);
    }
    function openCallbackAttr(link, attr) {
        return e.callbackAttr(link, attr, ['layer']);
    }
    function closeCallbackAttr(link, attr) {
        return e.callbackAttr(link, attr, ['layer', 'value']);
    }
    function reset() {
        config.reset();
        stack.reset();
        handlers = u.filter(handlers, 'isDefault');
    }
    function open(options) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = u.options(options, {
                            layer: 'new',
                            defaultToEmptyContent: true,
                            navigate: true
                        });
                        return [4, up.render(options)];
                    case 1:
                        result = _a.sent();
                        return [2, result.layer];
                }
            });
        });
    }
    function ask(options) {
        return new Promise(function (resolve, reject) {
            options = __assign(__assign({}, options), { onAccepted: function (event) { return resolve(event.value); }, onDismissed: function (event) { return reject(event.value); } });
            open(options);
        });
    }
    function anySelector() {
        return u.map(LAYER_CLASSES, function (Class) { return Class.selector(); }).join(',');
    }
    function optionToString(option) {
        if (u.isString(option)) {
            return "layer \"".concat(option, "\"");
        }
        else {
            return option.toString();
        }
    }
    up.on('up:fragment:destroyed', function () {
        stack.sync();
    });
    up.on('up:framework:evaled', function () {
        stack = new up.LayerStack();
    });
    up.on('up:framework:reset', reset);
    var api = {
        config: config,
        mainTargets: mainTargets,
        open: open,
        build: build,
        ask: ask,
        normalizeOptions: normalizeOptions,
        openCallbackAttr: openCallbackAttr,
        closeCallbackAttr: closeCallbackAttr,
        anySelector: anySelector,
        optionToString: optionToString,
        get stack() { return stack; }
    };
    u.delegate(api, [
        'get',
        'getAll',
        'root',
        'overlays',
        'current',
        'front',
        'sync',
        'count',
        'dismissOverlays'
    ], function () { return stack; });
    u.delegate(api, [
        'accept',
        'dismiss',
        'isRoot',
        'isOverlay',
        'isFront',
        'on',
        'off',
        'emit',
        'parent',
        'history',
        'location',
        'mode',
        'context',
        'element',
        'contains',
        'size',
        'affix'
    ], function () { return stack.current; });
    return api;
})();


/***/ }),
/* 86 */
/***/ (function() {



/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
__webpack_require__(88);
up.link = (function () {
    var u = up.util;
    var e = up.element;
    var linkPreloader = new up.LinkPreloader();
    var lastMousedownTarget = null;
    var LINKS_WITH_LOCAL_HTML = ['a[up-content]', 'a[up-fragment]', 'a[up-document]'];
    var LINKS_WITH_REMOTE_HTML = ['a[href]', '[up-href]'];
    var ATTRIBUTES_SUGGESTING_FOLLOW = ['[up-follow]', '[up-target]', '[up-layer]', '[up-transition]', '[up-preload]', '[up-instant]'];
    function combineFollowableSelectors(elementSelectors, attributeSelectors) {
        return u.flatMap(elementSelectors, function (elementSelector) { return attributeSelectors.map(function (attributeSelector) { return elementSelector + attributeSelector; }); });
    }
    var config = new up.Config(function () { return ({
        followSelectors: combineFollowableSelectors(LINKS_WITH_REMOTE_HTML, ATTRIBUTES_SUGGESTING_FOLLOW).concat(LINKS_WITH_LOCAL_HTML),
        noFollowSelectors: ['[up-follow=false]', 'a[download]', 'a[target]', 'a[href^="#"]:not([up-content]):not([up-fragment]):not([up-document])', 'a[href^="javascript:"]'],
        instantSelectors: ['[up-instant]'],
        noInstantSelectors: ['[up-instant=false]', '[onclick]'],
        preloadSelectors: combineFollowableSelectors(LINKS_WITH_REMOTE_HTML, ['[up-preload]']),
        noPreloadSelectors: ['[up-preload=false]'],
        clickableSelectors: LINKS_WITH_LOCAL_HTML.concat(['[up-emit]', '[up-accept]', '[up-dismiss]', '[up-clickable]']),
        preloadDelay: 90,
        preloadEnabled: 'auto'
    }); });
    function fullFollowSelector() {
        return config.followSelectors.join(',');
    }
    function fullPreloadSelector() {
        return config.preloadSelectors.join(',');
    }
    function fullInstantSelector() {
        return config.instantSelectors.join(',');
    }
    function fullClickableSelector() {
        return config.clickableSelectors.join(',');
    }
    function isFollowDisabled(link) {
        return e.matches(link, config.noFollowSelectors.join(',')) || u.isCrossOrigin(link);
    }
    function isPreloadDisabled(link) {
        return !up.browser.canPushState() ||
            e.matches(link, config.noPreloadSelectors.join(',')) ||
            isFollowDisabled(link) ||
            !willCache(link);
    }
    function willCache(link) {
        var options = parseRequestOptions(link);
        if (options.url) {
            if (options.cache == null) {
                options.cache = 'auto';
            }
            options.basic = true;
            var request = new up.Request(options);
            return request.willCache();
        }
    }
    function isInstantDisabled(link) {
        return e.matches(link, config.noInstantSelectors.join(',')) || isFollowDisabled(link);
    }
    function reset() {
        lastMousedownTarget = null;
        config.reset();
        linkPreloader.reset();
    }
    var follow = up.mockable(function (link, options) {
        return up.render(followOptions(link, options));
    });
    function parseRequestOptions(link, options) {
        options = u.options(options);
        var parser = new up.OptionsParser(options, link);
        options.url = followURL(link, options);
        options.method = followMethod(link, options);
        parser.json('headers');
        parser.json('params');
        parser.booleanOrString('cache');
        parser.booleanOrString('clearCache');
        parser.booleanOrString('solo');
        parser.string('contentType', { attr: ['enctype', 'up-content-type'] });
        return options;
    }
    function followOptions(link, options) {
        var _a, _b;
        link = up.fragment.get(link);
        options = parseRequestOptions(link, options);
        var parser = new up.OptionsParser(options, link, { fail: true });
        parser.boolean('feedback');
        parser.boolean('fail');
        if (parser.options.origin == null) {
            parser.options.origin = link;
        }
        parser.boolean('navigate', { default: true });
        parser.string('confirm');
        parser.string('target');
        parser.booleanOrString('fallback');
        parser.parse((function (link, attrName) { return e.callbackAttr(link, attrName, ['request', 'response', 'renderOptions']); }), 'onLoaded');
        parser.string('content');
        parser.string('fragment');
        parser.string('document');
        parser.boolean('peel');
        parser.string('layer');
        parser.string('baseLayer');
        parser.json('context');
        parser.string('mode');
        parser.string('align');
        parser.string('position');
        parser.string('class');
        parser.string('size');
        parser.booleanOrString('dismissable');
        parser.parse(up.layer.openCallbackAttr, 'onOpened');
        parser.parse(up.layer.closeCallbackAttr, 'onAccepted');
        parser.parse(up.layer.closeCallbackAttr, 'onDismissed');
        parser.string('acceptEvent');
        parser.string('dismissEvent');
        parser.string('acceptLocation');
        parser.string('dismissLocation');
        parser.booleanOrString('history');
        parser.booleanOrString('focus');
        parser.boolean('saveScroll');
        parser.booleanOrString('scroll');
        parser.boolean('revealTop');
        parser.number('revealMax');
        parser.number('revealPadding');
        parser.number('revealSnap');
        parser.string('scrollBehavior');
        parser.booleanOrString('history');
        parser.booleanOrString('location');
        parser.booleanOrString('title');
        parser.booleanOrString('animation');
        parser.booleanOrString('transition');
        parser.string('easing');
        parser.number('duration');
        (_b = (_a = up.migrate).parseFollowOptions) === null || _b === void 0 ? void 0 : _b.call(_a, parser);
        if (!options.guardEvent) {
            options.guardEvent = up.event.build('up:link:follow', { log: 'Following link' });
        }
        return options;
    }
    function preload(link, options) {
        link = up.fragment.get(link);
        if (!shouldPreload()) {
            return up.error.failed.async('Link preloading is disabled');
        }
        var guardEvent = up.event.build('up:link:preload', { log: ['Preloading link %o', link] });
        return follow(link, __assign(__assign({}, options), { guardEvent: guardEvent, preload: true }));
    }
    function shouldPreload() {
        var setting = config.preloadEnabled;
        if (setting === 'auto') {
            return !up.network.shouldReduceRequests();
        }
        return setting;
    }
    function followMethod(link, options) {
        if (options === void 0) { options = {}; }
        return u.normalizeMethod(options.method || link.getAttribute('up-method') || link.getAttribute('data-method'));
    }
    function followURL(link, options) {
        if (options === void 0) { options = {}; }
        var url = options.url || link.getAttribute('up-href') || link.getAttribute('href');
        if (url !== '#') {
            return url;
        }
    }
    function isFollowable(link) {
        link = up.fragment.get(link);
        return e.matches(link, fullFollowSelector()) && !isFollowDisabled(link);
    }
    function makeFollowable(link) {
        if (!isFollowable(link)) {
            link.setAttribute('up-follow', '');
        }
    }
    function makeClickable(link) {
        if (e.matches(link, 'a[href], button')) {
            return;
        }
        e.setMissingAttrs(link, {
            tabindex: '0',
            role: 'link',
            'up-clickable': ''
        });
        link.addEventListener('keydown', function (event) {
            if ((event.key === 'Enter') || (event.key === 'Space')) {
                return forkEventAsUpClick(event);
            }
        });
    }
    up.macro(fullClickableSelector, makeClickable);
    function shouldFollowEvent(event, link) {
        if (event.defaultPrevented || isFollowDisabled(link)) {
            return false;
        }
        var betterTargetSelector = "a, [up-href], ".concat(up.form.fieldSelector());
        var betterTarget = e.closest(event.target, betterTargetSelector);
        return !betterTarget || (betterTarget === link);
    }
    function isInstant(linkOrDescendant) {
        var element = e.closest(linkOrDescendant, fullInstantSelector());
        return element && !isInstantDisabled(element);
    }
    function convertClicks(layer) {
        layer.on('click', function (event, element) {
            if (!up.event.isUnmodified(event)) {
                return;
            }
            if (isInstant(element) && lastMousedownTarget) {
                up.event.halt(event);
            }
            else if (layer.wasHitByMouseEvent(event) && !didUserDragAway(event)) {
                forkEventAsUpClick(event);
            }
            return lastMousedownTarget = null;
        });
        layer.on('mousedown', function (event, element) {
            if (!up.event.isUnmodified(event)) {
                return;
            }
            lastMousedownTarget = event.target;
            if (isInstant(element)) {
                forkEventAsUpClick(event);
            }
        });
    }
    function didUserDragAway(clickEvent) {
        return lastMousedownTarget && (lastMousedownTarget !== clickEvent.target);
    }
    function forkEventAsUpClick(originalEvent) {
        var forwardedProps = __spreadArray(['clientX', 'clientY', 'button'], up.event.keyModifiers, true);
        var newEvent = up.event.fork(originalEvent, 'up:click', forwardedProps);
        up.emit(originalEvent.target, newEvent, { log: false });
    }
    function isSafe(link) {
        var method = followMethod(link);
        return up.network.isSafeMethod(method);
    }
    up.on('up:click', fullFollowSelector, function (event, link) {
        if (shouldFollowEvent(event, link)) {
            up.event.halt(event);
            up.log.muteUncriticalRejection(follow(link));
        }
    });
    up.macro('[up-expand]', function (area) {
        var selector = area.getAttribute('up-expand') || 'a, [up-href]';
        var childLink = e.get(area, selector);
        if (childLink) {
            var areaAttrs = e.upAttrs(childLink);
            if (!areaAttrs['up-href']) {
                areaAttrs['up-href'] = childLink.getAttribute('href');
            }
            e.setMissingAttrs(area, areaAttrs);
            makeFollowable(area);
        }
    });
    up.compiler(fullPreloadSelector, function (link) {
        if (!isPreloadDisabled(link)) {
            linkPreloader.observeLink(link);
        }
    });
    up.on('up:framework:reset', reset);
    return {
        follow: follow,
        followOptions: followOptions,
        preload: preload,
        makeFollowable: makeFollowable,
        makeClickable: makeClickable,
        isSafe: isSafe,
        isFollowable: isFollowable,
        shouldFollowEvent: shouldFollowEvent,
        followMethod: followMethod,
        convertClicks: convertClicks,
        config: config,
        combineFollowableSelectors: combineFollowableSelectors
    };
})();
up.follow = up.link.follow;


/***/ }),
/* 88 */
/***/ (function() {



/***/ }),
/* 89 */
/***/ (function() {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
up.form = (function () {
    var u = up.util;
    var e = up.element;
    var ATTRIBUTES_SUGGESTING_SUBMIT = ['[up-submit]', '[up-target]', '[up-layer]', '[up-transition]'];
    var config = new up.Config(function () { return ({
        validateTargets: ['[up-fieldset]:has(:origin)', 'fieldset:has(:origin)', 'label:has(:origin)', 'form:has(:origin)'],
        fieldSelectors: ['select', 'input:not([type=submit]):not([type=image])', 'button[type]:not([type=submit])', 'textarea'],
        submitSelectors: up.link.combineFollowableSelectors(['form'], ATTRIBUTES_SUGGESTING_SUBMIT),
        noSubmitSelectors: ['[up-submit=false]', '[target]'],
        submitButtonSelectors: ['input[type=submit]', 'input[type=image]', 'button[type=submit]', 'button:not([type])'],
        observeDelay: 0
    }); });
    var abortScheduledValidate;
    function fullSubmitSelector() {
        return config.submitSelectors.join(',');
    }
    function reset() {
        config.reset();
    }
    function fieldSelector(suffix) {
        if (suffix === void 0) { suffix = ''; }
        return config.fieldSelectors.map(function (field) { return field + suffix; }).join(',');
    }
    function findFields(root) {
        root = e.get(root);
        var fields = e.subtree(root, fieldSelector());
        if (e.matches(root, 'form[id]')) {
            var outsideFieldSelector = fieldSelector(e.attributeSelector('form', root.getAttribute('id')));
            var outsideFields = e.all(outsideFieldSelector);
            fields.push.apply(fields, outsideFields);
            fields = u.uniq(fields);
        }
        return fields;
    }
    function submittingButton(form) {
        var selector = submitButtonSelector();
        var focusedElement = document.activeElement;
        if (focusedElement && e.matches(focusedElement, selector) && form.contains(focusedElement)) {
            return focusedElement;
        }
        else {
            return e.get(form, selector);
        }
    }
    function submitButtonSelector() {
        return config.submitButtonSelectors.join(',');
    }
    var submit = up.mockable(function (form, options) {
        return up.render(submitOptions(form, options));
    });
    function submitOptions(form, options) {
        form = getForm(form);
        options = parseBasicOptions(form, options);
        var parser = new up.OptionsParser(options, form);
        parser.string('failTarget', { default: up.fragment.toTarget(form) });
        options.guardEvent || (options.guardEvent = up.event.build('up:form:submit', {
            submitButton: options.submitButton,
            params: options.params,
            log: 'Submitting form'
        }));
        u.assign(options, up.link.followOptions(form, options));
        return options;
    }
    function parseBasicOptions(form, options) {
        options = u.options(options);
        form = getForm(form);
        var parser = new up.OptionsParser(options, form);
        var params = up.Params.fromForm(form);
        options.submitButton || (options.submitButton = submittingButton(form));
        if (options.submitButton) {
            params.addField(options.submitButton);
            options.method || (options.method = options.submitButton.getAttribute('formmethod'));
            options.url || (options.url = options.submitButton.getAttribute('formaction'));
        }
        params.addAll(options.params);
        options.params = params;
        parser.string('url', { attr: 'action', default: up.fragment.source(form) });
        parser.string('method', {
            attr: ['up-method', 'data-method', 'method'],
            default: 'GET',
            normalize: u.normalizeMethod
        });
        if (options.method === 'GET') {
            options.url = up.Params.stripURL(options.url);
        }
        return options;
    }
    up.on('up:click', submitButtonSelector, function (event, button) {
        var form = getForm(button);
        if (form && isSubmittable(form)) {
            button.focus();
        }
    });
    function observe(elements) {
        var _a, _b;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        elements = e.list(elements);
        var fields = u.flatMap(elements, findFields);
        var unnamedFields = u.reject(fields, 'name');
        if (unnamedFields.length) {
            up.warn('up.observe()', 'Will not observe fields without a [name]: %o', unnamedFields);
        }
        var callback = u.extractCallback(args) || observeCallbackFromElement(elements[0]) || up.fail('up.observe: No change callback given');
        var options = u.extractOptions(args);
        options.delay = (_b = (_a = options.delay) !== null && _a !== void 0 ? _a : e.numberAttr(elements[0], 'up-delay')) !== null && _b !== void 0 ? _b : config.observeDelay;
        var observer = new up.FieldObserver(fields, options, callback);
        observer.start();
        return function () { return observer.stop(); };
    }
    function observeCallbackFromElement(element) {
        var rawCallback = element.getAttribute('up-observe');
        if (rawCallback) {
            return up.NonceableCallback.fromString(rawCallback).toFunction('value', 'name');
        }
    }
    function autosubmit(target, options) {
        return observe(target, options, function () { return submit(target); });
    }
    function findValidateTarget(element, options) {
        var givenTarget;
        var container = getContainer(element);
        if (u.isElementish(options.target)) {
            return up.fragment.toTarget(options.target);
        }
        else if (givenTarget = options.target || element.getAttribute('up-validate') || container.getAttribute('up-validate')) {
            return givenTarget;
        }
        else if (e.matches(element, 'form')) {
            return up.fragment.toTarget(element);
        }
        else {
            return findValidateTargetFromConfig(element, options) || up.fail('Could not find validation target for %o (tried defaults %o)', element, config.validateTargets);
        }
    }
    function findValidateTargetFromConfig(element, options) {
        var layer = up.layer.get(element);
        return u.findResult(config.validateTargets, function (defaultTarget) {
            if (up.fragment.get(defaultTarget, __assign(__assign({}, options), { layer: layer }))) {
                return defaultTarget;
            }
        });
    }
    function validate(field, options) {
        field = up.fragment.get(field);
        options = parseBasicOptions(field, options);
        options.origin = field;
        options.target = findValidateTarget(field, options);
        options.focus = 'keep';
        options.fail = false;
        options.headers || (options.headers = {});
        options.headers[up.protocol.headerize('validate')] = field.getAttribute('name') || ':unknown';
        options.guardEvent = up.event.build('up:form:validate', { field: field, log: 'Validating form' });
        return up.render(options);
    }
    function switcherValues(field) {
        var value;
        var meta;
        if (e.matches(field, 'input[type=checkbox]')) {
            if (field.checked) {
                value = field.value;
                meta = ':checked';
            }
            else {
                meta = ':unchecked';
            }
        }
        else if (e.matches(field, 'input[type=radio]')) {
            var form = getContainer(field);
            var groupName = field.getAttribute('name');
            var checkedButton = form.querySelector("input[type=radio]".concat(e.attributeSelector('name', groupName), ":checked"));
            if (checkedButton) {
                meta = ':checked';
                value = checkedButton.value;
            }
            else {
                meta = ':unchecked';
            }
        }
        else {
            value = field.value;
        }
        var values = [];
        if (u.isPresent(value)) {
            values.push(value);
            values.push(':present');
        }
        else {
            values.push(':blank');
        }
        if (u.isPresent(meta)) {
            values.push(meta);
        }
        return values;
    }
    function switchTargets(switcher, options) {
        if (options === void 0) { options = {}; }
        var targetSelector = options.target || options.target || switcher.getAttribute('up-switch');
        var form = getContainer(switcher);
        targetSelector || up.fail("No switch target given for %o", switcher);
        var fieldValues = switcherValues(switcher);
        for (var _i = 0, _a = e.all(form, targetSelector); _i < _a.length; _i++) {
            var target = _a[_i];
            switchTarget(target, fieldValues);
        }
    }
    var switchTarget = up.mockable(function (target, fieldValues) {
        var show;
        fieldValues || (fieldValues = switcherValues(findSwitcherForTarget(target)));
        var hideValues = target.getAttribute('up-hide-for');
        if (hideValues) {
            hideValues = u.splitValues(hideValues);
            show = u.intersect(fieldValues, hideValues).length === 0;
        }
        else {
            var showValues = target.getAttribute('up-show-for');
            showValues = showValues ? u.splitValues(showValues) : [':present', ':checked'];
            show = u.intersect(fieldValues, showValues).length > 0;
        }
        e.toggle(target, show);
        target.classList.add('up-switched');
    });
    function findSwitcherForTarget(target) {
        var form = getContainer(target);
        var switchers = e.all(form, '[up-switch]');
        var switcher = u.find(switchers, function (switcher) {
            var targetSelector = switcher.getAttribute('up-switch');
            return e.matches(target, targetSelector);
        });
        return switcher || up.fail('Could not find [up-switch] field for %o', target);
    }
    function getForm(elementOrTarget, fallbackSelector) {
        var element = up.fragment.get(elementOrTarget);
        return element.form || e.closest(element, 'form') || (fallbackSelector && e.closest(element, fallbackSelector));
    }
    function getContainer(element) {
        return getForm(element, up.layer.anySelector());
    }
    function isField(element) {
        return e.matches(element, fieldSelector());
    }
    function focusedField() {
        return u.presence(document.activeElement, isField);
    }
    function isSubmittable(form) {
        form = up.fragment.get(form);
        return e.matches(form, fullSubmitSelector()) && !isSubmitDisabled(form);
    }
    function isSubmitDisabled(form) {
        return e.matches(form, config.noSubmitSelectors.join(','));
    }
    up.on('submit', fullSubmitSelector, function (event, form) {
        if (event.defaultPrevented || isSubmitDisabled(form)) {
            return;
        }
        abortScheduledValidate === null || abortScheduledValidate === void 0 ? void 0 : abortScheduledValidate();
        up.event.halt(event);
        up.log.muteUncriticalRejection(submit(form));
    });
    up.on('change', '[up-validate]', function (event) {
        var field = findFields(event.target)[0];
        abortScheduledValidate = u.abortableMicrotask(function () {
            return up.log.muteUncriticalRejection(validate(field));
        });
    });
    up.compiler('[up-switch]', function (switcher) {
        switchTargets(switcher);
    });
    up.on('change', '[up-switch]', function (_event, switcher) {
        switchTargets(switcher);
    });
    up.compiler('[up-show-for]:not(.up-switched), [up-hide-for]:not(.up-switched)', function (element) {
        switchTarget(element);
    });
    up.compiler('[up-observe]', function (formOrField) { return observe(formOrField); });
    up.compiler('[up-autosubmit]', function (formOrField) { return autosubmit(formOrField); });
    up.on('up:framework:reset', reset);
    return {
        config: config,
        submit: submit,
        submitOptions: submitOptions,
        isSubmittable: isSubmittable,
        observe: observe,
        validate: validate,
        autosubmit: autosubmit,
        fieldSelector: fieldSelector,
        fields: findFields,
        focusedField: focusedField,
        switchTarget: switchTarget
    };
})();
up.submit = up.form.submit;
up.observe = up.form.observe;
up.autosubmit = up.form.autosubmit;
up.validate = up.form.validate;


/***/ }),
/* 90 */
/***/ (function() {

up.feedback = (function () {
    var u = up.util;
    var e = up.element;
    var config = new up.Config(function () { return ({
        currentClasses: ['up-current'],
        navSelectors: ['[up-nav]', 'nav'],
    }); });
    function reset() {
        config.reset();
        up.layer.root.feedbackLocation = null;
    }
    var CLASS_ACTIVE = 'up-active';
    var SELECTOR_LINK = 'a, [up-href]';
    function navSelector() {
        return config.navSelectors.join(',');
    }
    function normalizeURL(url) {
        if (url) {
            return u.normalizeURL(url, { trailingSlash: false, hash: false });
        }
    }
    function linkURLs(link) {
        return link.upFeedbackURLs || (link.upFeedbackURLs = new up.LinkFeedbackURLs(link));
    }
    function updateFragment(fragment) {
        var layerOption = { layer: up.layer.get(fragment) };
        if (up.fragment.closest(fragment, navSelector(), layerOption)) {
            var links = up.fragment.subtree(fragment, SELECTOR_LINK, layerOption);
            updateLinks(links, layerOption);
        }
        else {
            updateLinksWithinNavs(fragment, layerOption);
        }
    }
    function updateLinksWithinNavs(fragment, options) {
        var navs = up.fragment.subtree(fragment, navSelector(), options);
        var links = u.flatMap(navs, function (nav) { return e.subtree(nav, SELECTOR_LINK); });
        updateLinks(links, options);
    }
    function getNormalizedLayerLocation(layer) {
        return layer.feedbackLocation || normalizeURL(layer.location);
    }
    function updateLinks(links, options) {
        if (options === void 0) { options = {}; }
        if (!links.length) {
            return;
        }
        var layer = options.layer || up.layer.get(links[0]);
        var layerLocation = getNormalizedLayerLocation(layer);
        if (layerLocation) {
            for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
                var link = links_1[_i];
                var isCurrent = linkURLs(link).isCurrent(layerLocation);
                for (var _a = 0, _b = config.currentClasses; _a < _b.length; _a++) {
                    var currentClass = _b[_a];
                    e.toggleClass(link, currentClass, isCurrent);
                }
                e.toggleAttr(link, 'aria-current', 'page', isCurrent);
            }
        }
    }
    function findActivatableArea(element) {
        return e.ancestor(element, SELECTOR_LINK) || element;
    }
    function start(element) {
        findActivatableArea(element).classList.add(CLASS_ACTIVE);
    }
    function stop(element) {
        findActivatableArea(element).classList.remove(CLASS_ACTIVE);
    }
    function around(element, fn) {
        start(element);
        var result = fn();
        u.always(result, function () { return stop(element); });
        return result;
    }
    function aroundForOptions(options, fn) {
        var element;
        var feedbackOpt = options.feedback;
        if (feedbackOpt) {
            if (u.isBoolean(feedbackOpt)) {
                element = options.origin;
            }
            else {
                element = feedbackOpt;
            }
        }
        if (element) {
            element = up.fragment.get(element);
            return around(element, fn);
        }
        else {
            return fn();
        }
    }
    function updateLayerIfLocationChanged(layer) {
        var processedLocation = layer.feedbackLocation;
        var layerLocation = getNormalizedLayerLocation(layer.location);
        if (!processedLocation || (processedLocation !== layerLocation)) {
            layer.feedbackLocation = layerLocation;
            updateLinksWithinNavs(layer.element, { layer: layer });
        }
    }
    function onBrowserLocationChanged() {
        var frontLayer = up.layer.front;
        if (frontLayer.showsLiveHistory()) {
            updateLayerIfLocationChanged(frontLayer);
        }
    }
    up.on('up:location:changed', function (_event) {
        onBrowserLocationChanged();
    });
    up.on('up:fragment:inserted', function (_event, newFragment) {
        updateFragment(newFragment);
    });
    up.on('up:layer:location:changed', function (event) {
        updateLayerIfLocationChanged(event.layer);
    });
    up.on('up:framework:reset', reset);
    return {
        config: config,
        start: start,
        stop: stop,
        around: around,
        aroundForOptions: aroundForOptions,
        normalizeURL: normalizeURL,
    };
})();


/***/ }),
/* 91 */
/***/ (function() {

up.radio = (function () {
    var u = up.util;
    var config = new up.Config(function () { return ({
        hungrySelectors: ['[up-hungry]'],
        pollInterval: 30000,
        pollEnabled: 'auto'
    }); });
    function reset() {
        config.reset();
    }
    function hungrySelector() {
        return config.hungrySelectors.join(',');
    }
    function startPolling(fragment, options) {
        if (options === void 0) { options = {}; }
        up.FragmentPolling.forFragment(fragment).forceStart(options);
    }
    function stopPolling(element) {
        up.FragmentPolling.forFragment(element).forceStop();
    }
    function shouldPoll(fragment) {
        var _a, _b;
        var setting = u.evalOption(config.pollEnabled, fragment);
        if (setting === 'auto') {
            return !document.hidden && !up.network.shouldReduceRequests() && ((_b = (_a = up.layer.get(fragment)) === null || _a === void 0 ? void 0 : _a.isFront) === null || _b === void 0 ? void 0 : _b.call(_a));
        }
        return setting;
    }
    up.compiler('[up-poll]', function (fragment) {
        up.FragmentPolling.forFragment(fragment).onPollAttributeObserved();
    });
    up.on('up:framework:reset', reset);
    return {
        config: config,
        hungrySelector: hungrySelector,
        startPolling: startPolling,
        stopPolling: stopPolling,
        shouldPoll: shouldPoll,
    };
})();


/***/ }),
/* 92 */
/***/ (function() {

up.rails = (function () {
    var u = up.util;
    var e = up.element;
    function isRails() {
        var _a;
        return window._rails_loaded ||
            window.Rails ||
            ((_a = window.jQuery) === null || _a === void 0 ? void 0 : _a.rails);
    }
    return u.each(['method', 'confirm'], function (feature) {
        var dataAttribute = "data-".concat(feature);
        var upAttribute = "up-".concat(feature);
        up.macro("a[".concat(dataAttribute, "]"), function (link) {
            if (isRails() && up.link.isFollowable(link)) {
                e.setMissingAttr(link, upAttribute, link.getAttribute(dataAttribute));
                return link.removeAttribute(dataAttribute);
            }
        });
    });
})();


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);
__webpack_require__(13);
__webpack_require__(14);
__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(17);
__webpack_require__(18);
__webpack_require__(19);
__webpack_require__(20);
__webpack_require__(21);
__webpack_require__(22);
__webpack_require__(23);
__webpack_require__(24);
__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(27);
__webpack_require__(28);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(31);
__webpack_require__(32);
__webpack_require__(33);
__webpack_require__(34);
__webpack_require__(35);
__webpack_require__(36);
__webpack_require__(37);
__webpack_require__(38);
__webpack_require__(39);
__webpack_require__(40);
__webpack_require__(41);
__webpack_require__(42);
__webpack_require__(43);
__webpack_require__(44);
__webpack_require__(45);
__webpack_require__(46);
__webpack_require__(47);
__webpack_require__(48);
__webpack_require__(49);
__webpack_require__(50);
__webpack_require__(51);
__webpack_require__(52);
__webpack_require__(53);
__webpack_require__(54);
__webpack_require__(55);
__webpack_require__(56);
__webpack_require__(57);
__webpack_require__(58);
__webpack_require__(59);
__webpack_require__(60);
__webpack_require__(61);
__webpack_require__(62);
__webpack_require__(63);
__webpack_require__(64);
__webpack_require__(65);
__webpack_require__(66);
__webpack_require__(67);
__webpack_require__(68);
__webpack_require__(69);
__webpack_require__(70);
__webpack_require__(71);
__webpack_require__(72);
__webpack_require__(73);
__webpack_require__(74);
__webpack_require__(75);
__webpack_require__(76);
__webpack_require__(77);
__webpack_require__(78);
__webpack_require__(80);
__webpack_require__(82);
__webpack_require__(83);
__webpack_require__(85);
__webpack_require__(87);
__webpack_require__(89);
__webpack_require__(90);
__webpack_require__(91);
__webpack_require__(92);
up.framework.onEvaled();

}();
/******/ })()
;