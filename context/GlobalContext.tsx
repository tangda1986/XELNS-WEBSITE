
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../lib/storage';
import { Product, Banner, Solution, Service, ServiceDetailData, HomePageData, ContactMessage, AboutPageData, ServicePageData, CustomerCase } from '../types';
import { COMPANY_INFO, DEFAULT_HOME_DATA, DEFAULT_ABOUT_DATA, DEFAULT_SERVICE_PAGE_DATA } from '../constants';

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
    // Load about page data into context if needed
    // (not stored on companyInfo) - optional
    setSolutionsState(storage.getSolutions());
    setCustomerCasesState(storage.getCustomerCases());
    setServicesState(storage.getServices());
    setServiceDetailsState(storage.getServiceDetails());
    setHomePageDataState(storage.getHomePageData());
    setMessagesState(storage.getMessages());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  // Wrappers to save to storage when state updates
  const setProducts = (data: Product[]) => { storage.saveProducts(data); setProductsState(data); };
  const setProductBanners = (data: Banner[]) => { storage.saveProductBanners(data); setProductBannersState(data); };
  const setSolutionBanners = (data: Banner[]) => { storage.saveSolutionBanners(data); setSolutionBannersState(data); };
  const setAboutBanners = (data: Banner[]) => { storage.saveAboutBanners(data); setAboutBannersState(data); };
  const setServiceBanners = (data: Banner[]) => { storage.saveServiceBanners(data); setServiceBannersState(data); };
  const setContactBanners = (data: Banner[]) => { storage.saveContactBanners(data); setContactBannersState(data); };
  const setCasesBanners = (data: Banner[]) => { storage.saveCasesBanners(data); setCasesBannersState(data); };
  
  const setCompanyInfo = (data: typeof COMPANY_INFO) => { storage.saveCompanyInfo(data); setCompanyInfoState(data); };
  const setSolutions = (data: Solution[]) => { storage.saveSolutions(data); setSolutionsState(data); };
  const setCustomerCases = (data: CustomerCase[]) => { storage.saveCustomerCases(data); setCustomerCasesState(data); };
  const setServices = (data: Service[]) => { storage.saveServices(data); setServicesState(data); };
  const setServiceDetails = (data: Record<string, ServiceDetailData>) => { storage.saveServiceDetails(data); setServiceDetailsState(data); };
  const setHomePageData = (data: HomePageData) => { storage.saveHomePageData(data); setHomePageDataState(data); };
  const setAboutData = (data: AboutPageData) => { storage.saveAboutData(data); setAboutDataState(data); };
  const setServicePageData = (data: ServicePageData) => { storage.saveServicePageData(data); setServicePageDataState(data); };

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
  };

  const deleteMessage = (id: string) => {
    const newMessages = messages.filter(m => m.id !== id);
    storage.saveMessages(newMessages);
    setMessagesState(newMessages);
  };

  const markMessageRead = (id: string) => {
    const newMessages = messages.map(m => m.id === id ? { ...m, read: true } : m);
    storage.saveMessages(newMessages);
    setMessagesState(newMessages);
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
      refreshData
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
