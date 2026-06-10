import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles,
  Blocks,
  Puzzle,
  MonitorIcon,
  Shield,
  Code2,
  Zap,
  Globe,
  Download,
  Apple,
  Menu,
  X,
  ArrowRight,
  Check,
  Cpu,
  Terminal,
  Bot,
  ChevronDown,
  ExternalLink,
} from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import './App.css'

/* GitHub icon as inline SVG (not available in this lucide-react version) */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

/* ==================== NavBar ==================== */
function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: '功能', href: '#features' },
    { label: '模型', href: '#models' },
    { label: '对比', href: '#comparison' },
    { label: '截图', href: '#gallery' },
    { label: '下载', href: '#download' },
  ]

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">
              哈基米
              <span className="font-normal text-sm ml-1.5 text-muted-foreground">Hajimi</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-black/[0.03]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/HAJIMI-AI/HAJIMI_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-black/[0.03]"
            >
              <GitHubIcon className="size-4" />
              <span>GitHub</span>
            </a>
            <a href="#download">
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow btn-shimmer"
              >
                <Download data-icon="inline-start" />
                免费下载
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-black/[0.04] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-2.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://github.com/HAJIMI-AI/HAJIMI_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
            <a href="#download" onClick={() => setMenuOpen(false)}>
              <Button className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0">
                <Download data-icon="inline-start" />
                免费下载
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ==================== Hero Section ==================== */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/80">
      {/* Animated orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="hero-orb hero-orb-4" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid" />

      {/* Subtle top highlight */}
      <div
        className="absolute top-0 inset-x-0 h-80 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(6,214,160,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center py-32">
        {/* Badge */}
        <div className="animate-fade-in-scale opacity-0 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            <Sparkles className="size-3.5" />
            AI 桌面应用 · 跨平台
          </span>
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-up opacity-0 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 text-slate-900">
          <span className="gradient-text">哈基米</span>
        </h1>

        <p className="animate-fade-up delay-100 opacity-0 text-lg sm:text-xl md:text-2xl text-slate-500 mb-4 max-w-2xl mx-auto leading-relaxed">
          一站式 AI 桌面平台
        </p>

        <p className="animate-fade-up delay-200 opacity-0 text-base sm:text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
          集成 Claude、OpenAI、DeepSeek、Gemini 等大语言模型，
          可扩展应用生态与技能插件系统，让 AI 能力触手可及
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-up delay-300 opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#download">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all btn-shimmer"
            >
              <Download data-icon="inline-start" />
              立即下载
              <ArrowRight data-icon="inline-end" />
            </Button>
          </a>
          <a
            href="https://github.com/HAJIMI-AI/HAJIMI_AI"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-all"
            >
              <GitHubIcon data-icon="inline-start" />
              GitHub
              <ExternalLink data-icon="inline-end" className="size-3.5" />
            </Button>
          </a>
          <a href="#features">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-all"
            >
              了解更多
              <ChevronDown data-icon="inline-end" />
            </Button>
          </a>
        </div>

        {/* Platform icons */}
        <div className="animate-fade-up delay-500 opacity-0 mt-12 flex items-center justify-center gap-6 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Apple className="size-4" />
            <span className="text-xs font-medium">macOS</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <MonitorIcon className="size-4" />
            <span className="text-xs font-medium">Windows</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <Terminal className="size-4" />
            <span className="text-xs font-medium">Linux</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 scroll-indicator">
          <ChevronDown className="size-5 text-slate-300" />
        </div>
      </div>
    </section>
  )
}

