var posts = [{
				person: "Jon Snow",
				place: "Green Lake, Austria",
				image: "img/posts/ales-krivec-24158-unsplash1.jpg",
				upvotes: 53,
				upvoted: false,
				date: "18 JAN 2018",
				share: [],
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
				date: "3 MAR 2018",
				share: [],
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
				date: "2 JUL 2018",
				share: [],
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
				date: "17 JUL 2018",
				share: [],
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
				date: "20 JUL 2018",
				share: [],
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
				date: "6 AUG 2018",
				share: [],
				comments: 
					[
						{person: "Harry Potter", message: "You are nothing but mere muggles. Of course you don't get it!"},
						{person: "Johnny Depp", message: "He is not a very gifted person Ryan...that's for sure."},
						{person: "Ryan Reynolds", message: "What on earth is a broom carrying wizard doing on a plane??"}	
					]
			},
			{
				person: "Jon Snow",
				place: "Beach, Somewhere",
				image: "img/posts/kelly-lund-1397985-unsplash.jpg",
				upvotes: 25,
				upvoted: false,
				date: "11 AUG 2018",
				share: [],
				comments: 
					[
						{person: "Jon Snow", message: "It's a wolf..."},
						{person: "Johnny Depp", message: "What a beautiful dog!"}
					]
			},
			{
				person: "Johnny Depp",
				place: "Lisbon Zoo, Portugal",
				image: "img/posts/david-clode-1378369-unsplash.jpg",
				upvotes: 3,
				upvoted: false,
				date: "29 AUG 2018",
				share: [],
				comments: 
					[
						{person: "Johnny Depp", message: "It's a parrot..."},
						{person: "Jon Snow", message: "What a beautiful chicken!"}
					]	
			},
			{
				person: "Tony Stark",
				place: "Lisbon Zoo, Portugal",
				image: "img/posts/amy-reed-1258751-unsplash.jpg",
				upvotes: 150,
				upvoted: false,
				date: "30 SEP 2018",
				share: [],
				comments: 
					[
						{person: "Tony Stark", message: "No, i didn't see your chicken..."},
						{person: "Johnny Depp", message: "Did you see the parrot i posted about?"},
						{person: "Tony Stark", message: "It's my old friend, Prehistorical Hulk."},
						{person: "Peter Parker", message: "Who's that Mr.Stark?"}
					]
			},
			{
				person: "Ryan Reynolds",
				place: "Santa's Backyard, North Pole",
				image: "img/posts/annie-spratt-1288425-unsplash.jpg",
				upvotes: 1500,
				upvoted: false,
				date: "24 DEC 2018",
				share: [],
				comments: 
					[
						{person: "Ryan Reynolds", message: "Well...Santa wasn't home, obviously!"},
						{person: "Jon Snow", message: "How did you get in?"}
					]	
			},
			{
				person: "Peter Parker",
				place: "Santa's Frontyard, North Pole",
				image: "img/posts/eberhard-grossgasteiger-1482753-unsplash.jpg",
				upvotes: 150,
				upvoted: false,
				date: "25 DEC 2018",
				share: [],
				comments: 
					[
						{person: "Tony Stark", message: "Even Prehistorical Hulk is helping!!"},
						{person: "Peter Parker", message: "Don't worry, Mr. Stark, it's all under controll ;p"},
						{person: "Tony Stark", message: "Kid, the world is on fire, and you decided to pay Santa a visit..."}
					]
			},
			{
				person: "Harry Potter",
				place: "London Zoo, England",
				image: "img/posts/david-clode-1398034-unsplash.jpg",
				upvotes: 99,
				upvoted: false,
				date: "12 MAR 2019",
				share: [],
				comments: 
					[
						{person: "Johnny Depp", message: "Ssssssnake."},
						{person: "Jon Snow", message: "I thought you only talked to snakes."}
					]	
			}];

