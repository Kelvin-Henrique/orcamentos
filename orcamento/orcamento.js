document.addEventListener("DOMContentLoaded", function () {
  const tbody = document.querySelector("tbody");
  const entradasElement = document.getElementById("entradas");
  const saidasElement = document.getElementById("saidas");
  const totalElement = document.getElementById("total");

  let totalEntradas = 0;
  let totalSaidas = 0;

  const modal = document.getElementById("editModal");
  const span = document.getElementsByClassName("close")[0];
  const modalForm = document.getElementById("modal-form");

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  function carregarOrcamentos(usuarioId) {
    fetch(`https://localhost:44343/orcamento/${usuarioId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar orçamentos");
        }
        return response.json();
      })
      .then((data) => {
        tbody.innerHTML = "";

        data.forEach((orcamento) => {
          const formattedValor = formatCurrency(orcamento.valor);

          const row = document.createElement("tr");
          row.innerHTML = `
                  <td>${orcamento.descricao}</td>
                  <td>${formattedValor}</td>
                  <td>${orcamento.tipo}</td>
                  <td>${new Date(orcamento.data).toLocaleDateString(
                    "pt-BR"
                  )}</td>
                  <td>
                      <button class="btn-editar" data-id="${
                        orcamento.id
                      }">Editar</button>
                      <button class="btn-excluir" data-id="${
                        orcamento.id
                      }">Excluir</button>
                  </td>
              `;
          tbody.appendChild(row);

          if (orcamento.tipo === "entrada") {
            totalEntradas += orcamento.valor;
          } else if (orcamento.tipo === "saida") {
            totalSaidas += orcamento.valor;
          }
        });

        entradasElement.textContent = formatCurrency(totalEntradas);
        saidasElement.textContent = formatCurrency(totalSaidas);
        totalElement.textContent = formatCurrency(totalEntradas - totalSaidas);

        document.querySelectorAll(".btn-excluir").forEach((btn) => {
          btn.addEventListener("click", () => {
            const orcamentoId = btn.getAttribute("data-id");
            if (confirm("Deseja realmente excluir este orçamento?")) {
              excluirOrcamento(orcamentoId);
            }
          });
        });

        document.querySelectorAll(".btn-editar").forEach((btn) => {
          btn.addEventListener("click", () => {
            const orcamentoId = btn.getAttribute("data-id");
            carregarOrcamentoParaEdicao(orcamentoId);
          });
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar orçamentos:", error);
        alert("Erro ao carregar orçamentos");
      });
  }

  const form = document.getElementById("orcamento-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;
    const data = new Date().toISOString();

    const usuario = {
      Id: parseInt(localStorage.getItem("token")),
      Nome: "Fulano de Tal",
      Email: "fulano@example.com",
      Senha: "senha123",
    };

    const formData = {
      Descricao: descricao,
      Valor: valor,
      Tipo: tipo,
      Data: data,
      UsuarioId: parseInt(localStorage.getItem("token")),
      Usuario: usuario,
    };

    fetch("https://localhost:44343/orcamento/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao cadastrar orçamento");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("descricao").value = "";
        document.getElementById("valor").value = "";
        document.getElementById("tipo").value = "";

        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao cadastrar orçamento");
      });
  });

  modalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const orcamentoId = document.getElementById("modal-orcamento-id").value;
    const descricao = document.getElementById("modal-descricao").value;
    const valor = parseFloat(document.getElementById("modal-valor").value);
    const tipo = document.getElementById("modal-tipo").value;
    const data = new Date().toISOString();

    const usuario = {
      Id: this.orcamentoId,
      Nome: "Fulano de Tal",
      Email: "fulano@example.com",
      Senha: "senha123",
    };

    const formData = {
      Descricao: descricao,
      Valor: valor,
      Tipo: tipo,
      Data: data,
      UsuarioId: parseInt(localStorage.getItem("token")),
      usuario: usuario,
    };

    fetch(`https://localhost:44343/orcamento/${orcamentoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao atualizar orçamento");
        }
        return response.json();
      })
      .then((data) => {
        modal.style.display = "none";
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao atualizar orçamento");
      });
  });

  function carregarOrcamentoParaEdicao(orcamentoId) {
    fetch(`https://localhost:44343/orcamento/obter-orcamento/${orcamentoId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar orçamento");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("modal-orcamento-id").value = data[0].id;
        document.getElementById("modal-descricao").value = data[0].descricao;
        document.getElementById("modal-valor").value = data[0].valor;
        document.getElementById("modal-tipo").value = data[0].tipo;
        modal.style.display = "block";
      })
      .catch((error) => {
        console.error("Erro ao carregar orçamento:", error);
        alert("Erro ao carregar orçamento");
      });
  }

  function excluirOrcamento(orcamentoId) {
    fetch(`https://localhost:44343/orcamento/${orcamentoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir orçamento");
        }
        window.location.reload();
      })
      .catch((error) => {
        console.error("Erro ao excluir orçamento:", error);
        alert("Erro ao excluir orçamento");
      });
  }

  const usuarioId = parseInt(localStorage.getItem("token"));
  carregarOrcamentos(usuarioId);
});

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
