/**
 * Shared types for transversal project apps.
 * TrackFlow domain model and pure utilities.
 */

export type Id = string;

export interface BaseEntity {
  id: Id;
  createdAt?: string;
  updatedAt?: string;
}

export type CountryCode = "US" | "ES";

export type MarketName = "Estados Unidos" | "Espana";

export type ServiceType =
  | "warehouse-management"
  | "last-mile-delivery"
  | "reverse-logistics";

export type IndustryType =
  | "Moda"
  | "Electronica"
  | "Cosmetica"
  | "Alimentacion"
  | "Otro";

export type OperatingCountryOption =
  | "Estados Unidos"
  | "Espana"
  | "Ambos"
  | "Otro";

export type MonthlyShipmentVolume =
  | "0-100"
  | "101-500"
  | "501-2000"
  | "2000+"
  | "No estoy seguro";

export type Current3PLStatus = "Si" | "No" | "Estoy evaluando opciones";

export type SortDirection = "asc" | "desc";

export interface Address {
  countryCode: CountryCode;
  countryName: MarketName;
  city: string;
  region: string;
}

export interface ContactChannel {
  email: string;
  phone: string;
  contactType: "sales";
  availableLanguages: string[];
}

export interface Warehouse extends BaseEntity {
  name: string;
  city: string;
  region: string;
  countryCode: CountryCode;
  countryName: MarketName;
}

export interface Carrier extends BaseEntity {
  name: string;
  countryCode: CountryCode;
  marketName: MarketName;
  serviceTypes: ServiceType[];
}

export interface ServiceOffering extends BaseEntity {
  type: ServiceType;
  title: string;
  description: string;
  features: string[];
  availableMarkets: MarketName[];
}

export interface MarketCoverage extends BaseEntity {
  marketName: MarketName;
  coverageDescription: string;
  warehouseId: Id;
  carrierIds: Id[];
}

export interface CompanyBenefit extends BaseEntity {
  title: string;
  description: string;
}

export interface CompanyProfile extends BaseEntity {
  name: "TrackFlow";
  description: string;
  foundingYear: number;
  employeeCount: number;
  annualRevenueEUR: number;
  headquarters: Address[];
  markets: MarketCoverage[];
  services: ServiceOffering[];
  warehouses: Warehouse[];
  carriers: Carrier[];
  benefits: CompanyBenefit[];
  contact: ContactChannel;
  industries: IndustryType[];
}

export interface LeadRequest extends BaseEntity {
  companyName: string;
  contactPerson: string;
  corporateEmail: string;
  phone: string;
  website?: string;
  primaryOperatingCountry: OperatingCountryOption;
  productType: IndustryType;
  estimatedMonthlyShipments: MonthlyShipmentVolume;
  interestedServices: ServiceType[];
  current3PLStatus: Current3PLStatus;
  comments?: string;
  acceptedPrivacyPolicy: boolean;
}

export interface LeadRequestValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AggregationSummary {
  total: number;
  average: number;
  min: number;
  max: number;
}

export interface LeadAggregationReport {
  totalLeads: number;
  leadsByProductType: Record<IndustryType, number>;
  leadsByCountry: Record<OperatingCountryOption, number>;
  averageInterestedServices: number;
  shipmentVolumeSummary: AggregationSummary;
}

export interface FilterOptions {
  marketNames?: MarketName[];
  serviceTypes?: ServiceType[];
  industryTypes?: IndustryType[];
  monthlyShipmentVolumes?: MonthlyShipmentVolume[];
  countryCodes?: CountryCode[];
}

export interface SortCriterion<T> {
  selector: (item: T) => string | number;
  direction: SortDirection;
}

const CONTACT_NAME_PARTS_MINIMUM: number = 2;
const COMMENTS_MAX_LENGTH: number = 500;

