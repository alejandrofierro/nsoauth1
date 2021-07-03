# nsoauth1
Generate your NetSuite Token Based Authorization Header

## Introduction:
This module allows to create an OAuth1 header string that you can later use to inject to REST calls to netsuite

## Supported Methods
* Generate OAuth header data

## Methods
* generateOAuth()

## Installation

Open a terminal and enter the following command:

``npm install nsoauth1 --save``

## Usage

Example of GET request

```javascript
const NetsuiteOAuth = require('nsoauth1');

const method = 'GET';
const url = 'https://123456-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=508&deploy=1';
const consumerKey = 'consumer-key';
const consumerSecret = 'consumer-secret';
const tokenId = 'token';
const tokenSecret = 'token-secret';
const account = 'Netsuite Account';

let oauth = new NetsuiteOAuth({ method:method, 
                     url:url, 
                     ck: consumerKey, 
                     cs: consumerSecret, 
                     tk: tokenId, 
                     ts: tokenSecret, 
                     realm: account });


let resp = oauth.generateOAuth();

/*
Output example:

{
  timestamp: 1625338429,
  nonce: 'qlpEJNNmmhTJxAVVFWCGJpuIlmIiLuTW',
  baseString: 'GET&https%3A%2F%2F123131321.netsuite.com&oauth_consumer_key%3Dadasda2324232dasd2342%26oauth_nonce%3DqlpEJNNmmhTJxAVVFWCGJpuIlmIiLuTW%26oauth_signature_method%3DHMAC-SHA256%26oauth_timestamp%3D1625338429%26oauth_token%3Dadsadssdsa78dy834hr3f8943%26oauth_version%3D1.0%26script%3D1',
  signature: '0qcbJLGEBDoQj%2FsK8qlQuTbdHjIgRiAtSZEoMGPya2M%3D',
  authHeader: 'OAuth realm="1231231321", oauth_consumer_key="adasda2324232dasd2342", oauth_nonce="qlpEJNNmmhTJxAVVFWCGJpuIlmIiLuTW", oauth_signature="0qcbJLGEBDoQj%2FsK8qlQuTbdHjIgRiAtSZEoMGPya2M%3D", oauth_signature_method="HMAC-SHA256", oauth_timestamp="1625338429", oauth_token="adsadssdsa78dy834hr3f8943", oauth_version="1.0"'
}

*/

```





