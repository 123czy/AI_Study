import Link from "next/link"

const navItems = [
    {
        label: '个人信息',
        href: '/Meet/info',
    },
    {
        label: '开始面试',
        href: '/Meet/Interview',
    },
    {
        label: '面试记录',
        href: '/Meet/record',
    },
    {
        label: '面试结果',
        href: '/Meet/result',
    },
    {
        label: '面试评分',
        href: '/Meet/score',
    }
]

const Header = () => {
    return (
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-cyan-500/50">
            <div className="container mx-auto xl:px-8 lg:px-6 md:px-4  ">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="cursor-pointer text-xl sm:text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
                            <Link href="/Meet">
                                AI 面试官
                            </Link>
                        </h1>
                    </div>
                    <div className="flex items-center gap-10">
                        {navItems.map((item) => (
                            <div key={item.href} className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors">
                                <Link href={item.href}>
                                    {item.label}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header