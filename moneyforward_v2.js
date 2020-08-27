/*
moneyforwardのログイン
———————————–*/
function login_v2(email, password) {
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
        last_signed_in_email,
        identification_code,
        moneybook_session

    /* ①Request URL: https://moneyforward.com/ */
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

    /* ②Request URL: https://moneyforward.com/sign_in */
    headers = {
        "cookie": "_moneybook_session=" + moneybook_session + ";",
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch("https://moneyforward.com/sign_in", options);
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "_moneybook_session");
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* ③Request URL: https://moneyforward.com/auth/mfid?prompt=select_account */
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
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "_moneybook_session");
    redirectURL = response.getAllHeaders()["Location"];

    /* ④Request URL: https://id.moneyforward.com/oauth/authorize */
    headers = {
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch(redirectURL, options);
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* ⑤Request URL: https://id.moneyforward.com/account_selector */
    response = UrlFetchApp.fetch(redirectURL, options);
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* ⑥Request URL: https://id.moneyforward.com/sign_in */
    response = UrlFetchApp.fetch(redirectURL, options);
    redirectURL = getredirectURL(response.getContentText("UTF-8"));
    last_used_application = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "last_used_application");

    /* ⑦Request URL: https://id.moneyforward.com/sign_in/new */
    headers = {
        "cookie": "_mfid_session=" + mfid_session + "; last_used_application=" + last_used_application + ";",
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers,
        "followRedirects": false
    }
    response = UrlFetchApp.fetch(redirectURL, options);
    mfid_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"], "_mfid_session");
    $ = cheerio.load(response.getContentText("UTF-8"));
    authenticity_token = $("meta[name='csrf-token']").attr("content");
    authorizationParams = $("script")[2]["children"][0]["data"];
    authorizationParams = JSON.parse(authorizationParams.match(/gon.authorizationParams=(\{.*?\})/)[1]);

    /* ⑧Request URL: https://id.moneyforward.com/sign_in */
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
    sih = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][0], "sih");
    mfid_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][1], "_mfid_session");
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* ⑨Request URL: https://id.moneyforward.com/oauth/authorize */
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
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* ⑩Request URL: https://moneyforward.com/auth/mfid/callback */
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
    last_signed_in_email = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][0], "last_signed_in_email");
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][1], "_moneybook_session");
    redirectURL = getredirectURL(response.getContentText("UTF-8"));

    /* ⑪Request URL: https://moneyforward.com/ */
    headers = {
        "cookie": "_moneybook_session=" + moneybook_session + "; last_signed_in_email=" + last_signed_in_email + ";",
        "user-agent": userAgent
    }
    options = {
        "method": "get",
        "headers": headers
    }
    response = UrlFetchApp.fetch(redirectURL, options);
    identification_code = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][0], "identification_code");
    moneybook_session = CookieUtil.getValue(response.getAllHeaders()["Set-Cookie"][1], "_moneybook_session");

    return [identification_code, moneybook_session];

}