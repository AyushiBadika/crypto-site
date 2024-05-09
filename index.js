document.addEventListener("DOMContentLoaded", function () {
  const trendingCoinsSection = document.querySelector(".trending-coins-list");
  const overlay = document.querySelector(".overlay");
  const moreInfo = document.querySelector(".moreInfo");
  const searchBtn = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search-input");

  searchBtn.addEventListener("click", () => {
    window.location.href = `/crypto-site/search.html?query=${searchInput.value}`;
  });

  async function getTrending() {
    await fetch("https://api.coingecko.com/api/v3/search/trending")
      .then((response) => response.json())
      .then((data) => {
        data.coins.forEach((coin) => {
          // console.log(coin.item);
          createCoinCard(
            coin.item.id,
            coin.item.large,
            coin.item.name,
            coin.item.data.price
          );
        });
      })
      .catch((error) => console.log("Error fetching trending coins : ", error));
  }

  function createCoinCard(id, image, name, price) {
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

    // Coin price div
    const coinPrice = document.createElement("div");
    coinPrice.classList.add("coin-price-usd");
    coinPrice.innerHTML = `Price $${Math.round(price * 10000) / 10000}`;

    // show more button
    const showMore = document.createElement("button");
    showMore.innerHTML = "Show More";
    showMore.classList.add("btn");

    // Appeding all div in coin card
    coinCard.append(imageDiv, coinNameId, coinPrice, showMore);
    showMore.addEventListener("click", () => {
      window.location.href = `/crypto-site/crypto.html?coin=${id}`;
    });
    // Appeding coin card in trending section
    trendingCoinsSection.append(coinCard);
  }

  getTrending();
});
