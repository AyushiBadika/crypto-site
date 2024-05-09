document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const coinIdFromUrl = urlParams.get("coin");

  const coinName = document.querySelector(".coinName");
  const coinAddress = document.querySelector(".coinAddress");
  const coinImage = document.querySelector(".coinImage");
  const coinMarketCapRank = document.querySelector(".coinMarketCapRank");
  const coinMarketData = document.querySelector(".coinMarketData");
  const coinDesc = document.querySelector(".coinDesc");
  const ctx = document.getElementById("chart");
  const loader = document.querySelector(".lds-roller");
  const main = document.querySelector(".main");

  fetchCoin(coinIdFromUrl);
  addChartData(coinIdFromUrl);

  async function fetchCoin(coin) {
    await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin.toString().toLowerCase()}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        coinName.innerHTML = `${data.name}`;

        coinImage.src = data.image.large;
        coinMarketCapRank.innerHTML = `<b>Market Cap Rank :</b> ${data.market_cap_rank}`;
        coinMarketData.innerHTML = `<b>Market Price :</b> ₹${data.market_data.current_price.inr},  $${data.market_data.current_price.usd}, AUD ${data.market_data.current_price.aud}, €${data.market_data.current_price.eur}`;
        coinDesc.innerHTML = data.description.en;

        loader.style.display = "none";
        main.style.display = "block";
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Price history chart from 1-jan-24
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Price INR",
          data: [],
          backgroundColor: "white",
          borderColor: "white",
          borderWidth: 2,
          labelColor: "white",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "white",
          },
          beginAtZero: true,
        },
        x: {
          ticks: {
            color: "white",
          },
          beginAtZero: true,
        },
      },
    },
  });

  async function addChartData(coin) {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?vs_currency=inr&from=${Math.floor(
        new Date(2023, 11, 31, 23, 59, 59).getTime() / 1000
      )}&to=${Math.floor(Date.now() / 1000)}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.prices);
        data.prices.forEach((price) => {
          const date = new Date(price[0]);

          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear().toString().slice(-2);
          const formattedDate = `${day}-${month}-${year}`;

          myChart.data.labels.push(formattedDate);
          myChart.data.datasets[0].data.push(price[1]);
        });
        myChart.update();
      })
      .catch((error) => console.log(error));
  }
});
