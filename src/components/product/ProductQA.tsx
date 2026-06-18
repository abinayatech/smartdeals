import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import { askQuestion, getProductQuestions, replyToQuestion } from "@/services/qa-service";

export function ProductQA({ productId }: { productId: string }) {
  const guard = useRequireAuth();
  const { user, isDealer } = useAuth();
  const [questions, setQuestions] = useState(() => getProductQuestions(productId));
  const [newQ, setNewQ] = useState("");
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  const refresh = () => setQuestions(getProductQuestions(productId));

  return (
    <section className="mt-12">
      <h2 className="text-xl font-medium flex items-center gap-2 mb-4"><MessageCircle className="size-5" /> Questions & Answers</h2>
      {user && (
        <div className="flex gap-2 mb-6">
          <input value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="Ask a question about this product…" className="flex-1 bg-card ring-1 ring-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent" />
          <Button onClick={() => guard(() => { if (newQ.trim()) { askQuestion(productId, newQ.trim()); setNewQ(""); refresh(); } })}>Ask</Button>
        </div>
      )}
      <div className="space-y-4">
        {questions.length === 0 && <p className="text-sm text-muted-foreground">No questions yet. Be the first to ask!</p>}
        {questions.map((q) => (
          <div key={q.id} className="bg-card ring-1 ring-border rounded-xl p-4 shadow-card">
            <div className="font-medium text-sm">{q.question}</div>
            <div className="text-xs text-muted-foreground mt-1">{q.userName} · {new Date(q.createdAt).toLocaleDateString("en-IN")}</div>
            {q.answers.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-accent/30 space-y-2">
                {q.answers.map((a) => (
                  <div key={a.id}>
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted-foreground">{a.userName}{a.isDealer ? " · Official" : ""}</div>
                  </div>
                ))}
              </div>
            )}
            {(isDealer || user) && (
              <div className="flex gap-2 mt-3">
                <input value={replyDraft[q.id] ?? ""} onChange={(e) => setReplyDraft({ ...replyDraft, [q.id]: e.target.value })} placeholder="Write an answer…" className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-sm" />
                <Button size="sm" variant="outline" onClick={() => guard(() => {
                  const t = replyDraft[q.id]?.trim();
                  if (!t) return;
                  replyToQuestion(q.id, t, isDealer);
                  setReplyDraft({ ...replyDraft, [q.id]: "" });
                  refresh();
                })}>Reply</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
