const input = document.getElementById("keysearch");
input.innerText = "";
const API_KEY = "439d4b804bc8187953eb36d2a8c26a02";
const tagCity = document.getElementById("city-tag");
let dailyData = [];

const dayOfWeekString = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const findCity = async (event) => {
    let count = 0;
    tagCity.innerHTML = "";
    document.getElementById("t-r").innerHTML = "";
    document.getElementById("greet").innerHTML = "";
    document.getElementById("daily-row").innerHTML = "";
    document.getElementById("daily-detail").innerHTML = "";
    setTimeout(() => {}, 300);
    if (event.key === "Enter") {
        const keySearch = input.value;
        const url = `https://openweathermap.org/data/2.5/find?q=${keySearch}&appid=${API_KEY}`;
        const res = await fetch(url);

        const { list } = await res.json();

        list.forEach((element) => {
            count++;
            const { clouds, coord, main, name, wind, sys } = element;
            const { lon, lat } = coord;
            const { temp, temp_min, temp_max } = main;
            const tempDegree = Math.round(temp - 273.15);
            const temp_minDegree = Math.round(temp_min - 273.15);
            const temp_maxDegree = Math.round(temp_max - 273.15);
            const flag = sys.country.toLowerCase();
            const overview = `temperature from ${temp_minDegree}°C to ${temp_maxDegree}°C, wind ${wind.speed} m/s. clouds ${clouds.all}%`;

            tagCity.innerHTML += `
                <div class="bound-city-tag">
                    <div class="info-city-tag" id="info-city-tag_${count}" onclick="showDetail(this.id)">
                        <div class="city-name">
                            <img src="https://openweathermap.org/images/flags/${flag}.png" alt="">
                            <span id="name-of-city">${name}</span>
                        </div>
                        <div class="temp">
                            <p><span class="degree">${tempDegree}°C</span>${overview} </p>
                                Geo coords: [<span id="lon_${count}">${lon}</span>, <span id="lat_${count}">${lat}</span>]
                            </p>
                        </div>
                    </div>
                    <img class="arrow" src="arrow.png" id="arrow_${count}" alt="" hidden style="width: auto; height: 2rem; position: absolute; left: 100.5%;">
                </div>
            `;
        });
    }
};

