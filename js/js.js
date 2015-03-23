var accessToken = '144505288.a880b37.f60727772f8e413dad52225165cd1a42';
//var clientId	= 'a880b37bc8c6409fa2fecd66255b7e44'; används ej..
//var apiUri		= 'http://www.niklasbrandstrom.se/api/'; används ej
var countImg 		= '100'; // Antal bilder att visa

document.getElementById("search_button").addEventListener("click", getUserInfo); // Klickar man på knappen så söker den
document.getElementById("username").addEventListener("click", selectAll); // Klickar man i text-rutan markar all text
document.getElementById("username").addEventListener("keydown", pressEnter, false); // Ifall man trycker enter i fältet så söker den


document.getElementsByName("search_type")['0'].addEventListener("click", switchPlaceholder); // Klickar man i text-rutan markar all text
document.getElementsByName("search_type")['1'].addEventListener("click", switchPlaceholder); // Klickar man i text-rutan markar all text



/* ------------------------------------------------------------------------------------------------------ */

function switchPlaceholder() {	
	var radios = document.getElementsByName("search_type");
   if(radios['0'].checked === true) { 
		document.getElementById('username').setAttribute("placeholder", "Sök efter användare på instagram");
		
	} else {
		document.getElementById('username').setAttribute("placeholder", "Sök efter hashtag på instagram");		
	}
	
}


function pressEnter(e) {
	  var keyCode = e.keyCode;
	  if(keyCode==13) {
	    getUserInfo();
	  } 
	}

function selectAll() {
    document.getElementById("username").focus();
    document.getElementById("username").select();
	}

/* ------------------------------------------------------------------------------------------------------ */

function JSONPRequest(url) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(s);
    
    //inputTransition();
	}

/* ------------------------------------------------------------------------------------------------------ */

function getBilder(searchType,string){ 	
		if(searchType === "user") {
			JSONPRequest("https://api.instagram.com/v1/users/"+string+"/media/recent/?access_token="+accessToken+"&count="+countImg+"&callback=callbackBilder ");
		} else if(searchType === "hashtag") {
			JSONPRequest("https://api.instagram.com/v1/tags/"+string+"/media/recent/?access_token="+accessToken+"&count="+countImg+"&callback=callbackBilder");
		} else {
			alert('fel');	
		}
		
	// Kallar på animeringen och bestämmer dess variabler enligt: animate(elem,styling,unit,from,to,time)
	animate(
    	document.getElementById('centerDiv'),
    	"margin-top","px",parseInt(centerDivCSS.marginTop),40,animationLength
	);		
}

	function callbackBilder(response){
		console.log(response);	
		
		// Nollställer bild-boxen
		document.getElementById("pictures").innerHTML = "";

		var data;
		data=response.data;
		
		setTimeout(function(){
		// Loopar ut resultatet
		for(var i=0;i<data.length;i++){
			var holder=document.createElement('div');
				holder.className="puff";
			var inner=document.createElement('div');
				inner.className="inner";
			var caption=document.createElement('div');
				caption.className="caption";
				caption.id="caption"+i;
			var images=document.createElement('img');
			
			// Kontrollerar om bilden har kommentar eller ej
			if(data[i].caption != null) { 
				caption.innerHTML=data[i].caption.text;
				caption.style.padding='10px';
				}

			images.setAttribute('src',data[i].images.standard_resolution.url);
			
			holder.appendChild(inner);
			inner.appendChild(images);
			inner.appendChild(caption);
			
			/*if(document.getElementById(caption.id)!=''){
				document.getElementById(caption.id).style["padding"]="0";
			}*/

			document.getElementById('pictures').appendChild(holder);
		}}, animationLength)
		
	}

/* ------------------------------------------------------------------------------------------------------ */

function getUserInfo (){	
  
    var radios = document.getElementsByName("search_type");
	var searchString = document.getElementById('username').value;
 
 // Kollar så att en radioknapp är vald och att det finns något i sökfältet
   if(radios['0'].checked === true && searchString !== "") { 
	   // Man har valt att söka på användare
	   JSONPRequest('https://api.instagram.com/v1/users/search?q='+searchString+'&access_token='+accessToken+'&callback=callbackUserInfo');
	 } else if(radios['1'].checked === true && searchString !== ""){ 
		 // Om man inte söker på användare, så söker på man på hashtag
		getBilder('hashtag', searchString);
	} else {
		// Rödmarkerar sökfältet genom att lägga till classen redBorder
		document.getElementById('username').classList.add('redBorder');
		// Ändrar sökfältets placeholder
		document.getElementById('username').setAttribute("placeholder", "Du måste skriva något här");
		
	}
}
	
	function callbackUserInfo (response){
		console.log(response);
		var data;
		data = response.data;
		document.getElementById('username').classList.remove('redBorder');	
		if (data[0].length = 1){
			console.log('Retrieved the user ID from instagrams API');
			userID = data[0].id;
			console.log('user ID is: '+userID);
			getBilder('user', userID); // Hämtar och visar bilder
			
		}else{
			console.log('Could not retrieve the user ID from instagrams API');
		}

	}

/* ------------------------------------------------------------------------------------------------------ */

// Animerar inputfältet
var p = document.getElementById("centerDiv");
var centerDivCSS = p.currentStyle || window.getComputedStyle(p);
var animationLength = 300; // längd i ms

function animate(elem,styling,unit,from,to,time) {
	if( !elem) return;
	var start = new Date().getTime(),
		timer = setInterval(function() {
			var step = Math.min(1,(new Date().getTime()-start)/time);
			elem.style[styling] = (from+step*(to-from))+unit;
			if( step == 1) clearInterval(timer);
		},25);
	elem.style[styling] = from;
	
	setTimeout(function(){ // Sätter relative positionering på <footer> och #centerDiv
		p.style.position='relative';
		document.getElementsByTagName('footer')[0].style.position='relative';
	}, time+300);
}