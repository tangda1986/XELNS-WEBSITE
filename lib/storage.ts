
import { 
  ALL_PRODUCTS, 
  PRODUCT_BANNERS, 
  SOLUTIONS_BANNERS, 
  ABOUT_BANNERS, 
  SERVICE_BANNERS, 
  CONTACT_BANNERS,
  CASES_BANNERS,
  COMPANY_INFO,
  SOLUTIONS_LIST,
  SERVICES,
  SERVICE_DETAILS_DATA,
  DEFAULT_HOME_DATA,
  DEFAULT_ABOUT_DATA,
  DEFAULT_SERVICE_PAGE_DATA,
  DEFAULT_CUSTOMER_CASES
} from '../constants';
import { Product, Banner, Solution, Service, ServiceDetailData, HomePageData, ContactMessage, AboutPageData, ServicePageData, CustomerCase } from '../types';

// 修改 Key 前缀为 'xelns_ultra_' 以强制彻底重置数据，确保画册级新内容生效
const STORAGE_KEYS = {
  PRODUCTS: 'xelns_ultra_products',
  BANNERS_PRODUCT: 'xelns_ultra_banners_product',
  BANNERS_SOLUTION: 'xelns_ultra_banners_solution',
  BANNERS_ABOUT: 'xelns_ultra_banners_about',
  BANNERS_SERVICE: 'xelns_ultra_banners_service',
  BANNERS_CONTACT: 'xelns_ultra_banners_contact',
  BANNERS_CASES: 'xelns_ultra_banners_cases',
  COMPANY_INFO: 'xelns_ultra_company_info',
  SOLUTIONS: 'xelns_ultra_solutions',
  SERVICES: 'xelns_ultra_services',
  SERVICE_DETAILS: 'xelns_ultra_service_details',
  HOME_DATA: 'xelns_ultra_home_data',
  ABOUT_DATA: 'xelns_ultra_about_data',
  SERVICE_PAGE_DATA: 'xelns_ultra_service_page_data',
  CUSTOMER_CASES: 'xelns_ultra_customer_cases',
  MESSAGES: 'xelns_ultra_messages',
  ADMIN_SESSION: 'xelns_ultra_admin_session',
  ADMIN_PWD: 'xelns_ultra_admin_pwd'
};

// Generic getter and setter
const get = <T>(key: string, initialValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return initialValue;
  }
};

const set = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error: any) {
    console.error(`Error saving ${key} to localStorage`, error);
    if (error.name === 'QuotaExceededError' || error.message?.includes('exceeded the quota')) {
      alert("保存失败：本地存储空间已满。请尝试删除一些旧的图片或使用更小的图片。");
    }
  }
};

