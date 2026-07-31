type Props = { title: string; description: string; actions?: React.ReactNode };
export default function PlaceholderPage({
  title,
  description,
  actions,
}: Props) {
  return (
    <div className="mx-auto max-w-2xl text-center space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {actions}
    </div>
  );
}
