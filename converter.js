/*
HTMLのセレクション要素を配列に変換
———————————–*/
function converterToArray($, html) {
    let array = [];

    $(html).filter(function (i, elem) {
        array.push($(elem).text());
    });

    /* 改行やスペースは除去する */
    for (let i in array) {
        array[i] = array[i].replace(/\s+/g, "");
    }
    return array;
}

/*
HTMLのテーブル要素のヘッダーと値をJSONに変換
———————————–*/
function converterToJson(header, table) {
    /*
    テーブルをデータ数分で等分する
    【参考】JavaScriptで配列や文字列を分割する方法をまとめたよ
    https://pisuke-code.com/js-ways-to-split-string-and-array/#i-3
    ———————————–*/
    let tableLists = [];
    let idx = 0;

    while (idx < table.length) {
        tableLists.push(table.splice(idx, idx + header.length));
    }

    /* ヘッダーを格納する */
    let values = [];
    values.push(header);

    /* テーブルを格納する */
    for (let i in tableLists) {
        values.push(tableLists[i])
    }

    /* ２次元配列をJSONに変換して返す */
    return parse2Json(values);
}

/*
２次元配列をJSONに変換

【参考】GASでgetValuesで得た値をJSON変換する
https://kyogom.com/tech/post-526/
———————————–*/
function parse2Json(values) {
    return values.map(function (value, i, arr) {
        let obj = {};
        if (i === 0) return;
        for (let j = 0; j < value.length; j++) {
            obj[arr[0][j]] = value[j]
        }
        return obj;
    }).splice(1, values.length - 1);
}