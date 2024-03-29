var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SET", "OCT", "NOV", "DEC"];
var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

var pageHistory = [];

var shareSelection = [];
var shareSelectionTmp = [];

var timeEnded;
var timeout_id;
var virgin = true;

var openedItems;


window.ondragstart = function() { return false; }


function btnMouseDown(button, func) {
	/*button.style.height='10px';*/
	button.style.backgroundColor="#595959";
	button.setAttribute("onmouseleave", "btnMouseUp(this,"+func+")");
	if (func != null) {
		func();
	}
}

function btnMouseUp(button, func) {
	/*button.style.height='13px';*/
	button.style.backgroundColor="black";
	button.setAttribute("onmouseleave", "");
	if (func != null) {
		func();
	}
}

function triggerChoice() {
	timeEnded = false;
	timeout_id = setTimeout(triggerHome, 250);
}

function endChoice() {
	if (!timeEnded) {
		clearTimeout(timeout_id);
		goBack();
	}
}

function triggerHome() {
	timeEnded = true;
	goToHome();
}


function loadData() {
	if (localStorage.posts7 == undefined) {
		localStorage.posts7 = JSON.stringify(posts);
		localStorage.people7 = JSON.stringify(people);
		localStorage.myPosts7 = JSON.stringify(myPosts);
		localStorage.tickets7 = JSON.stringify(tickets);
		localStorage.bought7 = JSON.stringify(bought);
		localStorage.restaurants7 = JSON.stringify(restaurants);
	} else {
		posts = JSON.parse(localStorage.posts7);
		people = JSON.parse(localStorage.people7);
		myPosts = JSON.parse(localStorage.myPosts7);
		tickets = JSON.parse(localStorage.tickets7);
		bought = JSON.parse(localStorage.bought7);
		restaurants = JSON.parse(localStorage.restaurants7);
	}
	fillPostPreviews();

	$(".screen:first")[0].onclick = function() {
		testInfo.clicks++;
	}
	$(".popupBox").on("click", function() {
		event.stopPropagation();
		testInfo.clicks++;
	});
}

var testInfo = {startTime: 0, clicks: 0};

function startTest() {
	var btn = $(".testBtn:first")[0];
	btn.children[0].innerHTML = "stop";
	btn.setAttribute("onclick", "stopTest()");
	testInfo.startTime = Date.now();
	testInfo.clicks = 0;
}

function stopTest() {
	var btn = $(".testBtn:first")[0];
	btn.children[0].innerHTML = "start";
	btn.setAttribute("onclick", "startTest()");

	var sec = parseInt((Date.now()-testInfo.startTime)/1000);

	console.log("---- Test Results: ----");
	console.log("   Clicks: "+testInfo.clicks);
	console.log("   Time: "+sec);
}

function reset() {
	if (confirm("Reset device data?")) {
		localStorage.removeItem("posts7");
		localStorage.removeItem("people7");
		localStorage.removeItem("myPosts7");
		localStorage.removeItem("tickets7");
		localStorage.removeItem("bought7");
		localStorage.removeItem("restaurants7");
		location.reload();
	}
}

function querySize() {
	var sel = document.getElementsByTagName("SELECT")[0];
	if (localStorage.selIndex == undefined) {
		localStorage.selIndex = JSON.stringify(sel.selectedIndex);
	} else {
		sel.selectedIndex = JSON.parse(localStorage.selIndex);
	}
	adjustSize();
}

var screenScale;

function adjustSize() {
	var sel = document.getElementsByTagName("SELECT")[0];
	localStorage.selIndex = JSON.stringify(sel.selectedIndex);
	var diagInch = parseFloat(sel.value);
	var diagCm = diagInch * 2.54;
	var diagPix = Math.sqrt(screen.width*screen.width + screen.height*screen.height);
	var divWidthPix = 6.5 * diagPix / diagCm;
	var div = document.getElementsByClassName("screen")[0];
	screenScale = divWidthPix / parseInt(getComputedStyle(div).width);
	var zoom = window.devicePixelRatio;

	if (zoom != 1 && navigator.userAgent.indexOf("Chrome") != -1) {
		screenScale = screenScale/zoom;
	}
	div.style.transform = "scale("+screenScale+")";
	adjustMapWrapper();
}

function adjustMapWrapper() {
	var wrapper = document.getElementById("mapWrapper");
	var screenBox = document.getElementsByClassName("screen")[0].getBoundingClientRect();
	wrapper.style.transformOrigin = " 0 0 0";
	wrapper.style.transform = "scale("+(1/screenScale)+")";
	wrapper.style.width = screenBox.width+"px";
	wrapper.style.height = screenBox.height+"px";
}

function showPage(name) {
	var page = document.getElementsByClassName(name)[0];
	page.classList.remove("hidden");
	pageHistory.push(name);
}

function hidePage(name) {
	var page = document.getElementsByClassName(name)[0];
	page.classList.add("hidden");
}

function switchPages(oldPage, newPage) {
	/*if (newPage == 'mapApp') {
		var pins = document.getElementsByClassName("pin");
		var more = document.getElementsByClassName("moreBtn")[0];
		var sidePanel = document.getElementsByClassName("sidePanel")[0];
		more.style.visibility = "visible";
		sidePanel.style.visibility = "visible";
		if (mapPinLastType != -1) {
			var chosenPins = document.getElementsByClassName("opt" + mapPinLastType);
			for (var i = 0; i < chosenPins.length; i++)
				chosenPins[i].style.visibility = "visible";
		} else {
			for (var i = 0; i < pins.length; i++)
				pins[i].style.visibility = "visible";
		}	
	} else if (oldPage == 'mapApp') {
		var pins = document.getElementsByClassName("pin");
		var more = document.getElementsByClassName("moreBtn")[0];
		var sidePanel = document.getElementsByClassName("sidePanel")[0];
		sidePanel.style.visibility = "hidden";
		more.style.visibility = "hidden";
		if (mapPinLastType != -1) {
			var chosenPins = document.getElementsByClassName("opt" + mapPinLastType);
			for (var i = 0; i < chosenPins.length; i++)
				chosenPins[i].style.visibility = "hidden";
		} else {
			for (var i = 0; i < pins.length; i++)
				pins[i].style.visibility = "hidden";
		}
	}*/
	hidePage(oldPage);
	showPage(newPage);
}

function updateClock() {
	var d = new Date();
	var times = document.getElementsByClassName("time");
	var dates = document.getElementsByClassName("date");
	var hours = d.getHours() < 10 ? "0"+d.getHours() : d.getHours();
	var minutes = d.getMinutes() < 10 ? "0"+d.getMinutes() : d.getMinutes();

	for (let i=0; i < times.length; i++) {
	    times[i].innerHTML = hours + ":" + minutes;
	}
	for (let i=0; i < dates.length; i++) {
	    dates[i].innerHTML = weekday[d.getDay()] + ", " + d.getDate() + " " + month[d.getMonth()];
	}

	setTimeout(updateClock, (60-d.getSeconds()+1)*1000);
}

function goToHome() {
	if (pageHistory.length>0 && pageHistory[pageHistory.length-1] != "lockscreen" && pageHistory[pageHistory.length-1] != "main") {
		/*if(pageHistory[pageHistory.length-1] == "mapApp"){
			var pins = document.getElementsByClassName("pin");
			var more = document.getElementsByClassName("moreBtn")[0];
			var sidePanel = document.getElementsByClassName("sidePanel")[0];
			sidePanel.style.visibility = "hidden";
			more.style.visibility = "hidden";
			for (var i = 0; i < pins.length; i++)
				pins[i].style.visibility = "hidden";
		}*/
		var current = document.getElementsByClassName(pageHistory.pop())[0];
		var main = document.getElementsByClassName("main")[0];
		main.classList.toggle("hidden");
		current.classList.toggle("hidden");
		if (current.classList.contains("popup")) {
			var previous = document.getElementsByClassName(pageHistory.pop())[0];
			previous.classList.toggle("hidden");
		}
		pageHistory = ["lockscreen", "main"];
		$("#arrowPad").css("visibility", "hidden");
	}
}

function turnOnOff() {
	if (pageHistory.length > 0) {
		var current = document.getElementsByClassName(pageHistory[pageHistory.length-1])[0];
		current.classList.toggle("hidden");
		if (current.classList.contains("popup")) {
			var previous = document.getElementsByClassName(pageHistory[pageHistory.length-2])[0];
			previous.classList.toggle("hidden");
		}
		if(pageHistory[pageHistory.length-1] == "mapApp") {
			$("#arrowPad").css("visibility", "hidden");
		}
		if (pageHistory[pageHistory.length-1] != "lockscreen") {
			pageHistory.push("lockscreen");
		}
		
	} else {
		var lockscreen = document.getElementsByClassName("lockscreen")[0];
		lockscreen.classList.toggle("hidden");
		pageHistory = ["lockscreen"];
	}
}

