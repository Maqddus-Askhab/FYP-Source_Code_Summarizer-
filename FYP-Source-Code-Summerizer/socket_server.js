document.addEventListener("DOMContentLoaded", function() {
    const webSocketURL = 'ws://localhost:8006/chat'; // Adjust this URL as necessary
    let webSocket = new WebSocket(webSocketURL);

    webSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        const activeContentDiv = document.querySelector('.content.active .response-output');
        console.log("data: ", data, data.overwrite, data.text)
        if (data.overwrite) {
            console.log('if condition...')
            activeContentDiv.innerHTML = data.text;  // Use innerHTML since content is now HTML
        } else {
            console.log('else condition...')
            activeContentDiv.innerHTML += data.text;
        }
    };
    


    // webSocket.onmessage = function(event) {
    //     const data = JSON.parse(event.data);
    //     const activeContentDiv = document.querySelector('.content.active .response-output');
    
    //     // Convert Markdown to HTML
    //     if (typeof marked === 'function') {  // Check if 'marked' is loaded
    //         const htmlContent = marked(data.text);
    //         console.log(typeof marked )
    //         activeContentDiv.innerHTML = htmlContent;  // Set the converted HTML
    //     } else {
    //         console.error('Marked is not defined.');
    //         activeContentDiv.textContent = data.text;  // Fallback to plain text
    //     }
    // };
    
//     webSocket.onmessage = function(event) {
//         const data = JSON.parse(event.data);
//         const activeContentDiv = document.querySelector('.content.active .response-output');
//         console.log("dt: ", data.text)
//         // Convert Markdown to HTML using marked
//         // const htmlContent = marked(data.text);
//         console.log("htmlContent: ", data.text);
// // 
//         // Set the innerHTML to display formatted content
//         activeContentDiv.innerHTML = data.text;
//     };
    webSocket.onopen = function(event) {
        console.log("Connection opened");
    };

    webSocket.onerror = function(event) {
        console.error("WebSocket Error:", event);
    };

    // webSocket.onmessage = function(event) {
    //     const data = JSON.parse(event.data);
    //     const activeContentDiv = document.querySelector('.content.active .response-output');
    //     if (data.overwrite) {
    //         activeContentDiv.textContent = data.text; // Overwrite existing content
    //     } else {
    //         activeContentDiv.textContent += data.text; // Append to existing content
    //     }
    // };

    document.querySelectorAll('.query-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.shiftKey) {
                const tabId = this.closest('.content').id;
                const message = this.value;
                webSocket.send(JSON.stringify({ tabId, message }));
                this.value = message;
                //this.value = ""; // Clear the input field after sending
            }
        });
    });

    webSocket.onclose = function(event) {
        console.log("WebSocket is closed now.");
    };
});



// document.addEventListener("DOMContentLoaded", function() {
//     const webSocketURL = 'ws://localhost:8000/chat'; // Adjust this URL as necessary
//     let webSocket = new WebSocket(webSocketURL);

//     webSocket.onopen = function(event) {
//         console.log("Connection opened");
//     };

//     webSocket.onerror = function(event) {
//         console.error("WebSocket Error:", event);
//     };

//     webSocket.onmessage = function(event) {
//         const data = JSON.parse(event.data);
//         const activeContentDiv = document.querySelector('.content:not(.hidden) .response-output');
//         if (data.overwrite) {
//             activeContentDiv.textContent = data.text; // Overwrite existing content
//         } else {
//             activeContentDiv.textContent += data.text; // Append to existing content
//         }
//     };

//     document.querySelectorAll('.query-input').forEach(input => {
//         input.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 const message = this.value;
//                 webSocket.send(message);
//                 this.value = message; // Clear the input field after sending
//             }
//         });
//     });

//     webSocket.onclose = function(event) {
//         console.log("WebSocket is closed now.");
//     };
// });





// document.addEventListener("DOMContentLoaded", function() {
//     const webSocket = new WebSocket('wss://localhost:8000/chat?sid=sid');

//     webSocket.onmessage = function(event) {
//         const data = JSON.parse(event.data);
//         const outputDiv = document.querySelector(`#${data.tabId} .response-output`);
//         outputDiv.textContent = data.message; // Update the response output
//     };

//     document.querySelectorAll('.query-input').forEach(input => {
//         input.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 const tabId = this.closest('.content').id;
//                 const message = this.value;
//                 webSocket.send(JSON.stringify({ tabId, message }));
//                 this.value = message; // dont Clear the input field after sending
//             }
//         });
//     });
// });