const showDetail = async (tag_id) => {
    let arrow = document.querySelectorAll(".arrow");
    arrow.forEach((element) => {
        element.hidden = true;
    });
    setTimeout(() => {}, 50);
    document.getElementById("daily-row").innerHTML = "";
    document.getElementById("daily-detail").innerHTML = "";
    const id = tag_id.charAt(tag_id.length - 1);
    document.getElementById(`arrow_${id}`).hidden = false;

    let lat = document.getElementById(`lat_${id}`).innerText;
    let lon = document.getElementById(`lon_${id}`).innerText;

    const url = `https://openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const { current, daily, timezone_offset } = data;
    dailyData = daily;
    let dateTime = new Date(current.dt * 1000);
    let adjustedDate = new Date(
        dateTime.getTime() + (timezone_offset / 60) * 60000
    );

    let hour =
        adjustedDate.getUTCHours() > 12
            ? adjustedDate.getUTCHours() - 12
            : adjustedDate.getUTCHours();

    hour = hour < 10 ? `0${hour}` : hour;

    let minute =
        adjustedDate.getUTCMinutes() < 10
            ? `0${adjustedDate.getUTCMinutes()}`
            : adjustedDate.getUTCMinutes();

    let ampm = adjustedDate.getUTCHours() >= 12 ? "PM" : "AM";
    let timeString = `${hour}:${minute} ${ampm}`;

    const dayOfWeek = adjustedDate.getUTCDay();

    const dayOfWeekName = dayOfWeekString[dayOfWeek];
    const day = adjustedDate.getUTCDate();
    const month = adjustedDate.getUTCMonth() + 1;
    const monthString = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ][month - 1];
    const year = adjustedDate.getUTCFullYear();
    const dateString = `${dayOfWeekName}, ${day} ${monthString}, ${year}`;
    console.log(dateTime);
    document.getElementById("t-r").innerHTML = `
        <span id="h-m">${timeString}</span>
        <span id="d-m"">${dateString}</span>
    `;

    document.getElementById("greet").innerHTML = `
        <span>
            Welcome to ${document.getElementById("name-of-city").innerText}
        </span>
    `;
    document.getElementById("title").innerText = document.getElementById("name-of-city").innerText
    daily.forEach((element) => {
        const { temp, weather } = element;
        dayOfWeekString.push("Sunday");
        const index = daily.indexOf(element);
        const tempDay = Math.round(temp.day);
        const icon = weather[0].icon;
        const dow_name = dayOfWeekString[index].substring(0, 3);
        document.getElementById("daily-row").innerHTML += `
            <div class="dow-tag" id="dow-tag-${index}" onclick="showMore(this.id)">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
                <span class="dow-name">${dow_name}</span>
                <span class="dow-degree">${tempDay}°</span>
            </div>
        `;
    });
};

const showMore = (id_tag) => {
    clearTimeout();
    const id = id_tag.charAt(id_tag.length - 1);
    setTimeout(() => {}, 300);
    let { sunrise, sunset, moonrise, moonset } = dailyData[id];

    let sunriseHour = new Date(sunrise * 1000).getHours();
    let sunriseAMPM = sunriseHour >= 12 ? "PM" : "AM";
    sunriseHour = sunriseHour > 12 ? sunriseHour - 12 : sunriseHour;
    let sunriseMinute = new Date(sunrise * 1000).getMinutes();
    sunriseMinute = sunriseMinute < 10 ? `0${sunriseMinute}` : sunriseMinute;
    let sunriseString = `${sunriseHour}:${sunriseMinute} ${sunriseAMPM}`;

    let sunsetHour = new Date(sunset * 1000).getHours();
    let sunsetAMPM = sunsetHour >= 12 ? "PM" : "AM";
    sunsetHour = sunsetHour > 12 ? sunsetHour - 12 : sunsetHour;
    let sunsetMinute = new Date(sunset * 1000).getMinutes();
    sunsetMinute = sunsetMinute < 10 ? `0${sunsetMinute}` : sunsetMinute;
    let sunsetString = `${sunsetHour}:${sunsetMinute} ${sunsetAMPM}`;

    let moonriseHour = new Date(moonrise * 1000).getHours();
    let moonriseAMPM = moonriseHour >= 12 ? "PM" : "AM";
    moonriseHour = moonriseHour > 12 ? moonriseHour - 12 : moonriseHour;
    let moonriseMinute = new Date(moonrise * 1000).getMinutes();
    moonriseMinute =
        moonriseMinute < 10 ? `0${moonriseMinute}` : moonriseMinute;
    let moonriseString = `${moonriseHour}:${moonriseMinute} ${moonriseAMPM}`;

    let moonsetHour = new Date(moonset * 1000).getHours();
    let moonsetAMPM = moonsetHour >= 12 ? "PM" : "AM";
    moonsetHour = moonsetHour > 12 ? moonsetHour - 12 : moonsetHour;
    let moonsetMinute = new Date(moonset * 1000).getMinutes();
    moonsetMinute = moonsetMinute < 10 ? `0${moonsetMinute}` : moonsetMinute;
    let moonsetString = `${moonsetHour}:${moonsetMinute} ${moonsetAMPM}`;

    // ---------------------------------------------------------------------------------------
    const { day, min, max, night, eve, morn } = dailyData[id].temp;
    // ---------------------------------------------------------------------------------------
    const { wind_speed, wind_deg, clouds, uvi } = dailyData[id];
    // ---------------------------------------------------------------------------------------

    document.getElementById("daily-detail").innerHTML = `
        <div class="day-of-week">
            <span>${dayOfWeekString[id]}</span>
        </div>
        <div class="dow-detail"">
            <div class="sub-cont">
                <span class="sub-title">Sun and Moon</span>
                <span>Sunrise: ${sunriseString}</span>
                <span>Sunset: ${sunsetString}</span>
                <span>Moonrise: ${moonriseString}</span>
                <span>Moonset: ${moonsetString}</span>
            </div>
            <div class="sub-cont">
                <span class="sub-title">Temperature</span>
                <span>Day: ${Math.round(day)}°</span>
                <span>Min: ${Math.round(min)}°</span>
                <span>Max: ${Math.round(max)}°</span>
                <span>Night: ${Math.round(night)}°</span>
            </div>
            <div class="sub-cont">
                <span class="sub-title">Feels like</span>
                <span>Day: ${Math.round(day)}°</span>
                <span>Night: ${Math.round(night)}°</span>
                <span>Evening: ${Math.round(eve)}°</span>
                <span>Morning: ${Math.round(morn)}°</span>
            </div>
            <div class="sub-cont">
                <span class="sub-title">Other</span>
                <span>Wind degrees: ${wind_deg}°</span>
                <span>Wind speed: ${wind_speed}m/s</span>
                <span>Cloud: ${clouds}%</span>
                <span>UV: ${uvi}</span>
            </div>
        </div>
        `;
};
