// Collapses all other divs when one is clicked
$(() => 
{
    $("p").on("click", () => {
        $(".collapse").collapse("hide");
    });
});
