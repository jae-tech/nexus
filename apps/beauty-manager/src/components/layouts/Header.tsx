import type { ReactNode } from 'react';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
  searchBar?: ReactNode;
  actions?: ReactNode;
}

export function Header({ title, searchBar, actions }: HeaderProps) {
  return (
    <div className="flex h-20 items-center border-b border-border bg-card px-8 py-6">
      <div className="flex w-full items-center justify-between">
        {/* 좌측: 타이틀 */}
        {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}

        {/* 우측: 검색바, 액션 버튼, 알림, 프로필 */}
        <div className="flex items-center gap-4">
          {searchBar}
          {actions}

          {/* 알림 버튼 */}
          <Button variant="ghost" size="icon">
            <Bell size={18} className="text-gray-600" />
          </Button>

          {/* 프로필 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>관</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">관리자</p>
                  <p className="text-xs text-muted-foreground">admin@salon.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User size={18} className="mr-2 text-gray-600" />
                프로필
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings size={18} className="mr-2 text-gray-600" />
                설정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut size={18} className="mr-2 text-gray-600" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
