
import { HealthcareRecord } from "../types";

const occupations = ['Engineer', 'Teacher', 'Doctor', 'Artist', 'Lawyer', 'Accountant', 'Nurse', 'Sales', 'Manager', 'Unemployed'];
const regions = ['Northeast', 'Northwest', 'Southeast', 'Southwest'] as const;
const employmentTypes = ['Salaried', 'Self-Employed', 'Freelancer', 'Unemployed'] as const;

export const generateDataset = (count: number = 1000): HealthcareRecord[] => {
  const data: HealthcareRecord[] = [];

  for (let i = 0; i < count; i++) {
    const age = Math.floor(Math.random() * 60) + 18;
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    // BMI tends to increase slightly with age in this synthetic set
    const bmi = parseFloat((Math.random() * 25 + 18 + (age * 0.1)).toFixed(1)); 
    
    const smoker = Math.random() > 0.8 ? 'Yes' : 'No';
    const exerciseFreq = ['Never', 'Rarely', 'Weekly', 'Daily'][Math.floor(Math.random() * 4)] as any;
    const education = ['High School', 'Bachelor', 'Master', 'PhD'][Math.floor(Math.random() * 4)] as any;
    
    // Medical History - Correlated with Age and BMI
    const historyHeartDisease = Math.random() > (0.95 - (age > 50 ? 0.1 : 0));
    const historyDiabetes = Math.random() > (0.9 - (bmi > 30 ? 0.15 : 0));
    const historyCancer = Math.random() > 0.98;
    const historyHighBP = Math.random() > (0.8 - (age > 45 ? 0.2 : 0) - (bmi > 28 ? 0.1 : 0));
    const familyHistory = Math.random() > 0.75; 
    const recentSurgeries = Math.random() > 0.85 ? Math.floor(Math.random() * 3) + 1 : 0; 

    // Correlated Income based on Education and Age
    let baseIncome = 30000;
    if (education === 'PhD') baseIncome += 70000;
    else if (education === 'Master') baseIncome += 50000;
    else if (education === 'Bachelor') baseIncome += 30000;
    baseIncome += (age - 18) * 1200; // Experience factor
    const income = Math.floor(baseIncome + (Math.random() * 30000 - 15000));

    // Plan Type based on Income
    let planType: any = 'Bronze';
    if (income > 140000) planType = 'Platinum';
    else if (income > 90000) planType = 'Gold';
    else if (income > 55000) planType = 'Silver';

    // Blood Pressure Logic (correlated with historyHighBP and BMI)
    let baseSys = 115;
    let baseDia = 75;
    if (historyHighBP) {
        baseSys += 25;
        baseDia += 15;
    }
    if (bmi > 30) {
        baseSys += 10;
        baseDia += 5;
    }
    const systolicBP = Math.floor(baseSys + (Math.random() * 20 - 10)); 
    const diastolicBP = Math.floor(baseDia + (Math.random() * 15 - 7)); 

    // Advanced Vitals Logic
    // HbA1c: Normal is 4-5.6, Pre-diabetes 5.7-6.4, Diabetes 6.5+
    let hba1c = 4.8 + Math.random() * 1.0; 
    if (historyDiabetes) hba1c = 6.5 + Math.random() * 3.0;
    else if (bmi > 30) hba1c += 0.5;
    hba1c = parseFloat(hba1c.toFixed(1));

    // Heart Rate: 60-100 normal. Lower if fit.
    let heartRate = 70 + Math.floor(Math.random() * 20);
    if (exerciseFreq === 'Daily') heartRate -= 10;
    if (exerciseFreq === 'Never') heartRate += 5;
    if (historyHeartDisease) heartRate += 5;

    // Oxygen Saturation: 95-100%
    const oxygenSaturation = 94 + Math.floor(Math.random() * 7);

    // Body Fat %: Men 10-20, Women 20-30 approx
    let bodyFat = gender === 'Male' ? 15 : 25;
    bodyFat += (bmi - 22) * 1.2; // Correlate with BMI
    if (exerciseFreq === 'Daily') bodyFat -= 3;
    bodyFat = parseFloat(Math.max(5, bodyFat).toFixed(1));


    const claimsHistory = Math.floor(Math.random() * 5);
    
    // Calculate Risk based on simple rules
    let riskScore = 0;
    if (smoker === 'Yes') riskScore += 5;
    if (bmi > 30) riskScore += 3;
    if (age > 50) riskScore += 2;
    if (historyHeartDisease) riskScore += 4;
    if (historyHighBP || systolicBP > 140) riskScore += 2;
    if (familyHistory) riskScore += 1;
    if (recentSurgeries > 0) riskScore += 2;
    if (hba1c > 6.5) riskScore += 3;
    
    const riskCategory = riskScore > 4 ? 'High' : 'Low';

    // Calculate Premium (Regression Target)
    let basePremium = 2000;
    basePremium += age * 250;
    basePremium += (bmi - 18) * 150;
    if (smoker === 'Yes') basePremium *= 2.5;
    if (historyHeartDisease) basePremium += 5000;
    if (historyDiabetes) basePremium += 3000;
    if (historyCancer) basePremium += 8000;
    if (recentSurgeries > 0) basePremium += 2000;
    if (familyHistory) basePremium += 500;
    if (hba1c > 7.0) basePremium += 1500;
    
    // Add some random variance
    const annualPremium = Math.floor(basePremium + (Math.random() * 2000 - 1000));

    data.push({
      id: i + 1,
      age,
      gender,
      bmi,
      children: Math.floor(Math.random() * 5),
      smoker,
      region: regions[Math.floor(Math.random() * regions.length)],
      income,
      education,
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)], 
      maritalStatus: ['Single', 'Married', 'Divorced'][Math.floor(Math.random() * 3)] as any,
      exerciseFreq,
      alcoholConsump: ['None', 'Light', 'Moderate', 'Heavy'][Math.floor(Math.random() * 4)] as any,
      historyHeartDisease,
      historyDiabetes,
      historyCancer,
      historyHighBP,
      familyHistory,
      recentSurgeries,
      systolicBP,
      diastolicBP,
      hba1c,
      heartRate,
      oxygenSaturation,
      bodyFat,
      cholesterol: Math.floor(Math.random() * 150) + 150,
      dailySteps: Math.floor(Math.random() * 10000) + 2000,
      sleepHours: Math.floor(Math.random() * 5) + 4,
      stressLevel: Math.floor(Math.random() * 10) + 1,
      doctorVisits: Math.floor(Math.random() * 10),
      prescriptions: Math.floor(Math.random() * 5),
      planType,
      claimsHistory,
      coverageAmount: Math.floor(Math.random() * 500000) + 50000,
      annualPremium,
      riskCategory
    });
  }

  return data;
};
