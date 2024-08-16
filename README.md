# Japan Earthquake Telegram Bot

This project is a Google Apps Script bot that monitors real-time earthquake data from the Japan Meteorological Agency (JMA) and sends alerts via Telegram.

## Features

- Checks for new earthquake data every minute
- Sends alerts for earthquakes with magnitude > 4 or intensity > 4
- Customizable alert thresholds
- Uses Telegram for instant notifications

## Setup

1. Create a new Google Apps Script project.
2. Copy the code from `earthquake_bot.gs` into your project.
3. Set up a Telegram bot and get your Bot Token and Chat ID.
4. In Google Apps Script, go to Project Settings > Script Properties and add:
   - `BOT_TOKEN`: Your Telegram Bot Token
   - `CHAT_ID`: Your Telegram Chat ID
5. Deploy the script as a web app.
6. Set up a trigger to run `checkEarthquakes` function every minute.

## Usage

The bot will automatically check for new earthquakes every minute. When a significant earthquake is detected (magnitude > 4 or intensity > 4), it will send a message to the specified Telegram chat.

## Customization

You can modify the alert thresholds by changing the conditions in the `checkEarthquakes` function:

```javascript
if (magnitude > 4 || maxIntensity > 4) {
  sendTelegramMessage(message, true);
} else {
  sendTelegramMessage(message, false);
}
```

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.
