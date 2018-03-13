$(function(){

  function write_text(){
    var title = $(".text_title").val();
    var tag = $(".text_tag").val();
    var classify = $(".text_classify").val();
    var md = $(".text_content").val();
    var html = md_html(md)[0];
    var date = get_time();
    $(".blog_text_head h1").html(title);
    $(".blog_text_classify>span").html(classify);
    $(".blog_text_tag>span").html(tag);
    $(".blog_text_date>div").html(date);
    $(".blog_text_content").html(html);
    $(".text_content").height($(".blog_text").height()-114);
  }

  $(".text_title,.text_tag,.text_classify,.text_content").keyup(function(){
    write_text();
  });

  //get_time():得到当前时间的字符串.
  function get_time(){
    function translate_time(time){
      if(time < 10){
        time = "0" + time;
      }
      return time;
    }
    var date = new Date();
    var year = translate_time(date.getFullYear());
    var month = translate_time(date.getMonth()+1);
    var day = translate_time(date.getDate());
    var hour = translate_time(date.getHours());
    var minute = translate_time(date.getMinutes());
    var second = translate_time(date.getSeconds());
    var time = year + "/" + month + "/" + day + "/" + hour + ":" + minute + ":" + second;

    return time;
  }
});
