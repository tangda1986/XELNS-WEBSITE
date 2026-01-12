
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { storage } from '../lib/storage';
import { Product, Banner, Solution, Service, ServiceDetailData, HomePageData, ContactMessage, AboutPageData, ServicePageData, CustomerCase } from '../types';
import { COMPANY_INFO, DEFAULT_HOME_DATA, DEFAULT_ABOUT_DATA, DEFAULT_SERVICE_PAGE_DATA } from '../constants';
import publishedSnapshot from '../data/site_data.json';

interface ToastState {
  visible: boolean;
  message: string;
}

interface GlobalContextType {
  products: Product[];
  setProducts: (data: Product[]) => void;
  
  productBanners: Banner[];
  setProductBanners: (data: Banner[]) => void;
  solutionBanners: Banner[];
  setSolutionBanners: (data: Banner[]) => void;
  aboutBanners: Banner[];
  setAboutBanners: (data: Banner[]) => void;
  serviceBanners: Banner[];
  setServiceBanners: (data: Banner[]) => void;
  contactBanners: Banner[];
  setContactBanners: (data: Banner[]) => void;
  casesBanners: Banner[];
  setCasesBanners: (data: Banner[]) => void;

  companyInfo: typeof COMPANY_INFO;
  setCompanyInfo: (data: typeof COMPANY_INFO) => void;

  solutions: Solution[];
  setSolutions: (data: Solution[]) => void;
  
  customerCases: CustomerCase[];
  setCustomerCases: (data: CustomerCase[]) => void;

  services: Service[];
  setServices: (data: Service[]) => void;
  
  serviceDetails: Record<string, ServiceDetailData>;
  setServiceDetails: (data: Record<string, ServiceDetailData>) => void;

  homePageData: HomePageData;
  setHomePageData: (data: HomePageData) => void;
  aboutData: AboutPageData;
  setAboutData: (data: AboutPageData) => void;
  servicePageData: ServicePageData;
  setServicePageData: (data: ServicePageData) => void;

  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
  deleteMessage: (id: string) => void;
  markMessageRead: (id: string) => void;

  toast: ToastState;
  showToast: (message: string) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;

  refreshData: () => void;
  
