// ==UserScript==
// @name         RutorPreviewAjax
// @namespace    https://github.com/AlekPet/
// @version      1.2.2
// @description  Предпросмотр раздач на сайте
// @author       AlekPet
// @license      MIT; https://opensource.org/licenses/MIT
// @match        http://tor-ru.net/*
// @match        http://zerkalo-rutor.org/*
// @match        http://rutor.info/*
// @match        http://rutor.is/*
// @updateURL    https://github.com/AlekPet/RutorPreviewAjax/raw/master/RutorPreviewAjax.user.js  
// @downloadURL  https://github.com/AlekPet/RutorPreviewAjax/raw/master/RutorPreviewAjax.user.js
// @icon         https://raw.githubusercontent.com/AlekPet/RutorPreviewAjax/master/assets/images/icon.png
// @run-at document-end
// @noframes
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @require https://code.jquery.com/jquery-3.1.0.min.js

// ==/UserScript==
GM_addStyle("\
.mDiv{width: 250px;border: 3px double #FFA302;right: 9px;text-align: center;color:white;}\
.mDiv_title{background-image: url(/s/i/poisk_bg.gif);background-size: 40% 100%;padding: 5px;border-bottom: 2px solid #ffea00;}\
.mDiv_inner{overflow-y: scroll;max-height: 400px;}\
\
.mDiv_title.opens{display:none;filter: hue-rotate(-40deg);}\
\
.com_Style{background: linear-gradient(#b7b7b7,#545454);color: white;text-align: center;padding: 4px;cursor: pointer;user-select: none; width: 300px;margin: 0 auto;border-radius: 8px;transition: all 0.5s ease;margin-bottom: 10px;}\
.com_Style:hover {background: linear-gradient(#676666,#9e9e9e);width: 350px;transition: all 0.5s ease-out;font-size: 1.2em;}\
\
#my_content{border: 1px solid silver;}\
.my_tr{display:none;}\
\
.footSpoiler{text-align: center; padding: 10px;}\
\
.box_comments{background: #d0caca;width: 90%;margin: 0 auto;padding: 10px;border-radius:8px;}\
\
div#index tr.my_tr:hover { background-color: white;}\
div#my_content tr:hover { background-color: white;}\
\
div#hideAll {border: 1px solid;width: 80%;margin: 3px auto;background: linear-gradient(#72ff72,#1d8e08);padding: 5px;cursor: pointer;}\
div#hideAll:hover{background: linear-gradient(#2fc12f,#246318);}\
\
div.seeEl {width: 80%;margin: 5px auto;background: linear-gradient(#e2a9d1,#ffc200);cursor: pointer;overflow: hidden;line-height: 1;font-size: 0.8em;    box-sizing: content-box;color: black; font-weight: bold;}\
div.seeEl:hover{background: linear-gradient(#ff9b58,#f5ff0082); color:blue; color: #8e0000;}\
div.seeEl div img {box-shadow: 2px 2px 5px black;}\
\
");

