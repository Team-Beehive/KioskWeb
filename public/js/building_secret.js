$(() => {
    // eslint-disable-next-line no-undef
    jquery_ui.init(); // See jquery_ui_import.js
    $("#secret").draggable({revert: true, revertDuration: 0});
    $("#secret-drop").droppable(
        {
            drop: function () {
                location.href = "/links";
            }
        });
});