export const TRACKFLOW_SERVICE_LABELS: Record<ServiceType, string> = {
  "warehouse-management": "Gestion de Almacenes",
  "last-mile-delivery": "Ultima Milla",
  "reverse-logistics": "Logistica Inversa",
};

export const MONTHLY_SHIPMENT_RANK: Record<MonthlyShipmentVolume, number> = {
  "0-100": 100,
  "101-500": 500,
  "501-2000": 2000,
  "2000+": 2001,
  "No estoy seguro": -1,
};

export const createTrackFlowCompanyProfile = (): CompanyProfile => {
  const warehouses: Warehouse[] = [
    {
      id: "warehouse-los-angeles",
      name: "TrackFlow Los Angeles Warehouse",
      city: "Los Angeles",
      region: "California",
      countryCode: "US",
      countryName: "Estados Unidos",
    },
    {
      id: "warehouse-zaragoza",
      name: "TrackFlow Zaragoza Warehouse",
      city: "Zaragoza",
      region: "Aragon",
      countryCode: "ES",
      countryName: "Espana",
    },
  ];

  const carriers: Carrier[] = [
    {
      id: "carrier-ups",
      name: "UPS",
      countryCode: "US",
      marketName: "Estados Unidos",
      serviceTypes: ["last-mile-delivery"],
    },
    {
      id: "carrier-fedex",
      name: "FedEx",
      countryCode: "US",
      marketName: "Estados Unidos",
      serviceTypes: ["last-mile-delivery"],
    },
    {
      id: "carrier-dhl-us",
      name: "DHL",
      countryCode: "US",
      marketName: "Estados Unidos",
      serviceTypes: ["last-mile-delivery"],
    },
    {
      id: "carrier-mrw",
      name: "MRW",
      countryCode: "ES",
      marketName: "Espana",
      serviceTypes: ["last-mile-delivery"],
    },
    {
      id: "carrier-seur",
      name: "SEUR",
      countryCode: "ES",
      marketName: "Espana",
      serviceTypes: ["last-mile-delivery"],
    },
    {
      id: "carrier-dhl-es",
      name: "DHL",
      countryCode: "ES",
      marketName: "Espana",
      serviceTypes: ["last-mile-delivery"],
    },
  ];

  const services: ServiceOffering[] = [
    {
      id: "service-warehouse-management",
      type: "warehouse-management",
      title: "Gestion de Almacenes",
      description: "Almacenamiento, picking y packing con inventario en tiempo real.",
      features: [
        "Almacenamiento, picking y packing",
        "Inventario en tiempo real",
        "Operamos almacenes en Los Angeles y Zaragoza",
      ],
      availableMarkets: ["Estados Unidos", "Espana"],
    },
    {
      id: "service-last-mile-delivery",
      type: "last-mile-delivery",
      title: "Entregas de Ultima Milla",
      description: "Distribucion con red certificada de carriers y seguimiento unificado.",
      features: [
        "Red de carriers certificados en ambos paises",
        "Seguimiento unificado de envios",
        "Gestion de incidencias y devoluciones",
      ],
      availableMarkets: ["Estados Unidos", "Espana"],
    },
    {
      id: "service-reverse-logistics",
      type: "reverse-logistics",
      title: "Logistica Inversa",
      description: "Devoluciones, inspeccion y reacondicionamiento conectados a e-commerce.",
      features: [
        "Gestion completa de devoluciones",
        "Inspeccion y reacondicionamiento",
        "Integracion con tu plataforma de ventas",
      ],
      availableMarkets: ["Estados Unidos", "Espana"],
    },
  ];

  const markets: MarketCoverage[] = [
    {
      id: "market-us",
      marketName: "Estados Unidos",
      coverageDescription: "Cobertura nacional desde el almacen de Los Angeles.",
      warehouseId: "warehouse-los-angeles",
      carrierIds: ["carrier-ups", "carrier-fedex", "carrier-dhl-us"],
    },
    {
      id: "market-es",
      marketName: "Espana",
      coverageDescription: "Cobertura peninsular e islas desde el almacen de Zaragoza.",
      warehouseId: "warehouse-zaragoza",
      carrierIds: ["carrier-mrw", "carrier-seur", "carrier-dhl-es"],
    },
  ];

  const benefits: CompanyBenefit[] = [
    {
      id: "benefit-binational-operations",
      title: "Operacion binacional",
      description: "Infraestructura propia en Estados Unidos y Espana.",
    },
    {
      id: "benefit-team-scale",
      title: "+130 profesionales",
      description: "Equipo especializado dedicado a la operacion logistica.",
    },
    {
      id: "benefit-visibility",
      title: "Tecnologia propia",
      description: "Visibilidad total del inventario y envios.",
    },
    {
      id: "benefit-ecommerce-specialization",
      title: "Especializacion e-commerce",
      description: "Foco en moda, electronica y cosmetica.",
    },
  ];

  return {
    id: "company-trackflow",
    name: "TrackFlow",
    description: "Gestion de almacenes y entregas de ultima milla para e-commerce.",
    foundingYear: 2009,
    employeeCount: 130,
    annualRevenueEUR: 9000000,
    headquarters: [
      {
        countryCode: "US",
        countryName: "Estados Unidos",
        city: "Los Angeles",
        region: "California",
      },
      {
        countryCode: "ES",
        countryName: "Espana",
        city: "Zaragoza",
        region: "Aragon",
      },
    ],
    markets,
    services,
    warehouses,
    carriers,
    benefits,
    contact: {
      email: "comercial@trackflow.com",
      phone: "+1 213 555 0147",
      contactType: "sales",
      availableLanguages: ["Spanish", "English"],
    },
    industries: ["Moda", "Electronica", "Cosmetica"],
  };
};

