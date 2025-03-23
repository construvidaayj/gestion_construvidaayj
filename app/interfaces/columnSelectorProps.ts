export interface ColumnSelectorProps<T extends Record<string, unknown>> {
    headers: (keyof T)[];
    visibleHeaders: (keyof T)[];
    onToggleColumn: (header: keyof T) => void;
    headerLabels?: Partial<Record<keyof T, string>>;
  }