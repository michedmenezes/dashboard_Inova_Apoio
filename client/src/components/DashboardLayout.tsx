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
              <div
                className="mb-3 h-6 w-6 rounded-full bg-[#c9ef73]"
                aria-hidden="true"
              />
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
          <SidebarMenu className="gap-2">
            {items.map(item => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeKey === item.key}
                    onClick={() => onNavigate(item.key)}
                    className="group h-12 rounded-2xl border border-transparent px-3 text-[12px] font-bold uppercase tracking-[0.04em] text-[#17332b] hover:border-[#b8d7c5] hover:bg-[#f0f8ef] data-[active=true]:border-[#0b5b4b] data-[active=true]:bg-[#dff1e5] data-[active=true]:text-[#0b5b4b]"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[11px] border-2 border-[#10231d] bg-[#c9f36b] text-[#10231d] shadow-[2px_2px_0_#10231d] transition-transform duration-150 group-hover:-translate-y-0.5 group-data-[active=true]:bg-[#b9e95d]">
                      <Icon className="h-[17px] w-[17px]" strokeWidth={2.6} />
                    </span>
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
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#10231d] bg-[#c9f36b] text-[11px] font-black uppercase tracking-[0.13em] text-[#10231d] shadow-[3px_3px_0_#10231d] transition-transform duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#10231d] bg-[#f8fff6]">
              <Plus className="h-4 w-4" strokeWidth={2.8} />
            </span>
            Novo grupo
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#fbfdfb]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#d9e6df] bg-[#fbfdfb] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-9 w-9 rounded-xl border-2 border-[#10231d] bg-[#c9f36b] text-[#10231d] shadow-[2px_2px_0_#10231d] hover:bg-[#b9e95d] md:hidden" />
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full bg-[#c9ef73]"
                aria-hidden="true"
              />
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
