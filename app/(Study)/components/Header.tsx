'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const GitHubIcon = () => (
  <svg height="32" width="32" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

/**
 * 响应式Header组件
 * 在桌面端显示完整导航，在移动端显示汉堡菜单
 */
const Header = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 导航项配置
  const navigationItems = [
    { href: '/Main', label: '主页' },
    { href: '/Main/Scenes', label: '场景练习' },
    { href: '/Main/Voices', label: '发音纠错' },
    { href: '/Main/Pictures', label: '拍照识图' },
    { href: '/Main/Setting', label: '设置' },
  ]

  /**
   * 渲染导航链接
   * @param item 导航项
   * @param isMobile 是否为移动端
   */
  const renderNavLink = (item: { href: string; label: string }, isMobile = false) => (
    <Link
      key={item.href}
      href={item.href}
      className={`${
        pathname === item.href
          ? 'text-primary text-lg font-bold border-b-2 border-primary pb-1'
          : 'text-card-foreground/60 text-lg font-bold hover:text-primary'
      } transition-colors ${
        isMobile ? 'block py-3 px-4 text-lg border-b-0 hover:bg-accent rounded-md' : ''
      }`}
      onClick={() => isMobile && setIsMobileMenuOpen(false)}
    >
      {item.label}
    </Link>
  )

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-cyan-500/50">
        <div className="container mx-auto xl:px-8 lg:px-6 md:px-4  ">
          <div className="flex h-16 items-center justify-between">
            {/* Logo区域 */}
            <div className="flex items-center">
              <h1 className="cursor-pointer text-xl sm:text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
                <Link href="/Main">
                  英语角
                </Link>
              </h1>
            </div>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => renderNavLink(item))}
              
              {/* 用户头像下拉菜单 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer w-8 h-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Billing
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* GitHub链接 */}
              <a
                href="https://github.com/iwangjie/english-chunks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-accent"
              >
                <GitHubIcon />
              </a>
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="h-10 w-10"
                aria-label="打开菜单"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端抽屉菜单 */}
      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent className="sm:max-w-md w-full h-full sm:h-auto fixed right-0 top-0 translate-x-0 translate-y-0 sm:translate-x-[-50%] sm:translate-y-[-50%] data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%] sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%] rounded-none sm:rounded-lg border-l sm:border">
          <div className="flex flex-col space-y-2 py-4">
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-6 w-6 font-bold text-primary" />
            </Button>
            {/* 导航项 */}
            {navigationItems.map((item) => renderNavLink(item, true))}
            
            <div className="border-t pt-4 mt-4">
              {/* 用户信息 */}
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-md">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">用户名</span>
                  <span className="text-xs text-muted-foreground">user@example.com</span>
                </div>
              </div>
              
              {/* 菜单项 */}
              <div className="space-y-1 mt-2">
                <Button variant="ghost" className="w-full justify-start px-4" onClick={() => setIsMobileMenuOpen(false)}>
                  个人资料
                </Button>
                <Button variant="ghost" className="w-full justify-start px-4" onClick={() => setIsMobileMenuOpen(false)}>
                  账单
                </Button>
                <Button variant="ghost" className="w-full justify-start px-4" onClick={() => setIsMobileMenuOpen(false)}>
                  设置
                </Button>
                <div className="border-t pt-2 mt-2">
                  <Button variant="ghost" className="w-full justify-start px-4 text-destructive hover:text-destructive" onClick={() => setIsMobileMenuOpen(false)}>
                    退出登录
                  </Button>
                </div>
              </div>
              
              {/* GitHub链接 */}
              <div className="mt-4 pt-4 border-t">
                <a
                  href="https://github.com/iwangjie/english-chunks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Header
