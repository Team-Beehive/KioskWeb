// Quick fix for cards not collapsing correctly. See scss file

$(() => 
{
    $(".oit-card").before()
        .css("padding-top", "100%");


    $(".collapser").on("click", () => {
        $(".in-group").collapse("hide");
        $(".oit-card").before()
            .css("padding-top", "100%");
    });
});
