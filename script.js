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

function updateMapStatus(message) {
  if (mapStatus) {
    mapStatus.textContent = message;
    mapStatus.hidden = !message;
  }
}

function initializeNaverMap() {
  const service = window.naver?.maps?.Service;
  if (!service) {
    updateMapStatus("네이버 지도 검색 기능을 불러오지 못했습니다. 아래 지도 앱 링크를 이용해 주세요.");
    return;
  }

  service.geocode({ query: naverMap.dataset.address }, (status, response) => {
    const address = response?.v2?.addresses?.[0];
    const latitude = Number(address?.y);
    const longitude = Number(address?.x);

    if (status !== service.Status.OK || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      updateMapStatus("장소를 찾지 못했습니다. 아래 지도 앱 링크를 이용해 주세요.");
      return;
    }

    const position = new window.naver.maps.LatLng(latitude, longitude);
    const map = new window.naver.maps.Map(naverMap, {
      center: position,
      zoom: 16,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    });

    new window.naver.maps.Marker({
      map,
      position,
      title: "양재 온누리교회 사랑홀",
    });
    updateMapStatus("");
  });
}

if (naverMap) {
  const clientId = window.NAVER_MAPS_CLIENT_ID;

  if (!clientId) {
    updateMapStatus("네이버 지도를 사용할 수 없습니다. 아래 지도 앱 링크를 이용해 주세요.");
  } else {
    window.navermap_authFailure = () => {
      updateMapStatus("네이버 지도 인증에 실패했습니다. 아래 지도 앱 링크를 이용해 주세요.");
    };

    window.initializeNaverWeddingMap = initializeNaverMap;
    const mapScript = document.createElement("script");
    mapScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}&submodules=geocoder&callback=initializeNaverWeddingMap`;
    mapScript.async = true;
    mapScript.onerror = () => {
      updateMapStatus("네이버 지도를 불러오지 못했습니다. 아래 지도 앱 링크를 이용해 주세요.");
    };
    document.head.append(mapScript);
  }
}