(function() {
    'use strict';
    const no_image = "data:image/png;base64,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";

        function ajaxJQ(param){
        console.log("Ajax proceed...");

        var button = param.button,
            link = param.t_link,
            elem = param.tr_el;

        $.ajax({
            url: link,
            success: function(data){

                var content = $(data).find("#content")[0];

                content.removeChild(content.children[0]);
                content.removeChild(content.children[0]);
                content.removeChild(content.lastElementChild);
                content.removeChild(content.lastElementChild);

                $(content).find("tr").not(".c_h").hover(function(){$(this).css("background-color","transparent");},function(){$(this).css("background-color","transparent");});

                let tableCount = $(content).find("table tr[class=c_h]").length;

                // Список файлов измененная загрузка
                let descrN = $(content).find(".header span").attr("onclick").toString().match(/descriptions\/(\d+)\.files/i)[1];
                $(content).find(".header span").removeAttr("onclick");
                $(content).find(".header span").attr("filelist_already_loaded", 0);

                $(content).find(".header span").click(function(){
                if($(this).attr("filelist_already_loaded") == 0){
                    $(this).attr("filelist_already_loaded",1);
                    $(content).find('#filelist').load('/descriptions/'+descrN+'.files');
                }
                    $(content).find('#displayfiles').fadeToggle('slow', 'linear');
                });
                //

                $(content).find("#cem").before('<div class="box_comments"><div  title="Показать комментарии" class="com_Style">Комментарии'+(tableCount>0?' ('+tableCount+')':'')+'</div><div style="display:none;" id="hiden_cc"></div></div>');

                $(content).find(".com_Style").click(function(){$(this).next().fadeToggle( 'slow', 'linear');});

                $(content).find("#hiden_cc").append($(content).find("#cem"));

                let tableCom = $(content).find("table tr[class=c_h]").parent().parent();

                $(content).find("#hiden_cc").append(tableCom.prev(),tableCom.prev().prev(),tableCom);

                let cloneButton = (button.clone(true)).attr("title","Скрыть раздачу"),

                    spoiler = $("<div class='footSpoiler'></div>").html(cloneButton);

                $(content).append(spoiler);

                content.id = "my_content";

                let nextEl = $(elem).next().children(0);
                $(nextEl).html(content);

                $(elem).next().animate({
                    width: [ "toggle", "swing" ],
                    height: [ "toggle", "swing" ],
                    opacity: "toggle"
                }, 1500, "linear", function(){
                    if($(this).css("display") === "none"){
                        button.css("transform", "scaleY(1)").attr("title","Показать раздачу");
                    } else {
                        button.css("transform", "scaleY(-1)").attr("title","Скрыть раздачу");
                    }

                    cloneButton.css("transform", "scaleY(1)");

                    // Add see
                    $(".mDiv_title.opens").show();
                    let textPop = $(elem).children(1).children()[3].innerText,

                        imgSmall =  $(elem).next().find("img").filter(function(i,val){
                            if(val.width > 200 && !/banner/i.test(this.src)){
                                return this;
                            }
                    });

                    if(imgSmall.length>1){
                        let elOut = imgSmall[0];
                        for(let i of imgSmall){
                            if(i.height > elOut.height) {
                                elOut = i;
                            }
                        }
                        imgSmall = elOut.src;
                    } else {
                    imgSmall = imgSmall.length === 0 ? no_image : imgSmall[0].src;
                    }

                        //elSee = $('<div class="seeEl"></div>').attr('title',textPop).text(textPop);
                    let imgihtml = $('<div style="display: table-cell;vertical-align: middle;padding:5px;border-right: 1px dotted white;"><img src="'+imgSmall+'" width="50px"></div>'+
                                  '<div style="display: table-cell;vertical-align: middle;font-size: unset;padding:2px;">'+textPop+'</div>'),
                        elSee = $('<div class="seeEl"></div>').attr('title',textPop).html(imgihtml);


                    $(elSee).click(function(){
                        let offset = $(elem).offset().top;
                        $('html, body').animate({scrollTop:offset}, 500, 'swing');
                    });

                    $(elem).data(elSee);
                    $(".mDiv_inner").append(elSee).animate({scrollTop:$("div.mDiv_inner").offset().top}, 500, 'swing');

                });
            }
        });
        }

    function makePanel(){
        var div = $('<div class="mDiv">'+
                    '<div class="mDiv_title">Настройки</div>'+
                    '<div id="hideAll">Свернуть все</div>'+
                    '<div class="mDiv_title opens">Открытые</div>'+
                    '<div class="mDiv_inner"></div>'+
                    '</div>');

        $("#sidebar").append(div);
        
        let maxTop = $(".sideblock:nth-child(2)").offset().top+parseFloat($(".sideblock:nth-child(2)").css("height"));
        $(window).scroll(function() {
            if($(window).scrollTop() >= maxTop) $( ".mDiv" ).css({"position":"fixed", "top":"0px"}); else $( ".mDiv" ).css( "position",""); 
        }); 

        $("#hideAll").click(function(){
            if($(".my_tr:visible").length){
                $(".my_tr").fadeOut("slow");
                $("img[id^='butSpoiler_'").css("transform", "scaleY(1)").attr("title","Показать раздачу");

                // Remove see
                $(".mDiv_title.opens").hide();
                $(".mDiv_inner").empty();

            }
        });
    }

    function addPoleInfo(){
        // Ищим классы для получения данных
        $(".backgr, .gai, .tum").each(function(i, val){

        // Если класс заголовка добавляем свой заголовок для кнопки
            if(this.className == "backgr") {
                $('<td width="1px">Спойлер</td>').prependTo(this);
            } else {
                // Если нет получаем информацию
                let m_elem = this,
                    elem = this.children[1],

                    down = elem.children[0].href,
                    magn = elem.children[1].href,
                    link = elem.children[2].href,
                    linkText = elem.children[2].innerText,

                    img = $('<img style="cursor:pointer;" title="Показать раздачу" id="butSpoiler_'+i+'" src="/s/t/top.gif" width="16px"></img>'),

                    newI = $('<td style="text-align:center;"></td>').html(img);

                // Image event
                $(img).click(function() {
                    if(!$(m_elem).next().is(".my_tr")){
                        $(m_elem).after('<tr class="my_tr"><td colspan="6"></td></tr>');

                        ajaxJQ({button : img , t_link: link, tr_el : m_elem});
                    } else {
                        $(m_elem).next().animate(
                            {
                                width: [ "toggle", "swing" ],
                                height: [ "toggle", "swing" ],
                                opacity: "toggle"
                            }, 1500, "linear", function(){
                                if($(this).css("display") === "none"){
                                    img.css("transform", "scaleY(1)").attr("title","Показать раздачу");

                                    // Remove see
                                    $(".mDiv_inner")[0].removeChild($(m_elem).data()[0]);
                                    if($(".my_tr:visible").length<1){
                                     $(".mDiv_title.opens").hide();
                                    }

                                }else{
                                    img.css("transform", "scaleY(-1)").attr("title","Скрыть раздачу");

                                    // Add see
                                    $(".mDiv_title.opens").show();
                                    let textPop = $(m_elem).children(1).children()[3].innerText,

                                        imgSmall =  $(m_elem).next().find("img").filter(function(i,val){
                                            if(val.width > 200 && !/banner/i.test(this.src)){
                                                return this;
                                            }
                                        });

                                    if(imgSmall.length>1){
                                        let elOut = imgSmall[0];
                                        for(let i of imgSmall){
                                            if(i.height > elOut.height) {
                                                elOut = i;
                                            }
                                        }
                                        imgSmall = elOut.src;
                                    } else {
                                        imgSmall = imgSmall.length === 0 ? no_image : imgSmall[0].src;
                                    }

                                    //elSee = $('<div class="seeEl"></div>').attr('title',textPop).text(textPop);
                                    let imgihtml = $('<div style="display: table-cell;vertical-align: middle;padding:5px;border-right: 1px dotted white;"><img src="'+imgSmall+'" width="50px"></div>'+
                                                      '<div style="display: table-cell;vertical-align: middle;font-size: unset;padding:2px;">'+textPop+'</div>'),
                                        elSee = $('<div class="seeEl"></div>').attr('title',textPop).html(imgihtml);

                                    $(m_elem).data(elSee);
                                    $(".mDiv_inner").append(elSee);

                                }

                                // Back offset on page
                                $('html, body').animate({scrollTop:$(m_elem).offset().top}, 500, 'swing');
                            });
                    }
                });

                $(newI).prependTo(this);
            }
        });
    }

    function init(){
        makePanel();
        addPoleInfo();
    }

    init();
})();
