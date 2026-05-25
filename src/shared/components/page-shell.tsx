import { Card } from "@/components/ui/card";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 lg:p-6">
      <Card className="rounded-2xl p-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </Card>
    </div>
  );
}
