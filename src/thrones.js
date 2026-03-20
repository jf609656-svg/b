const HOUSES = {
  stark: {
    name: "House Stark",
    bonusText: "+2 Honor, +2 Army",
    stats: { honor: 2, army: 2 }
  },
  lannister: {
    name: "House Lannister",
    bonusText: "+70 Gold, +1 Influence",
    stats: { gold: 70, influence: 1 }
  },
  targaryen: {
    name: "House Targaryen",
    bonusText: "+1 Dragon, +2 Influence, +1 Suspicion",
    stats: { dragons: 1, influence: 2, suspicion: 1 }
  },
  baratheon: {
    name: "House Baratheon",
    bonusText: "+3 Army, +1 Honor",
    stats: { army: 3, honor: 1 }
  },
  greyjoy: {
    name: "House Greyjoy",
    bonusText: "+35 Gold, +1 Army, +2 Suspicion",
    stats: { gold: 35, army: 1, suspicion: 2 }
  }
};

const EVENT_POOL = [
  {
    title: "The King Requests Troops",
    text: "A raven from King's Landing demands soldiers for a northern campaign. Refusing may brand you disloyal.",
    choices: [
      {
        label: "Send your best soldiers",
        result: "Your banners answer quickly, and courtiers whisper your loyalty.",
        effect: { army: -1, influence: 2, honor: 1, gold: -20 }
      },
      {
        label: "Send a token force and hold back strength",
        result: "You keep power at home, but the crown is not impressed.",
        effect: { army: 0, influence: -1, suspicion: 1 }
      },
      {
        label: "Ignore the raven",
        result: "The insult is remembered in court.",
        effect: { influence: -2, honor: -1, suspicion: 2 }
      }
    ]
  },
  {
    title: "A Marriage Proposal",
    text: "A noble house offers marriage ties. The match is useful, but your heir objects loudly.",
    choices: [
      {
        label: "Accept for political strength",
        result: "Your alliance grows stronger, even if your household does not.",
        effect: { influence: 2, honor: -1, gold: 25 }
      },
      {
        label: "Refuse and protect your family's wishes",
        result: "The realm sees you as principled but less strategic.",
        effect: { honor: 2, influence: -1 }
      },
      {
        label: "Demand a heavy dowry before accepting",
        result: "You enrich your house, but seem opportunistic.",
        effect: { gold: 45, influence: 1, suspicion: 1 }
      }
    ]
  },
  {
    title: "Whispers of Treason",
    text: "Your spymaster reports a plot in your court. Acting too hard may spark fear; too soft may invite knives.",
    choices: [
      {
        label: "Arrest suspects immediately",
        result: "The plot is crushed, but fear grows in the halls.",
        effect: { influence: 1, suspicion: 2, honor: -1, risk: 0.2 }
      },
      {
        label: "Investigate quietly",
        result: "You uncover names slowly, keeping panic under control.",
        effect: { influence: 1, honor: 1, suspicion: -1, risk: 0.1 }
      },
      {
        label: "Publicly pardon everyone",
        result: "The realm praises your mercy, but conspirators stay bold.",
        effect: { honor: 2, suspicion: 1, risk: 0.25 }
      }
    ]
  },
  {
    title: "A Harsh Winter",
    text: "Crops fail and villages starve. You can feed the people, protect your treasury, or seize grain from rivals.",
    choices: [
      {
        label: "Open your stores to the smallfolk",
        result: "Your people survive and sing your name by firelight.",
        effect: { honor: 2, influence: 1, gold: -40 }
      },
      {
        label: "Ration carefully and stay neutral",
        result: "You weather the winter with limited losses.",
        effect: { honor: 0, influence: 0, gold: -10 }
      },
      {
        label: "Raid neighboring grain convoys",
        result: "Your stores are full, but your enemies now watch you.",
        effect: { gold: 30, army: 1, suspicion: 2, honor: -1 }
      }
    ]
  },
  {
    title: "The Tournament at Harrenhal",
    text: "Knights gather and wagers flood the grounds. Great reputations can be forged here.",
    choices: [
      {
        label: "Sponsor a champion",
        result: "Your colors are seen across the realm.",
        effect: { gold: -25, influence: 2, honor: 1 }
      },
      {
        label: "Attend and scheme in the shadows",
        result: "You leave with rumors, leverage, and a few enemies.",
        effect: { influence: 2, suspicion: 1 }
      },
      {
        label: "Skip the event and fortify your hold",
        result: "You remain secure but miss a key social stage.",
        effect: { army: 1, influence: -1 }
      }
    ]
  },
  {
    title: "The Iron Bank Calls",
    text: "The Iron Bank offers a loan to fund expansion. Debt can raise thrones and bury dynasties.",
    choices: [
      {
        label: "Take the loan and recruit mercenaries",
        result: "Your coffers swell and your banners multiply.",
        effect: { gold: 70, army: 2, suspicion: 1 }
      },
      {
        label: "Refuse and keep your independence",
        result: "You avoid debt, but your growth slows.",
        effect: { honor: 1, influence: -1 }
      },
      {
        label: "Borrow modestly for roads and ports",
        result: "Trade expands and your realm prospers.",
        effect: { gold: 30, influence: 1, honor: 1 }
      }
    ]
  },
  {
    title: "A Dragon Egg Appears",
    text: "A smuggler delivers a rumored dragon egg. Keeping it may inspire awe or fear.",
    choices: [
      {
        label: "Attempt to hatch it in secret",
        result: "A hatchling lives. Your house enters legend.",
        effect: { dragons: 1, influence: 2, suspicion: 2, risk: 0.15 }
      },
      {
        label: "Gift it to the crown",
        result: "The king rewards your loyalty generously.",
        effect: { honor: 2, influence: 1, gold: 40 }
      },
      {
        label: "Sell it abroad for gold",
        result: "You gain wealth but lose a rare chance at power.",
        effect: { gold: 80, honor: -1, influence: -1 }
      }
    ]
  },
  {
    title: "Rebellion on the Coast",
    text: "A minor lord refuses taxes and raises a local host.",
    choices: [
      {
        label: "Crush the rebellion with force",
        result: "The revolt ends in a day of steel and smoke.",
        effect: { army: -1, influence: 2, suspicion: 1 }
      },
      {
        label: "Offer terms and pardon rebels",
        result: "Bloodshed is avoided, but some call you weak.",
        effect: { honor: 2, influence: -1 }
      },
      {
        label: "Secretly fund both sides to profit",
        result: "Your coffers rise, and so do dangerous rumors.",
        effect: { gold: 40, influence: 1, suspicion: 2, risk: 0.2 }
      }
    ]
  },
  {
    title: "The Hand Dies Suddenly",
    text: "The Small Council seeks your voice in choosing the next Hand of the King.",
    choices: [
      {
        label: "Support a wise but poor candidate",
        result: "Your choice earns respect among honorable houses.",
        effect: { honor: 2, influence: 1 }
      },
      {
        label: "Back a ruthless ally",
        result: "You gain influence at the cost of trust.",
        effect: { influence: 2, suspicion: 1, honor: -1 }
      },
      {
        label: "Demand the office for yourself",
        result: "Your ambition stuns the court.",
        effect: { influence: 3, suspicion: 2, risk: 0.25 }
      }
    ]
  },
  {
    title: "The Faceless Threat",
    text: "A warning arrives: a Faceless assassin has been contracted against your bloodline.",
    choices: [
      {
        label: "Hire elite guards and lock down the keep",
        result: "Your home becomes a fortress overnight.",
        effect: { gold: -35, army: 1, suspicion: 1, risk: 0.15 }
      },
      {
        label: "Counter with your own spies",
        result: "Knives hunt knives in the dark.",
        effect: { influence: 2, gold: -15, risk: 0.18 }
      },
      {
        label: "Face fate publicly and hold court as usual",
        result: "Your courage inspires many, though danger remains.",
        effect: { honor: 2, influence: 1, risk: 0.3 }
      }
    ]
  }
];

