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

/* ==========================================================================
   1. 실시간 D-Day 카운트다운 타이머 (초 단위 라이브)
   ========================================================================== */
function setupLiveCountdown() {
  const weddingTime = new Date(2027, 0, 9, 12, 0, 0).getTime(); // 2027년 1월 9일 낮 12시
  const daysEl = document.querySelector("#dday-days");
  const hoursEl = document.querySelector("#dday-hours");
  const minsEl = document.querySelector("#dday-mins");
  const secsEl = document.querySelector("#dday-secs");
  const badgeEl = document.querySelector("#dday-badge");
  const daysLeftEl = document.querySelector("#dday-days-left");
  const textEl = document.querySelector("#dday-text");

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingTime - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days);
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minsEl) minsEl.textContent = String(mins).padStart(2, "0");
      if (secsEl) secsEl.textContent = String(secs).padStart(2, "0");

      if (badgeEl) badgeEl.textContent = `D-${days}`;
      if (daysLeftEl) daysLeftEl.textContent = String(days);
    } else {
      // 당일 또는 이후
      const passedDays = Math.floor(Math.abs(distance) / (1000 * 60 * 60 * 24));
      if (daysEl) daysEl.textContent = "0";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl) minsEl.textContent = "00";
      if (secsEl) secsEl.textContent = "00";

      if (passedDays === 0) {
        if (badgeEl) badgeEl.textContent = "D-DAY";
        if (textEl) textEl.innerHTML = `오늘, 성렬 <span class="dday-heart">♥</span> 소정이 하나 되는 날입니다 🎉`;
      } else {
        if (badgeEl) badgeEl.textContent = `D+${passedDays}`;
        if (textEl) textEl.innerHTML = `성렬 <span class="dday-heart">♥</span> 소정이 결혼한 지 <strong>${passedDays}일</strong> 되었습니다`;
      }
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

setupLiveCountdown();

/* ==========================================================================
   2. 스마트 플로팅 네비게이션 (스크롤 감지 & 섹션 스파이)
   ========================================================================== */
const topNav = document.querySelector("#top-nav");
const navItems = document.querySelectorAll(".top-nav .nav-item");
const sections = document.querySelectorAll("main section[id]");

function handleNavVisibility() {
  if (!topNav) return;
  // Hero 영역(약 260px)을 지날 때 부드럽게 등장
  if (window.scrollY > 260) {
    topNav.classList.add("top-nav--visible");
  } else {
    topNav.classList.remove("top-nav--visible");
  }
}

window.addEventListener("scroll", handleNavVisibility, { passive: true });
handleNavVisibility();

if (navItems.length && sections.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navItems.forEach((item) => {
            if (item.getAttribute("href") === `#${id}`) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });
        }
      });
    },
    {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   3. 지도 앱 (TMAP 데스크톱/미설치 폴백 처리)
   ========================================================================== */
const tmapBtn = document.querySelector("#tmap-btn");
if (tmapBtn) {
  tmapBtn.addEventListener("click", (event) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      event.preventDefault();
      const fallbackUrl = tmapBtn.dataset.fallback || "https://tmap.life/";
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    }
  });
}

/* ==========================================================================
   4. 마음 전하는 곳 아코디언 (접기/펼치기)
   ========================================================================== */
const foldableTriggers = document.querySelectorAll(".foldable-trigger");
foldableTriggers.forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const contentId = button.getAttribute("aria-controls");
    const content = document.getElementById(contentId);

    button.setAttribute("aria-expanded", String(!isExpanded));
    if (content) {
      content.hidden = isExpanded;
    }
  });
});

/* ==========================================================================
   5. 계좌번호 복사하기 & 토스트 알림
   ========================================================================== */
const copyToast = document.querySelector("#copy-toast");
let toastTimer = null;

function showToast(message) {
  if (!copyToast) return;
  copyToast.textContent = message;
  copyToast.classList.add("show");
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    copyToast.classList.remove("show");
  }, 2200);
}

const copyButtons = document.querySelectorAll(".btn-copy");
copyButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const account = btn.dataset.account;
    if (!account) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(account);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = account;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      const originalSpan = btn.querySelector("span");
      const originalText = originalSpan ? originalSpan.textContent : btn.textContent;

      if (originalSpan) {
        originalSpan.textContent = "복사완료";
      } else {
        btn.textContent = "복사완료";
      }
      btn.classList.add("copied");

      showToast("계좌번호가 복사되었습니다.");

      setTimeout(() => {
        if (originalSpan) {
          originalSpan.textContent = originalText;
        } else {
          btn.textContent = originalText;
        }
        btn.classList.remove("copied");
      }, 1800);
    } catch (err) {
      console.error("복사 실패:", err);
      showToast("복사에 실패했습니다. 번호를 직접 복사해 주세요.");
    }
  });
});

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
