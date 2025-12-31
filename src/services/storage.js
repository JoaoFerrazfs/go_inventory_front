// Small storage abstraction compatible with browser and React Native.
let AsyncStorage = null;
try {
    // Avoid static import so webpack doesn't try to resolve this in web builds.
    // Use eval to hide require from bundlers.
    // eslint-disable-next-line no-eval
    // eslint-disable-next-line global-require
    const maybe = eval("require('@react-native-async-storage/async-storage')");
    AsyncStorage = maybe && maybe.default ? maybe.default : maybe;
} catch (e) {
    AsyncStorage = null;
}

const isAsync = !!AsyncStorage;

export async function getItem(key) {
    if (isAsync) return AsyncStorage.getItem(key);
    return Promise.resolve(localStorage.getItem(key));
}

export async function setItem(key, value) {
    if (isAsync) return AsyncStorage.setItem(key, value);
    localStorage.setItem(key, value);
    return Promise.resolve();
}

export async function removeItem(key) {
    if (isAsync) return AsyncStorage.removeItem(key);
    localStorage.removeItem(key);
    return Promise.resolve();
}

export default { getItem, setItem, removeItem };
