// Mostly taken from https://www.w3schools.com/howto/howto_js_slideshow.asp
const TIMER = 5000;

$(() => 
{
    showSlides(slideIndex);
});

var slideIndex = 1;

function atInterval() 
{
    plusSlides(1);
}

var interval = setInterval(atInterval, TIMER);

function plusSlides(n) 
{
    showSlides(slideIndex += n);
}

// Next/previous controls

function showSlides(n) 
{
    var slides = $(".slides");

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    $(".slides").css("display", "none");

    $(slides[slideIndex - 1]).css("display", "block");

    clearInterval(interval);
    interval = setInterval(atInterval, TIMER);
}