const MAX_TURNS = 8;

const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const endingScreen = document.getElementById("ending-screen");
const houseList = document.getElementById("house-list");
const setupError = document.getElementById("setup-error");
const nameInput = document.getElementById("player-name");
const startButton = document.getElementById("start-button");
const turnLabel = document.getElementById("turn-label");
const houseChip = document.getElementById("house-chip");
const statsPanel = document.getElementById("stats-panel");
const eventTitle = document.getElementById("event-title");
const eventText = document.getElementById("event-text");
const choicesEl = document.getElementById("choices");
const logEl = document.getElementById("log");
const endingTitle = document.getElementById("ending-title");
const endingText = document.getElementById("ending-text");
const scoreLine = document.getElementById("score-line");
const restartButton = document.getElementById("restart-button");

let selectedHouse = "";

const state = {
  playerName: "",
  house: "",
  turn: 0,
  events: [],
  gameOver: false,
  stats: {
    influence: 2,
    honor: 2,
    gold: 80,
    army: 2,
    suspicion: 0,
    dragons: 0
  }
};

function makeHouseCards() {
  houseList.innerHTML = "";
  Object.entries(HOUSES).forEach(([key, house]) => {
    const card = document.createElement("button");
    card.className = "house-card";
    card.type = "button";
    card.setAttribute("role", "radio");
    card.setAttribute("aria-checked", "false");
    card.dataset.house = key;
    card.innerHTML = `
      <p class="house-name">${house.name}</p>
      <p class="house-bonus">${house.bonusText}</p>
    `;
    card.addEventListener("click", () => selectHouse(key));
    houseList.appendChild(card);
  });
}

