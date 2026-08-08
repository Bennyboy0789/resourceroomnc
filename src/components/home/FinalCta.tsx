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
  /*
   * A real tutoring session, not the stock robot hand that used to sit here.
   * This block closes almost every page on the site, so it is the last thing a
   * family sees before deciding whether to call.
   *
   * `alt=""` on purpose: the photograph is a background behind the heading,
   * which already carries the meaning. Describing it again would make a screen
   * reader announce the same idea twice.
   */
  return (
    <EditorialBlock
      image="/images/why-individualized.jpg"
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
