function UrlParser(){
};

// Does not handle host:port or subdomains
UrlParser.parse = function(fullUrl) {
    var urlParts = fullUrl.split("?");

    var url = urlParts[0];

    var domain = null;
    var protocol = null;
    var port = null;

    var urlWithoutProtocol = null;
    if (url.indexOf("://") > -1) {
        var urlSubparts = url.split("://");
        protocol = urlSubparts[0];
        urlWithoutProtocol = urlSubparts[1];
    } else {
    	protocol = "n/a";
    	urlWithoutProtocol = url;
    }

    var urlSubparts = urlWithoutProtocol.split("/");
    domain = urlSubparts.shift();
    path = urlSubparts.join("/");

    if(domain.indexOf(":") !== -1) {
        var domainAndPort = domain.split(":");
        domain = domainAndPort[0];
        port = domainAndPort[1];
    }

    var queryString = "";
    if(urlParts.length > 1)
        queryString = urlParts[1];

    var parsedParams = [];

    if(queryString != "") {
        var queryParts = queryString.split("&");

        for(var x=0;x<queryParts.length; x++) {
            var queryPart = queryParts[x];
            var parameterNameAndValue = queryPart.split("=");

            var parameterName = "";
            var parameterValue = "";

            if(parameterNameAndValue.length > 0)
                parameterName = parameterNameAndValue[0];
            if(parameterNameAndValue.length > 1)
                parameterValue = parameterNameAndValue[1];

            parsedParams[parameterName] = parameterValue;
        }
    }

    return {
        url: url,
        path: path, // Everything after the domain portion
        domain: domain,
        port: port,
        protocol: protocol,
        queryString: queryString,
        queryParameters: parsedParams, // object parameter vame->parameter value
    };
};

/**
 * Retrieve a filename from a URL. This expects a file extension
 * in the url. It will take the contents from the last slash
 * to the end as the filename.
 */
UrlParser.parseFile = function(fullUrl) {

	var parsedUrl = UrlParser.parse(fullUrl);

	var urlFragment = parsedUrl.path;

	var fileExtensionIdx = urlFragment.lastIndexOf(".");
	if(fileExtensionIdx === -1) {
		return null;
	}

	// Filename starts after last slash in path, or beginning in 
	// case our path is just a filename.
	// example.com/file.js
	// example.com/some/path/file.js
	var lastSlashIdx = urlFragment.lastIndexOf("/") || 0;

	var filenameBase = urlFragment.substring(lastSlashIdx + 1, fileExtensionIdx);
	var extension = urlFragment.substring(fileExtensionIdx + 1, urlFragment.length);
	var filenameFull = filenameBase + "." + extension;
	return { 
		"filename": filenameFull,
		"filenameBase": filenameBase,
		"extension": extension,
	};
}

module.exports = UrlParser;