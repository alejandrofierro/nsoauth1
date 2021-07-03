'use strict';

const crypto = require('crypto')

module.exports = NSOAuth1;

/**
 * Constructor
 *
 * @param method Method to be used (GET, POST, PUT, DELETE)
 * @param url  
 * @param ck   Consumer Key
 * @param cs   Consumer Secret
 * @param tk   Token ID
 * @param ts   Token Secret
 * @param realm Netsuite Account in the form of #####_SB1 or ##### 
 * @returns 
 * @constructor
 */

function NSOAuth1({ method, url, ck, cs, tk, ts, realm}){
    try {                
        
        if(!method) throw new Error('Invalid Method, only allowed GET, PUT, POST, DELETE')
        if(!url) throw new Error('Invalid URL')
        if(!ck || !cs || !tk || !ts) throw new Error('Invalid Tokens')
        if(!realm) throw new Error('Account must not be empty, it should be in the form of #####_SB# or ######')

        this.method = method;
        this.url = url;
        this.ck = ck;
        this.cs = cs;
        this.tk = tk;
        this.ts = ts;
        this.realm = realm;
                  
    } catch (error) {
        throw error;
    }

}

NSOAuth1.prototype.generateOAuth = function() {
    try {
        let timestamp = generateTimeStamp();
        let nonce = generateNonce();
        let baseString = getBaseString({
            method: this.method,
            url: this.url,
            oauth_data: {
                consumerKey: this.ck,
                tokenKey: this.tk,
                timestamp: timestamp,
                nonce: nonce
            }
        });
        
        let key = encode(this.cs) + '&' + encode(this.ts);
        
        let signature = encode(crypto.createHmac('sha256', key).update(baseString).digest('base64'));
        
        let authHeader = 'OAuth realm="' + this.realm +'", ' +
        'oauth_consumer_key="' + this.ck + '", ' +
        'oauth_nonce="' + nonce + '", ' +
        'oauth_signature="' + signature + '", ' +
        'oauth_signature_method="HMAC-SHA256", ' +
        'oauth_timestamp="' + timestamp + '", ' +
        'oauth_token="' + this.tk + '", ' +
        'oauth_version="1.0"'   
        
        return {
            timestamp,
            nonce,
            baseString,
            signature,
            authHeader
        }

    } catch (error) {
        throw error;
    }
}

function getBaseString(_data) {
    const { method: httpMethod, url, oauth_data } = _data;

    let baseUrl = url.split('?')[0];
    let querystring = url.split('?')[1];
    let params = querystring.split('&');

    //Get Query Parameters
    let _p = {};
    for (let i in params) {
        let _d = params[i].split("=");
        let _k = _d[0];
        let _v = _d[1];
        _p[_k] = _v
    }
    let data = { ..._p };
    data['oauth_consumer_key'] = oauth_data.consumerKey;
    data['oauth_nonce'] = oauth_data.nonce;
    data['oauth_signature_method'] = 'HMAC-SHA256';
    data['oauth_timestamp'] = oauth_data.timestamp;
    data['oauth_token'] = oauth_data.tokenKey;
    data['oauth_version'] = "1.0";

    let _a = []
    for (let key in data) {
        _a.push(key)
    }
    let _sorted = _a.sort()    //Sort Properties Ascending , requirement from https://tools.ietf.org/html/rfc5849#section-3.4.1
    
    //Create BaseString
    let baseString = httpMethod + '&';    
    baseString += encode(baseUrl) + "&"
        
    for (let i = 0; i < _sorted.length; i++) {
        let str = _sorted[i] + "=" + data[_sorted[i]] + "&"
        if (i === _sorted.length - 1) {
            str = str.replace("&", '');
        }
        baseString += encode(str);
    }
    
    return baseString;
}


function encode(str) {
    //str = str.sort()
    return encodeURIComponent(str)
        .replace(/\!/g, "%21")
        .replace(/\*/g, "%2A")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
}
function generateNonce() {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = 0; i < 32; i++) {
        result += chars[parseInt(Math.random() * chars.length, 10)];
    }
    return result;
}
function generateTimeStamp() {
    return parseInt(new Date().getTime() / 1000, 10);
}