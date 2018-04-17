// ==UserScript==
// @name         Rutor Preview Ajax
// @namespace    https://github.com/AlekPet/
// @version      1.3.1
// @description  Предпросмотр раздач на сайте
// @author       AlekPet
// @license      MIT; https://opensource.org/licenses/MIT
// @match        http://tor-ru.net/*
// @match        http://zerkalo-rutor.org/*
// @match        http://rutor.info/*
// @match        http://rutor.is/*
// @exclude     http://tor-ru.net/torrent/*
// @exclude     http://rutor.info/torrent/*
// @exclude     http://zerkalo-rutor.org/torrent/*
// @exclude    http://rutor.is/torrent/*
// @updateURL    https://github.com/AlekPet/Rutor-Preview-Ajax/blob/master/RutorPreviewAjax.user.js
// @downloadURL  https://github.com/AlekPet/Rutor-Preview-Ajax/blob/master/RutorPreviewAjax.user.js
// @icon         https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/icon.png
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
.mDiv_inner{overflow-y: auto;max-height: 300px;}\
.mDiv_FavInner{overflow-y: auto;max-height: 300px; color: silver; width: 80%;margin: 0 auto;padding: 10px;}\
\
.mDiv_title.opens{display:none;filter: hue-rotate(-40deg);}\
.mDiv_title.fav{filter:  hue-rotate(200deg);}\
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
div.seeEl {width: 80%;margin: 5px auto;background: linear-gradient(#e2a9d1,#ffc200);cursor: pointer;overflow: hidden;line-height: 1;font-size: 0.8em;    box-sizing: content-box;color: black; font-weight: bold;font-family: monospace;}\
div.seeEl:hover{background: linear-gradient(#ff9b58,#f5ff0082); color: #8e0000;}\
div.seeEl div img:not([id*='butSpoiler']) {box-shadow: 2px 2px 5px black;}\
.minipanel{display: table-cell;vertical-align: middle;padding: 5px;border-left: 1px dotted white;background: linear-gradient(#df99e8,#ff6400);}\
.minipanel:hover {background: linear-gradient(#d377de,#ff7000);}\
.minipanel:hover img{transition:1s all;transform: rotateX(360deg) !important;}\
.minipanel img{transition:1s all;}\
\
.loading_tor_box{padding: 5px;}\
.loading_tor {width: 100%;background: #e0dcdc;border-radius: 8px;}\
.loading_tor_text{height: inherit;width: 0%;background: linear-gradient(#1dff60, #00b327);border-radius: 8px;color: #676767;font-size: 1em;padding: 2px;}\
\
.checkbox_Load:not(checked) {opacity: 0;}\
.checkbox_Load + label {cursor: pointer;position: absolute;left: 70%;}\
.checkbox_Load:checked + label:before {background: #53d64c;}\
.checkbox_Load:checked + label:after {left: 5px;content: 'ON';color: green;}\
.checkbox_Load:not(checked) + label:before {content: '';position: absolute;top: 2px;left: -28px;width: 60px;height: 20px;background: #ff6060;box-shadow: inset 0 2px 3px rgba(0,0,0,.2);}\
.checkbox_Load:not(checked) + label:after {content: 'OFF';position: absolute;top: 4px;left: -25px;width: 25px;height: 15px;background: #FFF;box-shadow: 0 2px 5px rgba(0,0,0,.3);transition: all .2s;}\
div.imgages_Load {display: table;color: #b40000;width: 85%;font-family: monospace;font-weight: bold;margin: 5px auto;}\
.preLoadImagesCell{display: table-cell;height: 40px;vertical-align: middle;background: #fbf7f7;text-align: center;width: 40%;}\
.preLoadImagesRow{display:table-row;}\
.preLoadImagesRow #timoutTimeImages {width:50%;text-align: right;color: #00447f;font-family: monospace;font-weight: bold;}\
\
tr.gai td a[href='javascript:void(0);'], tr.tum td a[href='javascript:void(0);']{margin-right: 5px;}\
tr.gai td a[href='javascript:void(0);'] img, tr.tum td a[href='javascript:void(0);'] img{transition:1s transform;}\
tr.gai td a[href='javascript:void(0);'] img:hover, tr.tum td a[href='javascript:void(0);'] img:hover{transform: scale(1.3);transition:1s transform;filter: hue-rotate(270deg);}\
.FavBlockEl{margin: 0 5px 10px 0;background: #fbf7f7;box-shadow: 2px 2px 5px silver;}\
.FavBlockEl a {text-decoration: none;font-size: 0.8em;font-weight: bold;}\
.FavBlockEl a:hover {color: #73046a !important;}\
.FavBlockEl > div:nth-child(2) div {margin: 5px 0 5px 0;}\
.FavBlockEl > div:nth-child(3) {display: table-cell;vertical-align: middle;padding: 5px;border-left: 1px dotted;background: linear-gradient(to bottom, #fbf7f7, #ffc7c7);font-weight: bold;color: orange;user-select: none;cursor: pointer;}\
.FavBlockEl > div:nth-child(3):hover{background: linear-gradient(#ffd4d4 50%, #f59999);}\
.poleLinks{display:block;transition: 1s transform;}\
.poleLinks:hover{transform: scale(1.4);}\
");

(function() {
    'use strict';
    const image_arrow = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/arrow_icon.gif",
          no_image = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/no_image.png",
          favIcon = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/yellow_heart.png",//"https://aminoapps.com/static/bower/emojify.js/images/emoji/yellow_heart.png",
          searchIcon = "https://raw.githubusercontent.com/AlekPet/Rutor-Preview-Ajax/master/assets/images/search_icon.png",

          debug = 0;

    var ObjSave = null,
        TimeOutImages = 5;

function checkLocaltorage(){
    if(ObjSave){
        if (!ObjSave.hasOwnProperty('favorites')){
            ObjSave.favorites = {};
        }

        if (!ObjSave.hasOwnProperty('options')){
            ObjSave.options = {};
        }

        if(debug) console.log("Объект: ",ObjSave);
    }
}

function loadStorage(){
    let ObjSave_tmp = GM_getValue('ObjSave');

    ObjSave = (ObjSave_tmp) ? JSON.parse(GM_getValue('ObjSave')) : {
        options: {}
    };

    checkLocaltorage();
}

function saveToStorage(){
    try{
        var save_data = JSON.stringify(ObjSave);

        if(save_data.length>0 && save_data !== null && save_data !=="" && save_data !== undefined){
            GM_setValue('ObjSave', save_data);
            if(debug) console.log("Сохраненно: ",ObjSave);
        }
    }catch(e){
        console.log(e);
    }
}

function LoadingImages(param){
        try{
    //Images
    let callback = param.func,
        content = param.content,
        button = param.button,
        elem = param.elem,
        IMGElements = $(content).find('#details tr:eq(0) img:not([src^="http://rublacklist.net"])'),
        lenIMG = IMGElements.length,


        progressBar = $(elem).nextAll(":eq(0)"),
        progressBarText = progressBar.find(".loading_tor_text"),
        procentuno = 100/lenIMG;

        if(lenIMG > 0){
            if(debug){
                console.log(`Изображений найдено: ${lenIMG}\n------------------------------`);
                console.log("Тайм-аут равен: ", TimeOutImages, "Если 0 тайм-аут выкл.");
            }

        let imgLoaded = 0,
            procentLoaded = 0;

            progressBar.show();

            $(IMGElements).each(function(){
                let image = this,
                    timer = null;

                $(image).one("load", function(){
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }

                    imgLoaded++;

                    if(debug) console.log("Изображений загруженно: ",imgLoaded);

                    procentLoaded += procentuno;
                    progressBarText.css("width", procentLoaded+"%");
                    progressBarText.text("Загружено "+procentLoaded.toFixed(1)+"%");

                    if(imgLoaded === lenIMG){
                        progressBarText.text("100.0%");
                        progressBarText.css("width", "100%");
                        callback(param);
                        progressBar.fadeOut('slow');
                    }
                })
                    .one('error', function() {
                    let src = $(this).attr("src");

                    $(this).attr({
                        "title": "Изображение не найдено:\n"+src,
                        "src": no_image,
                        "error_image": 1
                    }).css({"cursor":"pointer"});
                    $(this).click(function(){window.open(src);});
                })
                    .attr("src",image.src);

                if(TimeOutImages !== 0){
                    timer = setTimeout(function(theImg) {
                        return function() {
                            if(debug) console.log(`Таймер истек: ${theImg.src}\n------------------------------`);

                            theImg.onload = theImg.onabort = theImg.onerror = function() {};

                            if (timer) {
                                clearTimeout(timer);
                                timer = null;
                            }

                            let src = $(theImg).attr("src");

                            $(theImg).attr({
                                "title": "Изображение не найдено:\n"+src,
                                "src": no_image,
                                "error_image": 1
                            }).css({"cursor":"pointer"}).click(function(){window.open(src);});

                            if(imgLoaded === lenIMG){
                                progressBarText.text("100.0%");
                                progressBarText.css("width", "100%");
                                callback(param);
                                progressBar.fadeOut('slow');
                            }
                        };
                    }(image), TimeOutImages*1000);
                }
            });
        }
        } catch(e){
            console.log(e);
        }
}

// Правим полученный контент
function modifyData(param){
    var data = param.data,
        button = param.button,
        elem = param.elem,

        content = $(data).find("#content")[0];

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


    let nextEl = $(elem).next().next().children(0);

    $(nextEl).html(content);

    if(debug) console.log("Предзагрузка включена...",$(".checkbox_Load")[0].checked);

   if($(".checkbox_Load")[0].checked){
       LoadingImages({content:content, button:button, elem:elem, func: ShowIHide});
   } else {
       ShowIHide({button:button, elem:elem});
   }
}

function MiniPanel(param){
    let button = param.button,
        elem = param.elem;

    // Add see
    $(".mDiv_title.opens").show();
    let textPop = $(elem).children(1).children()[4].innerText,

        imgSmall =  $(elem).nextAll(".my_tr:eq(0)").find('table#details tr:eq(0) img:not([error_image])').filter(function(i,val){
            if(val.width > 150 && !/banner|kinopoisk|imdb/i.test(this.src)){
                return this;
            }
        });

    if(imgSmall.length>0){
        let elOut = imgSmall[0];
        for(let i of imgSmall){
            if(i.height > elOut.height) {
                elOut = i;
            }
        }
        imgSmall = elOut.src;
    } else {
        imgSmall = no_image ;
    }

    if(debug) console.log("Мини изображение: ",imgSmall);

    let imgEl = $('<img>').attr({
        src: imgSmall,
        width: "50px"
    }),

        imgBox = $('<div style="display: table-cell;vertical-align: middle;padding:5px;border-right: 1px dotted white;"></div>').append(imgEl),
        textBox = $('<div style="display: table-cell;vertical-align: middle;font-size: unset;padding:2px;word-break: break-all;"></div>').text(textPop),
        hide = button.clone(true),
        hideE = $._data(hide[0], "events"),
        addonBox = $('<div class="minipanel"></div>').attr('title',hide.attr('title')).each(function () {
        for (var type in hideE)
        for (var handler in hideE[type]){
            if(handler === 'delegateCount') continue;
            $.event.add(this, type, hideE[type][handler], hideE[type].data);
        }
    }).append(hide.off()),

        elSee = $('<div class="seeEl"></div>').attr('title',textPop).append(imgBox, textBox,addonBox);

    $(imgBox).add(textBox).click(function(){
            let offset = $(elem).offset().top;
            $('html, body').animate({scrollTop:offset}, 500, 'swing');
        });

    $(elem).data(elSee);

    $(".mDiv_inner").append(elSee).animate({scrollTop:$("div.mDiv_inner").offset().top}, 500, 'swing');
}

// Функция появления и прочее
function ShowIHide(param){
    let elem = param.elem,
        button = param.button,
        event_el = param.event_el || null;

    $(elem).nextAll(".my_tr:eq(0)").animate(
        {
            width: [ "toggle", "swing" ],
            height: [ "toggle", "swing" ],
            opacity: "toggle"
        }, 1500, "linear", function(){
            if($(this).css("display") === "none"){
                button.css("transform", "scaleY(1)").attr("title","Показать раздачу");

                // Remove see
                $(".mDiv_inner")[0].removeChild($(elem).data()[0]);
                if($(".my_tr:visible").length<1){
                    $(".mDiv_title.opens").hide();
                }

            } else {
                button.css("transform", "scaleY(-1)").attr("title","Скрыть раздачу");

                // Mini Panel
                //LoadingImages({content:$(elem).next().next().children(0), button:button, elem:elem, func: MiniPanel});
                MiniPanel(param);
            }

            $(".mDiv_title.opens").text('Открытые '+'('+$(".seeEl").length+')');

            // Back offset on page
            if(event_el !== "minipanel") $('html, body').animate({scrollTop:$(elem).offset().top}, 500, 'swing');
        });
}

// Ajax запрос
function ajaxJQ(param){
    if(debug) console.log("Ajax proceed...");

    let button = param.button,
        link = param.link,
        elem = param.elem;

    $.ajax({
        url: link,
        success: function(data){

            if(debug) console.log("Ajax запрос завершен!");

            let ObjData = {data:data,button:button,elem:elem};
            modifyData(ObjData);
        }
    });
}

function MakeFav(param){
let elem = param.el || null,
    link = param.link,
    linkText = param.linkText,
    Down = param.Down,
    Mdown = param.Mdown,

    FavElTitleA = $('<a style="color: #005fb4;"></a>').attr({href:link, target:"_blank",title:linkText}).text(linkText),
    FavElTitle = $('<div style="display: table-cell;vertical-align: middle;padding:5px; width: 80%;"></div>').append(FavElTitleA),
    FavAddBlock = $('<div style="display: table-cell;vertical-align: middle;padding:5px; width: 10%; border-left: 1px dotted orange;">'+
                    '<div class="poleLinks"><a href="'+Down+'" target="_blank" title="Download"><img src="/s/i/d.gif" alt="Download"></a></div>'+
                    '<div class="poleLinks"><a href="'+Mdown+'" target="_blank" title="Magnet Link"><img src="/s/i/m.png" alt="Magnet Link"></a></div>'+
                    '<div class="poleLinks"><a href="'+"http://tor-ru.net/search/"+encodeURIComponent(searchEditReq(linkText))+'" target="_blank" title="Искать: '+linkText+'"><img src="'+searchIcon+'" alt="Искать:'+linkText+'" width="13"></a></div>'+
                    '</div>'),
    FavElBlockX = $('<div title="Удалить!"></div>').text("X").click(function(e){
       let event_el = e.currentTarget,
           el_block = event_el.parentElement;

        if(debug) console.log($(".mDiv_FavInner .FavBlockEl").index(el_block));
        removeFav({el:el_block, link:link});
    }),
    FavBlockEl = $('<div class="FavBlockEl"></div>').append(FavElTitle,FavAddBlock,FavElBlockX);

    if($(".mDiv_FavInner").children().length === 0) {
        $(".mDiv_FavInner").empty();
    }

    $(".mDiv_FavInner").append(FavBlockEl);

    $(".mDiv_title.fav").text('Избранное '+($(".mDiv_FavInner").children().length == 0 ?'':'('+$(".mDiv_FavInner").children().length+')'));
}

function addFav(param){
let elem = param.el || null,
    link = param.link,
    linkText = param.linkText,
    Down = param.Down,
    Mdown = param.Mdown;

    // Save local storage
        if (!ObjSave.hasOwnProperty('favorites')){
            ObjSave.favorites = {};
        }

        if(!checkPovtor(link)){
            if(debug) console.log("Нет в базе избранного, сохраняю!");

            ObjSave.favorites[encodeURI(link)] = {
                el: null,
                link: encodeURI(link),
                linkText: escape(linkText),
                Down: encodeURI(Down),
                Mdown: encodeURI(Mdown)
            };

            saveToStorage();

            MakeFav(param);
        }
}

function removeFav(param){
let el = param.el,
    link = param.link;

if(confirm("Удалить эту запись?")){
    if (ObjSave.hasOwnProperty('favorites') && link !== "" && link !== undefined && link){

        $(el).animate({"height":"0px","opacity": "0"},'slow', function(){
            delete ObjSave.favorites[encodeURI(link)];
            $(this).remove();
            saveToStorage();
            if(debug) console.log("Элемент удален из избранного!");
            $(".mDiv_title.fav").text('Избранное '+($(".mDiv_FavInner").children().length == 0 ?'':'('+$(".mDiv_FavInner").children().length+')'));
        });
    }

    if($(".mDiv_FavInner").children().length === 0) {
        $(".mDiv_FavInner").text('Пусто...');
    }
}
}

function checkPovtor(link){
    let povtor = false;

    if (ObjSave.hasOwnProperty('favorites')){
        if(Object.keys(ObjSave.favorites).length > 0){
            if(ObjSave.favorites.hasOwnProperty(encodeURI(link))){
                if(debug) console.log("Уже есть в базе избранного!");
                povtor = true;
            }
        }
    }

    return povtor;
}

function updateFav(){
    if (ObjSave.hasOwnProperty('favorites')){
        if(Object.keys(ObjSave.favorites).length > 0){
            for(let pFav in ObjSave.favorites){
                let ObjFavCur = ObjSave.favorites[pFav];
                MakeFav({
                    el: null,
                    link: decodeURI(ObjFavCur.link),
                    linkText: unescape(ObjFavCur.linkText),
                    Down: decodeURI(ObjFavCur.Down),
                    Mdown: decodeURI(ObjFavCur.Mdown)
                });
            }
        }
    }
}

function makePanel(){
    var div = $('<div class="mDiv">'+
                '<div class="mDiv_title">Настройки</div>'+
                '<div id="hideAll">Свернуть все</div>'+
                '<div id="preLoadImages" class="imgages_Load">'+
                '<div class="preLoadImagesRow">'+
                '<div class="preLoadImagesCell">Предзагрузка: </div>'+
                '<div class="preLoadImagesCell"><input type="checkbox" class="checkbox_Load" id="checkbox_imgages_Load"><label for="checkbox_imgages_Load"></label></div>'+
                '</div>'+
                '<div class="preLoadImagesRow">'+
                '<div class="preLoadImagesCell">Тайм-аут загр.</div>'+
                '<div class="preLoadImagesCell"><input type="number" id="timoutTimeImages" title="Тайм-аут загрузки изображений.\nЕсли 0, то тайм-аут устанавл. настройкой браузера!" min="0" step="0.1"> сек.</div>'+
                '</div>'+
                '</div>'+
                '<div class="mDiv_title opens">Открытые</div>'+
                '<div class="mDiv_inner"></div>'+
                '<div class="mDiv_title fav">Избранное</div>'+
                '<div class="mDiv_FavInner"></div>'+
                '</div>'),

        chechVal = "";
    if (ObjSave.hasOwnProperty('options')){
        if (ObjSave.options.hasOwnProperty('preload')) chechVal = ObjSave.options.preload;
    }

    $(div).find("#checkbox_imgages_Load").on('change', function(){
        if(debug) console.log("Предзагрузка: ",$(this)[0].checked);

        if (ObjSave.hasOwnProperty('options')){
            if (!ObjSave.options.hasOwnProperty('preload')) ObjSave.options.preload = "";
            ObjSave.options.preload = $(this)[0].checked;
            saveToStorage();
        }
    }).attr("checked",chechVal);

    $(div).find("#timoutTimeImages").on('change', function(){
        let valueTO = $(this).val();

        if(debug) console.log("Тайм-аут установлен в: ", valueTO+" сек.");

        if(valueTO === "" || /^\s?$/.test(valueTO)) $(this).val(5);

        if (ObjSave.hasOwnProperty('options')){
            if (!ObjSave.options.hasOwnProperty('TimeOutLoadImages')) ObjSave.options.TimeOutLoadImages = 5;
            TimeOutImages = ObjSave.options.TimeOutLoadImages = parseFloat($(this).val());
            saveToStorage();
        }
    }).attr("value", (ObjSave.options.TimeOutLoadImages)?ObjSave.options.TimeOutLoadImages:5);

    $("#sidebar").append(div);

    if($(".mDiv_FavInner").children().length > 0) {
        $(".mDiv_FavInner").fadeIn('slow');
    } else{
        $(".mDiv_FavInner").text('Пусто...').fadeIn('slow');
    }
        
    let maxTop = $(".sideblock:nth-child(1)").offset().top+parseFloat($(".sideblock:nth-child(1)").css("height"))+parseFloat($(".sideblock:nth-child(2)").css("height"));
    $(window).scroll(function() {
        if($(window).scrollTop() >= maxTop){
            $(".sideblock:eq(1)").css({"position":"fixed", "top":"0px","width":"250px"});
            $(".mDiv").css({"position":"fixed", "top":"70px"});
        } else {
            $(".mDiv").add($(".sideblock:eq(1)")).removeAttr("style");
        }
    });

    $("#hideAll").click(function(){
        if($(".my_tr:visible").length){
            $(".my_tr").fadeOut("slow");
            $("img[id^='butSpoiler_'").css("transform", "scaleY(1)").attr("title","Показать раздачу");
            $(".mDiv_title.opens").text('Открытые');

            // Remove see
            $(".mDiv_title.opens").hide();
            $(".mDiv_inner").empty();

        }
    });

    // Ihim
    div =  '<div style="border: 1px double;position: fixed;top: 0;left: 0;width: 1636px;height: 60px;background: white;display: table;">'+
        '<div style="display: table-cell;vertical-align: middle;text-align: center;padding: 5px;width: 90%;">'+
        '<div><input placeholder="Поиск..." style="    width: 100%;font-size: 2.5em;font-family: monospace;background: #ececec;outline-style: none;border: 0;color: #4C89C2;"></div></div>'+
        '<div style="display: table-cell;vertical-align: middle;padding: 5px;text-align: center;width: 10%;">'+
        '<div style="width: 90%;text-align: center;padding: 5px;height: 30px;line-height: 25px;font-size: 2em;margin: 0 auto;cursor: pointer;background: repeating-linear-gradient(-22deg, #ef1f1f 20px, #ab0000 40px);color: white;">Поиск</div></div>'+
        '</div>';
   // $("body").append(div);
}

function searchEditReq(title){
    let seatchText = title.match(/(.*)\[|\(/i)[1];

    if(seatchText === null || seatchText === undefined) seatchText = title;

    return seatchText;
}

function addPoleInfo(){
    // Ищим классы для получения данных
    $(".backgr, .gai, .tum").each(function(i, val){

        // Если класс заголовка добавляем свой заголовок для кнопки
        if(this.className == "backgr") {
            $('<td width="1px">Спойлер</td>').prependTo(this);
        } else {
            // Если нет получаем информацию
            let elem = this,
                m_elem = this.children[1],

                down = m_elem.children[0].href,
                magn = m_elem.children[1].href,
                link = m_elem.children[2].href,
                linkText = m_elem.children[2].innerText,

                img = $('<img style="cursor:pointer;" title="Показать раздачу" id="butSpoiler_'+i+'" src="'+image_arrow+'" width="16px"></img>'),

                newI = $('<td style="text-align:center;"></td>').html(img);

            $("<a href='javascript:void(0);' title='Add Favorite'><img src='"+favIcon+"' width='15'></a>").insertBefore(m_elem.children[0]).click(function(){
                addFav({
                    el:this,
                    link:link,
                    linkText:linkText,
                    Down:down,
                    Mdown:magn
                });
            });

            let search = $("<a href='javascript:void(0);' style='margin-left:10px;' title='Искать: "+linkText+"'><img src='"+searchIcon+"' width='15'></a>").click(function(){
                window.location.href = "http://tor-ru.net/search/"+encodeURIComponent(searchEditReq(linkText));
            });
            $(m_elem).append(search);

            // Image event
            $(img).click(function(e) {
                if(!$(elem).next().is(".tr_loading")){
                    $(elem).after('<tr class="tr_loading" style="text-align:center; display:none;"><td colspan="6">'+
                                                 '<div class="loading_tor_box">'+
                                                 '<div class="loading_tor"><div class="loading_tor_text"></div></div>'+
                                                 '</div>'+
                                                 '</td></tr>');
                    $(elem).next('.tr_loading').after('<tr class="my_tr"><td colspan="6"></td></tr>');

                    ajaxJQ({button : img , link: link, elem : elem});
                } else {
                    ShowIHide({elem:elem, button: img, event_el: e.currentTarget.className});
                }
            });

            $(newI).prependTo(this);
        }
    });
}

function AdBlock(){
    if($(".sideblock2").length){
        $(".sideblock2").remove();
    }
}

function init(){
    AdBlock();
    loadStorage();
    makePanel();
    addPoleInfo();
    updateFav();
}

init();

})();