# 🍚 sid
**s.id url shortener Un-Official Api Wrapper**

simple unofficial api wrapper of [s.id](https://s.id "s.id")

## 📔 Example
Do Note! that the token are required for most all requests.
```js
const sID = require('./src/index');
const s = new sID();

(async () => {
    try {
        // to use most all features, you will needed token, get token easily with getToken() function
        const token = await s.getToken('yout email', 'your password');
        console.log(token);

        // short some long url
        const shortened = await s.short('https://open.spotify.com/show/7gsV94xCLfVuwxBpcc2rbc');
        console.log(shortened);

        // fecth url shortened list, if have many shortened, you can fetch it by page
        const shortlist = await s.fetchLinks();
        console.log(shortlist);
    } catch (error) {
        console.log(error);
    }
})();
```
## 🌳 Dependency
- [Axios](https://npmjs.com/axios)

## 🥚 Credits
-  [s.id](https://s.id "s.id")

🧗‍♀️ Contribution(s) are welcome!
