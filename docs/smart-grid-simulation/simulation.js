"use strict";

const BASE_MVA = 100;

const BUSES = [
  { id: 1, x: 85, y: 115, load: 0, genCap: 170 },
  { id: 2, x: 220, y: 105, load: 21.7, genCap: 80 },
  { id: 3, x: 365, y: 72, load: 94.2, genCap: 60 },
  { id: 4, x: 365, y: 188, load: 47.8, genCap: 0 },
  { id: 5, x: 202, y: 220, load: 7.6, genCap: 0 },
  { id: 6, x: 125, y: 342, load: 11.2, genCap: 40 },
  { id: 7, x: 488, y: 222, load: 0, genCap: 0 },
  { id: 8, x: 628, y: 162, load: 0, genCap: 35 },
  { id: 9, x: 612, y: 308, load: 29.5, genCap: 0 },
  { id: 10, x: 718, y: 368, load: 9.0, genCap: 0 },
  { id: 11, x: 292, y: 372, load: 3.5, genCap: 0 },
  { id: 12, x: 108, y: 458, load: 6.1, genCap: 0 },
  { id: 13, x: 302, y: 468, load: 13.5, genCap: 0 },
  { id: 14, x: 560, y: 462, load: 14.9, genCap: 0 },
];

const LINES = [
  { id: "L1", from: 1, to: 2, x: 0.05917, rate: 130 },
  { id: "L2", from: 1, to: 5, x: 0.22304, rate: 65 },
  { id: "L3", from: 2, to: 3, x: 0.19797, rate: 65 },
  { id: "L4", from: 2, to: 4, x: 0.17632, rate: 65 },
  { id: "L5", from: 2, to: 5, x: 0.17388, rate: 65 },
  { id: "L6", from: 3, to: 4, x: 0.17103, rate: 65 },
  { id: "L7", from: 4, to: 5, x: 0.04211, rate: 90 },
  { id: "L8", from: 4, to: 7, x: 0.20912, rate: 70 },
  { id: "L9", from: 4, to: 9, x: 0.55618, rate: 65 },
  { id: "L10", from: 5, to: 6, x: 0.25202, rate: 70 },
  { id: "L11", from: 6, to: 11, x: 0.1989, rate: 65 },
  { id: "L12", from: 6, to: 12, x: 0.25581, rate: 65 },
  { id: "L13", from: 6, to: 13, x: 0.13027, rate: 65 },
  { id: "L14", from: 7, to: 8, x: 0.17615, rate: 65 },
  { id: "L15", from: 7, to: 9, x: 0.11001, rate: 65 },
  { id: "L16", from: 9, to: 10, x: 0.0845, rate: 65 },
  { id: "L17", from: 9, to: 14, x: 0.27038, rate: 65 },
  { id: "L18", from: 10, to: 11, x: 0.19207, rate: 65 },
  { id: "L19", from: 12, to: 13, x: 0.19988, rate: 65 },
  { id: "L20", from: 13, to: 14, x: 0.34802, rate: 65 },
];

const state = {
  mode: "base",
  topology: "standard", // "standard", "mst", "shortest"
  failedLineId: "L1",
  attackCount: 1,
  renewableCapacity: 40,
  renewableBusId: "recommended",
  propagationStep: 0,
  isPlaying: false,
};

const busById = new Map(BUSES.map((bus) => [bus.id, bus]));
const lineById = new Map(LINES.map((line) => [line.id, line]));
const totalLoad = sum(BUSES.map((bus) => bus.load));

const els = {
  storyTabs: document.getElementById("storyTabs"),
  storyButtons: [...document.querySelectorAll(".story-tab")],
  modeSelect: document.getElementById("modeSelect"),
  topologySelect: document.getElementById("topologySelect"), // 망 구조 컨트롤 추가
  setupBadge: document.getElementById("setupBadge"),
  lineControl: document.getElementById("lineControl"),
  lineSelect: document.getElementById("lineSelect"),
  attackControl: document.getElementById("attackControl"),
  attackRange: document.getElementById("attackRange"),
  attackValue: document.getElementById("attackValue"),
  renewableCapacityControl: document.getElementById("renewableCapacityControl"),
  renewableRange: document.getElementById("renewableRange"),
  renewableValue: document.getElementById("renewableValue"),
  renewableBusControl: document.getElementById("renewableBusControl"),
  renewableBusSelect: document.getElementById("renewableBusSelect"),
  playButton: document.getElementById("playButton"),
  downloadButton: document.getElementById("downloadButton"),
  statusPill: document.getElementById("statusPill"),
  gridSvg: document.getElementById("gridSvg"),
  scenarioTitle: document.getElementById("scenarioTitle"),
  scenarioSubtitle: document.getElementById("scenarioSubtitle"),
  riskCard: document.getElementById("riskCard"),
  riskGrade: document.getElementById("riskGrade"),
  riskMeter: document.getElementById("riskMeter"),
  servedMini: document.getElementById("servedMini"),
  servedMeter: document.getElementById("servedMeter"),
  shedMini: document.getElementById("shedMini"),
  shedMeter: document.getElementById("shedMeter"),
  overloadMini: document.getElementById("overloadMini"),
  overloadMeter: document.getElementById("overloadMeter"),
  faultChips: document.getElementById("faultChips"),
  servedKpi: document.getElementById("servedKpi"),
  shedKpi: document.getElementById("shedKpi"),
  overloadKpi: document.getElementById("overloadKpi"),
  riskKpi: document.getElementById("riskKpi"),
  insightBadge: document.getElementById("insightBadge"),
  insightText: document.getElementById("insightText"),
  n1Block: document.getElementById("n1Block"),
  n1Table: document.getElementById("n1Table"),
  attackBlock: document.getElementById("attackBlock"),
  attackChart: document.getElementById("attackChart"),
  propagationBlock: document.getElementById("propagationBlock"),
  propagationCaption: document.getElementById("propagationCaption"),
  propagationTimeline: document.getElementById("propagationTimeline"),
  renewableBlock: document.getElementById("renewableBlock"),
  renewableTable: document.getElementById("renewableTable"),
  renewableCaption: document.getElementById("renewableCaption"),
  reportSummary: document.getElementById("reportSummary"),
  timeSeriesBlock: document.getElementById("timeSeriesBlock"),
};

