import Image from "next/image";
import { cn } from "@/lib/utils";
import { Parallax } from "@/components/motion/Parallax";

type PhotoBandProps = {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  heightClass?: string;
};

export function PhotoBand({
  src,
  alt = "",
  caption,
  className,
  heightClass = "h-[40vh] md:h-[50vh]",
}: PhotoBandProps) {
  return (
    <figure className={cn("relative w-full overflow-hidden", heightClass, className)}>
      <Parallax strength={0.18} className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
      {caption ? (
        <figcaption className="absolute bottom-6 left-5 right-5 mx-auto max-w-[1400px] text-sm font-medium text-white sm:left-8 lg:left-10">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
