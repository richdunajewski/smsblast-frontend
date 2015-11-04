$(function () {
    var $charsRemaining = $(".chars-remaining");

    $(document).on("keyup", "#input-message", function (e) {
        var remain = 160 - $("#input-message").val().length;

        $charsRemaining.html(remain + ' / 160');

        if (remain < 0) $charsRemaining.addClass('text-danger');
        else $charsRemaining.removeClass('text-danger');
    });
});