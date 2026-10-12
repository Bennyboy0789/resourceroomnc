import Image from "next/image";
import Link from "next/link";
import { Icon, SocialIcon } from "@/components/icons";
import { Rail, RailItem } from "@/components/ui/Rail";
import { socialPosts } from "@/content/home";
import { socials } from "@/content/site";

/**
 * The social strip: the graphics Resource Room posts, laid out as a feed.
 *
 * Hand-kept rather than fetched — see `socialPosts` for why. The honest line
 * is that this shows the posts without claiming to be the platform: the
 * account name and handle are real, and there are no like counts, comment
 * counts or timestamps, because inventing those would be inventing engagement.
 *
 * Each graphic is shown whole, at its own shape. They are infographics, and a
 * square crop — the usual social-grid treatment — would cut most of them off
 * halfway down the page of text that is the point of them.
 *
 * Built on `Rail` so the count does not matter: one post sits at its natural
 * width instead of stretching across the page, and a dozen scroll.
 */
export function SocialStrip() {
  if (socialPosts.length === 0) return null;

  const facebook = socials.find((s) => s.icon === "facebook");

  return (
    <section className="bg-mist py-20 sm:py-24 lg:py-28">
      <Rail
        eyebrow="On social"
        title="What we have been"
        accent="sharing."
        description="Program news, results and the occasional photo from the center. Follow along for the rest."
        {...(facebook ? { viewAll: { label: "Follow on Facebook", href: facebook.href } } : {})}
      >
        {socialPosts.map((post, index) => (
          <RailItem key={post.src} index={index}>
            {/* `relative` is for the link's stretched hit area below: the whole
                card is clickable, but the link's name stays the short label
                rather than the entire caption read out as one link. */}
            <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-navy-900/8 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lg hover:shadow-navy-900/5">
              <header className="flex items-center gap-3 px-4 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 p-1.5">
                  <Image
                    src="/images/pathways/the-resource-room.png"
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-navy-950">
                    Resource Room
                  </span>
                  <span className="block truncate text-xs text-navy-500">@resourceroomnc</span>
                </span>
              </header>

              <Image
                src={post.src}
                alt={post.alt}
                width={post.width}
                height={post.height}
                sizes="(min-width: 1024px) 22rem, 78vw"
                className="h-auto w-full"
              />

              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-4 text-sm leading-relaxed text-navy-700">{post.caption}</p>
                <Link
                  href={post.link.href}
                  className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-bold uppercase tracking-[0.08em] text-brand-500 after:absolute after:inset-0"
                >
                  {post.link.label}
                  <Icon
                    name="arrowRight"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          </RailItem>
        ))}
      </Rail>

      {/* Both accounts, under the rail — the rail header only has room for one,
          and Instagram carries most of the camp photography. */}
      <div className="mx-auto mt-10 flex w-full max-w-[110rem] flex-wrap gap-3 px-5 sm:px-8">
        {socials.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-navy-900/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-500"
          >
            <SocialIcon name={social.icon} className="h-4 w-4" />
            {social.label}
          </a>
        ))}
      </div>
    </section>
  );
}