export const getLeadOperatingMarkets = (
  country: OperatingCountryOption,
): MarketName[] => {
  if (country === "Estados Unidos") {
    return ["Estados Unidos"];
  }

  if (country === "Espana") {
    return ["Espana"];
  }

  if (country === "Ambos") {
    return ["Estados Unidos", "Espana"];
  }

  return [];
};

export const filterServices = (
  services: ServiceOffering[],
  options: FilterOptions,
): ServiceOffering[] => {
  return services.filter((service: ServiceOffering) => {
    const matchesMarket: boolean =
      !options.marketNames ||
      options.marketNames.length === 0 ||
      options.marketNames.some((marketName: MarketName) =>
        service.availableMarkets.includes(marketName),
      );

    const matchesServiceType: boolean =
      !options.serviceTypes ||
      options.serviceTypes.length === 0 ||
      options.serviceTypes.includes(service.type);

    return matchesMarket && matchesServiceType;
  });
};

export const filterLeads = (
  leads: LeadRequest[],
  options: FilterOptions,
): LeadRequest[] => {
  return leads.filter((lead: LeadRequest) => {
    const matchesIndustry: boolean =
      !options.industryTypes ||
      options.industryTypes.length === 0 ||
      options.industryTypes.includes(lead.productType);

    const matchesVolume: boolean =
      !options.monthlyShipmentVolumes ||
      options.monthlyShipmentVolumes.length === 0 ||
      options.monthlyShipmentVolumes.includes(lead.estimatedMonthlyShipments);

    const matchesService: boolean =
      !options.serviceTypes ||
      options.serviceTypes.length === 0 ||
      options.serviceTypes.some((serviceType: ServiceType) =>
        lead.interestedServices.includes(serviceType),
      );

    const matchesMarket: boolean =
      !options.marketNames ||
      options.marketNames.length === 0 ||
      options.marketNames.some((marketName: MarketName) =>
        getLeadOperatingMarkets(lead.primaryOperatingCountry).includes(marketName),
      );

    return matchesIndustry && matchesVolume && matchesService && matchesMarket;
  });
};

