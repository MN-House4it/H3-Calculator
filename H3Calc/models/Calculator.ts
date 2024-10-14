import { Double } from "react-native/Libraries/Types/CodegenTypes";

// src/types/calculator.ts
export interface Calculator {
    id: string;
    name: string;
    lastResult: Double; // You can define this based on what operations your calculator performs
    lastOperation: string;
  }
  