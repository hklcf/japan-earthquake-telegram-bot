let BOT_TOKEN, CHAT_ID;

function checkEarthquakes() {
  if (!initializeBotTokenAndChatId()) return;
  const url = 'https://www.jma.go.jp/bosai/quake/data/list.json';
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  if (data.length > 0) {
    const latestEarthquake = data[0];
    const lastProcessedId = PropertiesService.getScriptProperties().getProperty('LAST_EARTHQUAKE_ID');
    if (latestEarthquake.eid !== lastProcessedId && latestEarthquake.anm && latestEarthquake.mag && latestEarthquake.maxi && latestEarthquake.int) {
      const magnitude = parseFloat(latestEarthquake.mag);
      const maxIntensity = getMaxIntensity(latestEarthquake.int);
      const message = createMessage(latestEarthquake, magnitude, maxIntensity);
      if (magnitude > 4 || maxIntensity > 4) {
        sendTelegramMessage(message, true);
      } else {
        sendTelegramMessage(message, false);
      }
      PropertiesService.getScriptProperties().setProperty('LAST_EARTHQUAKE_ID', latestEarthquake.eid);
    }
  }
}

function initializeBotTokenAndChatId() {
  BOT_TOKEN = PropertiesService.getScriptProperties().getProperty('BOT_TOKEN');
  CHAT_ID = PropertiesService.getScriptProperties().getProperty('CHAT_ID');
  if (!BOT_TOKEN || !CHAT_ID) {
    Logger.log('錯誤：BOT_TOKEN 或 CHAT_ID 未設置。請在 Google Apps Script 的腳本屬性中設置這些值。');
    return false;
  }
  return true;
}

function getMaxIntensity(intensityData) {
  let maxIntensity = 0;
  for (let i = 0; i < intensityData.length; i++) {
    const intensity = parseIntensity(intensityData[i].maxi);
    if (intensity > maxIntensity) {
      maxIntensity = intensity;
    }
  }
  return maxIntensity;
}

function parseIntensity(intensityString) {
  switch (intensityString) {
    case '1': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    case '5-': return 5.25;
    case '5+': return 5.75;
    case '6-': return 6.25;
    case '6+': return 6.75;
    case '7': return 7;
    default: return 0;
  }
}

function createMessage(earthquake, magnitude, maxIntensity) {
  const time = new Date(earthquake.at).toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'});
  const location = earthquake.anm;
  return `地震報告:\n時間: ${time} (JST)\n位置: ${location}\n規模: ${magnitude}\n最大震度: ${maxIntensity}`;
}

function sendTelegramMessage(message, withNotification) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const options = {
    'method': 'post',
    'payload': {
      'chat_id': CHAT_ID,
      'text': message,
      'disable_notification': !withNotification
    }
  };
  UrlFetchApp.fetch(url, options);
}

function setupTrigger() {
  ScriptApp.newTrigger('checkEarthquakes')
    .timeBased()
    .everyMinutes(1)
    .create();
}

function clearLastEarthquakeId() {
  PropertiesService.getScriptProperties().deleteProperty('LAST_EARTHQUAKE_ID');
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Earthquake Bot is running.");
}
