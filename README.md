# Biblical Clock Web Application

A web-based clock that displays Bible verses corresponding to the current time, where the hours represent the chapter and minutes represent the verse number.

## Files Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `script.js` - JavaScript logic for the clock and verse display
- `verses.json` - JSON database of Bible verses (to be filled with your verses)
- `sw.js` - Service Worker for offline functionality
- `README.md` - This documentation file

## Features

- **Real-time Clock**: Displays current time in 12-hour format
- **Bible Verse Display**: Shows verses based on current time (hour:minute = chapter:verse)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Support**: Uses Service Worker for offline functionality
- **Fallback System**: Gracefully handles missing verses with fallback logic
- **Loading States**: Shows loading and error states appropriately

## How It Works

1. The clock displays the current time (e.g., 3:16 PM)
2. The app looks for a Bible verse with chapter 3, verse 16
3. If found, it displays the book name, chapter:verse reference, and the verse text
4. If not found, it looks for any verse with chapter 3
5. If still not found, it displays the first available verse as fallback

## Customizing the Verses

Edit the `verses.json` file to add your own Bible verses. Each verse should follow this format:

```json
{
  "book": "John",
  "chapter": 3,
  "verse": 16,
  "text": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
}
```

## Time Mapping Examples

- 1:01 AM/PM → Look for Chapter 1, Verse 1
- 3:16 AM/PM → Look for Chapter 3, Verse 16
- 12:34 AM/PM → Look for Chapter 12, Verse 34
- 11:59 AM/PM → Look for Chapter 11, Verse 59

## Getting Started

1. Open `index.html` in a web browser
2. The clock will start automatically
3. Customize the verses in `verses.json` as needed
4. For web server deployment, ensure all files are in the same directory

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App features supported where available

## Deployment

Simply upload all files to your web server. The app will work as a standalone web page with no server-side requirements.

## Future Enhancements

- Add more verses to cover all possible time combinations (12 chapters × 60 verses = 720 verses)
- Add verse categories or themes
- Include multiple Bible translations
- Add daily verse rotation
- Include verse of the day feature
- Add search functionality for specific verses