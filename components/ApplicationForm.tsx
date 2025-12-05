
import React, { useState } from 'react';
import { Send, CheckCircle, ChevronRight, ChevronLeft, AlertTriangle, UploadCloud, File as FileIcon, X } from 'lucide-react';
import { MortgageFormData, ApplicantPersonal, AddressDetails, ApplicantEmployment, ApplicantFinancials, LiabilityRow } from '../types';

// --- Helper Components (Defined Outside to prevent Focus Loss) ---

const Input = ({ label, value, onChange, placeholder = "", type = "text", required = false, width = "w-full" }: any) => (
  <div className={`mb-3 ${width}`}>
    <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-sm"
    />
  </div>
);

const AddressBlock = ({ data, onUpdate, section }: { data: AddressDetails, onUpdate: (field: keyof AddressDetails, val: string) => void, section: 'principal' | 'coApplicant' | 'subjectProperty' }) => (
  <div className="bg-slate-50 p-4 rounded border border-slate-200 mt-2">
    <h4 className="text-sm font-bold text-slate-700 mb-3 border-b pb-1">Address Details</h4>
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-3">
        <Input label="Unit #" value={data.unit} onChange={(v: string) => onUpdate('unit', v)} />
      </div>
      <div className="col-span-3">
        <Input label="Street #" value={data.streetNumber} onChange={(v: string) => onUpdate('streetNumber', v)} />
      </div>
      <div className="col-span-6">
        <Input label="Street Name" value={data.streetName} onChange={(v: string) => onUpdate('streetName', v)} />
      </div>
      <div className="col-span-6 md:col-span-4">
        <Input label="Street Type" value={data.streetType} onChange={(v: string) => onUpdate('streetType', v)} placeholder="Rd, St, Ave" />
      </div>
      <div className="col-span-6 md:col-span-2">
        <Input label="Dir." value={data.streetDir} onChange={(v: string) => onUpdate('streetDir', v)} placeholder="NW, S" />
      </div>
      <div className="col-span-12 md:col-span-6">
          <div className="grid grid-cols-2 gap-2">
              <Input label="City" value={data.city} onChange={(v: string) => onUpdate('city', v)} />
              <Input label="Prov." value={data.province} onChange={(v: string) => onUpdate('province', v)} />
          </div>
      </div>
      <div className="col-span-12 md:col-span-4">
        <Input label="Postal Code" value={data.postalCode} onChange={(v: string) => onUpdate('postalCode', v)} />
      </div>
    </div>
    {section !== 'subjectProperty' && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 pt-2 border-t border-slate-200">
         <Input label="Years There" value={data.yearsThere} onChange={(v: string) => onUpdate('yearsThere', v)} type="number" />
         <Input label="Months" value={data.monthsThere} onChange={(v: string) => onUpdate('monthsThere', v)} type="number" />
         <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Own/Rent</label>
            <select 
              value={data.status} 
              onChange={(e) => onUpdate('status', e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-brand-primary text-sm bg-white"
            >
              <option value="">Select</option>
              <option value="own">Own</option>
              <option value="rent">Rent</option>
            </select>
         </div>
         <Input label="Monthly Pmt ($)" value={data.monthlyPayment} onChange={(v: string) => onUpdate('monthlyPayment', v)} type="number" />
      </div>
    )}
  </div>
);

// --- Initial State Factories (Functions ensuring unique references) ---

const createEmptyAddress = (): AddressDetails => ({
  unit: '', streetNumber: '', streetName: '', streetType: '', streetDir: '',
  city: '', province: '', postalCode: '', yearsThere: '', monthsThere: '',
  status: '', monthlyPayment: ''
});

const createEmptyPersonal = (): ApplicantPersonal => ({
  firstName: '', middleName: '', lastName: '', dob: '', sin: '',
  maritalStatus: '', dependants: '', address: createEmptyAddress(),
  phonePrimary: '', phoneCell: '', phoneWork: '', phoneExt: '', fax: '', email: ''
});

const createEmptyEmployment = (): ApplicantEmployment => ({
  employer: '', address: '', cityProvince: '', phone: '', position: '',
  incomeType: '', incomeLevel: '', annualIncome: '', yearsEmployed: '',
  otherSourceDesc: '', otherSourceAmount: ''
});

const createEmptyLiabilityRow = (): LiabilityRow => ({ company: '', balance: '', payment: '' });

const createEmptyFinancials = (): ApplicantFinancials => ({
  assets: {
    savings: '', chequing: '', rrsp: '', stocks: '', vehicles: '',
    residence: '', otherRealEstate: '', other: '', bankName: '',
    otherPropertiesCount: '', otherPropertiesDetails: ''
  },
  liabilities: {
    loans: [createEmptyLiabilityRow(), createEmptyLiabilityRow()],
    creditCards: [createEmptyLiabilityRow(), createEmptyLiabilityRow()],
    mortgages: [createEmptyLiabilityRow()],
    other: [createEmptyLiabilityRow()]
  }
});

// --- Placeholder for Backend Function ---
const uploadClientDocuments = (clientName: string, files: File[]) => {
  // This is a simulation of the requested placeholder function
  console.log(`[UPLOAD STARTED] Client: ${clientName}`);
  console.log(`Files to upload:`, files.map(f => f.name));
  
  // In a real implementation, this would send FormData to a secure API endpoint
  // that interfaces with Google Drive API.
  
  // Visual confirmation for demo purposes
  setTimeout(() => {
    alert(`[SYSTEM MOCKUP]\n\nIntent: Save ${files.length} files to Google Drive.\nClient Folder: "${clientName}"\n\n(This requires active backend API integration)`);
  }, 500);
};

export const ApplicationForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<MortgageFormData>({
    initial: { mortgageType: '', purpose: '', propertyUse: '', currentHomeOwner: '' },
    principal: { 
      personal: createEmptyPersonal(), 
      employment: createEmptyEmployment(), 
      financials: createEmptyFinancials() 
    },
    coApplicant: { 
      personal: createEmptyPersonal(), 
      employment: createEmptyEmployment(), 
      financials: createEmptyFinancials() 
    },
    subjectProperty: { 
      address: createEmptyAddress(), 
      description: '', salePrice: '', mortgageAmount: '', notes: '' 
    },
    documents: []
  });

  // --- Handlers ---

  const clearErrors = () => {
    if (errors.length > 0) setErrors([]);
  };

  const updateInitial = (field: string, value: string) => {
    clearErrors();
    setFormData(prev => ({ ...prev, initial: { ...prev.initial, [field]: value } }));
  };

  const updateDeep = (
    section: 'principal' | 'coApplicant',
    subSection: 'personal' | 'employment',
    field: string,
    value: string
  ) => {
    clearErrors();
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
  };

  const updateAddress = (
    section: 'principal' | 'coApplicant' | 'subjectProperty',
    field: keyof AddressDetails,
    value: string
  ) => {
    clearErrors();
    if (section === 'subjectProperty') {
      setFormData(prev => ({
        ...prev,
        subjectProperty: { ...prev.subjectProperty, address: { ...prev.subjectProperty.address, [field]: value } }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          personal: {
            ...prev[section].personal,
            address: { ...prev[section].personal.address, [field]: value }
          }
        }
      }));
    }
  };

  const updateAsset = (section: 'principal' | 'coApplicant', field: string, value: string) => {
    clearErrors();
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        financials: {
          ...prev[section].financials,
          assets: { ...prev[section].financials.assets, [field]: value }
        }
      }
    }));
  };

  const updateLiability = (
    section: 'principal' | 'coApplicant',
    type: keyof ApplicantFinancials['liabilities'],
    index: number,
    field: keyof LiabilityRow,
    value: string
  ) => {
    clearErrors();
    setFormData(prev => {
      const newLiabilities = { ...prev[section].financials.liabilities };
      newLiabilities[type] = [...newLiabilities[type]];
      newLiabilities[type][index] = { ...newLiabilities[type][index], [field]: value };
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          financials: {
            ...prev[section].financials,
            liabilities: newLiabilities
          }
        }
      };
    });
  };

  const updateSubjectProp = (field: string, value: string) => {
    clearErrors();
    setFormData(prev => ({ ...prev, subjectProperty: { ...prev.subjectProperty, [field]: value } }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // --- Validation & Navigation ---

  const validateStep = (currentStep: number): boolean => {
    const newErrors: string[] = [];
    
    if (currentStep === 2) {
      if (!formData.principal.personal.firstName.trim()) newErrors.push("Principal First Name is required.");
      if (!formData.principal.personal.lastName.trim()) newErrors.push("Principal Last Name is required.");
      if (!formData.principal.personal.phonePrimary.trim()) newErrors.push("Principal Primary Phone is required.");
      if (!formData.principal.personal.email.trim()) newErrors.push("Principal Email is required.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      window.scrollTo(0, 0);
      return false;
    }
    
    setErrors([]);
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, 6));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setErrors([]);
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setIsSubmitting(true);

    // --- LOGIC FOR GOOGLE DRIVE UPLOAD PLACEHOLDER ---
    // Capture Full Legal Name for Folder Creation
    const clientName = `${formData.principal.personal.firstName} ${formData.principal.personal.lastName}`.trim() || 'Unknown Client';
    const files = formData.documents;

    // Call the requested placeholder function
    uploadClientDocuments(clientName, files);

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      window.scrollTo(0, 0);
    }, 2000);
  };

  // --- Views ---

  if (submitSuccess) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center border border-green-100 mt-8">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Application Submitted!</h2>
        <p className="text-slate-600 mb-8 text-lg">
            We have received your detailed application and documents. Ravi Patel will review your information and get back to you shortly.
        </p>
        <button onClick={() => window.location.reload()} className="bg-brand-primary text-white px-8 py-3 rounded-lg font-bold">
            Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden font-sans">
      
      {/* Progress Bar */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="flex justify-between items-center px-4 py-4 md:px-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors ${
                step === s ? 'bg-brand-primary text-white' : 
                step > s ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-500'
              }`}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              <span className="hidden md:block text-[10px] md:text-xs mt-1 font-medium text-slate-600 uppercase tracking-wide">
                {s === 1 && 'Initial'}
                {s === 2 && 'Personal'}
                {s === 3 && 'Employ'}
                {s === 4 && 'Assets'}
                {s === 5 && 'Property'}
                {s === 6 && 'Docs'}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-slate-200 w-full">
          <div className="h-full bg-brand-accent transition-all duration-300" style={{ width: `${(step / 6) * 100}%` }}></div>
        </div>
      </div>

      {/* Error Banner */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
             <AlertTriangle size={18} />
             Please fix the following:
          </div>
          <ul className="list-disc pl-8 text-sm text-red-600">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 md:p-8 min-h-[500px]">
        
        {/* Step 1: Initial */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right duration-300 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Initial Questions</h2>
            
            <Input label="What type of mortgage application is this?" value={formData.initial.mortgageType} onChange={(v: string) => updateInitial('mortgageType', v)} placeholder="e.g. Pre-approval, Purchase, Refinance" />
            <Input label="What is the purpose of this mortgage request?" value={formData.initial.purpose} onChange={(v: string) => updateInitial('purpose', v)} placeholder="e.g. Buying first home, Lowering rate" />
            
            <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">How will the property be used?</label>
                <div className="flex gap-4">
                    {['Owner Occupied', 'Rental', 'Second Home'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="propUse" 
                                checked={formData.initial.propertyUse === opt}
                                onChange={() => updateInitial('propertyUse', opt)}
                                className="text-brand-primary focus:ring-brand-primary"
                            />
                            <span className="text-sm">{opt}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Do you currently own your own home?</label>
                <div className="flex gap-4">
                    {['Yes', 'No'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="ownHome" 
                                checked={formData.initial.currentHomeOwner === opt}
                                onChange={() => updateInitial('currentHomeOwner', opt)}
                                className="text-brand-primary focus:ring-brand-primary"
                            />
                            <span className="text-sm">{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* Step 2: Personal */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
             <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Personal Information</h2>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Principal */}
                <div className="space-y-4">
                    <div className="bg-blue-50 p-2 rounded text-brand-primary font-bold text-center">Principal Applicant</div>
                    
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-5"><Input label="First Name" required value={formData.principal.personal.firstName} onChange={(v: string) => updateDeep('principal', 'personal', 'firstName', v)} /></div>
                        <div className="col-span-2"><Input label="Initial" value={formData.principal.personal.middleName} onChange={(v: string) => updateDeep('principal', 'personal', 'middleName', v)} /></div>
                        <div className="col-span-5"><Input label="Last Name" required value={formData.principal.personal.lastName} onChange={(v: string) => updateDeep('principal', 'personal', 'lastName', v)} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Birthdate (YYYY-MM-DD)" type="date" value={formData.principal.personal.dob} onChange={(v: string) => updateDeep('principal', 'personal', 'dob', v)} />
                        <Input label="SIN" value={formData.principal.personal.sin} onChange={(v: string) => updateDeep('principal', 'personal', 'sin', v)} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Marital Status" value={formData.principal.personal.maritalStatus} onChange={(v: string) => updateDeep('principal', 'personal', 'maritalStatus', v)} />
                        <Input label="Dependants" value={formData.principal.personal.dependants} onChange={(v: string) => updateDeep('principal', 'personal', 'dependants', v)} />
                    </div>

                    <AddressBlock 
                      data={formData.principal.personal.address} 
                      section="principal" 
                      onUpdate={(f, v) => updateAddress('principal', f, v)}
                    />

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded">
                        <Input label="Primary Phone" required value={formData.principal.personal.phonePrimary} onChange={(v: string) => updateDeep('principal', 'personal', 'phonePrimary', v)} />
                        <Input label="Cell Phone" value={formData.principal.personal.phoneCell} onChange={(v: string) => updateDeep('principal', 'personal', 'phoneCell', v)} />
                        <Input label="Work Phone" value={formData.principal.personal.phoneWork} onChange={(v: string) => updateDeep('principal', 'personal', 'phoneWork', v)} />
                        <Input label="Email" required type="email" value={formData.principal.personal.email} onChange={(v: string) => updateDeep('principal', 'personal', 'email', v)} />
                    </div>
                </div>

                {/* Co-Applicant */}
                <div className="space-y-4 border-t pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8">
                    <div className="bg-slate-100 p-2 rounded text-slate-700 font-bold text-center">Co-Applicant (Optional)</div>
                    
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-5"><Input label="First Name" value={formData.coApplicant.personal.firstName} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'firstName', v)} /></div>
                        <div className="col-span-2"><Input label="Initial" value={formData.coApplicant.personal.middleName} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'middleName', v)} /></div>
                        <div className="col-span-5"><Input label="Last Name" value={formData.coApplicant.personal.lastName} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'lastName', v)} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Birthdate" type="date" value={formData.coApplicant.personal.dob} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'dob', v)} />
                        <Input label="SIN" value={formData.coApplicant.personal.sin} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'sin', v)} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Marital Status" value={formData.coApplicant.personal.maritalStatus} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'maritalStatus', v)} />
                        <Input label="Dependants" value={formData.coApplicant.personal.dependants} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'dependants', v)} />
                    </div>

                    <AddressBlock 
                      data={formData.coApplicant.personal.address} 
                      section="coApplicant" 
                      onUpdate={(f, v) => updateAddress('coApplicant', f, v)}
                    />

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded">
                        <Input label="Primary Phone" value={formData.coApplicant.personal.phonePrimary} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'phonePrimary', v)} />
                        <Input label="Cell Phone" value={formData.coApplicant.personal.phoneCell} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'phoneCell', v)} />
                        <Input label="Work Phone" value={formData.coApplicant.personal.phoneWork} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'phoneWork', v)} />
                        <Input label="Email" type="email" value={formData.coApplicant.personal.email} onChange={(v: string) => updateDeep('coApplicant', 'personal', 'email', v)} />
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* Step 3: Employment */}
        {step === 3 && (
             <div className="animate-in fade-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Employment Information</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {[
                        { title: 'Principal Applicant', data: formData.principal.employment, role: 'principal' },
                        { title: 'Co-Applicant', data: formData.coApplicant.employment, role: 'coApplicant' }
                     ].map((section, idx) => (
                        <div key={section.role} className={`space-y-4 ${idx === 1 ? 'border-t pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-8' : ''}`}>
                            <div className={`p-2 rounded font-bold text-center ${idx === 0 ? 'bg-blue-50 text-brand-primary' : 'bg-slate-100 text-slate-700'}`}>{section.title}</div>
                            
                            <Input label="Current Employer" value={section.data.employer} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'employer', v)} />
                            <Input label="Employer Address" value={section.data.address} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'address', v)} />
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="City/Province" value={section.data.cityProvince} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'cityProvince', v)} />
                                <Input label="Phone Number" value={section.data.phone} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'phone', v)} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Position" value={section.data.position} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'position', v)} />
                                <Input label="Years Employed" value={section.data.yearsEmployed} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'yearsEmployed', v)} />
                            </div>

                            <div className="bg-slate-50 p-3 rounded">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="Income Type" value={section.data.incomeType} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'incomeType', v)} placeholder="Salaried/Hourly" />
                                    <Input label="Annual Income ($)" value={section.data.annualIncome} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'annualIncome', v)} type="number" />
                                </div>
                            </div>
                            
                            <h4 className="text-xs font-bold uppercase text-slate-500 mt-4">Other Sources of Income</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <Input label="Description" value={section.data.otherSourceDesc} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'otherSourceDesc', v)} />
                                </div>
                                <Input label="Amount ($)" value={section.data.otherSourceAmount} onChange={(v: string) => updateDeep(section.role as any, 'employment', 'otherSourceAmount', v)} type="number" />
                            </div>
                        </div>
                     ))}
                </div>
             </div>
        )}

        {/* Step 4: Assets & Liabilities */}
        {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right duration-300">
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Assets & Liabilities</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Render Loop for Principal and Co-Applicant */}
                    {['principal', 'coApplicant'].map((roleStr) => {
                        const role = roleStr as 'principal' | 'coApplicant';
                        const data = formData[role].financials;
                        const label = role === 'principal' ? 'Principal Applicant' : 'Co-Applicant';
                        const bgClass = role === 'principal' ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200';

                        return (
                            <div key={role} className="space-y-6">
                                <div className={`p-2 rounded font-bold text-center uppercase tracking-wider text-sm ${role === 'principal' ? 'bg-brand-primary text-white' : 'bg-slate-600 text-white'}`}>
                                    {label}
                                </div>

                                {/* Assets */}
                                <div className={`p-4 rounded border ${bgClass}`}>
                                    <h3 className="font-bold text-slate-700 mb-3 border-b border-slate-300 pb-1">Assets</h3>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                        <Input label="Savings ($)" value={data.assets.savings} onChange={(v: string) => updateAsset(role, 'savings', v)} type="number" />
                                        <Input label="Chequing ($)" value={data.assets.chequing} onChange={(v: string) => updateAsset(role, 'chequing', v)} type="number" />
                                        <Input label="RRSP ($)" value={data.assets.rrsp} onChange={(v: string) => updateAsset(role, 'rrsp', v)} type="number" />
                                        <Input label="Stocks/Bonds ($)" value={data.assets.stocks} onChange={(v: string) => updateAsset(role, 'stocks', v)} type="number" />
                                        <Input label="Vehicle Value ($)" value={data.assets.vehicles} onChange={(v: string) => updateAsset(role, 'vehicles', v)} type="number" />
                                        <Input label="Residence Value ($)" value={data.assets.residence} onChange={(v: string) => updateAsset(role, 'residence', v)} type="number" />
                                        <div className="col-span-2">
                                            <Input label="Name of Bank" value={data.assets.bankName} onChange={(v: string) => updateAsset(role, 'bankName', v)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Liabilities */}
                                <div className={`p-4 rounded border ${bgClass}`}>
                                    <h3 className="font-bold text-slate-700 mb-3 border-b border-slate-300 pb-1">Liabilities</h3>
                                    
                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase mb-2">
                                        <div className="col-span-2">Type</div>
                                        <div className="col-span-4">Company</div>
                                        <div className="col-span-3">Balance</div>
                                        <div className="col-span-3">Monthly</div>
                                    </div>

                                    {/* Rows */}
                                    {[
                                        { type: 'loans', label: 'Loan' },
                                        { type: 'creditCards', label: 'Credit' },
                                        { type: 'mortgages', label: 'Mtg' }
                                    ].map((cat) => (
                                        <React.Fragment key={cat.type}>
                                            {data.liabilities[cat.type as keyof typeof data.liabilities].map((row, idx) => (
                                                <div key={`${cat.type}-${idx}`} className="grid grid-cols-12 gap-2 mb-2 items-center">
                                                    <div className="col-span-2 text-xs font-semibold text-slate-600">{cat.label}</div>
                                                    <div className="col-span-4"><input className="w-full text-xs border rounded p-1" placeholder="Company" value={row.company} onChange={(e) => updateLiability(role, cat.type as any, idx, 'company', e.target.value)} /></div>
                                                    <div className="col-span-3"><input className="w-full text-xs border rounded p-1" placeholder="$" type="number" value={row.balance} onChange={(e) => updateLiability(role, cat.type as any, idx, 'balance', e.target.value)} /></div>
                                                    <div className="col-span-3"><input className="w-full text-xs border rounded p-1" placeholder="$" type="number" value={row.payment} onChange={(e) => updateLiability(role, cat.type as any, idx, 'payment', e.target.value)} /></div>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Step 5: Subject Property */}
        {step === 5 && (
             <div className="animate-in fade-in slide-in-from-right duration-300 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Subject Property Information</h2>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
                     <p className="text-sm text-slate-500 mb-4 italic">(Fill out only if applicable)</p>
                     <AddressBlock 
                       data={formData.subjectProperty.address} 
                       section="subjectProperty" 
                       onUpdate={(f, v) => updateAddress('subjectProperty', f, v)}
                     />
                     
                     <div className="grid grid-cols-2 gap-4 mt-4">
                        <Input label="Sale Price ($)" value={formData.subjectProperty.salePrice} onChange={(v: string) => updateSubjectProp('salePrice', v)} type="number" />
                        <Input label="Mortgage Amount ($)" value={formData.subjectProperty.mortgageAmount} onChange={(v: string) => updateSubjectProp('mortgageAmount', v)} type="number" />
                     </div>
                     <div className="mt-4">
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">Notes / Description</label>
                        <textarea 
                            rows={3}
                            value={formData.subjectProperty.notes}
                            onChange={(e) => updateSubjectProp('notes', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-brand-primary text-sm"
                        ></textarea>
                     </div>
                </div>
             </div>
        )}

        {/* Step 6: Documents & Submit */}
        {step === 6 && (
            <div className="animate-in fade-in slide-in-from-right duration-300 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Document Upload</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <UploadCloud className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Required Documents</h3>
                    <p className="text-sm text-slate-600 mb-6">
                        Please upload Pay Stubs, T4s, NOAs, or Identification. <br/>
                        Multiple files can be selected.
                    </p>
                    
                    <div className="relative">
                        <input 
                            type="file" 
                            multiple 
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button type="button" className="bg-white border border-slate-300 text-brand-primary px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-slate-50">
                            Select Files
                        </button>
                    </div>
                </div>

                {/* File List */}
                {formData.documents.length > 0 && (
                    <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Attached Files ({formData.documents.length})</h4>
                        {formData.documents.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <FileIcon size={18} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700">{file.name}</span>
                                    <span className="text-xs text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500">
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 bg-slate-50 p-4 text-xs text-slate-500 border rounded mb-6 max-h-40 overflow-y-auto">
                    <p className="font-bold mb-2">Terms & Conditions:</p>
                    <p>I/We warrant and confirm that the information given in this mortgage application is true and correct and I/we understand that it is being used to determine my/our credit responsibility and will be forwarded to a financial intermediary and/or mortgage lender. I/We authorize, you and any financial intermediary and/or mortgage lender to whom this application was forwarded (individually or collectively defined as the "Recipients"), to obtain any information the Recipients may require relative to this application from any sources to which the Recipients apply and each source is hereby authorized to provide the Recipients with such information. The Recipients are furthermore authorized to disclose, in response to direct inquiries from any other lender or credit bureau, such information on my loan request as the Recipients consider appropriate, and I agree to indemnify the Recipients against any and all claims in damages or otherwise arising from such disclosure on the Recipients part. The Recipients are also authorized to retain the application whether or not the relative mortgage is approved. I agree to receive email and other electronic communication from you.</p>
                    <p className="mt-2 font-bold">Online Applications: Please read the paragraph above prior to sending completed application. By transmitting the online mortgage application you are accepting the terms of the paragraph noted above.</p>
                </div>

                <div className="flex items-start gap-3 mb-6">
                    <input type="checkbox" required className="mt-1" id="terms" />
                    <label htmlFor="terms" className="text-sm text-slate-700">I have read and agree to the terms above.</label>
                </div>
            </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
            {step > 1 ? (
                <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold flex items-center gap-2">
                    <ChevronLeft size={20} /> Back
                </button>
            ) : <div></div>}

            {step < 6 ? (
                <button type="button" onClick={nextStep} className="px-8 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-blue-800 flex items-center gap-2 shadow-lg">
                    Next Step <ChevronRight size={20} />
                </button>
            ) : (
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Submitting...' : 'Submit Application'} <Send size={20} />
                </button>
            )}
        </div>

      </form>
    </div>
  );
};
