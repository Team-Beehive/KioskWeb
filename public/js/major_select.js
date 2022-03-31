// Quick fix for divs not collapsing correctly 
$(() => 
{
    $(".oit-card").before()
        // .css("content", "")
        // .css("float", "left")
        .css("padding-top", "100%");


    $(".collapser").on("click", () => {
        // $(".collapse").collapse("hide");
        $(".oit-card").before()
            .css("padding-top", "100%");
        // .css("float", "left");
    });
});
