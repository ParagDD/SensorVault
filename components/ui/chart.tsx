// This file is no longer needed as we're using recharts directly
// Keep this file as a placeholder to avoid breaking imports
// The actual implementation has been moved to the chart.tsx component

"use client"

import { ReactNode } from 'react';

export const ChartContainer = ({ children }: { children: ReactNode }) => children;
export const ChartTooltip = ({ children }: { children: ReactNode }) => children;
export const ChartTooltipContent = () => null;
export const Line = () => null;
export const LineChart = ({ children }: { children: ReactNode }) => children;
export const XAxis = () => null;
export const YAxis = () => null;
