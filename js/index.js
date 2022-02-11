async function setRenderBackground() {
    // https://picsum.photos/200/300
    const result = await axios.get("https://picsum.photos/1920/1080", {
        responseType: "blob"
    })
    //console.log(result.data);
    const data = URL.createObjectURL(result.data);
    //console.log(data);
    document.querySelector("body").style.backgroundImage = `url(${data})`;
}

function setTime() {
    const timer = document.querySelector(".timer");

    setInterval(() => {
        const hour = '0' + new Date().getHours();
        const minute = '0' + new Date().getMinutes();
        const second = '0' + new Date().getSeconds();
        timer.textContent = `${hour.slice(-2)} : ${minute.slice(-2)} : ${second.slice(-2)}`;
    }, 1000)
}

function getMemo(value) {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
}

function setMemo() {
    const memoInput = document.querySelector(".memo-input")
    memoInput.addEventListener("keyup", function (e) {
        //console.log(e.currentTarget.value);
        if (e.key === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value);
            getMemo(e.currentTarget.value);
            memoInput.value = "";
        }
    })
}

function deleteMemo() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo");
            e.target.textContent = "";
        }
    })
}

function getPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    })
}

async function getWeather(lat, lon) {
    // console.log(lat, lon);

    if (lat && lon) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f04e58cd34909d1666b5e4e34bbf9145`);
        return data;
    }

    const data = await axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=f04e58cd34909d1666b5e4e34bbf9145");
    return data;
}

async function renderWeather() {
    let latitude = "";
    let longitude = "";

    try {
        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch {

    }

    const result = await getWeather(latitude, longitude);
    const weatherData = result.data;
    //console.log(weatherData.list);
    // 배열이 너무 많음
    // 오전 오후만 남김
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if (cur.dt_txt.indexOf("18:00:00") > 0) {
            acc.push(cur);
        }
        return acc;
    }, [])
    //console.log(weatherList);
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = weatherList.map((e) => {
        return weatherWrapperComponent(e);
    }).join("");

    const modalImage = document.querySelector(".modal-button");
    const image = new Image();
    weatherList.map((e) => {
        image.src = `${matchIcon(e.weather[0].main)}`;
    })
    modalImage.appendChild(image);
}

function weatherWrapperComponent(e) {
    //console.log(e.main.temp);
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1);
    return `
        <div class="card" style="width: 18rem;">
        <div class="card-header text-center">
            ${e.dt_txt.split(" ")[0]}
        </div>
        <div class="card-body">
        <h5>${e.weather[0].main}</h5>
            <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="...">
            <p class="card-text">${changeToCelsius(e.main.temp)}</p>
        </div>
        </div>
    `
}

function matchIcon(weatherData) {
    if (weatherData === "Clear") return ".././images/039-sun.png";
    if (weatherData === "Clouds") return ".././images/001-cloud.png";
    if (weatherData === "Rain") return ".././images/003-rainy.png";
    if (weatherData === "Snow") return ".././images/006-snowy.png";
    if (weatherData === "Thunderstorm") return ".././images/008-storm.png";
    if (weatherData === "Drizzle") return ".././images/031-snowflake.png";
    if (weatherData === "Atmosphere") return ".././images/033-hurricane.png";
}

// 1번 과제
function toggle() {
    const timerContent = document.querySelector(".timer-content");
    const hour = new Date().getHours();
    if (hour < 12) {
        timerContent.textContent = "Good Morning, Junsu!";
    }
    else {
        timerContent.textContent = "Good Evening, Junsu!";
    }
}

// 2번 과제는 renderWeahter()함수 밑에 추가함

renderWeather();
deleteMemo();
getMemo();
setMemo();
setTime();
setRenderBackground();
toggle();
setInterval(() => {
    setRenderBackground();
}, 5000)