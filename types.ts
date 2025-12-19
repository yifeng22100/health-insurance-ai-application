
export interface HealthcareRecord {
  id: number;
  age: number;
  gender: 'Male' | 'Female';
  bmi: number;
  children: number;
  smoker: 'Yes' | 'No';
  region: 'Northeast' | 'Northwest' | 'Southeast' | 'Southwest';
  income: number;
  education: 'High School' | 'Bachelor' | 'Master' | 'PhD';
  occupation: string;
  employmentType: 'Salaried' | 'Self-Employed' | 'Freelancer' | 'Unemployed'; 
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  exerciseFreq: 'Never' | 'Rarely' | 'Weekly' | 'Daily';
  alcoholConsump: 'None' | 'Light' | 'Moderate' | 'Heavy';
  historyHeartDisease: boolean;
  historyDiabetes: boolean;
  historyCancer: boolean;
  historyHighBP: boolean;
  familyHistory: boolean;
  recentSurgeries: number;
  systolicBP: number;
  diastolicBP: number;
  hba1c: number; // New: Glycated Hemoglobin (Diabetes indicator)
  heartRate: number; // New: Resting Heart Rate
  oxygenSaturation: number; // New: SpO2
  bodyFat: number; // New: Body Fat Percentage
  cholesterol: number;
  dailySteps: number;
  sleepHours: number;
  stressLevel: number; // 1-10
  doctorVisits: number;
  prescriptions: number;
  planType: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  claimsHistory: number;
  coverageAmount: number;
  annualPremium: number; 
  riskCategory: 'Low' | 'High';
}

export enum AppTab {
  DATASET = 'DATASET',
  DASHBOARD = 'DASHBOARD',
  MODELS = 'MODELS',
  PREDICTION = 'PREDICTION', 
  COST_FORECAST = 'COST_FORECAST',
  REPORT = 'REPORT', 
}

export interface ModelMetric {
  name: string;
  type: 'ML' | 'DL';
  accuracyBefore: number;
  accuracyAfter: number;
  f1Score: number;
  trainingTime: string;
  details: string; 
}

export interface ComparisonResult {
  metrics: ModelMetric[];
  bestModel: string;
  insights: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number; // 0-100
  reason: string;
}

export interface FeatureSelectionResult {
  topFeatures: FeatureImportance[];
  methodology: string;
}
