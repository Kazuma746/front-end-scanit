import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalysisState {
  imageBase64: string | null;
  analysis: string | null;
  scores: any | null;
  chatHistory: Array<{ role: string; content: string }>;
  sessionId: string | null;
  conversionStep: number;
}

const initialState: AnalysisState = {
  imageBase64: null,
  analysis: null,
  scores: null,
  chatHistory: [],
  sessionId: null,
  conversionStep: 0
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setAnalysisData: (state, action: PayloadAction<{
      imageBase64: string | null;
      analysis: string | null;
      scores: any | null;
      sessionId: string | null;
    }>) => {
      state.imageBase64 = action.payload.imageBase64;
      state.analysis = action.payload.analysis;
      state.scores = action.payload.scores;
      state.sessionId = action.payload.sessionId;
      state.conversionStep = 2;
    },
    addChatMessage: (state, action: PayloadAction<{
      role: string;
      content: string;
    }>) => {
      state.chatHistory.push(action.payload);
    },
    resetAnalysis: (state) => {
      return initialState;
    },
    setConversionStep: (state, action: PayloadAction<number>) => {
      state.conversionStep = action.payload;
    },
    setImageBase64: (state, action: PayloadAction<string>) => {
      state.imageBase64 = action.payload;
    }
  }
});

export const {
  setAnalysisData,
  addChatMessage,
  resetAnalysis,
  setConversionStep,
  setImageBase64
} = analysisSlice.actions;

export default analysisSlice.reducer; 