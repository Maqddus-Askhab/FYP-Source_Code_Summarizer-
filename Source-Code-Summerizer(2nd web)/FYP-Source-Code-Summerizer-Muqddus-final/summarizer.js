
document.addEventListener("DOMContentLoaded", function() {

    var tabBtns = document.querySelectorAll(".tab_btn");
    var contents = document.querySelectorAll(".content");
    tabBtns.forEach(function(tabBtn, index) {
        tabBtn.addEventListener("click", function() {
            tabBtns.forEach(function(btn) {
                btn.classList.remove("active");
            });
            tabBtn.classList.add("active");
            contents.forEach(function(content) {
                content.style.display = "none";
            });
            contents[index].style.display = "block";
        });
    });
    tabBtns[0].click();
});
