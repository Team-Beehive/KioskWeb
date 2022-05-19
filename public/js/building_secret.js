$(() => {
    $("#secret").draggable();
    $("#secret-drop").droppable(
        {
            drop: function () {
                alert("I am dropped");
            }
        });
});