/* global ts */

importScripts("lib/typescript.1.6.2.js");

var typingsExtension = ".d.ts";
var es5Lib = "lib.1.6.2.d.ts";
var es6Lib = "lib.es6.1.6.2.d.ts";  
var typings = {
	[es5Lib] : "",
	[es6Lib] : ""
}

self.addEventListener("message", function(e) {
  var data = e.data;
  var sourceFile = data.sourceFile;
  var targets = data.targets;
  compile(sourceFile, targets);
  self.postMessage(sourceFile);
}, false);

for(var typing in typings){
	loadTypeingFromServer(typing);	
}

function loadTypeingFromServer(typing){
	var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200){
			typings[typing] = xmlhttp.responseText;
        }
    }

    xmlhttp.open("GET", "/typings/" + typing, true);
    xmlhttp.send();	
}

function compile(sourceFile, targets){
	//first compile with 
	for (var index = 0; index < targets.length; index++) {
		var target = targets[index];
		compileToOption(sourceFile, target);
	}
}
	
function createCompilerHost(readFile, writeFile, targetLang) {
	return {
		getSourceFile: function getSourceFile(fileName, languageVersion, onError) {
			return ts.createSourceFile(fileName, readFile(fileName), languageVersion);
		},
		getDefaultLibFileName: function () {
			return (targetLang == ts.ScriptTarget.ES6) ? es6Lib : es5Lib;
		},
		getCurrentDirectory: function () { return ""; },
		getCanonicalFileName: function (fileName) { return fileName },
		getNewLine: function () { return "\n"; },
		useCaseSensitiveFileNames: function () { return true },
		fileExists: function(){return true},
		resolveModuleNames: function(){
			console.log(arguments);
			return "";
		},
		
		writeFile: writeFile,
		readFile: readFile,
	};
}
	
function compileToOption(sourceFile, target) {
	var host, program, emitResult, allDiagnostics, errors = [];

	var readFile = function(fileName){
		if(sourceFile.name == fileName){
			return sourceFile.content;
		}
		if(fileName.endsWith(typingsExtension)){
			return typings[fileName];
		}
		return "";
	}
	
	var writeFile = function(fileName, content){
		if(sourceFile.name.replace(".ts", ".js") == fileName){
			sourceFile.result[target.key] = content; 
		}
	}

	sourceFile.result[target.key] = "";
	sourceFile.errors[target.key] = errors;
	
	target.options.removeComments = true;
	host = createCompilerHost(readFile, writeFile, target.options.target);
	program = ts.createProgram([sourceFile.name], target.options, host);
	emitResult = program.emit();
	
	allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
	allDiagnostics.forEach(function (diagnostic) {
		if(diagnostic.file && diagnostic.file.fileName == sourceFile.name){
			var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), 
				line = _a.line, 
				character = _a.character,
				message = ts.flattenDiagnosticMessageText(diagnostic.messageText);
			errors.push(diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
		}
	});
	
	if(errors.length > 0) {
		sourceFile.result[target.key] = "//check console for errors";
	}
}