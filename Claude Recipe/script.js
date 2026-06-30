// script.js — our app's brain. We'll add behavior here step by step.

// The base URL for every TheMealDB request. The "1" is the free test key.
const API_BASE = "https://www.themealdb.com/api/json/v1/1/";

// Grab the elements we'll need from the page so we can react to them later.
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const surpriseBtn = document.getElementById("surprise-btn");
const resultsEl = document.getElementById("results");
const suggestionsEl = document.getElementById("suggestions");
const suggestionsTitle = document.getElementById("suggestions-title");
const suggestionsGrid = document.getElementById("suggestions-grid");
const favoritesBtn = document.getElementById("favorites-btn");
const favoritesCount = document.getElementById("favorites-count");
const favoritesEl = document.getElementById("favorites");
const favoritesGrid = document.getElementById("favorites-grid");
const recipePanel = document.getElementById("recipe-panel");
const panelContent = document.getElementById("panel-content");
const panelFullscreenBtn = document.getElementById("panel-fullscreen");
const panelMinimizeBtn = document.getElementById("panel-minimize");
const panelCloseBtn = document.getElementById("panel-close");
const minTray = document.getElementById("min-tray");

// ---- Step 2: Search for meals by name ----

// Ask TheMealDB for meals matching the given name, then show them.
// "async" lets us use "await" to wait for the network without freezing the page.
async function searchMeals(query) {
  // Starting a search closes the favorites view so results take the spotlight.
  favoritesEl.hidden = true;

  // Empty box? Nudge the user instead of searching for nothing.
  if (!query.trim()) {
    resultsEl.innerHTML = "<p>Search for an ingredient or Dish name.</p>";
    return;
  }

  // Let the user know something is happening while we wait for the network.
  resultsEl.innerHTML = "<p>Searching...</p>";

  try {
    // Build the full URL and fetch it. encodeURIComponent makes spaces/symbols safe.
    const response = await fetch(API_BASE + "search.php?s=" + encodeURIComponent(query));

    // Turn the raw response into a JavaScript object we can read.
    const data = await response.json();

    // TheMealDB returns { meals: [...] }, or { meals: null } when nothing matches.
    if (!data.meals) {
      resultsEl.innerHTML =
        "<p>Oh bummer. Looks like there aren't any matches. " +
        "Try another ingredient or dish name.</p>";
      return;
    }

    // We have results — draw them as cards.
    displayMeals(data.meals);

    // Use prior history + these results to suggest more meals, then
    // remember these ingredients so future searches get smarter.
    updateSuggestions(data.meals);
    recordIngredients(data.meals);
  } catch (error) {
    // Network failed, no internet, etc. Show a friendly message and log details.
    console.error(error);
    resultsEl.innerHTML =
      "<p>Oh no! Looks like there is a connectivity issue. Please try again.</p>";
  }
}

// Build the HTML for a single meal card. Used by results, suggestions, and
// the favorites list. The data-id lets us know which meal was clicked later
// (for the recipe view), and the heart toggles this meal in/out of favorites.
function cardHTML(meal) {
  const fav = isFavorite(meal.idMeal);
  const favLabel = fav ? "Remove from favorites" : "Save to favorites";
  return (
    '<article class="card" data-id="' + meal.idMeal + '">' +
    '<button class="fav-toggle' + (fav ? " is-fav" : "") + '" ' +
    'title="' + favLabel + '" aria-label="' + favLabel + '">' +
    (fav ? "♥" : "♡") +
    "</button>" +
    '<img src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '" />' +
    '<h3>' + meal.strMeal + "</h3>" +
    "</article>"
  );
}

// Take an array of meals and turn each into a card in the results section.
function displayMeals(meals) {
  // Build one chunk of HTML for all meals, then drop it in once (faster + simpler).
  resultsEl.innerHTML = meals.map(cardHTML).join("");
}

// ---- Favorites: heart-to-save, persisted in localStorage ----

// Load saved favorites. Shape: { idMeal: { idMeal, strMeal, strMealThumb } },
// keyed by id so lookups and de-duping are trivial.
function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || {};
  } catch (error) {
    return {};
  }
}

let favorites = loadFavorites();

