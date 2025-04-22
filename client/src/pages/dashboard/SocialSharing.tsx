import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Copy, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SocialSharing() {
  const [shareType, setShareType] = useState("expenseSummary");
  const { toast } = useToast();
  
  const handleShareTypeChange = (value: string) => {
    setShareType(value);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard.",
        duration: 3000
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
        duration: 3000
      });
    });
  };
  
  const handleShare = (platform: string) => {
    // In a real app, this would use the Web Share API or open platform-specific share dialogs
    console.log(`Share to ${platform}`);
    
    // Example share URL
    let shareUrl = window.location.href;
    let shareText = "Check out my expense report from SplitSmart!";
    
    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
    }
  };
  
  return (
    <Card className="lg:col-span-2">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Social Sharing</h2>
          <Select onValueChange={handleShareTypeChange} defaultValue={shareType}>
            <SelectTrigger className="w-[160px] h-8 bg-slate-100 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expenseSummary">Expense Summary</SelectItem>
              <SelectItem value="billSplit">Bill Split</SelectItem>
              <SelectItem value="monthlyReport">Monthly Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg overflow-hidden border border-slate-200 mb-4">
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 text-center">
            <h3 className="font-bold text-xl mb-2">May 2023 Expenses</h3>
            <p className="text-white/80 mb-3">Your household expense report is ready!</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm font-medium">Total</p>
                <p className="text-xl font-bold">{formatCurrency(1245.32)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm font-medium">Your Share</p>
                <p className="text-xl font-bold">{formatCurrency(645.10)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-sm font-medium">Savings</p>
                <p className="text-xl font-bold">{formatCurrency(87.45)}</p>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-2">Top Categories: Rent, Utilities, Groceries</p>
            <div className="text-sm font-medium text-white/90">Created with SplitSmart</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              className="bg-[#1877f2] hover:bg-[#1877f2]/90"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="mr-2 h-4 w-4" /> Facebook
            </Button>
            <Button
              className="bg-[#1da1f2] hover:bg-[#1da1f2]/90"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="mr-2 h-4 w-4" /> Twitter
            </Button>
            <Button
              className="bg-[#25d366] hover:bg-[#25d366]/90"
              onClick={() => handleShare("whatsapp")}
            >
              <i className="fab fa-whatsapp mr-2"></i> WhatsApp
            </Button>
          </div>
          <Button variant="outline" onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" /> Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