/* ==================== Features Section ==================== */
const features = [
  {
    icon: Cpu,
    title: '多模型自由切换',
    description: '支持 Claude、OpenAI、DeepSeek、Gemini、Groq 等主流模型，一键切换默认模型，统一管理所有 AI 能力。',
    accentBorder: 'hover:border-emerald-200',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
  },
  {
    icon: Blocks,
    title: '可扩展应用生态',
    description: '支持本地导入、远程加载、指纹安装三种方式添加子应用，每个应用都是独立的 AI 驱动工具。',
    accentBorder: 'hover:border-violet-200',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50',
  },
  {
    icon: Puzzle,
    title: '技能插件系统',
    description: '上传自定义 Skill，组合为 Plugin Pack，让 AI Agent 获得专业领域能力，无限扩展 AI 的可能性。',
    accentBorder: 'hover:border-amber-200',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
  },
  {
    icon: Bot,
    title: 'Agent 调试窗口',
    description: '多轮对话界面，支持图片 Vision 输入，实时查看 Token 用量和费用，会话持久化支持断点续聊。',
    accentBorder: 'hover:border-cyan-200',
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-50',
  },
  {
    icon: Shield,
    title: '安全数据隔离',
    description: 'Token 安全存储，文件操作限定应用目录，通过 preload 安全调用主进程能力，防止越权访问。',
    accentBorder: 'hover:border-rose-200',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50',
  },
  {
    icon: Code2,
    title: '开发者友好',
    description: '内置开发者模式、一键开启 DevTools、模型调试工具，支持 MQTT 跨设备通信，降低 AI 开发门槛。',
    accentBorder: 'hover:border-teal-200',
    iconColor: 'text-teal-500',
    iconBg: 'bg-teal-50',
  },
]

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.1 })
  return (
    <div ref={ref} className={`reveal-hidden ${inView ? 'reveal-visible' : ''}`}>
      <div
        className={`reveal-child glass-card rounded-2xl p-6 h-full flex flex-col gap-4 ${feature.accentBorder}`}
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <div className={`size-11 rounded-xl ${feature.iconBg} flex items-center justify-center`}>
          <feature.icon className={`size-[22px] ${feature.iconColor}`} />
        </div>
        <div>
          <h3 className="font-semibold text-base mb-2 text-slate-900">{feature.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-emerald-600 mb-3 tracking-wider uppercase">核心能力</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            一切 AI 能力，<span className="gradient-text">一站集成</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            不再在浏览器、终端和各种 AI 工具之间切换，所有 AI 能力集成在一个桌面应用中
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==================== Models Section ==================== */
const models = [
  { name: 'Claude', provider: 'Anthropic', dot: 'bg-orange-400', badgeStyle: 'border-orange-200 bg-orange-50/60 text-orange-700' },
  { name: 'OpenAI', provider: 'GPT-4o / o3', dot: 'bg-green-400', badgeStyle: 'border-green-200 bg-green-50/60 text-green-700' },
  { name: 'DeepSeek', provider: 'DeepSeek AI', dot: 'bg-blue-400', badgeStyle: 'border-blue-200 bg-blue-50/60 text-blue-700' },
  { name: 'Gemini', provider: 'Google', dot: 'bg-violet-400', badgeStyle: 'border-violet-200 bg-violet-50/60 text-violet-700' },
  { name: 'Groq', provider: 'Groq Inc.', dot: 'bg-rose-400', badgeStyle: 'border-rose-200 bg-rose-50/60 text-rose-700' },
  { name: '自定义', provider: '兼容 OpenAI API', dot: 'bg-cyan-400', badgeStyle: 'border-cyan-200 bg-cyan-50/60 text-cyan-700' },
]

function ModelsSection() {
  const { ref, inView } = useInView({ threshold: 0.2 })
  return (
    <section id="models" className="relative py-24 lg:py-32 bg-slate-50/80 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob-bg w-[500px] h-[500px] bg-emerald-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="blob-bg w-[400px] h-[400px] bg-violet-500 top-0 right-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={ref} className={`reveal-hidden text-center mb-16 ${inView ? 'reveal-visible' : ''}`}>
          <p className="reveal-child text-sm font-semibold text-violet-600 mb-3 tracking-wider uppercase">模型支持</p>
          <h2 className="reveal-child delay-100 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            接入全球顶尖<span className="gradient-text"> AI 模型</span>
          </h2>
          <p className="reveal-child delay-200 text-slate-500 text-lg max-w-2xl mx-auto">
            一个平台，自由配置和切换所有主流 AI 模型，支持任意兼容 OpenAI API 接口的模型服务
          </p>
        </div>

        <div ref={ref} className={`reveal-hidden flex flex-wrap items-center justify-center gap-3 ${inView ? 'reveal-visible' : ''}`}>
          {models.map((model, i) => (
            <div key={model.name} className="reveal-child model-badge" style={{ animationDelay: `${200 + i * 80}ms` }}>
              <Badge variant="outline" className={`px-4 py-2.5 text-sm font-medium rounded-full cursor-default ${model.badgeStyle}`}>
                <span className={`size-2 rounded-full ${model.dot} mr-2 shadow-sm`} />
                {model.name}
                <span className="ml-1.5 text-xs opacity-50">{model.provider}</span>
              </Badge>
            </div>
          ))}
        </div>

        <div ref={ref} className={`reveal-hidden mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 ${inView ? 'reveal-visible' : ''}`}>
          {[
            { icon: Zap, title: '一键切换', desc: '设置默认模型，在对话中随时切换' },
            { icon: Globe, title: 'OpenAI 兼容', desc: '支持任意兼容 OpenAI API 的服务' },
            { icon: Shield, title: '安全存储', desc: 'Token 加密存储，不暴露于日志' },
          ].map((item, i) => (
            <div key={item.title} className="reveal-child glass-card rounded-xl p-5 flex items-start gap-4" style={{ animationDelay: `${500 + i * 100}ms` }}>
              <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <item.icon className="size-4 text-slate-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1 text-slate-700">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==================== Comparison Section ==================== */
const comparisonRows = [
  { feature: '多模型支持', hajimi: true, chatgpt: false, claude: false },
  { feature: '应用生态系统', hajimi: true, chatgpt: false, claude: false },
  { feature: '技能插件系统', hajimi: true, chatgpt: false, claude: false },
  { feature: '跨设备通信 (MQTT)', hajimi: true, chatgpt: false, claude: false },
  { feature: '开发者工具 / DevTools', hajimi: true, chatgpt: false, claude: false },
  { feature: '开源 / 可自部署', hajimi: true, chatgpt: false, claude: false },
  { feature: 'Vision 图片输入', hajimi: true, chatgpt: true, claude: true },
  { feature: '跨平台支持', hajimi: true, chatgpt: true, claude: true },
  { feature: 'Token 用量监控', hajimi: true, chatgpt: false, claude: true },
  { feature: '本地文件操作', hajimi: true, chatgpt: false, claude: false },
  { feature: '会话持久化', hajimi: true, chatgpt: true, claude: true },
]

function ComparisonSection() {
  const { ref, inView } = useInView({ threshold: 0.15 })
  return (
    <section id="comparison" className="relative py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div ref={ref} className={`reveal-hidden text-center mb-16 ${inView ? 'reveal-visible' : ''}`}>
          <p className="reveal-child text-sm font-semibold text-amber-600 mb-3 tracking-wider uppercase">为什么选择哈基米</p>
          <h2 className="reveal-child delay-100 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            全面超越<span className="gradient-text"> 官方桌面客户端</span>
          </h2>
          <p className="reveal-child delay-200 text-slate-500 text-lg max-w-2xl mx-auto">
            一个平台 = ChatGPT Desktop + Claude Desktop + 更多
          </p>
        </div>

        <div ref={ref} className={`reveal-hidden ${inView ? 'reveal-visible' : ''}`}>
          <div className="reveal-child glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="comparison-table w-full">
                <thead>
                  <tr>
                    <th className="w-[40%]">功能特性</th>
                    <th className="col-highlight text-emerald-600!">
                      <div className="flex items-center gap-2 font-semibold">
                        <Sparkles className="size-3.5" />哈基米
                      </div>
                    </th>
                    <th>ChatGPT Desktop</th>
                    <th>Claude Desktop</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature}>
                      <td className="font-medium text-slate-700">{row.feature}</td>
                      <td className="col-highlight">
                        {row.hajimi ? (
                          <Check className="size-4 text-emerald-500" />
                        ) : (
                          <X className="size-4 text-slate-200" />
                        )}
                      </td>
                      <td>
                        {row.chatgpt ? (
                          <Check className="size-4 text-slate-300" />
                        ) : (
                          <X className="size-4 text-slate-150" style={{ color: '#e2e8f0' }} />
                        )}
                      </td>
                      <td>
                        {row.claude ? (
                          <Check className="size-4 text-slate-300" />
                        ) : (
                          <X className="size-4 text-slate-150" style={{ color: '#e2e8f0' }} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==================== Gallery Section ==================== */
const screenshots = [
  { label: 'Agent 对话', desc: '多模型自由切换，Vision 图片输入', icon: Bot, image: '/screenshots/1.png' },
  { label: '应用管理', desc: '本地/远程/指纹三种导入方式', icon: Blocks, image: '/screenshots/2.png' },
  { label: '技能与插件', desc: '上传 Skill，组装 Plugin Pack', icon: Puzzle, image: '/screenshots/3.png' },
  { label: '模型配置', desc: '统一管理所有 AI 模型', icon: Cpu, image: '/screenshots/4.png' },
  { label: '开发者工具', desc: '一键开启 DevTools 调试', icon: Code2 },
]

function GallerySection() {
  return (
    <section id="gallery" className="relative py-24 lg:py-32 bg-slate-50/80 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob-bg w-[400px] h-[400px] bg-violet-500 top-1/3 right-0" />
        <div className="blob-bg w-[350px] h-[350px] bg-cyan-500 bottom-0 left-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-cyan-600 mb-3 tracking-wider uppercase">产品截图</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            精美的<span className="gradient-text"> 用户界面</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            现代化设计，专注开发者和 AI 爱好者的使用体验
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {screenshots.map((shot) => (
            <div key={shot.label}>
              <div className="screenshot-frame aspect-video group cursor-pointer">
                {/* Browser chrome dots */}
                <div className="window-dots">
                  <div className="window-dot bg-rose-300" />
                  <div className="window-dot bg-amber-300" />
                  <div className="window-dot bg-emerald-300" />
                </div>
                {/* Title bar */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-slate-100 to-transparent z-2" />
                {/* Screenshot image or placeholder */}
                {'image' in shot && shot.image ? (
                  <img
                    src={shot.image}
                    alt={shot.label}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-slate-50 to-white group-hover:from-white group-hover:to-slate-50 transition-colors">
                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200/50 transition-colors">
                      <shot.icon className="size-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    </div>
                    <p className="text-sm text-slate-400 group-hover:text-slate-500 transition-colors font-semibold">{shot.label}</p>
                    <p className="text-xs text-slate-300 group-hover:text-slate-400 transition-colors">{shot.desc}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==================== Stats Section ==================== */
function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.2 })
  return (
    <section className="relative py-20 bg-white">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div ref={ref} className={`reveal-hidden ${inView ? 'reveal-visible' : ''}`}>
          <div className="reveal-child glass-card rounded-3xl p-10 lg:p-16 bg-gradient-to-br from-white via-white to-slate-50/50">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: '6+', label: 'AI 模型提供商', icon: Cpu },
                { value: '3', label: '桌面平台支持', icon: MonitorIcon },
                { value: '∞', label: '可扩展子应用', icon: Blocks },
                { value: '开源', label: 'MIT 协议开放源代码', icon: GitHubIcon },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2">
                  <stat.icon className="size-5 text-slate-300 mb-1" />
                  <div className="text-3xl lg:text-4xl font-bold gradient-text">{stat.value}</div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==================== Download Section ==================== */
const downloadPlatforms = [
  {
    icon: Apple,
    label: 'macOS',
    desc: 'Apple Silicon · Intel',
    archs: [
      { label: 'Apple Silicon (arm64)', ext: '.zip', size: '171 MB', href: encodeURI('/哈基米-1.0.2-arm64-mac.zip') },
      { label: 'Intel (x64)', ext: '.zip', size: '171 MB', href: encodeURI('/哈基米-1.0.2-mac.zip') },
    ],
    cardClass: 'download-card-mac',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    tagClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    icon: MonitorIcon,
    label: 'Windows',
    desc: 'Windows 10 / 11',
    archs: [
      { label: 'x64 安装包', ext: '.exe', size: '147 MB', href: encodeURI('/哈基米 Setup 1.0.2.exe') },
    ],
    cardClass: 'download-card-win',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    tagClass: 'bg-violet-50 text-violet-700 border-violet-200',
  },
]

function DownloadSection() {
  return (
    <section id="download" className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob-bg w-[450px] h-[450px] bg-emerald-500 -bottom-32 left-1/4" />
        <div className="blob-bg w-[400px] h-[400px] bg-violet-500 -bottom-32 right-1/4" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-emerald-600 mb-3 tracking-wider uppercase">开始使用</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            下载<span className="gradient-text"> 哈基米</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            选择你的平台，开始一站式 AI 桌面体验。当前版本 v1.0.2
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {downloadPlatforms.map((platform) => (
            <div key={platform.label}>
              <div className={`download-card ${platform.cardClass} glass-card rounded-2xl p-6 h-full flex flex-col`}>
                <div className={`size-12 rounded-xl ${platform.iconBg} flex items-center justify-center mb-4`}>
                  <platform.icon className={`size-6 ${platform.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-1 text-slate-900">{platform.label}</h3>
                <p className="text-sm text-slate-400 mb-6">{platform.desc}</p>
                <div className="flex flex-col gap-2.5 mt-auto">
                  {platform.archs.map((arch) => (
                    <a key={arch.label} href={arch.href} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full justify-between border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-all group"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="size-4" />
                          {arch.label}
                        </span>
                        <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">{arch.size}</span>
                      </Button>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-slate-300">
            下载即表示同意服务条款和隐私政策 · 支持 macOS 12+ / Windows 10+ / Ubuntu 20.04+
          </p>
        </div>
      </div>
    </section>
  )
}

/* ==================== Footer ==================== */
function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <Sparkles className="size-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-slate-800">哈基米 Hajimi</span>
            <span className="text-xs text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded font-mono">v1.0.2</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">关于</a>
            <a href="#" className="hover:text-slate-600 transition-colors">文档</a>
            <a href="https://github.com/HAJIMI-AI/HAJIMI_AI" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors flex items-center gap-1">
              GitHub
              <ExternalLink className="size-3" />
            </a>
            <a href="https://github.com/HAJIMI-AI/HAJIMI_AI/issues" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">反馈</a>
          </div>

          <p className="text-xs text-slate-300">
            © 2025 Hajimi. Built with Electron + React + Claude AI
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ==================== App ==================== */
export default function App() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <NavBar />
      <main>
        <HeroSection />
        <Separator className="mx-auto max-w-7xl opacity-[0.06]" />
        <FeaturesSection />
        <Separator className="mx-auto max-w-7xl opacity-[0.06]" />
        <ModelsSection />
        <Separator className="mx-auto max-w-7xl opacity-[0.06]" />
        <ComparisonSection />
        <Separator className="mx-auto max-w-7xl opacity-[0.06]" />
        <GallerySection />
        <StatsSection />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  )
}
