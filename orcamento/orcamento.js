document.addEventListener("DOMContentLoaded", function () {
  const tbody = document.querySelector("tbody");
  const entradasElement = document.getElementById("entradas");
  const saidasElement = document.getElementById("saidas");
  const totalElement = document.getElementById("total");

  let totalEntradas = 0;
  let totalSaidas = 0;

  // Função para carregar os orçamentos do usuário
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
            <td>${new Date(orcamento.data).toLocaleDateString("pt-BR")}</td>
                <td><button class="btn-excluir" data-id="${
                  orcamento.id
                }"><i class="fas fa-trash-alt"></i></button></td>


          `;
          tbody.appendChild(row);

          // Atualizar totais
          if (orcamento.tipo === "entrada") {
            totalEntradas += orcamento.valor;
          } else if (orcamento.tipo === "saida") {
            totalSaidas += orcamento.valor;
          }
        });

        entradasElement.textContent = formatCurrency(totalEntradas);
        saidasElement.textContent = formatCurrency(totalSaidas);
        totalElement.textContent = formatCurrency(totalEntradas - totalSaidas);
        // Adicionar listeners para os botões de exclusão
        const btnsExcluir = document.querySelectorAll(".btn-excluir");
        btnsExcluir.forEach((btn) => {
          btn.addEventListener("click", () => {
            const orcamentoId = btn.getAttribute("data-id");
            if (confirm("Deseja realmente excluir este orçamento?")) {
              excluirOrcamento(orcamentoId);
            }
          });
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar orçamentos:", error);
        alert("Erro ao carregar orçamentos");
      });
  }

  // Obter o ID do usuário (você pode ajustar conforme necessário)
  const usuarioId = parseInt(localStorage.getItem("token"));

  // Chamar a função para carregar os orçamentos ao carregar a página
  carregarOrcamentos(usuarioId);
});

const form = document.getElementById("orcamento-form");
const tbody = document.querySelector("tbody");
const entradasElement = document.getElementById("entradas");
const saidasElement = document.getElementById("saidas");
const totalElement = document.getElementById("total");

// Inicializa os totais
let totalEntradas = 0;
let totalSaidas = 0;

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const data = new Date().toISOString(); // Data atual

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
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Adiciona o token ao header Authorization
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
      // Limpar campos do formulário após o envio
      document.getElementById("descricao").value = "";
      document.getElementById("valor").value = "";
      document.getElementById("tipo").value = "";

      // Formatando o valor para exibir como "R$ X.XX"
      const formattedValor = formatCurrency(data.valor);

      // Atualizar a tabela na página com os dados enviados
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.descricao}</td>
        <td>${formattedValor}</td>
        <td>${data.tipo}</td>
        <td>${new Date(data.data).toLocaleDateString("pt-BR")}</td>
      `;
      tbody.appendChild(row);

      // Atualizar totais
      if (data.tipo === "entrada") {
        totalEntradas += data.valor;
      } else if (data.tipo === "saida") {
        totalSaidas += data.valor;
      }

      // Atualizar elementos no DOM
      entradasElement.textContent = formatCurrency(totalEntradas);
      saidasElement.textContent = formatCurrency(totalSaidas);
      totalElement.textContent = formatCurrency(totalEntradas - totalSaidas);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Erro ao cadastrar orçamento");
    });
});

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
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
    })
    .then((data) => {
      const rowToRemove = document.querySelector(
        `button[data-id="${orcamentoId}"]`
      ).parentNode.parentNode;
      rowToRemove.remove();

      // Atualizar totais após exclusão
      const valorExcluido = parseFloat(data.valor);
      if (data.tipo === "entrada") {
        totalEntradas -= valorExcluido;
      } else if (data.tipo === "saida") {
        totalSaidas -= valorExcluido;
      }

      // Atualizar elementos no DOM com os totais recalculados
      entradasElement.textContent = formatCurrency(totalEntradas);
      saidasElement.textContent = formatCurrency(totalSaidas);
      totalElement.textContent = formatCurrency(totalEntradas - totalSaidas);

      alert("Orçamento excluído com sucesso");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro ao excluir orçamento:", error);
    });
}

// Obter o ID do usuário (você pode ajustar conforme necessário)
const usuarioId = parseInt(localStorage.getItem("token"));

// Chamar a função para carregar os orçamentos ao carregar a página
carregarOrcamentos(usuarioId);
