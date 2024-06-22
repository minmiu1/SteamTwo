const BASE_URL = " https://steam-api-dot-cs-platform-306304.et.r.appspot.com";
let nextPage = 1;
let genres = "";

const getAllGames = async () => {
    try {
    let url = `${BASE_URL}/games?limit=20&page=${nextPage}`;
    if (genres) {
        url += `&genres=${genres}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    // console.log("all game", data);
    return data;
    } catch (error) {
        console.log("error", error);
    }
}

// getAllGames();

const renderAllGames = async (i = 1) => {
    try {
        if (i === '+') {
            nextPage++;
        } else if (i === '-') {
            if (nextPage > 1) {
                nextPage--;
            }
        } else {
            nextPage = i;
        }

        // Adjust the page number
        if (nextPage >= 5) {
            const btnLast = document.querySelector("#btn5");
            const btnFirst = document.querySelector("#btn1");
            const btnSecond = document.querySelector("#btn2");
            const btnThird = document.querySelector("#btn3");
            const btnForth = document.querySelector("#btn4");

            btnLast.textContent = nextPage;
            // console.log(nextPage);
            btnForth.textContent = nextPage-1;
            // console.log(nextPage);
            btnThird.textContent = nextPage-2;
            // console.log(nextPage);
            btnSecond.textContent = nextPage-3;
            // console.log(nextPage);
            btnFirst.textContent = nextPage-4;
        } 

        // disabled button when text page < 1
        if (nextPage <= 1) {
            document.querySelector(".btn-pre").disabled = true;
        } else {
            document.querySelector(".btn-pre").disabled = false;
        }
        
        // Adjust the color when going to that page
        const buttonPages = document.querySelector(".btn-group");
        for (i = 0; i < buttonPages.children.length; i++) {
            const button =  buttonPages.children[i];
            // console.log(button);
            if (button.textContent == nextPage) {
                button.classList.add("current-page");
            } else {
                button.classList.remove("current-page");
            }
        }

        const games = await getAllGames();
        const gamesList = document.getElementById("display");
        gamesList.innerHTML = "";
        games.data.forEach((game) => {
            const gameCard = document.createElement("div");
            gameCard.innerHTML = `<div class="game-wrapper">
            <div class="cover" onclick="gameDetail(${game.appid})">
                <img src="${
                    game.header_image
                    }";
                    data-id="${game._id}">
                <div class="game-info">
                    <p>${game.name}</p>
                    <p></p>
                </div>
            </div>
        </div>`;
        gamesList.appendChild(gameCard);
         })
    } catch (error) {
        console.log("error", error);
    }
}
renderAllGames();




const getGenresList = async () => {
    try {
        const url = `${BASE_URL}/genres`;
        const response = await fetch(url);
        const data = await response.json();
        // console.log("genres",data);
        return data;
    } catch (error) {
        console.log("error", error);
    }
}

// getGenresList();
const renderGenres = async () => {
    try {
        const data = await getGenresList();
        const  category = document.querySelector(".category");
        category.innerHTML = "";
        data.data.forEach((genre) => {
            const genreCard = document.createElement("div");
            genreCard.className = "categoryGroup";
            genreCard.innerHTML = `<div class="each-category" onclick = "onclickByRender('${genre.name}')">${genre.name}</div>`;
            category.appendChild(genreCard);
    })
    } catch (error) {
        console.log("error", error);
    }
}
renderGenres();

const getSingleGame = async (appid) => {
    try {
        const url = `${BASE_URL}/single-game/${appid}`;
        console.log(url)
        const response = await fetch(url);
        const data = await response.json();
        return data;
        // console.log("single Game", data);
    } catch (error) {
        console.log("error", error);
    }
}

// getSingleGame();
const gameDetail = async (appid) => {
    try {
        const nextButton = document.querySelector(".btn-group");
        const displayTitle = document.querySelector(".displayTitle");
        const showingGame = document.querySelector("#display");
        showingGame.innerHTML = `<div class="loading">Loading. . .</div>`;
        const detail = await getSingleGame(appid);
        const data = detail.data;
        if(data) {
            // console.log(data);
            let steamspyTags = "";
            for (i=0 ; i<data.steamspy_tags.length; i++) {
                steamspyTags += `<span class="tag">${data.steamspy_tags[i]}</span>`;
            }
            nextButton.innerHTML="";
            displayTitle.textContent = data.name;
            showingGame.innerHTML = "";
            const game = document.createElement("div");
            game.innerHTML = `<div class="showing_game show_detail">
            <div class="title_contain">
            <div class="title">${data.name}</div>
            <div class="price">$${data.price}</div>
            </div>
            <div class="img_detail">
            <img
            src="${data.header_image}"
            />
            <div class="game_details">
            <div class="game_description">${data.description}</div>
            <div class="game_informations">
            <p>RELEASE DATE:  ${new Date(data.release_date)}</p> 
            <p>DEVELOPER:  ${data.developer}</p>
            </div>
            </div>
            </div>
            <div class="tags_contain">
            Popular user-defined tags for this product:
            <div>${steamspyTags}</div>
            </div>
            <button class="back"><a href="index.html">Back</a></button>
            </div>
            `;
            showingGame.append(game);

        } else {
            console.log("gameDetail", error);
        }

    } catch (error) {
        console.log("gameDetail error", error);
    }
}

// gameDetail();

// search game
const searchIcon = document.querySelector(".search-icon");


const gameAccordingName = async () => {
try {
    const searchInput = document.querySelector("#searchForm");
    const searchValue = searchInput.value.toLowerCase().trim();
    const url = `${BASE_URL}/games?q=${searchValue}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
    // console.log(data);
} catch (error) {
    console.log("gameAccordingName", error);
}
}

// gameAccordingName("dota 2");

async function  showGameAccordingName() {
    try {
        const nextButton = document.querySelector(".btn-group");
        const dataName = await gameAccordingName();
        const gamesList = document.getElementById("display");
        gamesList.innerHTML = "";
        nextButton.innerHTML = "";
        console.log(gamesList);
        console.log(dataName);
        dataName.data.forEach((game) => {
            const gameAccName = document.createElement("div");
            gameAccName.innerHTML = `<div class="game-wrapper">
            <div class="cover" onclick="gameDetail(${game.appid})">
                <img src="${game.header_image}";
                    data-id="${game._id}">
                <div class="game-info">
                    <p>${game.name}</p>
                    <p></p>
                </div>
            </div>
        </div>`;
        gamesList.appendChild(gameAccName);
        })
    } catch (error) {
        console.log("showGameAccordingName", error);
    }
}


searchIcon.addEventListener("click", () => {
    showGameAccordingName();
})

// showing games according to genres
// const eachCategory = document.querySelectorAll(".each-category");
// console.log()

function onclickByRender(genresName) {
    genres = genresName;
    renderAllGames();
}

