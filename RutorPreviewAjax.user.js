// ==UserScript==
// @name         RutorPreviewAjax
// @namespace    https://github.com/AlekPet/
// @version      1.0
// @description  Предпросмотр раздач на сайте
// @author       AlekPet
// @license     MIT;
// @match        http://tor-ru.net/*
// @match        http://zerkalo-rutor.org/*
// @match        http://rutor.info/*
// @match        http://rutor.is/*
// @updateURL    https://github.com/AlekPet/RutorPreviewAjax/raw/master/RutorPreviewAjax.user.js  
// @downloadURL  https://github.com/AlekPet/RutorPreviewAjax/raw/master/RutorPreviewAjax.user.js
// @icon         https://raw.githubusercontent.com/AlekPet/RutorPreviewAjax/master/assets/images/icon.png
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @require https://code.jquery.com/jquery-3.1.0.min.js

// ==/UserScript==
GM_addStyle("\
.mDiv{width: 250px;border: 3px double #FFA302;position: fixed;right: 9px;top: 316px;text-align: center;color:white;}\
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
div.seeEl {width: 80%;margin: 3px auto;background: linear-gradient(#e412ea,#127080);    padding: 10px 5px;cursor: pointer;overflow: hidden;height: 25px;line-height: 1;font-size: 0.8em;    box-sizing: content-box;}\
div.seeEl:hover{background: linear-gradient(#2c26a9,#b400ff);}\
\
");

(function() {
    'use strict';

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

                let cloneButton = (button.clone(true)).attr("title","Скрыть раздачу");

                let spoiler = $("<div class='footSpoiler'></div>").html(cloneButton);
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
                        elSee = $('<div class="seeEl"></div>').attr('title',textPop).text(textPop);

                    $(elSee).click(function(){
                        let offset = $(elem).offset().top;
                        $('html, body').animate({scrollTop:offset}, 500, 'swing');
                    });

                    $(elem).data(elSee);
                    $(".mDiv_inner").append(elSee);

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
                                        elSee = $('<div class="seeEl"></div>').attr('title',textPop).text(textPop);
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