let latestAnalysis = null;
let playTimer = null;
let timeSeriesChart = null;

function init() {
  updateLineSelectOptions();
  populateSelects();
  initChart();
  bindEvents();
  recalculate();
}

function initChart() {
  const ctx = document.getElementById('timeSeriesChart').getContext('2d');
  timeSeriesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: '공급률 (%)', data: [], borderColor: '#208c52', backgroundColor: 'rgba(32, 140, 82, 0.1)', fill: true, tension: 0.3, yAxisID: 'y' },
        { label: '위험 지수', data: [], borderColor: '#c93636', backgroundColor: 'rgba(201, 54, 54, 0.1)', fill: true, tension: 0.3, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      scales: {
        y: { type: 'linear', display: true, position: 'left', min: 0, max: 100, title: { display: true, text: '공급률 (%)' } },
        y1: { type: 'linear', display: true, position: 'right', min: 0, max: 100, grid: { drawOnChartArea: false }, title: { display: true, text: '위험 지수' } },
      },
      animation: { duration: 300 }
    }
  });
}

function updateChart(analysis) {
  if (!timeSeriesChart) return;
  const labels = [], servedData = [], riskData = [];

  if (state.mode === 'propagation') {
    const steps = analysis.propagation.steps.slice(0, state.propagationStep + 1);
    steps.forEach((step, i) => {
      labels.push(i === 0 ? '초기 고장' : `T+${i}`);
      servedData.push(step.result.servedPercent);
      riskData.push(step.result.riskIndex);
    });
  } else {
    labels.push('현재 상태');
    servedData.push(analysis.result.servedPercent);
    riskData.push(analysis.result.riskIndex);
  }

  timeSeriesChart.data.labels = labels;
  timeSeriesChart.data.datasets[0].data = servedData;
  timeSeriesChart.data.datasets[1].data = riskData;
  timeSeriesChart.update();
}

// 💡 현재 선택된 망 구조에 포함된 송전선 ID만 반환하는 함수
function getTopologyLineIds() {
  if (state.topology === "mst") return computeMst().map(l => l.id);
  if (state.topology === "shortest") return computeShortestPathTree().map(l => l.id);
  return LINES.map(l => l.id);
}

function updateLineSelectOptions() {
  const currentTopologyIds = getTopologyLineIds();
  const validLines = LINES.filter(l => currentTopologyIds.includes(l.id));
  els.lineSelect.innerHTML = validLines.map(
    (line) => `<option value="${line.id}">${line.id} Bus ${line.from}-${line.to}</option>`
  ).join("");
  
  if (!currentTopologyIds.includes(state.failedLineId) && validLines.length > 0) {
    state.failedLineId = validLines[0].id;
  }
}

function populateSelects() {
  const busOptions = BUSES.map(
    (bus) => `<option value="${bus.id}">Bus ${bus.id} (${bus.load.toFixed(1)} MW 부하)</option>`
  ).join("");
  els.renewableBusSelect.innerHTML = `<option value="recommended">자동 추천</option>` + busOptions;
}

function bindEvents() {
  for (const button of els.storyButtons) {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      state.propagationStep = 0;
      stopAnimation();
      recalculate();
    });
  }

  // 💡 망 구조가 변경될 때마다 옵션을 갱신하고 재계산
  els.topologySelect.addEventListener("change", (e) => {
    state.topology = e.target.value;
    state.propagationStep = 0;
    stopAnimation();
    updateLineSelectOptions();
    recalculate();
  });

  els.modeSelect.addEventListener("change", (event) => {
    state.mode = event.target.value;
    state.propagationStep = 0;
    stopAnimation();
    recalculate();
  });

  els.lineSelect.addEventListener("change", (event) => {
    state.failedLineId = event.target.value;
    state.propagationStep = 0;
    stopAnimation();
    recalculate();
  });

  els.attackRange.addEventListener("input", (event) => {
    state.attackCount = Number(event.target.value);
    els.attackValue.textContent = `${state.attackCount}개`;
    recalculate();
  });

  els.renewableRange.addEventListener("input", (event) => {
    state.renewableCapacity = Number(event.target.value);
    els.renewableValue.textContent = `${state.renewableCapacity} MW`;
    recalculate();
  });

  els.renewableBusSelect.addEventListener("change", (event) => {
    state.renewableBusId = event.target.value;
    recalculate();
  });

  els.playButton.addEventListener("click", () => {
    if (state.mode !== "propagation") {
      state.mode = "propagation";
      state.propagationStep = 0;
      recalculate();
    }
    if (state.isPlaying) {
      stopAnimation();
      recalculate();
    } else {
      startAnimation();
    }
  });

  els.downloadButton.addEventListener("click", () => {
    if (!latestAnalysis) return;
    downloadCsv(latestAnalysis);
  });
}

