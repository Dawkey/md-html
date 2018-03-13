function md_html(md){

  var value = md;
  var md_array = value.split("\n");
  var html_array = md_array.slice(0);
  var h1_6 = /^#.*/;
  var code_block = /(?<=^\s{4}).*/;
  var blockquote = /(?<=^>\s).*/;
  var ul = /(?<=^\*\s).*/;
  var o_p = /^(#|\s{4}|>|\*\s).*/;//非<p></p>元素
  var f_p = /<p>.*?<\/p>/;//截取最终得到的HTML字符串的第一段<p></p>元素作为describe的值.


  var strong = /(?<=\*\*)[^\*]+(?=\*\*)/;
  var strong_replace = /\*\*[^\*]+\*\*/;
  var em = /(?<=\*)[^\*]+(?=\*)/;
  var em_replace = /\*[^\*]+\*/;
  var code = /(?<=`)[^`]+(?=`)/;
  var code_replace = /`[^`]+`/;
  var a_replace = /\[[^\[\]]+\]\([^\(\)]+\)/;
  var a_word = /(?<=\[).+(?=\])/;
  var a_href = /(?<=\().+(?=\))/;

  var meaning_1 = /</g;
  var meaning_2 = />/g;


  function meaning_change(str){
    var meaning_str = str;
    meaning_str = meaning_str.replace(meaning_1,"&#60");
    meanig_str = meaning_str.replace(meaning_2,"&#62");

    return meaning_str;
  }

  function a_change(){
    if(a_replace.test(html_array[i])){
      var a_match = html_array[i].match(a_replace)[0];
      var a_word_str = a_match.match(a_word)[0];
      a_match = a_match.replace(a_word,"");
      var a_href_str = a_match.match(a_href)[0];
      var a_html = "<a href = '"+ a_href_str +"' target='view_window'>"+ a_word_str +"</a>";
      html_array[i] = html_array[i].replace(a_replace,a_html);
      a_change();
    }
    else{
      return;
    }
  }


  //strong_em_change():查找特定的字符串,并把他们转换为<strong></strong>和<em></em>格式
  function strong_em_change(){
    if(strong.test(html_array[i])){
      var strong_str = html_array[i].match(strong)[0];
      strong_html = "<strong>" + strong_str + "</strong>";
      html_array[i] = html_array[i].replace(strong_replace,strong_html);
      strong_em_change();
    }
    else if(em.test(html_array[i])){
      var em_str = html_array[i].match(em)[0];
      em_html = "<em>" + em_str + "</em>";
      html_array[i] = html_array[i].replace(em_replace,em_html);
      strong_em_change();
    }
    else{
      return;
    }
  }

  //code_change():转换为<code></code>格式
  function code_change(){
    if(code.test(html_array[i])){
      var code_str = html_array[i].match(code)[0];
      code_str = meaning_change(code_str);
      code_html = "<code>" + code_str + "</code>";
      html_array[i] = html_array[i].replace(code_replace,code_html);
      code_change();
    }
    else{
      return;
    }
  }


  function change(){
    code_change();
    strong_em_change();
    a_change();
  }


  for(var i=0;i<md_array.length;i++){

    if(h1_6.test(md_array[i])){
      change();
      var h_n;
      var h_n_str;
      var h_re = "";
      for(var j=1;j<=6;j++){
        h_re = "#" + h_re;
        h_n = RegExp("(?<=^" + h_re + ")[^#].*");
        if(h_n.test(md_array[i])){
          h_n_str = html_array[i].match(h_n)[0];
          h_n_html = "<h" + j + ">" + h_n_str + "</h" + j + ">";
          html_array[i] = h_n_html;
          break;
        }
      }
    }

    else if(code_block.test(md_array[i])){//code比较特殊,em和strong需要对code不会产生影响
      html_array[i] = meaning_change(html_array[i]);
      var code_block_str = html_array[i].match(code_block)[0];
      code_block_html = code_block_str + "\n";
      if(!code_block.test(md_array[i-1])){
        code_block_html = "<pre><code>" + code_block_html;
      }
      if(!code_block.test(md_array[i+1])){
        code_block_html = code_block_html + "</code></pre>";
      }
      html_array[i] = code_block_html;
    }

    else if(blockquote.test(md_array[i])){//这里,不知道为什么">"被转义依然能被正则表达式识别.
      change();
      var blockquote_str = html_array[i].match(blockquote)[0];
      blockquote_html = blockquote_str + "<br>";
      if(!blockquote.test(md_array[i-1])){
        blockquote_html = "<blockquote><p>" + blockquote_html;
      }
      if(!blockquote.test(md_array[i+1])){
        blockquote_html = blockquote_html + "</p></blockquote>";
      }
      html_array[i] = blockquote_html;
    }

    else if(ul.test(md_array[i])){
    //ul用*+空格表示,和strong_em_change有冲突,需要先变形再调用strong_em_change
      if(ul.test(md_array[i])){
        var ul_str = md_array[i].match(ul)[0];
        html_array[i] = ul_str;
        change();
        ul_str = html_array[i];
      }
      ul_html = "<li>" + ul_str + "</li>";
      if(!ul.test(md_array[i-1])){
        ul_html = "<ul>" + ul_html;
      }
      if(!ul.test(md_array[i+1])){
        ul_html = ul_html + "</ul>";
      }
      html_array[i] = ul_html;
    }

    else{
      console.log(html_array[i]);
      change();

      var p_str = html_array[i];
      if(p_str != ""){
        if(md_array[i-1] == ""||md_array[i-1] == undefined||o_p.test(md_array[i-1])){
          p_html = "<p>" + p_str;
        }
        else{
          p_html = "<br>" + p_str;
        }

        if(md_array[i+1] == ""||md_array[i+1] == undefined||o_p.test(md_array[i+1])){
          p_html = p_html + "</p>";
        }
        html_array[i] = p_html;
      }
      else{
        if(md_array[i-1] == ""){
          p_html = "<br>";
          html_array[i] = p_html;
        }
      }
    }
  }
  var final_html = html_array.join("");//final_html最终得到的经过转码的字符串.
  if(f_p.test(final_html)){
    var describe = final_html.match(f_p)[0];//describe用来表示没篇博文的描述性文字.
  }
  return [final_html,describe];//返回一个数组,前一个表示html的字符串,后一个表示describe的字符串.
}
