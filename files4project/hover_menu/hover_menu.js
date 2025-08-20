// show 
// all country number
// number of numbers

add_s_nL = document.getElementById('s_nL_btn').addEventListener('click', ()=> {
	
	document.getElementById('simple_numList').innerHTML = "";

	for(var country in counts){
		document.getElementById('simple_numList').innerHTML += country + ":" + counts[country] + "<br>";
	}
	document.getElementById('simple_numList').innerHTML += "<br>"
	// sort starting with 1 and so on
});

add_u_nL = document.getElementById('u_nL_btn').addEventListener('click', ()=> {
	
	var countOfCounts = {};
	document.getElementById('unique_numList').innerHTML = "";

	for(var country in counts){
		countOfCounts[ counts[country] ] = countOfCounts[ counts[country] ] ? countOfCounts[ counts[country] ] + 1 : 1 ;
	}
	
	for(var number in countOfCounts){
		var myCount = number.padEnd(4)
		var myCountCount = (countOfCounts[number] + "").padStart(3)
		
		document.getElementById('unique_numList').innerHTML += myCount + " appearances:" + myCountCount  + "<br>" ;
	}
	// maybe button toggle to see the list
});

const newestElement = document.getElementById("numlist");
newestElement.scrollIntoView();