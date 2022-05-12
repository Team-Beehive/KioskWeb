function inDiv(string)
{
    return "<div>" + string + "</div>";
}

$(() => {
    function animateThis(targetElement, first, width, speed) {
        $(targetElement).scrollLeft(width + $(first).width() - $(window).width());
        var scrollWidth = $(targetElement).get(0).scrollWidth;
        var clientWidth = $(targetElement).get(0).clientWidth;
        $(targetElement).animate({ scrollLeft: scrollWidth - clientWidth },
            {
                duration: speed,
                easing: "linear",
                complete: () => {
                    animateThis(targetElement, first, width, speed);
                }
            });
    }
    let first = $(".scroll").children()[0];
    let width = document.getElementById("scroll").scrollWidth;
    let str = "";
    let len = $(".scroll").children().length;
    for (let i = 0; i < len; i++) {
        const element = $(".scroll").children()[i];
        str += inDiv($(element).html());
    }
    $(".scroll").prepend(str);
    $(".scroll").append(inDiv($(first).html()));
    animateThis($(".scroll"), first, width, 25000);
});