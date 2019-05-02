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
	if (localStorage.posts4 == undefined) {
		localStorage.posts4 = JSON.stringify(posts);
		localStorage.people4 = JSON.stringify(people);
		localStorage.myPosts4 = JSON.stringify(myPosts);
		localStorage.tickets4 = JSON.stringify(tickets);
		localStorage.bought4 = JSON.stringify(bought);
	} else {
		posts = JSON.parse(localStorage.posts4);
		people = JSON.parse(localStorage.people4);
		myPosts = JSON.parse(localStorage.myPosts4);
		tickets = JSON.parse(localStorage.tickets4);
		bought = JSON.parse(localStorage.bought4);
	}
	fillPostPreviews();
}

function reset() {
	if (confirm("Reset device data?")) {
		localStorage.removeItem("posts4");
		localStorage.removeItem("people4");
		localStorage.removeItem("myPosts4");
		localStorage.removeItem("tickets4");
		localStorage.removeItem("bought4");
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
	hidePage(oldPage);
	showPage(newPage);
}

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
		var current = document.getElementsByClassName(pageHistory.pop())[0];
		var main = document.getElementsByClassName("main")[0];
		main.classList.toggle("hidden");
		current.classList.toggle("hidden");
		if (current.classList.contains("popup")) {
			var previous = document.getElementsByClassName(pageHistory.pop())[0];
			previous.classList.toggle("hidden");
		}
		pageHistory = ["lockscreen", "main"];
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
	} else {
		virgin = false;
		pageHistory.push("main");
	}
	lockscreen.classList.toggle("hidden");
	app.classList.toggle("hidden");
}

function openApp(appName) {
	switchPages("main", appName);
	if (appName == "shareApp") {
		var app = document.getElementsByClassName(appName)[0];
		var cont = app.children[0];
		cont.scrollTop = 0;
	} else if (appName == "ticketApp") {
		selectTab(0);
		updateCartDot();
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
	localStorage.posts4 = JSON.stringify(posts);

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
	localStorage.posts4 = JSON.stringify(posts);

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
	localStorage.posts4 = JSON.stringify(posts);
	bar.children[1].innerHTML = posts[postNumber].upvotes;
}


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

/*function openFullTicket() {
	var ticket = document.getElementsByClassName("fullTicket")[0];
	var cont = ticket.children[0];
	cont.scrollTop = 0
	switchPages("ticketApp", "fullTicket");
}
*/

function openFullTicket(type, place, app) {
	var colors = ["#e04242", "#e04242", "#e04242", "#f08130", "#18b44b", "#18b44b"];

	var page = document.getElementsByClassName("fullTicket")[0];
	var container = page.children[0].children[0];
	var ticket = tickets[type].places[place];

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
								<p class=\"travelTime\"><strong>Time:</strong> " + ticket.timeAway + " min.</p>\
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
	var buyBtn = page.children[1].children[1];
	buyBtn.setAttribute("onclick", "openBuyTicket("+type+","+place+")")
	fillStars(type, place);
	if (app == "cartPage" || app == "receiptPage") {
		buyBtn.classList.add("hidden");
	} else {
		buyBtn.classList.remove("hidden");
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
	localStorage.tickets4 = JSON.stringify(tickets);
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
	addBtn.setAttribute("onclick", "addToCart("+type+","+place+");showNotif('Added to cart');");
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
		localStorage.tickets4 = JSON.stringify(tickets);
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
		localStorage.tickets4 = JSON.stringify(tickets);
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
	localStorage.tickets4 = JSON.stringify(tickets);
	

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
	switchPages("ticketApp", "cartPage");
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
	localStorage.tickets4 = JSON.stringify(tickets);
	fillCart();
	updateCartDot();
	goBack();
}

function tryCheckout() {
	/*var popup = document.getElementsByClassName("verifyCheckout")[0];
	var btnyes = popup.children[0].children[2];

	showPage("verifyCheckout");
	btnyes.onclick = function() { 
		goBack();
		checkout(); 
	}*/
	switchPages("cartPage", "paymentPage");
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

	localStorage.tickets4 = JSON.stringify(tickets);
	localStorage.bought4 = JSON.stringify(bought);
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





var map = {
	/*width: parseFloat(getComputedStyle(document.getElementById("map"), null).getPropertyValue("width")),
	height: parseFloat(getComputedStyle(document.getElementById("map"), null).getPropertyValue("height")),*/
	grabbing: false,
	top: 0,
	left: 0,
	zoom: 1
}

function grabMap(mapDiv) {
	map.grabbing = true;
	mapDiv.style.cursor = "grabbing";
}

function releaseMap(mapDiv) {
	map.grabbing = false;
	mapDiv.style.cursor = "grab";
}

function moveMap(mapDiv) {
	var originX = parseInt(event.offsetX*map.zoom*screenScale);
	var originY = parseInt(event.offsetY*map.zoom*screenScale);
	console.log(originX+", "+originY);
	if (map.grabbing) {
		map.top += event.movementY;
		if (map.top > 0) {
			map.top = 0;
		} /*else if (map.top < map.height+) {

		}*/
		map.left += event.movementX;
		if (map.left > 0) {
			map.left = 0;
		}

		mapDiv.style.top = map.top+"px";
		mapDiv.style.left = map.left+"px";
	}
}

function zoomMap(type) {
	var mapDiv = document.getElementById("map");
	if (type == "button+" || type == "button-") {
		var screen = document.getElementsByClassName("screen")[0];
		var originX = parseFloat(getComputedStyle(screen, null).getPropertyValue("width"))*screenScale/2 - map.left;
		var originY = parseFloat(getComputedStyle(screen, null).getPropertyValue("height"))*screenScale/2 - map.top;

		if (type == "button+") {
			map.zoom += 0.05;
		} else {
			map.zoom -= 0.05;
		}
		mapDiv.style.transformOrigin = originX+"px "+originY+"px";
		mapDiv.style.transform = "scale("+map.zoom+")";

	} else if (type == "mouse") {
		var originX = parseInt(event.offsetX*map.zoom*screenScale);
		var originY = parseInt(event.offsetY*map.zoom*screenScale);
		console.log(originX+", "+originY);

		if (event.deltaY<0) {
			/*zoom in*/
			map.zoom += 0.05;
		} else {
			map.zoom -= 0.05;
		}

		mapDiv.style.transformOrigin = originX+"px "+originY+"px";
		mapDiv.style.transform = "scale("+map.zoom+")";
		/*mapDiv.style.width = parseInt(getComputedStyle(mapDiv, null).getPropertyValue("width"))*map.zoom+"px";*/
	}
}


