var samplesLibrary = {};
samplesLibrary.loadSamples = function(callback) {
	var samples = [
		{ title: "Basic Concepts", src: "BasicConcepts.js", topics: [] },
        { title: "OOP", src: "oop.js", topics: [] },
	];
	var totalSamples = samples.length;
	var completed = 0;
	for(var sampleCounter = 0;sampleCounter < totalSamples; sampleCounter++ ){
		loadTopicsFromServer(samples[sampleCounter]);
	}

	function loadTopicsFromServer(sample){
		var xmlhttp = new XMLHttpRequest();
	
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE){
				if(xmlhttp.status == 200){
					sample.topics = parseTopics(xmlhttp.responseText);
				}
				completed++;
				if(totalSamples == completed){
					callback(samples);
				}
			}
		}
	
		xmlhttp.open("GET", "samples/" + sample.src, true);
		xmlhttp.send();	
	}
	
	function parseTopics(rawData){
		var topicsData = rawData.split("//EOT//");
		var topics = [];
		for(var topicCounter = 0; topicCounter < topicsData.length; topicCounter++) {
			var topicData = topicsData[topicCounter];
			var lines = topicData.split(/[\r\n]+/);
			var topic = {ES5 : "", ES6 : "", TS : ""};
			var activeProperty = "";
			for(var lineCounter = 0; lineCounter < lines.length; lineCounter++) {
				var line = lines[lineCounter].trimRight();
				if(!topic.title && line.startsWith("//*") && line.endsWith("*//")){
					topic.title = line.substr(3, line.length - 6) 
				}
				else if(line == "//ES5//"){
					activeProperty = "ES5";
				}
				else if(line == "//ES6//"){
					activeProperty = "ES6";
				}
				else if(line == "//TS//"){
					activeProperty = "TS";
				}
				else if(activeProperty != ""){
					topic[activeProperty] += line + "\r\n";
				}
			}
			topic.ES5 = topic.ES5.trimRight();
			topic.ES6 = topic.ES6.trimRight();
			topic.TS = topic.TS.trimRight();
			if(topic.title && (topic.ES5 || topic.ES6 || topic.TS)){
				topics.push(topic);
			}
		}
		return topics;
	}
}