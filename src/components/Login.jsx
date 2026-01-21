import { useState } from "react";
import "./login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");

  function submit(e) {
    e.preventDefault();

    if (email === "admin@padaria.com" && senha === "123456") {
      localStorage.setItem("logado", "true");
      onLogin();
    } else {
      setMsg("Email ou senha inválidos");
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Entrar</h2>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>

        {msg && <p id="msg">{msg}</p>}
      </div>
    </div>
  );
}

export default Login;
