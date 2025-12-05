
export interface AddressDetails {
  unit: string;
  streetNumber: string;
  streetName: string;
  streetType: string;
  streetDir: string;
  city: string;
  province: string;
  postalCode: string;
  yearsThere: string;
  monthsThere: string;
  status: 'own' | 'rent' | '';
  monthlyPayment: string;
}

export interface ApplicantPersonal {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  sin: string;
  maritalStatus: string;
  dependants: string;
  address: AddressDetails;
  phonePrimary: string;
  phoneCell: string;
  phoneWork: string;
  phoneExt: string;
  fax: string;
  email: string;
}

export interface ApplicantEmployment {
  employer: string;
  address: string;
  cityProvince: string;
  phone: string;
  position: string;
  incomeType: string;
  incomeLevel: string;
  annualIncome: string;
  yearsEmployed: string;
  otherSourceDesc: string;
  otherSourceAmount: string;
}

export interface LiabilityRow {
  company: string;
  balance: string;
  payment: string;
}

export interface ApplicantFinancials {
  assets: {
    savings: string;
    chequing: string;
    rrsp: string;
    stocks: string;
    vehicles: string;
    residence: string;
    otherRealEstate: string;
    other: string;
    bankName: string;
    otherPropertiesCount: string;
    otherPropertiesDetails: string;
  };
  liabilities: {
    loans: LiabilityRow[];
    creditCards: LiabilityRow[];
    mortgages: LiabilityRow[];
    other: LiabilityRow[];
  };
}

export interface MortgageFormData {
  // Page 1: Initial
  initial: {
    mortgageType: string;
    purpose: string;
    propertyUse: string;
    currentHomeOwner: string;
  };

  // Page 2-4: Applicant Specifics
  principal: {
    personal: ApplicantPersonal;
    employment: ApplicantEmployment;
    financials: ApplicantFinancials;
  };

  coApplicant: {
    personal: ApplicantPersonal;
    employment: ApplicantEmployment;
    financials: ApplicantFinancials;
  };

  // Page 5: Subject Property
  subjectProperty: {
    address: AddressDetails;
    description: string;
    salePrice: string;
    mortgageAmount: string;
    notes: string;
  };

  // Page 6: Documents
  documents: File[];
}

export interface CalculatorState {
  price: number;
  downPayment: number;
  downPaymentPercent: number;
  rate: number;
  amortization: number;
  frequency: 'monthly' | 'bi-weekly' | 'accelerated-bi-weekly';
}
