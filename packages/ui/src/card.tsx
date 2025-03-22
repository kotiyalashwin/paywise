export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-4 border">
      <h1>{title}</h1>
      {children}
    </div>
  );
}