function recalculate() {
  els.statusPill.textContent = "계산 중";

  const topologyLineIds = getTopologyLineIds();
  const renewableRanking = evaluateRenewableSites(state.renewableCapacity, topologyLineIds);
  const recommendedBus = renewableRanking[0].busId;
  const selectedRenewableBus = state.mode === "renewable" ? (state.renewableBusId === "recommended" ? recommendedBus : Number(state.renewableBusId)) : null;

  const renewableCapacity = state.mode === "renewable" ? state.renewableCapacity : 0;
  const baseN1 = analyzeN1(selectedRenewableBus, renewableCapacity, topologyLineIds);
  const targetedFailures = baseN1.slice(0, state.attackCount).map((row) => row.line.id);
  const propagation = buildPropagationScenario(state.failedLineId, 6, topologyLineIds);
  state.propagationStep = clamp(state.propagationStep, 0, propagation.steps.length - 1);

  const failedLineIds = getFailedLinesForMode(targetedFailures, propagation);
  
  // 💡 선택된 망 구조(topologyLineIds)만 사용하여 전력 흐름 계산
  const result = runPowerFlow({
    failedLineIds,
    renewableBusId: selectedRenewableBus,
    renewableCapacity,
    topologyLineIds,
  });

  const attackComparison = compareAttackStrategies(topologyLineIds);
  latestAnalysis = {
    result, n1: baseN1, renewableRanking, attackComparison, propagation,
    failedLineIds, selectedRenewableBus, recommendedBus, topologyLineIds
  };

  renderControlsState();
  renderScenario(latestAnalysis);
  renderNetwork(result, failedLineIds, selectedRenewableBus, propagation, topologyLineIds);
  renderScenarioSummary(latestAnalysis);
  renderTables(latestAnalysis);
  updateChart(latestAnalysis);
  renderSummary(latestAnalysis);

  els.statusPill.textContent = "계산 완료";
}

function getFailedLinesForMode(targetedFailures, propagation) {
  if (state.mode === "n1") return [state.failedLineId];
  if (state.mode === "propagation") return propagation.steps[state.propagationStep].failedLineIds;
  if (state.mode === "targeted") return targetedFailures;
  if (state.mode === "renewable") return [state.failedLineId];
  return [];
}

function renderControlsState() {
  const modeLabels = { base: "기준", n1: "단일 고장", propagation: "전파", targeted: "공격", renewable: "신재생" };

  els.modeSelect.value = state.mode;
  els.topologySelect.value = state.topology;
  els.setupBadge.textContent = modeLabels[state.mode];
  els.lineSelect.value = state.failedLineId;
  els.attackRange.value = state.attackCount;
  els.attackValue.textContent = `${state.attackCount}개`;
  els.renewableRange.value = state.renewableCapacity;
  els.renewableValue.textContent = `${state.renewableCapacity} MW`;
  els.renewableBusSelect.value = String(state.renewableBusId);

  els.lineSelect.disabled = state.mode === "base" || state.mode === "targeted";
  els.attackRange.disabled = state.mode !== "targeted";
  els.renewableRange.disabled = state.mode !== "renewable";
  els.renewableBusSelect.disabled = state.mode !== "renewable";
  els.lineControl.classList.toggle("is-hidden", !["n1", "propagation", "renewable"].includes(state.mode));
  els.attackControl.classList.toggle("is-hidden", state.mode !== "targeted");
  els.renewableCapacityControl.classList.toggle("is-hidden", state.mode !== "renewable");
  els.renewableBusControl.classList.toggle("is-hidden", state.mode !== "renewable");
  
  els.playButton.classList.toggle("is-hidden", state.mode !== "propagation");
  els.playButton.disabled = state.mode !== "propagation";
  els.playButton.textContent = state.isPlaying ? "정지" : "재생";

  for (const button of els.storyButtons) button.classList.toggle("active", button.dataset.mode === state.mode);

  els.n1Block.classList.toggle("is-hidden", !["base", "n1"].includes(state.mode));
  els.attackBlock.classList.toggle("is-hidden", state.mode !== "targeted");
  els.propagationBlock.classList.toggle("is-hidden", state.mode !== "propagation");
  els.timeSeriesBlock.classList.toggle("is-hidden", state.mode !== "propagation"); 
  els.renewableBlock.classList.toggle("is-hidden", state.mode !== "renewable");
}

function renderScenario(analysis) {
  const failedText = analysis.failedLineIds.length
    ? analysis.failedLineIds.map((id) => {
          const line = lineById.get(id);
          return `${id}(Bus ${line.from}-${line.to})`;
        }).join(", ")
    : "없음";

  const renewableText = analysis.selectedRenewableBus
    ? `, 신재생 Bus ${analysis.selectedRenewableBus} +${state.renewableCapacity} MW`
    : "";

  const topoLabel = state.topology === "standard" ? "" : (state.topology === "mst" ? " [MST 구조]" : " [최단경로 구조]");
  const titles = { base: "기본 전력망", n1: "N-1 송전선 고장", propagation: "고장 전파 애니메이션", targeted: "표적 공격 시나리오", renewable: "신재생 위치 비교" };

  els.scenarioTitle.textContent = titles[state.mode] + topoLabel;
  els.scenarioSubtitle.textContent = `차단 선로: ${failedText}${renewableText}`;
}