export const filterWarehouses = (
  warehouses: Warehouse[],
  options: FilterOptions,
): Warehouse[] => {
  return warehouses.filter((warehouse: Warehouse) => {
    const matchesCountryCode: boolean =
      !options.countryCodes ||
      options.countryCodes.length === 0 ||
      options.countryCodes.includes(warehouse.countryCode);

    const matchesMarket: boolean =
      !options.marketNames ||
      options.marketNames.length === 0 ||
      options.marketNames.includes(warehouse.countryName);

    return matchesCountryCode && matchesMarket;
  });
};

export const sortByNumber = (
  left: number,
  right: number,
  direction: SortDirection,
): number => {
  return direction === "asc" ? left - right : right - left;
};

export const sortByString = (
  left: string,
  right: string,
  direction: SortDirection,
): number => {
  return direction === "asc"
    ? left.localeCompare(right)
    : right.localeCompare(left);
};

export const sortByField = <T>(
  items: T[],
  selector: (item: T) => string | number,
  direction: SortDirection,
): T[] => {
  return [...items].sort((leftItem: T, rightItem: T) => {
    const leftValue: string | number = selector(leftItem);
    const rightValue: string | number = selector(rightItem);

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return sortByNumber(leftValue, rightValue, direction);
    }

    return sortByString(String(leftValue), String(rightValue), direction);
  });
};

export const sortByMultipleFields = <T>(
  items: T[],
  criteria: SortCriterion<T>[],
): T[] => {
  return [...items].sort((leftItem: T, rightItem: T) => {
    for (const criterion of criteria) {
      const leftValue: string | number = criterion.selector(leftItem);
      const rightValue: string | number = criterion.selector(rightItem);

      const comparison: number =
        typeof leftValue === "number" && typeof rightValue === "number"
          ? sortByNumber(leftValue, rightValue, criterion.direction)
          : sortByString(String(leftValue), String(rightValue), criterion.direction);

      if (comparison !== 0) {
        return comparison;
      }
    }

    return 0;
  });
};

export const linearSearch = <T>(
  items: T[],
  predicate: (item: T) => boolean,
): T | undefined => {
  for (const item of items) {
    if (predicate(item)) {
      return item;
    }
  }

  return undefined;
};

export const binarySearchByNumber = <T>(
  items: T[],
  target: number,
  selector: (item: T) => number,
): T | undefined => {
  let leftIndex: number = 0;
  let rightIndex: number = items.length - 1;

  while (leftIndex <= rightIndex) {
    const middleIndex: number = Math.floor((leftIndex + rightIndex) / 2);
    const middleValue: number = selector(items[middleIndex]);

    if (middleValue === target) {
      return items[middleIndex];
    }

    if (middleValue < target) {
      leftIndex = middleIndex + 1;
    } else {
      rightIndex = middleIndex - 1;
    }
  }

  return undefined;
};

export const binarySearchByString = <T>(
  items: T[],
  target: string,
  selector: (item: T) => string,
): T | undefined => {
  let leftIndex: number = 0;
  let rightIndex: number = items.length - 1;

  while (leftIndex <= rightIndex) {
    const middleIndex: number = Math.floor((leftIndex + rightIndex) / 2);
    const middleValue: string = selector(items[middleIndex]);
    const comparison: number = middleValue.localeCompare(target);

    if (comparison === 0) {
      return items[middleIndex];
    }

    if (comparison < 0) {
      leftIndex = middleIndex + 1;
    } else {
      rightIndex = middleIndex - 1;
    }
  }

  return undefined;
};

export const countByCategory = <TCategory extends string, TItem>(
  items: TItem[],
  selector: (item: TItem) => TCategory,
): Record<TCategory, number> => {
  return items.reduce(
    (counts: Record<TCategory, number>, item: TItem) => {
      const category: TCategory = selector(item);
      const currentCount: number = counts[category] ?? 0;
      counts[category] = currentCount + 1;
      return counts;
    },
    {} as Record<TCategory, number>,
  );
};