var people = {
				"User": {pic: "img/icons/user.svg", quote: ""},
				"Jon Snow": {pic: "img/profile_pics/philippe-montes-549533-unsplash.jpg", quote: "Winter is coming."},
				"Tony Stark": {pic: "img/profile_pics/umanoide-408098-unsplash.jpg", quote: "Genious, billionaire, playboy, philanthropist."},
				"Peter Parker": {pic: "img/profile_pics/nicolas-picard-241854-unsplash.jpg", quote: "Well, wobble my webs and call me shaky!"},
				"Johnny Depp": {pic: "img/profile_pics/camille-couvez-424691-unsplash.jpg", quote: "Not all treasure is silver and gold, mate."},
				"Ryan Reynolds": {pic: "img/profile_pics/ayo-ogunseinde-325040-unsplash.jpg", quote: "I can say Chimichanga in seven languages."},
				"Harry Potter": {pic: "img/profile_pics/harry-potter.svg", quote: "I solemnly swear i am up to no good."}
			};

var myPosts = 
			[
				"img/myPosts/diego-jimenez-263102-unsplash.jpg",			// good
				"img/myPosts/jack-b-1150435-unsplash.jpg",					// good
				"img/myPosts/gautam-krishnan-1452479-unsplash.jpg",			// good
				"img/myPosts/joshua-ness-322881-unsplash.jpg",				// good
				"img/myPosts/igor-francetic-623667-unsplash.jpg",			// good
				"img/myPosts/matt-1253905-unsplash.jpg",					// good
				"img/myPosts/sebastian-pichler-750136-unsplash.jpg",		// good
				"img/myPosts/les-anderson-174222-unsplash.jpg",				// good
				"img/myPosts/stephen-walker-1177763-unsplash.jpg",			// good
				"img/myPosts/les-anderson-276551-unsplash.jpg",				// good
				"img/myPosts/wolfgang-frick-695728-unsplash.jpg"			// good
			];

var bought = [];

var tickets=[{
				type: "events",
				places:[{
							name:"Movie: The Avengers",
							img: "img/ticketPlaces/infinity-4027067_640.png",
							price: 13,
							open:1800,
							close:2000,
							timeAway: 3,
							distance: "200 m",
							duration: 120,
							score: 3.6,
							rate: 0,
							cart: 0
						},
						{
							name:"Phantom of the Opera",
							img: "img/ticketPlaces/free-1641264_640.jpg",
							price: 20,
							open: 2000,
							close: 2130,
							timeAway: 9,
							distance: "850 m",
							duration: 90,
							score: 4.7,
							rate: 0,
							cart: 0
						},
						{
							name:"Arsenal vs Chelsea",
							img: "img/ticketPlaces/stadium-709181_640.jpg",
							price: 25,
							open: 2000,
							close: 2200,
							timeAway: 15,
							distance: "1.7 km",
							duration: 120,
							score: 4.5,
							rate: 0,
							cart: 0
						}
						]
			},
			{
				type: "museums",
				places: [{
							name: "Art Gallery",
							img: "img/ticketPlaces/woman-1283009_640.jpg",
							price: 10,
							open: 1000,
							close: 2000,
							timeAway: 5,
							distance: "500 m",
							duration: 90,
							score: 2.2,
							rate: 0,
							cart: 0
						},
						{
							name: "Science Museum",
							img: "img/ticketPlaces/museum-of-science-and-technology-3601470_640.jpg",
							price: 15,
							open:1000,
							close: 1900,
							timeAway: 7,
							distance: "670 m",
							duration: 60,
							score: 3.4,
							rate: 0,
							cart: 0
						},
						{
							name: "Oceanarium",
							img: "img/ticketPlaces/oceanarium-2048720_640.jpg",
							price: 18,
							open: 1030,
							close: 1930,
							timeAway: 10,
							distance: "950 m",
							duration: 90,
							score: 4.1,
							rate: 0,
							cart: 0
						}
						]
			},
			{
				type:"transports",
				places:[{
							name: "Bus Ticket",
							img: "img/ticketPlaces/london-2665352_640.jpg",
							open: "06:30",
							close: "23:00",
							price: 1.18,
							timeAway: 2,
							distance: "175 m",
							score: 3.0,
							rate: 0,
							cart: 0
						},
						{
							name: "Subway Ticket",
							img: "img/ticketPlaces/train-1285358_640.jpg",
							open: "06:00",
							close: "01:00",
							price: 1,
							timeAway: 5,
							distance: "512 m",
							score: 3.2,
							rate: 0,
							cart: 0
						}
						]
			}
			]