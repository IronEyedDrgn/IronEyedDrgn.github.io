function setUpMC(){
	document.getElementById('setTo1').value = 1;
	document.getElementById('setTo1').addEventListener('change', ()=> { document.getElementById('setTo1').value = 1; });
	document.getElementById('A1stRange2').innerHTML = "+"
}

const table = document.getElementById("mapmaker");
addRowMC = document.getElementById('addRowMC').addEventListener('click', ()=> {
	
	addROW()
	
	var row_nums = document.querySelectorAll('.use_this_number');
	Array.prototype.forEach.call(row_nums, function addChangeListener( myInput ) {
		if( !myInput.hasAttribute("hasListener") ){
		  myInput.addEventListener('change', function inputChange(event) {
			var pRow = (myInput.parentNode.parentNode).previousElementSibling 
			var xcell = pRow.children[2];
			
			myInput.min = parseInt(pRow.children[1].children[0].value) + 1;
			if( (parseInt(myInput.value) < parseInt(myInput.min)) || (!parseInt(myInput.value))) myInput.value = myInput.min;
			
			
			var nRow = (myInput.parentNode.parentNode).nextElementSibling
			if(nRow){
				var nRowNum = nRow.children[1].children[0];
				if( parseInt(myInput.value) >= parseInt(nRowNum.value) ){
					nRowNum.value = parseInt(myInput.value) + 1
					
					var mychange = new Event('change');
					nRowNum.dispatchEvent(mychange);
				}
			}
			
			xcell.innerHTML = myInput.value - 1;
			
			myInput.setAttribute("hasListener", true);
		  });
		}
	});
	
	//////////////////////////
	set_delete();
});

///////////////////////////////

function set_delete(){
	var deleteButtons = document.querySelectorAll('td.rowRemove button');
	
	Array.prototype.forEach.call(deleteButtons, function addChangeListener( delButton ) {
		if( !delButton.hasAttribute("hasListener") ){
			delButton.addEventListener('click', function(event) {
				// find row index and
				
				var p = delButton.parentNode.parentNode;
				p.parentNode.removeChild(p);
				
				////////////////////
				updateAll()
			});
			
			delButton.setAttribute("hasListener", true);
		}
	});
	updateAll()
}

function updateAll(){
	var table_rows_num = document.querySelectorAll('.use_this_number');
	
	// Create a new 'change' event
	var mychange = new Event('change');

	// Dispatch it.
	for(var z in table_rows_num){
		var input = table_rows_num[z]
		if( typeof(input.value) == "undefined" ){
			continue;
		}
		
		input.dispatchEvent(mychange);
	}
	table.rows[ table.rows.length - 1 ].children[2].innerHTML = "+";
}

///////////////////////////////

function addROW(){
	var row = table.insertRow(-1);
	
	var cell1 = row.insertCell(0);
	cell1.innerHTML = '<input type="color" class="mcColour">';
	
	var cell2 = row.insertCell(1);
	cell2.innerHTML = '<input type="number" size=4 class="use_this_number">';
	
	var cell3 = row.insertCell(2);
	
	var cell4 = row.insertCell(3);
	cell4.setAttribute("class", "rowRemove");
	cell4.innerHTML = "<button>X</button>"
	
	return row;
}


addDefaults = document.getElementById('addDefaultRows').addEventListener('click', ()=> {
	while(table.rows.length != 2){
		table.deleteRow(-1);
	}
	var defaultColours = ['#084081', '#00ff00', '#d40000' ,'#ffff00',
						'#f781bf' ,'#5b5bf6', '#ff7f00', 
						'#724a19' ,'#c2a1e7', '#9c2b70'];
	var defaultValues = [1,2,4,6,11,26,101,251,501,1000]
	
	table.rows[1].cells[0].children[0].value = defaultColours[0];
	table.rows[1].cells[2].innerHTML 		 = defaultValues[1] - 1;
	
	for(var x = 1; x<10; x++){
		var row = addROW()
		
		row.getElementsByClassName("mcColour")[0].value 		= defaultColours[x]
		row.getElementsByClassName("use_this_number")[0].value 	= defaultValues[x]
		if(x!=9) row.cells[2].innerHTML = defaultValues[x+1] - 1;
	}
	
	document.getElementById('addRowMC').click();
	table.rows[table.rows.length-1].cells[3].children[0].click();
	// makes sure delete and such still work
	
});

