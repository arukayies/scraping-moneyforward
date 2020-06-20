/*
JSONファイルを保存する
———————————–*/
function saveFile(fileName, json) {
    let blob, file, folder;
    fileName = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd") + "-" + fileName;
    blob = Utilities.newBlob("", "application/json", fileName);
    file = blob.setDataFromString(JSON.stringify(json), "UTF-8");
    folder = DriveApp.getFolderById("GoogleドライブのID");
    folder.createFile(file);
}