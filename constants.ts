
import { NavItem, Product, Service, Solution, Banner, ServiceDetailData, HomePageData } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: '首页', path: '/' },
  { label: '关于鑫隆盛', path: '/about' },
  { label: '智能设备', path: '/products' },
  { label: '解决方案', path: '/solutions' },
  { label: '服务支持', path: '/service' },
  { label: '联系我们', path: '/contact' },
];

export const COMPANY_INFO = {
  name: "惠州市鑫隆盛科技有限公司",
  nameEn: "XELNS TECHNOLOGY",
  address: "广东省惠州市惠城区江北三新三角湖路南17号A栋",
  tel: "181-2962-7221",
  mobile: "181-2962-7221",
  email: "xlsbarcode@163.com",
  website: "www.xlsbarcode.com",
  qq: ["1666146956", "812829481"],
  wechatQr: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://weixin.qq.com/r/XELNS_TECH", // Placeholder QR
  logo: "", 
  aboutContent: `
    <h3 class="text-2xl font-bold mb-4">智造未来，码动世界</h3>
    <p class="mb-4 text-lg text-gray-600">惠州市鑫隆盛科技有限公司（XELNS Technology）是国内领先的条码自动识别技术解决方案提供商。自成立以来，我们始终致力于将先进的自动识别技术（AIDC）与物联网（IoT）技术深度融合，为智能制造、现代物流、零售电商及公共事业等领域提供全方位的数字化转型服务。</p>
    <p class="mb-4 text-lg text-gray-600">公司集研发、生产、销售、服务于一体，拥有一支由行业资深专家组成的技术团队。我们不仅是 ZEBRA、HONEYWELL、TSC 等国际一线品牌的战略合作伙伴，更拥有自主知识产权的中间件平台与自动化集成能力。</p>
    <p class="text-lg text-gray-600">鑫隆盛坚持“以诚为本，精益求精”的经营理念。我们深知，每一个标签的精准打印，每一次扫描的极速响应，都关乎客户的运营效率。因此，我们建立了自己的耗材加工工厂，从源头把控品质，为您提供从硬件设备、系统软件到耗材供应的一站式闭环服务。</p>
  `
};

export const DEFAULT_HOME_DATA: HomePageData = {
  heroTitle: "重塑工业互联\n定义智能标识",
  heroSubtitle: "XELNS 致力于为企业提供卓越的条码自动化解决方案，\n以精准数据驱动高效管理，助力工业 4.0 数字化转型。",
  heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000",
  introTitle: "为何选择 XELNS ?",
  introText: "我们不只是销售设备，更提供从顶层设计到落地执行的全案咨询与技术服务。"
};

export const PRODUCT_BANNERS: Banner[] = [
  {
    id: 'b1',
    image: 'https://images.unsplash.com/photo-1624969862293-b749659ccc4e?auto=format&fit=crop&q=80&w=2000',
    title: '工业打印旗舰',
    subtitle: 'Industrial Printing Flagship'
  },
  {
    id: 'b2',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=2000',
    title: '智能数据采集',
    subtitle: 'Mobile Data Collection'
  }
];

export const SOLUTIONS_BANNERS: Banner[] = [
  {
    id: 'sb1',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000',
    title: '行业场景应用',
    subtitle: 'Industry Scenarios'
  }
];

export const ABOUT_BANNERS: Banner[] = [
  {
    id: 'ab1',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
    title: '关于鑫隆盛',
    subtitle: 'About XELNS'
  }
];

export const SERVICE_BANNERS: Banner[] = [
  {
    id: 'svb1',
    image: 'https://images.unsplash.com/photo-1521791136064-7985c2d1100b?auto=format&fit=crop&q=80&w=2000',
    title: '全生命周期服务',
    subtitle: 'Full Lifecycle Service'
  }
];

export const CONTACT_BANNERS: Banner[] = [
  {
    id: 'cb1',
    image: 'https://images.unsplash.com/photo-1423666639041-f14d7045c573?auto=format&fit=crop&q=80&w=2000',
    title: '联络我们',
    subtitle: 'Get In Touch'
  }
];

export const SERVICES: Service[] = [
  {
    id: "hardware",
    title: "硬件运维服务",
    description: "提供企业级设备的选型咨询、部署安装及全生命周期的硬件维保服务。",
    iconName: "Settings"
  },
  {
    id: "software",
    title: "软件开发定制",
    description: "针对企业个性化需求，提供条码标签设计、打印中间件及系统接口开发。",
    iconName: "MonitorCheck"
  },
  {
    id: "integration",
    title: "自动化集成",
    description: "连接 MES/WMS/ERP 系统，实现产线贴标、视觉检测与数据追溯的自动化闭环。",
    iconName: "Layers"
  },
  {
    id: "consulting",
    title: "专家咨询服务",
    description: "基于15年行业经验，为企业提供条码标准化建设及数字化仓库管理的专家级建议。",
    iconName: "Headphones"
  }
];