export const calculateTotal = <T>(
  items: T[],
  selector: (item: T) => number,
): number => {
  return items.reduce(
    (total: number, item: T) => total + selector(item),
    0,
  );
};

export const calculateAverage = <T>(
  items: T[],
  selector: (item: T) => number,
): number => {
  if (items.length === 0) {
    return 0;
  }

  return calculateTotal(items, selector) / items.length;
};

export const calculateMin = <T>(
  items: T[],
  selector: (item: T) => number,
): number => {
  if (items.length === 0) {
    return 0;
  }

  return items.reduce((minimum: number, item: T) => {
    return Math.min(minimum, selector(item));
  }, selector(items[0]));
};

export const calculateMax = <T>(
  items: T[],
  selector: (item: T) => number,
): number => {
  if (items.length === 0) {
    return 0;
  }

  return items.reduce((maximum: number, item: T) => {
    return Math.max(maximum, selector(item));
  }, selector(items[0]));
};

export const createAggregationSummary = <T>(
  items: T[],
  selector: (item: T) => number,
): AggregationSummary => {
  return {
    total: calculateTotal(items, selector),
    average: calculateAverage(items, selector),
    min: calculateMin(items, selector),
    max: calculateMax(items, selector),
  };
};

export const createLeadAggregationReport = (
  leads: LeadRequest[],
): LeadAggregationReport => {
  return {
    totalLeads: leads.length,
    leadsByProductType: countByCategory(
      leads,
      (lead: LeadRequest) => lead.productType,
    ),
    leadsByCountry: countByCategory(
      leads,
      (lead: LeadRequest) => lead.primaryOperatingCountry,
    ),
    averageInterestedServices: calculateAverage(
      leads,
      (lead: LeadRequest) => lead.interestedServices.length,
    ),
    shipmentVolumeSummary: createAggregationSummary(
      leads,
      (lead: LeadRequest) =>
        MONTHLY_SHIPMENT_RANK[lead.estimatedMonthlyShipments],
    ),
  };
};

export const validateCompanyName = (companyName: string): string | undefined => {
  return companyName.trim().length < 2
    ? "El nombre de la empresa debe tener al menos 2 caracteres"
    : undefined;
};

export const validateContactPerson = (
  contactPerson: string,
): string | undefined => {
  return contactPerson.trim().split(/\s+/).length < CONTACT_NAME_PARTS_MINIMUM
    ? "Ingresa nombre y apellido del contacto"
    : undefined;
};

export const validateCorporateEmail = (
  corporateEmail: string,
): string | undefined => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(corporateEmail)
    ? undefined
    : "Ingresa un email corporativo valido (ejemplo: nombre@empresa.com)";
};

export const validatePhone = (phone: string): string | undefined => {
  return /^\+[0-9]+[0-9\s-]*$/.test(phone.trim())
    ? undefined
    : "El telefono debe incluir codigo de pais (ejemplo: +1 213 555 0147)";
};

export const validateWebsite = (website?: string): string | undefined => {
  if (!website) {
    return undefined;
  }

  return /^https?:\/\/.+/.test(website.trim())
    ? undefined
    : "Si incluyes sitio web, debe ser una URL valida";
};

export const validatePrimaryOperatingCountry = (
  primaryOperatingCountry: OperatingCountryOption,
): string | undefined => {
  return primaryOperatingCountry
    ? undefined
    : "Selecciona el pais de operacion principal";
};

export const validateProductType = (
  productType: IndustryType,
): string | undefined => {
  return productType ? undefined : "Selecciona el tipo de producto que manejas";
};

export const validateEstimatedMonthlyShipments = (
  estimatedMonthlyShipments: MonthlyShipmentVolume,
): string | undefined => {
  return estimatedMonthlyShipments
    ? undefined
    : "Selecciona el volumen mensual estimado";
};

