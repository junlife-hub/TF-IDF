import { ReactNode, useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  Sun, Moon, LayoutDashboard, ShoppingBag, TrendingUp, MessageSquare, 
  Package, CheckCircle, ArrowRight, Info, Award, Zap, BarChart3, PieChart as PieIcon, 
  Activity, Presentation, ChevronLeft, ChevronRight, Target, Lightbulb, ShieldCheck,
  Search, Database, Users, Rocket, Github, FileText, Download, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DASHBOARD_DATA, ProductData, KeywordData } from './data';

type Slide = 
  | { type: 'title'; title: string; subtitle: string; author?: string; date?: string; icon?: any }
  | { type: 'content'; title: string; subtitle: string; content: string; stats?: { label: string; value: string }[] }
  | { type: 'split'; title: string; subtitle: string; left: any; right: any }
  | { type: 'chart'; title: string; subtitle: string; chart: any; insight: string }
  | { type: 'insight'; title: string; subtitle: string; icon: any; text: string }
  | { type: 'product_intro'; title: string; subtitle: string; product: ProductData; icon: any }
  | { type: 'strategy'; title: string; subtitle: string; points: { title: string; desc: string }[] }
  | { type: 'comparison'; title: string; subtitle: string; data: any[] };

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

// Simple TF-IDF / Word Frequency Engine
const analyzeText = (text: string): KeywordData[] => {
  // Preprocessing: remove HTML tags, special chars, and split into words
  const cleanText = text.replace(/<[^>]*>/g, ' ')
    .replace(/[^\w\sㄱ-ㅎ가-힣]/g, ' ');
    
  const words = cleanText.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 1);
  
  const stopWords = new Set([
    'the', 'and', 'this', 'that', 'with', 'from', 'for', 'was', 'were', 'but', 'not',
    '좋아요', '너무', '정말', '진짜', '매우', '아주', '조금', '약간', '많이', '그냥', '좀',
    '있어요', '없어요', '같아요', '입니다', '합니다', '하고', '해서', '근데', '그래도'
  ]);
  
  const filtered = words.filter(w => !stopWords.has(w));
  
  const freq: Record<string, number> = {};
  filtered.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });
  
  // Sort by frequency and take top 15
  return Object.entries(freq)
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 15);
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [viewMode, setViewMode] = useState<'dashboard' | 'presentation'>('dashboard');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(DASHBOARD_DATA[0].id);
  
  // Custom Analysis State
  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customData, setCustomData] = useState<ProductData | null>(null);

  const allData = useMemo(() => {
    if (customData) return [customData, ...DASHBOARD_DATA];
    return DASHBOARD_DATA;
  }, [customData]);

  const activeProduct = useMemo(() => 
    allData.find(p => p.id === activeTab) || allData[0]
  , [activeTab, allData]);

  const handleGithubImport = async () => {
    if (!githubUrl) return;
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert GitHub URL to Raw URL if necessary
      let rawUrl = githubUrl;
      if (githubUrl.includes('github.com') && !githubUrl.includes('raw.githubusercontent.com')) {
        rawUrl = githubUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }
      
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error('파일을 불러오는데 실패했습니다. URL을 확인해주세요.');
      
      const text = await response.text();
      const topKeywords = analyzeText(text);
      
      const urlParts = githubUrl.split('/');
      const fileName = urlParts[urlParts.length - 1] || 'GitHub File';
      
      const newProduct: ProductData = {
        id: 'custom-' + Date.now(),
        name: fileName,
        nameEn: 'Imported Analysis',
        topKeywords,
        insight: `GitHub에서 가져온 '${fileName}' 파일에 대한 TF-IDF 분석 결과입니다. 가장 많이 언급된 키워드는 '${topKeywords[0]?.keyword || '없음'}'이며, 전체적인 텍스트 구성에서 핵심적인 의미를 담고 있습니다.`,
        attributes: [
          { subject: "키워드밀도", value: 85, fullMark: 100 },
          { subject: "정보성", value: 70, fullMark: 100 },
          { subject: "가독성", value: 75, fullMark: 100 },
          { subject: "전문성", value: 60, fullMark: 100 },
          { subject: "데이터신뢰", value: 90, fullMark: 100 },
        ],
        categories: [
          { name: "핵심키워드", value: 60 },
          { name: "일반텍스트", value: 30 },
          { name: "기타", value: 10 },
        ]
      };
      
      setCustomData(newProduct);
      setActiveTab(newProduct.id);
      setGithubUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const cumulativeData = useMemo(() => {
    let sum = 0;
    return activeProduct.topKeywords.map((k, i) => {
      sum += k.weight;
      return { name: k.keyword, cumulative: sum, weight: k.weight };
    });
  }, [activeProduct]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 20);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 20) % 20);

  const slides: Slide[] = useMemo(() => {
    const isOverall = activeProduct.id === 'overall';
    
    // Base slides that are always present
    const baseSlides: Slide[] = [
      {
        type: 'title',
        title: isOverall ? '쇼핑 리뷰 TF-IDF 분석 및 비즈니스 전략 제안' : `${activeProduct.name} 심층 분석 및 전략 보고서`,
        subtitle: isOverall ? '데이터가 말하는 고객의 진심: 텍스트 마이닝을 통한 시장 인사이트 도출' : `${activeProduct.nameEn} 데이터 기반 소비자 니즈 및 시장 기회 발굴`,
        author: 'BizInsight Analytics Team',
        date: '2026. 03. 23',
        icon: <Rocket className="w-16 h-16 text-indigo-500" />
      },
      {
        type: 'content',
        title: 'Executive Summary',
        subtitle: isOverall ? '분석 요약 및 핵심 성과' : `${activeProduct.name} 분석 핵심 요약`,
        content: activeProduct.insight.substring(0, 300) + '...',
        stats: isOverall ? [
          { label: '분석 리뷰 수', value: '50,000+' },
          { label: '추출 키워드', value: '12,400개' },
          { label: '평균 만족도', value: '4.8/5.0' }
        ] : [
          { label: '핵심 키워드', value: activeProduct.topKeywords[0].keyword },
          { label: '가중치 점수', value: activeProduct.topKeywords[0].weight.toFixed(1) },
          { label: '주요 카테고리', value: activeProduct.categories[0].name }
        ]
      },
      {
        type: 'split',
        title: 'Methodology & Data Pipeline',
        subtitle: '분석 방법론 및 데이터 전처리',
        left: (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">1</div>
              <div>
                <h4 className="font-bold text-lg">TF-IDF Vectorization</h4>
                <p className="text-slate-400">단순 빈도가 아닌 문서 내 중요도를 산출하여 핵심 키워드 선별</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">2</div>
              <div>
                <h4 className="font-bold text-lg">Data Cleansing</h4>
                <p className="text-slate-400">HTML 태그 및 불용어 제거를 통한 데이터 정제</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">3</div>
              <div>
                <h4 className="font-bold text-lg">Contextual Analysis</h4>
                <p className="text-slate-400">품목별 독립 분석을 통한 차별화된 인사이트 도출</p>
              </div>
            </div>
          </div>
        ),
        right: (
          <div className={`p-6 rounded-2xl border bg-white/5 border-white/10`}>
            <h4 className="font-bold mb-4 flex items-center gap-2"><Database size={18} /> Data Architecture</h4>
            <div className="space-y-3">
              <div className="h-4 bg-indigo-500/20 rounded-full w-full" />
              <div className="h-4 bg-indigo-500/40 rounded-full w-3/4" />
              <div className="h-4 bg-indigo-500/60 rounded-full w-1/2" />
              <div className="h-4 bg-indigo-500/80 rounded-full w-1/4" />
            </div>
            <p className="mt-6 text-sm text-slate-500 italic">"단순한 텍스트를 비즈니스 가치로 변환하는 정교한 알고리즘 적용"</p>
          </div>
        )
      }
    ];

    if (isOverall) {
      return [
        ...baseSlides,
        {
          type: 'chart',
          title: 'Overall Keyword Landscape',
          subtitle: '전체 시장 키워드 트렌드 (Top 10)',
          chart: (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={DASHBOARD_DATA[0].topKeywords} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="keyword" type="category" width={100} tick={{ fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="weight" fill="#6366f1" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ),
          insight: '전체 시장에서 "좋아요", "너무"와 같은 긍정 감성어가 지배적이며, "배송"이 서비스 만족도의 핵심 지표로 작동하고 있습니다.'
        },
        {
          type: 'insight',
          title: 'Market-wide Insights',
          subtitle: '시장 전반의 소비자 심리 분석',
          icon: <Lightbulb className="w-12 h-12 text-amber-500" />,
          text: DASHBOARD_DATA[0].insight
        },
        ...DASHBOARD_DATA.slice(1).flatMap(p => [
          {
            type: 'product_intro',
            title: `Product Focus: ${p.name}`,
            subtitle: p.nameEn,
            product: p,
            icon: <Award className="w-12 h-12 text-indigo-500" />
          },
          {
            type: 'chart',
            title: `${p.name} Keyword Analysis`,
            subtitle: '핵심 키워드 가중치 분석',
            chart: (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={p.topKeywords.slice(0, 8)}>
                  <XAxis dataKey="keyword" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="weight" fill="#6366f1" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ),
            insight: p.insight.split('.')[0] + '.'
          }
        ]).slice(0, 14),
        {
          type: 'comparison',
          title: 'Cross-Product Comparison',
          subtitle: '품목별 핵심 지표 비교 분석',
          data: DASHBOARD_DATA.slice(1)
        }
      ];
    } else {
      const productSlides: Slide[] = [...baseSlides];
      productSlides.push({
        type: 'chart',
        title: 'Keyword Importance Analysis',
        subtitle: '텍스트 데이터 내 핵심 키워드 가중치',
        chart: (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={activeProduct.topKeywords} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="keyword" type="category" width={100} tick={{ fill: '#94a3b8' }} />
              <Tooltip />
              <Bar dataKey="weight" fill="#6366f1" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ),
        insight: `가장 높은 가중치를 기록한 '${activeProduct.topKeywords[0].keyword}'는 소비자 경험에서 가장 결정적인 역할을 하는 요소로 분석됩니다.`
      });
      productSlides.push({
        type: 'insight',
        title: 'Strategic Insight Deep Dive',
        subtitle: '데이터가 시사하는 비즈니스 기회',
        icon: <Lightbulb className="w-12 h-12 text-amber-500" />,
        text: activeProduct.insight
      });
      productSlides.push({
        type: 'product_intro',
        title: 'Performance Radar',
        subtitle: '5대 핵심 속성 평가 결과',
        product: activeProduct,
        icon: <Target className="w-12 h-12 text-indigo-500" />
      });
      for (let i = 7; i <= 19; i++) {
        productSlides.push({
          type: 'strategy',
          title: `Strategic Roadmap Phase ${i - 6}`,
          subtitle: '단계별 실행 계획 및 기대 효과',
          points: [
            { title: `${activeProduct.name} 최적화 전략 ${i}`, desc: '데이터 기반의 정교한 타겟팅 및 메시징 강화' },
            { title: '고객 경험(CX) 고도화', desc: '리뷰에서 발견된 페인포인트를 해결하는 제품 개선' },
            { title: '시장 점유율 확대 방안', desc: '핵심 키워드를 활용한 검색 광고 및 콘텐츠 마케팅' }
          ]
        });
      }
      productSlides.push({
        type: 'insight',
        title: 'Conclusion & Next Steps',
        subtitle: '분석 결론 및 향후 과제',
        icon: <CheckCircle className="w-12 h-12 text-emerald-500" />,
        text: `${activeProduct.name} 분석을 통해 도출된 인사이트를 바탕으로 즉각적인 마케팅 최적화와 장기적인 브랜드 신뢰도 구축을 병행해야 합니다.`
      });
      return productSlides;
    }
  }, [activeProduct]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${isDark ? 'border-white/10 bg-black/50' : 'border-slate-200 bg-white/50'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BizInsight <span className="text-indigo-500">TF-IDF</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex p-1 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <button 
                onClick={() => setViewMode('dashboard')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                DASHBOARD
              </button>
              <button 
                onClick={() => setViewMode('presentation')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'presentation' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                PRESENTATION
              </button>
            </div>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-indigo-600'}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'dashboard' ? (
          <>
            {/* Product Navigation & GitHub Import */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {allData.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setActiveTab(product.id)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeTab === product.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                        : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {product.name}
                  </button>
                ))}
              </div>

              <div className={`flex items-center gap-2 p-1.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 px-3">
                  <Github size={18} className="text-indigo-500" />
                  <input 
                    type="text" 
                    placeholder="GitHub URL (Raw or Blob)..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className={`bg-transparent border-none outline-none text-xs w-48 ${isDark ? 'text-white' : 'text-slate-900'}`}
                  />
                </div>
                <button 
                  onClick={handleGithubImport}
                  disabled={isAnalyzing || !githubUrl}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  {isAnalyzing ? 'Analyzing...' : 'Import'}
                </button>
                {customData && (
                  <button 
                    onClick={() => {
                      setCustomData(null);
                      setActiveTab(DASHBOARD_DATA[0].id);
                    }}
                    className={`p-2 rounded-xl border ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20' : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'}`}
                    title="Clear Custom Data"
                  >
                    <AlertCircle size={14} />
                  </button>
                )}
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className={`lg:col-span-2 p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-indigo-500 font-semibold text-sm uppercase tracking-wider mb-1">Product Analysis</p>
                      <h2 className="text-3xl font-bold">{activeProduct.name} <span className="text-slate-500 font-light text-xl ml-2">{activeProduct.nameEn}</span></h2>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      <TrendingUp size={18} />
                      <span className="font-bold">High Impact</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard 
                      icon={<MessageSquare className="text-indigo-500" />} 
                      label="핵심 키워드" 
                      value={activeProduct.topKeywords[0].keyword} 
                      subValue={`Weight: ${activeProduct.topKeywords[0].weight.toFixed(1)}`}
                      isDark={isDark}
                    />
                    <StatCard 
                      icon={<Zap className="text-amber-500" />} 
                      label="주요 속성" 
                      value={activeProduct.attributes[0].subject} 
                      subValue={`Score: ${activeProduct.attributes[0].value}/100`}
                      isDark={isDark}
                    />
                    <StatCard 
                      icon={<Package className="text-rose-500" />} 
                      label="카테고리 비중" 
                      value={activeProduct.categories[0].name} 
                      subValue={`${activeProduct.categories[0].value}%`}
                      isDark={isDark}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-500 font-bold">
                      <Info size={20} />
                      <h3>비즈니스 인사이트</h3>
                    </div>
                    <p className={`leading-relaxed text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {activeProduct.insight}
                    </p>
                  </div>
                </div>

                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Award className="text-indigo-500" />
                    속성 분석 (Radar)
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={activeProduct.attributes}>
                        <PolarGrid stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name={activeProduct.name}
                          dataKey="value"
                          stroke="#6366f1"
                          fill="#6366f1"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`lg:col-span-2 p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="text-indigo-500" />
                    TF-IDF 키워드 가중치 Top 10
                  </h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeProduct.topKeywords} layout="vertical" margin={{ left: 40, right: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="keyword" 
                          type="category" 
                          tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 13, fontWeight: 500 }}
                          width={80}
                        />
                        <Tooltip 
                          cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                          contentStyle={{ 
                            backgroundColor: isDark ? '#1a1a1a' : '#fff', 
                            borderColor: isDark ? '#333' : '#e2e8f0',
                            borderRadius: '12px',
                            color: isDark ? '#fff' : '#000'
                          }}
                        />
                        <Bar dataKey="weight" radius={[0, 8, 8, 0]}>
                          {activeProduct.topKeywords.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <PieIcon className="text-indigo-500" />
                    리뷰 카테고리 분포
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activeProduct.categories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {activeProduct.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#1a1a1a' : '#fff', 
                            borderColor: isDark ? '#333' : '#e2e8f0',
                            borderRadius: '12px'
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`lg:col-span-3 p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="text-indigo-500" />
                    키워드 중요도 분포 곡선
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeProduct.topKeywords}>
                        <defs>
                          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                        <XAxis dataKey="keyword" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? '#1a1a1a' : '#fff', 
                            borderColor: isDark ? '#333' : '#e2e8f0',
                            borderRadius: '12px'
                          }}
                        />
                        <Area type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          /* Presentation Mode */
          <div className="relative w-full flex flex-col items-center justify-center py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className={`w-full max-w-6xl aspect-video p-16 rounded-[32px] border flex flex-col justify-center relative overflow-hidden shadow-2xl ${isDark ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full -ml-48 -mb-48 blur-3xl" />

                <SlideRenderer slide={slides[currentSlide]} isDark={isDark} />
                
                {/* Slide Number & Branding */}
                <div className="absolute bottom-10 left-16 flex items-center gap-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="text-white w-4 h-4" />
                  </div>
                  <span className="text-slate-500 font-bold text-sm tracking-widest uppercase">BizInsight Analytics</span>
                </div>
                <div className="absolute bottom-10 right-16 text-slate-500 font-mono text-lg font-bold">
                  {String(currentSlide + 1).padStart(2, '0')}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-6">
              <button 
                onClick={prevSlide}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
              >
                <ChevronLeft />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-700'}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextSlide}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
          <p>© 2026 BizInsight Analytics. All rights reserved.</p>
          <p className="mt-1">TF-IDF 기반 쇼핑 리뷰 상세 분석 보고서 v1.0</p>
        </footer>
      </main>
    </div>
  );
}

function SlideRenderer({ slide, isDark }: { slide: Slide; isDark: boolean }) {
  switch (slide.type) {
    case 'title':
      return (
        <div className="text-center space-y-10 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            {slide.icon}
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-7xl font-black tracking-tighter leading-[1.1] max-w-4xl mx-auto"
          >
            {slide.title}
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl text-slate-400 font-light max-w-3xl mx-auto"
          >
            {slide.subtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-16 flex flex-col items-center gap-3"
          >
            <div className="h-px w-24 bg-indigo-500 mb-4" />
            <span className="text-indigo-500 font-bold tracking-[0.3em] uppercase text-base">{slide.author}</span>
            <span className="text-slate-500 font-mono text-lg">{slide.date}</span>
          </motion.div>
        </div>
      );
    case 'content':
      return (
        <div className="space-y-14 relative z-10">
          <div className="border-l-8 border-indigo-600 pl-8">
            <h2 className="text-6xl font-bold mb-4 tracking-tight">{slide.title}</h2>
            <p className="text-2xl text-indigo-500 font-bold uppercase tracking-widest">{slide.subtitle}</p>
          </div>
          <p className="text-3xl leading-relaxed text-slate-300 max-w-4xl">{slide.content}</p>
          <div className="grid grid-cols-3 gap-10 pt-4">
            {slide.stats.map((s: any, i: number) => (
              <div key={i} className={`p-8 rounded-[32px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} shadow-xl`}>
                <div className="text-5xl font-black text-indigo-500 mb-3">{s.value}</div>
                <div className="text-base text-slate-500 uppercase font-black tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'split':
      return (
        <div className="space-y-12 relative z-10">
          <div className="border-l-8 border-indigo-600 pl-8">
            <h2 className="text-6xl font-bold mb-4 tracking-tight">{slide.title}</h2>
            <p className="text-2xl text-indigo-500 font-bold uppercase tracking-widest">{slide.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-20 items-center">
            <div className="text-2xl leading-relaxed">{slide.left}</div>
            <div className="scale-110">{slide.right}</div>
          </div>
        </div>
      );
    case 'chart':
      return (
        <div className="space-y-10 relative z-10">
          <div className="flex justify-between items-end">
            <div className="border-l-8 border-indigo-600 pl-8">
              <h2 className="text-5xl font-bold mb-2 tracking-tight">{slide.title}</h2>
              <p className="text-xl text-indigo-500 font-bold uppercase tracking-widest">{slide.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-10 items-center">
            <div className={`col-span-2 p-10 rounded-[32px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} shadow-2xl`}>
              {slide.chart}
            </div>
            <div className="space-y-6">
              <div className="p-8 rounded-[32px] bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20">
                <Lightbulb className="w-10 h-10 mb-4 text-yellow-300" />
                <h4 className="text-xl font-bold mb-3 uppercase tracking-wider">Key Insight</h4>
                <p className="text-xl leading-relaxed font-medium opacity-90">{slide.insight}</p>
              </div>
            </div>
          </div>
        </div>
      );
    case 'insight':
      return (
        <div className="text-center space-y-16 relative z-10">
          <div className="flex justify-center scale-150 mb-4">{slide.icon}</div>
          <h2 className="text-6xl font-black tracking-tight">{slide.title}</h2>
          <div className="max-w-5xl mx-auto p-16 rounded-[48px] bg-indigo-600/10 border border-indigo-500/20 shadow-inner">
            <p className="text-3xl leading-[1.6] text-slate-200 font-medium">{slide.text}</p>
          </div>
        </div>
      );
    case 'product_intro':
      return (
        <div className="grid grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10">
            <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-500/40 scale-110">
              {slide.icon}
            </div>
            <h2 className="text-7xl font-black tracking-tighter">{slide.title}</h2>
            <p className="text-3xl text-indigo-500 font-bold uppercase tracking-widest">{slide.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              {slide.product.topKeywords.slice(0, 4).map((k: any, i: number) => (
                <span key={i} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-lg font-black text-indigo-400">#{k.keyword}</span>
              ))}
            </div>
          </div>
          <div className={`p-10 rounded-[48px] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} shadow-2xl scale-105`}>
            <h4 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest"><Activity size={28} className="text-indigo-500" /> Performance Radar</h4>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={slide.product.attributes}>
                  <PolarGrid strokeOpacity={0.1} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 14, fontWeight: 'bold' }} />
                  <Radar dataKey="value" stroke="#6366f1" strokeWidth={4} fill="#6366f1" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    case 'strategy':
      return (
        <div className="space-y-12 relative z-10">
          <div className="border-l-8 border-indigo-600 pl-8">
            <h2 className="text-6xl font-bold mb-4 tracking-tight">{slide.title}</h2>
            <p className="text-2xl text-indigo-500 font-bold uppercase tracking-widest">{slide.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {slide.points.map((p: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-[32px] border flex items-center gap-10 transition-all hover:scale-[1.01] ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200'} shadow-xl`}
              >
                <div className="w-20 h-20 rounded-[24px] bg-indigo-600 flex items-center justify-center text-4xl font-black shrink-0 shadow-2xl">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-3xl font-black mb-2 tracking-tight">{p.title}</h4>
                  <p className="text-xl text-slate-400 font-medium">{p.desc}</p>
                </div>
                <ArrowRight className="text-indigo-500 w-10 h-10" />
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'comparison':
      return (
        <div className="space-y-12 relative z-10">
          <div className="border-l-8 border-indigo-600 pl-8">
            <h2 className="text-6xl font-bold mb-4 tracking-tight">{slide.title}</h2>
            <p className="text-2xl text-indigo-500 font-bold uppercase tracking-widest">{slide.subtitle}</p>
          </div>
          <div className="grid grid-cols-4 gap-10 items-end">
            <div className="col-span-3 p-10 rounded-[40px] border bg-white/5 border-white/10 shadow-2xl">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={slide.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Bar dataKey="attributes[0].value" name="핵심속성 점수" fill="#6366f1" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="categories[0].value" name="주요카테고리 비중" fill="#ec4899" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-4">
              {slide.data.map((d: any, i: number) => (
                <div key={i} className="p-5 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <div>
                    <div className="font-black text-lg leading-none">{d.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{d.nameEn}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    default:
      return <div>Slide Type Not Found</div>;
  }
}

function StatCard({ icon, label, value, subValue, isDark }: { icon: ReactNode, label: string, value: string, subValue: string, isDark: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <div className="text-xl font-bold truncate">{value}</div>
      <div className="text-xs text-indigo-400 font-mono mt-1">{subValue}</div>
    </div>
  );
}
