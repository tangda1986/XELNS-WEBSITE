
export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string; // 主图
  images?: string[]; // 轮播图列表
  features: string[];
  details?: string; // 详细描述HTML内容
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface Solution {
  id: string;
  title: string;
  desc: string;
  iconName: string; // Changed from icon component to string for JSON storage
  content: string; // HTML detail content
  image?: string; // Solution main image
  pinned?: boolean;
  createdAt?: number;
}

export interface CustomerCase {
  id: string;
  title: string;
  desc: string;
  image: string;
  content: string; // HTML detail for case
  buttonText?: string;
  buttonUrl?: string;
  pinned?: boolean;
  createdAt?: number;
}

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
}

// 新增：服务详情相关类型
export type ServiceTabType = 'video_list' | 'faq_list' | 'download_list' | 'rich_text';

export interface ServiceDetailItem {
  title: string;
  desc?: string;
  url?: string; // 视频链接或下载链接
  date?: string;
  size?: string;
  content?: string; // 用于FAQ的回答或富文本
}

export interface ServiceTab {
  id: string;
  label: string;
  type: ServiceTabType;
  items?: ServiceDetailItem[]; // 列表数据
  content?: string; // 富文本数据
}

export interface ServiceDetailData {
  title: string;
  subtitle: string;
  tabs: ServiceTab[];
}

export interface HomePageData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  introTitle: string;
  introText: string;
  factoryImage: string;
}

export interface AboutAdvantage {
  title: string;
  en: string;
  desc: string;
}

export interface GalleryImage {
  image: string;
  title?: string;
  subtitle?: string;
}

export interface CultureItem {
  keyChar?: string; // e.g., '诚', '效', '专'
  title: string;
  desc: string;
}

export interface AboutPageData {
  missionTitle: string;
  missionSubtitle: string;
  missionText: string;
  profileImage: string;
  stats: { value: string; label: string }[];
  advantages: AboutAdvantage[];
  galleryImages: GalleryImage[];
  cultureTitle?: string;
  cultureDescription?: string;
  cultureItems?: CultureItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  content: string;
  date: string;
  read: boolean;
}

export interface ServiceProcessStep {
  step: number;
  title: string;
  desc: string;
}

export interface MaintenanceItem {
  id: string;
  text: string;
}

export interface ServicePageData {
  processTitle: string;
  processSteps: ServiceProcessStep[];
  maintenanceTitle: string;
  maintenanceItems: MaintenanceItem[];
  maintenanceImage: string;
  maintenanceImageTitle: string;
}
