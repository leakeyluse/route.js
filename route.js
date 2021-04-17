function Router(app, entryPoint) {
    var initialRoute = window.location.pathname,
    	currentPath = initialRoute,
	rMethod = "POST";

	function fetchAsync(queryMethod, queryStr, targetUrl, callBackFunc) { 
		if (!navigator.onLine) {
			callBackFunc(null);
			return;
		}
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status === 0 || this.status == 404 || (this.status >= 200 && (this.status < 300 || this.status == 304))) {
					try {
						var xhrResponse = JSON.parse(this.responseText);
						callBackFunc(xhrResponse);                         
					} catch (error) {                    
						callBackFunc(null);
					}
				} else {
					callBackFunc(null);
					return;
				}

			}
		};

		xhr.open(queryMethod, targetUrl, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(queryStr);
	}
	
    function route(path, isNewRoute, isNewState) {
        if (path !== currentPath) {
            isNewRoute = (typeof isNewRoute !== 'undefined') ?  isNewRoute : true;
            isNewState = (typeof isNewState !== 'undefined') ?  isNewState : true; 
            isNewState && window.history.pushState({ path: path }, path, path);
            isNewRoute && fetchRoute(path, restoreScroll);
        }
    }

	function loadIntiaRoute() {
        fetchRoute(initialRoute, true);
    }

    function fetchRoute(path) {
        //update path        
        currentPath = path;
		fetchAsync(rMethod, "route=" + currentPath, entryPoint, function (response) {
			if (response !== null) {
				document.title = response.title;
				app.innerHTML = response.html;
			} else {
				//handle errors here
				alert("Sth went wrong")
			}
		});
    }
	
	document.addEventListener("click", function (e) {
		if (e.target.matches("a")) {
			e.preventDefault();
			fetchRoute(e.target.pathname);
		}
	}
	
	window.addEventListener("popstate", function (e) {
		if (e.state !== null) {
			fetchRoute(e.state.path, true, false);
		} else {
			loadIntiaRoute();
		}
	});
	
    //initialize
    route(initialRoute, false, false);
	
    return {
        route: route
    };
}