// Is this meal currently saved?
function isFavorite(id) {
  return Object.prototype.hasOwnProperty.call(favorites, id);
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Keep the "(n)" count in the header button in sync.
function updateFavoritesCount() {
  favoritesCount.textContent = "(" + Object.keys(favorites).length + ")";
}

// Repaint every heart for this meal — the same recipe can appear in results,
// suggestions, and the favorites list at once, so update them all.
function refreshFavoriteIcons(id) {
  const fav = isFavorite(id);
  const label = fav ? "Remove from favorites" : "Save to favorites";
  document
    .querySelectorAll('.card[data-id="' + id + '"] .fav-toggle')
    .forEach(function (btn) {
      btn.classList.toggle("is-fav", fav);
      btn.textContent = fav ? "♥" : "♡";
      btn.title = label;
      btn.setAttribute("aria-label", label);
    });
}

// Add or remove a meal from favorites. We only need id/name/thumb to re-draw
// its card later, so that's all we store.
function toggleFavorite(id, name, thumb) {
  if (isFavorite(id)) {
    delete favorites[id];
  } else {
    favorites[id] = { idMeal: id, strMeal: name, strMealThumb: thumb };
  }
  saveFavorites();
  updateFavoritesCount();
  refreshFavoriteIcons(id);

  // If the favorites view is open, keep it current (e.g. removing the last one
  // should immediately show the empty state).
  if (!favoritesEl.hidden) renderFavorites();
}

// Draw the favorites grid from what's saved.
function renderFavorites() {
  const saved = Object.values(favorites);
  favoritesGrid.innerHTML = saved.length
    ? saved.map(cardHTML).join("")
    : '<p class="favorites-empty">No favorites yet. Tap the ♥ on any recipe to save it here.</p>';
}

// Show or hide the favorites section when the header button is clicked.
function toggleFavoritesView() {
  if (favoritesEl.hidden) {
    renderFavorites();
    favoritesEl.hidden = false;
    favoritesEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    favoritesEl.hidden = true;
  }
}

// ---- "Suggested for you": history-aware recommendations ----

// Read a meal's ingredients. TheMealDB spreads them across strIngredient1..20,
// with empty strings once a recipe runs out, so we collect the non-empty ones.
function getIngredients(meal) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal["strIngredient" + i];
    if (ingredient && ingredient.trim()) {
      list.push(ingredient.trim().toLowerCase());
    }
  }
  return list;
}

// Load the ingredient history from the browser's localStorage (survives refresh).
// It's a simple object of { ingredientName: timesSeen }.
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem("ingredientHistory")) || {};
  } catch (error) {
    return {};
  }
}

// Our running tally of every ingredient we've ever seen in a search.
let ingredientHistory = loadHistory();

// Add the ingredients from these meals to our history and save it.
function recordIngredients(meals) {
  meals.forEach(function (meal) {
    getIngredients(meal).forEach(function (ingredient) {
      ingredientHistory[ingredient] = (ingredientHistory[ingredient] || 0) + 1;
    });
  });
  localStorage.setItem("ingredientHistory", JSON.stringify(ingredientHistory));
}

// Decide which single ingredient best represents what the user is into.
// We score each ingredient by how central it is to the current results PLUS
// how often it has shown up across past searches (the "history" part).
function pickSuggestionIngredient(meals) {
  // Count how many of the current meals contain each ingredient.
  const current = {};
  meals.forEach(function (meal) {
    getIngredients(meal).forEach(function (ingredient) {
      current[ingredient] = (current[ingredient] || 0) + 1;
    });
  });

  // Skip pantry staples — "salt" appears everywhere and isn't a useful theme.
  const skip = ["salt", "water", "sugar", "olive oil", "oil", "pepper", "butter", "flour"];

  let best = null;
  let bestScore = -1;
  Object.keys(current).forEach(function (ingredient) {
    if (skip.indexOf(ingredient) !== -1) return;
    const score = current[ingredient] + (ingredientHistory[ingredient] || 0);
    if (score > bestScore) {
      bestScore = score;
      best = ingredient;
    }
  });
  return best;
}

// Fetch and show up to 3 distinct meals related to the user's interests.
async function updateSuggestions(currentMeals) {
  const ingredient = pickSuggestionIngredient(currentMeals);
  if (!ingredient) {
    suggestionsEl.hidden = true;
    return;
  }

  // IDs already on screen, so suggestions don't repeat the search results.
  const shownIds = currentMeals.map(function (meal) { return meal.idMeal; });

  try {
    // filter.php?i= returns meals containing this ingredient (id, name, image only).
    const response = await fetch(API_BASE + "filter.php?i=" + encodeURIComponent(ingredient));
    const data = await response.json();

    // No matches → just hide the section.
    if (!data.meals) {
      suggestionsEl.hidden = true;
      return;
    }

    // Drop anything already shown, then keep the first 3 distinct meals.
    const picks = data.meals
      .filter(function (meal) { return shownIds.indexOf(meal.idMeal) === -1; })
      .slice(0, 3);

    if (picks.length === 0) {
      suggestionsEl.hidden = true;
      return;
    }

    suggestionsTitle.textContent = 'Suggested for you — more with "' + ingredient + '"';
    suggestionsGrid.innerHTML = picks.map(cardHTML).join("");
    suggestionsEl.hidden = false; // reveal the section (it starts hidden)
  } catch (error) {
    console.error(error);
    suggestionsEl.hidden = true;
  }
}

