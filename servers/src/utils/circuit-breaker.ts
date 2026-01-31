export enum BreakerState {
  CLOSED,
  OPEN,
  HALF_OPEN,
}

export class CircuitBreaker {
  private state: BreakerState = BreakerState.CLOSED;
  private failureCount: number = 0;
  private lastFailureTime: number | null = null;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;

  constructor(failureThreshold: number = 5, resetTimeout: number = 30000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
  }

  public async fire<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === BreakerState.OPEN) {
      if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeout) {
        this.state = BreakerState.HALF_OPEN;
        console.log("[CircuitBreaker] Transitioned to HALF_OPEN");
      } else {
        throw new Error("Circuit Breaker is OPEN");
      }
    }

    try {
      const result = await action();
      this.success();
      return result;
    } catch (error) {
      this.failure();
      throw error;
    }
  }

  private success() {
    this.failureCount = 0;
    if ((this.state as any) === BreakerState.HALF_OPEN) {
      console.log("[CircuitBreaker] Transitioned to CLOSED");
    }
    this.state = BreakerState.CLOSED;
  }

  private failure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (
      this.state === BreakerState.HALF_OPEN ||
      this.failureCount >= this.failureThreshold
    ) {
      this.state = BreakerState.OPEN;
      console.log("[CircuitBreaker] Transitioned to OPEN");
    }
  }

  public getState(): BreakerState {
    return this.state;
  }
}
