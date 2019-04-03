var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SET", "OCT", "NOV", "DEC"];
var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

var pageHistory = [];

var pressed = false;
var timeout_id;

function decide() {
	pressed = true;
	setTimeout(goHomeOrBack, 250);
}

function goHomeOrBack() {
	var homebtn = document.getElementById("btnR");

	homebtn.onmouseup = function() {
		pressed = false;
	}

	if (pressed) {
		goToHome();
	}
	else
		goBack();
}


function loadData() {
	localStorage.posts = JSON.stringify(posts);
	localStorage.people = JSON.stringify(people);
	posts = JSON.parse(localStorage.posts);
	people = JSON.parse(localStorage.people);
	/*if (localStorage.posts == undefined && localStorage.people == undefined) {
		localStorage.posts = JSON.stringify(posts);
		localStorage.people = JSON.stringify(people);
	} else {
		posts = JSON.parse(localStorage.posts);
		people = JSON.parse(localStorage.people);
	}*/
	fillPostPreviews();
}

function fillPostPreviews() {
	var n = 1;
	var app = document.getElementsByClassName("shareApp")[0];
	var cols = app.children[0].children;

	cols[0].innerHTML = "";
	cols[1].innerHTML = "";
	for (var i = posts.length - 1; i >= 0; i--) {
		cols[n].innerHTML += 
					"<div class='postPreview' onclick='showPost(" + i + ")'>\
						<div class='header'>\
							<img src=" + people[posts[i].person].pic + ">\
							<p>" + posts[i].person + "</p>\
						</div>\
						<img src=" + posts[i].image + ">\
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
		pageHistory = ["lockscreen", "main"];
	}
}

function turnOnOff() {
	if (pageHistory.length > 0) {
		var current = document.getElementsByClassName(pageHistory.pop())[0];
		current.classList.toggle("hidden");
		pageHistory = [];
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
		previous.classList.toggle("hidden");
	}
}

function unlock() {
	var lockscreen = document.getElementsByClassName("lockscreen")[0];
	var main = document.getElementsByClassName("main")[0];
	lockscreen.classList.toggle("hidden");
	main.classList.toggle("hidden");
	pageHistory.push("main");
}

function openApp(appName) {
	var main = document.getElementsByClassName("main")[0];
	var app = document.getElementsByClassName(appName)[0];
	main.classList.toggle("hidden");
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

function showPost(postNumber) {
	var app = document.getElementsByClassName("shareApp")[0];
	var postPage = document.getElementsByClassName("fullPost")[0];
	app.classList.toggle("hidden");
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
	var comments = postPage.children[0].children[0].children[3];

	header.children[0].src = people[post.person].pic;
	header.children[1].innerHTML = post.person;
	header.children[2].innerHTML = post.place;
	img.src = post.image;
	if (posts[postNumber].upvoted) {
		bar.children[0].src = "img/icons/up-arrow-full.svg";
	} else {
		bar.children[0].src = "img/icons/up-arrow.svg";
	}
	bar.children[0].setAttribute("onclick", "upvote(" + postNumber + ")");
	bar.children[1].innerHTML = post.upvotes;
	bar.children[2].innerHTML = post.date;

	comments.innerHTML = "";
	for (var i = post.comments.length - 1; i >= 0; i--) {
		comments.innerHTML += 	"<div class='comment'>\
									<div class='header'>\
										<img src=" + people[post.comments[i].person].pic + ">\
										<p>" + post.comments[i].person + "</p>\
									</div>\
									<div class='commentBody'>\
										<p>" + post.comments[i].message + "</p>\
									</div>\
								</div>";
	}
}

function openFriendList() {
	var app = document.getElementsByClassName("shareApp")[0];
	var friendList = document.getElementsByClassName("friendList")[0];
	app.classList.toggle("hidden");
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
		container.innerHTML += 	"<div class='personListItem' onclick='openProfile(\"" + friend + "\")'>\
									<img src=" + people[friend].pic + ">\
									<p>" + friend + "</p>\
								</div>";
	}
}

function openProfile(name) {
	
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
	app.classList.toggle("hidden");
	cam.classList.toggle("hidden");
	pageHistory.push("camApp");
}

function openMic() {

}

function openPublishMenu() {
	var cam  = document.getElementsByClassName("camApp")[0];
	var menu = document.getElementsByClassName("publishMenu")[0];
	cam.classList.toggle("hidden");
	menu.classList.toggle("hidden");
	pageHistory.push("publishMenu");
}

function selectOpt(n) {
	var bar = document.getElementsByClassName("choiceBar")[0];
	var tds = bar.children[0].children[0].children;

	for (var i = 0; i < tds.length; i++) {
		tds[i].style.backgroundColor = "white";
		tds[i].style.color = "black";
	}
	tds[n].style.backgroundColor = "#2379d8";
	tds[n].style.color = "white";

	if (n == 2) {
		
	}
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
	localStorage.posts = JSON.stringify(posts);
	bar.children[1].innerHTML = posts[postNumber].upvotes;
}