// ---- Step 3: The full-recipe panel ----

// What's currently shown, what's minimized, and how the panel is displayed.
let activeRecipe = null;      // the meal object showing in the panel (or null)
let minimizedRecipes = [];    // meals sitting as tabs at the bottom
let panelMode = "docked";     // "docked" or "full"
const MAX_MINIMIZED = 5;      // your rule: no more than 5 minimized tabs

// Fetch a single meal's full details by its id. Search results already carry
// this data, but suggestion cards (from filter.php) don't — so we always look
// up by id to keep one consistent path.
async function lookupMeal(id) {
  const response = await fetch(API_BASE + "lookup.php?i=" + encodeURIComponent(id));
  const data = await response.json();
  return data.meals ? data.meals[0] : null;
}

// Pull ingredient + measurement pairs out of a meal (strIngredient1/strMeasure1...).
function getIngredientPairs(meal) {
  const pairs = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal["strIngredient" + i];
    const measure = meal["strMeasure" + i];
    if (ingredient && ingredient.trim()) {
      pairs.push({ ingredient: ingredient.trim(), measure: (measure || "").trim() });
    }
  }
  return pairs;
}

// Build the inner HTML of the panel for a given meal.
function renderPanelContent(meal) {
  const items = getIngredientPairs(meal)
    .map(function (pair) {
      return (
        "<li><span>" + pair.ingredient + "</span>" +
        '<span class="measure">' + pair.measure + "</span></li>"
      );
    })
    .join("");

  // Instructions arrive as one big text block; split on line breaks into paragraphs.
  const instructions = (meal.strInstructions || "")
    .split("\n")
    .filter(function (line) { return line.trim(); })
    .map(function (line) { return "<p>" + line + "</p>"; })
    .join("");

  return (
    '<img class="panel-img" src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '" />' +
    "<h2>" + meal.strMeal + "</h2>" +
    '<p class="panel-meta">' + (meal.strCategory || "") + " · " + (meal.strArea || "") + "</p>" +
    "<h3>Ingredients</h3>" +
    '<ul class="ingredient-list">' + items + "</ul>" +
    "<h3>Instructions</h3>" +
    '<div class="instructions">' + instructions + "</div>"
  );
}

// --- Showing / hiding / sizing the panel ---

function showPanel() {
  recipePanel.hidden = false;
  document.body.classList.add("panel-open"); // triggers the "shift left" CSS
}

function hidePanel() {
  recipePanel.hidden = true;
  document.body.classList.remove("panel-open");
  recipePanel.classList.remove("fullscreen");
}

// Apply the current panelMode ("docked" or "full") to the panel.
function applyPanelMode() {
  if (panelMode === "full") {
    recipePanel.classList.add("fullscreen");
  } else {
    recipePanel.classList.remove("fullscreen");
  }
}

// --- The main actions ---

// Open a recipe by id. Reuses what's already open/minimized when possible.
async function openRecipe(id) {
  // Already the active recipe? Just make sure it's docked and visible.
  if (activeRecipe && activeRecipe.idMeal === id) {
    panelMode = "docked";
    applyPanelMode();
    return;
  }

  // Sitting in the tray? Restore it instead of fetching again.
  if (minimizedRecipes.some(function (m) { return m.idMeal === id; })) {
    restoreFromTray(id);
    return;
  }

  // A different recipe is open — tuck it into the tray first.
  if (activeRecipe) minimizeActive();

  // Show the panel with a loading message while we fetch.
  showPanel();
  panelMode = "docked";
  applyPanelMode();
  panelContent.innerHTML = '<p style="padding:1rem">Loading recipe…</p>';

  try {
    const meal = await lookupMeal(id);
    if (!meal) {
      panelContent.innerHTML = '<p style="padding:1rem">Sorry, could not load that recipe.</p>';
      return;
    }
    activeRecipe = meal;
    panelContent.innerHTML = renderPanelContent(meal);
  } catch (error) {
    console.error(error);
    panelContent.innerHTML =
      '<p style="padding:1rem">Oh no! Looks like there is a connectivity issue. Please try again.</p>';
  }
}

// Toggle between docked and fullscreen.
function toggleFullscreen() {
  panelMode = panelMode === "full" ? "docked" : "full";
  applyPanelMode();
}

