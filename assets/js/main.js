//1) .digital에 시계를 출력하려면 문서가 로딩을 완료 후 작업
window.addEventListener('load', function () {
    //전역 변수로 어디에서든 호출해 사용 하게 clock의 함수 외부로 위치 변경
    var digEle = document.getElementById('digital');

    //2) 1초에 한번씩 날짜 객체를 생성해 시간 출력 => 반복적인 코드는 함수로 생성하면 좋다
    function clock() {
        var now = new Date();
        //console.log(now);

        //2-2)정보를 분리 (연,월,일,요일,시,분)
        var year = now.getFullYear(); //2021
        var month = now.getMonth() + 1; //0-11
        var date = now.getDate();
        var day = now.getDay(); //0-6
        var hour = now.getHours();
        var min = now.getMinutes();
        var s = now.getSeconds();
        //console.log(year, month, date, day, hour, min, s);


        //2-3)0-6까지의 숫자를 문자 일-월요일로 변경
        var dayArry = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        //console.log(dayArry[day]);

        //2-4)오전, 오후 /조건식? 실행문1 : 실행문2;
        var ampm = hour < 12 ? 'AM' : 'PM'
        //console.log(ampm);

        //2-5)0~23시 => 0~11시
        //hour = hour % 12;
        hour %= 12;
        //console.log(hour);

        //2-6)0~11시 => 1~12시
        hour = hour ? hour : 12;
        //console.log(hour);

        //2-7)시, 분이 한자리인 경우 앞에 '0' 추가하기
        if (month < 10) month = '0' + month;
        if (date < 10) date = '0' + date;
        if (hour < 10) hour = '0' + hour;
        if (min < 10) min = '0' + min;
        if (s < 10) s = '0' + s;
        //console.log(hour, min);

        //2-8)result라는 변수에 년.월.일.요일.시.분 호출
        var result = year + ' ' + month + ' ' + date + '<br/>' + dayArry[day] + '<br/>' + ampm + ' ' + hour + ':' + min + ':' + s;  
        //console.log(result);

        digEle.innerHTML = result;
    }
    //3) 처음 한번만 함수 호출
    clock(); 
    //4) 시간간격 1초 마다 clock 함수를 반복적으로 동작
    var timer =setInterval(clock, 1000);
 
});

$(document).ready(function () {
    var circleWid;
    var aboutY;
    $(window).on('resize', function () {
        circleWid = $('#aboutWrap .circle').width(); 
        aboutY = $('#aboutWrap .aboutMain').offset().top;
        console.log(circleWid, aboutY);
    });
    $(window).trigger('resize');
    //ABOUT ME 마우스 움직임 제어 - clientX, clientY (document 문서에서 부터 스크롤을 제외한 마우스의 좌표값)
    $('#aboutWrap .aboutMain').on('mousemove', function (e) {
        var x = e.clientX;  //마우스 수평 위치
        var y = e.clientY - aboutY;  //마우스 수직위치 - .aboutMain의 브라우저 상단에서 수직 떨어진 거리
        console.log(x, y);
        $(this).find('.verline').css('left', x); //세로라인 : top은 0으로 고정되고 left만 마우스의 x좌표로 업데이트
        $(this).find('.horline').css('top', y);
        $(this).find('.circle').css({left: x - circleWid*0.5, top: y - circleWid*0.5});        
    });
});