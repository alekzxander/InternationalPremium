$(document).ready(function(){
  $(window).scroll(function(){
  if ( $(this).scrollTop() >= 200 ) {
      $(".Top").fadeIn();
  }
  else {
    $(".Top").fadeOut();
  }
  });
  $(".Top").click(function(){
    $("html,body").stop().animate({scrollTop : 0});
  });

});