// Move the active recipe down into the tab tray.
function minimizeActive() {
  if (!activeRecipe) return;

  // Don't add a duplicate tab for the same meal.
  const alreadyThere = minimizedRecipes.some(function (m) {
    return m.idMeal === activeRecipe.idMeal;
  });
  if (!alreadyThere) {
    minimizedRecipes.push(activeRecipe);
    // Enforce the 5-tab cap by dropping the oldest.
    if (minimizedRecipes.length > MAX_MINIMIZED) {
      minimizedRecipes.shift();
    }
  }

  activeRecipe = null;
  hidePanel();
  renderTray();
}

// Fully close the panel without keeping a tab.
function closePanel() {
  activeRecipe = null;
  hidePanel();
}

// Bring a minimized recipe back into the docked panel.
function restoreFromTray(id) {
  const meal = minimizedRecipes.find(function (m) { return m.idMeal === id; });
  if (!meal) return;

  // Remove it from the tray, and tuck away whatever is currently open.
  minimizedRecipes = minimizedRecipes.filter(function (m) { return m.idMeal !== id; });
  if (activeRecipe) minimizeActive();

  activeRecipe = meal;
  showPanel();
  panelMode = "docked";
  applyPanelMode();
  panelContent.innerHTML = renderPanelContent(meal);
  renderTray();
}

// Draw the row of minimized tabs.
function renderTray() {
  minTray.innerHTML = minimizedRecipes
    .map(function (meal) {
      return (
        '<div class="min-tab" data-id="' + meal.idMeal + '">' +
        '<img src="' + meal.strMealThumb + '" alt="" />' +
        '<span class="min-tab-title">' + meal.strMeal + "</span>" +
        '<button class="min-tab-close" data-close="' + meal.idMeal + '" title="Close">✕</button>' +
        "</div>"
      );
    })
    .join("");
}

// --- Wiring up the panel's interactions ---

// Clicking any card (in results, suggestions, OR favorites) opens that recipe —
// unless the click landed on the heart, which saves/unsaves instead of opening.
document.addEventListener("click", function (event) {
  const favBtn = event.target.closest(".fav-toggle");
  if (favBtn) {
    const card = favBtn.closest(".card");
    const img = card.querySelector("img");
    toggleFavorite(
      card.getAttribute("data-id"),
      img ? img.alt : "",
      img ? img.src : ""
    );
    return; // don't fall through to opening the recipe
  }

  const card = event.target.closest(".card");
  if (card && card.getAttribute("data-id")) {
    openRecipe(card.getAttribute("data-id"));
  }
});

// The header "My Favorites" button toggles the favorites view.
favoritesBtn.addEventListener("click", toggleFavoritesView);

// Reflect any previously-saved favorites in the header count on load.
updateFavoritesCount();

// Toolbar buttons.
panelFullscreenBtn.addEventListener("click", toggleFullscreen);
panelMinimizeBtn.addEventListener("click", minimizeActive);
panelCloseBtn.addEventListener("click", closePanel);

// Tray clicks: the ✕ closes a tab, clicking the rest of the tab restores it.
minTray.addEventListener("click", function (event) {
  const closeBtn = event.target.closest(".min-tab-close");
  if (closeBtn) {
    const id = closeBtn.getAttribute("data-close");
    minimizedRecipes = minimizedRecipes.filter(function (m) { return m.idMeal !== id; });
    renderTray();
    return;
  }
  const tab = event.target.closest(".min-tab");
  if (tab) {
    restoreFromTray(tab.getAttribute("data-id"));
  }
});

// ---- Wire up the controls so they actually do something ----

// Clicking Search runs a search using whatever is in the box.
searchBtn.addEventListener("click", function () {
  searchMeals(searchInput.value);
});

// Pressing Enter in the box also searches — a nice convenience.
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchMeals(searchInput.value);
  }
});

// ---- Step 4: "Surprise me" — open a totally random recipe ----

// random.php returns one full meal at random. We grab its id and hand it to
// openRecipe, so it flows through the exact same panel/tab logic as a card click.
async function surpriseMe() {
  try {
    const response = await fetch(API_BASE + "random.php");
    const data = await response.json();
    if (data.meals && data.meals[0]) {
      openRecipe(data.meals[0].idMeal);
    }
  } catch (error) {
    console.error(error);
    resultsEl.innerHTML =
      "<p>Oh no! Looks like there is a connectivity issue. Please try again.</p>";
  }
}

surpriseBtn.addEventListener("click", surpriseMe);

// Quick proof that the script is wired up. Open the browser console to see it.
console.log("Recipe Finder loaded. API base:", API_BASE);
