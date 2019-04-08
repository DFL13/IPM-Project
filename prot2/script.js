var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SET", "OCT", "NOV", "DEC"];
var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

var pageHistory = [];

var shareSelection = [];
var shareSelectionTmp = [];

var timeEnded;
var timeout_id;
var virgin = true;

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
	if (localStorage.posts2 == undefined && localStorage.people2 == undefined && localStorage.myPosts2 == undefined) {
		localStorage.posts2 = JSON.stringify(posts);
		localStorage.people2 = JSON.stringify(people);
		localStorage.myPosts2 = JSON.stringify(myPosts);
	} else {
		posts = JSON.parse(localStorage.posts2);
		people = JSON.parse(localStorage.people2);
		myPosts = JSON.parse(localStorage.myPosts2);
	}
	fillPostPreviews();
}

function reset() {
	if (confirm("Reset device data?")) {
		localStorage.removeItem(posts2);
		localStorage.removeItem(people2);
		localStorage.removeItem(myPosts2);
		location.reload();
	}
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
						<div class='header' onclick='openProfile(\"" + posts[i].person + "\", \"shareApp\")'>\
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
	var main = document.getElementsByClassName("main")[0];
	var app = document.getElementsByClassName(appName)[0];
	main.classList.toggle("hidden");
	if (appName == "shareApp") {
		var cont = app.children[0];
		cont.scrollTop = 0;
	}
	app.classList.toggle("hidden");
	pageHistory.push(appName);
}

/*function showPost() {
	var app = document.getElementsByClassName("shareApp")[0];
	var post = document.getElementsByClassName("fullPost")[0];
	app.classList.toggle("hidden");
	post.classList.toggle("hidden");
	pageHistory.push("fullPost");
}*/

function showPost(postNumber, pageName) {
	var pageName = document.getElementsByClassName(pageName)[0];
	var postPage = document.getElementsByClassName("fullPost")[0];
	pageName.classList.toggle("hidden");

	var cont = postPage.children[0];
	cont.scrollTop = 0;

	postPage.classList.toggle("hidden");
	pageHistory.push("fullPost");

	fillPost(postNumber);
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
	header.children[0].setAttribute("onclick", "openProfile(\"" + post.person + "\", \"fullPost\")");
	header.children[1].innerHTML = post.person;
	header.children[1].setAttribute("onclick", "openProfile(\"" + post.person + "\", \"fullPost\")");
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
										 	onclick='openProfile(\"" + post.comments[i].person + "\", \"fullPost\")'>\
										<p onclick='openProfile(\"" + post.comments[i].person + "\", \"fullPost\")'>\
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

	popup.classList.toggle("hidden");
	pageHistory.push("verifyDelete");
}

function deletePost(postNumber) {
	posts.splice(postNumber, 1);
	localStorage.posts2 = JSON.stringify(posts);

	fillPostPreviews();
	goBack();
	goBack();
}

function openFriendList() {
	var app = document.getElementsByClassName("shareApp")[0];
	var friendList = document.getElementsByClassName("friendList")[0];
	app.classList.toggle("hidden");

	var cont = friendList.children[0];
	cont.scrollTop = 0;

	friendList.classList.toggle("hidden");
	pageHistory.push("friendList");

	fillFriendsList();
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
		container.innerHTML += 	"<div class='personListItem' onclick='openProfile(\"" + friend + "\", \"friendList\")'>\
									<img src=" + people[friend].pic + ">\
									<p>" + friend + "</p>\
								</div>";
	}
}

function openProfile(name, pageName) {
	var profile = document.getElementsByClassName("profile")[0];
	var page = document.getElementsByClassName(pageName)[0];
	if(page.classList.contains("hidden"))
		page.classList.toggle("hidden");
	else page.classList.toggle("hidden");

	var cont = profile.children[0];
	cont.scrollTop = 0;

	profile.classList.toggle("hidden");
	pageHistory.push("profile");

	fillProfile(name);
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

function openAddPostMenu() {
	var app = document.getElementsByClassName("shareApp")[0];
	var menu = document.getElementsByClassName("addPostMenu")[0];
	app.classList.toggle("hidden");
	menu.classList.toggle("hidden");
	pageHistory.push("addPostMenu");
}

function openCam() {
	var app = document.getElementsByClassName("shareApp")[0];
	var cam  = document.getElementsByClassName("camApp")[0];
	var img = cam.children[0].children[0];
	var shutter = cam.children[1].children[1];
	var srcImg = myPosts[Math.floor((Math.random() * (myPosts.length-1)))];

	img.src = srcImg;
	shutter.setAttribute("onclick", "openPublishMenu('" + srcImg + "')");

	app.classList.toggle("hidden");
	cam.classList.toggle("hidden");
	pageHistory.push("camApp");
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

	var cam  = document.getElementsByClassName("camApp")[0];
	var menu = document.getElementsByClassName("publishMenu")[0];
	cam.classList.toggle("hidden");

	var cont = menu.children[0];
	cont.scrollTop = 0;

	menu.classList.toggle("hidden");
	pageHistory.push("publishMenu");
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

function showChoiceBar() {
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
		openSendToSpecific()
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
	var menu = document.getElementsByClassName("publishMenu")[0];

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

	menu.classList.toggle("hidden");
	sendToList.classList.toggle("hidden");
	pageHistory.push("sendToSpecific");
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
	localStorage.posts2 = JSON.stringify(posts);

	fillPostPreviews();

	var app = document.getElementsByClassName("shareApp")[0];
	var menu = document.getElementsByClassName("publishMenu")[0];

	var cont = app.children[0];
	cont.scrollTop = 0;

	app.classList.toggle("hidden");
	menu.classList.toggle("hidden");
	pageHistory.pop();
	pageHistory.pop();
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
	localStorage.posts2 = JSON.stringify(posts);
	bar.children[1].innerHTML = posts[postNumber].upvotes;
}