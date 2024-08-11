// host.js
document.addEventListener('DOMContentLoaded', () => {
    // Subscribe to widget ready event
    PubSub.subscribe('widgetReady', () => {
        console.log('Widget is ready');
        // Send authentication information
        PubSub.publish('authenticate', {
            token: 'secure-token-123',
            userId: 'user-456'
        });
        console.log('Sent Widget authentication information');

    });
});