$(() => {
    console.log($.ui === undefined);
    $("#secret").draggable({revert: true, revertDuration: 0});
    $("#secret-drop").droppable(
        {
            drop: function () {
                location.href = "/links";
            }
        });
});