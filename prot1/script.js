var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SET", "OCT", "NOV", "DEC"];
var weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

var pageHistory = [];


function loadData() {
	if (localStorage.posts == undefined && localStorage.people == undefined) {
		console.log("hi");
		localStorage.posts = JSON.stringify(posts);
		localStorage.people = JSON.stringify(people);
	} else {
		posts = JSON.parse(localStorage.posts);
		people = JSON.parse(localStorage.people);
	}
	fillPostPreviews();
}

function fillPostPreviews() {
	var n = 1;
	var app = document.getElementsByClassName("shareApp")[0];
	var cols = app.children[0].children;

	for (var i = posts.length - 1; i >= 0; i--) {
		cols[n].innerHTML += 
					"<div class='postPreview' onclick='showPost()'>\
						<div class='header'>\
							<img src=" + people[posts[i].person].pic + ">\
							<p>" + posts[i].person + "</p>\
						</div>\
						<img src=" + posts[i].image + ">\
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

function showPost() {
	var app = document.getElementsByClassName("shareApp")[0];
	var post = document.getElementsByClassName("fullPost")[0];
	app.classList.toggle("hidden");
	post.classList.toggle("hidden");
	pageHistory.push("fullPost");
}

function openFriendList() {
	var app = document.getElementsByClassName("shareApp")[0];
	var friendList = document.getElementsByClassName("friendList")[0];
	app.classList.toggle("hidden");
	friendList.classList.toggle("hidden");
	pageHistory.push("friendList");
}

function openProfile(name) {

}