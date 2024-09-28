chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith('openURL_')) {
        const url = alarm.name.split('_')[1];
        chrome.tabs.create({ url: url });
    }
});