import React, { useEffect, useState } from "react";

const inicial = {
  nome: "",
  lote: "",
  quantidade: "",
  minimo: "",
  validade: "",
  fornecedor: ""
};

function ProdutoForm({ produtos, editId, aberto, onSalvar, onFechar }) {
  const [form, setForm] = useState(inicial);

  useEffect(() => {
    if (editId && aberto) {
      const p = produtos.find(p => p.id === editId);
      if (p) setForm(p);
    }
    if (!editId && aberto) setForm(inicial);
  }, [editId, aberto, produtos]);

  if (!aberto) return null;

  function submit(e) {
    e.preventDefault();
    onSalvar({
      ...form,
      id: editId || Date.now(),
      quantidade: Number(form.quantidade),
      minimo: Number(form.minimo)
    });
    onFechar();
  }

  return (
    <div className="overlay" onClick={onFechar}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{editId ? "Editar Produto" : "Novo Produto"}</h2>

        <form onSubmit={submit}>
          <input placeholder="Produto" value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })} />

          <input placeholder="Lote" value={form.lote}
            onChange={e => setForm({ ...form, lote: e.target.value })} />

          <input type="number" placeholder="Quantidade" value={form.quantidade}
            onChange={e => setForm({ ...form, quantidade: e.target.value })} />

          <input type="number" placeholder="Estoque mínimo" value={form.minimo}
            onChange={e => setForm({ ...form, minimo: e.target.value })} />

          <input type="date" value={form.validade}
            onChange={e => setForm({ ...form, validade: e.target.value })} />

          <input placeholder="Fornecedor" value={form.fornecedor}
            onChange={e => setForm({ ...form, fornecedor: e.target.value })} />

          <div className="acoes">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onFechar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProdutoForm;
