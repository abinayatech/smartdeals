import type { ProductQuestion, ProductAnswer } from "@/models";
import { GLOBAL_KEYS, readJSON, writeJSON } from "@/utils/storage";
import { requireUserId } from "@/utils/user-context";
import { loadSession } from "./auth-service";

function allQuestions(): ProductQuestion[] {
  return readJSON<ProductQuestion[]>(GLOBAL_KEYS.productQA, []);
}

function saveAll(questions: ProductQuestion[]) {
  writeJSON(GLOBAL_KEYS.productQA, questions);
}

export function getProductQuestions(productId: string): ProductQuestion[] {
  return allQuestions().filter((q) => q.productId === productId);
}

export function askQuestion(productId: string, question: string) {
  const userId = requireUserId();
  const session = loadSession();
  const entry: ProductQuestion = {
    id: crypto.randomUUID(),
    productId,
    userId,
    userName: session?.fullName ?? "User",
    question,
    createdAt: new Date().toISOString(),
    answers: [],
  };
  const all = allQuestions();
  all.unshift(entry);
  saveAll(all);
  return entry;
}

export function replyToQuestion(questionId: string, text: string, isDealer = false) {
  const userId = requireUserId();
  const session = loadSession();
  const all = allQuestions();
  const idx = all.findIndex((q) => q.id === questionId);
  if (idx < 0) throw new Error("Question not found");
  const answer: ProductAnswer = {
    id: crypto.randomUUID(),
    userId,
    userName: isDealer ? `${session?.fullName ?? "Dealer"} (Dealer)` : session?.fullName ?? "User",
    text,
    isDealer,
    createdAt: new Date().toISOString(),
  };
  all[idx].answers.push(answer);
  saveAll(all);
  return answer;
}

export function deleteQuestion(questionId: string) {
  const userId = requireUserId();
  saveAll(allQuestions().filter((q) => !(q.id === questionId && q.userId === userId)));
}
