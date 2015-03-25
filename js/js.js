(function(ctx){ // Gör att vår function inte är global (avslutas i slutet); ctx står för context, till för att kunna scopa in i vår funktion
var accessToken = '144505288.a880b37.f60727772f8e413dad52225165cd1a42';
var countImg 	= '100'; // Antal bilder att visa

// Här tas sökordet, vill man i förlänge inte ha en sökruta byts denna ut mot tex "Bacon"
var searchTerm = document.getElementById("username");

// Eventlistners
document.getElementById("search_button").addEventListener("click", getUserInfo); // Klickar man på knappen så söker den
searchTerm.addEventListener("click", selectAll); // Klickar man i text-rutan markar all text
searchTerm.addEventListener("keydown", pressEnter, false); // Ifall man trycker enter i fältet så söker den
document.getElementsByName("search_type")['0'].addEventListener("click", switchPlaceholder); // Lägg till onClick på 'user'-radio
document.getElementsByName("search_type")['1'].addEventListener("click", switchPlaceholder); // Lägg till onClick på 'hashtag'-radio

/* ------------------------------------------------------------------------------------------------------ */

// Funktion för att uppdatera Placeholder när man byter mellan sök-typ
function switchPlaceholder() {	
	var radios = document.getElementsByName("search_type");
    if(radios['0'].checked === true) { 
		searchTerm.setAttribute("placeholder", "Sök efter användare på instagram");
	} else {
		searchTerm.setAttribute("placeholder", "Sök efter hashtag på instagram");		
	}	
}

// Funktion för att köra scriptet ifall man trycker på enter i input-rutan
function pressEnter(e) {
	var keyCode = e.keyCode;
		if(keyCode==13) {
    		getUserInfo();
  		} 
	}

// Markerar all text i input-rutan ifall man klickar
function selectAll() {
    searchTerm.focus();
    searchTerm.select();
	}

/* ------------------------------------------------------------------------------------------------------ */

function JSONPRequest(url) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(s);
   	}
   	
/* ------------------------------------------------------------------------------------------------------ */

function getUserInfo (){	
  
    var radios = document.getElementsByName("search_type");
	var searchString = searchTerm.value;
 
		// Kollar så att en radioknapp är vald och att det finns något i sökfältet
	   if(radios['0'].checked === true && searchString !== "") { 
		   // Man har valt att söka på användare
		   JSONPRequest('https://api.instagram.com/v1/users/search?q='+searchString+'&access_token='+accessToken+'&callback=callbackUserInfo');
		
		} else if(radios['1'].checked === true && searchString !== ""){ 
			 // Om man inte söker på användare, så söker på man på hashtag
			getBilder('hashtag', searchString);
		
		} else {
			// Rödmarkerar sökfältet genom att lägga till classen redBorder, ändrar även sökfältets placeholder
			searchTerm.classList.add('redBorder');
			searchTerm.setAttribute("placeholder", "Du måste skriva något här");
			
		}
	}
	
	function callbackUserInfo (response){
		var data;
		data = response.data;
		
		if (data.length === 0){
			// Hittade ingen användare som matchade sökning
			searchTerm.value = "";
			searchTerm.classList.add('redBorder');
			searchTerm.setAttribute("placeholder", "Hittade ingen användare..");
		} else if (data[0].length = 1){
			// Hittade en användare och har hämtat userid, Bilderna hämtas.
			userID = data[0].id;
			getBilder('user', userID); // Hämtar och visar bilder
		}else{
			// Fel, Gick ej att ladda Userid
			searchTerm.classList.add('redBorder');
			searchTerm.setAttribute("placeholder", "Fel, var god ladda om sidan.");	
		}
	}   	

/* ------------------------------------------------------------------------------------------------------ */

function getBilder(searchType,string){ 	
	
		// Kontrollerar vilken typ av sökning som användaren har begärt.
		if(searchType === "user") {
			JSONPRequest("https://api.instagram.com/v1/users/"+string+"/media/recent/?access_token="+accessToken+"&count="+countImg+"&callback=callbackBilder ");
		} else if(searchType === "hashtag") {
			JSONPRequest("https://api.instagram.com/v1/tags/"+string+"/media/recent/?access_token="+accessToken+"&count="+countImg+"&callback=callbackBilder");
		} else {
			// Om en annan radio-button har lyckats bli markerad visas ett felmeddelande....hur det nu skulle gå till.
			searchTerm.classList.add('redBorder');
			searchTerm.setAttribute("placeholder", "Fel, var god ladda om sidan.");
		}
		
		// Kallar på animeringen och bestämmer dess variabler enligt: animate(elem,styling,unit,from,to,time)
		animate(
	    	document.getElementById('centerDiv'),
	    	"margin-top","px",parseInt(centerDivCSS.marginTop),40,300
		);		
	}

	function callbackBilder(response){
		
		// Raderar eventuellt felmeddelande
		searchTerm.classList.remove('redBorder');	
		
		// Nollställer bild-boxen
		document.getElementById("ib_pictures").innerHTML = "";
		
		var data;
		data=response.data;
	
		// Kontrollerar om det är ett tomt sökresultat
		if (data.length === 0){
			searchTerm.value = "";
			searchTerm.classList.add('redBorder');
			searchTerm.setAttribute("placeholder", "Ingen hashtag hittades");
			}

		// Startar en fördröjning för att matcha inladdningen av bilderna mot animeringen av sökfältet
		setTimeout(function(){

		for(var i=0;i<data.length;i++){
			var holder=document.createElement('div');
				holder.className="ib_puff";
			var inner=document.createElement('div');
				inner.className="ib_inner";
			var caption=document.createElement('div');
				caption.className="ib_caption";
				caption.id="ib_caption"+i;
			var images=document.createElement('img');
			
			// Kontrollerar om bilden har kommentar eller ej
			if(data[i].caption != null) { 
				caption.innerHTML=data[i].caption.text;
				caption.style.padding='10px';
				}

			// Lägger till SmoothScroll på holder så att bilderna animeras in.
			holder.setAttribute('data-sr','move 16px scale up 80%, over 1s');			
			
			// Placerar ut alla divs och bilder på rätt ställ
			images.setAttribute('src',data[i].images.standard_resolution.url);
			holder.appendChild(inner);
			inner.appendChild(images);
			inner.appendChild(caption);
			document.getElementById('ib_pictures').appendChild(holder);
			
			}window.sr = new scrollReveal(); // Aktiverar Smooth-scroll
		}, 100) // Fördröjning på animationen av sökrutorna.
		
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
	
	setTimeout(function(){ // Sätter relative positionering på <footer> och #centerDiv, samt adderar fördöjning
		p.style.position='relative';
		document.getElementsByTagName('footer')[0].style.position='relative';
	}, time+300);
}
ctx.callbackUserInfo=callbackUserInfo;// Detta är för att callbackarna skall kunna anropas utanför funktionen
ctx.callbackBilder=callbackBilder;
})(window);