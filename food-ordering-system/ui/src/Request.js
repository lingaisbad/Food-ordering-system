import axios from "axios";

const basePath = '/api/v1';

const request = async (path, method, body = {}) => {
    let respData = {}, isErrored = false;
    try {
        const obj = {
            url: basePath + path,
            method,
            ...body,
        };
        const resp = await axios(obj);
        respData = resp.data;
    } catch (err) {
        respData = err ?
            err.response ?
                err.response.data ?
                    err.response.data :
                    err.response :
                err :
            { message: 'Unexpected error occured' };
        isErrored = true;
    }
    // console.log(path, ":", data, "=>", respData);
    if (isErrored) throw respData;
    return respData;
}

export default class Request {
    static get = (path, params) => {
        return request(path, 'GET', { params });
    }

    static post = (path, data) => {
        return request(path, 'POST', { data });
    }

    static put = (path, data) => {
        return request(path, 'PUT', { data })
    }

    static delete = (path) => {
        return request(path, 'DELETE', {});
    }
}