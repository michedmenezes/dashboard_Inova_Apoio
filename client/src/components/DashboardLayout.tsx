import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { type LucideIcon, Plus } from "lucide-react";

export type AdminNavigationItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

type DashboardLayoutProps = {
  activeKey: string;
  items: AdminNavigationItem[];
  onNavigate: (key: string) => void;
  onQuickAdd: () => void;
  children: React.ReactNode;
};

export default function DashboardLayout({ activeKey, items, onNavigate, onQuickAdd, children }: DashboardLayoutProps) {
  const activeItem = items.find((item) => item.key === activeKey);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="offcanvas" className="border-r border-black bg-white">
        <SidebarHeader className="h-auto border-b border-black p-0">
          <div className="flex min-h-28 items-end justify-between p-5">
            <div>
              <div className="mb-3 h-5 w-5 bg-[#e52521]" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Feira de Tecnologia</p>
              <h1 className="mt-1 text-xl font-black tracking-[-0.07em] text-black">INOVAPOIO</h1>
            </div>
            <span className="text-[10px] font-semibold text-zinc-500">ADMIN</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Navegação</p>
          <SidebarMenu>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeKey === item.key}
                    onClick={() => onNavigate(item.key)}
                    className="h-10 rounded-none border-l-2 border-transparent px-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black hover:bg-zinc-100 data-[active=true]:border-black data-[active=true]:bg-black data-[active=true]:text-white"
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.25} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-black p-4">
          <button onClick={onQuickAdd} className="flex h-10 w-full items-center justify-center gap-2 bg-[#e52521] text-[11px] font-black uppercase tracking-[0.13em] text-white transition-transform duration-150 active:scale-[0.97]">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Novo grupo
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-white">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-black bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-8 w-8 rounded-none border border-black bg-white text-black hover:bg-black hover:text-white md:hidden" />
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-[#e52521]" aria-hidden="true" />
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-black">{activeItem?.label}</p>
            </div>
          </div>
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500 sm:block">Gestão de avaliações</p>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
