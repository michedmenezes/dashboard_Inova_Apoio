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

export default function DashboardLayout({
  activeKey,
  items,
  onNavigate,
  onQuickAdd,
  children,
}: DashboardLayoutProps) {
  const activeItem = items.find(item => item.key === activeKey);

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="offcanvas"
        className="border-r border-[#d9e6df] bg-[#fbfdfb]"
      >
      <SidebarHeader className="h-auto border-b border-[#d9e6df] p-0">
          <div className="flex min-h-32 items-end justify-between rounded-br-[2rem] bg-[#0b5b4b] p-5 text-white">
            <div>
              <div className="mb-3 h-6 w-6 rounded-full bg-[#c9ef73]" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Feira de Tecnologia
              </p>
              <h1 className="mt-1 text-xl font-black tracking-[-0.07em] text-white">
                INOVAPOIO
              </h1>
            </div>
            <span className="text-[10px] font-semibold text-[#c9ef73]">
              ADMIN
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Navegação
          </p>
          <SidebarMenu>
            {items.map(item => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeKey === item.key}
                    onClick={() => onNavigate(item.key)}
                    className="h-11 rounded-xl border-l-2 border-transparent px-3 text-[12px] font-bold uppercase tracking-[0.04em] text-[#24453b] hover:bg-[#edf5ef] data-[active=true]:border-[#0b5b4b] data-[active=true]:bg-[#dceee5] data-[active=true]:text-[#0b5b4b]"
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.25} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-[#d9e6df] p-4">
          <button
            onClick={onQuickAdd}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b5b4b] text-[11px] font-black uppercase tracking-[0.13em] text-white transition-transform duration-150 active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Novo grupo
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#fbfdfb]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#d9e6df] bg-[#fbfdfb] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-8 w-8 rounded-none border border-black bg-white text-black hover:bg-black hover:text-white md:hidden" />
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#c9ef73]" aria-hidden="true" />
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-black">
                {activeItem?.label}
              </p>
            </div>
          </div>
          <p className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500 sm:block">
            Gestão de avaliações
          </p>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
