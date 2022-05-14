function inDiv(string)
{
    return "<div>" + string + "</div>";
}

$(() => {
    // Adapted from https://stackoverflow.com/a/39339457
    function animateThis(targetElement, first, speed) {
        var scrollWidth = $(targetElement).get(0).scrollWidth;
        var clientWidth = $(targetElement).get(0).clientWidth;

        // Move to the 'first' image
        $(targetElement).scrollLeft((scrollWidth - $(first).width()) / 2 + $(first).width() - clientWidth);

        $(targetElement).animate({ scrollLeft: scrollWidth - clientWidth },
            {
                duration: speed,
                easing: "linear",
                complete: () => {
                    animateThis(targetElement, first, speed);
                }
            });
    }

    

    // While this bit may seem strange, it's to make sure that when the images are scrolling 
    // and it jumps back to the first image, there's a slim-to-none chance that there's any visual 
    // disturbance. This takes all the children of the scroll and prepends them to the scroll div. 
    // Firstly, it gets all of the images in the scroll div and puts them in the string.
    // Next, it grabs the scroll width and client width, and while the scroll width is less 
    // than twice the client width, it prepends the scroll contents into the front of the scroll.
    // Finally, it appends the first image of the div to the last one for an infinite scroll effect.
    let first = $(".scroll").children()[0];
    let str = "";

    let len = $(".scroll").children().length;
    console.log(len);
    if (len > 0)
    {
        for (let i = 0; i < len; i++) {
            const element = $(".scroll").children()[i];
            str += inDiv($(element).html());
        }

        var scrollWidth = $(".scroll").get(0).scrollWidth;
        var clientWidth = $(".scroll").get(0).clientWidth;

        do {
            $(".scroll").prepend(str);

            scrollWidth = $(".scroll").get(0).scrollWidth;
            clientWidth = $(".scroll").get(0).clientWidth;
        } while (scrollWidth <= clientWidth * 2);

        // Append the first image to the last spot for 'infinite' scrolling
        $(".scroll").append(inDiv($(first).html()));

        animateThis($(".scroll"), first, 25000);
    }
    else
    {
        $(".scroll").append("<p>There are no images in the slides folder!<br>Please add some.</p>");
    }
    
});