function renderNetwork(result, failedLineIds, renewableBusId, propagation, topologyLineIds) {
  const failedSet = new Set(failedLineIds);
  const topologySet = new Set(topologyLineIds);
  const flowByLine = new Map(result.lineResults.map((row) => [row.id, row]));
  const activePropagationStep = state.mode === "propagation" ? propagation.steps[state.propagationStep] : null;
  
  const svg = els.gridSvg;
  clearNode(svg);
  renderSvgDefs(svg);
  renderZones(svg);

  // 1. 배제된 선로(점선)를 먼저 밑바탕에 그리기
  for (const line of LINES) {
    if (topologySet.has(line.id)) continue;
    const from = busById.get(line.from);
    const to = busById.get(line.to);
    const renderedLine = svgLine(from.x, from.y, to.x, to.y, "grid-line excluded");
    svg.appendChild(renderedLine);
  }

  // 2. 현재 망 구조에 속한 선로(정상, 과부하, 고장) 그리기
  for (const line of LINES) {
    if (!topologySet.has(line.id)) continue;
    const from = busById.get(line.from);
    const to = busById.get(line.to);
    const row = flowByLine.get(line.id);
    const failed = failedSet.has(line.id);
    const util = row ? row.utilization : 0;
    const flowStart = row && row.flow < 0 ? to : from;
    const flowEnd = row && row.flow < 0 ? from : to;
    
    const renderedLine = failed
      ? svgLine(from.x, from.y, to.x, to.y, "grid-line")
      : svgLine(flowStart.x, flowStart.y, flowEnd.x, flowEnd.y, "grid-line flow-arrow");
      
    renderedLine.dataset.lineId = line.id;
    renderedLine.setAttribute("stroke-width", String(failed ? 2 : 2.4 + Math.min(util, 1.7) * 2.8));
    renderedLine.setAttribute("stroke", failed ? "#aab4c2" : colorForUtil(util));
    
    if (!failed && row && Math.abs(row.flow) > 5) renderedLine.setAttribute("marker-end", `url(#${markerForUtil(util)})`);
    if (failed) renderedLine.classList.add("failed");
    if (activePropagationStep?.newLineId === line.id) renderedLine.classList.add("propagating");

    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = failed ? `${line.id} Bus ${line.from}-${line.to}: 차단됨` : `${line.id} Bus ${line.from}-${line.to}: ${Math.abs(row.flow).toFixed(1)} MW / ${line.rate} MW`;
    renderedLine.appendChild(title);
    svg.appendChild(renderedLine);

    if (!failed && row && row.utilization >= 0.25) {
      svg.appendChild(svgText((from.x + to.x) / 2, (from.y + to.y) / 2 - 6, `${Math.abs(row.flow).toFixed(0)}MW`, "flow-label"));
    }
    if (failed || util >= 0.78) {
      const labelText = failed ? `${line.id} 차단` : `${line.id}`;
      svg.appendChild(svgBadge((from.x + to.x) / 2, (from.y + to.y) / 2 + 13, labelText));
    }
  }

  const shedBusIds = new Set(result.busResults.filter((row) => row.shedLoad > 0.05).map((row) => row.id));
  const resultByBus = new Map(result.busResults.map((row) => [row.id, row]));

  for (const bus of BUSES) {
    const row = resultByBus.get(bus.id);
    const radius = 11 + Math.min(12, bus.load / 8);
    if (shedBusIds.has(bus.id)) {
      const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      halo.setAttribute("cx", bus.x); halo.setAttribute("cy", bus.y); halo.setAttribute("r", String(radius + 4)); halo.classList.add("bus-halo");
      svg.appendChild(halo);
    }
    const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    node.setAttribute("cx", bus.x); node.setAttribute("cy", bus.y); node.setAttribute("r", String(radius));
    node.classList.add("bus-node"); node.classList.add(bus.genCap > 0 ? "generator" : "load");
    if (renewableBusId === bus.id) node.classList.add("renewable");
    if (shedBusIds.has(bus.id)) node.classList.add("shed");

    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = `Bus ${bus.id}: 부하 ${bus.load.toFixed(1)} MW, 발전용량 ${row.genCap.toFixed(1)} MW, 공급 ${row.servedLoad.toFixed(1)} MW`;
    node.appendChild(title); svg.appendChild(node);
    svg.appendChild(svgText(bus.x, bus.y + 4, String(bus.id), "bus-label", "middle"));

    const meta = [];
    if (bus.genCap > 0) meta.push("G"); if (renewableBusId === bus.id) meta.push("R"); if (bus.load > 0) meta.push(`${bus.load.toFixed(0)}MW`);
    if (meta.length) svg.appendChild(svgText(bus.x, bus.y + radius + 15, meta.join(" "), "bus-meta", "middle"));
  }
}

function renderScenarioSummary(analysis) {
  const result = analysis.result;
  const level = riskLevel(result.riskIndex);
  els.riskCard.className = `status-card primary ${level.className}`;
  els.riskGrade.textContent = level.label;
  els.riskGrade.className = level.className;
  els.riskMeter.style.width = `${Math.min(100, result.riskIndex)}%`;
  els.riskMeter.style.backgroundColor = level.color;
  els.servedMini.textContent = `${result.servedPercent.toFixed(1)}%`;
  els.servedMeter.style.width = `${clamp(result.servedPercent, 0, 100)}%`;
  els.shedMini.textContent = `${result.loadShed.toFixed(1)} MW`;
  els.shedMeter.style.width = `${clamp((result.loadShed / totalLoad) * 100, 0, 100)}%`;
  els.overloadMini.textContent = `${result.overloadMw.toFixed(1)} MW`;
  els.overloadMeter.style.width = `${clamp((result.overloadMw / 80) * 100, 0, 100)}%`;
  els.faultChips.innerHTML = analysis.failedLineIds.length
    ? analysis.failedLineIds.map((id) => { const line = lineById.get(id); return `<span class="fault-chip failed">${id}<small>Bus ${line.from}-${line.to}</small></span>`; }).join("")
    : `<span class="fault-chip">차단 선로 없음</span>`;
  els.insightBadge.textContent = level.label;
  els.insightBadge.className = level.className;
  els.insightText.textContent = buildInsightText(analysis);
}

