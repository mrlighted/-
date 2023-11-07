var stats={init:function(){stats.data={lastEvent:"",progress:0,progressToday:0,lastChild:0,lastChildName:"",lastParents:[],lastDate:0,failCount:0,failInRow:[0],failParents:[],failDate:[],numberOfClicks:0,numberOfAFK:0,online:!0,logged:!1,startDate:(new Date).getTime(),maxElementsOnWorkspace:0,elementsPositions:[]},stats.initEvents(),stats.initLA2()},initEvents:function(){$(document).on("newChildCreated",(function(e,n){stats.data.lastChild=n,stats.data.lastChildName=bases.names[n],stats.data.progress=game.progress.length+game.prime.length,stats.data.progressToday+=1,stats.data.failInRow.push(0),stats.data.elementsPositions.push(stats.getElementsPositions()),stats.data.elementsPositions[stats.data.elementsPositions.length-1]>stats.data.maxElementsOnWorkspace&&(stats.data.maxElementsOnWorkspace=stats.data.elementsPositions[stats.data.elementsPositions.length-1]),stats.data.lastMixAttempt=(new Date).getTime()})),$(document).on("updateHistory",(function(e,n,t){stats.data.lastParents=n,stats.data.lastDate=t})),$(document).on("childCreationFail",(function(e,n){stats.data.failCount+=1,stats.data.failInRow[stats.data.failInRow.length-1]+=1,stats.data.failParents.push(n),stats.data.failDate.push((new Date).getTime()),stats.data.elementsPositions.push(stats.getElementsPositions()),stats.data.elementsPositions[stats.data.elementsPositions.length-1]>stats.data.maxElementsOnWorkspace&&(stats.data.maxElementsOnWorkspace=stats.data.elementsPositions[stats.data.elementsPositions.length-1]),stats.data.lastMixAttempt=(new Date).getTime()})),$(document).on("loginCompleted",(function(){stats.data.logged=!0,stats.data.loginDate=(new Date).getTime()})),$(document).on("online",(function(){stats.data.online=!0})),$(document).on("awayFromKeyboard",(function(){stats.data.numberOfAFK+=1})),$(document).on("click",(function(){stats.data.numberOfClicks+=1})),$(document).on("onbeforeunload",(function(){stats.data.logoutDate=(new Date).getTime(),stats.data.timeSpent=parseInt(window.localStorage.getItem("timeSpent"),10)+Math.floor(stats.time.total+stats.time.currentTime)})),$(document).on("newChildCreated updateHistory childCreationFail loginCompleted online",(function(e){stats.data.lastEvent=e.type,$(document).trigger("statsDataUpdated")}))},initAnalytics:function(){$("#menu").on("click",(function(){ga("send","event","Menu","Opened")})),$(document).on("menuTabOpened",(function(e,n){ga("send","event","Menu","Tab opened",n)})),$(document).on("change","#settingsCheckAlreadyCombined",(function(){ga("send","event","Settings","Check already combined",this.checked?"true":"false")})),$(document).on("change","#settingsMarkFinalElements",(function(){ga("send","event","Settings","Mark final elements",this.checked?"true":"false")})),$(document).on("change","#settingsHideFinalElements",(function(){ga("send","event","Settings","Hide final elements",this.checked?"true":"false")})),$(document).on("change","#settingsTurnOffNotifications",(function(){ga("send","event","Settings","Turn off notifications",this.checked?"true":"false")})),$(document).on("change","#settingsLanguage",(function(){ga("send","event","Settings","Language",this.options[this.selectedIndex].value)})),$(document).on("newChildCreated",(function(e,n){ga("send","event","Elements","New element",n),stats.data.failInRow.length>=2&&stats.data.failInRow[stats.data.failInRow.length-2]>0&&ga("send","event","Elements","Fails in streak",stats.data.failInRow[stats.data.failInRow.length-2]+" ")})),$(document).on("childCreationFail",(function(e,n){ga("send","event","Elements","Failed parents",n[0]+" | "+n[1])})),$(document).on("cloneWorkspaceBox",(function(e,n,t){ga("send","event","Elements","Clone element",t.id)})),$(document).on("loggedIn",(function(){ga("send","event","Google+","Logged in",GoogleAPI.player.id)})),$(document).on("achievementEarned",(function(e,n){ga("send","event","Achievements","Earned",n)})),$(document).on("hiddenElementCreated",(function(e,n){ga("send","event","Elements","Hidden element",n)})),$(document).on("sharedScreenshot",(function(){ga("send","event","Share","Screenshot")})),$(document).on("sharedProgress",(function(e,n){ga("send","event","Share","Progress",n+" ")})),$(document).on("sharedElement",(function(e,n){ga("send","event","Share","Element",n+" ")})),$("#clearWorkspace").on("touchstart",(function(){ga("send","event","Elements","Clear workspace","Cleared")})),window.onbeforeunload=function(){ga("send","event","Progress","In session",stats.data.progressToday+" "),ga("send","event","Elements","Fails in session",stats.data.failCount+" ")}},initLA2:function(){$(document).on("click","[data-la2]",(function(e){ga("send","event","LA2","web",e.currentTarget.getAttribute("data-la2"))}))},initAnonymous:function(){var e;if(!stats.data.logged&&null===localStorage.getItem("uid")){stats.uid=(new Date).getTime()+"";var n="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(e=0;e<10;e++)n+=t.charAt(Math.floor(Math.random()*t.length));stats.uid+=n,window.localStorage.setItem("uid",stats.uid)}},getElementsPositions:function(){for(var e,n,t=[],a=$("#workspace > .element"),i=0,s=a.length;i<s;i++)(e=$(a[i]).offset()).left=Math.floor(e.left),e.top=Math.floor(e.top),e.top>0&&e.left>0&&(n=a[i].getAttribute("data-elementId"),t.push({position:e,id:parseInt(n,10)}));return t}};stats.init();var menu={init:function(){menu.$el=$("#panel"),menu.$container=menu.$el.find(".content"),menu.active="welcome",menu.initEvents(),menu.canClickMenuTab=!0,menu.data={welcome:{initEvents:function(){null!=typeof feedback&&feedback.initEvents()}},settings:{generateData:function(){return{selected:localization.language,languages:localization.languages}},onCreation:function(){settings.initContent();var e=document.getElementById("settingsDisconnect");GoogleAPI.logged||(e.style.display="none"),$(document).on("loggedIn",(function(){e.style.display="block"})),$(document).on("loggedOut",(function(){e.style.display="none"}))}},leaderboards:{initEvents:function(){$(document).trigger("leaderboardsTabShown")},onCreation:function(){var e=menu.$el[0].querySelector('[data-tabName="leaderboards"]');GoogleAPI.logged||(e.style.display="none"),$(document).on("loggedIn",(function(){e.style.display="block",menu.setMenuTabsWidth(),menu.refreshIScroll()})),$(document).on("loggedOut",(function(){e.style.display="none",menu.setMenuTabsWidth(),menu.refreshIScroll()}))}},achievements:{refresh:!0,initEvents:function(){$(document).trigger("achievementsTabShown")}}},localization&&localization.loaded?menu.loadTemplates():$(document).one("languagePackLoaded",(function(){menu.loadTemplates()}))},initEvents:function(){$(document).on("click","#menu",(function(){menu.open()})),menu.$el.on("click",(function(e){e.target.id===menu.$el[0].id&&menu.close()})),$("#closePanel").on("click",(function(){menu.close()})),$(document).on("keyup",(function(e){27===e.which&&menu.close()})),$(document).on("languageChanged",(function(){menu.$container.find("#menuContent").remove(),menu.$container.find("#outerMenuTabs").remove(),menu.loadTemplates()})),$(document).on("menuCreated",(function(){"undefined"!=typeof sharing&&sharing.init()}))},initTabs:function(){for(var e in menu.data)menu.data[e].title=localization.get("menu-"+e);for(var e in menu.$container.append(templateEngine(menu.template,menu)),menu.$el.find('[data-tabName="'+menu.active+'"]').addClass("active"),menu.data){var n=menu.data[e].hasOwnProperty("generateData")?menu.data[e].generateData():{};$($("#"+e).find("div")[0]).append(templateEngine(menu.data[e].template,n)),menu.data[e].hasOwnProperty("onCreation")&&menu.data[e].onCreation(),menu.$el.find('[data-tabName="'+e+'"]').on("click",(function(){if(!menu.canClickMenuTab)return!1;var e=$(this),n=e.attr("data-tabName");if(menu.data[n].hasOwnProperty("refresh")){var t=menu.data[n].hasOwnProperty("generateData")?menu.data[n].generateData():{};$(menu.$container.find("#"+n).find("div")[0]).empty().append(templateEngine(menu.data[n].template,t))}menu.active=n,menu.$el.find(".active").removeClass("active"),e.addClass("active"),menu.$container.find(".visible").removeClass("visible").addClass("hidden"),menu.$container.find("#"+n).removeClass("hidden").addClass("visible"),menu.data[n].hasOwnProperty("initEvents")&&menu.data[n].initEvents(),iscrollMenu&&(iscrollMenu.scrollTo(0,0,0),iscrollMenu.refresh()),$(document).trigger("menuTabOpened",[n])}))}$("#"+menu.active).removeClass("hidden").addClass("visible"),menu.data[menu.active].hasOwnProperty("initEvents")&&menu.data[menu.active].initEvents(),"block"===menu.$el[0].style.display&&menu.setMenuTabsWidth(),$(document).trigger("menuCreated")},loadTemplates:function(){var e=localization.getURL("menu.html");$.get(loading.getURL(e),(function(n,t,a){for(var i in loading.analyzeModificationDate(e,a.getResponseHeader("Last-Modified")),menu.template=$(n).filter("#menuTemplate").html(),menu.data)menu.data[i].template=$(n).filter("#"+i+"Template").html();menu.initTabs(),menu.initIscroll()}))},open:function(){if(menu.active="welcome",menu.$el.find(".active").removeClass("active"),menu.$el.find('[data-tabName="'+menu.active+'"]').addClass("active"),menu.$container.find(".visible").removeClass("visible").addClass("hidden"),menu.$container.find("#"+menu.active).removeClass("hidden").addClass("visible"),menu.data[menu.active].hasOwnProperty("refresh")){var e=menu.data[menu.active].hasOwnProperty("generateData")?menu.data[menu.active].generateData():{};$(menu.$container.find("#"+menu.active).find("div")[0]).empty().append(templateEngine(menu.data[menu.active].template,e)),menu.data[menu.active].hasOwnProperty("initEvents")&&menu.data[menu.active].initEvents()}menu.$el[0].style.display="block",menu.setMenuTabsWidth(),menu.refreshIScroll()},close:function(){menu.$el.is(":visible")&&(menu.$el[0].style.display="none",menu.canClickMenuTab=!0)},initIscroll:function(){var e=function(){iscrollMenuTabs=new IScroll("#outerMenuTabs",{mouseWheel:!0,scrollX:!0,scrollY:!1,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT|A|LABEL|LI)$/},eventPassthrough:!1,click:!0}),iscrollMenu=new IScroll("#menuContent",{mouseWheel:!0,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT|A|LABEL)$/}}),iscrollMenuTabs.on("scrollStart",(function(e){menu.canClickMenuTab=!1})),iscrollMenuTabs.on("scrollEnd",(function(e){menu.canClickMenuTab=!0}))};"undefined"!=typeof iscrollMenu&&"undefined"!=typeof iscrollMenuTabs&&menu.refreshIScroll(),"undefined"!=typeof IScroll?e():$(document).one("IScrollLoaded",e)},refreshIScroll:function(){if("block"===menu.$el[0].style.display){$("#menuContent").css({height:$("#panel .content").height()-$("#menuTabs").outerHeight(!0)}),"undefined"!=typeof iscrollMenu&&iscrollMenu&&(iscrollMenu.refresh(),iscrollMenu.scrollTo(0,0,0));$("#outerMenuTabs").width($("#panel .content").innerWidth()-$("#closePanel").innerWidth()-15),"undefined"!=typeof iscrollMenuTabs&&iscrollMenuTabs&&iscrollMenuTabs.refresh()}},setMenuTabsWidth:function(){for(var e=document.querySelectorAll("#menuTabs li"),n=15,t=0;t<e.length;t++)n+=e[t].offsetWidth;$("#menuTabs").width(n)}};window.onresize=menu.refreshIScroll,window.addEventListener("orientationChange",menu.refreshIScroll,!1),menu.init();var notificationsHelpers={checkProgressAndElements:function(e,n){if(game.progress.length<n)return!1;for(var t=0;t<e.length;t++)if(-1===game.progress.indexOf(e[t]))return!1;return!0},checkFailsInRow:function(e){return"childCreationFail"===stats.data.lastEvent&&stats.data.failInRow[stats.data.failInRow.length-1]>=e}},notificationsData={elements:{isGroup:!0,once:!0,priority:9,template:"element",duration:15,selfBlocking:!0,blocker:null,isBlocked:function(){return null!==this.blocker&&(-1===game.progress.indexOf(this.list[this.blocker].id)||(delete this.list[this.blocker],this.blocker=null,!1))},check:function(e){return game.hasOwnProperty("progress")&&-1===game.progress.indexOf(e.id)&&notificationsHelpers.checkFailsInRow(e.failsInRow)&&notificationsHelpers.checkProgressAndElements(e.blockers,e.minProgress)},passData:function(e){return{name:bases.names[e.id],image:bases.images[e.id]}},delay:function(e){var n=(new Date).getTime();return n>e.timestamp+5e3&&stats.data.lastMixAttempt<=e.timestamp||stats.data.lastMixAttempt>e.timestamp&&n},list:{plant:{id:24,blockers:[13],minProgress:5,failsInRow:10},stone:{id:27,blockers:[6],minProgress:6,failsInRow:15},swamp:{id:43,blockers:[24],minProgress:20,failsInRow:25},life:{id:44,blockers:[43,11],minProgress:28,failsInRow:20},sand:{id:28,blockers:[27],minProgress:30,failsInRow:20},metal:{id:36,blockers:[27],minProgress:26,failsInRow:20},human:{id:48,blockers:[44],minProgress:32,failsInRow:20},time:{id:41,blockers:[28],minProgress:40,failsInRow:20},wood:{id:56,blockers:[42],minProgress:45,failsInRow:20},tool:{id:53,blockers:[36,48],minProgress:36,failsInRow:20},farmer:{id:71,blockers:[48],minProgress:43,failsInRow:20},tree:{id:42,blockers:[24,41],minProgress:42,failsInRow:20},livestock:{id:73,blockers:[48],minProgress:57,failsInRow:20},wheel:{id:82,blockers:[42,53],minProgress:60,failsInRow:20},wild_animal:{id:140,blockers:[44,42],minProgress:62,failsInRow:20},fruit:{id:88,blockers:[42,71],minProgress:70,failsInRow:20},blade:{id:55,blockers:[27,36],minProgress:30,failsInRow:20},house:{id:72,blockers:[53,172],minProgress:40,failsInRow:20},sun:{id:108,blockers:[22],minProgress:20,failsInRow:20},sky:{id:22,blockers:[15],minProgress:15,failsInRow:20},wheat:{id:84,blockers:[71],minProgress:80,failsInRow:20},rainbow:{id:110,blockers:[13,108],minProgress:60,failsInRow:20},electricity:{id:114,blockers:[11,36],minProgress:30,failsInRow:20},pig:{id:165,blockers:[12,73],minProgress:75,failsInRow:20},glass:{id:32,blockers:[28],minProgress:20,failsInRow:20},glasses:{id:185,blockers:[32],minProgress:30,failsInRow:20},mountain:{id:201,blockers:[19],minProgress:30,failsInRow:20},paper:{id:208,blockers:[7,56],minProgress:70,failsInRow:20},letter:{id:260,blockers:[208,233],minProgress:80,failsInRow:20},lightbulb:{id:115,blockers:[32,114],minProgress:85,failsInRow:20},thread:{id:432,blockers:[82,361],minProgress:100,failsInRow:20},moon:{id:79,blockers:[22,27],minProgress:70,failsInRow:20},energy:{id:11,blockers:[],minProgress:70,failsInRow:20}}},manyFails:{priority:7,check:function(){return"childCreationFail"===stats.data.lastEvent&&stats.data.failCount-139==0&&stats.data.failCount>0&&game.progress.length>80},onShow:function(){var e=notifications.$box.width()-30,n=notifications.$box.height(),t=$($(".notificationLink")[0]),a=t.position(),i=a.top+"px ",s=a.left+"px",o=e-a.left-t.width()+"px ",l=n-a.top-t.height()+"px ";t.css("padding",i+o+l+s),t.css("margin","-"+i+"-"+o+"-"+l+"-"+s)},blocker:[]},manyFails2:{priority:7,check:function(){return"childCreationFail"===stats.data.lastEvent&&stats.data.failCount-200==0&&stats.data.failCount>0&&game.progress.length>50},onShow:function(){var e=notifications.$box.width()-35,n=notifications.$box.height(),t=$($(".notificationLink")[0]),a=t.position(),i=a.top+"px ",s=a.left+"px",o=e-a.left-t.width()+"px ",l=n-a.top-t.height()+"px ";t.css("padding",i+o+l+s),t.css("margin","-"+i+"-"+o+"-"+l+"-"+s)},blocker:[]}},achievementsData=[{id:"50elements",gapiId:"CgkIz_OApZAJEAIQAg",events:"newChildCreated",imageNotEarned:"achievement50-locked.png",imageEarned:"achievement50.png",check:function(e){return game.progress.length+game.prime.length===50},initCheck:function(){return game.progress.length+game.prime.length>=50}},{id:"100elements",gapiId:"CgkIz_OApZAJEAIQAw",events:"newChildCreated",imageNotEarned:"achievement100-locked.png",imageEarned:"achievement100.png",check:function(e){return game.progress.length+game.prime.length===100},initCheck:function(){return game.progress.length+game.prime.length>=100}},{id:"200elements",gapiId:"CgkIz_OApZAJEAIQBA",events:"newChildCreated",imageNotEarned:"achievement200-locked.png",imageEarned:"achievement200.png",check:function(e){return game.progress.length+game.prime.length===200},initCheck:function(){return game.progress.length+game.prime.length>=200}},{id:"300elements",gapiId:"CgkIz_OApZAJEAIQBw",events:"newChildCreated",imageNotEarned:"achievement300-locked.png",imageEarned:"achievement300.png",check:function(e){return game.progress.length+game.prime.length===300},initCheck:function(){return game.progress.length+game.prime.length>=300}},{id:"400elements",gapiId:"CgkIz_OApZAJEAIQCA",events:"newChildCreated",imageNotEarned:"achievement400-locked.png",imageEarned:"achievement400.png",check:function(e){return game.progress.length+game.prime.length===400},initCheck:function(){return game.progress.length+game.prime.length>=400}},{id:"completionist",gapiId:"CgkIz_OApZAJEAIQCQ",events:"newChildCreated",imageNotEarned:"achievement-all-locked.png",imageEarned:"achievement-all.png",check:function(e){return game.progress.length+game.prime.length===game.maxProgress}},{id:"hiddenelement",gapiId:"CgkIz_OApZAJEAIQCg",events:"hiddenElementCreated",imageNotEarned:"achievement-hidden-locked.png",imageEarned:"achievement-hidden.png",check:function(e){return!0},initCheck:function(){return game.hiddenElements.length>=1}}],feedback={formUrl:"../feedback/feedbackForm.html",initEvents:function(){$("#feedbackBtn").on("click",(function(){feedback.prepareFeedback()}))},prepareFeedback:function(){var e="";Clay&&html2canvas&&($("#panel").hide(),html2canvas(document.body,{onrendered:function(n){var t=new Clay.Screenshot({prompt:!1});t.data=n.toDataURL(),t.save({hideUI:!0},(function(n){e=n.imageSrc,window.localStorage.setItem("bugSS",e)}))}}))}};feedback.initEvents();