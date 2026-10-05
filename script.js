const calendarDays = document.querySelector("#calendar-days");
const galleryGrid = document.querySelector("#gallery-grid");

if (calendarDays) {
  const blankDays = 5;
  const daysInJanuary = 31;

  for (let index = 0; index < blankDays; index += 1) {
    const blank = document.createElement("span");
    blank.setAttribute("aria-hidden", "true");
    calendarDays.append(blank);
  }

  for (let day = 1; day <= daysInJanuary; day += 1) {
    const date = document.createElement("span");
    date.className = day === 9 ? "calendar-day wedding-day" : "calendar-day";
    date.textContent = String(day);

    if (day === 9) {
      date.setAttribute("aria-label", "2027년 1월 9일, 결혼식");
      date.setAttribute("aria-current", "date");
    }

    calendarDays.append(date);
  }
}

if (galleryGrid) {
  const slots = document.createDocumentFragment();

  for (let index = 1; index <= 30; index += 1) {
    const slot = document.createElement("div");
    const number = String(index).padStart(2, "0");
    slot.className = "gallery-slot";
    slot.setAttribute("role", "img");
    slot.setAttribute("aria-label", `사진 ${number} 자리`);

    const label = document.createElement("span");
    label.setAttribute("aria-hidden", "true");
    label.textContent = `PHOTO ${number}`;

    slot.append(label);
    slots.append(slot);
  }

  galleryGrid.append(slots);
}

const naverMap = document.querySelector("#naver-map");
const mapStatus = document.querySelector("#map-status");
let naverMapInitialized = false;
let naverMapAuthFailed = false;
let naverMapReadyAttempts = 0;
let naverMapReadyTimer;

function updateMapStatus(message) {
  if (mapStatus) {
    mapStatus.textContent = message;
    mapStatus.hidden = !message;
  }
}

function initializeNaverMap() {
  if (naverMapInitialized || naverMapAuthFailed) {
    return;
  }

  const maps = window.naver?.maps;
  const latitude = Number(naverMap.dataset.latitude);
  const longitude = Number(naverMap.dataset.longitude);

  if (!maps?.Map || !maps.LatLng || !maps.Marker) {
    if (naverMapReadyAttempts >= 50) {
      updateMapStatus("네이버 지도 API가 준비되지 않았습니다. Client ID와 허용 도메인 설정을 확인해 주세요.");
      return;
    }

    naverMapReadyAttempts += 1;
    naverMapReadyTimer = window.setTimeout(initializeNaverMap, 100);
    return;
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    updateMapStatus("예식장 좌표를 확인할 수 없습니다. 아래 지도 앱 링크를 이용해 주세요.");
    return;
  }

  try {
    const position = new maps.LatLng(latitude, longitude);
    const map = new maps.Map(naverMap, {
      center: position,
      zoom: 16,
      zoomControl: true,
      zoomControlOptions: {
        position: maps.Position.TOP_RIGHT,
      },
    });

    new maps.Marker({
      map,
      position,
      title: "양재 온누리교회 사랑홀",
    });
    naverMapInitialized = true;
    updateMapStatus("");
  } catch (error) {
    console.error("NAVER Maps initialization failed.", error);
    updateMapStatus("네이버 지도를 표시하지 못했습니다. 지도 API 설정을 확인해 주세요.");
  }
}

if (naverMap) {
  const clientId = window.NAVER_MAPS_CLIENT_ID;

  if (!clientId) {
    updateMapStatus("네이버 지도를 사용할 수 없습니다. 아래 지도 앱 링크를 이용해 주세요.");
  } else {
    window.navermap_authFailure = () => {
      naverMapAuthFailed = true;
      window.clearTimeout(naverMapReadyTimer);
      updateMapStatus("네이버 지도 인증에 실패했습니다. 아래 지도 앱 링크를 이용해 주세요.");
    };

    window.initializeNaverWeddingMap = initializeNaverMap;
    const mapScript = document.createElement("script");
    mapScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}&callback=initializeNaverWeddingMap`;
    mapScript.async = true;
    mapScript.onload = initializeNaverMap;
    mapScript.onerror = () => {
      updateMapStatus("네이버 지도를 불러오지 못했습니다. 아래 지도 앱 링크를 이용해 주세요.");
    };
    document.head.append(mapScript);
  }
}