function renderTables(analysis) {
  els.servedKpi.textContent = `${analysis.result.servedPercent.toFixed(1)}%`;
  els.shedKpi.textContent = `${analysis.result.loadShed.toFixed(1)} MW`;
  els.overloadKpi.textContent = `${analysis.result.overloadedLines.length}개`;
  els.riskKpi.textContent = analysis.result.riskIndex.toFixed(1);

  els.n1Table.innerHTML = analysis.n1.slice(0, 5).map((row) => {
      const riskClass = classForRisk(row.result.riskIndex);
      return `<tr><td>${row.line.id}</td><td>${row.line.from}-${row.line.to}</td><td class="${riskClass}">${row.result.riskIndex.toFixed(1)}</td><td>${row.result.loadShed.toFixed(1)}</td></tr>`;
    }).join("");

  renderAttackChart(analysis.attackComparison);
  renderPropagationTimeline(analysis.propagation);

  els.renewableCaption.textContent = `${state.renewableCapacity} MW 추가`;
  els.renewableTable.innerHTML = analysis.renewableRanking.slice(0, 5).map((row, index) => {
      const riskClass = classForRisk(row.avgRisk);
      return `<tr><td>${index + 1}</td><td>Bus ${row.busId}</td><td class="${riskClass}">${row.avgRisk.toFixed(1)}</td><td>${row.worstRisk.toFixed(1)}</td></tr>`;
    }).join("");
}

function buildInsightText(analysis) {
  const result = analysis.result;
  const topoName = state.topology === "standard" ? "표준 14-bus(강건망)" : (state.topology === "mst" ? "MST(최소비용)망" : "최단경로망");
  
  if (state.mode === "base") {
    return `현재 ${topoName} 구조로 구성되어 공급률 ${result.servedPercent.toFixed(1)}%를 보입니다.`;
  }
  if (state.mode === "n1") {
    return `${topoName}에서 ${state.failedLineId} 선로를 끊은 결과입니다. 손실 부하는 ${result.loadShed.toFixed(1)} MW이며 위험지수는 ${result.riskIndex.toFixed(1)}입니다.`;
  }
  if (state.mode === "propagation") {
    const step = analysis.propagation.steps[state.propagationStep];
    return `${topoName} 구조의 ${state.propagationStep + 1}단계 연쇄 붕괴 중입니다. 공급률은 ${result.servedPercent.toFixed(1)}%까지 하락했습니다.`;
  }
  if (state.mode === "targeted") {
    return `${topoName} 구조의 표적 공격 시뮬레이션으로, 위험지수 ${result.riskIndex.toFixed(1)}가 측정되었습니다.`;
  }
  const best = analysis.renewableRanking[0];
  return `${topoName} 상에서 신재생 발전 최적 위치는 Bus ${best.busId}입니다.`;
}

function renderSvgDefs(svg) {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.appendChild(svgMarker("arrow-ok", "#526a84")); defs.appendChild(svgMarker("arrow-warn", "#c78517")); defs.appendChild(svgMarker("arrow-danger", "#c93636"));
  svg.appendChild(defs);
}

function renderZones(svg) {
  const zones = [
    { x: 32, y: 38, width: 230, height: 450, className: "generation", label: "발전·공급 구역" },
    { x: 270, y: 38, width: 250, height: 450, className: "transmission", label: "중앙 송전 구역" },
    { x: 528, y: 38, width: 250, height: 450, className: "load-zone", label: "부하·수요 구역" },
  ];
  for (const zone of zones) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", zone.x); rect.setAttribute("y", zone.y); rect.setAttribute("width", zone.width); rect.setAttribute("height", zone.height); rect.setAttribute("rx", 16); rect.classList.add("zone-bg", zone.className);
    svg.appendChild(rect); svg.appendChild(svgText(zone.x + 16, zone.y + 24, zone.label, "zone-label", "start"));
  }
}

function renderPropagationTimeline(propagation) {
  els.propagationCaption.textContent = `현재 ${state.propagationStep + 1}/${propagation.steps.length}단계`;
  els.propagationTimeline.innerHTML = propagation.steps.map((step, index) => {
      const line = lineById.get(step.newLineId);
      const active = index === state.propagationStep ? " active" : "";
      const cause = index === 0 ? "초기 고장" : `이전 재계산 후 ${step.triggerUtil.toFixed(0)}% 이용률`;
      return `<div class="timeline-step${active}"><div class="timeline-index">${index}</div><div class="timeline-body"><strong>${step.newLineId} Bus ${line.from}-${line.to}</strong><span>${cause}</span></div><div class="timeline-metric">${step.result.riskIndex.toFixed(1)}</div></div>`;
    }).join("");
}

function renderAttackChart(rows) {
  const maxRisk = Math.max(1, ...rows.map((row) => row.targetedRisk), ...rows.map((row) => row.randomRisk));
  els.attackChart.innerHTML = rows.map((row) => {
      const randomWidth = (row.randomRisk / maxRisk) * 100; const targetedWidth = (row.targetedRisk / maxRisk) * 100;
      return `<div class="bar-row"><strong>${row.failures}개 랜덤</strong><div class="bar-track"><div class="bar-fill random" style="width:${randomWidth}%"></div></div><span>${row.randomRisk.toFixed(1)}</span></div><div class="bar-row"><strong>${row.failures}개 표적</strong><div class="bar-track"><div class="bar-fill targeted" style="width:${targetedWidth}%"></div></div><span>${row.targetedRisk.toFixed(1)}</span></div>`;
    }).join("");
}