let usebtn_mc = mapChart_button.addEventListener('click', ()=> {
	
	let allowEmpty = document.getElementById('MapChart_allowEmpty').checked;
	
	let dict_of_stats = {};
	
	for(var x=1; x<table.rows.length; x++){
		var TRxC = table.rows[x].cells;
		
		var x1 = parseInt(TRxC[1].children[0].value)
		var y2 = parseInt(TRxC[2].innerHTML)
		var x2 = !isNaN( y2 ) ? y2 : TRxC[2].innerHTML;
		
		var name;
		if     (x1 == x2) 	name = x1 + ""; 		// any of just one number
		else if(x2 == "+") 	name = x1 + "+"			// end
		else 				name = x1 + " - " + x2; // most so range
		
		dict_of_stats[name] = [[], TRxC[0].children[0].value]
	}

	add_to_array = ''

	unique_array = Object.keys(counts);
	
	loop1:
	for(item in unique_array){
		
		x = counts[ unique_array[item] ]
		
		////////////////////////
		// for loop to check all dict_of_stats keys as parseInt
		var dict_keys = Object.keys(dict_of_stats)
		
		loop2:
		for(var y in dict_keys){
			y = parseInt(y)+1;
			
			if((x < parseInt(dict_keys[y])) ||  (y == dict_keys.length) ){
				add_to_array = dict_keys[y-1];
				break loop2;
			}
		}
		////////////////////////
		dict_of_stats[add_to_array][0].push(item)
	}

	console.log(dict_of_stats)

	////////////////////////////
	
	// index like yapms filter country by map
	// add europe array and so on picked by drop-down?

	add_to_file = ''
	add_countries = ''
	colour = '#000000' // hex code

	add_to_file += '{"groups":{'
	
	stat_keys = Object.keys(dict_of_stats)
	
	for( key in stat_keys ){
		
		mykey = stat_keys[key]
		
		if( !(dict_of_stats[ mykey ][0].length) && !allowEmpty){ continue; } // if empty
		
		colour = dict_of_stats[mykey][1]
		add_to_file += '"' + colour + '":{"label":"'+ mykey + '","paths":['
		
		
		subarray = dict_of_stats[mykey][0]
		for(c in subarray){
			var myCountry = (unique_array[subarray[c]]).replace(' ', '_');
			add_countries += '"' + myCountry + '",';
		}
		
		add_to_file += add_countries.substring(0, add_countries.length-1) + ']},'
		add_countries = ''
	}
	
	/////////////////////////////////////
	
	add_to_file = add_to_file.substring(0, add_to_file.length - 1);
	
	
	add_to_file += '},"title":"","hidden":["USA_Alaska","USA_Wisconsin","USA_Montana","USA_Minnesota","USA_Washington"'
			+ ',"USA_Idaho","USA_North_Dakota","USA_Michigan","USA_Maine","USA_Ohio","USA_New_Hampshire","USA_New_York",'
			+ '"USA_Vermont","USA_Pennsylvania","USA_Arizona","USA_California","USA_New_Mexico","USA_Texas","USA_Louisiana",'
			+ '"USA_Mississippi","USA_Alabama","USA_Florida","USA_Georgia","USA_South_Carolina","USA_North_Carolina",'
			+ '"USA_Virginia","USA_Washington_DC","USA_Maryland","USA_Delaware","USA_New_Jersey","USA_Connecticut",'
			+ '"USA_Rhode_Island","USA_Massachusetts","USA_Oregon","USA_Hawaii","USA_Utah","USA_Wyoming","USA_Nevada",'
			+ '"USA_Colorado","USA_South_Dakota","USA_Nebraska","USA_Kansas","USA_Oklahoma","USA_Iowa","USA_Missouri",'
			+ '"USA_Illinois","USA_Kentucky","USA_Arkansas","USA_Tennessee","USA_West_Virginia","USA_Indiana",'
			+ '"Scotland","Wales","England","Northern_Ireland","Yukon_CA","Prince_Edward_Island_CA","New_Brunswick_CA",'
			+ '"Ontario_CA","British_Columbia_CA","Alberta_CA","Saskatchewan_CA","Manitoba_CA","Quebec_CA","Nunavut_CA",'
			+ '"Newfoundland_and_Labrador_CA","Northwest_Territories_CA","Nova_Scotia_CA"],"background":"#ffffff",'
			+ '"borders":"#000","legendFont":"Century Gothic","legendFontColor":"#000","legendBorderColor":"#00000000",'
			+ '"legendBgColor":"#00000000","legendWidth":150,"legendBoxShape":"square","areBordersShown":true,"defaultColor":"'
			+ '#d1dbdd","labelsColor":"#6a0707","labelsFont":"Arial","strokeWidth":"medium","areLabelsShown":false,'
			+ '"uncoloredScriptColor":"#ffff33","v6":true,"usaStatesShown":false,"canadaStatesShown":false,"splitUK":false,'
			+ '"legendPosition":"bottom_left","legendSize":"medium","legendTranslateX":"0.00","legendStatus":"show",'
			+ '"scalingPatterns":true,"legendRowsSameColor":true,"legendColumnCount":1}'
	
	downloadTextFile(add_to_file, 'MapChart_sub_map.txt')
});

/*checkpoints

# 1,    2 - 3, 4 - 5, 6 - 10, 11 - 25, 26 - 100, 101 - 250, 251 - 500, 501 - 1000, 1000+
# dark, green,  red   yellow   pink     light    orange      brown      lilac     purple
# blue                                   blue

# 14 colours (+ bg white)
# default gray (#d1dbdd)

########################

# dark blue #084081
# regular green #00ff00
# red #ff0000
# yellow #ffff00
# pink #f781bf
# light blue #abd9e9
# orange #ff7f00
# brown #724a19
# lilac #c2a1e7
# purple #9c2b70
# light green #c7e9b4
# regular blue #0000ff
# dark green #238b45

###################

# want colour picker and range picker

////////////////////////////////////////////
*/