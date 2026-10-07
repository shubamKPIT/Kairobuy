import AdminShell from "../../components/admin/AdminShell";

export const metadata = {
  title: "Kairobuy Admin",
  description: "Kairobuy administration panel",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}