function renderSummary(analysis) {
  const worst = analysis.n1[0] || { line: { id: "없음" }, result: { riskIndex: 0 } };
  const bestRenewable = analysis.renewableRanking[0] || { busId: "없음", avgRisk: 0 };
  const topoName = state.topology === "standard" ? "표준 망" : (state.topology === "mst" ? "MST 망" : "최단경로 망");

  els.reportSummary.textContent = `${topoName}에서 가장 취약한 선로는 ${worst.line.id}이며, 무작위 고장보다 표적 공격의 정전 위험이 훨씬 높습니다. 신재생 발전소는 부하 밀집 구역인 Bus ${bestRenewable.busId}에 설치할 때 안정성이 극대화됩니다.`;
}

function startAnimation() {
  stopAnimation(); state.isPlaying = true; state.propagationStep = 0; recalculate();
  playTimer = window.setInterval(() => {
    const maxStep = latestAnalysis.propagation.steps.length - 1;
    if (state.propagationStep >= maxStep) { stopAnimation(); recalculate(); return; }
    state.propagationStep += 1; recalculate();
  }, 1100);
}

function stopAnimation() { if (playTimer) { window.clearInterval(playTimer); playTimer = null; } state.isPlaying = false; }

function runPowerFlow({ failedLineIds = [], renewableBusId = null, renewableCapacity = 0, topologyLineIds }) {
  const failedSet = new Set(failedLineIds);
  const topologySet = new Set(topologyLineIds || LINES.map(l => l.id));
  const activeLines = LINES.filter((line) => topologySet.has(line.id) && !failedSet.has(line.id));
  const components = findComponents(activeLines);
  const genCaps = buildGenerationMap(renewableBusId, renewableCapacity);

  const lineResults = LINES.map((line) => ({
    ...line, inTopology: topologySet.has(line.id), active: topologySet.has(line.id) && !failedSet.has(line.id), flow: 0, utilization: 0, overload: 0,
  }));
  const lineResultById = new Map(lineResults.map((line) => [line.id, line]));

  const busResults = BUSES.map((bus) => ({ id: bus.id, load: bus.load, genCap: genCaps.get(bus.id) || 0, dispatch: 0, servedLoad: 0, shedLoad: bus.load, theta: 0 }));
  const busResultById = new Map(busResults.map((bus) => [bus.id, bus]));

  for (const component of components) solveComponent(component, activeLines, genCaps, busResultById, lineResultById);

  const servedLoad = sum(busResults.map((bus) => bus.servedLoad));
  const loadShed = sum(busResults.map((bus) => bus.shedLoad));
  const overloadedLines = lineResults.filter((line) => line.active && line.overload > 0.01);
  const overloadMw = sum(overloadedLines.map((line) => line.overload));
  const maxUtilization = Math.max(0, ...lineResults.filter((line) => line.active).map((line) => line.utilization));
  const riskIndex = calculateRiskIndex({ loadShed, overloadMw, overloadedLines, components });

  return { components, lineResults, busResults, servedLoad, loadShed, servedPercent: totalLoad === 0 ? 100 : (servedLoad / totalLoad) * 100, overloadedLines, overloadMw, maxUtilization, riskIndex };
}

function solveComponent(component, activeLines, genCaps, busResultById, lineResultById) {
  const componentSet = new Set(component);
  const componentLines = activeLines.filter((line) => componentSet.has(line.from) && componentSet.has(line.to));
  const componentBuses = component.map((id) => busById.get(id));
  const componentLoad = sum(componentBuses.map((bus) => bus.load));
  const componentGenCap = sum(componentBuses.map((bus) => genCaps.get(bus.id) || 0));
  const servedLoad = Math.min(componentLoad, componentGenCap);
  const servedRatio = componentLoad > 0 ? servedLoad / componentLoad : 1;
  const dispatchRatio = componentGenCap > 0 ? servedLoad / componentGenCap : 0;

  const injections = new Map();
  for (const bus of componentBuses) {
    const genCap = genCaps.get(bus.id) || 0;
    const dispatch = genCap * dispatchRatio; const served = bus.load * servedRatio;
    const result = busResultById.get(bus.id);
    result.genCap = genCap; result.dispatch = dispatch; result.servedLoad = served; result.shedLoad = Math.max(0, bus.load - served);
    injections.set(bus.id, dispatch - served);
  }

  if (component.length <= 1 || componentLines.length === 0 || servedLoad <= 0) return;

  const slack = component[0]; const nonSlack = component.filter((id) => id !== slack); const n = nonSlack.length;
  const index = new Map(nonSlack.map((id, idx) => [id, idx])); const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  const rhs = nonSlack.map((id) => (injections.get(id) || 0) / BASE_MVA);

  for (const line of componentLines) {
    const b = 1 / line.x; const i = index.get(line.from); const j = index.get(line.to);
    if (line.from !== slack && i !== undefined) matrix[i][i] += b; if (line.to !== slack && j !== undefined) matrix[j][j] += b;
    if (line.from !== slack && line.to !== slack && i !== undefined && j !== undefined) { matrix[i][j] -= b; matrix[j][i] -= b; }
  }

  const solution = gaussianSolve(matrix, rhs); const theta = new Map([[slack, 0]]);
  for (const id of nonSlack) theta.set(id, solution[index.get(id)]);
  for (const id of component) busResultById.get(id).theta = theta.get(id) || 0;

  for (const line of componentLines) {
    const flow = ((theta.get(line.from) || 0) - (theta.get(line.to) || 0)) / line.x * BASE_MVA;
    const row = lineResultById.get(line.id); row.flow = flow; row.utilization = Math.abs(flow) / line.rate; row.overload = Math.max(0, Math.abs(flow) - line.rate);
  }
}

