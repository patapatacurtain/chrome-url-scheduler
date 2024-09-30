// スケジュールを保存するためのローカルストレージキー
const SCHEDULE_STORAGE_KEY = 'urlSchedules';

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('scheduleButton').addEventListener('click', scheduleURL);
    loadSchedules();
});

async function scheduleURL() {
    const timeInput = document.getElementById('timeInput').value;
    const urlInput = document.getElementById('urlInput').value;
    const statusElement = document.getElementById('status');

    if (!timeInput || !urlInput) {
        statusElement.textContent = '時刻とURLを入力してください。';
        return;
    }

    const now = new Date();
    const [hours, minutes] = timeInput.split(':');
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const scheduleId = Date.now().toString();
    const alarmName = 'openURL_' + scheduleId;

    chrome.alarms.create(alarmName, {
        when: targetTime.getTime()
    });

    // スケジュールを保存し、完了を待つ
    await saveSchedule(scheduleId, urlInput, targetTime);

    statusElement.textContent = targetTime.toLocaleString() + 'にURLを開く予定です。';
    loadSchedules(); // スケジュール一覧を更新
}

function saveSchedule(id, url, time) {
    return new Promise((resolve) => {
        chrome.storage.local.get({ [SCHEDULE_STORAGE_KEY]: [] }, (result) => {
            const schedules = result[SCHEDULE_STORAGE_KEY];
            schedules.push({ id, url, time: time.getTime() });
            chrome.storage.local.set({ [SCHEDULE_STORAGE_KEY]: schedules }, resolve);
        });
    });
}

function loadSchedules() {
    chrome.storage.local.get({ [SCHEDULE_STORAGE_KEY]: [] }, (result) => {
        const schedules = result[SCHEDULE_STORAGE_KEY];
        const scheduleList = document.getElementById('scheduleList');
        scheduleList.innerHTML = '';

        schedules.forEach((schedule) => {
            const li = document.createElement('li');
            const time = new Date(schedule.time);
            li.textContent = time.toLocaleString() + ' - ' + schedule.url;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.onclick = () => deleteSchedule(schedule.id);

            li.appendChild(deleteButton);
            scheduleList.appendChild(li);
        });
    });
}

function deleteSchedule(id) {
    chrome.alarms.clear('openURL_' + id);
    chrome.storage.local.get({ [SCHEDULE_STORAGE_KEY]: [] }, (result) => {
        let schedules = result[SCHEDULE_STORAGE_KEY];
        schedules = schedules.filter(schedule => schedule.id !== id);
        chrome.storage.local.set({ [SCHEDULE_STORAGE_KEY]: schedules }, () => {
            loadSchedules(); // スケジュール一覧を更新
        });
    });
}