import React, { useEffect, useState } from "react";
import ProdutoForm from "./components/ProdutoForm";
import ProdutoTabela from "./components/ProdutoTabela";
import MovimentacaoForm from "./components/MovimentacaoForm";
import "./styles/global.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Login from "./components/Login.jsx";






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
  const dataHoje = new Date()
    .toLocaleDateString("pt-BR")
    .replaceAll("/", "-");

  const dados = produtos.map(p => ({
    Produto: p.nome,
    Lote: p.lote,
    Quantidade: p.quantidade,
    "Estoque Mínimo": p.minimo,
    Validade: new Date(p.validade + "T00:00:00")
      .toLocaleDateString("pt-BR"),
    Fornecedor: p.fornecedor
  }));

  const ws = XLSX.utils.json_to_sheet(dados);

  ws["!cols"] = [
    { wch: 22 },
    { wch: 12 },
    { wch: 12 },
    { wch: 16 },
    { wch: 14 },
    { wch: 24 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Estoque");

  XLSX.writeFile(wb, `estoque-${dataHoje}.xlsx`);
}


function exportarPDF() {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  doc.setFontSize(16);
  doc.setTextColor("#5a3420");
  doc.text("Padaria Kimassas", 14, 15);

  doc.setFontSize(11);
  doc.setTextColor("#7a4a2e");
  doc.text("Relatório de Estoque", 14, 22);

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Data: ${dataHoje}`, 14, 28);

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

  autoTable(doc, {
    startY: 32,
    head: [colunas],
    body: linhas,

    styles: {
      fontSize: 9,
      textColor: "#2b1d14",
      cellPadding: 3
    },

    headStyles: {
      fillColor: "#7a4a2e",
      textColor: "#ffffff"
    },

    alternateRowStyles: {
      fillColor: "#f7efe5"
    },

    theme: "grid"
  });

  doc.save(`estoque-${dataHoje.replaceAll("/", "-")}.pdf`);
}


const [logado, setLogado] = useState(
  localStorage.getItem("logado") === "true"
);

const [exportMenu, setExportMenu] = useState(false);

    if (!logado) {
      return <Login onLogin={() => setLogado(true)} />;
    }

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
        
        <div className="export-container">
  <button
    className="btn-adicionar"
    onClick={() => setExportMenu(!exportMenu)}
  >
     Exportar
  </button>

  {exportMenu && (
    <div className="export-menu">
      <button
        onClick={() => {
          exportarExcel();
          setExportMenu(false);
        }}
      >
         Exportar Excel
      </button>

      <button
        onClick={() => {
          exportarPDF();
          setExportMenu(false);
        }}
      >
         Exportar PDF
      </button>
    </div>
  )}
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
