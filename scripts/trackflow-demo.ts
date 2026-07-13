import {
  binarySearchByString,
  createLeadAggregationReport,
  createTrackFlowCompanyProfile,
  filterLeads,
  linearSearch,
  sortByField,
  type LeadRequest,
} from "../packages/shared/types/index";

const company = createTrackFlowCompanyProfile();

const sampleLeads: LeadRequest[] = [
  {
    id: "lead-1",
    companyName: "Moda Norte",
    contactPerson: "Laura Gomez",
    corporateEmail: "laura@modanorte.com",
    phone: "+34 600 000 001",
    website: "https://modanorte.com",
    primaryOperatingCountry: "Espana",
    productType: "Moda",
    estimatedMonthlyShipments: "501-2000",
    interestedServices: ["warehouse-management", "last-mile-delivery"],
    current3PLStatus: "Si",
    comments: "Buscamos operacion peninsular.",
    acceptedPrivacyPolicy: true,
  },
  {
    id: "lead-2",
    companyName: "Glow Labs",
    contactPerson: "Daniel Reed",
    corporateEmail: "daniel@glowlabs.com",
    phone: "+1 323 555 0100",
    primaryOperatingCountry: "Estados Unidos",
    productType: "Cosmetica",
    estimatedMonthlyShipments: "101-500",
    interestedServices: ["reverse-logistics"],
    current3PLStatus: "Estoy evaluando opciones",
    acceptedPrivacyPolicy: true,
  },
];

const filteredLeads = filterLeads(sampleLeads, {
  industryTypes: ["Moda", "Cosmetica"],
});

const sortedWarehouses = sortByField(
  company.warehouses,
  (warehouse) => warehouse.city,
  "asc",
);

const foundService = linearSearch(
  company.services,
  (service) => service.type === "reverse-logistics",
);

const sortedServices = sortByField(company.services, (service) => service.title, "asc");
const binaryFoundService = binarySearchByString(
  sortedServices,
  "Logistica Inversa",
  (service) => service.title,
);

const report = createLeadAggregationReport(sampleLeads);

console.log(
  JSON.stringify(
    {
      company: company.name,
      filteredLeadCount: filteredLeads.length,
      firstWarehouse: sortedWarehouses[0]?.city,
      linearSearchService: foundService?.title,
      binarySearchService: binaryFoundService?.title,
      report,
    },
    null,
    2,
  ),
);