if (typeof($) == 'undefined') {
	$ = {};
}

$._ext = {
    //Evaluate a file and catch the exception.
    evalFile: function(path) {
		var payload = {};
        try {
			path = decodeURIComponent(path);
            $.evalFile(path);
			payload.result = 'success';
        } catch (err) {
			payload.result = 'failure';
			payload.error = err;
		}

		return encodeURIComponent(JSON.stringify(payload));
    },
    // Evaluate all the files in the given folder
    evalFiles: function(jsxFolderPath) {
        var folder = new Folder(jsxFolderPath)
        if (folder.exists) {
            var jsxFiles = folder.getFiles("*.jsx")
            for (var i = 0; i < jsxFiles.length; i++) {
                var jsxFile = jsxFiles[i]
                $._ext.evalFile(jsxFile)
            }
        }
    },
    // entry-point function to call scripts more easily & reliably
	callScript: function(dataStr) {
		try {
			var dataObj = JSON.parse(decodeURIComponent(dataStr));
			if (
				!dataObj ||
				!dataObj.namespace ||
				!dataObj.scriptName ||
				!dataObj.args
			) {
				throw new Error('Did not provide all needed info to callScript!');
			}
			// call the specified jsx-function
			var result = $[dataObj.namespace][dataObj.scriptName].apply(
				null,
				dataObj.args
			);
			// build the payload-object to return
			var payload = {
				err: 0,
				result: result
			};
			return encodeURIComponent(JSON.stringify(payload));
		} catch (err) {
			var payload = {
				err: err
			};
			return encodeURIComponent(JSON.stringify(payload));
		}
	}
};

// // fileName is a String (with the .jsx extension included)
// function loadJSX(fileName) {
//     var csInterface = new CSInterface();
//     var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
//     csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
// }
