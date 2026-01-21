import React, { useState } from "react";
import { diasParaVencer } from "../utils/datas";

function ProdutoTabela({ produtos, onEditar, onExcluir, onMovimentar }) {
  const [ordem, setOrdem] = useState({
    coluna: null,
    direcao: "asc"
  });

  function ordenar(coluna) {
    setOrdem(prev => {
      if (prev.coluna === coluna) {
        return {
          coluna,
          direcao: prev.direcao === "asc" ? "desc" : "asc"
        };
      }
      return { coluna, direcao: "asc" };
    });
  }

  const produtosOrdenados = [...produtos].sort((a, b) => {
    if (!ordem.coluna) return 0;

    let aVal = a[ordem.coluna];
    let bVal = b[ordem.coluna];

    if (ordem.coluna === "validade") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return ordem.direcao === "asc" ? -1 : 1;
    if (aVal > bVal) return ordem.direcao === "asc" ? 1 : -1;
    return 0;
  });

  function seta(coluna) {
    if (ordem.coluna !== coluna) return "";
    return ordem.direcao === "asc" ? " ▲" : " ▼";
  }

  if (produtos.length === 0) {
    return <p>  Nenhum produto cadastrado.</p>;
  }

  return (
    <>
      <h2>📋 Produtos em Estoque</h2>
      
      <table>
        <thead>
          <tr>
            <th onClick={() => ordenar("nome")}>Produto{seta("nome")}</th>
            <th onClick={() => ordenar("lote")}>Lote{seta("lote")}</th>
            <th onClick={() => ordenar("quantidade")}>Quantidade{seta("quantidade")}</th>
            <th onClick={() => ordenar("minimo")}>Mínimo{seta("minimo")}</th>
            <th onClick={() => ordenar("validade")}>Validade{seta("validade")}</th>
            <th onClick={() => ordenar("fornecedor")}>Fornecedor{seta("fornecedor")}</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtosOrdenados.map(produto => {
            const dias = diasParaVencer(produto.validade);
            const estoqueBaixo = produto.quantidade <= produto.minimo;

            return (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.lote}</td>
                <td>{produto.quantidade}</td>
                <td>{produto.minimo}</td>
                <td>
                  {new Date(produto.validade + "T00:00:00")
                    .toLocaleDateString("pt-BR")}
                </td>
                <td>{produto.fornecedor}</td>
                <td>
                  {dias < 0 && <span style={{ color: "darkred" }}> Vencido</span>}
                  {dias >= 0 && dias <= 30 && estoqueBaixo && (
                    <span style={{ color: "red" }}>
                       {dias} dias – Estoque baixo
                    </span>
                  )}
                  {dias >= 0 && dias <= 30 && !estoqueBaixo && (
                    <span style={{ color: "orange" }}> {dias} dias</span>
                  )}
                  {dias > 30 && estoqueBaixo && (
                    <span style={{ color: "orange" }}>
                       {dias} dias – Estoque baixo
                    </span>
                  )}
                  {dias > 30 && !estoqueBaixo && (
                    <span style={{ color: "green" }}> {dias} dias</span>
                  )}
                </td>
                <td>
                  <button onClick={() => onEditar(produto)}>✏️</button>
                  <button onClick={() => onExcluir(produto.id)}>🗑️</button>
                  <button onClick={() => onMovimentar(produto)}>🔄</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default ProdutoTabela;
