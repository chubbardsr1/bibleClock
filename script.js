// Biblical Clock Application
class BiblicalClock {
    constructor() {
        this.verses = null;
        this.bookNameElement = document.getElementById('bookName');
        this.chapterVerseElement = document.getElementById('chapterVerse');
        this.timeFormatElement = document.getElementById('timeFormat');
        this.verseTextElement = document.getElementById('verseText');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.errorMessage = document.getElementById('errorMessage');
        
        this.init();
    }

    async init() {
        try {
            await this.loadVerses();
            this.startClock();
        } catch (error) {
            console.error('Failed to initialize Biblical Clock:', error);
            this.showError('Failed to load biblical verses');
        }
    }

    async loadVerses() {
        try {
            this.showLoading(true);
            console.log('Attempting to load verses.json...');
            
            // Add strong cache-busting parameter to prevent browser caching
            const cacheBuster = new Date().getTime() + Math.random();
            const response = await fetch(`verses.json?v=${cacheBuster}&nocache=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            console.log('Raw response text:', text.substring(0, 200) + '...');
            
            this.verses = JSON.parse(text);
            console.log('Verses loaded successfully:', this.verses.verses?.length || 0, 'verses found');
            
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading verses:', error);
            this.showLoading(false);
            throw error;
        }
    }

    startClock() {
        // Update immediately
        this.updateClock();
        
        // Update every second
        setInterval(() => {
            this.updateClock();
        }, 1000);
        
        // Auto-refresh page every minute (at the start of each new minute)
        this.scheduleMinuteRefresh();
    }
    
    scheduleMinuteRefresh() {
        const now = new Date();
        const secondsUntilNextMinute = 60 - now.getSeconds();
        
        // Schedule the first refresh at the next minute mark
        setTimeout(() => {
            window.location.reload();
        }, secondsUntilNextMinute * 1000);
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Format time display - 12 hour format with leading zeros for minutes
        const displayHours = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
        
        this.timeFormatElement.textContent = timeString;
        
        // Get biblical verse based on time
        this.displayVerse(displayHours, minutes);
    }

    displayVerse(chapter, verse) {
        console.log(`Displaying verse for time ${chapter}:${verse}`);
        console.log('Verses object:', this.verses);
        
        if (!this.verses) {
            console.error('Verses not loaded!');
            this.showError('Verses not loaded');
            return;
        }

        // Look for matching verse
        const verseData = this.findVerse(chapter, verse);
        console.log('Found verse data:', verseData);
        
        if (verseData) {
            this.hideError();
            // Display book name in title, or fallback message if blank
            const bookName = verseData.book && verseData.book.trim() !== '' 
                ? verseData.book 
                : 'God is good all the time, and all the time God is good';
            this.bookNameElement.textContent = bookName;
            // Display chapter:verse in time area with leading zero for verse
            this.chapterVerseElement.textContent = `${verseData.chapter}:${verseData.verse.toString().padStart(2, '0')}`;
            // Display verse text
            this.verseTextElement.textContent = verseData.text;
            console.log(`Displayed: ${verseData.book} ${verseData.chapter}:${verseData.verse}`);
        } else {
            // Show fallback message with leading zero for verse
            console.log('No verse found, showing fallback');
            this.bookNameElement.textContent = 'God is good all the time, and all the time God is good';
            this.chapterVerseElement.textContent = `${chapter}:${verse.toString().padStart(2, '0')}`;
            this.verseTextElement.textContent = 'No verse available for this time. Please add more verses to the database.';
        }
    }

    findVerse(targetChapter, targetVerse) {
        if (!this.verses || !this.verses.verses) {
            return null;
        }

        // Look for exact match first
        let exactMatch = this.verses.verses.find(v => 
            v.chapter === targetChapter && v.verse === targetVerse
        );
        
        if (exactMatch) {
            return exactMatch;
        }

        // Look for any verse with matching chapter
        let chapterMatch = this.verses.verses.find(v => 
            v.chapter === targetChapter
        );
        
        if (chapterMatch) {
            return chapterMatch;
        }

        // Return first available verse as fallback
        return this.verses.verses.length > 0 ? this.verses.verses[0] : null;
    }

    showLoading(show) {
        this.loadingIndicator.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        this.errorMessage.style.display = 'block';
        this.errorMessage.querySelector('p').textContent = message;
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

// Force hard refresh to bypass cache
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    // If this is a refresh, force a hard reload to bypass cache
    if (!sessionStorage.getItem('hardRefreshDone')) {
        sessionStorage.setItem('hardRefreshDone', 'true');
        window.location.reload(true);
    }
} else {
    // Clear the flag for new page loads
    sessionStorage.removeItem('hardRefreshDone');
}

// Initialize the Biblical Clock when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BiblicalClock();
});

// Service Worker registration for offline capability (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}