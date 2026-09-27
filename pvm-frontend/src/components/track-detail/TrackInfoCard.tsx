import { FaRoute } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { FormattedText } from "@/components/common/FormattedText";

interface TrackInfoCardProps {
  name: string;
  authorName: string;
  /** Hex without the leading #, taken from the thumbnail. */
  dominantColor: string;
}

export function TrackInfoCard({ name, authorName, dominantColor }: TrackInfoCardProps) {
  return (
    <Card style={{ backgroundColor: `#${dominantColor}26` }}>
      <FaRoute className="absolute top-1/2 right-4 size-32 -translate-y-1/2 rotate-12 text-foreground/5" />
      <CardContent className="p-8">
        <h1 className="mb-3 font-display text-display-m">
          <FormattedText text={name} />
        </h1>
        <p className="text-body-l text-muted-foreground">
          <span className="italic">by</span> {authorName}
        </p>
      </CardContent>
    </Card>
  );
}