export const SERVICE_DETAILS_DATA: Record<string, ServiceDetailData> = {
  hardware: {
    title: "硬件运维服务",
    subtitle: "Hardware Maintenance Service",
    tabs: [
      {
        id: "standard",
        label: "标准服务",
        type: "rich_text",
        content: `
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-gray-900">服务概览</h3>
            <p>鑫隆盛提供原厂级别的硬件支持服务。无论是打印机、扫描枪还是数据采集终端，我们都建立了一套标准化的服务流程。</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div class="bg-gray-50 p-4 border-l-4 border-brand-500">
                  <h4 class="font-bold">快速响应</h4>
                  <p class="text-sm text-gray-600">7x24小时电话支持，4小时内远程诊断。</p>
               </div>
               <div class="bg-gray-50 p-4 border-l-4 border-brand-500">
                  <h4 class="font-bold">原厂配件</h4>
                  <p class="text-sm text-gray-600">承诺使用100%原厂备件，保障设备稳定性。</p>
               </div>
            </div>
          </div>
        `
      }
    ]
  }
};

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'ZEBRA ZT411 工业打印机',
    category: '打印设备',
    description: '作为 Z Series 的继任者，ZT411 凭借先进的处理能力和开放式架构，将打印速度、打印质量和连接选项提升到了一个新的水平。全金属框架设计，专为恶劣环境打造。',
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800', // Placeholder
    images: [],
    features: ['4.3英寸彩色触摸屏', 'RFID 编码功能可选', '双 USB 主机端口', 'Link-OS 操作系统'],
    details: '<p>详细规格参数请联系客服索取。</p>'
  },
  {
    id: 'p2',
    title: 'Honeywell PDA EDA50K',
    category: '数据采集',
    description: '专为安卓操作系统设计的企业级混合动力设备。配备大容量电池与高性能扫描引擎，轻巧便携，是物流快递、零售盘点的理想选择。',
    image: 'https://images.unsplash.com/photo-1555664424-778a69022365?auto=format&fit=crop&q=80&w=800',
    images: [],
    features: ['Qualcomm 骁龙四核处理器', '4000mAh 可拆卸电池', 'IP54 防护等级', '4英寸康宁大猩猩玻璃'],
    details: '<p>详细规格参数请联系客服索取。</p>'
  },
  {
    id: 'p3',
    title: '自动化在线贴标系统',
    category: '自动化',
    description: '完全自主研发的打印贴标一体机。支持侧贴、角贴、圆瓶贴等多种模式。可与流水线无缝对接，实现无人化作业，效率高达 60件/分钟。',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    images: [],
    features: ['高精度伺服控制', '智能防漏贴检测', '异常自动报警剔除', '支持实时数据上传'],
    details: '<p>详细规格参数请联系客服索取。</p>'
  },
  {
    id: 'p4',
    title: '高端树脂基碳带',
    category: '耗材',
    description: '专为耐高温、耐刮擦、耐化学腐蚀场景研发。适用于电子铭牌、汽车零部件标签打印，确保标识信息永久清晰。',
    image: 'https://images.unsplash.com/photo-1628131336045-8c7c90b8f494?auto=format&fit=crop&q=80&w=800',
    images: [],
    features: ['卓越的耐刮擦性', '耐高达300°C高温', '防静电背涂层', '兼容各类合成纸'],
    details: '<p>详细规格参数请联系客服索取。</p>'
  }
];

export const ALL_PRODUCTS = [...FEATURED_PRODUCTS];

export const SOLUTIONS_LIST: Solution[] = [
  {
    id: 'wms',
    title: "WMS 智能仓储管理系统",
    desc: "通过条码/RFID技术，实现物料入库、出库、盘点、调拨的全流程数字化管理，库存准确率提升至 99.9%。",
    iconName: "Box",
    content: `...`
  },
  {
    id: 'traceability',
    title: "产品全生命周期追溯系统",
    desc: "一物一码，从原材料采购到成品销售，建立完整的质量追溯链条，满足合规性要求并提升品牌信任度。",
    iconName: "ScanBarcode",
    content: `...`
  },
  {
    id: 'fixed-assets',
    title: "固定资产数字化管理",
    desc: "解决资产底数不清、账实不符难题。支持手机端盘点，自动生成差异报表，让资产管理变得轻松高效。",
    iconName: "Award",
    content: `...`
  },
  {
    id: 'anti-error',
    title: "SMT 上料防错系统",
    desc: "杜绝电子制造过程中的错料风险。系统强制比对料站表与物料条码，错误时自动停机报警。",
    iconName: "Layers",
    content: `...`
  }
];
