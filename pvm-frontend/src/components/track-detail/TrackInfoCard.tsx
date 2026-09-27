import { Card, CardContent } from "@/components/ui/card";
import { FormattedText } from "@/components/common/FormattedText";

interface TrackInfoCardProps {
  name: string;
  authorName: string;
}

export function TrackInfoCard({ name, authorName }: TrackInfoCardProps) {
  return (
    <Card>
      <CardContent>
        <h1 className="font-display text-display-m">
          <FormattedText text={name} />
        </h1>
        <p className="mt-3 text-body-l text-muted-foreground">
          <span className="italic">by</span> {authorName}
        </p>
      </CardContent>
    </Card>
  );
}
