import React, { useState, useEffect, useCallback } from 'react';
import { Calculator as CalcIcon, DollarSign, Percent, Calendar, RefreshCw, TrendingUp, HelpCircle } from 'lucide-react';
import { CalculatorState } from '../types';

export const Calculator: React.FC = () => {
  // --- Mortgage Payment State ---
  const [values, setValues] = useState<CalculatorState>({
    price: 500000,
    downPayment: 100000,
    downPaymentPercent: 20,
    rate: 5.0,
    amortization: 25,
    frequency: 'monthly',
  });

  const [results, setResults] = useState({
    payment: 0,
    totalInterest: 0,
    totalCost: 0,
  });

  // --- Affordability Calculator State ---
  const [affordability, setAffordability] = useState({
    annualIncome: 100000,
    monthlyDebts: 500,
    downPayment: 80000,
    rate: 5.0,
    amortization: 25,
    desiredPayment: 0, // Will be auto-calculated initially
    isUserEditedPayment: false
  });

  const [maxAffordability, setMaxAffordability] = useState({
    maxMortgage: 0,
    maxPrice: 0,
    guidelinePayment: 0
  });

  // --- Handlers for Mortgage Calculator ---
  const handleInputChange = (field: keyof CalculatorState, value: string) => {
    const numVal = value === '' ? 0 : parseFloat(value);
    
    setValues((prev) => {
      const next = { ...prev };

      if (field === 'price') {
        next.price = numVal;
        next.downPayment = (numVal * next.downPaymentPercent) / 100;
      } else if (field === 'downPayment') {
        next.downPayment = numVal;
        next.downPaymentPercent = prev.price > 0 ? (numVal / prev.price) * 100 : 0;
      } else if (field === 'downPaymentPercent') {
        next.downPaymentPercent = numVal;
        next.downPayment = (prev.price * numVal) / 100;
      } else if (field === 'rate' || field === 'amortization') {
        // @ts-ignore
        next[field] = numVal;
      }

      return next;
    });
  };

  const handleFrequencyChange = (value: string) => {
    setValues(prev => ({ ...prev, frequency: value as CalculatorState['frequency'] }));
  };

  const calculateMortgage = useCallback(() => {
    const { price, downPayment, rate, amortization, frequency } = values;
    const principal = price - downPayment;
    
    if (principal <= 0) {
      setResults({ payment: 0, totalInterest: 0, totalCost: 0 });
      return;
    }

    const monthlyRate = (rate / 100) / 12;
    const totalMonths = amortization * 12;
    let monthlyPayment = 0;

    if (rate === 0) {
      monthlyPayment = principal / totalMonths;
    } else {
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    let payment = monthlyPayment;
    let paymentsPerYear = 12;

    if (frequency === 'bi-weekly') {
      payment = (monthlyPayment * 12) / 26;
      paymentsPerYear = 26;
    } else if (frequency === 'accelerated-bi-weekly') {
      payment = monthlyPayment / 2;
      paymentsPerYear = 26;
    }

    setResults({
      payment,
      totalInterest: (payment * paymentsPerYear * amortization) - principal,
      totalCost: payment * paymentsPerYear * amortization,
    });
  }, [values]);

  useEffect(() => {
    calculateMortgage();
  }, [calculateMortgage]);


  // --- Logic for Affordability Calculator ---
  
  // Update Affordability Inputs
  const handleAffordInput = (field: keyof typeof affordability, value: string) => {
    const numVal = value === '' ? 0 : parseFloat(value);
    setAffordability(prev => ({
        ...prev,
        [field]: numVal,
        isUserEditedPayment: field === 'desiredPayment' ? true : prev.isUserEditedPayment
    }));
  };

  // Recalculate Affordability
  useEffect(() => {
    const { annualIncome, monthlyDebts, downPayment, rate, amortization, desiredPayment, isUserEditedPayment } = affordability;
    
    // 1. Calculate Guideline Max Payment (GDS/TDS estimation)
    // A conservative estimate: (Income / 12) * 0.42 (TDS) - Debts
    const monthlyGross = annualIncome / 12;
    const maxTDSLimit = monthlyGross * 0.42; // Total Debt Service Ratio
    const guidelinePayment = Math.max(0, maxTDSLimit - monthlyDebts); // What is left for mortgage + heat + taxes

    // 2. Determine payment to use for calculation
    // If user hasn't manually edited the desired payment, update it to the guideline
    let paymentToUse = desiredPayment;
    
    if (!isUserEditedPayment && desiredPayment !== guidelinePayment) {
        setAffordability(prev => ({ ...prev, desiredPayment: parseFloat(guidelinePayment.toFixed(2)) }));
        paymentToUse = guidelinePayment;
    }

    // 3. Calculate Max Mortgage based on Payment (PV Formula)
    // PV = Pmt * (1 - (1+r)^-n) / r
    const monthlyRate = (rate / 100) / 12;
    const totalMonths = amortization * 12;
    let maxMortgage = 0;

    if (rate === 0) {
        maxMortgage = paymentToUse * totalMonths;
    } else if (monthlyRate > 0) {
        maxMortgage = paymentToUse * (1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate;
    }

    // 4. Max Price
    const maxPrice = maxMortgage + downPayment;

    setMaxAffordability({
        maxMortgage,
        maxPrice,
        guidelinePayment
    });

  }, [affordability.annualIncome, affordability.monthlyDebts, affordability.downPayment, affordability.rate, affordability.amortization, affordability.desiredPayment, affordability.isUserEditedPayment]);


  return (
    <div className="space-y-8">
        
      {/* ----------------- Mortgage Payment Calculator ----------------- */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-brand-primary p-6 text-white flex items-center gap-3">
          <CalcIcon className="w-8 h-8 text-brand-accent" />
          <div>
            <h2 className="text-2xl font-bold">Mortgage Payment Calculator</h2>
            <p className="text-blue-100 text-sm">Estimate your monthly obligations</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  value={values.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            {/* Down Payment Group */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    value={values.downPayment.toFixed(0)}
                    onChange={(e) => handleInputChange('downPayment', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Percentage (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    value={values.downPaymentPercent.toFixed(2)}
                    onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Rate & Amortization */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={values.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amortization (Yrs)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    value={values.amortization}
                    onChange={(e) => handleInputChange('amortization', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Frequency</label>
              <div className="relative">
                <RefreshCw className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <select
                  value={values.frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary bg-white appearance-none"
                >
                  <option value="monthly">Monthly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="accelerated-bi-weekly">Accelerated Bi-Weekly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-center space-y-8 border border-slate-200">
            <div className="text-center">
              <h3 className="text-slate-500 font-medium mb-2 uppercase tracking-wide text-xs">Estimated Payment</h3>
              <div className="text-5xl font-bold text-brand-primary">
                ${results.payment.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-slate-400 text-sm mt-1 capitalize">{values.frequency.replace(/-/g, ' ')}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-200">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Principal Amount</span>
                  <span className="font-semibold text-slate-900">${(values.price - values.downPayment).toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Interest Payable</span>
                  <span className="font-semibold text-brand-accent">${results.totalInterest.toLocaleString('en-CA', { maximumFractionDigits: 0 })}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Total Cost of Mortgage</span>
                  <span className="font-semibold text-slate-900">${results.totalCost.toLocaleString('en-CA', { maximumFractionDigits: 0 })}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- Affordability Calculator ----------------- */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-800 p-6 text-white flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <div>
            <h2 className="text-2xl font-bold">Affordability Estimator</h2>
            <p className="text-slate-300 text-sm">How much house can you afford?</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gross Annual Income</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                            type="number"
                            value={affordability.annualIncome}
                            onChange={(e) => handleAffordInput('annualIncome', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Debts</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                            type="number"
                            value={affordability.monthlyDebts}
                            onChange={(e) => handleAffordInput('monthlyDebts', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800"
                            placeholder="Car loans, credit cards, etc."
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Car loans, credit card min payments, etc.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                            <input
                                type="number"
                                value={affordability.downPayment}
                                onChange={(e) => handleAffordInput('downPayment', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={affordability.rate}
                            onChange={(e) => handleAffordInput('rate', e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800"
                        />
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-bold text-blue-900">Desired Monthly Payment</label>
                        <div className="group relative">
                            <HelpCircle size={16} className="text-blue-400 cursor-help"/>
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-800 text-white text-xs p-2 rounded hidden group-hover:block z-10">
                                Default is estimated based on standard debt service ratios.
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                            type="number"
                            value={affordability.desiredPayment}
                            onChange={(e) => handleAffordInput('desiredPayment', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-blue-900 font-semibold"
                        />
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                        You can edit this amount. Based on your income, lenders typically allow up to <span className="font-bold">${maxAffordability.guidelinePayment.toLocaleString('en-CA', { maximumFractionDigits: 0 })}</span>.
                    </p>
                </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center space-y-6">
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                    <h3 className="text-green-800 font-medium mb-1 text-sm uppercase tracking-wide">Maximum Purchase Price</h3>
                    <div className="text-4xl md:text-5xl font-bold text-green-700">
                        ${maxAffordability.maxPrice.toLocaleString('en-CA', { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-green-600 text-xs mt-2">
                        Based on a {affordability.amortization}-year amortization at {affordability.rate}% interest.
                    </p>
                </div>

                <div className="space-y-4 px-4">
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-600">Max Mortgage Amount</span>
                        <span className="font-semibold text-slate-800">${maxAffordability.maxMortgage.toLocaleString('en-CA', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-600">Down Payment</span>
                        <span className="font-semibold text-slate-800">+ ${affordability.downPayment.toLocaleString('en-CA', { maximumFractionDigits: 0 })}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm pt-1">
                        <span className="text-slate-500 italic">Total</span>
                        <span className="font-bold text-slate-900">= ${maxAffordability.maxPrice.toLocaleString('en-CA', { maximumFractionDigits: 0 })}</span>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded text-xs text-slate-500 leading-relaxed">
                    <strong>Note:</strong> This is an estimate only. Actual affordability depends on credit score, property taxes, heating costs, and current stress-test regulations (e.g. Rate + 2%). Contact Ravi Patel for a precise pre-approval.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};