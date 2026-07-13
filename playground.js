const serviceLabels = {
    "warehouse-management": "Gestion de Almacenes",
    "last-mile-delivery": "Entregas de Ultima Milla",
    "reverse-logistics": "Logistica Inversa"
};

const shipmentRank = {
    "0-100": 100,
    "101-500": 500,
    "501-2000": 2000,
    "2000+": 2001,
    "No estoy seguro": -1
};

function createTrackFlowCompanyProfile() {
    return {
        name: "TrackFlow",
        warehouses: [
            {
                id: "warehouse-los-angeles",
                name: "TrackFlow Los Angeles Warehouse",
                city: "Los Angeles",
                countryName: "Estados Unidos"
            },
            {
                id: "warehouse-zaragoza",
                name: "TrackFlow Zaragoza Warehouse",
                city: "Zaragoza",
                countryName: "Espana"
            }
        ],
        services: [
            {
                id: "service-warehouse-management",
                type: "warehouse-management",
                title: "Gestion de Almacenes",
                availableMarkets: ["Estados Unidos", "Espana"]
            },
            {
                id: "service-last-mile-delivery",
                type: "last-mile-delivery",
                title: "Entregas de Ultima Milla",
                availableMarkets: ["Estados Unidos", "Espana"]
            },
            {
                id: "service-reverse-logistics",
                type: "reverse-logistics",
                title: "Logistica Inversa",
                availableMarkets: ["Estados Unidos", "Espana"]
            }
        ]
    };
}

function getLeadOperatingMarkets(country) {
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
}

function filterLeads(leads, options) {
    return leads.filter((lead) => {
        const matchesIndustry = !options.industryType || lead.productType === options.industryType;
        const matchesService = !options.serviceType || lead.interestedServices.includes(options.serviceType);
        const matchesMarket = !options.marketName || getLeadOperatingMarkets(lead.primaryOperatingCountry).includes(options.marketName);
        return matchesIndustry && matchesService && matchesMarket;
    });
}

function sortByField(items, selector, direction) {
    return [...items].sort((leftItem, rightItem) => {
        const leftValue = selector(leftItem);
        const rightValue = selector(rightItem);
        const leftText = String(leftValue);
        const rightText = String(rightValue);

        return direction === "asc"
            ? leftText.localeCompare(rightText)
            : rightText.localeCompare(leftText);
    });
}

function linearSearch(items, predicate) {
    for (const item of items) {
        if (predicate(item)) {
            return item;
        }
    }

    return undefined;
}