function goBack() {
	if (pageHistory.length>0 && pageHistory[pageHistory.length-1] != "lockscreen" && pageHistory[pageHistory.length-1] != "main") {
		if(pageHistory[pageHistory.length-1] == "mapApp") {
			$("#arrowPad").css("visibility", "hidden");
		}
		/*if(pageHistory[pageHistory.length-1] == "mapApp"){
			var more = document.getElementsByClassName("moreBtn")[0];
			var sidePanel = document.getElementsByClassName("sidePanel")[0];
			if (mapPinLastType != -1) {
				var chosenPins = document.getElementsByClassName("opt" + mapPinLastType);
				for (var i = 0; i < chosenPins.length; i++)
					chosenPins[i].style.visibility = "hidden";
			} else {
				var pins = document.getElementsByClassName("pin");
				for (var i = 0; i < pins.length; i++)
					pins[i].style.visibility = "hidden";
			}
			more.style.visibility = "hidden";
			sidePanel.style.visibility = "hidden";
		}
		if(pageHistory[pageHistory.length-2] == "mapApp"){
			var sidePanel = document.getElementsByClassName("sidePanel")[0];
			var more = document.getElementsByClassName("moreBtn")[0];
			if (mapPinLastType != -1) {
				var chosenPins = document.getElementsByClassName("opt" + mapPinLastType);
				for (var i = 0; i < chosenPins.length; i++)
					chosenPins[i].style.visibility = "visible";
			} else {
				var pins = document.getElementsByClassName("pin");
				for (var i = 0; i < pins.length; i++)
					pins[i].style.visibility = "visible";
			}
			sidePanel.style.visibility = "visible";
			more.style.visibility = "visible";
		}*/
		var current = document.getElementsByClassName(pageHistory.pop())[0];
		var previous = document.getElementsByClassName(pageHistory[pageHistory.length-1])[0];
		current.classList.toggle("hidden");
		if (!current.classList.contains("popup")) {
			previous.classList.toggle("hidden");
		}
	}
}

function unlock() {
	var lockscreen = document.getElementsByClassName("lockscreen")[0];
	var app = document.getElementsByClassName("main")[0];
	if (!virgin) {
		pageHistory.pop();
		app = document.getElementsByClassName(pageHistory[pageHistory.length-1])[0];
		if (app.classList.contains("popup")) {
			var previous = document.getElementsByClassName(pageHistory[pageHistory.length-2])[0];
			previous.classList.toggle("hidden");
		}
		if(pageHistory[pageHistory.length-1] == "mapApp") {
			$("#arrowPad").css("visibility", "visible");
		}
	} else {
		virgin = false;
		pageHistory.push("main");
	}
	lockscreen.classList.toggle("hidden");
	app.classList.toggle("hidden");
}

function openApp(appName) {
	if (connects.wifi == false) {
		/*showNotif("Wifi is off. <u onclick='changeSetting(0);showNotif(\"Wifi enabled\")'>Toggle</u>");*/
		showNotif("Turn on wifi:&#8194;"+appendNotifSlider("wifi"));
		return;
	}
	switchPages("main", appName);
	if (appName == "shareApp") {
		var app = document.getElementsByClassName(appName)[0];
		var cont = app.children[0];
		cont.scrollTop = 0;
	} else if (appName == "ticketApp") {
		selectTab(0);
		updateCartDot();
	} else if (appName == "mapApp") {
		$("#arrowPad").css("visibility", "visible");
	}
}

var notifTime;

function showNotif(msg) {
	var notif = document.getElementsByClassName("notif")[0];
	notif.innerHTML = msg;
	clearTimeout(notifTime);
	notif.style.opacity = "1";
	notif.style.visibility = "visible";
	notifTime = setTimeout(hideNotif, 2500);
}

function hideNotif() {
	var notif = document.getElementsByClassName("notif")[0];
	notif.style.opacity = "0";
	setTimeout(function(notif){notif.style.visibility = "hidden";}, 500, notif);
}

