import { useState } from "react";

function MovimentacaoForm({ produto, aberto, onSalvar, onFechar }) {
  const [tipo, setTipo] = useState("venda");
  const [qtd, setQtd] = useState("");
  const [obs, setObs] = useState("");

  if (!aberto || !produto) return null;

  function submit(e) {
    e.preventDefault();

    const quantidade = Number(qtd);
    if (quantidade <= 0) return alert("Quantidade inválida");

    const entrada = tipo === "reposicao" || tipo === "compra";
    const novaQtd = produto.quantidade + (entrada ? quantidade : -quantidade);

    if (novaQtd < 0) {
      return alert("Estoque insuficiente");
    }

    const movimentacao = {
      tipo,
      quantidade,
      data: new Date().toISOString(),
      obs
    };

    onSalvar(produto.id, movimentacao, novaQtd);
    onFechar();
  }

  return (
    <div className="overlay" onClick={onFechar}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Movimentar Produto</h2>

        <form onSubmit={submit}>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="venda">Venda</option>
            <option value="descarte">Descarte</option>
            <option value="compra">Compra</option>
          </select>

          <input
            type="number"
            placeholder="Quantidade"
            value={qtd}
            onChange={e => setQtd(e.target.value)}
          />

          <input
            placeholder="Observação (opcional)"
            value={obs}
            onChange={e => setObs(e.target.value)}
          />

          <div className="acoes">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onFechar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MovimentacaoForm
