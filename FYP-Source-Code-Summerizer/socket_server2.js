document.addEventListener("DOMContentLoaded", function() {
    const webSocketURL = 'ws://localhost:8006/chat';
    let webSocket = new WebSocket(webSocketURL);

    webSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        const activeContentDiv = document.querySelector('.content.active .response-output');
        if (data.overwrite) {
            activeContentDiv.innerHTML = data.text;  // Replace current HTML with the new one
        } else {
            activeContentDiv.innerHTML += data.text; // Append new HTML to the existing one
        }
    };

    webSocket.onopen = function(event) {
        console.log("Connection opened");
    };

    webSocket.onerror = function(event) {
        console.error("WebSocket Error:", event);
    };

    webSocket.onclose = function(event) {
        console.log("WebSocket is closed now.");
    };

    // Set up the 'Generate Summary' button functionality
    document.querySelectorAll('.query-input').forEach(input => {
        const button = input.nextElementSibling; // Assuming the button immediately follows the input
        button.addEventListener('click', function() {
            const tabId = this.closest('.content').id;
            const message = input.value;
            if (message.trim() === '') {
                alert('Please enter some code to summarize!');
                return;
            }
            webSocket.send(JSON.stringify({ tabId, message }));
            input.value = message; // Optionally clear the input field after sending
        });
    });

    // Existing event listener for tab switching, no changes here
    document.querySelectorAll('.query-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.shiftKey) {
                const tabId = this.closest('.content').id;
                const message = this.value;
                webSocket.send(JSON.stringify({ tabId, message }));
                this.value = ''; // Clear the input field after sending
            }
        });
    });
});