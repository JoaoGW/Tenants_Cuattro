import * as admin from "firebase-admin";
import {
  createAtendimento,
  updateAtendimentoStatus,
} from "../src/index";

const db = admin.firestore();

describe("createAtendimento", () => {
  it("não grava atendimento com prioridade inválida", async () => {
    const tenantId = `tenant-prioridade-invalida-${Date.now()}`;

    await expect(
      createAtendimento.run({
        data: { tenantId, prioridade: "urgente" },
      } as any)
    ).rejects.toMatchObject({ code: "invalid-argument" });

    const atendimentos = await db
      .collection("atendimentos")
      .where("tenantId", "==", tenantId)
      .get();

    expect(atendimentos.empty).toBe(true);
  });

  it("usa media quando prioridade não é informada", async () => {
    const tenantId = `tenant-prioridade-padrao-${Date.now()}`;

    const resultado = await createAtendimento.run({
      data: { tenantId },
    } as any);

    const atendimento = await db
      .collection("atendimentos")
      .doc(resultado.id)
      .get();

    expect(atendimento.data()?.prioridade).toBe("media");
  });
});

describe("updateAtendimentoStatus", () => {
  it("não atualiza quando o tenantId é diferente", async () => {
    const atendimento = await db.collection("atendimentos").add({
      tenantId: `tenant-correto-${Date.now()}`,
      status: "novo",
    });

    await expect(
      updateAtendimentoStatus.run({
        data: {
          atendimentoId: atendimento.id,
          tenantId: "tenant-incorreto",
          novoStatus: "resolvido",
        },
      } as any)
    ).rejects.toMatchObject({ code: "not-found" });

    const atendimentoAtualizado = await atendimento.get();
    expect(atendimentoAtualizado.data()?.status).toBe("novo");
  });
});

afterAll(async () => {
  await admin.app().delete();
});
