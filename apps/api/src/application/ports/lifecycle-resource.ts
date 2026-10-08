export interface LifecycleResource {
  readonly name: string;
  close(): Promise<void>;
}