/* ================= SHAREAPP =====================*/

	function fillPostPreviews() {
		var n = 1;
		var app = document.getElementsByClassName("shareApp")[0];
		var cols = app.children[0].children;

		cols[0].innerHTML = "";
		cols[1].innerHTML = "";
		for (var i = posts.length - 1; i >= 0; i--) {
			cols[n].innerHTML += 
						"<div class='postPreview'>\
							<div class='header' onclick='openProfile(\"shareApp\",\"" + posts[i].person + "\")'>\
								<img src=" + people[posts[i].person].pic + ">\
								<p>" + posts[i].person + "</p>\
							</div>\
							<img src=" + posts[i].image + " onclick='showPost(\"" + i + "\", \"shareApp\")'>\
						</div>";

			n = (n+1)%2;
		}
	}

	function showPost(postNumber, pageName) {
		var postPage = document.getElementsByClassName("fullPost")[0];
		var cont = postPage.children[0];
		cont.scrollTop = 0;

		fillPost(postNumber);
		switchPages(pageName, "fullPost");
	}

	function fillPost(postNumber) {
		var post = posts[postNumber];
		var postPage = document.getElementsByClassName("fullPost")[0];
		var header = postPage.children[0].children[0].children[0];
		var img = postPage.children[0].children[0].children[1];
		var bar = postPage.children[0].children[0].children[2];
		var shareInfo = postPage.children[0].children[0].children[3];
		var comments = postPage.children[0].children[0].children[4];

		header.children[0].src = people[post.person].pic;
		header.children[0].setAttribute("onclick", "openProfile(\"fullPost\",\"" + post.person + "\")");
		header.children[1].innerHTML = post.person;
		header.children[1].setAttribute("onclick", "openProfile(\"fullPost\",\"" + post.person + "\")");
		header.children[2].innerHTML = post.place;
		if (posts[postNumber].person == "User") {
			header.children[3].src = "../img/icons/trash-can-black-symbol.svg";
			header.children[3].setAttribute("onclick", "tryDeletePost(" + postNumber + ")");
		} else {
			header.children[3].src = "";
			header.children[3].setAttribute("onclick", "");
		}

		img.src = post.image;
		if (posts[postNumber].upvoted) {
			bar.children[0].src = "../img/icons/up-arrow-full.svg";
		} else {
			bar.children[0].src = "../img/icons/up-arrow.svg";
		}
		bar.children[0].setAttribute("onclick", "upvote(" + postNumber + ")");
		bar.children[1].innerHTML = post.upvotes;
		bar.children[2].innerHTML = post.date;

		if (posts[postNumber].person == "User") {
			shareInfo.innerHTML = "Shared with: ";
			for (var i = 0; i < posts[postNumber].share.length-1; i++) {
				shareInfo.innerHTML += posts[postNumber].share[i]+", ";
			}
			shareInfo.innerHTML += posts[postNumber].share[i]+".";
		} else {
			shareInfo.innerHTML = "";
		}

		comments.innerHTML = "";
		for (var i = post.comments.length - 1; i >= 0; i--) {
			comments.innerHTML += 	"<div class='comment'>\
										<div class='header'>\
											<img src=" + people[post.comments[i].person].pic + "\
											 	onclick='openProfile(\"fullPost\",\"" + post.comments[i].person + "\")'>\
											<p onclick='openProfile(\"fullPost\",\"" + post.comments[i].person + "\")'>\
												" + post.comments[i].person + "</p>\
										</div>\
										<div class='commentBody'>\
											<p>" + post.comments[i].message + "</p>\
										</div>\
									</div>";
		}
	}

	function tryDeletePost(postNumber) {
		var popup = document.getElementsByClassName("verifyDelete")[0];
		var btnyes = popup.children[0].children[2];

		btnyes.setAttribute("onclick", "deletePost("+postNumber+")");
		showPage("verifyDelete");
	}

	function deletePost(postNumber) {
		var name = posts[postNumber].person;
		posts.splice(postNumber, 1);
		localStorage.posts7 = JSON.stringify(posts);

		fillPostPreviews();
		fillProfile(name);
		goBack();
		goBack();
	}

	function openFriendList() {
		var friendList = document.getElementsByClassName("friendList")[0];
		var cont = friendList.children[0];
		cont.scrollTop = 0;

		fillFriendsList();
		switchPages("shareApp", "friendList");
	}

	function fillFriendsList() {
		var friendList = document.getElementsByClassName("friendList")[0];
		var container = friendList.children[0].children[0];
		var friend;

		container.innerHTML = "";
		for (friend in people) {
			if (friend == "User") {
				continue;
			}
			container.innerHTML += 	"<div class='personListItem' onclick='openProfile(\"friendList\",\"" + friend + "\")'>\
										<img src=" + people[friend].pic + ">\
										<p>" + friend + "</p>\
									</div>";
		}
	}

	function openProfile(currentPageName, personName) {
		var profile = document.getElementsByClassName("profile")[0];
		var cont = profile.children[0];
		cont.scrollTop = 0;

		fillProfile(personName);
		switchPages(currentPageName, "profile");
	}

	function fillProfile(name) {
		var n = 4;
		var profile = document.getElementsByClassName("profile")[0];
		var cols = profile.children[0].children;
		var header = profile.children[0].children[0].children[0];
		var quoteDiv = profile.children[0].children[1];
		var arrow = profile.children[0].children[2];
		header.children[0].src = people[name].pic;
		header.children[1].innerHTML = name;
		/*header.children[2].innerHTML = people[name].quote;*/
		quoteDiv.children[0].innerHTML = people[name].quote;
		quoteDiv.style.transitionDelay = "-1s";
		arrow.style.transitionDelay = "-1s";
		quoteDiv.style.maxHeight = "0px";
		arrow.style.transform = "rotate(180deg)";
		if (name == "User") {
			arrow.style.visibility = "hidden";
		} else {
			arrow.style.visibility = "";
		}

		cols[3].innerHTML = "";
		cols[4].innerHTML = "";
		for (var i = posts.length - 1; i >= 0; i--) {
			if (posts[i].person==name) {
				cols[n].innerHTML += 
							"<div class='postPreview' onclick='showPost(\"" + i + "\", \"profile\")'>\
								<img src=" + posts[i].image + ">\
							</div>";
				/*n = n%2+1;*/
				/*n = (n-1)%2+2;*/
				n = (n-2)%2+3;
			}
		}
	}

	function expandQuote() {
		var profile = document.getElementsByClassName("profile")[0];
		var quoteDiv = profile.children[0].children[1];
		var arrow = profile.children[0].children[2];
		if (quoteDiv.style.maxHeight == "0px") {
			quoteDiv.style.transitionDelay = "0ms";
			arrow.style.transitionDelay = "0ms";
			quoteDiv.style.maxHeight = "100px";
			arrow.style.transform = "rotate(0deg)";
		} else {
			quoteDiv.style.maxHeight = "0px";
			arrow.style.transform = "rotate(180deg)";
		}
	}

	function openCam() {
		var cam  = document.getElementsByClassName("camApp")[0];
		var img = cam.children[0].children[0];
		var shutter = cam.children[1].children[1];
		var srcImg = myPosts[Math.floor((Math.random() * (myPosts.length-1)))];

		img.src = srcImg;
		shutter.setAttribute("onclick", "openPublishMenu('" + srcImg + "')");

		switchPages("shareApp", "camApp");
	}

	function openPublishMenu(srcImg) {
		var img = document.getElementsByClassName("publishImg")[0];
		var bar = document.getElementsByClassName("choiceBar")[0];
		var arrow = bar.previousElementSibling;

		shareSelection = [];
		shareSelectionTmp = [];
		img.src = srcImg;

		bar.style.transitionDelay = "-1s";
		arrow.style.transitionDelay = "-1s";
		bar.style.bottom = "-40px";
		arrow.style.bottom = "5px";
		arrow.style.transform = "rotate(0deg)";

		selectOpt(0);
		fillSpecificSelection();
		switchPages("camApp", "publishMenu");
	}

	function fillSpecificSelection() {
		var sendToList = document.getElementsByClassName("sendToSpecific")[0];
		var menu = document.getElementsByClassName("publishMenu")[0];

		var container = sendToList.children[0].children[0];
		var friend;

		container.innerHTML = "";
		for (friend in people) {
			if (friend != "User") {
				container.innerHTML += 	"<div class='personListItem' onclick='selectFriend(this)'>\
											<img src=" + people[friend].pic + ">\
											<p>" + friend + "</p>\
										</div>";
			}
		}
	}

	function toggleChoiceBar() {
		var bar = document.getElementsByClassName("choiceBar")[0];
		var arrow = bar.previousElementSibling;
		if (bar.style.bottom == "-40px") {
			bar.style.transitionDelay = "0s";
			arrow.style.transitionDelay = "0s";
			bar.style.bottom = "8px";
			arrow.style.bottom = "53px";
			arrow.style.transform = "rotate(180deg)";
		} else {
			bar.style.bottom = "-40px";
			arrow.style.bottom = "5px";
			arrow.style.transform = "rotate(0deg)";
		}
	}

	function selectOpt(n) {
		var bar = document.getElementsByClassName("choiceBar")[0];
		var tds = bar.children[0].children[0].children;

		if (n == 2) {
			openSendToSpecific();
		} else {
			if (n == 0) {shareSelection = ["All"]}
			if (n == 1) {shareSelection = ["Friends"]}
				
			for (var i = 0; i < tds.length; i++) {
				tds[i].style.backgroundColor = "white";
				tds[i].style.color = "black";
			}
			tds[n].style.backgroundColor = "#2379d8";
			tds[n].style.color = "white";
		}
	}

	function openSendToSpecific() {
		var sendToList = document.getElementsByClassName("sendToSpecific")[0];

		var items = sendToList.children[0].children[0].children;

		if (shareSelection[0] == "All" || shareSelection[0] == "Friends") {
			shareSelectionTmp = [];
		} else {
			shareSelectionTmp = shareSelection.slice(0); /*clone*/
		}

		for (var i=0; i < items.length; i++) {
			var name = items[i].children[1].innerHTML;
			if (shareSelectionTmp.includes(name)) {
				items[i].style.backgroundColor = "#86b5f2";
			} else {
				items[i].style.backgroundColor = "transparent";
			}
		}
		switchPages("publishMenu", "sendToSpecific");
	}

	function selectFriend(listItem) {
		var name = listItem.children[1].innerHTML;
		if (!shareSelectionTmp.includes(name)) {
			listItem.style.backgroundColor = "#86b5f2";
			shareSelectionTmp.push(name);
		} else {
			listItem.style.backgroundColor = "transparent";
			shareSelectionTmp.splice(shareSelection.indexOf(name), 1);
		}
	}

	function acceptSelectedFriends() {
		if (shareSelectionTmp.length == 0) {return;}

		shareSelection = shareSelectionTmp.slice(0); /*clone*/

		var bar = document.getElementsByClassName("choiceBar")[0];
		var tds = bar.children[0].children[0].children;

		for (var i = 0; i < tds.length; i++) {
			tds[i].style.backgroundColor = "white";
			tds[i].style.color = "black";
		}
		tds[2].style.backgroundColor = "#2379d8";
		tds[2].style.color = "white";

		goBack();
	}

	function publishPost() {
		var img = document.getElementsByClassName("publishImg")[0];
		var d = new Date();
		var newPost = 	{
							person: "User",
							place: "",
							image: img.src,
							upvotes: 0,
							upvoted: false,
							date: d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear(),
							share: shareSelection.slice(0),
							comments: []
						}

		posts.push(newPost);
		localStorage.posts7 = JSON.stringify(posts);

		fillPostPreviews();

		var app = document.getElementsByClassName("shareApp")[0];
		var cont = app.children[0];
		cont.scrollTop = 0;

		goBack();
		goBack();
	}

	function upvote(postNumber) {
		var postPage = document.getElementsByClassName("fullPost")[0];
		var bar = postPage.children[0].children[0].children[2];
		if (!posts[postNumber].upvoted) {
			bar.children[0].src = "../img/icons/up-arrow-full.svg";
			posts[postNumber].upvotes++;
			posts[postNumber].upvoted = true;
		} else {
			bar.children[0].src = "../img/icons/up-arrow.svg";
			posts[postNumber].upvotes--;
			posts[postNumber].upvoted = false;
		}
		localStorage.posts7 = JSON.stringify(posts);
		bar.children[1].innerHTML = posts[postNumber].upvotes;
	}

/*=================================================*/