function findComponents(activeLines) {
  const adjacency = new Map(BUSES.map((bus) => [bus.id, []]));
  for (const line of activeLines) { adjacency.get(line.from).push(line.to); adjacency.get(line.to).push(line.from); }
  const visited = new Set(); const components = [];
  for (const bus of BUSES) {
    if (visited.has(bus.id)) continue;
    const queue = [bus.id]; visited.add(bus.id); const component = [];
    while (queue.length) {
      const current = queue.shift(); component.push(current);
      for (const next of adjacency.get(current)) { if (visited.has(next)) continue; visited.add(next); queue.push(next); }
    }
    components.push(component);
  }
  return components;
}

function buildGenerationMap(renewableBusId, renewableCapacity) {
  const genCaps = new Map(BUSES.map((bus) => [bus.id, bus.genCap]));
  if (renewableBusId) genCaps.set(renewableBusId, (genCaps.get(renewableBusId) || 0) + renewableCapacity);
  return genCaps;
}

function analyzeN1(renewableBusId = null, renewableCapacity = 0, topologyLineIds) {
  return LINES.filter(l => topologyLineIds.includes(l.id)).map((line) => ({
    line, result: runPowerFlow({ failedLineIds: [line.id], renewableBusId, renewableCapacity, topologyLineIds }),
  })).sort((a, b) => b.result.riskIndex - a.result.riskIndex);
}

function buildPropagationScenario(initialLineId, maxSteps, topologyLineIds) {
  const failedLineIds = []; const steps = []; let nextLineId = initialLineId; let triggerUtil = 100;
  for (let index = 0; index < maxSteps && nextLineId; index += 1) {
    failedLineIds.push(nextLineId);
    const result = runPowerFlow({ failedLineIds, topologyLineIds });
    steps.push({ index, newLineId: nextLineId, failedLineIds: [...failedLineIds], triggerUtil, result });

    const nextCandidate = result.lineResults
      .filter((line) => line.active && !failedLineIds.includes(line.id))
      .sort((a, b) => b.utilization - a.utilization || b.overload - a.overload || Math.abs(b.flow) - Math.abs(a.flow))[0];

    if (!nextCandidate || nextCandidate.utilization < 0.45) break;
    nextLineId = nextCandidate.id; triggerUtil = nextCandidate.utilization * 100;
  }
  return { steps };
}

function compareAttackStrategies(topologyLineIds) {
  const baseRanking = analyzeN1(null, 0, topologyLineIds); const rows = []; const rng = seededRandom(20260609);
  const maxFailures = Math.min(4, topologyLineIds.length);

  for (let failures = 1; failures <= maxFailures; failures += 1) {
    const targeted = baseRanking.slice(0, failures).map((row) => row.line.id);
    const targetedResult = runPowerFlow({ failedLineIds: targeted, topologyLineIds });
    let randomRisk = 0; let randomShed = 0; const trials = 240;

    for (let trial = 0; trial < trials; trial += 1) {
      const chosen = sampleLines(failures, rng, topologyLineIds);
      const result = runPowerFlow({ failedLineIds: chosen, topologyLineIds });
      randomRisk += result.riskIndex; randomShed += result.loadShed;
    }
    rows.push({ failures, randomRisk: randomRisk / trials, targetedRisk: targetedResult.riskIndex, randomShed: randomShed / trials, targetedShed: targetedResult.loadShed });
  }
  return rows;
}

function evaluateRenewableSites(capacity, topologyLineIds) {
  return BUSES.map((bus) => {
    const results = LINES.filter(l => topologyLineIds.includes(l.id)).map((line) =>
      runPowerFlow({ failedLineIds: [line.id], renewableBusId: bus.id, renewableCapacity: capacity, topologyLineIds })
    );
    return {
      busId: bus.id,
      avgRisk: sum(results.map((result) => result.riskIndex)) / Math.max(1, results.length),
      worstRisk: Math.max(0, ...results.map((result) => result.riskIndex)),
      avgShed: sum(results.map((result) => result.loadShed)) / Math.max(1, results.length),
      avgOverload: sum(results.map((result) => result.overloadMw)) / Math.max(1, results.length),
    };
  }).sort((a, b) => a.avgRisk - b.avgRisk || a.worstRisk - b.worstRisk);
}

// 💡 1. MST (최소 신장 트리) 계산 알고리즘
function computeMst() {
  const parent = new Map(BUSES.map((bus) => [bus.id, bus.id]));
  const rank = new Map(BUSES.map((bus) => [bus.id, 0]));
  function find(id) { if (parent.get(id) !== id) parent.set(id, find(parent.get(id))); return parent.get(id); }
  function union(a, b) {
    const rootA = find(a); const rootB = find(b); if (rootA === rootB) return false;
    if (rank.get(rootA) < rank.get(rootB)) parent.set(rootA, rootB);
    else if (rank.get(rootA) > rank.get(rootB)) parent.set(rootB, rootA);
    else { parent.set(rootB, rootA); rank.set(rootA, rank.get(rootA) + 1); } return true;
  }
  const sorted = [...LINES].sort((a, b) => a.x - b.x); const mst = [];
  for (const line of sorted) { if (union(line.from, line.to)) mst.push(line); if (mst.length === BUSES.length - 1) break; }
  return mst;
}