export const validateInterestedServices = (
  interestedServices: ServiceType[],
): string | undefined => {
  return interestedServices.length > 0
    ? undefined
    : "Selecciona al menos un servicio de interes";
};

export const validateCurrent3PLStatus = (
  current3PLStatus: Current3PLStatus,
): string | undefined => {
  return current3PLStatus
    ? undefined
    : "Indica si actualmente trabajas con otro proveedor logistico";
};

export const validateComments = (comments?: string): string | undefined => {
  if ((comments ?? "").length <= COMMENTS_MAX_LENGTH) {
    return undefined;
  }

  const remainingCharacters: number = COMMENTS_MAX_LENGTH - (comments?.length ?? 0);
  return `Los comentarios no pueden exceder 500 caracteres (quedan ${remainingCharacters})`;
};

export const validatePrivacyPolicyAcceptance = (
  acceptedPrivacyPolicy: boolean,
): string | undefined => {
  return acceptedPrivacyPolicy
    ? undefined
    : "Debes aceptar la politica de privacidad para continuar";
};

export const getLowVolumeWarning = (
  estimatedMonthlyShipments: MonthlyShipmentVolume,
  productType: IndustryType,
): string | undefined => {
  return estimatedMonthlyShipments === "0-100" &&
    ["Moda", "Electronica", "Cosmetica", "Alimentacion", "Otro"].includes(productType)
    ? "Para volumenes menores a 100 envios mensuales, nuestros servicios podrian no ser la solucion mas eficiente. ¿Seguro que quieres continuar?"
    : undefined;
};

export const validateServiceOffering = (
  service: ServiceOffering,
): string[] => {
  const errors: string[] = [];

  if (service.title.trim().length === 0) {
    errors.push("Cada servicio debe tener un titulo");
  }

  if (service.features.length === 0) {
    errors.push("Cada servicio debe incluir al menos una caracteristica");
  }

  if (service.availableMarkets.length === 0) {
    errors.push("Cada servicio debe estar disponible en al menos un mercado");
  }

  return errors;
};

export const validateCompanyProfile = (
  company: CompanyProfile,
): string[] => {
  const errors: string[] = [];

  if (company.name !== "TrackFlow") {
    errors.push("La compania debe llamarse TrackFlow");
  }

  if (company.markets.length < 2) {
    errors.push("TrackFlow debe operar al menos en Estados Unidos y Espana");
  }

  if (company.services.length !== 3) {
    errors.push("TrackFlow debe exponer exactamente tres servicios principales");
  }

  if (company.contact.email !== "comercial@trackflow.com") {
    errors.push("El email comercial debe ser comercial@trackflow.com");
  }

  company.services.forEach((service: ServiceOffering) => {
    errors.push(...validateServiceOffering(service));
  });

  return errors;
};

export const validateLeadRequest = (
  lead: LeadRequest,
): LeadRequestValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const validationChecks: Array<string | undefined> = [
    validateCompanyName(lead.companyName),
    validateContactPerson(lead.contactPerson),
    validateCorporateEmail(lead.corporateEmail),
    validatePhone(lead.phone),
    validateWebsite(lead.website),
    validatePrimaryOperatingCountry(lead.primaryOperatingCountry),
    validateProductType(lead.productType),
    validateEstimatedMonthlyShipments(lead.estimatedMonthlyShipments),
    validateInterestedServices(lead.interestedServices),
    validateCurrent3PLStatus(lead.current3PLStatus),
    validateComments(lead.comments),
    validatePrivacyPolicyAcceptance(lead.acceptedPrivacyPolicy),
  ];

  validationChecks.forEach((validationMessage: string | undefined) => {
    if (validationMessage) {
      errors.push(validationMessage);
    }
  });

  const lowVolumeWarning: string | undefined = getLowVolumeWarning(
    lead.estimatedMonthlyShipments,
    lead.productType,
  );

  if (lowVolumeWarning) {
    warnings.push(lowVolumeWarning);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
