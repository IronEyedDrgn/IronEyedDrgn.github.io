// part 1 local csv file
// fetch and parse

let yapms_ids = {};

let loadIds = window.onload = () => {
	
	shouldFetchYapms = true;
	
	/*
	try setup 
	catch
	do count=null 
	then end
	
	if works
	count null and continue
	
	/////////////////////
	
	start red turn blue
	*/
	try{
		setUpMC();
		// see convertToMapChart.js
	}
	catch(error){
		shouldFetchYapms = false;
	}
	
	counts=null;
	if(mybtn.files[0]){
		startCounter();
		console.log("preset file");
	}
	
	if(shouldFetchYapms){
		
		// Fetch the CSV file
		fetch('files4project/yapms_files/sub_list_id_match.csv')
			.then(response => {
				if(!response.ok){
					throw new Error('Network response was not ok');
				}
				return response.text();
			})
			.then(csvData => {
				const parsedData = parseCSV(csvData);
				
				for(var x=1; x<parsedData.length; x++){
					var country = parsedData[x][0];
					var id		= parsedData[x][1];
					yapms_ids[country] = id.trim();
				}
			})
			.catch(error => {
				console.error('There was a problem with the fetch operation:', error);
			});
			
	}
};

// Function to parse CSV data
function parseCSV(csv) {
	const rows = csv.split('\n');
	const result = rows.map(row => row.split(','));
	return result;
}

//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//part 2
let myFileText;

let usebtn = yapms_button.addEventListener('click', ()=> {
	
	myFileText = '{"map":{"country":"glb","type":"countries","year":"2020078","variant":"blank"},' +
				 '"tossup":{"id":"","name":"Tossup","defaultCount":0,"margins":[{"color":"#cccccc"}]},' +
				 '"candidates":[{"id":"29bf84dd-2b0c-4d5d-83fe-f827df9060b8","name":"Democrat","defaultCount":0,' +
				 '"margins":[{"color":"#1C408C"},{"color":"#577CCC"},{"color":"#8AAFFF"},{"color":"#949BB3"}]},' +
				 '{"id":"5a5a5598-d34f-42ae-aaf5-48e36b197cf8","name":"Republican","defaultCount":0,' +
				 '"margins":[{"color":"#BF1D29"},{"color":"#FF5865"},{"color":"#FF8B98"},{"color":"#CF8980"}]}],"regions":[';

	var allCountries 		= Object.keys(yapms_ids);
	var allwatchedCountries = Object.keys(counts);
	
	var num_channels = 0;
	
	function hOwnP(testCountry){
		if(counts.hasOwnProperty(testCountry)){
			num_channels += counts[testCountry];
		}
	}
	
	for( var x = 0; x < allCountries.length; x++ ){
		disabled = false;
		
		var currentCountry   = allCountries[x];
		var currentCountryID = yapms_ids[currentCountry];
		
		if(counts.hasOwnProperty( currentCountry )) 
			 num_channels = counts[currentCountry];
		else num_channels = 0;
		
		if(currentCountry == "United States"){
			hOwnP('Puerto Rico');
		}
		else if(currentCountry == "China"){
			hOwnP("Taiwan");
			hOwnP("Hong Kong");
		}
		
		if(num_channels == 0) disabled = true;
		
		myFileText += ('{"id":"' + currentCountryID + '","value":' + num_channels + 
            ',"permaVal":' + num_channels + ',"locked":' + disabled + ',"permaLocked":false,' +
            '"disabled":' + disabled + ',"candidates":[{"id":"","count":' + num_channels +',"margin":0}]},');
	}
	
	myFileText = myFileText.substring(0, myFileText.length - 1) +']}';

	downloadTextFile(myFileText, 'yapms_sub_map.json');
});