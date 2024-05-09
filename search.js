document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");
  const searchResultsList = document.querySelector(".search-results-list");
  const searchResults = document.querySelector(".search-results");
  const overlay = document.querySelector(".overlay");
  const moreInfo = document.querySelector(".moreInfo");
  const loader = document.querySelector(".lds-roller");

  let searchTimeout;

  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);

  const searchQueryFromUrl = urlParams.get("query");
  console.log(searchQueryFromUrl);

  if (
    searchQueryFromUrl != null &&
    searchQueryFromUrl != undefined &&
    searchQueryFromUrl != "" &&
    !(searchQueryFromUrl.length < 3)
  ) {
    searchInput.value = searchQueryFromUrl;
    searchCoin(searchQueryFromUrl);
  }

  searchInput.addEventListener("input", () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchCoin(searchInput.value);
    }, 1000);
  });

  async function searchCoin(query) {
    searchResultsList.innerHTML = "";
    searchResultsList.style.display = "none";
    loader.style.display = "inline-block";
    if (
      query != null &&
      query != undefined &&
      query != "" &&
      !(query.length < 3)
    ) {
      searchResults.style.display = "flex";
      await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query
          .toString()
          .toLowerCase()}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.coins.length <= 0) {
            const noSearchResults = document.createElement("div");
            noSearchResults.innerHTML = `No results for ${query}`;
            noSearchResults.style.fontSize = "1.5rem";
            searchResultsList.append(noSearchResults);
          } else {
            data.coins.forEach((coin) => {
              createCoinCard(coin.id, coin.large, coin.name);
            });
          }
        })
        .catch((error) => {
          const errorInSearch = document.createElement("div");
          errorInSearch.innerHTML = `${error}`;
          errorInSearch.style.fontSize = "1.5rem";
          searchResultsList.append(errorInSearch);
        });

      loader.style.display = "none";
      searchResultsList.style.display = "flex";
    } else {
      searchResults.style.display = "none";
      console.log(query.length);
    }
  }

  function createCoinCard(id, image, name) {
    // Coin card
    const coinCard = document.createElement("div");
    coinCard.classList.add("coin-card");

    // Coin image div
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("coin-image");

    const imageTag = document.createElement("img");
    imageTag.src = `${image}`;
    imageDiv.append(imageTag);

    // Coin name div
    const coinNameId = document.createElement("div");
    coinNameId.classList.add("coin-name");
    coinNameId.innerHTML = `${name}`;

    // show more button
    const showMore = document.createElement("button");
    showMore.innerHTML = "Show More";
    showMore.classList.add("btn");

    // Appeding all div in coin card
    coinCard.append(imageDiv, coinNameId, showMore);
    showMore.addEventListener("click", () => {
      window.location.href = `/crypto-site/crypto.html?coin=${id}`;
    });
    // Appeding coin card in trending section
    searchResultsList.append(coinCard);
  }
});
