import InfoPageLayout from "./InfoPageLayout";

export default function HelpPageLayout({
  title,
  description,
  children,
}) {
  return (
    <InfoPageLayout
      eyebrow="Kairobuy Help Centre"
      title={title}
      description={description}
    >
      {children}
    </InfoPageLayout>
  );
}