const url_main = process.env.REACT_APP_API_ENDPOINT;
const headers_main = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    'Access-Control-Allow-Origin': '*',
    // "withCredentials": "include"
}

export default class api {

    static GET = async (url) => {
        return await fetch(
            url_main + url,
            {
                method: "GET",
                mode: "cors",
                headers: headers_main,
                // credentials: 'include',
                // xhrFields: {
                //     "withCredentials": 'true',
                // }
            })
            .catch(error => {
                console.log(error);
            })
    }
    static POST = async (url, data) => {
        return await fetch(
            url_main + url,
            {
                method: "POST",
                mode: "cors",
                headers: headers_main,
                // credentials: 'include',
                // xhrFields: {
                //     "withCredentials": true,
                // },
                body: JSON.stringify(data)
            })
            .catch(error => {
                console.log(error);
            })
    }
    static PUT = async (url, data) => {
        return await fetch(
            url_main + url,
            {
                method: "PUT",
                mode: "cors",
                headers: headers_main,
                // credentials: 'include',
                // xhrFields: {
                //     "withCredentials": true,
                // },
                body: JSON.stringify(data)
            })
            .catch(error => {
                console.log(error);
            })
    }
    static DELETE = async (url) => {
        return await fetch(
            url_main + url,
            {
                method: "DELETE",
                mode: "cors",
                headers: headers_main,
                // credentials: 'include',
                // xhrFields: {
                //     "withCredentials": true,
                // },
            })
            .catch(error => {
                console.log(error);
            })
    }
}
