$(() => {
    // Appends the same images to the end of the photobanner for an infinite scrolling effect.
    // Repeats until it's at least twice the size of the screen width just for good measure.
    // Makes it so that once it hops back to the start, it won't cause any strange effects.

    let imageAmount = $(".photobanner").children().length;
    if (imageAmount > 0)
    {
        let str = "";

        for (let i = 0; i < imageAmount; i++) {
            const element = $(".photobanner").children()[i];
            str += element.outerHTML;
        }

        var bannerWidth = $($(".photobanner").get(0)).width();
        var documentWidth = $(document).width();

        var copyAmount = 1; // Starts with the one original copy
        do {
            $(".photobanner").append(str);

            bannerWidth = $($(".photobanner").get(0)).width();
            documentWidth = $(document).width();
            copyAmount++;
        } while (bannerWidth <= documentWidth * 2);

        // Depending on the amount of copies, we will have to change where at in the rotation
        // it goes back at. 
        // e.g., at 2 copies it'll at go back at 50%, at 3 copies, 33.33%, 4, 25%, etc.
        document.documentElement.style
            .setProperty("--repeat-at", -1 * 100 / copyAmount + "%");
        
        // Give each image about 12 seconds on the screen.
        // Gives a relative speed so that no matter how many images are put in the slides folder,
        // it'll stay a somewhat constant speed.
        document.documentElement.style
            .setProperty("--bannerSpeed", 12 * imageAmount + "s");
    }
    else
    {
        $(".photobanner").append("<p>There are no images in the Slides folder!<br>Please add some.</p>");
    }
    
});