/* ================= TICKETAPP ====================*/

	function selectTab(n) {
		var app = document.getElementsByClassName("ticketApp")[0];
		var tabs = document.getElementsByClassName("tab");
		var content = app.children[1];
		var places = tickets[n].places;

		if (tabs[n].classList.contains("tabSelected")) {
			return;
		}

		for (var i = 0; i < tabs.length; i++) {
			tabs[i].classList.remove("tabSelected");
		}
		tabs[n].classList.add("tabSelected");

		content.innerHTML="";
		for (var i = 0; i < places.length; i++) {
			var open = (places[i].open / 100).toFixed(2).split(".");
			var close = (places[i].close / 100).toFixed(2).split(".");
			content.innerHTML += 	"<div class=\"ticketPreview\" onclick='openFullTicket("+ n + "," + i + ", \"ticketApp\")'>\
										<img src=\"" + places[i].img + "\">\
										<div class=\"info\">\
											<p class=\"title\">" + places[i].name + "</p>\
										</div>\
									</div>";
			if (tickets[n].type != "transports")
				content.getElementsByClassName("info")[i].innerHTML += "<p class=\"schedule\">" + open[0] + ":" 
					+ open[1] + "-" + close[0] + ":" + close[1] + "</p>";
			else
				content.getElementsByClassName("info")[i].innerHTML += "<p class=\"timeAway\">" + places[i].timeAway + " min. away</p>";
			content.getElementsByClassName("info")[i].innerHTML += "<p class=\"price\">" + places[i].price + "€</p>";
		}
		content.scrollTop = 0;
	}

	var globalType;
	var globalPlace;
	function openFullTicket(type, place, app) {
		globalType = type;
		globalPlace = place;
		var colors = ["#e04242", "#e04242", "#e04242", "#f08130", "#18b44b", "#18b44b"];

		var page = document.getElementsByClassName("fullTicket")[0];
		var container = page.children[0].children[0];
		var ticket = tickets[type].places[place];

		var pin = $("#"+ticket.id)[0];
		var path = calcPath(pin);
		var info = calcPathInfo(path);
		updateTicketInfo(type, place, info)

		if (type == 0 || type == 1) {
			var open = (ticket.open / 100).toFixed(2).split(".");
			var close = (ticket.close / 100).toFixed(2).split(".");
		}
		container.innerHTML = 	"<p class=\"title\">" + ticket.name +"</p>\
								<div class=\"duo\">\
									<div class=\"imgContainer\">\
										<img class=\"pic\" src="+ ticket.img +">\
									</div>\
									<div class=\"score\" style='background-color:"+colors[Math.round(ticket.score)]+"'>\
										<img src=\"../img/icons/favourites-filled-star-symbol.svg\">\
										<p>Score:</p>\
										<p>"+ ticket.score + "</p>\
									</div>\
								</div>\
								<p class=\"price\">" + ticket.price.toFixed(2) +"€/un.</p>";

		if (type == 0 || type == 1) {
			container.innerHTML += "<div class=\"eventBox\">\
										<img src=\"../img/icons/time-left.svg\">\
										<p class=\"openHours\"><strong>Open:</strong> " + open[0] + ":" + open[1] + "-" + close[0] + ":" + close[1] + "</p>\
										<p class=\"duration\"><strong>Duration:</strong> " + ticket.duration + " min.</p>\
									</div>";
		}

		else {
			container.innerHTML += "<div class=\"eventBox\">\
										<img src=\"../img/icons/time-left.svg\">\
										<p class=\"openHoursTransports\"><strong>Open:</strong> " + ticket.open + "-" + ticket.close + "</p>\
									</div>";
		}

		container.innerHTML += "<div class=\"routeBox\">\
									<img src=\"../img/icons/footprint.svg\">\
									<p class=\"distance\"><strong>Distance:</strong> " + ticket.distance + "</p>\
									<p class=\"travelTime\"><strong>Time:</strong> " + ticket.timeAway + "</p>\
								</div>\
								<div class=\"rateTicket\">\
									<p>Rate:</p>\
									<img id=\"star1\" src=\"../img/icons/star-of-favorites-outline.svg\" onclick='rateTicket(" + type + ", " + place + "," + 1 + ")'>\
									<img id=\"star2\" src=\"../img/icons/star-of-favorites-outline.svg\" onclick='rateTicket(" + type + ", " + place + "," + 2 + ")'>\
									<img id=\"star3\" src=\"../img/icons/star-of-favorites-outline.svg\" onclick='rateTicket(" + type + ", " + place + "," + 3 + ")'>\
									<img id=\"star4\" src=\"../img/icons/star-of-favorites-outline.svg\" onclick='rateTicket(" + type + ", " + place + "," + 4 + ")'>\
									<img id=\"star5\" src=\"../img/icons/star-of-favorites-outline.svg\" onclick='rateTicket(" + type + ", " + place + "," + 5 + ")'>\
								</div>";
		

		var cont = page.children[0];
		cont.scrollTop = 0
		var buyBtn = page.children[1].children[2];
		var locationBtn = page.children[1].children[1];
		buyBtn.setAttribute("onclick", "openBuyTicket("+type+","+place+")")
		fillStars(type, place);
		locationBtn.setAttribute("onclick", "getDirectionsTo()");
		if (user.nav != null) 
			locationBtn.setAttribute("onclick", "showPage('cancelNav')");
		if (app == "cartPage" || app == "receiptPage") {
			buyBtn.classList.add("hidden");
			locationBtn.style.transform = "translate(0px,56px)";
		} else {
			buyBtn.classList.remove("hidden");
			locationBtn.style.transform = "translate(0px, 0px)";
		}
		switchPages(app, "fullTicket");
	}

	function rateTicket(type, place, rate) {
		var ticket = tickets[type].places[place];
		if (ticket.rate == rate) {
			ticket.rate = 0;
			showNotif("Rating removed");
		} else {
			if (ticket.rate == 0) {
				showNotif("Rating added");
			} else {
				showNotif("Rating changed");
			}
			ticket.rate = rate;
		}
		localStorage.tickets7 = JSON.stringify(tickets);
		fillStars(type, place);
	}

	function fillStars(type, place) {
		var ticket = tickets[type].places[place];

		for (var i = 1; i <= 5; i++) {
			var starID = "star" + i;
			var star = document.getElementById(starID);
			if (i <= ticket.rate) {
				star.src = "../img/icons/favourites-filled-star-symbol-orange.svg";
			} else {
				star.src = "../img/icons/star-of-favorites-outline.svg";
			}
		}
	}

	function openBuyTicket(type, place) {
		var popup = document.getElementsByClassName("buyTicket")[0];
		var minusBtn = popup.children[0].children[1];
		var value = popup.children[0].children[2];
		var plusBtn = popup.children[0].children[3];
		var priceTxt = popup.children[0].children[4];
		var addBtn = popup.children[0].children[6];
		var price = tickets[type].places[place].price;
		var ticket = tickets[type].places[place];
		value.innerHTML = "1";
		if (ticket.cart > 0) {
			value.innerHTML = ticket.cart;
		}
		minusBtn.setAttribute("onclick", "minusTicket(this,"+price+"," +type+","+place+",\"buyTicket\")");
		plusBtn.setAttribute("onclick", "plusTicket(this,"+price+"," +type+","+place+",\"buyTicket\")");
		addBtn.setAttribute("onclick", "addToCart("+type+","+place+");showNotif('Added to cart.&#8194<span onclick=\"openCart()\">open</span>');");
		plusBtn.classList.remove("inactiveBtn");
		minusBtn.classList.add("inactiveBtn");
		priceTxt.innerHTML = price.toFixed(2) + "€";
		if(ticket.cart>0){
			minusBtn.classList.remove("inactiveBtn");
			priceTxt.innerHTML = price.toFixed(2)*ticket.cart + "€";
		}
		if (ticket.cart == 10) {
			plusBtn.classList.add("inactiveBtn");
		}
		showPage("buyTicket");
	}

	function minusTicket(minusBtn, price, type, place, app) {
		var value = minusBtn.nextElementSibling;
		var priceTxt = value.nextElementSibling.nextElementSibling;
		var n = parseInt(value.innerHTML);
		var plusBtn = value.nextElementSibling;
		value.innerHTML = --n;

		if (n == 9) {
			plusBtn.classList.remove("inactiveBtn");
		}
		if (n == 1) {
			minusBtn.classList.add("inactiveBtn");
		}
		if (app == "cartPage") {
			tickets[type].places[place].cart = n;
			localStorage.tickets7 = JSON.stringify(tickets);
			var page = document.getElementsByClassName("cartPage")[0];
			var val = page.getElementsByClassName("total")[0];
			var num = parseFloat(val.innerHTML.split(" ")[1]);
			console.log(num);
			num -= price;
			val.innerHTML = "Total: " + num.toFixed(2) + "€";
		}
		priceTxt.innerHTML = (n*price).toFixed(2) + "€";
	}

	function plusTicket(plusBtn, price, type, place, app) {
		var priceTxt = plusBtn.nextElementSibling;
		var value = plusBtn.previousElementSibling;
		var minusBtn = value.previousElementSibling;
		var n = parseInt(value.innerHTML);
		var ticket = tickets[type].places[place].cart;
		value.innerHTML = ++n;

		if (n > 1) {
			minusBtn.classList.remove("inactiveBtn");
		}
		if (app == "cartPage") {
			tickets[type].places[place].cart = n;
			localStorage.tickets7 = JSON.stringify(tickets);
			var page = document.getElementsByClassName("cartPage")[0];
			var val = page.getElementsByClassName("total")[0];
			var num = parseFloat(val.innerHTML.split(" ")[1]);
			num += price;
			val.innerHTML = "Total: " + num.toFixed(2) + "€";
		}
		if (n == 10) {
			plusBtn.classList.toggle("inactiveBtn");
		}
		priceTxt.innerHTML = (n*price).toFixed(2) + "€";
	}

	function addToCart(type, place) {
		var popup = document.getElementsByClassName("buyTicket")[0];
		var n = parseInt(popup.children[0].children[2].innerHTML);


		tickets[type].places[place].cart = n;
		localStorage.tickets7 = JSON.stringify(tickets);
		

		updateCartDot();
		goBack();
		goBack();
	}

	function updateCartDot() {
		var btn = document.getElementsByClassName("btnCart")[0];
		var dot = btn.children[1];
		for (var i = 0; i < tickets.length; i++) {
			for (var j = 0; j < tickets[i].places.length; j++) {
				var place = tickets[i].places[j];
				if (place.cart > 0) {
					dot.style.visibility = "visible";
					return;
				}
			}
		}
		dot.style.visibility = "hidden";
	}

	function openCart() {
		var cart = document.getElementsByClassName("cartPage")[0];
		var content = cart.children[0];
		content.scrollTop = 0;

		fillCart();
		switchPages(pageHistory[pageHistory.length-1], "cartPage");
	}

	function fillCart() {
		var cart = document.getElementsByClassName("cartPage")[0];
		var content = cart.children[0];
		var total = 0;
		content.innerHTML = "";
		for (var i = 0; i < tickets.length; i++)
			for (var j = 0; j < tickets[i].places.length; j++){
				var place = tickets[i].places[j];
				if (place.cart == 1) {
					content.innerHTML += "<div class=\"cartItem\">\
											<img class=\"delete\" src=\"../img/icons/close-cross.png\" onclick='tryDeleteCart(" + i + ", " + j + ", this.parentNode)'>\
											<div class=\"itemInfo\">\
												<p class=\"title\" onclick='openFullTicket(" + i + "," + j + ", \"cartPage\")'>" + place.name + "</p>\
												<img class=\"valueBtn inactiveBtn minus\" src=\"../img/icons/minus-big-symbol.svg\" onclick='minusTicket(this," + place.price + "," +i+","+j+", \"cartPage\")'>\
												<p class=\"value\">" + place.cart + "</p>\
												<img class=\"valueBtn plus\" src=\"../img/icons/addition-sign.svg\" onclick='plusTicket(this," + place.price + "," +i+","+j+ ", \"cartPage\")'>\
												<p class=\"price\">" + (place.price*place.cart).toFixed(2) + "€</p>\
											</div>\
										</div>";
				} else if(place.cart < 10 && place.cart > 1){
					content.innerHTML += "<div class=\"cartItem\">\
											<img class=\"delete\" src=\"../img/icons/close-cross.png\" onclick='tryDeleteCart(" + i + ", " + j + ", this.parentNode)'>\
											<div class=\"itemInfo\">\
												<p class=\"title\" onclick='openFullTicket(" + i + "," + j + ", \"cartPage\")'>" + place.name + "</p>\
												<img class=\"valueBtn minus\" src=\"../img/icons/minus-big-symbol.svg\" onclick='minusTicket(this," + place.price + "," +i+","+j+", \"cartPage\")'>\
												<p class=\"value\">" + place.cart + "</p>\
												<img class=\"valueBtn plus\" src=\"../img/icons/addition-sign.svg\" onclick='plusTicket(this," + place.price + "," +i+","+j+", \"cartPage\")'>\
												<p class=\"price\">" + (place.price*place.cart).toFixed(2) + "€</p>\
											</div>\
										</div>";
				} else if(place.cart==10){
					content.innerHTML += "<div class=\"cartItem\">\
											<img class=\"delete\" src=\"../img/icons/close-cross.png\" onclick='tryDeleteCart(" + i + ", " + j + ", this.parentNode)'>\
											<div class=\"itemInfo\">\
												<p class=\"title\" onclick='openFullTicket(" + i + "," + j + ", \"cartPage\")'>" + place.name + "</p>\
												<img class=\"valueBtn minus\" src=\"../img/icons/minus-big-symbol.svg\" onclick='minusTicket(this," + place.price + "," +i+","+j+", \"cartPage\")'>\
												<p class=\"value\">" + place.cart + "</p>\
												<img class=\"valueBtn plus inactiveBtn\" src=\"../img/icons/addition-sign.svg\" onclick='plusTicket(this," + place.price + "," +i+","+j+", \"cartPage\")'>\
												<p class=\"price\">" + (place.price*place.cart).toFixed(2) + "€</p>\
											</div>\
										</div>";
				}
				total += place.cart*place.price;
			}

		if (content.innerHTML == "") {
			content.innerHTML = "<p class=\"noItems\">No items have yet been added to the cart.</p>"
		} else {
			content.innerHTML += 	"<p class=\"total\">Total: " + total.toFixed(2) + "€</p>\
									<p class=\"checkout\" onclick='tryCheckout()'>Checkout</p>";
		}
	}

	function tryDeleteCart(type, place, item) {
		var popup = document.getElementsByClassName("verifyRemove")[0];
		var btnyes = popup.children[0].children[2];

		showPage("verifyRemove");
		btnyes.onclick = function() { 
			deleteCart(type, place, item); 
		}
	}

	function deleteCart(type, place, item){
		tickets[type].places[place].cart = 0;
		localStorage.tickets7 = JSON.stringify(tickets);
		fillCart();
		updateCartDot();
		goBack();
	}

	function tryCheckout() {
		switchPages("cartPage", "paymentPage");
	}

	function tryNewCard() {
		if (connects.bluetooth == false) {
			showNotif("Turn on bluetooth:&#8194;"+appendNotifSlider("bluetooth"));
		} else {
			showPage('newCard');
		}
	}

	function choosePay(card) {
		var popup = document.getElementsByClassName("verifyCheckout")[0];
		var p = popup.children[0].children[0];
		p.innerHTML = "Purchase items with "+card+"?";

		showPage("verifyCheckout");
	}

	function checkout() {
		var div = document.getElementsByClassName("round")[0];
		div.style.transform = 'translateY(-50%) scale(1)';
		var screen = document.getElementsByClassName("screen")[0];
		screen.style["pointer-events"] = "none";
		var circle = div.children[0];
		var p = div.children[2];

		p.innerHTML = "0%";

		circle.style.transitionDelay = "-1s";
		circle.style.borderWidth = "0px";

		p.style.color = "black";


		var canvas = document.getElementById("progressBar");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		/*drawBar("progressBar", 100);*/
		setTimeout(loading, 600, p, 1);
	}

	function loading(p, n) {
		p.innerHTML = n+"%";
		drawBar("progressBar", n);
		if (n < 100) {
			setTimeout(loading, 10, p, n+1);
		}
		if (n == 100) {
			var div = document.getElementsByClassName("round")[0];
			var circle = div.children[0];
			circle.style.transitionDelay = "0s";
			circle.style.borderWidth = "81px";
			p.style.color = "transparent";

			setTimeout(endLoading, 1500);
		}
	}

	function drawBar(id, percent) {
		var canvas = document.getElementById("progressBar");
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineWidth = 20;
		ctx.strokeStyle = "#18ab5c";
		ctx.arc(90, 90, 70, -0.5 * Math.PI, ((2*percent)/100-0.5) * Math.PI);
		ctx.stroke();
	}

	function endLoading() {
		var div = document.getElementsByClassName("round")[0];
		div.style.transform = "translateY(-50%) scale(0)";
		var screen = document.getElementsByClassName("screen")[0];
		screen.style["pointer-events"] = "auto";

		saveBuy();
		showNotif("Purchase Complete");
		updateCartDot();
		goBack();
	}

	function saveBuy() {
		var d = new Date();
		var total = 0;
		var items = [];

		for (var i = 0; i < tickets.length; i++) {
			for (var j = 0; j < tickets[i].places.length; j++) {
				var n = tickets[i].places[j].cart;
				if (n > 0) {
					items.push({
									type: i,
									place: j,
									tickets: n
								});
					total += n*tickets[i].places[j].price;
					tickets[i].places[j].cart = 0;
				}
			}
		}

		bought.push({
						date: twoDigit(d.getDate())+"-"+twoDigit(d.getMonth())+"-"+d.getFullYear(),
						time: twoDigit(d.getHours())+"h"+twoDigit(d.getMinutes())/*+":"+twoDigit(d.getSeconds())*/,
						items: items,
						total: total
					});

		localStorage.tickets7 = JSON.stringify(tickets);
		localStorage.bought7 = JSON.stringify(bought);
	}

	function twoDigit(n) {
	    return n < 10 ? "0"+n : ""+n;
	}

	function openReceiptPage() {
		fillReceipts();
		switchPages("ticketApp", "receiptPage");
	}

	function fillReceipts() {
		var page = document.getElementsByClassName("receiptPage")[0];
		if (bought.length == 0) {
			page.children[0].innerHTML = "<p class=\"noItems\"> No items have been bought yet </p>";
		} else {
			page.children[0].innerHTML = "<div class=\"container\">\
										</div>";
			var container = page.children[0].children[0];
			container.innerHTML = "";
		}
		for (var i = bought.length-1; i >= 0; i--) {
			var purchase = bought[i];
			container.innerHTML += 
						"<div class=\"receipt\">\
							<div class=\"header\" onclick='expandItems("+(bought.length-1-i)+")'>\
								<img src=\"../img/icons/chevron-arrow-up.png\">\
								<p>&#8194;" + purchase.date + "&#8194;" + purchase.time + "</p>\
								<p class=\"price\">" + purchase.total.toFixed(2) + "€</p>\
							</div>\
							<div class=\"items\">\
								<div class=\"item\">\
								</div>\
							</div>\
						</div>"
		
			var items = container.lastElementChild.children[1];
			items.innerHTML = "";
			for (var j = 0; j < purchase.items.length; j++) {
				var type = purchase.items[j].type;
				var place = purchase.items[j].place;
				var ticket = tickets[type].places[place];
				var price = ticket.price*purchase.items[j].tickets;

				items.innerHTML +=
							"<div class=\"item\">\
								<p class=\"value\">" + purchase.items[j].tickets + "</p>\
								<p class=\"name\" onclick=\"openFullTicket("+purchase.items[j].type+","+ purchase.items[j].place+",'receiptPage')\">" + ticket.name + "</p>\
								<p class=\"price\">" +  price.toFixed(2) + "€</p>\
							</div>";
			}

		}
		openedItems = -1;
	}

	function expandItems(n) {
		if (openedItems != -1) {
			toggleItems(openedItems, false);
		}

		if (n != openedItems) {
			toggleItems(n, true);
			openedItems = n;
		} else {
			openedItems = -1;
		}
	}

	function toggleItems(n, open) {
		var page = document.getElementsByClassName("receiptPage")[0];
		var container = page.children[0].children[0];
		var receipt = container.children[n];
		var arrow = receipt.children[0].children[0];
		var items = receipt.children[1];

		if (open) {
			arrow.style.transform = "rotate(180deg)";
			items.style.maxHeight = items.children.length*35 + 20+"px";
		} else {
			arrow.style.transform = "rotate(90deg)";
			items.style.maxHeight = "0px";
		}
	}

