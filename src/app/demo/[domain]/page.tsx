import DemoDetail from "@/modules/demo/DemoDetail";

export default function DemoDetailPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = params.domain;

  return <DemoDetail params={{ domain }} />;
}
