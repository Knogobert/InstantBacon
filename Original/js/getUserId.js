//https://api.instagram.com/v1/users/search?q=svenparker&access_token=25113078.dbe2570.254bdb0509e44bfdbdd7810ddb68f219&callback=getUsername

function JSONPRequest(url) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(s);
}

var username = 'svenparker';
var accessToken = '25113078.dbe2570.254bdb0509e44bfdbdd7810ddb68f219';

function getUserInfo (username, accessToken){
	
	JSONPRequest('https://api.instagram.com/v1/users/search?q='+username+'&access_token='+accessToken+'&callback=getUsername');
	console.log("wrote userfunction");
	getUsername ();
}

function getUsername (response){
	var data;
	data = response.data;
	console.log(data);

}

getUserInfo ();