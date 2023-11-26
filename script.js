const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-SearchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variables need??

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-Tab");

function switchTab(clickedTab){
        if(clickedTab != currentTab){
          currentTab.classList.remove("current-Tab");
          
          currentTab =  clickedTab;
          currentTab.classList.add("current-Tab");

          if(!searchForm.classList.contains("active"))
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
          searchForm.classList.remove("active");
          userInfoContainer.classList.remove("active");
          getfromSessionStorage();
        }
}


userTab.addEventListener("click", ()=>{
    //pass clicked Tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    //pass clicked Tab as input Parameter 
    switchTab(searchTab);
})

function getfromSessionStorage(){
   const localCoordinates = sessionStorage.getItem("user-coordinates");
   if(!localCoordinates){
    grantAccessContainer.classList.add("active");
   }else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
   }
}

async function fetchUserWeatherInfo(coordinates){
   const {lat,lon} = coordinates;
   grantAccessContainer.classList.remove("active");
   loadingScreen.classList.add("active");

  //  API CALL
  try{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
    catch(err){

    } 
  }

function renderWeatherInfo(weatherInfo){
  //firstly we have to fetch the element

  const cityName= document.querySelector("[data-cityName]");
  const countryIcon=document.querySelector("[data-countryIcon]");
  const desc=document.querySelector("[data-weatherDesc]");
  const weatherIcon=document.querySelector("[data-weatherIcon]");
  const temp=document.querySelector("[data-temp]");
  const windSpeed=document.querySelector("[data-windSpeed]");
  const humidity=document.querySelector("[data-humidity]");
  const cloudiness =document.querySelector("[data-cloudiness]");

  //fetch values from weather info object 
  cityName.innerText= weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = weatherInfo?.main?.temp;

    windSpeed.innertext = weatherInfo?.wind?.speed;

    humidity.innertext = weatherInfo?.main?.humidity;

    cloudiness.innerText = weatherInfo?.clouds?.all; 
}

function getLocation(){
  if(navigator.geoLocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }else{

  }
}

function showPosition(position){
  const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

 const grantAccessBtn= document.querySelector("[data-grantAccess]");
 grantAccessBtn.addEventListener("click",getLocation);