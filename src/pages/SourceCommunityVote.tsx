import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address").max(255);

const SourceCommunityVote = () => {
  const { slug } = useParams<{ slug: string }>();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "duplicate" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, answer: a + b };
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["source-product-vote", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("source_products")
        .select("id, product_name, tagline, description, product_images, slug")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setErrorMsg(parsed.error.errors[0].message);
      return;
    }
    if (parseInt(captchaAnswer) !== captchaChallenge.answer) {
      setErrorMsg("Incorrect answer. Please try again.");
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      setCaptchaChallenge({ a, b, answer: a + b });
      setCaptchaAnswer("");
      return;
    }
    if (!product) return;
    setStatus("submitting");
    try {
      const { data, error } = await supabase.functions.invoke("verify-vote", {
        body: { action: "submit-vote", product_id: product.id, email: parsed.data },
      });
      if (error || data?.error === "already_voted") {
        setStatus("duplicate");
      } else if (data?.error) {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="spottail-v2 min-h-screen flex items-center justify-center" style={{ background: "var(--v2-surface)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--v2-teal)" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="spottail-v2 min-h-screen flex items-center justify-center px-4" style={{ background: "var(--v2-surface)" }}>
        <div className="text-center">
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 400, color: "var(--v2-ink)", marginBottom: 8 }}>Product not found</h1>
          <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)" }}>This product doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const images = product.product_images as string[] | null;
  const coverImage = images && images.length > 0 && typeof images[0] === "string" && images[0].startsWith("http") ? images[0] : null;

  return (
    <div className="spottail-v2 min-h-screen flex items-center justify-center" style={{ background: "var(--v2-surface)", padding: "48px 16px" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ background: "var(--v2-white)", border: "1px solid var(--v2-border)", borderRadius: 16, padding: 32, textAlign: "center" }}>
          <div className="mx-auto overflow-hidden flex items-center justify-center" style={{ width: 68, height: 68, borderRadius: 12, background: "var(--v2-surface)", fontSize: 30, marginBottom: 20 }}>
            {coverImage ? (
              <img src={coverImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>📦</span>
            )}
          </div>

          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--v2-teal)", marginBottom: 10 }}>
            Spottail Source
          </p>

          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--v2-ink)", marginBottom: 14 }}>
            {product.product_name}
          </h1>

          <p className="font-body" style={{ fontSize: 14, fontWeight: 300, color: "var(--v2-muted)", lineHeight: 1.6, marginBottom: 24 }}>
            We're trying to get stocked in retail stores worldwide. Your vote tells buyers there's real demand for this product.
          </p>

          {status === "success" ? (
            <div style={{ padding: "24px 0" }}>
              <CheckCircle className="mx-auto" style={{ width: 44, height: 44, color: "var(--v2-teal)", marginBottom: 12 }} />
              <h2 className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "var(--v2-ink)", marginBottom: 4 }}>Vote recorded!</h2>
              <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)" }}>Your support helps this product get discovered by retail buyers.</p>
            </div>
          ) : status === "duplicate" ? (
            <div style={{ padding: "24px 0" }}>
              <AlertCircle className="mx-auto" style={{ width: 44, height: 44, color: "var(--v2-teal)", marginBottom: 12 }} />
              <h2 className="font-display" style={{ fontSize: 20, fontWeight: 400, color: "var(--v2-ink)", marginBottom: 4 }}>You've already backed this product</h2>
              <p className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)" }}>One vote per email address. Thanks for your support!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to vote"
                required
                maxLength={255}
                style={{ height: 44 }}
              />
              <div className="flex items-center justify-center gap-2">
                <span className="font-body" style={{ fontSize: 13, color: "var(--v2-muted)", whiteSpace: "nowrap" }}>
                  What is {captchaChallenge.a} + {captchaChallenge.b}?
                </span>
                <Input
                  type="number"
                  placeholder="?"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="text-center"
                  style={{ width: 80, height: 44 }}
                  required
                />
              </div>
              {errorMsg && <p className="text-left font-body" style={{ fontSize: 12, color: "#dc2626" }}>{errorMsg}</p>}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full inline-flex items-center justify-center"
                style={{ height: 44, borderRadius: 9, fontSize: 14, fontWeight: 500, background: "var(--v2-ink)", color: "#fff", border: "none", cursor: "pointer", gap: 6 }}
              >
                {status === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Back this product →
              </button>
            </form>
          )}

          <p className="font-body" style={{ fontSize: 11, color: "var(--v2-muted)", marginTop: 20, lineHeight: 1.6 }}>
            One vote per email. No account needed. Your email won't be shared.
          </p>
        </div>

        <p className="text-center font-body" style={{ fontSize: 11, color: "var(--v2-muted)", marginTop: 16 }}>
          Powered by <span style={{ color: "var(--v2-ink)" }}>Spottail Source</span>
        </p>
      </div>
    </div>
  );
};

export default SourceCommunityVote;
