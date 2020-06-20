/*
SLACK情報
———————————–*/
const SLACK_TOKEN = "Slackのトークン";

/*
SLACKに資産情報を送信する
———————————–*/
function postSlack(portFolioName, json) {
    const attachments = JSON.stringify([
        {
            "color": "#FD8F07",
            "blocks": [
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*資産種別:*\n" + portFolioName
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*日付:*\n" + Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd")
                        }

                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "*ログ:*\n```" + json + "```"
                    }
                }
            ]
        }
    ]);
    const payload = {
        "channel": "gas",
        "attachments": attachments
    };
    const options = {
        "method": "post",
        "payload": payload
    };
    return UrlFetchApp.fetch("https://slack.com/api/chat.postMessage?token=" + SLACK_TOKEN, options);
}