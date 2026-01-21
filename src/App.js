import React, { useEffect, useState } from "react";
import ProdutoForm from "./components/ProdutoForm";
import ProdutoTabela from "./components/ProdutoTabela";
import MovimentacaoForm from "./components/MovimentacaoForm";
import "./styles/global.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";


function App() {
  const [produtos, setProdutos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [tema, setTema] = useState("claro");
  const [produtoMov, setProdutoMov] = useState(null);
  const [movModal, setMovModal] = useState(false);


  useEffect(() => {
    const dados = localStorage.getItem("produtos");
    const temaSalvo = localStorage.getItem("tema");
    if (dados) setProdutos(JSON.parse(dados));
    if (temaSalvo) setTema(temaSalvo);
  }, []);

  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem("tema", tema);
  }, [tema]);

  function salvarProduto(produto) {
    if (editId) {
      setProdutos(produtos.map(p => (p.id === editId ? produto : p)));
      setEditId(null);
    } else {
      setProdutos([...produtos, produto]);
    }
  }

  function excluirProduto(id) {
    if (window.confirm("Excluir este produto?")) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  }

  function editarProduto(produto) {
    setEditId(produto.id);
    setModalAberto(true);
  }

  function salvarMovimentacao(id, mov, novaQtd) {
    setProdutos(produtos.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        quantidade: novaQtd,
        movimentacoes: [...(p.movimentacoes || []), mov]
      };
    }));
  }

  function exportarExcel() {
  const dataHoje = new Date().toLocaleDateString("pt-BR").replaceAll("/", "-");

  const dados = produtos.map(p => ({
    Produto: p.nome,
    Lote: p.lote,
    Quantidade: p.quantidade,
    Minimo: p.minimo,
    Validade: new Date(p.validade + "T00:00:00")
      .toLocaleDateString("pt-BR"),
    Fornecedor: p.fornecedor
  }));

  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");

  XLSX.writeFile(workbook, `estoque-${dataHoje}.xlsx`);
}

function exportarPDF() {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  doc.setFontSize(14);
  doc.text("Relatório de Estoque", 14, 15);
  doc.setFontSize(10);
  doc.text(`Data: ${dataHoje}`, 14, 22);

  const colunas = [
    "Produto",
    "Lote",
    "Qtd",
    "Min",
    "Validade",
    "Fornecedor"
  ];

  const linhas = produtos.map(p => [
    p.nome,
    p.lote,
    p.quantidade,
    p.minimo,
    new Date(p.validade + "T00:00:00")
      .toLocaleDateString("pt-BR"),
    p.fornecedor
  ]);

  doc.autoTable({
    head: [colunas],
    body: linhas,
    startY: 28
  });

  doc.save(`estoque-${dataHoje.replaceAll("/", "-")}.pdf`);
}

const [exportMenu, setExportMenu] = useState(false);


  return (
    <div className={`app ${tema}`}>
      <header className="topo">
        <div className="logo">
          <h1>🥐 Padaria Kimassas</h1>
          <span>Controle de Estoque</span>
        </div>

        <label className="switch">
          <input
            type="checkbox"
            checked={tema === "escuro"}
            onChange={() =>
              setTema(tema === "claro" ? "escuro" : "claro")
            }
          />
          <span className="slider"></span>
        </label>
      </header>


      <button
        className="btn-adicionar"
        onClick={() => {
          setEditId(null);
          setModalAberto(true);
        }}
      >
         Adicionar produto
      </button>
        
        <div style={{ display: "flex", gap: "10px", margin: "20px" }}>
          <button className="btn-adicionar" onClick={exportarExcel}>
            📊 Exportar Excel
          </button>

          <button className="btn-adicionar" onClick={exportarPDF}>
            📄 Exportar PDF
          </button>
        </div>

      <ProdutoTabela
        produtos={produtos}
        onEditar={editarProduto}
        onExcluir={excluirProduto}
        onMovimentar={(produto) => {
          setProdutoMov(produto);
          setMovModal(true);
        }}
      />

      <ProdutoForm
        produtos={produtos}
        editId={editId}
        aberto={modalAberto}
        onSalvar={salvarProduto}
        onFechar={() => setModalAberto(false)}
      />

      <MovimentacaoForm
        produto={produtoMov}
        aberto={movModal}
        onSalvar={salvarMovimentacao}
        onFechar={() => setMovModal(false)}
      />
    </div>
  );
}

export default App;
