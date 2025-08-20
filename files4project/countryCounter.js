//country counter!

let countriesArray;
let counts;

let channels_BY_country;

let mybtn = document.getElementById('csvFileInput')

let btn_upload = mybtn.addEventListener('change', startCounter);


let yapms_button = document.getElementById('useInputCSV_YAPMS')
let mapChart_button = document.getElementById('useInputCSV_MapChart')

function startCounter(){
	counts = {};
	countriesArray = [];
	
	channels_BY_country = [];
	
	myvar = Papa.parse(mybtn.files[0], {
		
		download: true,
		header: true,
		complete: function(results) {
			try{
				channels = results.data;
				
				console.log(channels)
				
				var headings = ["Channel Id","Channel Url","Channel Title","Country"];
				// verify the headings
				// 2nd checker for "Channel Icon" & "Subscriber Count" that will only lock my map
				for(var x=0; x<headings.length; x++){
					if( !(channels[0].hasOwnProperty(headings[x])) ){
						
						var sendError
						if(x==3){
							sendError = "Country column missing, run python program on YT csv";
						}
						else{
							sendError = "Invalid Heading, use the correct YouTube data file and run the Python program on it";
						}
						throw sendError
					}
				}
				
				// take countries from csv to internal array
				for(var y = 0; y < channels.length; y++){
					countriesArray.push( channels[y].Country );
				}
				
				countriesArray.sort();
				// all of same country together
				// for later buttons
				
				// filter out
				toRemove = ["DELETED","N/A","TERMINATED","AUTO_GEN","NO_EXIST","REMOVED","UNAVAILABLE",""]
				for (var tir of countriesArray) {
				  if(toRemove.includes(tir) || typeof(tir) == "undefined") continue;
				  
				  counts[tir] = counts[tir] ? counts[tir] + 1 : 1;
				}
				
				// fill channels
				//  will have index for each country
				// each holding array of objects holding
				//		channel url		channel title
				//		channel icon	sub count (as number)
				// ACTUALLY JUST ADD CHANNEL AND DEAL WITH SUBS LATER
				
				for(var y = 0; y < channels.length; y++){
					if( !(channels_BY_country[ channels[y].Country ]) ){
						// create channels_BY_country[ channels[y].Country ] with channels[y] as 1st value
						channels_BY_country[ channels[y].Country ] = [];
					}
					channels_BY_country[ channels[y].Country ].push( channels[y] );
				}
				
				for(var country in channels_BY_country){
					channels_BY_country[country].sort( (a,b) => (
						a["Channel title"] > b["Channel title"]) ? 1 : (
							(b["Channel title"] > a["Channel title"]) ? -1 : 0
						)
					);
				}
				console.log(channels_BY_country)
				
				document.getElementById("file_validity").innerHTML = ""
				yapms_button.removeAttribute("disabled");
				mapChart_button.removeAttribute("disabled");
			}
			catch(e){
				document.getElementById("file_validity").innerHTML = "" + e
				
				yapms_button.disabled = mapChart_button.disabled = true;
			}
		}
	});
}

function downloadTextFile(text, filename) {

  const blob = new Blob([text], {type: 'text/plain'});

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  
  link.click();
  URL.revokeObjectURL(url);
}