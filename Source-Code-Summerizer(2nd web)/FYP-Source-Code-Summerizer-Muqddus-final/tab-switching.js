// document.addEventListener("DOMContentLoaded", function() {
//     const tabs = document.querySelectorAll('.btn_tab');
//     console.log("Tabs found:", tabs.length); // Check how many tabs are found
//     const contents = document.querySelectorAll('.content');
//     console.log("Content sections found:", contents.length);
//     tabs.forEach(tab => {
//         tab.addEventListener('click', function() {
//             console.log("Tab clicked:", this.id); 
//             // Remove active class from all contents and hide them
//             contents.forEach(content => content.classList.add('hidden'));
//             // console.log("Hiding content:", content.id);
            
//             // Add active class to the corresponding content
//             const contentId = 'content-' + this.id.split('-')[1];
//             document.getElementById(contentId).classList.remove('hidden');
//             console.log("Showing content:", contentId); // Log content being shown

//         });
//     });
// });

// --------------------------------------------------------


// document.addEventListener("DOMContentLoaded", function() {
//     const tabs = document.querySelectorAll('.btn_tab');
//     const contents = document.querySelectorAll('.content');

//     tabs.forEach(tab => {
//         tab.addEventListener('click', function() {
//             console.log("Tab clicked:", this.id);
            
//             // Hide all contents
//             contents.forEach(content => {
//                 content.classList.add('hidden');
//                 console.log("Hiding content:", content.id);
//             });
            
//             // Show the corresponding content
//             const contentId = 'content-' + this.id.split('-')[1];
//             const contentToShow = document.getElementById(contentId);
//             if (contentToShow) {
//                 contentToShow.classList.remove('hidden');
//                 console.log("Showing content:", contentId);
//             } else {
//                 console.log("No content found for:", contentId);
//             }
//         });
//     });
// });

// ------------------------------------------------------
// document.addEventListener("DOMContentLoaded", function() {
//     const tabs = document.querySelectorAll('.btn_tab');
//     const contents = document.querySelectorAll('.content');

//     // Automatically activate the first tab and its content
//     tabs[0].classList.add('active_tab');
//     contents[0].classList.add('active');
//     contents[0].classList.remove('hidden');

//     tabs.forEach(tab => {
//         tab.addEventListener('click', function() {
//             // Remove active styles from all tabs and hide all contents
//             tabs.forEach(t => {
//                 t.classList.remove('active_tab');
//                 contents.forEach(content => {
//                     content.classList.remove('active');
//                     content.classList.add('hidden');
//                 });
//             });

//             // Add active styles to clicked tab and show corresponding content
//             this.classList.add('active_tab');
//             const contentId = 'content-' + this.id.split('-')[1];
//             const contentToShow = document.getElementById(contentId);
//             contentToShow.classList.add('active');
//             contentToShow.classList.remove('hidden');
//         });
//     });
// });
// ------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll('.btn_tab');
    const contents = document.querySelectorAll('.content');

    // Function to remove active states
    function deactivateAllTabs() {
        tabs.forEach(t => {
            t.classList.remove('active_tab'); // Remove active state from all tabs
        });
        contents.forEach(c => {
            c.classList.remove('active'); // Hide all content divs
            c.classList.add('hidden');
        });
    }

    // Set the first tab as active initially
    tabs[0].classList.add('active_tab');
    contents[0].classList.add('active');
    contents[0].classList.remove('hidden');

    // Add click event listeners to tabs
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            deactivateAllTabs(); // Deactivate all tabs and hide their contents
            tab.classList.add('active_tab'); // Activate the clicked tab
            contents[index].classList.add('active'); // Show the corresponding content
            contents[index].classList.remove('hidden');
        });
    });
});

