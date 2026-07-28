import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { EditorialBlock } from "@/components/ui/EditorialBlock";
import { finalCta } from "@/content/home";
import { site } from "@/content/site";

export function FinalCta({
  heading = finalCta.heading,
  body = finalCta.body,
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <EditorialBlock
      image="/images/why-engaging.jpg"
      alt=""
      align="left"
      height="short"
    >
      <h2 className="display text-balance text-4xl sm:text-5xl lg:text-6xl">{heading}</h2>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">{body}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button href={site.consultationUrl} size="lg">
          Schedule a Free Consultation
        </Button>
        <Button href={site.phoneHref} variant="outline" size="lg">
          <Icon name="phone" className="h-4 w-4" />
          {site.phone}
        </Button>
      </div>
    </EditorialBlock>
  );
}
