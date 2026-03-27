import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4f8ef7]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-white text-xl font-bold mb-2">Product not found</h1>
          <p className="text-[#94a3b8] text-sm">This product doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const images = product.product_images as string[] | null;
  const coverImage = images && images.length > 0 && typeof images[0] === "string" && images[0].startsWith("http") ? images[0] : null;

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[390px]">
        <div className="bg-[#111827] border border-[#1e2d4a] rounded-2xl p-8 text-center">
          <div className="w-[68px] h-[68px] rounded-xl bg-[#1e2d4a] flex items-center justify-center text-3xl mx-auto mb-5 overflow-hidden">
            {coverImage ? (
              <img src={coverImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>📦</span>
            )}
          </div>

          <p className="text-[#4f8ef7] text-xs font-semibold uppercase tracking-wider mb-2">
            Spottail Source
          </p>

          <h1 className="text-white text-xl font-extrabold mb-4">{product.product_name}</h1>

          <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">
            We're trying to get stocked in retail stores worldwide. Your vote tells buyers there's real demand for this product.
          </p>

          {status === "success" ? (
            <div className="py-6">
              <CheckCircle className="w-12 h-12 text-[#c5f135] mx-auto mb-3" />
              <h2 className="text-white font-bold text-lg mb-1">Vote recorded!</h2>
              <p className="text-[#94a3b8] text-sm">Your support helps this product get discovered by retail buyers.</p>
            </div>
          ) : status === "duplicate" ? (
            <div className="py-6">
              <AlertCircle className="w-12 h-12 text-[#4f8ef7] mx-auto mb-3" />
              <h2 className="text-white font-bold text-lg mb-1">You've already backed this product</h2>
              <p className="text-[#94a3b8] text-sm">One vote per email address. Thanks for your support!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to vote"
                className="bg-[#0d1117] border-[#1e2d4a] text-white placeholder:text-[#475569] focus:border-[#4f8ef7] h-11"
                required
                maxLength={255}
              />
              <div className="flex items-center justify-center gap-2">
                <span className="text-[#94a3b8] text-sm whitespace-nowrap">What is {captchaChallenge.a} + {captchaChallenge.b}?</span>
                <Input
                  type="number"
                  placeholder="?"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-20 bg-[#0d1117] border-[#1e2d4a] text-white placeholder:text-[#475569] focus:border-[#4f8ef7] h-11 text-center"
                  required
                />
              </div>
              {errorMsg && <p className="text-red-400 text-xs text-left">{errorMsg}</p>}
              <Button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-[#4f8ef7] hover:bg-[#4f8ef7]/90 text-white font-semibold h-11"
              >
                {status === "submitting" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Back this product →
              </Button>
            </form>
          )}

          <p className="text-[#475569] text-[11px] mt-5 leading-relaxed">
            One vote per email. No account needed. Your email won't be shared.
          </p>
        </div>

        <p className="text-center text-[#475569] text-[11px] mt-4">
          Powered by <span className="text-[#94a3b8]">Spottail Source</span>
        </p>
      </div>
    </div>
  );
};

export default SourceCommunityVote;
