var accessToken = '144505288.a880b37.f60727772f8e413dad52225165cd1a42';
var clientId	= 'a880b37bc8c6409fa2fecd66255b7e44';
var apiUri		= 'http://www.niklasbrandstrom.se/api/';

function JSONPRequest(url) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(s);
	}

function getBilder(userId){ 	
	JSONPRequest("https://api.instagram.com/v1/users/"+userId+"/media/recent/?access_token="+accessToken+"&count=18&callback=callbackBilder ");
	}
	function callbackBilder(response){
		console.log(response);	
		
		// Nollställer bild-boxen
		document.getElementById("bacon_bilder").innerHTML = "";

		var data;
		data=response.data;

		// Loopar ut resultatet
		for(var i=0;i<data.length;i++){
			
			var holder=document.createElement('div');
				holder.className="puff";
			var inner=document.createElement('div');
				inner.className="inner";
			var caption=document.createElement('div');
				caption.className="caption";
			var images=document.createElement('img');
			
			// Kontrollerar om bilden har kommentar eller ej
			if(data[i].caption != null) { 
				caption.innerHTML=data[i].caption.text;				
				}

			images.setAttribute('src',data[i].images.standard_resolution.url);
			
			holder.appendChild(inner);
			inner.appendChild(images);
			inner.appendChild(caption);


			document.getElementById('bacon_bilder').appendChild(holder);
		}
	}


function getUserInfo (){
	var username = document.getElementById('username').value;
	JSONPRequest('https://api.instagram.com/v1/users/search?q='+username+'&access_token='+accessToken+'&callback=callbackUserInfo');
	}
	function callbackUserInfo (response){
		console.log(response);
		var data;
		data = response.data;	
		if (data[0].length = 1){
			console.log('Retrieved the user ID from instagrams API');
			userID = data[0].id;
			console.log('user ID is: '+userID);
			getBilder(userID); // Hämtar och visar bilder
			
		}else{
			console.log('Could not retrieve the user ID from instagrams API');
		}
}