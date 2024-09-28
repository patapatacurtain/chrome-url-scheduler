// 'スケジュール設定'ボタンにクリックイベントリスナーを追加
document.getElementById('scheduleButton').addEventListener('click', scheduleURL);

function scheduleURL() {
    // 入力された時刻とURLを取得
    const timeInput = document.getElementById('timeInput').value;
    const urlInput = document.getElementById('urlInput').value;
    const statusElement = document.getElementById('status');

    // 入力チェック
    if (!timeInput || !urlInput) {
        statusElement.textContent = '時刻とURLを入力してください。';
        return;
    }

    // 現在時刻と目標時刻を取得
    const now = new Date();
    const [hours, minutes] = timeInput.split(':');
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // 目標時刻が過去の場合、翌日に設定
    if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    // アラームを設定
    chrome.alarms.create(`openURL_${urlInput}`, {
        when: targetTime.getTime()
    });

    // 設定完了メッセージを表示
    statusElement.textContent = `${targetTime.toLocaleString()}にURLを開く予定です。`;
}
