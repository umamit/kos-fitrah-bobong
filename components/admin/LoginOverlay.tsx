"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export function LoginOverlay({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (err) throw err;
      if (data?.session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <Card className="w-full max-w-sm p-8 text-center space-y-6 shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-full bg-primary-light text-primary flex items-center justify-center border border-primary/20">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Login Pengelola</h2>
          <p className="text-xs text-muted-foreground">Masuk dengan akun pengelola Kos Fitrah untuk mengakses pembukuan.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Email Admin</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kosfitrah.uk" required autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
