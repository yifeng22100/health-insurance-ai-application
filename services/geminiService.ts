
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ModelMetric, ComparisonResult, FeatureSelectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Response schema for the model comparison
const modelComparisonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["ML", "DL"] },
          accuracyBefore: { type: Type.NUMBER, description: "Accuracy between 0.0 and 1.0" },
          accuracyAfter: { type: Type.NUMBER, description: "Accuracy between 0.0 and 1.0" },
          f1Score: { type: Type.NUMBER },
          trainingTime: { type: Type.STRING },
          details: { type: Type.STRING, description: "Specifics about Keras layers or Hyperparameters tuned" },
        },
        required: ["name", "type", "accuracyBefore", "accuracyAfter", "f1Score", "trainingTime", "details"],
      },
    },
    bestModel: { type: Type.STRING },
    insights: { type: Type.STRING },
  },
  required: ["metrics", "bestModel", "insights"],
};

// Response schema for feature selection
const featureSelectionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topFeatures: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING },
          importance: { type: Type.NUMBER, description: "Importance score from 0-100" },
          reason: { type: Type.STRING },
        },
        required: ["feature", "importance", "reason"],
      },
    },
    methodology: { type: Type.STRING, description: "Explanation of the feature selection method used (e.g., Information Gain, Chi-Square)" },
  },
  required: ["topFeatures", "methodology"],
};

export const runModelComparison = async (
  datasetSummary: string
): Promise<ComparisonResult> => {
  try {
    const prompt = `
      Act as a Lead Data Scientist specializing in Healthcare Insurance.
      
      I have a dataset of 1000 records with 25+ features including Age, BMI, HbA1c, Heart Rate, Body Fat %, Blood Pressure (Sys/Dia), Family History, Recent Surgeries, Employment Type, etc.
      The target variable is 'RiskCategory' (High/Low).

      Perform a comprehensive benchmark comparison of the following 8 algorithms on this N=1000 dataset:
      1. Logistic Regression
      2. Support Vector Machine (SVM)
      3. Random Forest Classifier
      4. XGBoost (Gradient Boosting)
      5. LightGBM (Leaf-wise growth)
      6. CatBoost (Categorical Boosting)
      7. Multi-Layer Perceptron (MLP - Scikit Learn)
      8. Deep Neural Network (Keras/TensorFlow)

      Instructions:
      - For the Keras/TensorFlow model, assume a specific deep architecture (e.g., Sequential, 3x Dense, ReLU, Dropout).
      - Perform 'Mental' Hyperparameter Tuning for ALL models to show "Before" and "After" accuracy improvements.
      - Comparison must highlight how Deep Learning compares to Tree-based models on this tabular data with 25+ features.
      
      Output a JSON object containing the performance metrics and a brief insight paragraph explaining why the winner won.
      
      Dataset Statistics Summary:
      ${datasetSummary}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: modelComparisonSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ComparisonResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini Model Comparison Error:", error);
    throw error;
  }
};

export const runFeatureSelection = async (
  datasetSummary: string
): Promise<FeatureSelectionResult> => {
  try {
    const prompt = `
      Act as a Data Scientist performing Feature Engineering.
      Analyze the predictive power of the 25+ features in this Healthcare Insurance dataset (1000 records) for the target 'RiskCategory' (High/Low).
      
      Features available: Age, BMI, Smoker, Blood Pressure, HbA1c, Body Fat, Cholesterol, Plan Type, Income, Education, etc. (Full list in summary).
      
      Task:
      - Identify the top 10 most predictive features out of the 25 available.
      - Assign an importance score (0-100) based on methods like Information Gain or Random Forest Feature Importance.
      - Provide a brief reason for each feature's importance.
      
      Dataset Summary:
      ${datasetSummary}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: featureSelectionSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as FeatureSelectionResult;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini Feature Selection Error:", error);
    throw error;
  }
};

export const predictRisk = async (
  features: Record<string, any>
): Promise<{ risk: string; confidence: number; reasoning: string }> => {
  try {
    const prompt = `
      Act as a deployed Healthcare Risk Prediction Model (XGBoost/Deep Learning hybrid).
      Based on the following patient features, predict whether they are 'High Risk' or 'Low Risk'.
      
      Patient Data:
      ${JSON.stringify(features, null, 2)}
      
      Return a JSON with:
      - risk: "High" or "Low"
      - confidence: number (0-100)
      - reasoning: A short sentence explaining the key drivers.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk: { type: Type.STRING, enum: ["High", "Low"] },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { risk: "Unknown", confidence: 0, reasoning: "AI Service Unavailable" };
  } catch (error) {
    return { risk: "Error", confidence: 0, reasoning: "Failed to process request" };
  }
};

export const predictPremium = async (
  features: Record<string, any>
): Promise<{ estimatedPremium: number; rangeLow: number; rangeHigh: number; factors: string[] }> => {
  try {
    const prompt = `
      Act as an Actuarial Data Science Model (Regression).
      Predict the estimated Annual Insurance Premium (Cost) for this patient.
      
      Base calculation logic (approximate): Base $2000 + Age factors + BMI factors + Smoking (huge multiplier) + Medical History.
      
      Patient Data:
      ${JSON.stringify(features, null, 2)}
      
      Return a JSON with:
      - estimatedPremium: number (The exact predicted dollar amount)
      - rangeLow: number
      - rangeHigh: number
      - factors: Array of strings listing top 3 cost drivers (e.g. "Smoker (+150%)", "Age > 50")
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedPremium: { type: Type.NUMBER },
            rangeLow: { type: Type.NUMBER },
            rangeHigh: { type: Type.NUMBER },
            factors: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response");
  } catch (error) {
    return { estimatedPremium: 0, rangeLow: 0, rangeHigh: 0, factors: ["Error predicting cost"] };
  }
};

export const generateExecutiveSummary = async (
  features: Record<string, any>,
  riskResult: any,
  costResult: any
): Promise<string> => {
  try {
    const prompt = `
      Act as a Senior Medical Underwriter and Data Analyst.
      Write a professional Executive Summary (1 paragraph, approx 80 words) for a health insurance policy report.
      
      Synthesize the following findings:
      - Patient Profile: ${JSON.stringify(features)}
      - AI Predicted Risk: ${JSON.stringify(riskResult)}
      - Forecasted Premium: ${JSON.stringify(costResult)}
      
      The tone should be formal, objective, and decisive. Mention the key reason for the risk classification and the price point.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text || "Summary unavailable.";
  } catch (error) {
    return "Could not generate executive summary.";
  }
};
