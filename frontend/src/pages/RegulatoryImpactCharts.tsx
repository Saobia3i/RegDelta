import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);
type Item={impact_status:string;change_type:string};
function Chart({option,label}:{option:EChartsOption;label:string}){
 const el=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!el.current)return;const chart=echarts.init(el.current,undefined,{renderer:"canvas"});chart.setOption(option);const resize=()=>chart.resize();const observer=new ResizeObserver(resize);observer.observe(el.current);return()=>{observer.disconnect();chart.dispose()}},[option]);
 return <div ref={el} role="img" aria-label={label} style={{height:230,width:"100%"}}/>;
}
export default function RegulatoryImpactCharts({changes}:{changes:Item[]}){
 const palette=useMemo(()=>{const s=getComputedStyle(document.documentElement);return {ink:s.getPropertyValue("--ink").trim()||"#243244",muted:s.getPropertyValue("--muted").trim()||"#708090",line:s.getPropertyValue("--line").trim()||"#dce2e8",accent:s.getPropertyValue("--accent").trim()||"#2563eb"}},[]);
 const statuses=useMemo(()=>{const names=["evidence_found","evidence_missing","conflict","needs_human_review"];const labels=["Evidence found","Evidence missing","Conflict","Human review"];return {names,labels,counts:names.map(n=>changes.filter(x=>x.impact_status===n).length)}},[changes]);
 const types=useMemo(()=>{const m=new Map<string,number>();changes.forEach(x=>m.set(x.change_type,(m.get(x.change_type)||0)+1));return [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8)},[changes]);
 const base={animation:false,grid:{left:105,right:25,top:16,bottom:22,containLabel:false},tooltip:{trigger:"axis" as const,axisPointer:{type:"shadow" as const}},xAxis:{type:"value" as const,minInterval:1,axisLabel:{color:palette.muted},splitLine:{lineStyle:{color:palette.line}}},yAxis:{type:"category" as const,axisTick:{show:false},axisLine:{show:false},axisLabel:{color:palette.muted,width:115,overflow:"truncate" as const}}};
 const statusOption:EChartsOption={...base,yAxis:{...base.yAxis,data:statuses.labels},series:[{type:"bar",data:statuses.counts,barMaxWidth:28,itemStyle:{color:palette.accent,borderRadius:[0,5,5,0]},label:{show:true,position:"right",color:palette.ink}}]};
 const typeOption:EChartsOption={...base,yAxis:{...base.yAxis,data:types.map(x=>x[0])},series:[{type:"bar",data:types.map(x=>x[1]),barMaxWidth:28,itemStyle:{color:"#259779",borderRadius:[0,5,5,0]},label:{show:true,position:"right",color:palette.ink}}]};
 return <section className="rd-analytics"><div className="rd-dashboard-heading"><div><span className="rd-kicker">IMPACT DASHBOARD</span><h2>Policy coverage across selected changes</h2></div><span>Counts reflect this live AI run only</span></div><div className="rd-chart-grid"><article className="rd-chart-card"><div><b>Evidence and gap status</b><small>One model-assessed outcome per candidate transition</small></div><Chart option={statusOption} label="Framework change count by evidence found, evidence missing, conflict, and human review"/></article><article className="rd-chart-card"><div><b>Crosswalk change types</b><small>NIST source classification for these candidates</small></div><Chart option={typeOption} label="Candidate NIST changes grouped by source change type"/></article></div><p className="rd-chart-note">A status is an AI-assisted mapping for consultant review, not a compliance rating. This relevance shortlist is not full framework recall.</p></section>
}