/*=================================================*/


/* =================== MAPAPP =====================*/

	var menuIcon = "../img/icons/menu-button-of-three-horizontal-lines.svg";
	var open = false;

	function openMapMenu(btn) {
		var menu = document.getElementsByClassName("mapMenu")[0];
		if (!open) {
			open =  true;
			btn.src = "../img/icons/menu-button-of-three-horizontal-lines.svg";
		}
		else if (open) {
			open = false;
			btn.src = menuIcon;
		}

		menu.classList.toggle("openMapMenu");
		btn.classList.toggle("openTrigger");
	}

	var mapPinsActive = [];

	function selectMapOpt(n) {
		var menu = document.getElementsByClassName("mapMenu")[0];

		if (menu.children[n].classList.contains("selectedMapBtn")) {
			mapPinsActive.splice(mapPinsActive.indexOf(n),1);
			$("#map .opt" + n).css("visibility", "hidden");
			menu.children[n].classList.remove("selectedMapBtn");
		} else {
			if (mapPinsActive.length == 0) {
				$("#map .pin").css("visibility", "hidden");
			}
			mapPinsActive.push(n);
			$("#map .opt" + n).css("visibility", "inherit");
			menu.children[n].classList.add("selectedMapBtn");
		}

		if (mapPinsActive.length == 0) {
			$("#map .pin").css("visibility", "inherit");
		}

		if (mapPinsActive.length == 1) {
			menuIcon = menu.children[mapPinsActive[0]].children[0].src;
		} else {
			menuIcon = "../img/icons/menu-button-of-three-horizontal-lines.svg";
		}
	}

	function openSidePanel(type, place, pin) {
		var panel = document.getElementsByClassName("sidePanel")[0];
		fillSidePanel(type, place, pin);
		panel.style.visibility = "visible";
		panel.style.left = "0px";
		if (open) {
			openMapMenu(document.getElementsByClassName("trigger")[0]);
		}	
	}

	function closeSidePanel() {
		var panel = document.getElementsByClassName("sidePanel")[0];
		panel.style.left = "-170px";
	}

	var mapPlace;
	var mapType;
	function callForTable() {
		if (connects.bluetooth == false) {
			showNotif("Turn on bluetooth:&#8194;"+appendNotifSlider("bluetooth"));
			return;
		}
		var name = restaurants[mapPlace].name;
		var popup = document.getElementsByClassName("callForTable")[0];
		var p = popup.children[0].children[0];
		p.innerHTML = "Do you want to call "+name+" to get a table?";
		showPage("callForTable");
	}


	
	function fillSidePanel(type, place, pin) {
		mapPlace = place;
		mapType = type;
		var itemTitle;
		var pic;
		var panel = document.getElementsByClassName("sidePanel")[0];
		var more = panel.getElementsByClassName("moreBtn")[0];
		var direction = panel.getElementsByClassName("directionsBtn")[0];

		direction.setAttribute("onclick", "startNavigate('"+pin.id+"')");

		if (type >= 0) {
			more.innerHTML = "More+";
			var item = tickets[type].places[place];
			if (item.name == "Bus Ticket") {
				itemTitle = "Bus Station";
			}
			else if (item.name == "Subway Ticket") {
				itemTitle = "Subway Station";
			}
			else {
				itemTitle = item.name;
			}
			pic = item.img;
			more.setAttribute("onclick", "openPlaceInfo()");
		}

		else if (type == -1) {		// friends
			more.innerHTML = "More+";
			itemTitle = place;
			pic = people[itemTitle].pic;
			more.setAttribute("onclick", "openPlaceInfo()");
		}

		else if (type == -2) {		// restaurants
			more.innerHTML = "Get Table";
			var item = restaurants[place];
			itemTitle = item.name;
			pic = item.img; 
			more.setAttribute("onclick", "callForTable()");
		}

		var title = panel.getElementsByClassName("title")[0];
		title.innerHTML = itemTitle;
		var previewPic = document.getElementsByClassName("previewPic")[0];
		previewPic.src = pic;
		/*more.style.visibility = "visible";*/
	}

	function openPlaceInfo() {
		if (mapType >= 0) {
			openFullTicket(mapType, mapPlace, "mapApp");
		}

		else if (mapType == -1) {
			openProfile("mapApp", mapPlace);
		}
		/*var panel = document.getElementsByClassName("sidePanel")[0];
		panel.style.visibility = "hidden";*/
	}


	function validateWalk(direction) {
		if (user.x <= 1745) {
			user.x = 1745;
		}
		if (user.x >= 5197) {
			user.x = 5197;
		}
		if (user.y <= 4240) {
			user.y = 4240;
		}
		if (user.y >= 5975) {
			user.y = 5975;
		}
	}

	function togglePadBtn(direction, on) {
		var val = on ? "visible":"hidden";
		switch(direction) {
			case "up":
				$("#arrowPad:nth.child(1)")[0].style.visibility = val;
				break;
			case "down":
				$("#arrowPad:nth.child(4)")[0].style.visibility = val;
				break;
			case "left":
				$("#arrowPad:nth.child(2)")[0].style.visibility = val;
				break;
			case "right":
				$("#arrowPad:nth.child(3)")[0].style.visibility = val;
				break;
		}
	}


	var mapObj;
	var streets = {
		x: [1745,1862,1993,2114,2231,2361,2494,2614,2738,2854,2974,3093,3214,3337,3465,3591,3711,3835,3960,4086,4209,4333,4458,4581,4705,4829,4942,5063,5197],
		y: [4240, 4656, 5073, 5495, 5975]
	}
	var user = {x: streets.x[13], y: 5420, angle: 0, interval: null, nav: null};

	function updateUserPos() {
		var arrow = $("#userArrow")[0];
		arrow.style.left = (user.x-arrow.clientWidth/2)+"px";
		arrow.style.top = (user.y-arrow.clientHeight/2)+"px";
		arrow.style.transform = "rotate("+user.angle+"deg)";
	}

	function mapload() {
		mapObj = panzoom(document.getElementById("map"), {
			bounds:true, 
			boundsPadding:0, 
			maxZoom: 1, 
			minZoom: 0.05,
			zoomSpeed: 0.12,
			disableKeyboardInteraction: true
		});

		initPathCanvas();
		updateUserPos();
		focusOn($("#userArrow")[0], true, 0.4);

		$(".opt3").css("display", "none");
		setTimeout(personShowLocation, 15000, "Jon");

		mapObj.on('zoom', adjustPinsSize);
	}

	function personShowLocation(name) {
		if (pageHistory.length < 2) {
			setTimeout(personShowLocation, 2000, name);
		} else if ($(".notif:first")[0].style.visibility != "visible") {
			$("#"+name).css("display", "initial");
			showNotif(name+" shared his location");
			if (name == "Jon") {
				setTimeout(personShowLocation, 25000, "Tony");
			}
		} else {
			setTimeout(personShowLocation, 1000, name);
		}
	}

	var pinClick = {x: 0, y: 0};

	function pinTryClick() {
		pinClick.x = event.clientX;
		pinClick.y = event.clientY;
	}

	function pinEvalClick(param1, param2, pin) {
		if (pinClick.x == event.clientX && pinClick.y == event.clientY) {
			openSidePanel(param1, param2, pin);
			focusOn(pin, true);
		}
	}

	function manualchangeScale(scale) {
		var transform = mapObj.getTransform();
		transform.scale = scale;
		$("#map")[0].style.transformOrigin = '0 0 0';
	    $("#map")[0].style.transform = 'matrix(' +
	      transform.scale + ', 0, 0, ' +
	      transform.scale + ', ' +
	      transform.x + ', ' + transform.y + ')';

	    adjustPinsSize();
	}

	function adjustPinsSize() {
		var scale = Math.min(Math.max(1/mapObj.getTransform().scale*0.4, 0.7), 2.2);
		$(".pin").css("transform", "scale("+scale+")");
	}


	function focusOn(element, smooth, scale) {
		if (scale != undefined && scale > 0) {
			manualchangeScale(scale);
		}

		var elementBox = element.getBoundingClientRect();
		var viewBox = $('#mapWrapper')[0].getBoundingClientRect();
		var mapBox = $("#map")[0].getBoundingClientRect();
		var inMap = {
			x: elementBox.left + elementBox.width/2 - mapBox.left,
			y: elementBox.top + elementBox.height/2 - mapBox.top
		};
		var pos = {
			x: inMap.x - viewBox.width/2,
			y: inMap.y - viewBox.height/2
		};
		mapObj.pause();
		mapObj.resume();
		if (smooth) {
			$("#map")[0].style.transition = "transform ease 200ms";
			setTimeout( function(){$("#map")[0].style.transition = "";},200);
		}
		mapObj.moveTo(-pos.x, -pos.y);
	}

	function startWalk(direction) {
		walk(direction);
		user.interval = setInterval(walk, 30, direction);
	}

	function endWalk() {
		clearInterval(user.interval);
	}
		
	function walk(direction) {
		var speed = 10;
		var angles = {up:0, down:180, left:-90, right:90};
		var adjust = checkTurn();

		if (getUserOrientation(user.angle) != getUserOrientation(angles[direction])) {
			if (adjust==0) {
				return;
			} else {
				if (getUserOrientation(angles[direction]) == "vertical") {
					user.x = adjust;
				} else {
					user.y = adjust;
				}
			}
		}

		switch(direction) {
			case "up":
				user.y -= speed;
				break;
			case "down":
				user.y += speed;
				break;
			case "left":
				user.x -= speed;
				break;
			case "right":
				user.x += speed;
				break;
		}
		user.angle = angles[direction];

		validateWalk(direction);
		updateUserPos();
		focusOn($("#userArrow")[0], false);
		if (user.nav != null) {
			navigate(user.nav);
		}
	}

	function checkTurn() {
		var radius = 40;
		if (user.angle == 0 || user.angle == 180) {
			var coord = getCloserStreet("y", "normal");
			return Math.abs(coord - user.y) <= radius ? coord:0;
		} else {
			var coord = getCloserStreet("x", "normal");
			return Math.abs(coord - user.x) <= radius ? coord:0;
		}
	}

	function getUserOrientation(angle) {
		if (angle==0||angle==180) {
			return "vertical";
		} else {
			return "horizontal";
		}

	}

	function getCloserStreet(axis, type) {
		if (axis == "y") {
			var lst = streets.y;
			var coord = user.y;
		} else {
			var lst = streets.x;
			var coord = user.x;
		}
		for (var i = 0; i < lst.length; i++) {
			if (lst[i] == coord) {
				return lst[i];
			} else if (lst[i] > coord) {
				if (type == "ceil") {
					return lst[i];
				} else if (type == "floor"){
					return lst[i-1];
				}

				var d1 = lst[i] - coord;
				var d2 = coord - lst[i-1];
				if (d1 < d2) {
					return lst[i];
				} else {
					return lst[i-1];
				}
			}
		}
	}

	function calcPath(pin) {
		var pinPos = {x: pin.offsetLeft, y: pin.offsetTop};
		var path = [user];

		if (getUserOrientation(user.angle) == "vertical") {
			if (getPinOrientation(pinPos.x, pinPos.y) == "horizontal") {
				path.push({x: user.x, y: pinPos.y});
				path.push(pinPos);
			} else {
				if (pinPos.x == user.x) {
					path.push(pinPos);
				} else {
					var val = pinPos.y < user.y ? getCloserStreet("y", "floor") : getCloserStreet("y", "ceil");
					/*var val = getCloserStreet("y", "floor");*/
					path.push({x: user.x, y: val});
					path.push({x: pinPos.x, y: val});
					path.push(pinPos);
				}
			}
		} else {
			if (getPinOrientation(pinPos.x, pinPos.y) == "vertical") {
				path.push({x: pinPos.x, y: user.y});
				path.push(pinPos);
			} else {
				if (pinPos.y == user.y) {
					path.push(pinPos);
				} else {
					var val = pinPos.x > user.x ? getCloserStreet("x", "ceil") : getCloserStreet("x", "floor");
					/*var val = getCloserStreet("x", "floor");*/
					path.push({x: val, y: user.y});
					path.push({x: val, y: pinPos.y});
					path.push(pinPos);
				}
			}
		}

		return path;
	}

	function distance(p1, p2) {
		return Math.abs(p1.x-p2.x + p1.y-p2.y);
	}

	function checkReverse(path) {
		var p = path[1];
		if (user.angle==0 && p.y<user.y || user.angle==180 && p.y>user.y || user.angle==90 && p.x>user.x || user.angle==-90 && p.x<user.x) {
			return false;
		}
		return true;
	}

	function getTurn(path) {
		if (checkReverse(path)) {
			return "reverse";
		}
		if (path.length == 2) {
			return "straight";
		}
		if (path[2].x-path[1].x + path[2].y-path[1].y > 0) {
			if (path[1].x > user.x || path[1].y < user.y) {
				return "right";
			} else {
				return "left";
			}
		} else {
			if (path[1].x < user.x || path[1].y > user.y) {
				return "right";
			} else {
				return "left";
			}
		}
	}

	function calcPathInfo(path) {
		/*275 real meters to 422 pixels in map pic mpp = meters per pixel*/
		/*average walk speed = 5 km/h = 1.389 m/s*/
		var info = {dist: 0, time: 0, distNext: 0, turn: ""};
		var mpp = 0.65166;
		var walkSpeed = 1.389;

		info.distNext = Math.round(mpp * distance(path[0], path[1]));
		info.turn = getTurn(path);

		for (var i = 0; i < path.length-1; i++) {
			info.dist += distance(path[i], path[i+1]);
		}
		info.dist = Math.round(mpp * info.dist);
		info.time = Math.round(info.dist / walkSpeed);

		return info;
	}

	function formatDistance(dist) {
		if (dist >= 1000) {
			return Math.round(dist/100)/10+"km";
		} else if (dist >= 200) {
			return dist-dist%50+"m";
		} else if (dist >= 20) {
			return dist-dist%10+"m";
		} else {
			return dist+"m";
		}
	}

	function formatTime(time) {
		var min = Math.floor(time / 60);
		var sec = time % 60;

		if (min == 0) {
			return sec-sec%5+"s";
		} else if (min >= 20) {
			return min-min%2+"min";
		} else {
			return min+"min";
		}
	}

	function updatePathInfo(info) {
		var infoDiv = $(".navInfo:first")[0];
		var extraDiv = $(".navExtra:first")[0];

		infoDiv.children[0].innerHTML = formatDistance(info.distNext);

		infoDiv.children[1].style.transform = "";

		switch (info.turn) {
			case "straight":
				infoDiv.children[1].src = "../img/icons/up-straight-arrow.svg";
				break;
			case "reverse":
				infoDiv.children[1].src = "../img/icons/u-turn.svg";
				break;
			case "left":
				infoDiv.children[1].src = "../img/icons/arrow-angle-turning-to-right.svg";
				infoDiv.children[1].style.transform = "scaleX(-1)";
				break;
			case "right":
				infoDiv.children[1].src = "../img/icons/arrow-angle-turning-to-right.svg";
				break;
		}

		extraDiv.children[0].innerHTML = formatDistance(info.dist);
		extraDiv.children[1].innerHTML = formatTime(info.time);	
	}

	function updateTicketInfo(type, place, info) {
		var ticket = tickets[type].places[place];
		ticket.distance = formatDistance(info.dist);
		ticket.timeAway = formatTime(info.time);
	}

	function getPinOrientation(x, y) {
		for (var i = 0; i < streets.y.length; i++) {
			if (y == streets.y[i]) {
				return "horizontal";
			}
		}
		return "vertical";
		/*for (var i = 0; i < streets.x.length; i++) {
			if (x == streets.x[i]) {
				return "vertical";
			}
		}*/
	}

	function initPathCanvas() {
		/*streets.x[0], streets.y[0], streets.x[28], streets.y[4]*/
		$("#pathCanvas")[0].style.top = (streets.y[0]-30)+"px";
		$("#pathCanvas")[0].style.left = (streets.x[0]-30)+"px";
		$("#pathCanvas")[0].width = streets.x[28]-streets.x[0]+60;
		$("#pathCanvas")[0].height = streets.y[4]-streets.y[0]+60;
		/*$("#pathCanvas")[0].width = $("#map")[0].clientWidth;
		$("#pathCanvas")[0].height = $("#map")[0].clientHeight;*/
	}

	function drawPath(path) {
		var ctx = $("#pathCanvas")[0].getContext("2d");
		ctx.clearRect(0, 0, $("#pathCanvas")[0].width, $("#pathCanvas")[0].height);
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = 20;
		ctx.strokeStyle = "#3783fc";

		ctx.moveTo(path[0].x - (streets.x[0]-30), path[0].y - (streets.y[0]-30));
		for (var i = 1; i < path.length; i++) {
			ctx.lineTo(path[i].x - (streets.x[0]-30), path[i].y - (streets.y[0]-30));
		}

		ctx.stroke();
	}

	function clearPath() {
		var ctx = $("#pathCanvas")[0].getContext("2d");
		ctx.clearRect(0, 0, $("#pathCanvas")[0].width, $("#pathCanvas")[0].height);
	}

	function startNavigate(pinId) {
		user.nav = $("#"+pinId)[0];
		closeSidePanel();
		focusOn($("#userArrow")[0], true);

		if (open) {
			openMapMenu(document.getElementsByClassName("trigger")[0]);
		}
		$("#map .pin").css("visibility", "hidden");
		user.nav.style.visibility = "visible";
		user.nav.style["pointer-events"] = "none";
		$(".mapMenu").css("visibility", "hidden");
		$(".trigger").css("visibility", "hidden");
		$("#exitNavBtn")[0].style.visibility = "inherit";
		$(".navExtra:first").css("visibility", "inherit");
		$(".navInfo:first").css("visibility", "inherit");

		navigate(user.nav);
	}

	function checkArrive(pin) {
		var pinPos = {x: pin.offsetLeft, y: pin.offsetTop};
		var d = Math.abs(pinPos.x-user.x)+Math.abs(pinPos.y-user.y);
		return d <= 40;
	}

	function endNavigate() {
		clearPath();

		$("#exitNavBtn")[0].style.visibility = "hidden";
		user.nav.style["pointer-events"] = "auto";
		$(".mapMenu").css("visibility", "");
		$(".trigger").css("visibility", "");
		$(".navExtra:first")[0].classList.remove('navExtraOpen');
		$(".navExtra:first").css("visibility", "hidden");
		$(".navInfo:first").css("visibility", "hidden");

		for (var i = 0; i < mapPinsActive.length; i++) {
			$("#map .opt"+mapPinsActive[i]).css("visibility", "inherit");
		}
		if (mapPinsActive.length == 0) {
			$("#map .pin").css("visibility", "inherit");
		}

		user.nav = null;
	}

	function navigate(pin) {
		var path = calcPath(pin);
		var info = calcPathInfo(path);
		/*console.log(info);*/
		updatePathInfo(info);
		drawPath(path);
		if (checkArrive(pin)) {
			showNotif("Destination reached");
			endNavigate();
		}
	}


	function getDirectionsTo() {
		var ticketId = tickets[globalType].places[globalPlace].id;
		$("#arrowPad").css("visibility", "visible");
		startNavigate(ticketId);
		switchPages("fullTicket", "mapApp");

	}

	var pressing = "";

	function getArrowKey(n) {
		var arrows = {37:"left", 38:"up", 39:"right", 40:"down"};
		if (n >= 37 && n <= 40) {
			return arrows[n];
		}
		return "";
	}

	document.onkeydown = function () {
		var arrow = getArrowKey(event.keyCode);
		if ($("#arrowPad")[0].style.visibility != "visible" || arrow == "") {
			return;
		}
		event.preventDefault()
		if (pressing == "" || pressing != arrow) {
			pressing = arrow;
			endWalk();
			startWalk(arrow);
		}
	}

	document.onkeyup = function () {
		var arrow = getArrowKey(event.keyCode);
		if ($("#arrowPad")[0].style.visibility != "visible" || arrow == "" || pressing != arrow) {
			return;
		}
		pressing = "";
		endWalk();
	}

