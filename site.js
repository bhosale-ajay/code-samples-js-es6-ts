/* global samplesLibrary */
/* global ace */
/* global $ */
$(function(){
	var elasticcontainer = $("div.elasticcontainer");
	var consoleWindow = $("div.console");
	var topicTitle = $("span.topicTitle");
	var sampleSelector = $("select.sampleSelector");
	var windowWidth = $(window).width();
	var editorWidth = windowWidth/3; 
	var borderMargin = 6, totalEditors = 5, scrollHeight = 35;
	var setFocusOnControl = true;
	var compiler, samples = [];
	var topicIndex = 0;

	//module ==> 0: "None", 1: "CommonJS", 2: "AMD", 3: "UMD", 4: "System", 5: "ES6" / "ES2015"
	//target ==> 0: "ES3", 1: "ES5", 2: "Latest" / "ES6" / "ES2015"
	var targets = [
		{ key: "es5ceditor", options: { module: 2, target: 1 } },
		{ key: "es6ceditor", options: { module: 5, target: 2 } }
	];

	var editorsInfo = {
		"es5editor" : {title : "JavaScript ES5", lang : "javascript", 
					handler : runES5, nextEditor : "es6editor", nextScrollPosition : 0},
		"es6editor" : {title : "JavaScript ES6", lang : "javascript", 
					handler : runES6, nextEditor : "ts5editor", nextScrollPosition : editorWidth * 3},
		"ts5editor" : {title : "TypeScript", lang : "typescript", 
					handler : runTS, nextEditor : "es5ceditor", nextScrollPosition : editorWidth * 3},
		"es5ceditor" : {title : "TypeScript Compiled to ES5 (AMD)", lang : "javascript", 
					handler : runES5, nextEditor : "es6ceditor", nextScrollPosition : editorWidth * 3},
		"es6ceditor" : {title : "TypeScript Compiled to ES6 (ES6)", lang : "javascript", 
					handler : runES6, nextEditor : "es5editor", nextScrollPosition : 0} 
	}

	var topicEditorMapping = {
		ES5 : "es5editor",
		ES6 : "es6editor",
		TS : "ts5editor"
	}

	console.log = logMessage;
	configureCompiler();
	buildEditors();
	loadSamples();

	function configureCompiler(){
		compiler = new Worker("compiler.js");
		compiler.addEventListener("message", onCompileCompleted, false);
	}
	
	function buildEditors(){
		elasticcontainer.width(editorWidth * totalEditors + borderMargin);
		for(var key in editorsInfo){
			var eachEditorInfo = editorsInfo[key];
			var editorElement = $("<div class='editorbox'><h4>" 
									+ eachEditorInfo.title
									+ "</h4><div id='" 
									+ key
									+ "' class='editor'></div>");
			editorElement.width(editorWidth);
			elasticcontainer.append(editorElement);
			
			var control = ace.edit(key);
			control.setTheme("ace/theme/clouds");
			control.getSession().setMode("ace/mode/" + eachEditorInfo.lang);
			control.setFontSize(18);
			control.$blockScrolling = Infinity;
			attachHandler(control, eachEditorInfo.handler);
			attachTabCommand(control, eachEditorInfo.nextEditor, eachEditorInfo.nextScrollPosition);
			if(setFocusOnControl){
				control.focus();
				setFocusOnControl = false;
			}
			eachEditorInfo.control = control;
			elasticcontainer.parent().height(editorElement.height() + scrollHeight);
		}
	
		$(window).resize(resize);
		resize();
	}

	function loadSamples(){
		samplesLibrary.loadSamples(function(loadedSamples){
			samples = loadedSamples;
			buildSampleSelector();
			printHelp();
		});
	}
	
	function buildSampleSelector() {
	    var firstValidSampleIndex = -1;

	    sampleSelector.change(resetTopics);
	    for (var sampleCounter = 0; sampleCounter < samples.length; sampleCounter++) {
	        var sample = samples[sampleCounter];
	        var topics = sample.topics;
	        if (topics.length == 0) {
	            continue;
	        }

	        if (firstValidSampleIndex == -1) {
	            firstValidSampleIndex = sampleCounter;
	        }

	        sampleSelector.append($("<option>", {
	            value: sampleCounter,
	            text: sample.title
	        }));
	    }
	    if (firstValidSampleIndex > -1) {
	        loadTopic();
	    }
	    $("#prevTopic").click(loadPrevTopic);
	    $("#nextTopic").click(loadNextTopic);
	}
	
	function resetTopics() {
	    topicIndex = 0;
	    loadTopic();
	}

	function loadPrevTopic() {
	    topicIndex -= 1;
	    loadTopic();
	}

	function loadNextTopic() {
	    topicIndex += 1;
	    loadTopic();
	}
    
	function correctIndex(items, index) {
	    if (index < 0) {
	        return items.length - 1;
	    }
	    else if (items.length <= index) {
	        return 0;
	    }
	    else {
	        return index;
	    }
	}

	function loadTopic() {
	    var sampleIndex = sampleSelector.val();
	    sampleIndex = correctIndex(samples, sampleIndex);
		
		var sample = samples[sampleIndex];
		var topics = sample.topics;
			
		topicIndex = correctIndex(topics, topicIndex);

		console.log(sampleIndex + ":" + topicIndex);

		var topic = topics[topicIndex];
		var controlUnfocused = true;
		var control;

		topicTitle.text((+topicIndex + 1) + ". " + topic.title);
		
		for(var key in topicEditorMapping){
			control = editorsInfo[topicEditorMapping[key]].control;
			setValue(
				control,
				topic[key]
			);
			if(topic[key] && controlUnfocused){
				controlUnfocused = false;
				control.focus();
			}
		}
		printHelp();
	}
	
	function attachHandler(control, handler){
		if(!handler){
			return;
		}
		control.commands.addCommand({
			name: "run",
			bindKey: {win: "Alt-R",  mac: "Command-R"},
			exec: function(ctrl) {
				handler(ctrl.getValue());
			}
		});
	}
	
	function attachTabCommand(control, nextEditor, nextScrollPosition){
		control.commands.addCommand({
			name: "tab",
			bindKey: {win: "Alt-T",  mac: "Command-T"},
			exec: function() {
				editorsInfo[nextEditor].control.focus();
				elasticcontainer.parent().scrollLeft(nextScrollPosition);
			}
		});
	}
	
	function setValue(control, value){
		control.setValue(value);
		control.getSelection().clearSelection();
	}
	
	function resize(){
		var newHeight = $(window).height() - consoleWindow.offset().top;
		consoleWindow.height(Math.max(newHeight, 150));
	}
	
	function clearConsole() {
		consoleWindow.html("");		
	}
	
	function logMessage(message){
		var errorElement = $("<div class='message'/>")
		errorElement.text(message);
		consoleWindow.append(errorElement);
	}
	
	function logError(error){
		var errorElement = $("<div class='error'/>")
		errorElement.text(error);
		consoleWindow.append(errorElement);
	}
	
	function runES5(code){
		runCode(code, false);
	}
	
	function runES6(code){
		runCode(code, true);
	}

	function runCode(code, strictMode){
		clearConsole();
		try {
			var userCode ="(function(){" + (strictMode ? "\"use strict\";" : "") + code + "})()";
			eval(userCode);
		}
		catch(e){
			logError(e);
		}
	}

	function runTS(code){
		clearConsole();
		var sourceFile = {
			name : "1.ts",
			content : code,
			result : {},
			errors : {}
		};
		
		logMessage("Compilation Started");
		compiler.postMessage({
			sourceFile : sourceFile,
			targets : targets
		});
	}
		
	function onCompileCompleted(e) {
    	var sourceFile = e.data;
		
		clearConsole();
		var errors = [];
		for (var targetCounter = 0; targetCounter < targets.length; targetCounter++) {
			var target = targets[targetCounter];
			setValue(editorsInfo[target.key].control, sourceFile.result[target.key]);
			errors = errors.concat(sourceFile.errors[target.key]);
		}
		errors = errors.filter(function(value, index, self) { 
    		return self.indexOf(value) === index;
		});
		
		if(errors.length == 0){
			logMessage("Compilation Completed");
		}
		else {
			logError("Compilation Failed");
			for (var errorCounter = 0; errorCounter < errors.length; errorCounter++) {
				logError(errors[errorCounter]);
			}
		}
  	}
	  
	function printHelp() {
	    clearConsole();
		logMessage("Only Tested in Firefox (42) and Chrome (46).");
		logMessage("View in full screen mode for better experience - Press F11 for full screen");
		logMessage("All the console.log messages will be displayed here.");
		logMessage("Press Alt-R from an editor to execute the code.");
		logMessage("Scroll right to see type Script code complied to ES5 and ES6.");
		logMessage("Press Alt-T to move between editors.");
	}
});