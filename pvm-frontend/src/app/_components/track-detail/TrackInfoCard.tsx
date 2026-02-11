import { Card, CardBody } from "@heroui/react";
import { FaRoute } from "react-icons/fa";
import { FormattedText } from "@/utils/textConverter";

interface TrackInfoCardProps {
  name: string;
  authorName: string;
  dominantColor: string;
}

export function TrackInfoCard({ name, authorName, dominantColor }: TrackInfoCardProps) {
  return (
    <Card
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #${dominantColor}10, #${dominantColor})`,
      }}
    >
      <div className="absolute inset-0 " />
      <FaRoute className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 text-white/5 rotate-12" />

      <CardBody className="p-8 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              <FormattedText text={name} />
            </h1>
            <p className="text-xl text-neutral-400 font-ruigslay flex items-center gap-2">
              <span className="text-white/50">by</span> {authorName}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}