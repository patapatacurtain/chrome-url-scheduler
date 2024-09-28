// アラームイベントのリスナーを設定
chrome.alarms.onAlarm.addListener((alarm) => {
    // アラーム名が 'openURL_' で始まる場合の処理
    if (alarm.name.startsWith('openURL_')) {
        // アラーム名からURLを抽出
        const url = alarm.name.split('_')[1];
        // 新しいタブでURLを開く
        chrome.tabs.create({ url: url });
    }
});
