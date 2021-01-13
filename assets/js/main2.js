  
$(document).ready(function () {
  $('#moveSection .box2').draggable({
    containment: '.twinkle'   //.twinkle 안에서만
  });

  $('#moveSection .box3').draggable({
    axis: 'x',  //x축-가로방향
    containment: '.lightGreen'
});

  var digEle = document.getElementById('digital');

  //스마일
  var circleWid;
  var aboutY;

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

  //가로 스크롤
  var $win = $(window);
    var $menu = $('#vansIndicator ul li');
    var $cntWrap = $('.pjContainer .vansCnt_wrap');
    var tgIdx = 0;  //로딩시 보여지는 섹션의 인덱스 번호, 인디케이터의 활성화 번호
    var total = $cntWrap.children().size(); //섹션의 전체 개수
    var winWidth;   //window의 가로크기를 저장할 전역변수
    var timerResize = 0; //resize이벤트의 실행문 누적을 방지 하기위해 clearTimeout()에서 호출
    var timerWheel = 0; //mousewheel 이벤트의 실행문 누적을 방지
    //console.log(total);

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
//그라디언트 회전1) 360도 회전 함수 생성
var timer;
function AnimateRotate() {
  var duration= 4000;
  timer = setTimeout(function() {
    AnimateRotate();
  }, duration);   

  $({deg: 0}).animate({deg: 360}, {
      duration: duration,
      step: function(now) {
        $('.rotate').css({'transform': 'rotate('+ now +'deg)'});
      }
  });
}

//그라디언트 회전2) 그라디언트에 진입하면 회전함수를 호출하고, 빠져나오면 반복실행을 멈춘다
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

  // modal window
  //modal1) 열기 버튼 클릭 이벤트
$('#aboutWrap .smile').on('click', function (e) {
  //1) 필요한 변수 선언
  var _openBtn = $(this); //모달 닫기 버튼 클릭시 포커스 강제 이동을 위해
  var _mdCnt = $( $(this).data('target') );
  //console.log(_mdCnt, typeof _mdCnt); //string타입을 $()로 감싸서 선택자로 변경함 
  var _closeBtn = _mdCnt.find('.class');
  var _dim =_mdCnt.find('.background');
  var timer = 0;

  //modal2) 스크린리더에서는 열려진 모달 말고는 접근하지 못하도록 제어(보조기술이 미구현 되어서 추가해 줌) aria-hidden="true" inert(비활성, 불활성)
  _mdCnt.siblings().attr({'aria-hidden': true, inert: true});

  //modal3) 모달 컨텐츠를 보여지게 처리, 첫번째 링크에 포커스 강제 이동
  _mdCnt.css('visibility', 'visible').stop().animate({opacity: 1}, function () {
    _closeBtn.focus();
  });

  //modal4) 접근성을 위해 추가 : 닫기 버튼을 누르기 전까지 포커스는 모달 내부에 존재해야 함
  //닫기버튼에서 shift+tab / shift(X)+tab을 누르면 포커스는 자신에게만 강제이동
  _closeBtn.on('keydown', function (e) {
    e.preventDefault();   //기본 기능 차단

    console.log(e.keyCode); //tab 9
    if (e.shiftKey && e.keyCode === 9 || !e.shiftKey && e.keyCode === 9)  _closeBtn.focus();
    if (e.keyCode === 13) _closeBtn.click();
  });

  //modal닫기 버튼 클릭 이벤트
  _closeBtn.on('click', function () {
    //1) 모달컨텐츠 숨기기(visibility) => 모달상세컨텐츠의 나머지 형제들을 스크린리더에서 접근할수 있도록 되돌리기(속성제거 - aria-hidden, inert)
    _mdCnt.stop().animate({opacity: 0}, function () {
      $(this).css('visibility', 'hidden').siblings().removeAttr('aria-hidden inert');
    });

    //2) 열기 버튼으로 포커스 강제 이동
    _openBtn.focus();
  });

  //#dim을 클릭하는 경우도 닫겨진다
  _dim.on('click', function () {
    _closeBtn.trigger('click');
  });
  //esc 키보드를 누른 경우도 닫겨진다
  $(window).on('keydown', function (e) {
    //console.log(e.keyCode); //esc 27
    if (e.keyCode === 27) _closeBtn.click();
  });
});

// modal window2
  //modal1) 열기 버튼 클릭 이벤트
  $('#portfolio .vansRenewal').on('click', function (e) {
    //1) 필요한 변수 선언
    var _openBtn2 = $(this); //모달 닫기 버튼 클릭시 포커스 강제 이동을 위해
    var _mdCnt2 = $( $(this).data('target') );
    //console.log(_mdCnt2, typeof _mdCnt2); //string타입을 $()로 감싸서 선택자로 변경함 
    var _closeBtn2 = _mdCnt2.find('.last');
    var _first = _mdCnt2.find('.first');
    var _last = _mdCnt2.find('.last');
  
    //modal2) 스크린리더에서는 열려진 모달 말고는 접근하지 못하도록 제어(보조기술이 미구현 되어서 추가해 줌) aria-hidden="true" inert(비활성, 불활성)
    _mdCnt2.siblings().attr({'aria-hidden': true, inert: true});
  
    //modal3) 모달 컨텐츠를 보여지게 처리, 첫번째 링크에 포커스 강제 이동
    _mdCnt2.css('visibility', 'visible').stop().animate({opacity: 1}, function () {
      _closeBtn2.focus();
    });
  
    //modal4) 접근성을 위해 추가 : 닫기 버튼을 누르기 전까지 포커스는 모달 내부에 존재해야 함
    //닫기버튼에서 shift+tab / shift(X)+tab을 누르면 포커스는 자신에게만 강제이동
    _first.on('keydown', function (e) {
      //console.log(e.keyCode); //tab 9
      if (e.shiftKey && e.keyCode === 9) {
        e.preventDefault();   //이전으로 되돌아가는 기본 기능 차단
        console.log(e.keyCode); //tab 9
        if (e.shiftKey && e.keyCode === 9 || !e.shiftKey && e.keyCode === 9)  _last.focus();
        if (e.keyCode === 13) _last.click();
      }
    });

    //마지막 링크에서 shift(X)+tab을 누르면 가장 처음으로 포커스 강제이동
    _last.on('keydown', function (e) {
      if (!e.shiftKey && e.keyCode === 9) {
          e.preventDefault(); //기본 기능차단
          _first.focus();     //포커스 처음으로
      }
    });
  
    //modal닫기 버튼 클릭 이벤트
    _closeBtn2.on('click', function () {
      //1) 모달컨텐츠 숨기기(visibility) => 모달상세컨텐츠의 나머지 형제들을 스크린리더에서 접근할수 있도록 되돌리기(속성제거 - aria-hidden, inert)
      _mdCnt2.stop().animate({opacity: 0}, function () {
        $(this).css('visibility', 'hidden').siblings().removeAttr('aria-hidden inert');
      });
  
      //2) 열기 버튼으로 포커스 강제 이동
      _openBtn2.focus();
    });
  
    //esc 키보드를 누른 경우도 닫겨진다
    $(window).on('keydown', function (e) {
      //console.log(e.keyCode); //esc 27
      if (e.keyCode === 27) _closeBtn2.click();
    });
  });

  //vans 가로 스크롤
  //1) 초기 설정 : 인디케이터 첫번째 li.on  클래스 추가하여 활성화
  $menu.eq(0).addClass('on');

  //2) resize 이벤트 : 없어도 된다 모달창의 크기가 100%여서 위치는 항상 top0, left0이다
  winWidth = $win.width();
  $cntWrap.css('width', winWidth * total).children().css('width', winWidth);

 //3) 인디케이터 클릭 이벤트
 $menu.children().on('click', function (e) {
     e.preventDefault();

     //3-1) 현재 애니메이트(.cnt_wrap) 중이면 함수 강제 종료
     if ( $cntWrap.is(':animated') ) return false;
     tgIdx = $(this).parent().index(); //인디케이터 li의 인덱스번호
     //console.log(tgIdx);
     //3-2) 클릭한 인디케이터가 활성화
     $(this).parent().addClass('on').siblings().removeClass('on');
     //3-3) 애니메이트(.cnt_wrap)
     $cntWrap.stop().animate({marginLeft: tgIdx * winWidth * -1}, 700);
 });

 //4) 마우스휠 이벤트
 /*  mousewheel, DOMMouseScroll(파이어폭스)
     delta(값) : 음수(-) -  마우스 휠을 아래로 내리는 경우 => 오른쪽
     delta(값) : 양수(+) -  마우스 휠을 위로 올리는 경우 => 왼쪽  
     파이어폭스 delta => e.originalEvent.detail => 다른 브라우저와 부호 반대 */
 $cntWrap.on('mousewheel DOMMouseScroll', function (e) {
     clearTimeout(timerWheel);

     timerWheel = setTimeout(function () {
         //4-1) 현재 애니메이트(.cnt_wrap) 중이면 함수 강제 종료
         if ( $cntWrap.is(':animated') ) return false;

         //4-2) delta값 구하기
         //e.originalEvent.wheelDelta 파이어폭스를 제외한 나머지 브라우저
         //e.originalEvent.detail*-1 파이어폭스 only
         var delta = e.originalEvent.wheelDelta || e.originalEvent.detail * -1;
         //console.log(delta);

         //4-3) if : 휠내리기-음수-오른쪽,  else if : 휠올리기-양수-왼쪽 => tgIdx
         if (delta < 0  && tgIdx < total - 1) {
             tgIdx++;
             //console.log(delta, tgIdx, '휠내리기');
         } else if (delta > 0 && tgIdx > 0) {
             tgIdx--;
             //console.log(delta, tgIdx, '휠올리기');
         }

         //4-4) 인디케이터 활성 , .cnt_wrap 애니메이션
         $menu.eq(tgIdx).addClass('on').siblings().removeClass('on');
         $cntWrap.stop().animate({marginLeft: tgIdx * winWidth * -1}, 700);
     }, 200);
 });

 //5) 키보드 이벤트 :if : 오른쪽(39)과 하단(40), else if : 왼쪽(37)과 상단(38)
 $(document).on('keydown', function (e) {
     var key = e.keyCode;
     var tg = e.target;
     //console.log(key, tg);

     //5-1) 현재 애니메이트(.cnt_wrap) 중이면 함수 강제 종료
     if ( $cntWrap.is(':animated') ) return false;

     //5-2) if : 오른쪽(39)과 하단(40), else if : 왼쪽(37)과 상단(38) => tgIdx제어
     if ( (key === 39 || key === 40) && tgIdx < total - 1 ) tgIdx++;
     else if ( (key === 37 || key === 38) && tgIdx > 0 ) tgIdx--;
     else if ( (key === 13 || key === 32) && $(tg).is('[data-href]') ) {
         tgIdx = $(tg).parent().index();
     }

     //5-3) 인디케이터 활성 , .cnt_wrap 애니메이션
     $menu.eq(tgIdx).addClass('on').siblings().removeClass('on');
     $cntWrap.stop().animate({marginLeft: tgIdx * winWidth * -1}, 700);
 });

 //6) 이전과 다음 버튼 클릭 이벤트 :if : 다음, else if : 이전
  $('.pjModal .controler button').on('click', function (e) {
    //5-1) 현재 애니메이트(.cnt_wrap) 중이면 함수 강제 종료
    if ( $cntWrap.is(':animated') ) return false;

    //5-2) if : 다음, else if : 이전 => tgIdx제어
    var btnNum=$(this).parent().index();
    if (btnNum === 1 && tgIdx < total - 1) tgIdx++;
    else if (btnNum === 0 && tgIdx > 0) tgIdx--;

    //5-3) 인디케이터 활성 , .cnt_wrap 애니메이션
    $menu.eq(tgIdx).addClass('on').siblings().removeClass('on');
    $cntWrap.stop().animate({marginLeft: tgIdx * winWidth * -1}, 700);
  });
 
});