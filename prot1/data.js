var posts = [{
				person: "Jon Snow",
				place: "Green Lake, Austria",
				image: "img/posts/ales-krivec-24158-unsplash1.jpg",
				upvotes: 53,
				upvoted: false,
				date: "18 JAN 2019",
				comments: 
					[
						{person: "Jon Snow", message: "Guys... for real :("},
						{person: "Tony Stark", message: "I can't see no bent knee..."},
						{person: "Ryan Reynolds", message: "You know nothing, Jon Snow."}
					]
			}, 
			{
				person: "Tony Stark",
				place: "Kraków, Poland",
				image: "img/posts/jacek-dylag-579738-unsplash.jpg",
				upvotes: 105,
				upvoted: false,
				date: "03 MAR 2019",
				comments: 
					[				
						{person: "Peter Parker", message: "The best avenger, might i add."},
						{person: "Peter Parker", message: "Don't even try bastard, Mr. Stark is an Avenger!"},
						{person: "Jon Snow", message: "Welcome to the night's watch my brother. Winter is coming."}
						
					]
			},
			{
				person: "Peter Parker",
				place: "Moscow, Russia",
				image: "img/posts/david-marcu-4654-unsplash.jpg",
				upvotes: 26,
				upvoted: false,
				date: "01 MAR 2018",
				comments: 
					[
						{person: "Johnny Depp", message: "Get a room!!!"},
						{person: "Peter Parker", message: "Yes we do, Mr. Stark!"},
						{person: "Tony Stark", message: "Some move on. We won't. We'll avenge."}					
					]
			},
			{
				person: "Johnny Depp",
				place: "Agueda, Portugal",
				image: "img/posts/roman-kraft-106708-unsplash.jpg",
				upvotes: 10,
				upvoted: false,
				date: "02 SEP 2018",
				comments: 
					[
						{person: "Johnny Depp", message: "-.-"},
						{person: "Harry Potter", message: "Pardon me Mr. Depp, but with that attitude, no wonder no one likes you..."},
						{person: "Johnny Depp", message: "Thank you ALL for your loving comments!"}
						
					]
			},
			{
				person: "Ryan Reynolds",
				place: "Santorini, Greece",
				image: "img/posts/margaret-barley-42-unsplash.jpg",
				upvotes: 9000,
				upvoted: false,
				date: "09 JUL 2013",
				comments: 
					[
						{person: "Ryan Reynolds", message: "Jesus, Peter! You call yourself a superhero?!!"},
						{person: "Peter Parker", message: "Sorry, Mr. Stark :/"},
						{person: "Tony Stark", message: "Hey, Spidy, what did i tell you about this dude?!"},
						{person: "Peter Parker", message: "Great view, Mr. Pool!"}									
					]
			},
			{
				person: "Harry Potter",
				place: "Majorca, Spain",
				image: "img/posts/igor-oliyarnik-1430265-unsplash.jpg",
				upvotes: 526,
				upvoted: false,
				date: "19 OCT 2016",
				comments: 
					[
						{person: "Harry Potter", message: "You are nothing but mere muggles. Of course you don't get it!"},
						{person: "Johnny Depp", message: "He is not a very gifted person Ryan...that's for sure."},
						{person: "Ryan Reynolds", message: "What on earth is a broom carrying wizard doing on a plane??"}	
					]
			}];

var people = {
				"Jon Snow": {pic: "img/profile_pics/philippe-montes-549533-unsplash.jpg", quote: "Winter is coming.", posts: []},
				"Tony Stark": {pic: "img/profile_pics/umanoide-408098-unsplash.jpg", quote: "Genious, billionaire, playboy, philanthropist.", posts: []},
				"Peter Parker": {pic: "img/profile_pics/nicolas-picard-241854-unsplash.jpg", quote: "Well, wobble my webs and call me shaky!", posts: []},
				"Johnny Depp": {pic: "img/profile_pics/camille-couvez-424691-unsplash.jpg", quote: "Not all treasure is silver and gold, mate.", posts: []},
				"Ryan Reynolds": {pic: "img/profile_pics/ayo-ogunseinde-325040-unsplash.jpg", quote: "I can say Chimichanga in seven languages.", posts: []},
				"Harry Potter": {pic: "img/profile_pics/harry-potter.svg", quote: "I solemnly swear i am up to no good.", posts: []}
			};

var myPosts = ["", "", "", ""];