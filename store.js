/**
 * 本地存储，优先使用 sessionStorage
 * 在sessionSorage ，会话存储中相当好用，但是本地存储不能跟cookie相比，因为ie不兼容localStorage
 * by djh
 * */

var store = (function () {
    var api = {},
        win = window,
        doc = win.document,
        localStorageName = 'localStorage',
        globalStorageName = 'globalStorage',
        sessionStorageName = 'sessionStorage',
        storage;

    api.set = function (key, value) {};
    api.get = function (key) {};
    api.remove = function (key) {};
    api.clear = function () {};

    function setVal(val) {
        var vall = JSON.stringify(val);
        return encodeURIComponent(vall);
    }

    function getVal(val) {
        var vall = decodeURIComponent(val);
        return JSON.parse(vall);
    }
    if (sessionStorageName in win && win[sessionStorageName]) {
        storage = win[sessionStorageName];
        api.set = function (key, val) {
            var vall = setVal(val);
            storage.setItem(key, vall)
        };
        api.get = function (key) {
            var vall = storage.getItem(key);
            return getVal(vall);
        };
        api.remove = function (key) {
            storage.removeItem(key)
        };
        api.clear = function () {
            storage.clear()
        };

    } else if (localStorageName in win && win[localStorageName]) {
        storage = win[localStorageName];
        api.set = function (key, val) {
            var vall = setVal(val);
            storage.setItem(key, vall)
        };
        api.get = function (key) {
            var vall = storage.getItem(key);
            return getVal(vall);
        };
        api.remove = function (key) {
            storage.removeItem(key)
        };
        api.clear = function () {
            storage.clear()
        };

    } else if (globalStorageName in win && win[globalStorageName]) {
        storage = win[globalStorageName][win.location.hostname];
        api.set = function (key, val) {
            var vall = setVal(val);
            storage[key] = vall
        };
        api.get = function (key) {
            var vall = storage[key] && storage[key].value;
            return getVal(vall)
        };
        api.remove = function (key) {
            delete storage[key]
        };
        api.clear = function () {
            for (var key in storage) {
                delete storage[key]
            }
        };

    } else if (doc.documentElement.addBehavior) {
        function getStorage() {
            if (storage) {
                return storage
            }
            storage = doc.body.appendChild(doc.createElement('div'));
            storage.style.display = 'none';
            // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
            // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
            storage.addBehavior('#default#userData');
            storage.load(localStorageName);
            return storage;
        }
        api.set = function (key, val) {
            var storage = getStorage();
            var vall = setVal(val);
            storage.setAttribute(key, vall);
            storage.save(localStorageName);
        };
        api.get = function (key) {
            var storage = getStorage();
            var vall = storage.getAttribute(key);
            return getVal(vall);;
        };
        api.remove = function (key) {
            var storage = getStorage();
            storage.removeAttribute(key);
            storage.save(localStorageName);
        };
        api.clear = function () {
            var storage = getStorage();
            var attributes = storage.XMLDocument.documentElement.attributes;
            storage.load(localStorageName);
            for (var i = 0, attr; attr = attributes[i]; i++) {
                storage.removeAttribute(attr.name);
            }
            storage.save(localStorageName);
        }
    }
    return api;
})();