function selectHouse(houseKey) {
  selectedHouse = houseKey;
  houseList.querySelectorAll(".house-card").forEach((card) => {
    const isSelected = card.dataset.house === houseKey;
    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-checked", isSelected ? "true" : "false");
  });
}

function resetState() {
  state.playerName = "";
  state.house = "";
  state.turn = 0;
  state.events = [];
  state.gameOver = false;
  state.stats = {
    influence: 2,
    honor: 2,
    gold: 80,
    army: 2,
    suspicion: 0,
    dragons: 0
  };
}

function startGame() {
  const rawName = nameInput.value.trim();
  if (!rawName) {
    setupError.textContent = "Enter a name to begin your rise.";
    return;
  }
  if (!selectedHouse) {
    setupError.textContent = "Choose a great house first.";
    return;
  }

  resetState();
  state.playerName = rawName;
  state.house = selectedHouse;
  applyHouseBonus(state.house);
  state.events = shuffleArray([...EVENT_POOL]).slice(0, MAX_TURNS);

  setupError.textContent = "";
  setupScreen.classList.add("hidden");
  endingScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  appendLog(`${state.playerName} of ${HOUSES[state.house].name} enters the game of thrones.`);
  render();
}

function applyHouseBonus(houseKey) {
  const bonus = HOUSES[houseKey].stats;
  Object.keys(bonus).forEach((key) => {
    state.stats[key] += bonus[key];
  });
}

function render() {
  if (state.gameOver) {
    return;
  }

  if (state.turn >= MAX_TURNS) {
    resolveEnding();
    return;
  }

  const event = state.events[state.turn];
  turnLabel.textContent = `Year ${state.turn + 1} of ${MAX_TURNS}`;
  houseChip.textContent = `${state.playerName} · ${HOUSES[state.house].name}`;
  eventTitle.textContent = event.title;
  eventText.textContent = event.text;
  renderStats();
  renderChoices(event);
}

