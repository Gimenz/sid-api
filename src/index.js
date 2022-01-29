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
        if (this.credentials) {
            this.getToken(this.credentials.email, this.credentials.password)
        }
        /** @private */
        this.cookiePath = path.join(__dirname + '/config/cookie.json')
        /** @private */
        this.headers = {
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'id-ID,id;q=0.9',
            'content-type': 'application/json',
            'origin': 'https://home.s.id',
            'referer': 'https://home.s.id/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
        }
    }

    /**
     * @private
     */
    useExistCookie = () => {
        if (fs.existsSync(this.cookiePath)) {
            let cookieJson = JSON.parse(this.readCookie())
            return cookieJson
        } else {
            throw 'you didn\'t save cookie before'
        }
    }

    /**
     * @private
     */
    readCookie = () => {
        return fs.readFileSync(this.cookiePath, 'utf-8')
    }

    /**
     * simple make request
     * @private
     * @param {string} params api params
     * @param {string|any} payload payload
     * @param {string} method axios method
     * @param {AxiosRequestConfig} options
     * @returns {Promise<AxiosResponse>}
     */
    makeRequest = async (params, payload, method, options = {}) => {
        return axios({
            url: baseURL + params,
            data: payload,
            method: method || 'GET',
            headers: options.headers || this.headers,
            ...options
        }).catch(err => {
            if (err.response) {
                if (err.response.status !== 200) {
                    return err.response
                }
            } else {
                return err
            }
        })
    }

    /**
     * get token also saved automatically
     * @param {string} email 
     * @param {string} password 
     * @returns 
     */
    getToken = async (email, password) => {
        const payload = {
            email: email || this.credentials.email,
            password: password || this.credentials.password
        }
        const response = await this.makeRequest('/api/login', payload, 'POST')
        if (response.status !== 200) throw `${response.data}`
        this.headers['cookie'] = `token=${response.data.token};`
        fs.writeFileSync(this.cookiePath, JSON.stringify(this.headers))
        return response.data
    }

    /**
     * shorten an url
     * @param {string} url 
     * @returns 
     */
    short = async (url) => {
        const payload = {
            link: url
        }
        const response = await this.makeRequest('/api/user/shorten', payload, 'POST', { headers: this.useExistCookie() })
        return response.data
    }

    /**
     * user profile
     * @returns 
     */
    user = async () => {
        const response = await this.makeRequest('/api/user/me', null, null, { headers: this.useExistCookie() })
        return response.data
    }

    /**
     * dashboard
     * @returns 
     */
    dashboard = async () => {
        const response = await this.makeRequest('/api/user/dashboard', null, null, { headers: this.useExistCookie() })
        return response.data
    }

    /**
     * most visited urls
     * @returns 
     */
    topLinks = async () => {
        const response = await this.makeRequest('/api/user/toplinks', null, null, { headers: this.useExistCookie() })
        return response.data
    }

    /**
     * check link stats
     * @returns 
     */
    linkStatus = async (id) => {
        if (!id) throw 'id of the link is required!'
        const response = await this.makeRequest('/api/user/stats/link/' + id, null, null, { headers: this.useExistCookie() })
        return response.data
    }

    /**
     * edit profile
     * @param {*} options 
     * @returns 
     */
    editProfile = async (options) => {
        const payload = {
            "first_name": options.first_name,
            "last_name": options.last_name,
            "gender_id": 1
        }
        const response = await this.makeRequest('/api/user/me', payload, 'POST', { headers: this.useExistCookie() })
        return response.data
    }

    /**
     * fetch shortened links
     * @param {number} page 
     * @returns 
     */
    fetchLinks = async (page = 1) => {
        const response = await this.makeRequest('/api/user/links?page=' + page, null, null, { headers: this.useExistCookie() })
        return response.data
    }
}

module.exports = SID