function binarySearchByString(items, target, selector) {
    let leftIndex = 0;
    let rightIndex = items.length - 1;

    while (leftIndex <= rightIndex) {
        const middleIndex = Math.floor((leftIndex + rightIndex) / 2);
        const middleValue = selector(items[middleIndex]);
        const comparison = middleValue.localeCompare(target);

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
}

function countByCategory(items, selector) {
    return items.reduce((accumulator, item) => {
        const key = selector(item);
        accumulator[key] = (accumulator[key] ?? 0) + 1;
        return accumulator;
    }, {});
}

function calculateAverage(items, selector) {
    if (items.length === 0) {
        return 0;
    }

    const total = items.reduce((sum, item) => sum + selector(item), 0);
    return total / items.length;
}

function createLeadAggregationReport(leads) {
    const shipmentValues = leads.map((lead) => shipmentRank[lead.estimatedMonthlyShipments]);

    return {
        totalLeads: leads.length,
        leadsByProductType: countByCategory(leads, (lead) => lead.productType),
        leadsByCountry: countByCategory(leads, (lead) => lead.primaryOperatingCountry),
        averageInterestedServices: calculateAverage(leads, (lead) => lead.interestedServices.length),
        shipmentVolumeSummary: {
            total: shipmentValues.reduce((sum, value) => sum + value, 0),
            average: shipmentValues.length === 0 ? 0 : shipmentValues.reduce((sum, value) => sum + value, 0) / shipmentValues.length,
            min: shipmentValues.length === 0 ? 0 : Math.min(...shipmentValues),
            max: shipmentValues.length === 0 ? 0 : Math.max(...shipmentValues)
        }
    };
}

function validateLeadRequest(lead) {
    const errors = [];
    const warnings = [];

    if (lead.companyName.trim().length < 2) {
        errors.push("El nombre de la empresa debe tener al menos 2 caracteres");
    }

    if (lead.contactPerson.trim().split(/\s+/).length < 2) {
        errors.push("Ingresa nombre y apellido del contacto");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.corporateEmail)) {
        errors.push("Ingresa un email corporativo valido (ejemplo: nombre@empresa.com)");
    }

    if (!/^\+[0-9]+[0-9\s-]*$/.test(lead.phone.trim())) {
        errors.push("El telefono debe incluir codigo de pais (ejemplo: +1 213 555 0147)");
    }

    if (!lead.acceptedPrivacyPolicy) {
        errors.push("Debes aceptar la politica de privacidad para continuar");
    }

    if (lead.interestedServices.length === 0) {
        errors.push("Selecciona al menos un servicio de interes");
    }

    if (lead.estimatedMonthlyShipments === "0-100") {
        warnings.push("Para volumenes menores a 100 envios mensuales, nuestros servicios podrian no ser la solucion mas eficiente. ¿Seguro que quieres continuar?");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

const company = createTrackFlowCompanyProfile();
const sampleLeads = [
    {
        id: "lead-1",
        companyName: "Moda Norte",
        contactPerson: "Laura Gomez",
        corporateEmail: "laura@modanorte.com",
        phone: "+34 600 000 001",
        primaryOperatingCountry: "Espana",
        productType: "Moda",
        estimatedMonthlyShipments: "501-2000",
        interestedServices: ["warehouse-management", "last-mile-delivery"],
        acceptedPrivacyPolicy: true
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
        acceptedPrivacyPolicy: true
    },
    {
        id: "lead-3",
        companyName: "Fresh Cart",
        contactPerson: "Marta Ruiz",
        corporateEmail: "marta@freshcart.es",
        phone: "+34 976 123 456",
        primaryOperatingCountry: "Ambos",
        productType: "Alimentacion",
        estimatedMonthlyShipments: "2000+",
        interestedServices: ["warehouse-management", "reverse-logistics"],
        acceptedPrivacyPolicy: true
    }
];

const invalidLead = {
    id: "lead-invalid",
    companyName: "A",
    contactPerson: "Leo",
    corporateEmail: "leo-at-company",
    phone: "2135550147",
    primaryOperatingCountry: "Espana",
    productType: "Moda",
    estimatedMonthlyShipments: "0-100",
    interestedServices: [],
    acceptedPrivacyPolicy: false
};

const datasetSummary = document.getElementById("datasetSummary");
const resultLabel = document.getElementById("resultLabel");
const resultOutput = document.getElementById("resultOutput");

function renderDatasetSummary() {
    datasetSummary.innerHTML = [
        { label: "Leads de muestra", value: sampleLeads.length },
        { label: "Servicios", value: company.services.length },
        { label: "Almacenes", value: company.warehouses.length }
    ].map((item) => `
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-sm font-semibold text-slate-600">${item.label}</p>
            <p class="mt-2 text-3xl font-black text-slate-900">${item.value}</p>
        </div>
    `).join("");
}

function renderResult(label, payload) {
    resultLabel.textContent = label;
    resultOutput.textContent = JSON.stringify(payload, null, 2);
}

document.getElementById("runFilterButton").addEventListener("click", () => {
    const industryType = document.getElementById("filterIndustry").value;
    const serviceType = document.getElementById("filterService").value;
    const marketName = document.getElementById("filterMarket").value;

    const filteredLeads = filterLeads(sampleLeads, {
        industryType,
        serviceType,
        marketName
    });

    renderResult("Resultado de filtrado de leads", {
        appliedFilters: {
            industryType: industryType || "Todos",
            serviceType: serviceType ? serviceLabels[serviceType] : "Todos",
            marketName: marketName || "Todos"
        },
        totalMatches: filteredLeads.length,
        items: filteredLeads
    });
});

document.getElementById("runSortButton").addEventListener("click", () => {
    const sortField = document.getElementById("sortField").value;
    const sortDirection = document.getElementById("sortDirection").value;
    const sortedWarehouses = sortByField(company.warehouses, (warehouse) => warehouse[sortField], sortDirection);

    renderResult("Resultado de ordenamiento de almacenes", {
        sortField,
        sortDirection,
        items: sortedWarehouses
    });
});

document.getElementById("runSearchButton").addEventListener("click", () => {
    const linearSearchType = document.getElementById("linearSearchType").value;
    const binarySearchTitle = document.getElementById("binarySearchTitle").value;
    const sortedServices = sortByField(company.services, (service) => service.title, "asc");

    const linearMatch = linearSearch(company.services, (service) => service.type === linearSearchType);
    const binaryMatch = binarySearchByString(sortedServices, binarySearchTitle, (service) => service.title);

    renderResult("Resultado de busquedas", {
        linearSearch: {
            targetType: linearSearchType,
            match: linearMatch
        },
        binarySearch: {
            targetTitle: binarySearchTitle,
            sortedTitles: sortedServices.map((service) => service.title),
            match: binaryMatch
        }
    });
});

document.getElementById("runReportButton").addEventListener("click", () => {
    renderResult("Reporte agregado de leads", createLeadAggregationReport(sampleLeads));
});

document.getElementById("runValidationButton").addEventListener("click", () => {
    renderResult("Validacion de negocio sobre lead de prueba", {
        lead: invalidLead,
        validation: validateLeadRequest(invalidLead)
    });
});

document.getElementById("resetResultsButton").addEventListener("click", () => {
    resultLabel.textContent = "Selecciona una operacion para ver la salida.";
    resultOutput.textContent = "Esperando accion...";
});

renderDatasetSummary();