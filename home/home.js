const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  fetch("https://localhost:44343/usuario/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha no login");
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
      localStorage.setItem("token", data.trim());
      window.location.href = "/orcamento/orcamento.html";
    })

    .catch((error) => {
      console.error("Erro:", error);
      alert("Erro ao realizar login");
    });
});
