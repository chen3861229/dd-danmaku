// from workers settings
const appId = APP_ID;
const appSecret = APP_SECRET;

const hostlist = { 'api.dandanplay.net': null };

async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, User-Agent',
            },
        });
    }
    
    const urlObj = new URL(request.url);
    let url = urlObj.href.replace(urlObj.origin + '/cors/', '').trim();
    if (0 !== url.indexOf('https://') && 0 === url.indexOf('https:')) {
        url = url.replace('https:/', 'https://');
    } else if (0 !== url.indexOf('http://') && 0 === url.indexOf('http:')) {
        url = url.replace('http:/', 'http://');
    }
    const tUrlObj = new URL(url);
    if (!(tUrlObj.hostname in hostlist)) {
        return Forbidden(tUrlObj);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const apiPath = tUrlObj.pathname;
    const signature = await generateSignature(appId, timestamp, apiPath, appSecret);
    console.log('X-AppId: ' + appId);
    console.log('X-Signature: ' + signature);
    console.log('X-Timestamp: ' + timestamp);
    console.log('ApiPath: ' + apiPath);

    // 构建请求头，确保所有原始头部都被正确传递
    const headers = {};
    for (const [key, value] of request.headers.entries()) {
        headers[key] = value;
    }
    headers["X-AppId"] = appId;
    headers["X-Signature"] = signature;
    headers["X-Timestamp"] = timestamp.toString();
    headers["X-Auth"] = "1";

    let response = await fetch(url, {
        headers: headers,
        body: request.body,
        method: request.method,
    });
    response = new Response(response.body, response);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
}

/**
 * 
 * @param {String} appId 
 * @param {Number} timestamp 使用当前的 UTC 时间生成 Unix 时间戳，单位为秒
 * @param {String} path 此处的 API 路径是指 API 地址后的路径部分，以/开头，不包括前面的协议、域名和?后面的查询参数
 * @param {String} appSecret 
 * @returns signature String
 */
async function generateSignature(appId, timestamp, path, appSecret) {
    const data = appId + timestamp + path + appSecret;
    const dataUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(hashArray.map(byte => String.fromCharCode(byte)).join(''));
    return hashBase64;
}

function Forbidden(url) {
    return new Response(`Hostname ${url.hostname} not allowed.`, {
        status: 403,
    });
}

addEventListener('fetch', (event) => {
    return event.respondWith(handleRequest(event.request));
});
