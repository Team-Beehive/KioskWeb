$(() => {
    // While this bit may seem strange, it's to make sure that when the images are scrolling 
    // and it jumps back to the first image, there's a slim-to-none chance that there's any visual 
    // disturbance. This takes all the children of the scroll and prepends them to the scroll div. 
    // Firstly, it gets all of the images in the scroll div and puts them in the string.
    // Next, it grabs the scroll width and client width, and while the scroll width is less 
    // than twice the client width, it prepends the scroll contents into the front of the scroll.
    // Finally, it appends the first image of the div to the last one for an infinite scroll effect.
    let first = $(".photobanner").children().first();
    let str = "";

    let len = $(".photobanner").children().length;
    if (len > 0)
    {
        for (let i = 0; i < len; i++) {
            const element = $(".photobanner").children()[i];
            str += element.outerHTML;
        }

        var bannerWidth = $($(".photobanner").get(0)).width();
        var documentWidth = $(document).width();

        do {
            $(".photobanner").prepend(str);

            bannerWidth = $($(".photobanner").get(0)).width();
            documentWidth = $(document).width();
        } while (bannerWidth <= documentWidth * 1.5);


        $(".photobanner").append(first.outerHTML);

        documentWidth = $(document).width();
        bannerWidth = $($(".photobanner").get(0)).width();

        // document.documentElement.style
        //     .setProperty("--start-image-percent", -1 * ((bannerWidth - $(first).width()) / 2 + $(first).width() - documentWidth) / bannerWidth * 100 + "%");
    }
    else
    {
        $(".photobanner").append("<p>There are no images in the images/Slides folder!<br>Please add some.</p>");
    }
    
});