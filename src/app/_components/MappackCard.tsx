import { Card, CardHeader, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
export default function MappackCard({ mappack }) {
  const router = useRouter();
  return (
    <div>
      <Card
        className="h-50h"
        isPressable
        onPress={() => router.push("/mappacks/" + mappack.id)}
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start!">
          <h4 className="text-white font-medium text-large">{mappack.name}</h4>
          <p className="text-white text-sm">{mappack.id}</p>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="https://heroui.com/images/card-example-4.jpeg"
        />
      </Card>
    </div>
  );
}
