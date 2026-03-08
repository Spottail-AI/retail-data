import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STRIPE_TIERS } from "@/lib/stripe-config";
import { CreditCard, Crown, Loader2, ExternalLink, Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, isSubscribed, subscriptionTier, subscriptionEnd, checkSubscriptionStatus } = useAuth();
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Could not open billing portal.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await checkSubscriptionStatus();
    setRefreshing(false);
    toast({ title: "Subscription status refreshed" });
  };

  const formattedEnd = subscriptionEnd
    ? new Date(subscriptionEnd).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <DashboardShell
      title="Settings"
      description="Manage your account and billing preferences."
    >
      <div className="space-y-6 max-w-2xl">
        {/* Account Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Mail className="h-5 w-5 text-primary" />
              Account
            </CardTitle>
            <CardDescription>Your account information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground font-medium">{user?.email ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5 text-primary" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>Manage your plan and payment details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Plan */}
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {subscriptionTier === "pro" ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground text-lg">
                        {subscriptionTier === "pro" ? "Pro" : "Free"} Plan
                      </span>
                      <Badge
                        variant={isSubscribed ? "default" : "secondary"}
                        className={isSubscribed ? "bg-primary text-primary-foreground" : ""}
                      >
                        {isSubscribed ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {isSubscribed ? (
                      <p className="text-sm text-muted-foreground">
                        ${STRIPE_TIERS.pro.price}/month
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Limited features
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {formattedEnd && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Renews on {formattedEnd}</span>
                </div>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {isSubscribed ? (
                <Button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  variant="outline"
                  className="border-border"
                >
                  {portalLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  Manage Subscription
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/pricing")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Button>
              )}

              <Button
                onClick={handleRefreshStatus}
                disabled={refreshing}
                variant="ghost"
                size="sm"
              >
                {refreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default SettingsPage;
