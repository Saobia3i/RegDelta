import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

type Citation = { page: number; quote: string; supports: string };
type Action = { action: string; owner_suggestion: string };

function Chart({ option, label }: { option: EChartsOption; label: string }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current) return;
    const chart = echarts.init(element.current, undefined, { renderer: "canvas" });
    chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(element.current);
    return () => { observer.disconnect(); chart.dispose(); };
  }, [option]);
  return <div ref={element} className="rd-echart" role="img" aria-label={label} />;
}

const base = {
  animationDuration: 350,
  textStyle: { fontFamily: "Inter, Segoe UI, sans-serif", color: "#475569" },
  tooltip: { trigger: "axis" as const, axisPointer: { type: "shadow" as const }, confine: true },
  grid: { left: 18, right: 20, top: 24, bottom: 28, containLabel: true },
};

export default function RegulatoryAnalyticsCharts({ citations, actions, inputTokens, outputTokens }: {
  citations: Citation[]; actions: Action[]; inputTokens: number; outputTokens: number;
}) {
  const citationOption = useMemo<EChartsOption>(() => {
    const byPage = new Map<number, number>();
    citations.forEach((citation) => byPage.set(citation.page, (byPage.get(citation.page) || 0) + 1));
    const pages = [...byPage.keys()].sort((a, b) => a - b);
    return { ...base, xAxis: { type: "category", data: pages.map((page) => `Page ${page}`), axisTick: { show: false }, axisLine: { lineStyle: { color: "#dce2e9" } } },
      yAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf0f3" } } },
      series: [{ name: "Verified citations", type: "bar", data: pages.map((page) => byPage.get(page) || 0), barMaxWidth: 38,
        itemStyle: { color: "#d83a35", borderRadius: [5, 5, 0, 0] }, emphasis: { focus: "series" } }] };
  }, [citations]);

  const ownerOption = useMemo<EChartsOption>(() => {
    const byOwner = new Map<string, number>();
    actions.forEach((action) => {
      const owner = action.owner_suggestion.trim() || "Unassigned by model";
      byOwner.set(owner, (byOwner.get(owner) || 0) + 1);
    });
    const rows = [...byOwner.entries()].sort((a, b) => b[1] - a[1]);
    return { ...base, grid: { ...base.grid, left: 18, right: 18, top: 12, bottom: 12 },
      xAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf0f3" } } },
      yAxis: { type: "category", data: rows.map(([owner]) => owner), axisTick: { show: false }, axisLine: { show: false }, axisLabel: { width: 150, overflow: "truncate" } },
      series: [{ name: "Draft actions", type: "bar", data: rows.map(([, count]) => count), barMaxWidth: 24,
        itemStyle: { color: "#16877b", borderRadius: [0, 5, 5, 0] }, label: { show: true, position: "right", color: "#334155" } }] };
  }, [actions]);

  const tokenOption = useMemo<EChartsOption>(() => ({ ...base,
    xAxis: { type: "category", data: ["Input tokens", "Output tokens"], axisTick: { show: false }, axisLine: { lineStyle: { color: "#dce2e9" } } },
    yAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: "#edf0f3" } } },
    series: [{ name: "Tokens", type: "bar", data: [inputTokens, outputTokens], barMaxWidth: 48,
        itemStyle: { color: "#487bb5", borderRadius: [5, 5, 0, 0] }, label: { show: true, position: "top", formatter: (params: { value?: unknown }) => Number(params.value ?? 0).toLocaleString() } }],
  }), [inputTokens, outputTokens]);

  return <section className="rd-analytics" aria-label="Document analysis dashboard">
    <div className="rd-dashboard-heading"><div><span className="rd-kicker">RUN ANALYTICS</span><h2>Analysis dashboard</h2></div><span>Charts use this Gemini run’s returned data</span></div>
    <div className="rd-chart-grid">
      <article className="rd-chart-card"><div><b>Citations by PDF page</b><small>Verified quotations returned by Gemini</small></div><Chart option={citationOption} label="Verified source citations grouped by PDF page" /></article>
      <article className="rd-chart-card"><div><b>Draft actions by suggested owner</b><small>Owner suggestions generated for this run</small></div><Chart option={ownerOption} label="AI draft actions grouped by suggested owner" /></article>
      <article className="rd-chart-card"><div><b>Model usage</b><small>Token counts reported by OpenRouter</small></div><Chart option={tokenOption} label="OpenRouter input and output token counts" /></article>
    </div>
    <p className="rd-chart-note">These charts describe this single document run. They are not quality scores, compliance ratings, or measured system-wide performance.</p>
  </section>;
}