function renderStats() {
  const labels = [
    ["influence", "Influence"],
    ["honor", "Honor"],
    ["gold", "Gold"],
    ["army", "Army"],
    ["suspicion", "Suspicion"],
    ["dragons", "Dragons"]
  ];

  statsPanel.innerHTML = labels
    .map(([key, label]) => {
      const value = state.stats[key];
      return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`;
    })
    .join("");
}

function renderChoices(event) {
  choicesEl.innerHTML = "";
  event.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.textContent = choice.label;
    button.addEventListener("click", () => makeChoice(choice, event.title));
    choicesEl.appendChild(button);
  });
}

function makeChoice(choice, eventName) {
  if (state.gameOver) {
    return;
  }

  appendLog(`Year ${state.turn + 1}: ${eventName}`);
  appendLog(`Choice: ${choice.label}`);
  applyEffect(choice.effect);
  appendLog(choice.result);

  if (choice.effect.risk) {
    const assassinationChance = calculateRisk(choice.effect.risk);
    if (Math.random() < assassinationChance) {
      endGame(
        "A silent blade finds you before dawn. Your banner falls, and rivals divide your lands."
      );
      return;
    }
    appendLog("You survive the danger... this time.");
  }

  state.turn += 1;
  render();
}

function applyEffect(effect) {
  Object.keys(effect).forEach((key) => {
    if (key === "risk") {
      return;
    }
    state.stats[key] += effect[key];
  });

  state.stats.influence = clamp(state.stats.influence, 0, 12);
  state.stats.honor = clamp(state.stats.honor, 0, 12);
  state.stats.gold = clamp(state.stats.gold, 0, 350);
  state.stats.army = clamp(state.stats.army, 0, 14);
  state.stats.suspicion = clamp(state.stats.suspicion, 0, 12);
  state.stats.dragons = clamp(state.stats.dragons, 0, 3);
}

function calculateRisk(baseRisk) {
  const modifier =
    state.stats.suspicion * 0.03 -
    state.stats.honor * 0.015 -
    state.stats.army * 0.015 -
    state.stats.dragons * 0.04;
  return clamp(baseRisk + modifier, 0.02, 0.75);
}

function resolveEnding() {
  const score =
    state.stats.influence * 2 +
    state.stats.honor * 1.5 +
    state.stats.army * 2 +
    state.stats.dragons * 4 +
    state.stats.gold / 25 -
    state.stats.suspicion * 2;

  let title = "Lord of a Fractured Realm";
  let text = "You survive the wars of whispers and steel, ruling your lands with cautious strength.";

  if (state.stats.influence >= 9 && state.stats.army >= 7 && state.stats.suspicion <= 7) {
    title = "Ruler of the Iron Throne";
    text = "You gather banners, bend rivals, and claim the Iron Throne. Songs of your victory echo through Westeros.";
  } else if (state.stats.honor >= 9 && state.stats.influence >= 7) {
    title = "Hand of the King";
    text = "The realm trusts your judgment. You become the power behind the crown and keep the kingdoms stable.";
  } else if (state.stats.gold >= 200 && state.stats.influence >= 6) {
    title = "Master of Coin";
    text = "You control the coin and, in time, the court itself. Few kings can move without your treasury.";
  } else if (state.stats.suspicion >= 9) {
    title = "Exiled Across the Narrow Sea";
    text = "Plots and rumors consume your name. You flee Westeros, dreaming of a return with fire and steel.";
  }

  endGame(text, title, score);
}

function endGame(text, title = "A House Falls", score = null) {
  state.gameOver = true;
  gameScreen.classList.add("hidden");
  endingScreen.classList.remove("hidden");
  endingTitle.textContent = title;
  endingText.textContent = text;
  const displayScore = score === null ? calculateLegacyScore() : score;
  scoreLine.textContent = `Legacy Score: ${displayScore.toFixed(1)}`;
}

function calculateLegacyScore() {
  return (
    state.stats.influence * 1.5 +
    state.stats.honor +
    state.stats.army * 1.4 +
    state.stats.dragons * 3 -
    state.stats.suspicion +
    state.stats.gold / 30
  );
}

function appendLog(entry) {
  const li = document.createElement("li");
  li.textContent = entry;
  logEl.prepend(li);
}

function restartGame() {
  selectedHouse = "";
  resetState();
  setupScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
  endingScreen.classList.add("hidden");
  setupError.textContent = "";
  nameInput.value = "";
  logEl.innerHTML = "";
  houseList.querySelectorAll(".house-card").forEach((card) => {
    card.classList.remove("selected");
    card.setAttribute("aria-checked", "false");
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

makeHouseCards();
