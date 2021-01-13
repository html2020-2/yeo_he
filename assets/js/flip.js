$(document).ready(function() {
    //키보드 제어 접근성 추가
    $('.card').on({
	focusin: function () {
	    $(this).addClass('flip');
	},
	focusout: function () {
	    $(this).removeClass('flip');
	}
    });
});