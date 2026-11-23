const inputSearch = document.getElementById("input-search");
const btnSearch = document.getElementById("btn-search");
const profileResults = document.querySelector(".profile-results");
const baseURL = "https://api.github.com";

function buscarUsuario(nomeUsuario) {
  console.log("Usuário buscado:", nomeUsuario);
}

function mostrarCarregando() {
  profileResults.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Buscando usuário...</p>
    </div>`;
  btnSearch.disabled = true;
}

function esconderCarregando() {
  btnSearch.disabled = false;
}

async function executarBusca() {
  if (btnSearch.disabled) return;

  const userName = inputSearch.value.trim();

  if (userName === "") {
    alert("Digite um nome de usuário do GitHub");
    return;
  }

  mostrarCarregando();

  try {
    const response = await fetch(
      `${baseURL}/users/${encodeURIComponent(userName)}`,
    );

    if (!response.ok) {
      profileResults.innerHTML = "";
      alert(
        "Usuário não encontrado. Por favor, verifique o nome de usuário e tente novamente.",
      );
      return;
    }

    const userData = await response.json();
    const nome = userData.name ?? userData.login;

    profileResults.innerHTML = `
      <div class="profile-card">
        <img src="${userData.avatar_url}" alt="Avatar de ${nome}" class="avatar">
        <div class="profile-info">
          <h2>${nome}</h2>
          <p>${userData.bio || "Não possui bio cadastrada 😢"}</p>
        </div>
      </div>`;

    buscarUsuario(userName);
  } catch (erro) {
    profileResults.innerHTML = "";
    alert("Erro de conexão. Tente novamente.");
    console.error(erro);
  } finally {
    esconderCarregando();
  }
}

btnSearch.addEventListener("click", executarBusca);

inputSearch.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    executarBusca();
  }
});



