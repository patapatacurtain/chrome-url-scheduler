chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith('openURL_')) {
        const scheduleId = alarm.name.split('_')[1];
        chrome.storage.local.get({ urlSchedules: [] }, (result) => {
            const schedule = result.urlSchedules.find(s => s.id === scheduleId);
            if (schedule) {
                chrome.tabs.create({ url: schedule.url });
                // スケジュールを削除
                const updatedSchedules = result.urlSchedules.filter(s => s.id !== scheduleId);
                chrome.storage.local.set({ urlSchedules: updatedSchedules });
            }
        });
    }
});