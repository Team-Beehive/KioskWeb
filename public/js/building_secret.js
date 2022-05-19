$(() => {
    console.log($.ui === undefined);
    $("#secret").draggable();
    $("#secret-drop").droppable(
        {
            drop: function () {
                alert("I am dropped");
            }
        });
});