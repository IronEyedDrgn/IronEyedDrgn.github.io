//print all names
let sm_wm_md_Cs = simplemaps_worldmap_mapdata.state_specific
let dropDownsCreated = false

function map_data_check(){
	var matches_21 = [0, []];
	
	for(var country in sm_wm_md_Cs){
		
		// only change color here
		if( counts.hasOwnProperty(sm_wm_md_Cs[country].name) ){
			sm_wm_md_Cs[country].color = "#FF0000";
			sm_wm_md_Cs[country].hover_color = "#770000";
			
			matches_21[0]++
			matches_21[1].push(sm_wm_md_Cs[country].name)
		}
	}
	
	// also send message to create
	// dropdowns as in image
	/*
	label: [country - take from counts (skip antartica)]
	dropdown values
	//all channels[x]."Channel title"
	where channels[x].Country matches counts
	(can save running time by continue if value count == aimed/real count)
	
	// that as text - Channel ID as value to ensure right when calling
	*/
	if(!dropDownsCreated){
		createDropdowns()
		dropDownsCreated = true;
	}
	
	simplemaps_worldmap.refresh();
}

let actMap = document.getElementById('activate_map').addEventListener('click', map_data_check );


function makeItHappen(elemI){
	
	var innerCountry = elemI.dataset.country
	
	for(var country in sm_wm_md_Cs){
	
		if( innerCountry == sm_wm_md_Cs[country].name ){
			sm_wm_md_Cs[country].description = (
				'<img id="' + innerCountry + '_url" ' +
				' class="YT_channel_url_in_map"' +
				' src="' + elemI.options[elemI.options.selectedIndex].dataset.channel_icon + '">');
			
			sm_wm_md_Cs[country].description +=	elemI.options[elemI.options.selectedIndex].dataset.channel_name + "<br>"
			sm_wm_md_Cs[country].description +=	elemI.options[elemI.options.selectedIndex].dataset.sub_count + " subscribers";
			
			sm_wm_md_Cs[country].url = "https://www.youtube.com/channel/" + elemI.options[elemI.options.selectedIndex].value
		}
		
	}
	doWhenBlurred(elemI)
}


function doWhenFocused(elemI){
	var innerCountry = elemI.dataset.country
	
	for(var country in sm_wm_md_Cs){
		if( innerCountry == sm_wm_md_Cs[country].name ){
			sm_wm_md_Cs[country].color 		 = "#eeee00"
			sm_wm_md_Cs[country].hover_color = "#D0D000"
		}
	}
}

function doWhenBlurred(elemI){
	var innerCountry = elemI.dataset.country
	
	for(var country in sm_wm_md_Cs){
		if( innerCountry == sm_wm_md_Cs[country].name ){
			sm_wm_md_Cs[country].color 			= "#0d0"
			sm_wm_md_Cs[country].hover_color 	= "#070";
		}
	}
}

