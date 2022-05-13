function inDiv(string)
{
    return "<div>" + string + "</div>";
}

$(() => {
    // Adapted from https://stackoverflow.com/a/39339457
    function animateThis(targetElement, first, speed) {
        var scrollWidth = $(targetElement).get(0).scrollWidth;
        var clientWidth = $(targetElement).get(0).clientWidth;

        $(targetElement).scrollLeft((scrollWidth - $(first).width()) / 2 + $(first).width() - $(window).width());

        $(targetElement).animate({ scrollLeft: scrollWidth - clientWidth },
            {
                duration: speed,
                easing: "linear",
                complete: () => {
                    animateThis(targetElement, first, speed);
                }
            });
    }

    let first = $(".scroll").children()[0];

    let str = "";
    let len = $(".scroll").children().length;
    for (let i = 0; i < len; i++) {
        const element = $(".scroll").children()[i];
        str += inDiv($(element).html());
    }

    $(".scroll").prepend(str);
    $(".scroll").append(inDiv($(first).html()));
    
    animateThis($(".scroll"), first, 25000);
});