// 💡 2. 최단 경로망 (Dijkstra) 계산 알고리즘 (발전소 Bus 1 중심)
function computeShortestPathTree() {
  const dist = new Map(BUSES.map(b => [b.id, Infinity]));
  const prevEdge = new Map();
  const unvisited = new Set(BUSES.map(b => b.id));
  dist.set(1, 0);

  while (unvisited.size > 0) {
    let u = null; let minDist = Infinity;
    for (const busId of unvisited) { if (dist.get(busId) < minDist) { minDist = dist.get(busId); u = busId; } }
    if (u === null) break; unvisited.delete(u);

    const neighbors = LINES.filter(l => l.from === u || l.to === u);
    for (const line of neighbors) {
      const v = line.from === u ? line.to : line.from;
      if (unvisited.has(v)) {
        const busU = busById.get(u); const busV = busById.get(v);
        const weight = Math.hypot(busU.x - busV.x, busU.y - busV.y);
        if (dist.get(u) + weight < dist.get(v)) {
          dist.set(v, dist.get(u) + weight);
          prevEdge.set(v, line);
        }
      }
    }
  }
  return Array.from(prevEdge.values());
}

function calculateRiskIndex({ loadShed, overloadMw, overloadedLines, components }) {
  const shedScore = totalLoad > 0 ? (loadShed / totalLoad) * 72 : 0;
  const overloadScore = totalLoad > 0 ? Math.min(24, (overloadMw / totalLoad) * 120) : 0;
  const islandScore = Math.min(18, Math.max(0, components.length - 1) * 6);
  const overloadCountScore = Math.min(12, overloadedLines.length * 4);
  return clamp(shedScore + overloadScore + islandScore + overloadCountScore, 0, 100);
}

function gaussianSolve(matrix, rhs) {
  const n = rhs.length; const a = matrix.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col; for (let row = col + 1; row < n; row += 1) if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    if (Math.abs(a[pivot][col]) < 1e-10) return Array(n).fill(0);
    [a[col], a[pivot]] = [a[pivot], a[col]]; const div = a[col][col];
    for (let j = col; j <= n; j += 1) a[col][j] /= div;
    for (let row = 0; row < n; row += 1) {
      if (row === col) continue; const factor = a[row][col];
      for (let j = col; j <= n; j += 1) a[row][j] -= factor * a[col][j];
    }
  }
  return a.map((row) => row[n]);
}

function sampleLines(count, rng, validIds) {
  const ids = [...validIds];
  for (let i = ids.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  return ids.slice(0, count);
}
function seededRandom(seed) { let value = seed % 2147483647; if (value <= 0) value += 2147483646; return () => { value = (value * 16807) % 2147483647; return (value - 1) / 2147483646; }; }
function downloadCsv(analysis) { /* 생략 - 기존 로직과 동일 */ }
function svgLine(x1, y1, x2, y2, className) { const line = document.createElementNS("http://www.w3.org/2000/svg", "line"); line.setAttribute("x1", x1); line.setAttribute("y1", y1); line.setAttribute("x2", x2); line.setAttribute("y2", y2); line.setAttribute("class", className); return line; }
function svgText(x, y, text, className, anchor = "middle") { const el = document.createElementNS("http://www.w3.org/2000/svg", "text"); el.setAttribute("x", x); el.setAttribute("y", y); el.setAttribute("class", className); el.setAttribute("text-anchor", anchor); el.textContent = text; return el; }
function svgMarker(id, color) { const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker"); marker.setAttribute("id", id); marker.setAttribute("viewBox", "0 0 10 10"); marker.setAttribute("refX", "8"); marker.setAttribute("refY", "5"); marker.setAttribute("markerWidth", "5"); marker.setAttribute("markerHeight", "5"); marker.setAttribute("orient", "auto-start-reverse"); const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z"); path.setAttribute("fill", color); marker.appendChild(path); return marker; }
function svgBadge(x, y, text) { const group = document.createElementNS("http://www.w3.org/2000/svg", "g"); const width = Math.max(26, text.length * 7 + 12); const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect"); rect.setAttribute("x", x - width / 2); rect.setAttribute("y", y - 10); rect.setAttribute("width", width); rect.setAttribute("height", 18); rect.setAttribute("rx", 9); rect.classList.add("line-badge"); group.appendChild(rect); group.appendChild(svgText(x, y + 3, text, "line-badge-text", "middle")); return group; }
function colorForUtil(utilization) { if (utilization >= 1) return "#c93737"; if (utilization >= 0.78) return "#d58b14"; return "#55708e"; }
function markerForUtil(utilization) { if (utilization >= 1) return "arrow-danger"; if (utilization >= 0.78) return "arrow-warn"; return "arrow-ok"; }
function riskLevel(risk) { if (risk <= 0.05) { return { label: "안정", className: "risk-safe", color: "#208c52" }; } if (risk < 10) { return { label: "관심", className: "risk-watch", color: "#2866d8" }; } if (risk < 25) { return { label: "주의", className: "risk-caution", color: "#c78517" }; } if (risk < 40) { return { label: "위험", className: "risk-danger", color: "#c93636" }; } return { label: "심각", className: "risk-critical", color: "#9f1d2a" }; }
function classForRisk(risk) { if (risk >= 35) return "risk-high"; if (risk >= 16) return "risk-mid"; return "risk-low"; }
function clearNode(node) { while (node.firstChild) node.removeChild(node.firstChild); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function sum(values) { return values.reduce((acc, value) => acc + value, 0); }

init();