// api configuration and constants

const config = {
  // backend api url
  apiUrl: 'http://localhost:8080',
  
  // local storage keys
  tokenKey: 'zenith_token',
  userKey: 'zenith_user',
  
  // account types for buyer restrictions
  accountTypes: {
    PERSONAL: 'PERSONAL',
    BUSINESS: 'BUSINESS',
    MEDICAL: 'MEDICAL',
    GOVERNMENT: 'GOVERNMENT'
  },
  
  // buyer requirements for products
  buyerRequirements: {
    NONE: 'NONE',
    BUSINESS: 'BUSINESS',
    MEDICAL: 'MEDICAL',
    GOVERNMENT: 'GOVERNMENT'
  },
  
  // robot colors from COLOR_SCHEME.md
  robotColors: {
    'KODA': '#E8D5C4',      // ceramic sand
    'SERVO': '#9E9E9E',     // raw titanium
    'NOVA': '#FFFFFF',      // stellar white
    'MAGMA': '#FF6F00',     // molten orange
    'EPSI-9': '#212121',    // phantom black
    'SAGE': '#2E7D32'       // boreal green
  },
  
  // category ids
  categories: {
    HOUSEHOLD: 1,
    INDUSTRIAL: 2,
    MEDICAL: 3,
    CONSTRUCTION: 4,
    MILITARY: 5,
    RESEARCH: 6,
    ACCESSORIES: 7
  }
};
