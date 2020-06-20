/*
moneyforwardのログイン情報
———————————–*/
const email = "メールアドレス";
const password = "パスワード";

/*
1日１回moneyforwardの資産ページから各資産をJSONファイルに保存し、LINE、Slackに送信する
———————————–*/
function dailyGetPortFolio() {
    let header, table, json;

    /* moneyforwardにログインし、セッション情報を取得する[identification_code, moneybook_session] */
    const session = login(email, password);

    /* 資産ページのコンテンツを取得する */
    const headers = {
        "cookie": "identification_code=" + session[0] + "; _moneybook_session=" + session[1] + ";",
        "user-agent": userAgent
    }
    const options = {
        "method": "get",
        "headers": headers
    }
    const response = UrlFetchApp.fetch("https://moneyforward.com/bs/portfolio", options);
    const $ = cheerio.load(response.getContentText("UTF-8"));

    /* 預金・現金・仮想通貨を取得 */
    header = converterToArray($, "table[class='table table-bordered table-depo'] > thead > tr > th");
    table = converterToArray($, "table[class='table table-bordered table-depo'] > tbody > tr > td");
    json = converterToJson(header, table);
    /* いつか分析するためにJSONファイルを保存する */
    saveFile("預金・現金・仮想通貨", json);
    /* LINEに送る */
    postLINE("預金・現金・仮想通貨", json, "種類・名称", "残高");
    /* Slackに送る */
    postSlack("預金・現金・仮想通貨", JSON.stringify(json));

    /* 株式（現物）を取得 */
    header = converterToArray($, "table[class='table table-bordered table-eq'] > thead > tr > th");
    table = converterToArray($, "table[class='table table-bordered table-eq'] > tbody > tr > td");
    json = converterToJson(header, table);
    /* いつか分析するためにJSONファイルを保存する */
    saveFile("株式(現物)", json);
    /* LINEに送る */
    postLINE("株式(現物)", json, "銘柄名", "評価額");
    /* Slackに送る */
    postSlack("株式(現物)", JSON.stringify(json));

    /* 投資信託を取得 */
    header = converterToArray($, "table[class='table table-bordered table-mf'] > thead > tr > th");
    table = converterToArray($, "table[class='table table-bordered table-mf'] > tbody > tr > td");
    json = converterToJson(header, table);
    /* いつか分析するためにJSONファイルを保存する */
    saveFile("投資信託", json);
    /* LINEに送る */
    postLINE("投資信託", json, "銘柄名", "評価額");
    /* Slackに送る */
    postSlack("投資信託", JSON.stringify(json));

    /* 年金を取得 */
    header = converterToArray($, "table[class='table table-bordered table-pns'] > thead > tr > th");
    table = converterToArray($, "table[class='table table-bordered table-pns'] > tbody > tr > td");
    json = converterToJson(header, table);
    /* いつか分析するためにJSONファイルを保存する */
    saveFile("年金", json);
    /* LINEに送る */
    postLINE("年金", json, "名称", "現在価値");
    /* Slackに送る */
    postSlack("年金", JSON.stringify(json));

}