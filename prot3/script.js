var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SET", "OCT", "NOV", "DEC"];
var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

var pageHistory = [];

var shareSelection = [];
var shareSelectionTmp = [];

var timeEnded;
var timeout_id;
var virgin = true;


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
	if (localStorage.posts3 == undefined && localStorage.people3 == undefined && localStorage.myPosts3 == undefined) {
		localStorage.posts3 = JSON.stringify(posts);
		localStorage.people3 = JSON.stringify(people);
		localStorage.myPosts3 = JSON.stringify(myPosts);
	} else {
		posts = JSON.parse(localStorage.posts3);
		people = JSON.parse(localStorage.people3);
		myPosts = JSON.parse(localStorage.myPosts3);
	}
	fillPostPreviews();
}

function reset() {
	if (confirm("Reset device data?")) {
		localStorage.removeItem("posts3");
		localStorage.removeItem("people3");
		localStorage.removeItem("myPosts3");
		location.reload();
	}
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

		/*var pp = document.createElement("DIV");
		cols[n].appendChild(pp);
		pp.className = "postPreview";
		pp.setAttribute("onclick", "showPost("+i+")");

		var header = document.createElement("DIV");
		pp.appendChild(header);
		header.className = "header";

		var pic = document.createElement("IMG");
		header.appendChild(pic);
		pic.src = people[posts[i].person].pic;

		var name = document.createElement("P");
		header.appendChild(name);
		name.innerHTML = posts[i].person;
		
		var img = document.createElement("IMG");
		pp.appendChild(img);
		img.src = posts[i].image;*/

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
		header.children[3].src = "img/icons/trash-can-black-symbol.svg";
		header.children[3].setAttribute("onclick", "tryDeletePost(" + postNumber + ")");
	} else {
		header.children[3].src = "";
		header.children[3].setAttribute("onclick", "");
	}

	img.src = post.image;
	if (posts[postNumber].upvoted) {
		bar.children[0].src = "img/icons/up-arrow-full.svg";
	} else {
		bar.children[0].src = "img/icons/up-arrow.svg";
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
	localStorage.posts3 = JSON.stringify(posts);

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
	localStorage.posts3 = JSON.stringify(posts);

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
		bar.children[0].src = "img/icons/up-arrow-full.svg";
		posts[postNumber].upvotes++;
		posts[postNumber].upvoted = true;
	} else {
		bar.children[0].src = "img/icons/up-arrow.svg";
		posts[postNumber].upvotes--;
		posts[postNumber].upvoted = false;
	}
	localStorage.posts3 = JSON.stringify(posts);
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
		content.innerHTML += 	"<div class=\"ticketPreview\" onclick='openFullTicket("+ n + "," + i + ")'>\
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

function openFullTicket(type, place) {
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
								<div class=\"score\">\
									<img src=\"img/icons/favourites-filled-star-symbol.svg\">\
									<p>Score:</p>\
									<p>"+ ticket.score + "</p>\
								</div>\
							</div>\\";

	if (type == 0 || type == 1) {
		container.innerHTML += "<div class=\"eventBox\">\
									<img src=\"img/icons/time-left.svg\">\
									<p class=\"openHours\"><strong>Open:</strong> " + open[0] + ":" + open[1] + "-" + close[0] + ":" + close[1] + "</p>\
									<p class=\"duration\"><strong>Duration:</strong> " + ticket.duration + " min.</p>\
								</div>\\";
	}

	else {
		container.innerHTML += "<div class=\"eventBox\">\
									<img src=\"img/icons/time-left.svg\">\
									<p class=\"openHoursTransports\"><strong>Open:</strong> " + ticket.open + "-" + ticket.close + "</p>\
								</div>\\";
	}

	container.innerHTML += "<div class=\"routeBox\">\
								<img src=\"img/icons/footprint.svg\">\
								<p class=\"distance\"><strong>Distance:</strong> 750 m</p>\
								<p class=\"travelTime\"><strong>Time:</strong> " + ticket.timeAway + " min.</p>\
							</div>\
							<div class=\"rateTicket\">\
								<p>Rate:</p>\
								<img src=\"img/icons/star-of-favorites-outline.svg\">\
								<img src=\"img/icons/star-of-favorites-outline.svg\">\
								<img src=\"img/icons/star-of-favorites-outline.svg\">\
								<img src=\"img/icons/star-of-favorites-outline.svg\">\
								<img src=\"img/icons/star-of-favorites-outline.svg\">\
							</div>";
	

	var cont = page.children[0];
	cont.scrollTop = 0
	switchPages("ticketApp", "fullTicket");

}