export const storage = {
  // Products
  getProducts: () => get<Product[]>(STORAGE_KEYS.PRODUCTS, ALL_PRODUCTS),
  saveProducts: (data: Product[]) => set(STORAGE_KEYS.PRODUCTS, data),

  // Banners
  getProductBanners: () => get<Banner[]>(STORAGE_KEYS.BANNERS_PRODUCT, PRODUCT_BANNERS),
  saveProductBanners: (data: Banner[]) => set(STORAGE_KEYS.BANNERS_PRODUCT, data),
  
  getSolutionBanners: () => get<Banner[]>(STORAGE_KEYS.BANNERS_SOLUTION, SOLUTIONS_BANNERS),
  saveSolutionBanners: (data: Banner[]) => set(STORAGE_KEYS.BANNERS_SOLUTION, data),

  getAboutBanners: () => get<Banner[]>(STORAGE_KEYS.BANNERS_ABOUT, ABOUT_BANNERS),
  saveAboutBanners: (data: Banner[]) => set(STORAGE_KEYS.BANNERS_ABOUT, data),

  getServiceBanners: () => get<Banner[]>(STORAGE_KEYS.BANNERS_SERVICE, SERVICE_BANNERS),
  saveServiceBanners: (data: Banner[]) => set(STORAGE_KEYS.BANNERS_SERVICE, data),

  getContactBanners: () => get<Banner[]>(STORAGE_KEYS.BANNERS_CONTACT, CONTACT_BANNERS),
  saveContactBanners: (data: Banner[]) => set(STORAGE_KEYS.BANNERS_CONTACT, data),
  
  getCasesBanners: () => get<Banner[]>(STORAGE_KEYS.BANNERS_CASES, CASES_BANNERS),
  saveCasesBanners: (data: Banner[]) => set(STORAGE_KEYS.BANNERS_CASES, data),

  // Company Info
  getCompanyInfo: () => get(STORAGE_KEYS.COMPANY_INFO, COMPANY_INFO),
  saveCompanyInfo: (data: typeof COMPANY_INFO) => set(STORAGE_KEYS.COMPANY_INFO, data),

  // Solutions
  getSolutions: () => get<Solution[]>(STORAGE_KEYS.SOLUTIONS, SOLUTIONS_LIST),
  saveSolutions: (data: Solution[]) => set(STORAGE_KEYS.SOLUTIONS, data),

  // Services
  getServices: () => get<Service[]>(STORAGE_KEYS.SERVICES, SERVICES),
  saveServices: (data: Service[]) => set(STORAGE_KEYS.SERVICES, data),

  // Service Details
  getServiceDetails: () => get<Record<string, ServiceDetailData>>(STORAGE_KEYS.SERVICE_DETAILS, SERVICE_DETAILS_DATA),
  saveServiceDetails: (data: Record<string, ServiceDetailData>) => set(STORAGE_KEYS.SERVICE_DETAILS, data),

  // Home Page Data
  getHomePageData: () => get<HomePageData>(STORAGE_KEYS.HOME_DATA, DEFAULT_HOME_DATA),
  saveHomePageData: (data: HomePageData) => set(STORAGE_KEYS.HOME_DATA, data),

  getAboutData: () => get(STORAGE_KEYS.ABOUT_DATA, DEFAULT_ABOUT_DATA),
  saveAboutData: (data: any) => set(STORAGE_KEYS.ABOUT_DATA, data),

  getServicePageData: () => get<ServicePageData>(STORAGE_KEYS.SERVICE_PAGE_DATA, DEFAULT_SERVICE_PAGE_DATA),
  saveServicePageData: (data: ServicePageData) => set(STORAGE_KEYS.SERVICE_PAGE_DATA, data),

  // Customer Cases
  getCustomerCases: () => get<CustomerCase[]>(STORAGE_KEYS.CUSTOMER_CASES, DEFAULT_CUSTOMER_CASES),
  saveCustomerCases: (data: CustomerCase[]) => set(STORAGE_KEYS.CUSTOMER_CASES, data),

  // Messages
  getMessages: () => get<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []),
  saveMessages: (data: ContactMessage[]) => set(STORAGE_KEYS.MESSAGES, data),

  // Auth
  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION),
  login: () => localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true'),
  logout: () => localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION),
  
  // Admin Password
  getAdminPassword: () => {
    const pwd = localStorage.getItem(STORAGE_KEYS.ADMIN_PWD);
    return pwd ? JSON.parse(pwd) : 'yangcan880214@YC';
  },
  saveAdminPassword: (password: string) => set(STORAGE_KEYS.ADMIN_PWD, password)
  
  ,
  // Snapshot utilities for backup/restore
  getStateSnapshot: () => {
    return {
      products: storage.getProducts(),
      productBanners: storage.getProductBanners(),
      solutionBanners: storage.getSolutionBanners(),
      aboutBanners: storage.getAboutBanners(),
      serviceBanners: storage.getServiceBanners(),
      contactBanners: storage.getContactBanners(),
      casesBanners: storage.getCasesBanners(),
      companyInfo: storage.getCompanyInfo(),
      solutions: storage.getSolutions(),
      services: storage.getServices(),
      serviceDetails: storage.getServiceDetails(),
      homePageData: storage.getHomePageData(),
      aboutData: storage.getAboutData(),
      servicePageData: storage.getServicePageData(),
      customerCases: storage.getCustomerCases(),
      messages: storage.getMessages(),
      adminPassword: storage.getAdminPassword()
    };
  },
  importStateSnapshot: (snapshot: any) => {
    try {
      if (snapshot.products) storage.saveProducts(snapshot.products);
      if (snapshot.productBanners) storage.saveProductBanners(snapshot.productBanners);
      if (snapshot.solutionBanners) storage.saveSolutionBanners(snapshot.solutionBanners);
      if (snapshot.aboutBanners) storage.saveAboutBanners(snapshot.aboutBanners);
      if (snapshot.serviceBanners) storage.saveServiceBanners(snapshot.serviceBanners);
      if (snapshot.contactBanners) storage.saveContactBanners(snapshot.contactBanners);
      if (snapshot.casesBanners) storage.saveCasesBanners(snapshot.casesBanners);
      if (snapshot.companyInfo) storage.saveCompanyInfo(snapshot.companyInfo);
      if (snapshot.solutions) storage.saveSolutions(snapshot.solutions);
      if (snapshot.services) storage.saveServices(snapshot.services);
      if (snapshot.serviceDetails) storage.saveServiceDetails(snapshot.serviceDetails);
      if (snapshot.homePageData) storage.saveHomePageData(snapshot.homePageData);
      if (snapshot.aboutData) storage.saveAboutData(snapshot.aboutData);
      if (snapshot.servicePageData) storage.saveServicePageData(snapshot.servicePageData);
      if (snapshot.customerCases) storage.saveCustomerCases(snapshot.customerCases);
      if (snapshot.messages) storage.saveMessages(snapshot.messages);
      if (snapshot.adminPassword) storage.saveAdminPassword(snapshot.adminPassword);
      return true;
    } catch (e) {
      console.error("Failed to import snapshot", e);
      return false;
    }
  },
  resetToDefaults: () => {
    storage.saveProducts(ALL_PRODUCTS);
    storage.saveProductBanners(PRODUCT_BANNERS);
    storage.saveSolutionBanners(SOLUTIONS_BANNERS);
    storage.saveAboutBanners(ABOUT_BANNERS);
    storage.saveServiceBanners(SERVICE_BANNERS);
    storage.saveContactBanners(CONTACT_BANNERS);
    storage.saveCasesBanners(CASES_BANNERS);
    storage.saveCompanyInfo(COMPANY_INFO);
    storage.saveSolutions(SOLUTIONS_LIST);
    storage.saveServices(SERVICES);
    storage.saveServiceDetails(SERVICE_DETAILS_DATA);
    storage.saveHomePageData(DEFAULT_HOME_DATA);
    storage.saveAboutData(DEFAULT_ABOUT_DATA);
    storage.saveServicePageData(DEFAULT_SERVICE_PAGE_DATA);
    storage.saveCustomerCases(DEFAULT_CUSTOMER_CASES);
    storage.saveMessages([]);
  }
};
