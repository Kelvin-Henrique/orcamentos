const registerForm = document.getElementById("register-form");
console.log(registerForm);
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = {
    Nome: document.getElementById("nome-completo").value,
    Email: document.getElementById("email").value,
    Senha: document.getElementById("password").value,
  };

  fetch("https://localhost:44343/usuario/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }
      return response.json();
    })
    .then((data) => {
      alert("Usuário cadastrado com sucesso!");
      console.log("ID do novo usuário:", data.id);
      window.location.href = "/home/home.html";
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Erro ao cadastrar usuário");
    });
});
