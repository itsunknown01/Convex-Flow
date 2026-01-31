import axios from "axios";
import { CircuitBreaker } from "../../utils/circuit-breaker.js";

const httpBreaker = new CircuitBreaker(5, 30000);

export interface HttpStepDefinition {
  type: "HTTP";
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: any;
  body?: any;
}

export const executeHttpStep = async (step: any): Promise<any> => {
  return httpBreaker.fire(async () => {
    try {
      const response = await axios({
        method: step.method,
        url: step.url,
        headers: step.headers,
        data: step.body,
        timeout: 5000, // Enforce 5s timeout for now
      });

      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
      };
    } catch (error: any) {
      throw new Error(
        error.response
          ? `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
          : error.message,
      );
    }
  });
};