function createDropdowns(){
	
	document.getElementById("map_list").innerHTML = ""
	// wont reset since this will only run once
	
	for(var country in counts){
		document.getElementById('map_list').innerHTML += country;
		
		/////////////////
		// search through and add (not on map)
		find: {
			for(var MapCountry in sm_wm_md_Cs){
				if( sm_wm_md_Cs[MapCountry].name == country){ break find; }
			}
			document.getElementById('map_list').innerHTML += " (not on map)";
		}
		document.getElementById('map_list').innerHTML += ":";
		
		////////////////
		
		
		// add select structure
		select_to_add = '<select ' + 
			'id="'           + country + '_select" ' + 
			'name="'         + country + '_select" ' +
			'data-country="' + country + '" ' +
			'class="select_country">'
		
		top_subbed_of_country = {number: -1, id: ""};
		// default
		
		// need to grab all channels of each country for this part
		for(var channel of channels_BY_country[country]){
			channel["subcountASnum"] = parseFloat(channel['Subscriber count']);
			// parse num 
			if(channel["subcountASnum"] == NaN){
				channel["subcountASnum"] = 0;
			}
			else{
				// mult based on last char
				var c = (channel['Subscriber count']).slice(-1)
				
				if( !(c >= '0' && c <= '9') ){
					switch(c){
						case "B":
							channel["subcountASnum"] *= 1000;
						case "M":
							channel["subcountASnum"] *= 1000;
						case "K":
							channel["subcountASnum"] *= 1000;
					}
				}
			}
			
			// now need to determine most subbed and add selected to that <option>
			if(channel["subcountASnum"] > top_subbed_of_country.number){
				top_subbed_of_country.number = channel["subcountASnum"]
				top_subbed_of_country.id     = channel["Channel ID"]
			}
			
			select_to_add += ('<option' + 
				' value="' 				+ channel['Channel ID'] +
				'" id="' 				+ channel['Channel ID'] +
				'" data-sub_count=' 	+ channel['Subscriber count'] + 
				' data-channel_icon=' 	+ channel["Channel icon"] + 
				' data-channel_name="' 	+ channel['Channel title'].replaceAll('"',"'") + '">')
			select_to_add += channel['Channel title'] + "</option>"
			
			// can use value to generate channel url
		}
		select_to_add += "</select>"
		document.getElementById('map_list').innerHTML += select_to_add
		
		let selectElement = document.getElementById(country + '_select');
		
		for(currOption of selectElement.options) {
			if( currOption.value == top_subbed_of_country.id){
				currOption.setAttribute('selected', true);
				makeItHappen(selectElement)
				break;
			}
		}
		
		// ALSO MAKE - save selected button - will save all current
		// elemI.options[elemI.options.selectedIndex]
		// and - load selected button - use them to fill map after loading it
	}
	
	// go through all select as for loop and add eventlistener
	// like in map chart
	
	
	
	var elem = document.getElementsByClassName("select_country");

	for (var i = 0; i < elem.length; i += 1) {
		(function () {
			elem[i].addEventListener("change", function() { makeItHappen(this); simplemaps_worldmap.refresh(); }, false);
			
			elem[i].addEventListener("focus", function() { doWhenFocused(this); simplemaps_worldmap.refresh(); }, false);
			elem[i].addEventListener("blur", function() {  doWhenBlurred(this); simplemaps_worldmap.refresh(); }, false);
			
		}()); // immediate invocation
	}
}

//if(country == "Antarctica") continue;
// just indicate which arent the map, on the list

//channel_title = channel["Channel title"].replaceAll('"',"'")

/////////////////////////

// get name value pairs as txt file

let save_faves = document.getElementById('save_fave_channels')
let form_map_list = document.getElementById('map_list');

let use_save_faves = save_faves.addEventListener('click', ()=> {
	
	var data = new FormData(form_map_list);
	
	allData = [];
	
	for (var [key, value] of data){
		var currName = document.getElementById(value).dataset.channel_name;
		allData.push([key, value, currName]);
	}
	
	allData_asString = "Country,Channel ID,Channel name\n"
	
	if(allData.length != 0){
		for(var row of allData){
			for(var cell of row){
				allData_asString += cell + ",";
			}
			allData_asString = allData_asString.substring(0, allData_asString.length-1) + "\n"
		}
		allData_asString = allData_asString.substring(0, allData_asString.length-1)
		
		downloadTextFile(allData_asString, 'My_yt_channels.csv');
	}
});

/// now just need to load and then DONE!
myChannelsFile = document.getElementById('channelsFileInput')

load_fave_channels_btn = document.getElementById('load_fave_channels')

load_saved_faves = load_fave_channels_btn.addEventListener('click', ()=> {
	parsing_fave_channels = Papa.parse( myChannelsFile.files[0] , {
		download: true,
		header: true,
		complete: function(results) {
			
			console.log(results)
			
			var my_fave_channels = results.data;
			
			
			// pick the parent - remove all selected
			// select new
			
			for(curr_channel of my_fave_channels){
				try{
					var channel_option = document.getElementById(curr_channel["Channel ID"]);
					
					var select_load = channel_option.parentNode
					
					for(var opt_r of select_load.options){
						opt_r.removeAttribute("selected")
					}
					// just default_selected?
					
					channel_option.setAttribute('selected', true);
				}
				catch(err){
					console.log(curr_channel["Channel name"] + " was not found");
				}
			}
			form_map_list.reset()
			
			for(var select_ele of document.querySelectorAll('#map_list select')){
				makeItHappen(select_ele)
			}
			
			simplemaps_worldmap.refresh();
		}
		
		// button only works once currently
		// need to work on selected
		
		// get new default selected
	});
});