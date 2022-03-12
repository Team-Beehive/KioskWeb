// Mostly taken from https://www.w3schools.com/howto/howto_js_slideshow.asp

var slideIndex = 1;
showSlides(slideIndex);


setInterval(() => {
    plusSlides(1);
}, 5000);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("slides");
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}