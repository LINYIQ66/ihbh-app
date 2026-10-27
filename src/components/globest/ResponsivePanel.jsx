import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
export default function ResponsivePanel({ open, onOpenChange, title, description, children, wide = false }) {
  const mobile = useIsMobile();
  if (mobile) return <Drawer open={open} onOpenChange={onOpenChange}><DrawerContent className="max-h-[90dvh] bg-background" onKeyDown={e => { if (e.key === 'Escape') onOpenChange(false); }}><DrawerHeader className="shrink-0"><DrawerTitle>{title}</DrawerTitle><DrawerDescription>{description}</DrawerDescription></DrawerHeader><div className="flex justify-end px-5"><DrawerClose asChild><button type="button" className="text-link">关闭</button></DrawerClose></div><div className="panel-scroll-body overflow-y-auto p-5 pb-8">{children}</div></DrawerContent></Drawer>;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className={wide ? 'max-h-[85dvh] overflow-hidden flex flex-col bg-card sm:max-w-4xl' : 'max-h-[85dvh] overflow-hidden flex flex-col bg-[#FBF9F5] sm:max-w-xl'}><DialogHeader className="shrink-0"><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader><div className="panel-scroll-body min-h-0 overflow-y-auto py-2">{children}</div></DialogContent></Dialog>;
}