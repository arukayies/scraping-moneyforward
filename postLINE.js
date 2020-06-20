/*
LINE情報
———————————–*/
const LINE_TOKEN = "LINEのトークン";
const TO = "送信する宛先ID";

/*
LINEに資産情報を送信する
———————————–*/
function postLINE(portFolioName, json, headerName, keyName) {

    let message, headers, postData, options;

    message = "【" + portFolioName + "】\n";

    /* 送信メッセージを組み立てる */
    for (let i in json) {
        for (let key in json[i]) {
            /* headerNameが一致したら、メッセージとして組み込む */
            if (key == headerName) {
                message = message + json[i][key] + " : ";
            }
            /* keyNameが一致したら、メッセージとして組み込む */
            if (key == keyName) {
                message = message + json[i][key] + "\n";
            }
        }
    }

    /* LINEに送信する */
    headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + LINE_TOKEN,
    };
    postData = {
        "to": TO,
        "messages": [{
            "type": "text",
            "text": message
        }]
    };
    options = {
        "method": "post",
        "headers": headers,
        "payload": JSON.stringify(postData)
    };
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);
}