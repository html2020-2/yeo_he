$(document).ready(function () {
    var digEle = document.getElementById('digital');

    //스마일
    var circleWid;
    var aboutY;

    //그라디언트 회전
    var wid;
    var hei;
    var makeSize;

    //공튀기기
    var _panel = $("#panel");
    var _ball = $("#ball");
    var startX = 0;  //ball이 움직이기 시작하는 위치
    var startY = 0;
    var endX;       //ball이 움직일수 있는 최대 위치
    var endY;
    var stepSize = 6;  //숫자가 작을수록 느려지고, 클수록 빨라진다
    var stepX = stepSize;
    var stepY = stepSize;
    var ballTimer = 0;    

    //디지털시계
    //디지털시계1) 1초에 한번씩 날짜 객체를 생성해 시간 출력 => 반복적인 코드는 함수로 생성하면 좋다
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
    //디지털시계2) 함수 호출
    clock(); 
    //디지털시계3) 시간간격 1초 마다 clock 함수를 반복적으로 동작
    var timer =setInterval(clock, 1000);

    // resize 될때 스마일박스의 시작위치, 바람개비 크기와 위치 설정, 튕기는 볼의 움직이는 범위 제어
    $(window).on('resize', function () {
        circleWid = $('#aboutWrap .circle').width(); 
        aboutY = $('#aboutWrap .aboutMain').offset().top;
        //console.log(circleWid, aboutY);

        wid = $('#gradient').width();
        hei = $('#gradient').height();
    
        makeSize = hei * 3.5;  //배경크기를 110%로 하면 4배까지~~
        //console.log(wid, hei, makeSize);  
        $('#gradient .rotate').css({width: makeSize, height: makeSize, top: -(makeSize-hei)*0.5, left: -(makeSize-wid)*0.5});
    
        endX = _panel.width() - _ball.width(); //ball이 움직일수 있는 최대 위치
        endY = _panel.height() - _ball.height();
      });
    $(window).trigger('resize');

    //ABOUT ME 마우스 움직임 제어 - clientX, clientY (document 문서에서 부터 스크롤을 제외한 마우스의 좌표값)
    $('#aboutWrap .aboutMain').on('mousemove', function (e) {
        var x = e.clientX;  //마우스 수평 위치
        var y = e.clientY - aboutY;  //마우스 수직위치 - .aboutMain의 브라우저 상단에서 수직 떨어진 거리
        //console.log(x, y);
        $(this).find('.verline').css('left', x); //세로라인 : top은 0으로 고정되고 left만 마우스의 x좌표로 업데이트
        $(this).find('.horline').css('top', y);
        $(this).find('.circle').css({left: x - circleWid*0.5, top: y - circleWid*0.5});        
    });

    //flip : 전화번호 키보드 제어 접근성 추가
    $('.card').on({
      focusin: function () {
        $(this).addClass('flip');
      },
      focusout: function () {
        $(this).removeClass('flip');
      }
    });
 
  //그라디언트 회전
  //그라디언트 회전1) 그라디언트 영역 내에서 마우스를 움직이면 배경이미지의 위치를 변경한다
  $('#gradient').on('mousemove', function (e) {
    var mouseX = e.clientX; //document 문서에서 부터 스크롤을 제외한 마우스의 좌표값
    var mouseY = e.clientY;
    //console.log(mouseX + ' : ' + mouseY);
    
    //백틱(`)을 이용하면 내부에 바로 제이쿼리를 작성할수 있다
    //var bgPos = `${50 - (mouseX - wid*0.5) * 0.07}% ${50 - (mouseY - hei*0.5) * 0.07}%`; //#gradient가 정사각형일때
    var bgPos = `${150 - (mouseX - wid*0.5) * 0.07}% ${30 - (mouseY - hei*0.5) * 0.07}%`; //세로로 긴 직사각형일때
    console.log(bgPos);
    $('.rotate').css('background-position', bgPos);
  });
  
  //그라디언트 회전2) 360도 회전 함수 생성
  var timer;
  function AnimateRotate() {
    var duration= 4000;
    timer = setTimeout(function() {
      AnimateRotate();
    },duration);   

    $({deg: 0}).animate({deg: 360}, {
        duration: duration,
        step: function(now) {
          $('.rotate').css({'transform': 'rotate('+ now +'deg)'});
        }
    });
  }

  //그라디언트 회전3) 그라디언트에 진입하면 회전함수를 호출하고, 빠져나오면 반복실행을 멈춘다
  $('#gradient').on({
    mouseenter: function () {
      AnimateRotate();
    },
    mouseleave: function () {
      clearTimeout(timer);
    }
  });

   //공튀기기
   $('#panel').on({
     mouseenter: function () {
       start(); //패널에 진입하면 시작되고
     },
     mouseleave: function () {
       stopMove(); //패널에서 빠져 나오면 멈춘다
     }
   });

   function start(){
     if (ballTimer === 0)
       ballTimer = setInterval(startMove, 25);
   }

   function startMove(){
     startX += stepX;  //시작위치에서 stepSize인 6만큼씩을 더해서 움직이게 한다
     startY += stepY;
     if (startX > endX) stepX = -stepSize;  //최대 위치를 벗어나면 빼주어 내부로 다시 들어오게 함
     if (startX < 0) stepX = stepSize;      //최소 위치보다 더 작아지려하면 다시 초기화
     if (startY > endY) stepY = -stepSize;
     if (startY < 0) stepY = stepSize;

     //absolute 속성을 지닌 #ball의 top과 left 값을 update한다
     _ball.css({top: startY + "px", left: startX + "px"});
     //console.log(ballTimer);
   }

   function stopMove(){
    if (ballTimer !== 0){
        clearInterval(ballTimer);
        ballTimer = 0;
      }
    }
});

/* var modal = document.querySelector('#modal');
setTimeout(function(){
   modal.classList.add('force');
}, 2000);
setTimeout(function(){
   modal.classList.remove('force');
}, 3000); */
