import { Container, Section } from "@/app/components/ui/primitives";
import { Button } from "@/app/components/ui/Button";

export default function NotFound() {
  return (
    <Section>
      <Container className="py-16 text-center">
        <p className="text-h1 text-tint-30">404</p>
        <h1 className="mt-4 text-h2 text-ink">This page does not exist</h1>
        <p className="mx-auto mt-4 max-w-measure text-lead text-ink-3">
          The page you are looking for may have moved or is not published yet.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/resources/news" variant="outline">
            Latest news
          </Button>
        </div>
      </Container>
    </Section>
  );
}
