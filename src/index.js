const { default: axios, AxiosRequestConfig, AxiosResponse } = require('axios');
const baseURL = 'https://api.s.id'
const fs = require('fs');
const path = require('path');

class SID {
    constructor(email = '', password = '') {
        this.credentials = {
            email,
            password
        }
        this.headers = {
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'id-ID,id;q=0.9',
            'content-type': 'application/json',
            'origin': 'https://home.s.id',
            'referer': 'https://home.s.id/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
        }

        this.cookiePath = path.join(__dirname + '/config/cookie.json')
    }

    isCookieExists() {
        return fs.existsSync(this.cookiePath)
    }

    useExistCookie = async () => {
        if (this.isCookieExists()) {
            let cookieJson = JSON.parse(this.readCookie())
            const parsed = parseCookie(cookieJson.cookie)
            if (parsed.expire <= Math.floor((Date.now() / 1000))) {
                console.log('token updated');
                return await this.getToken()
            }
            console.log('log in using existing token');
            return cookieJson
        } else if (this.credentials.email !== '' || this.credentials.password !== '') {
            return await this.getToken()
        } else {
            throw 'you don\'t have cookie, set cookie first by using getToken()'
        }
    }

    readCookie = () => {
        return fs.readFileSync(this.cookiePath, 'utf-8')
    }

    /**
     * simple make request
     * @param {string} params api params
     * @param {string|any} payload payload
     * @param {string} method axios method
     * @param {AxiosRequestConfig} options
     * @returns {Promise<AxiosResponse>}
     */
    makeRequest = async (params, payload, method, options = {}) => {
        return await axios({
            url: baseURL + params,
            data: payload,
            method: method || 'GET',
            headers: options.headers || this.headers,
            ...options
        }).catch(err => {
            if (err.response) {
                if (err.response.status !== 200) {
                    return err.response
                } else {
                    return err.toJSON()
                }
            } else {
                throw err
            }
        })
    }

    getToken = async (email, password) => {
        const payload = {
            email: email || this.credentials.email,
            password: password || this.credentials.password
        }
        const response = await this.makeRequest('/api/login', payload, 'POST')
        if (response.status !== 200) throw `${response.data}`
        this.headers['cookie'] = `token=${response.data.token}; expire=${new Date(response.data.expire).getTime() / 1000};`
        fs.writeFileSync(this.cookiePath, JSON.stringify(this.headers, null, 4))
        return this.headers
    }

    short = async (url) => {
        const payload = {
            link: url
        }
        const response = await this.makeRequest('/api/user/shorten', payload, 'POST', { headers: await this.useExistCookie() })
        return response.data
    }

    user = async () => {
        const response = await this.makeRequest('/api/user/me', null, null, { headers: await this.useExistCookie() })
        return response.data
    }

    dashboard = async () => {
        const response = await this.makeRequest('/api/user/dashboard', null, null, { headers: await this.useExistCookie() })
        return response.data
    }

    topLinks = async () => {
        const response = await this.makeRequest('/api/user/toplinks', null, null, { headers: await this.useExistCookie() })
        return response.data
    }

    linkStatus = async (id) => {
        if (!id) throw 'id of the link is required!'
        const response = await this.makeRequest('/api/user/stats/link/' + id, null, null, { headers: await this.useExistCookie() })
        return response.data
    }

    editProfile = async (options) => {
        const payload = {
            "first_name": options.first_name,
            "last_name": options.last_name,
            "gender_id": 1
        }
        const response = await this.makeRequest('/api/user/me', payload, 'POST', { headers: await this.useExistCookie() })
        return response.data
    }

    fetchLinks = async (page = 1) => {
        const response = await this.makeRequest('/api/user/links?page=' + page, null, null, { headers: await this.useExistCookie() })
        return response.data
    }
}


/**
 * 
 * @param {string} str 
 * @returns 
 */
function parseCookie(str) {
    return str.split(';')
        .map(v => v.trim().split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0])] = decodeURIComponent(v[1]);
            delete acc['']
            return acc;
        }, {});
}

module.exports = { SID }