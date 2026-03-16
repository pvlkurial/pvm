import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black-900 border-t border-neutral-800 mt-auto py-6 p-5">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-neutral-400 text-sm flex items-center justify-center gap-2">
          {new Date().getFullYear()} PVM - Made By Laser
          <Image
            src={`/misc/laser.svg`}
            alt={"Laser"}
            width={68}
            height={68}
            className="mp-style-svg"
          />
        </p>
      </div>
    </footer>
  );
}
