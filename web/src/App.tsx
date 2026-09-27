import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

type Atendimento = {
  id: string;
  transcricao: string;
  status: string;
  duracaoSegundos: number;
  prioridade?: string;
};

const PRIORIDADES = ["baixa", "media", "alta"];
const STATUS = ["novo", "pendente", "resolvido"];

// Cor de cada prioridade na listagem; valores desconhecidos aparecem em cinza.
const CORES_PRIORIDADE: Record<string, string> = {
  baixa: "green",
  media: "darkorange",
  alta: "red",
};

export default function App() {
  const [tenantId, setTenantId] = useState("tenant-alfa");
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  // Campos do formulário de criação
  const [transcricao, setTranscricao] = useState("");
  const [duracaoSegundos, setDuracaoSegundos] = useState(0);
  const [prioridade, setPrioridade] = useState("media");

  function mostrarErro(e: unknown) {
    setMensagem(null);
    setErro(e instanceof Error ? e.message : "Erro desconhecido");
  }

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const listAtendimentos = httpsCallable(functions, "listAtendimentos");
      const resp = await listAtendimentos({ tenantId });
      setAtendimentos((resp.data as { atendimentos: Atendimento[] }).atendimentos);
    } catch (e) {
      mostrarErro(e);
    } finally {
      setCarregando(false);
    }
  }

  function trocarTenant() {
    setTenantId(tenantId === "tenant-alfa" ? "tenant-beta" : "tenant-alfa");
    // Limpa a lista para não exibir atendimentos de um tenant com outro selecionado.
    setAtendimentos([]);
    setMensagem(null);
    setErro(null);
  }

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      const createAtendimento = httpsCallable(functions, "createAtendimento");
      const resp = await createAtendimento({ tenantId, transcricao, duracaoSegundos, prioridade });
      setMensagem(`Atendimento criado (id: ${(resp.data as { id: string }).id}).`);
      setTranscricao("");
      setDuracaoSegundos(0);
      setPrioridade("media");
      await carregar();
    } catch (e) {
      mostrarErro(e);
    } finally {
      setSalvando(false);
    }
  }

  async function atualizarStatus(atendimentoId: string, novoStatus: string) {
    setSalvando(true);
    setErro(null);
    try {
      const updateAtendimentoStatus = httpsCallable(functions, "updateAtendimentoStatus");
      await updateAtendimentoStatus({ atendimentoId, tenantId, novoStatus });
      setMensagem(`Status atualizado para "${novoStatus}".`);
      await carregar();
    } catch (e) {
      mostrarErro(e);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 720, margin: "40px auto" }}>
      <h1>AtendeAI — projeto de teste</h1>
      <p>
        Tenant: <code>{tenantId}</code>{" "}
        <button onClick={trocarTenant}>trocar tenant</button>{" "}
        <button onClick={carregar} disabled={carregando}>
          {carregando ? "carregando..." : "carregar atendimentos"}
        </button>
      </p>

      <h2>Criar atendimento</h2>
      <form onSubmit={criar}>
        <p>
          <label>
            Transcrição:
            <br />
            <textarea
              value={transcricao}
              onChange={(e) => setTranscricao(e.target.value)}
              rows={3}
              style={{ width: "100%" }}
            />
          </label>
        </p>
        <p>
          <label>
            Duração (segundos):{" "}
            <input
              type="number"
              min={0}
              value={duracaoSegundos}
              onChange={(e) => setDuracaoSegundos(Number(e.target.value))}
            />
          </label>{" "}
          <label>
            Prioridade:{" "}
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
              {PRIORIDADES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="submit" disabled={salvando}>
            {salvando ? "salvando..." : "criar"}
          </button>
        </p>
      </form>

      {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <h2>Atendimentos</h2>
      <ul>
        {atendimentos.map((a) => {
          // Atendimentos antigos (ex: os do seed) não têm o campo; usa o padrão "media".
          const prioridadeAtendimento = a.prioridade ?? "media";
          return (
            <li key={a.id} style={{ marginBottom: 8 }}>
              <select
                value={a.status}
                disabled={salvando}
                onChange={(e) => atualizarStatus(a.id, e.target.value)}
                aria-label="Atualizar status"
              >
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>{" "}
              <span style={{ color: CORES_PRIORIDADE[prioridadeAtendimento] ?? "gray", fontWeight: "bold" }}>
                [{prioridadeAtendimento}]
              </span>{" "}
              ({a.duracaoSegundos}s) — {a.transcricao}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
