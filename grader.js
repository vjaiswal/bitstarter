#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

/*jshint smarttabs:true */

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var util = require('util');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertValidURL = function(url) {
    return url;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

 var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var handleurl = function(checksfile){
    var urlhandler = function(result, response){
	if(result instanceof Error){
	    //console.log(3);
	    console.error('Error: ' + util.format(result));
	    //console.log(4);
	} else {
	    //console.log(5)
	    //console.log(result);

	    var checks = loadChecks(checksfile).sort();

	    $ = cheerio.load(result);
	    var out = {};
	    for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	    }

	    //var checks = loadChecks(checksfile).sort();
	    //console.log("success..");

	    var outJson = JSON.stringify(out, null, 4);
	    console.log(outJson);
	}
    };
    return urlhandler;
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'A valid URL', clone(assertValidURL))
	.parse(process.argv);

//    var file = program.file;
//    var checks = program.checks;
//    var url = program.url;

//    console.log("f=" + file);
//    console.log("c=" + checks);
//    console.log("u=" + url);

//    console.log("argv=" + process.argv);
//    console.log("file=" + program.file);
//    console.log("url=" + program.url);

//    console.log(program.file === null);
//    console.log(program.checks === null);
//    console.log(program.url === null);
//    console.log(program.url === undefined);
//    console.log(program.checks !== undefined);

    if(program.checks !== undefined && program.url !== undefined){
//      url check
//	console.log("voila");
	var urlhandler = handleurl(program.checks);
//	console.log(1);
	rest.get(program.url).on('complete', urlhandler);
//	console.log(2);
    }
    else if(program.checks !== undefined && program.file !== undefined) {
//      file check
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    } else {
	console.log("Invalid command usage.");
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
