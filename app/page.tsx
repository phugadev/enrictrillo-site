import { Avatar } from "@/components/Avatar";
import { CopyEmail } from "@/components/CopyEmail";
import { Greeting } from "@/components/Greeting";
import { Container, Section } from "@/components/layout";
import { PageShell } from "@/components/PageShell";
import { PostCard } from "@/components/PostCard";
import { ProjectRow } from "@/components/ProjectRow";
import { SmartLink } from "@/components/ui/SmartLink";
import { now, projects, site } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";

/**
 * The page is static, so a post list is build-time. Twelve hours keeps it
 * honest without making anything here client-side.
 */
export const revalidate = 43200;

const LATEST_COUNT = 5;

/** An inline link: text in the reading colour, a dotted rule that firms on hover. */
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <SmartLink
      href={href}
      className="text-foreground underline decoration-subtle-foreground/50 decoration-dotted underline-offset-4 transition-colors duration-quick hover:decoration-foreground hover:decoration-solid"
    >
      {children}
    </SmartLink>
  );
}

export default function Home() {
  const posts = getAllPosts().slice(0, LATEST_COUNT);

  return (
    <PageShell>
      <Container size="narrow" className="pt-section">
        <Avatar size={44} />

        <div className="mt-stack space-y-gutter type-body text-muted-foreground">
          <Greeting />
          <p className="text-foreground">
            I&rsquo;m {site.name.split(" ")[0]}, a {site.role.toLowerCase()} in London, working
            through {site.company}.
          </p>
          <p>
            For nine years I&rsquo;ve built and shipped software across the whole stack, without
            handing off between specialists: TypeScript and Next.js on the front, Python and Node
            behind them, Azure underneath, and AI worked through the middle rather than kept as a
            separate department.
          </p>
          {now.length > 0 && (
            <p>Right now I&rsquo;m {now[0]!.charAt(0).toLowerCase() + now[0]!.slice(1)}</p>
          )}
          <p>
            {site.availability.open ? (
              <>
                I work {site.availability.mode}, on {site.availability.contracts}, and can start
                with {site.availability.notice}.{" "}
              </>
            ) : null}
            <CopyEmail email={site.email} />, or find me on <A href={site.social.github}>GitHub</A>{" "}
            and <A href={site.social.linkedin}>LinkedIn</A>.
          </p>
        </div>
      </Container>

      <Section variant="quiet" size="narrow" label="Work">
        <ul>
          {projects.map((project) => (
            <ProjectRow key={project.name} project={project} />
          ))}
        </ul>
      </Section>

      {posts.length > 0 && (
        <Section variant="quiet" size="narrow" label="Writing">
          <ul>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        </Section>
      )}
    </PageShell>
  );
}
