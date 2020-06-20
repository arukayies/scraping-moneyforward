/*
レスポンスのHTMLからログイン処理に必要なパラメータを取得するのにcheerioを使用。
cheerioをGAS用のライブラリ↓
スクリプトID: 13KJxU8q0ZYmZXyQswU2HrkQX-yXlgnlJ3BVzsKrS69oaE4FcViPRFPZb
———————————–*/
const cheerio = libpack.cheerio()

/* userAgentを偽装する */
const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36";

/*
Cookisのクラス
———————————–*/
class CookieUtil {
    /*
    値を抽出
    @param {string} cookie Cookieデータ（"name=value;...")
    @return {string} value
    ———————————–*/
    static getValue(cookies, key) {
        const cookiesArray = cookies.split(";");

        for (const c of cookiesArray) {
            const cArray = c.split("=");

            if (cArray[0] == key) {
                return cArray[1]
            }
        }

        return false
    }
}

/*
moneyforwardのログイン
———————————–*/
function login(email, password) {
    const me = this;

    let
        /* リクエスト送るときに使う */
        headers,
        payload,
        options,
        response,
        redirectURL,
        /* cheerio */
        $,
        /* ログインに必要なパラメータ */
        mfid_session,
        authenticity_token,
        authorizationParams,
        sih,
        last_used_application,
        identification_code,
        moneybook_session

    /* Request URL: https://moneyforward.com/ */
    headers = {
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch("https://moneyforward.com/", options);
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "_moneybook_session");

    /* Request URL: https://moneyforward.com/users/sign_in */
    headers = {
        "cookie": "_moneybook_session=" + moneybook_session + ";",
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch("https://moneyforward.com/users/sign_in", options);

    /* moneybook_sessionを取得 */
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "_moneybook_session");

    /* redirectURLを取得 */
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* Request URL: https://moneyforward.com/auth/mfid */
    headers = {
        "cookie": "_moneybook_session=" + moneybook_session + ";",
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch(redirectURL, options);

    /* moneybook_sessionを取得 */
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "_moneybook_session");

    /* redirectURLを取得 */
    redirectURL = response.getAllHeaders()["Location"];

    /* Request URL: https://id.moneyforward.com/oauth/authorize */
    headers = {
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch(redirectURL, options);

    /* redirectURLを取得 */
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* Request URL: https://id.moneyforward.com/sign_in */
    response = UrlFetchApp.fetch(redirectURL, options);

    /* last_used_applicationを取得 */
    last_used_application = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "last_used_application");

    /* redirectURLを取得 */
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* Request URL: https://id.moneyforward.com/sign_in/new */
    options = {
        "method": "get",
        "headers": headers
    }
    response = UrlFetchApp.fetch(redirectURL, options);

    /* mfid_sessionを取得 */
    mfid_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "_mfid_session");

    /* authenticity_tokenを取得 */
    $ = cheerio.load(response.getContentText("UTF-8"));
    authenticity_token = $("meta[name='csrf-token']").attr("content");

    /* authorizationParamsを取得 */
    authorizationParams = $("script")[2]["children"][0]["data"]
    authorizationParams = JSON.parse(authorizationParams.match(/gon.authorizationParams=(\{.*?\})/)[1]);

    /* Request URL: https://id.moneyforward.com/sign_in */
    headers = {
        "cookie": "_mfid_session=" + mfid_session + "; last_used_application=" + last_used_application + ";",
        "user-agent": userAgent
    }
    payload = {
        "authenticity_token": authenticity_token,
        "_method": "post",
        "client_id": authorizationParams["clientId"],
        "redirect_uri": authorizationParams["redirectUri"],
        "response_type": authorizationParams["responseType"],
        "scope": authorizationParams["scope"],
        "state": authorizationParams["state"],
        "nonce": authorizationParams["nonce"],
        "mfid_user[email]": email,
        "mfid_user[password]": password
    }
    options = {
        "method": "post",
        "headers": headers,
        "payload": payload,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch("https://id.moneyforward.com/sign_in", options);

    /* sihを取得 */
    sih = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][0], "sih");

    /* 認証後のmfid_sessionを取得 */
    mfid_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][1], "_mfid_session");

    /* redirectURLを取得 */
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* Request URL: https://id.moneyforward.com/oauth/authorize */
    headers = {
        "cookie": "sih=" + sih + "; _mfid_session=" + mfid_session + "; last_used_application=" + last_used_application + ";",
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch(redirectURL, options)

    /* redirectURLを取得 */
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* Request URL: https://moneyforward.com/auth/mfid/callback */
    headers = {
        "cookie": "sih=" + sih + "; _mfid_session=" + mfid_session + "; last_used_application=" + last_used_application + "; _moneybook_session=" + moneybook_session + ";",
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch(redirectURL, options);

    /* moneybook_sessionを取得 */
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "_moneybook_session");

    /* redirectURLを取得 */
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* Request URL: https://moneyforward.com/ */
    headers = {
        "cookie": "_moneybook_session=" + moneybook_session + ";",
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers
    }
    response = UrlFetchApp.fetch(redirectURL, options);

    /* identification_codeを取得 */
    identification_code = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][0], "identification_code");

    /* moneybook_sessionを取得 */
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][1], "_moneybook_session");

    return [identification_code, moneybook_session];

}
/*
コンテンツからリダイレクトURLを取得
———————————–*/
function getredirectURL(content) {
    let $;
    $ = cheerio.load(content);
    return $("a").attr("href");
}