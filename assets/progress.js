(function () {
  const STORAGE_KEY = "tinyFairyPlaylandProgress";
  const TODAY_KEY = new Date().toISOString().slice(0, 10);

  const GAME_CATALOG = {
    food: { name: "Tiệm Ăn Cổ Tích", sticker: "🍳", href: "tiem-an-co-tich.html" },
    garden: { name: "Vườn Hoa Cầu Vồng", sticker: "🌸", href: "vuong-hoa-cau-vong.html" },
    clinic: { name: "Phòng Khám Thú Cưng", sticker: "🩺", href: "phong-kham-thu-cung.html" },
    bakery: { name: "Tiệm Bánh Công Chúa", sticker: "🧁", href: "time-banh-ngot-cua-be.html" },
    bath: { name: "Nhà Tắm Bong Bóng", sticker: "🫧", href: "nha-tam-bong-bong.html" },
    fashion: { name: "Cửa Hàng Thời Trang", sticker: "🎀", href: "cua-hang-thoi-trang-cho-be-xinh.html" },
    plush: { name: "Xưởng Gấu Bông", sticker: "🧸", href: "xuong-gau-bong.html" },
    market: { name: "Siêu Thị Mini", sticker: "🛒", href: "sieu-thi-mini.html" },
    magic: { name: "Lớp Học Phép Thuật", sticker: "✨", href: "lop-hoc-phep-thuat.html" },
    makeup: { name: "Trang Điểm Công Chúa", sticker: "💄", href: "trang-diem-cong-chua.html" },
    drawing: { name: "Bé Tập Vẽ Tranh", sticker: "🎨", href: "be-tap-ve-tranh.html" }
  };

  const SHOP_ITEMS = {
    candyTree: { name: "Cây kẹo", emoji: "🍭", cost: 15 },
    picnicBench: { name: "Ghế picnic", emoji: "🪑", cost: 18 },
    miniRainbow: { name: "Cầu vồng nhỏ", emoji: "🌈", cost: 20 },
    starLamp: { name: "Đèn sao", emoji: "🌟", cost: 24 },
    bunnyHouse: { name: "Nhà thỏ", emoji: "🏡", cost: 30 },
    nameSign: { name: "Bảng tên của bé", emoji: "🎀", cost: 35 }
  };

  const defaultProgress = {
    version: 2,
    games: {},
    stickers: [],
    coins: 0,
    stars: 0,
    accessories: [],
    decorations: [],
    dailyRewards: {},
    settings: {
      soundEnabled: true,
      dailyLimitMinutes: 20
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function ensureGame(progress, gameId) {
    if (!progress.games[gameId]) {
      progress.games[gameId] = {
        completed: 0,
        completedLevels: [],
        stars: 0,
        coins: 0,
        plays: 0,
        stickers: [],
        lastPlayed: ""
      };
    }
    return progress.games[gameId];
  }

  function normalize(raw) {
    const progress = Object.assign(clone(defaultProgress), raw || {});
    progress.games = progress.games || {};
    progress.stickers = Array.isArray(progress.stickers) ? progress.stickers : [];
    progress.decorations = Array.isArray(progress.decorations) ? progress.decorations : [];
    progress.accessories = Array.isArray(progress.accessories) ? progress.accessories : [];
    progress.dailyRewards = progress.dailyRewards || {};
    progress.settings = Object.assign(clone(defaultProgress.settings), progress.settings || {});

    Object.keys(GAME_CATALOG).forEach((gameId) => ensureGame(progress, gameId));

    // Migrate the older hub-only structure if it exists.
    if (Array.isArray(raw && raw.visited)) {
      raw.visited.forEach((gameId) => {
        if (!GAME_CATALOG[gameId]) return;
        const game = ensureGame(progress, gameId);
        if (!game.completedLevels.includes("visited")) {
          game.completedLevels.push("visited");
          game.completed = Math.max(game.completed, 1);
          game.stars = Math.max(game.stars, 1);
          game.coins = Math.max(game.coins, 3);
        }
        const sticker = GAME_CATALOG[gameId].sticker;
        if (!progress.stickers.includes(sticker)) progress.stickers.push(sticker);
        if (!game.stickers.includes(sticker)) game.stickers.push(sticker);
      });
    }

    progress.stars = Object.values(progress.games).reduce((sum, game) => sum + (Number(game.stars) || 0), 0);
    progress.coins = Number(progress.coins) || 0;

    return progress;
  }

  function load() {
    try {
      return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    } catch {
      return normalize(defaultProgress);
    }
  }

  function save(progress) {
    const normalized = normalize(progress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent("tiny-fairy-progress-updated", { detail: normalized }));
    return normalized;
  }

  function recordGameStart(gameId) {
    if (!GAME_CATALOG[gameId]) return load();
    const progress = load();
    const game = ensureGame(progress, gameId);
    game.plays += 1;
    game.lastPlayed = new Date().toISOString();
    return save(progress);
  }

  function completeGame(gameId, options = {}) {
    if (!GAME_CATALOG[gameId]) return load();
    const catalog = GAME_CATALOG[gameId];
    const progress = load();
    const game = ensureGame(progress, gameId);
    const nextNumber = game.completed + 1;
    const levelId = options.levelId || `${gameId}-level-${nextNumber}`;
    const alreadyCompleted = game.completedLevels.includes(levelId);
    const stars = Number(options.stars || 3);
    const coins = Number(options.coins || 5);
    const sticker = options.sticker || catalog.sticker;

    if (!alreadyCompleted) {
      game.completedLevels.push(levelId);
      game.completed += 1;
      game.stars += stars;
      game.coins += coins;
      progress.stars += stars;
      progress.coins += coins;
    }

    if (!game.stickers.includes(sticker)) game.stickers.push(sticker);
    if (!progress.stickers.includes(sticker)) progress.stickers.push(sticker);

    if (progress.stickers.length >= 3 && !progress.accessories.includes("bow")) {
      progress.accessories.push("bow");
    }
    if (progress.stickers.length >= 6 && !progress.accessories.includes("crown")) {
      progress.accessories.push("crown");
    }
    if (progress.stickers.length >= 9 && !progress.accessories.includes("wand")) {
      progress.accessories.push("wand");
    }

    game.lastPlayed = new Date().toISOString();
    return save(progress);
  }

  function claimDailyReward() {
    const progress = load();
    if (progress.dailyRewards[TODAY_KEY]) {
      return { ok: false, progress, message: "Hôm nay Luna đã nhận quà rồi." };
    }
    progress.dailyRewards[TODAY_KEY] = true;
    progress.stars += 1;
    progress.coins += 3;
    return { ok: true, progress: save(progress), message: "Luna nhận thêm 1 sao và 3 xu nhỏ!" };
  }

  function buyDecoration(itemId) {
    const item = SHOP_ITEMS[itemId];
    const progress = load();
    if (!item) return { ok: false, progress, message: "Món trang trí này chưa có trong cửa hàng." };
    if (progress.decorations.includes(itemId)) {
      return { ok: false, progress, message: "Bé đã có món trang trí này rồi." };
    }
    if (progress.coins < item.cost) {
      return { ok: false, progress, message: `Cần thêm ${item.cost - progress.coins} xu để mua ${item.name}.` };
    }
    progress.coins -= item.cost;
    progress.decorations.push(itemId);
    return { ok: true, progress: save(progress), message: `Đã mua ${item.emoji} ${item.name}!` };
  }

  function updateSettings(settings) {
    const progress = load();
    progress.settings = Object.assign(progress.settings || {}, settings || {});
    return save(progress);
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return save(clone(defaultProgress));
  }

  function injectCompletionStyles() {
    if (document.getElementById("tiny-fairy-completion-styles")) return;
    const style = document.createElement("style");
    style.id = "tiny-fairy-completion-styles";
    style.textContent = `
      .tiny-fairy-complete {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: grid;
        place-items: center;
        padding: 18px;
        background: rgba(61, 43, 68, 0.42);
        backdrop-filter: blur(10px);
      }
      .tiny-fairy-complete-card {
        width: min(92vw, 460px);
        padding: 24px;
        border-radius: 28px;
        background: #fffaf4;
        border: 4px solid rgba(255, 143, 179, 0.55);
        box-shadow: 0 24px 70px rgba(67, 44, 72, 0.28);
        color: #49384d;
        text-align: center;
        font-family: inherit;
      }
      .tiny-fairy-complete-emoji {
        font-size: 4.5rem;
        line-height: 1;
        margin-bottom: 8px;
      }
      .tiny-fairy-complete-card h2 {
        margin: 0;
        font-size: clamp(2rem, 8vw, 3rem);
        line-height: 1;
        color: #e94d82;
      }
      .tiny-fairy-complete-card p {
        margin: 10px 0 0;
        color: #7d6c82;
        font-weight: 800;
        line-height: 1.4;
      }
      .tiny-fairy-rewards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin: 18px 0;
      }
      .tiny-fairy-reward {
        padding: 12px 8px;
        border-radius: 18px;
        background: #fff;
        border: 1px solid rgba(73, 56, 77, 0.12);
        font-weight: 900;
      }
      .tiny-fairy-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
      }
      .tiny-fairy-actions a,
      .tiny-fairy-actions button {
        min-height: 48px;
        padding: 0 18px;
        border: 0;
        border-radius: 999px;
        font: inherit;
        font-weight: 900;
        text-decoration: none;
        cursor: pointer;
      }
      .tiny-fairy-map-btn {
        color: #fff;
        background: linear-gradient(135deg, #ff6b9c, #e94d82);
      }
      .tiny-fairy-continue-btn {
        color: #744d72;
        background: #fff;
        border: 2px solid rgba(255, 143, 179, 0.28) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function showCompletionOverlay(options = {}) {
    const gameId = options.gameId;
    const catalog = GAME_CATALOG[gameId] || { name: "Mini game", sticker: "⭐" };
    const stars = Number(options.stars || 3);
    const coins = Number(options.coins || 5);
    const sticker = options.sticker || catalog.sticker;
    completeGame(gameId, { levelId: options.levelId, stars, coins, sticker });
    injectCompletionStyles();

    const old = document.getElementById("tiny-fairy-complete");
    if (old) old.remove();

    const overlay = document.createElement("div");
    overlay.id = "tiny-fairy-complete";
    overlay.className = "tiny-fairy-complete";
    overlay.innerHTML = `
      <div class="tiny-fairy-complete-card" role="dialog" aria-modal="true" aria-label="Hoàn thành hôm nay">
        <div class="tiny-fairy-complete-emoji">${sticker}</div>
        <h2>${options.title || "Hoàn thành hôm nay!"}</h2>
        <p>${options.message || `Bé đã hoàn thành một nhiệm vụ ở ${catalog.name}. Luna có quà mới rồi!`}</p>
        <div class="tiny-fairy-rewards" aria-label="Phần thưởng">
          <div class="tiny-fairy-reward">⭐ +${stars}</div>
          <div class="tiny-fairy-reward">🪙 +${coins}</div>
          <div class="tiny-fairy-reward">${sticker} Sticker</div>
        </div>
        <div class="tiny-fairy-actions">
          <a class="tiny-fairy-map-btn" href="${options.returnUrl || "index.html"}">Về bản đồ</a>
          <button class="tiny-fairy-continue-btn" type="button" data-close-completion>Chơi tiếp</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector("[data-close-completion]").addEventListener("click", () => {
      overlay.remove();
      if (typeof options.onContinue === "function") options.onContinue();
    });
    return overlay;
  }

  window.TinyFairyProgress = {
    STORAGE_KEY,
    GAME_CATALOG,
    SHOP_ITEMS,
    load,
    save,
    reset,
    recordGameStart,
    completeGame,
    claimDailyReward,
    buyDecoration,
    updateSettings,
    showCompletionOverlay
  };
})();
