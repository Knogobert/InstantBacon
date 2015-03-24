(function(ctx, undefined){ // Gör att vår function inte är global (avslutas i slutet)
var accessToken = '144505288.a880b37.f60727772f8e413dad52225165cd1a42';
var countImg 	= '100'; // Antal bilder att visa

// Eventlistners
document.getElementById("search_button").addEventListener("click", getUserInfo); // Klickar man på knappen så söker den
document.getElementById("username").addEventListener("click", selectAll); // Klickar man i text-rutan markar all text
document.getElementById("username").addEventListener("keydown", pressEnter, false); // Ifall man trycker enter i fältet så söker den
document.getElementsByName("search_type")['0'].addEventListener("click", switchPlaceholder); // Lägg till onClick på 'user'-radio
document.getElementsByName("search_type")['1'].addEventListener("click", switchPlaceholder); // Lägg till onClick på 'hashtag'-radio



/* ------------------------------------------------------------------------------------------------------ */

function switchPlaceholder() {	
	// Funktion för att uppdatera Placeholder när man byter mellan sök-typ
	var radios = document.getElementsByName("search_type");
    if(radios['0'].checked === true) { 
		document.getElementById('username').setAttribute("placeholder", "Sök efter användare på instagram");
	} else {
		document.getElementById('username').setAttribute("placeholder", "Sök efter hashtag på instagram");		
	}	
}


function pressEnter(e) {
	// Funktion för att köra scriptet ifall man trycker på enter i input-rutan
	var keyCode = e.keyCode;
		if(keyCode==13) {
    		getUserInfo();
  		} 
	}

function selectAll() {
	// Markerar all text i input-rutan ifall man klickar
    document.getElementById("username").focus();
    document.getElementById("username").select();
	}

/* ------------------------------------------------------------------------------------------------------ */

function JSONPRequest(url) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(s);
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
	    	"margin-top","px",parseInt(centerDivCSS.marginTop),40,300
		);		
	}

	function callbackBilder(response){
	
		searchBox = document.getElementById('username');
		
		// Raderar eventuellt felmeddelande
		searchBox.classList.remove('redBorder');	
		
		// Nollställer bild-boxen
		document.getElementById("pictures").innerHTML = "";
		
		var data;
		data=response.data;
	
		// Kontrollerar om det är ett tomt sökresultat
		if (data.length === 0){
			searchBox.value = "";
			searchBox.classList.add('redBorder');
			searchBox.setAttribute("placeholder", "Ingen hashtag hittades");
			}
		
		setTimeout(function(){

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

			document.getElementById('pictures').appendChild(holder);
		}}, 100)
		
	}

/* ------------------------------------------------------------------------------------------------------ */

function getUserInfo (){	
  
    var radios = document.getElementsByName("search_type");
    var searchBox = document.getElementById('username');
	var searchString = searchBox.value;
 
	// Kollar så att en radioknapp är vald och att det finns något i sökfältet
   if(radios['0'].checked === true && searchString !== "") { 

	   // Man har valt att söka på användare
	   JSONPRequest('https://api.instagram.com/v1/users/search?q='+searchString+'&access_token='+accessToken+'&callback=callbackUserInfo');
	
	} else if(radios['1'].checked === true && searchString !== ""){ 

		 // Om man inte söker på användare, så söker på man på hashtag
		getBilder('hashtag', searchString);
	
	} else {

		// Rödmarkerar sökfältet genom att lägga till classen redBorder, ändrar även sökfältets placeholder
		searchBox.classList.add('redBorder');
		searchBox.setAttribute("placeholder", "Du måste skriva något här");
		
	}
}
	
	function callbackUserInfo (response){
		var searchBox = document.getElementById("username");
		var data;
		data = response.data;
		
		if (data.length === 0){
			// Hittade ingen användare som matchade sökning
			searchBox.value = "";
			searchBox.classList.add('redBorder');
			searchBox.setAttribute("placeholder", "Hittade ingen användare..");

		} else if (data[0].length = 1){
			// Hittade en användare och har hämtat userid, Bilderna hämtas.
			userID = data[0].id;
			getBilder('user', userID); // Hämtar och visar bilder
	
		}else{
			// Fel, Gick ej att ladda Userid
			searchBox.classList.add('redBorder');
			searchBox.setAttribute("placeholder", "Fel, var god ladda om sidan.");
			
		}

	}

/* ------------------------------------------------------------------------------------------------------ */

// Animerar inputfältet
var p = document.getElementById("centerDiv");
var centerDivCSS = p.currentStyle || window.getComputedStyle(p);

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
}})(window);