  isCloudSyncing: boolean;
  syncFromCloud: () => Promise<void>;
  syncToCloud: () => Promise<boolean>;
  initCloudDb: () => Promise<boolean>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProductsState] = useState<Product[]>([]);
  const [productBanners, setProductBannersState] = useState<Banner[]>([]);
  const [solutionBanners, setSolutionBannersState] = useState<Banner[]>([]);
  const [aboutBanners, setAboutBannersState] = useState<Banner[]>([]);
  const [serviceBanners, setServiceBannersState] = useState<Banner[]>([]);
  const [contactBanners, setContactBannersState] = useState<Banner[]>([]);
  const [casesBanners, setCasesBannersState] = useState<Banner[]>([]);
  const [companyInfo, setCompanyInfoState] = useState(COMPANY_INFO);
  const [solutions, setSolutionsState] = useState<Solution[]>([]);
  const [customerCases, setCustomerCasesState] = useState<CustomerCase[]>([]);
  const [services, setServicesState] = useState<Service[]>([]);
  const [serviceDetails, setServiceDetailsState] = useState<Record<string, ServiceDetailData>>({});
  const [homePageData, setHomePageDataState] = useState<HomePageData>(DEFAULT_HOME_DATA);
  const [aboutData, setAboutDataState] = useState<AboutPageData>(DEFAULT_ABOUT_DATA);
  const [servicePageData, setServicePageDataState] = useState<ServicePageData>(DEFAULT_SERVICE_PAGE_DATA);
  const [messages, setMessagesState] = useState<ContactMessage[]>([]);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const cloudAutoSaveTimeoutRef = useRef<number | null>(null);
  const cloudAutoSaveInFlightRef = useRef(false);
  const cloudSyncInFlightRef = useRef(false);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  const refreshData = () => {
    setProductsState(storage.getProducts());
    setProductBannersState(storage.getProductBanners());
    setSolutionBannersState(storage.getSolutionBanners());
    setAboutBannersState(storage.getAboutBanners());
    setServiceBannersState(storage.getServiceBanners());
    setContactBannersState(storage.getContactBanners());
    setCasesBannersState(storage.getCasesBanners());
    setCompanyInfoState(storage.getCompanyInfo());
    setAboutDataState(storage.getAboutData());
    setServicePageDataState(storage.getServicePageData());
    setSolutionsState(storage.getSolutions());
    setCustomerCasesState(storage.getCustomerCases());
    setServicesState(storage.getServices());
    setServiceDetailsState(storage.getServiceDetails());
    setHomePageDataState(storage.getHomePageData());
    setMessagesState(storage.getMessages());
  };

  const applyPublishedSnapshotIfNeeded = () => {
    try {
      if (storage.isAuthenticated()) return false;
      const snap: any = publishedSnapshot as any;
      if (!snap || typeof snap !== 'object') return false;
      const publishedId = typeof snap.__publishedId === 'string' ? snap.__publishedId : '';
      if (!publishedId) return false;
      const key = 'xelns_ultra_published_id';
      const last = localStorage.getItem(key);
      if (last === publishedId) return false;
      const ok = storage.importStateSnapshot(snap);
      if (ok) {
        localStorage.setItem(key, publishedId);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const requestCloudAutoSave = () => {
    if (!storage.isAuthenticated()) return;
    if (cloudAutoSaveTimeoutRef.current !== null) {
      window.clearTimeout(cloudAutoSaveTimeoutRef.current);
    }
    cloudAutoSaveTimeoutRef.current = window.setTimeout(async () => {
      if (cloudAutoSaveInFlightRef.current) return;
      cloudAutoSaveInFlightRef.current = true;
      try {
        const { cloudStorage } = await import('../lib/cloudStorage');
        await cloudStorage.saveAll(storage.getStateSnapshot());
      } finally {
        cloudAutoSaveInFlightRef.current = false;
      }
    }, 800);
  };

  const syncFromCloudInternal = async (silent: boolean) => {
    if (cloudSyncInFlightRef.current) return;
    cloudSyncInFlightRef.current = true;
    setIsCloudSyncing(true);
    try {
      const { cloudStorage } = await import('../lib/cloudStorage');
      const data = await cloudStorage.fetchAll();
      if (data && Object.keys(data).length > 0) {
        const success = storage.importStateSnapshot(data);
        if (success) {
          refreshData();
          if (!silent) showToast('已从云端拉取最新数据');
        }
      } else {
        if (!silent) showToast('云端暂无数据或拉取失败');
      }
    } catch (e) {
      console.error('Auto sync failed', e);
    } finally {
      setIsCloudSyncing(false);
      cloudSyncInFlightRef.current = false;
    }
  };

  const syncFromCloud = async () => {
    await syncFromCloudInternal(false);
  };

  const syncToCloud = async () => {
    setIsCloudSyncing(true);
    try {
      const { cloudStorage } = await import('../lib/cloudStorage');
      const snapshot = storage.getStateSnapshot();
      const result = await cloudStorage.saveAll(snapshot);
      if (result.success) {
        showToast('已保存到本地数据文件，请提交并推送到 GitHub');
        return true;
      } else {
        showToast(`保存失败: ${result.error || '请检查本地 API 是否启动'}`);
        return false;
      }
    } catch (e: any) {
      console.error(e);
      showToast(`保存出错: ${e.message}`);
      return false;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const initCloudDb = async () => {
    try {
      const { cloudStorage } = await import('../lib/cloudStorage');
      return await cloudStorage.initDb();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    applyPublishedSnapshotIfNeeded();
    refreshData();
  }, []);

  useEffect(() => {
    const tick = () => {
      if (storage.isAuthenticated()) return;
      if (applyPublishedSnapshotIfNeeded()) refreshData();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') tick();
    };

    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', onVisibilityChange);
    const intervalId = window.setInterval(tick, 30000);

    return () => {
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, []);

  // Wrappers to save to storage when state updates
  const setProducts = (data: Product[]) => { storage.saveProducts(data); setProductsState(data); requestCloudAutoSave(); };
  const setProductBanners = (data: Banner[]) => { storage.saveProductBanners(data); setProductBannersState(data); requestCloudAutoSave(); };
  const setSolutionBanners = (data: Banner[]) => { storage.saveSolutionBanners(data); setSolutionBannersState(data); requestCloudAutoSave(); };
  const setAboutBanners = (data: Banner[]) => { storage.saveAboutBanners(data); setAboutBannersState(data); requestCloudAutoSave(); };
  const setServiceBanners = (data: Banner[]) => { storage.saveServiceBanners(data); setServiceBannersState(data); requestCloudAutoSave(); };
  const setContactBanners = (data: Banner[]) => { storage.saveContactBanners(data); setContactBannersState(data); requestCloudAutoSave(); };
  const setCasesBanners = (data: Banner[]) => { storage.saveCasesBanners(data); setCasesBannersState(data); requestCloudAutoSave(); };
  
  const setCompanyInfo = (data: typeof COMPANY_INFO) => { storage.saveCompanyInfo(data); setCompanyInfoState(data); requestCloudAutoSave(); };
  const setSolutions = (data: Solution[]) => { storage.saveSolutions(data); setSolutionsState(data); requestCloudAutoSave(); };
  const setCustomerCases = (data: CustomerCase[]) => { storage.saveCustomerCases(data); setCustomerCasesState(data); requestCloudAutoSave(); };
  const setServices = (data: Service[]) => { storage.saveServices(data); setServicesState(data); requestCloudAutoSave(); };
  const setServiceDetails = (data: Record<string, ServiceDetailData>) => { storage.saveServiceDetails(data); setServiceDetailsState(data); requestCloudAutoSave(); };
  const setHomePageData = (data: HomePageData) => { storage.saveHomePageData(data); setHomePageDataState(data); requestCloudAutoSave(); };
  const setAboutData = (data: AboutPageData) => { storage.saveAboutData(data); setAboutDataState(data); requestCloudAutoSave(); };
  const setServicePageData = (data: ServicePageData) => { storage.saveServicePageData(data); setServicePageDataState(data); requestCloudAutoSave(); };

  const addMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      date: new Date().toLocaleString(),
      read: false
    };
    const newMessages = [newMessage, ...messages];
    storage.saveMessages(newMessages);
    setMessagesState(newMessages);
    requestCloudAutoSave();
  };

  const deleteMessage = (id: string) => {
    const newMessages = messages.filter(m => m.id !== id);
    storage.saveMessages(newMessages);
    setMessagesState(newMessages);
    requestCloudAutoSave();
  };

  const markMessageRead = (id: string) => {
    const newMessages = messages.map(m => m.id === id ? { ...m, read: true } : m);
    storage.saveMessages(newMessages);
    setMessagesState(newMessages);
    requestCloudAutoSave();
  };

  return (
    <GlobalContext.Provider value={{
      products, setProducts,
      productBanners, setProductBanners,
      solutionBanners, setSolutionBanners,
      aboutBanners, setAboutBanners,
      serviceBanners, setServiceBanners,
      contactBanners, setContactBanners,
      casesBanners, setCasesBanners,
      companyInfo, setCompanyInfo,
      solutions, setSolutions,
      customerCases, setCustomerCases,
      services, setServices,
      serviceDetails, setServiceDetails,
      homePageData, setHomePageData,
      aboutData, setAboutData,
      servicePageData, setServicePageData,
      messages, addMessage, deleteMessage, markMessageRead,
      toast, showToast,
      isSearchOpen, setIsSearchOpen,
      refreshData,
      isCloudSyncing, syncFromCloud, syncToCloud, initCloudDb
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
