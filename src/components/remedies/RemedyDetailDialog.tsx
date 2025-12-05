import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Beaker,
  Leaf,
  MapPin
} from "lucide-react";
import { DatabaseRemedy } from "@/hooks/useRemedies";

interface RemedyDetailDialogProps {
  remedy: DatabaseRemedy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getRemedyImage: (remedy: DatabaseRemedy) => string;
}

const RemedyDetailDialog = ({ remedy, open, onOpenChange, getRemedyImage }: RemedyDetailDialogProps) => {
  if (!remedy) return null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-caution text-caution"
                : star - 0.5 <= rating
                ? "fill-caution/50 text-caution"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">({rating} rating)</span>
      </div>
    );
  };

  const getEvidenceBadgeColor = (level?: string) => {
    switch (level) {
      case "Research-Backed":
        return "bg-success/10 text-success border-success/20";
      case "Modern Research":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            <img
              src={getRemedyImage(remedy)}
              alt={remedy.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          </div>
          
          <div className="p-6 -mt-16 relative">
            <DialogHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">{remedy.category}</Badge>
                <Badge className={getEvidenceBadgeColor(remedy.evidence_level)}>
                  {remedy.evidence_level}
                </Badge>
                {remedy.pregnancy_safe ? (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Pregnancy Safe
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-destructive/10 text-destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Not for Pregnancy
                  </Badge>
                )}
              </div>
              
              <DialogTitle className="text-2xl">{remedy.name}</DialogTitle>
              {remedy.traditional_name && (
                <p className="text-muted-foreground italic">{remedy.traditional_name}</p>
              )}
              
              <div className="flex items-center gap-4 mt-2">
                {renderStars(remedy.rating)}
                {remedy.region && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {remedy.region}
                  </span>
                )}
              </div>
            </DialogHeader>

            <Separator className="my-4" />

            {/* Why It Helps */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-primary" />
                Why It Helps
              </h3>
              <p className="text-muted-foreground">{remedy.why_it_helps}</p>
            </div>

            {/* How It Works */}
            {remedy.how_it_works && (
              <div className="mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                  <Beaker className="w-5 h-5 text-primary" />
                  How It Works
                </h3>
                <p className="text-muted-foreground">{remedy.how_it_works}</p>
              </div>
            )}

            <Separator className="my-4" />

            {/* Ingredients */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
              <ul className="space-y-1">
                {remedy.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Preparation</h3>
              <ol className="space-y-2">
                {remedy.preparation_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Separator className="my-4" />

            {/* Dosage Info */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {remedy.dosage && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Dosage</p>
                  <p className="font-medium text-sm">{remedy.dosage}</p>
                </div>
              )}
              {remedy.frequency && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Frequency</p>
                  <p className="font-medium text-sm">{remedy.frequency}</p>
                </div>
              )}
              {remedy.duration && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium text-sm">{remedy.duration}</p>
                </div>
              )}
            </div>

            {/* Safety Warnings */}
            {remedy.safety_warnings.length > 0 && (
              <div className="mb-4 p-4 bg-caution/10 rounded-lg border border-caution/20">
                <h3 className="font-semibold flex items-center gap-2 text-caution mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  Safety Warnings
                </h3>
                <ul className="space-y-1">
                  {remedy.safety_warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-caution">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contraindications */}
            {remedy.contraindications.length > 0 && (
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <h3 className="font-semibold flex items-center gap-2 text-destructive mb-2">
                  <XCircle className="w-5 h-5" />
                  Contraindications
                </h3>
                <ul className="space-y-1">
                  {remedy.contraindications.map((contraindication, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      {contraindication}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Related conditions:</p>
              <div className="flex flex-wrap gap-2">
                {remedy.condition_treated.map((condition, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RemedyDetailDialog;
