import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "./admin";

/**
 * Function de exemplo — só para você confirmar que o ambiente está rodando.
 */
export const ping = onCall(() => {
  return { ok: true, message: "pong" };
});

/**
 * Lista os atendimentos de UM tenant.
 *
 * ATENÇÃO: esta função hoje recebe o tenantId diretamente no payload da
 * chamada, sem validar se quem está chamando de fato pertence a esse tenant.
 * Isso é proposital — faz parte do que os testes técnicos pedem para revisar,
 * dependendo do nível do teste que você recebeu.
 */
export const listAtendimentos = onCall(async (request) => {
  const tenantId = request.data?.tenantId;

  if (!tenantId || typeof tenantId !== "string") {
    throw new HttpsError("invalid-argument", "tenantId é obrigatório.");
  }

  const snapshot = await db
    .collection("atendimentos")
    .where("tenantId", "==", tenantId)
    .get();

  return {
    atendimentos: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  };
});

/**
 * Cria um novo registro de atendimento para um tenant.
 * Implementação mínima — sem validação de schema.
 */
export const createAtendimento = onCall(async (request) => {
  const { tenantId, transcricao, duracaoSegundos, prioridade } = request.data ?? {};

  // Faz a validação do ID do Tenant
  if (!tenantId || typeof tenantId !== "string") {
    throw new HttpsError("invalid-argument", "tenantId é obrigatório.");
  }

  // Faz a validação da prioridade recebida
  if (prioridade !== "baixa" && prioridade !== "media" && prioridade !== "alta" && prioridade !== undefined) {
    throw new HttpsError("invalid-argument", "O valor de prioridade deve ser baixa, media ou alta");
  }

  const doc = await db.collection("atendimentos").add({
    tenantId,
    transcricao: transcricao ?? "",
    duracaoSegundos: duracaoSegundos ?? 0,
    status: "novo",
    prioridade: prioridade ?? "media",
    criadoEm: new Date().toISOString(),
  });

  return { id: doc.id };
});

/**
 * Atualiza um registro de atendimento para um tenant.
 * Implementação mínima — sem validação de schema.
 */
export const updateAtendimentoStatus = onCall(async (request) => {
  const { atendimentoId, tenantId, novoStatus } = request.data ?? {};

  // Faz a validação do ID do atendimento
  if (!atendimentoId || typeof atendimentoId !== "string") {
    throw new HttpsError("invalid-argument", "atendimentoId é obrigatório.");
  }

  // Faz a validação do ID do Tenant
  if (!tenantId || typeof tenantId !== "string") {
    throw new HttpsError("invalid-argument", "tenantId é obrigatório.");
  }

  // Faz a validação da atualização do status
  if (novoStatus !== "novo" && novoStatus !== "pendente" && novoStatus !== "resolvido") {
    throw new HttpsError("invalid-argument", "O valor de status deve ser novo, pendente ou resolvido");
  }

  // Captura o doc correto depois atualiza o doc somente no campo necessário
  const doc = await db
    .collection("atendimentos")
    .doc(atendimentoId)
    .get();

  if (!doc.exists || doc.data()?.tenantId !== tenantId) {
    throw new HttpsError(
      "not-found",
      "O documento não foi encontrado ou o tenantId não corresponde."
    );
  }

  await doc.ref.update({ status: novoStatus });

  return { ok: true };
});