/*=================================================*/










/* =================== SETTINGS =====================*/
	
	var connects = {wifi: false, bluetooth: false};

	/*function changeSetting(n) {
		var  name = n == 0 ? "wifi":"bluetooth";
		var div = document.getElementsByClassName("slider")[n];
		var setting = document.getElementsByClassName(name)[0];
		var slide = div.children[0];
		if (slide.classList.contains("on")) {
			connects[name] = false;
			slide.style.left = "3px";
			div.style.backgroundColor= "#b6b6b6";
			slide.classList.add("off");
			slide.classList.remove("on");
			if (name=='wifi') {
				document.getElementsByClassName('bluetooth')[0].style.left = "-45px";
			}
			setting.style.visibility="hidden";
		} else{
			connects[name] = true;
			slide.style.left = "24px";
			div.style.backgroundColor= "#1dd170";
			slide.classList.add("on");
			slide.classList.remove("off");
			if (name=='wifi') {
				document.getElementsByClassName('bluetooth')[0].style.left = "-7px";
			} else if (document.getElementsByClassName('slide')[0].classList.contains('on')){
				setting.style.left="-7px";
			} else{
				setting.style.left="-45px";
			}
			setting.style.visibility="inherit";
		} 
		slide.style.transitionDelay="0 ms";
		slide.style.transitionDelay="0 ms";
	}*/

	function changeSetting(name) {
		var n = name == "wifi" ? 0:1;
		var bar = document.getElementsByClassName("topBar")[0];
		var defs = document.getElementsByClassName("definitions")[0];
		var slider = defs.getElementsByClassName("setting")[n].children[1];
		if (connects[name]) {
			connects[name] = false;
			bar.children[n+1].style.display = "";
		} else {
			connects[name] = true;
			bar.children[n+1].style.display = "inline-block";
		}
		toggleSlider(slider);
	}

	function toggleSlider(slider) {
		slider.classList.toggle("sliderOn");
	}

	function appendNotifSlider(name) {
		return "<div class='slider' onclick='changeSetting(\""+name+"\");toggleSlider(this);'>\
					<div></div>\
				</div>";
	}

/*==================================================*/