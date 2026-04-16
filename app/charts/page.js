"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Chart from "chart.js/auto";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  getChartData,
  sampleData,
  isNumeric,
  autoSelectColumns,
} from "@/Utils/Data";

const chartTypes = [
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "bubble", label: "Bubble" },
  { value: "doughnut", label: "Doughnut" },
  { value: "pie", label: "Pie" },
  { value: "polarArea", label: "Polar Area" },
  { value: "radar", label: "Radar" },
  { value: "scatter", label: "Scatter" },
];

const ROWS_PER_PAGE_OPTIONS = [25, 50, 100, 500];

export default function Charts() {
  const [type, setType] = useState("bar");
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [labelColumn, setLabelColumn] = useState("");
  const [dataColumns, setDataColumns] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const { columns: cols, rows: sampleRows } = sampleData;
    const { labelCol, dataCols } = autoSelectColumns(cols, sampleRows);
    setColumns(cols);
    setRows(sampleRows);
    setLabelColumn(labelCol);
    setDataColumns(dataCols);
    generateChart("bar", sampleRows, labelCol, dataCols);
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  // -- Data processing --

  const processRawData = (rawData, typeParam) => {
    const headers = rawData[0]
      .map((h) => String(h).trim())
      .filter(Boolean);
    const dataRows = rawData
      .slice(1)
      .filter((row) => row.some((cell) => cell !== "" && cell != null))
      .map((row) => {
        const obj = {};
        headers.forEach((h, i) => {
          const val = row[i];
          obj[h] = isNumeric(val) ? Number(val) : val ?? "";
        });
        return obj;
      });

    setColumns(headers);
    setRows(dataRows);
    setCurrentPage(1);

    const { labelCol, dataCols } = autoSelectColumns(headers, dataRows);
    setLabelColumn(labelCol);
    setDataColumns(dataCols);
    generateChart(typeParam, dataRows, labelCol, dataCols);
  };

  const parseFile = (fileParam, typeParam) => {
    if (!fileParam) fileParam = file;
    if (!typeParam) typeParam = type;
    if (!fileParam) return;

    const ext = fileParam.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      Papa.parse(fileParam, {
        complete: (results) => processRawData(results.data, typeParam),
      });
    } else if (["xlsx", "xls"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
        processRawData(rawData, typeParam);
      };
      reader.readAsArrayBuffer(fileParam);
    }
  };

  // -- Chart generation --

  const generateChart = (chartType, data, labelCol, dataCols) => {
    if (chartRef.current) chartRef.current.destroy();
    if (!chartType) chartType = type;
    if (!data) data = rows;
    if (!labelCol) labelCol = labelColumn;
    if (!dataCols) dataCols = dataColumns;
    if (!data.length || !dataCols.length || !canvasRef.current) return;

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: true, position: "top" },
      },
    };

    if (chartType === "bar" || chartType === "line") {
      const allValues = dataCols.flatMap((col) =>
        data.map((row) => Number(row[col]) || 0),
      );
      const largestValue = Math.max(...allValues);
      let stepSize = 10;
      if (largestValue <= 50) stepSize = 10;
      else if (largestValue <= 260) stepSize = 20;
      else if (largestValue <= 500) stepSize = 50;
      else stepSize = 100;
      options.scales = { y: { ticks: { stepSize } } };
    }

    if (chartType === "polarArea") {
      options.scales = {
        r: {
          pointLabels: {
            display: true,
            centerPointLabels: true,
            font: { size: 14 },
          },
        },
      };
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: chartType,
      data: getChartData({
        type: chartType,
        data,
        labelColumn: labelCol,
        dataColumns: dataCols,
      }),
      options,
    });
  };

  // -- Handlers --

  const handleOnFileUpload = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;
    setFile(uploaded);
    parseFile(uploaded, type);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    generateChart(newType, rows, labelColumn, dataColumns);
  };

  const handleLabelColumnChange = (newLabel) => {
    setLabelColumn(newLabel);
    let newDataCols = dataColumns.filter((c) => c !== newLabel);
    if (newDataCols.length === 0) {
      const old = labelColumn;
      if (old && old !== newLabel) newDataCols = [old];
      else newDataCols = columns.filter((c) => c !== newLabel).slice(0, 1);
    }
    setDataColumns(newDataCols);
    generateChart(type, rows, newLabel, newDataCols);
  };

  const toggleDataColumn = (col) => {
    const isSelected = dataColumns.includes(col);
    if (isSelected && dataColumns.length === 1) return;
    const newDataCols = isSelected
      ? dataColumns.filter((c) => c !== col)
      : [...dataColumns, col];
    setDataColumns(newDataCols);
    generateChart(type, rows, labelColumn, newDataCols);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const chartCanvas = canvasRef.current;
    const showWatermark = process.env.NEXT_PUBLIC_WATERMARK === "true";

    let dataUrl;
    if (showWatermark) {
      const watermarkH = 32;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = chartCanvas.width;
      exportCanvas.height = chartCanvas.height + watermarkH;
      const ctx = exportCanvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      ctx.drawImage(chartCanvas, 0, 0);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "Generated using OpnChart",
        exportCanvas.width - 14,
        chartCanvas.height + watermarkH / 2,
      );
      dataUrl = exportCanvas.toDataURL("image/png");
    } else {
      dataUrl = chartCanvas.toDataURL("image/png");
    }

    const link = document.createElement("a");
    link.download = `opnchart-${type}-chart.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      parseFile(droppedFile, type);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    const { columns: cols, rows: sampleRows } = sampleData;
    const { labelCol, dataCols } = autoSelectColumns(cols, sampleRows);
    setColumns(cols);
    setRows(sampleRows);
    setLabelColumn(labelCol);
    setDataColumns(dataCols);
    setCurrentPage(1);
    generateChart(type, sampleRows, labelCol, dataCols);
  };

  // -- Pagination --

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const showPagination = rows.length > ROWS_PER_PAGE_OPTIONS[0];

  const handleRowsPerPageChange = (val) => {
    setRowsPerPage(val);
    setCurrentPage(1);
  };

  // -- Render --

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <Link href="/" className="text-sm font-bold tracking-tight hover:text-primary transition-colors">
        OpnChart
      </Link>

      {/* Controls */}
      <div className="rounded-xl bg-base-200 border border-base-300 p-4 sm:p-6">
        {/* Row 1: Type, Upload, Actions */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
          <div className="w-full lg:w-52 shrink-0">
            <label className="text-xs font-medium text-neutral-content uppercase tracking-wider mb-1.5 block">
              Chart Type
            </label>
            <select
              className="select select-bordered w-full bg-base-100 h-11"
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              {chartTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium text-neutral-content uppercase tracking-wider mb-1.5 block">
              Data File
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg h-11 flex items-center justify-center cursor-pointer transition-all
                ${isDragging ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary/40"}
                ${file ? "border-accent/50 bg-accent/5" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input").click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleOnFileUpload}
              />
              {file ? (
                <div className="flex items-center gap-2 text-sm px-3">
                  <svg
                    className="w-4 h-4 text-accent shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-accent font-medium truncate max-w-xs">
                    {file.name}
                  </span>
                  <button
                    className="ml-1 text-neutral-content hover:text-base-content transition-colors"
                    onClick={clearFile}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-neutral-content text-sm">
                  Drop CSV or Excel file here, or{" "}
                  <span className="text-primary font-medium">browse</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              className="btn btn-primary h-11 min-h-0 px-6"
              disabled={!file}
              onClick={() => parseFile()}
            >
              Generate
            </button>
            <button
              className="btn btn-ghost h-11 min-h-0 gap-1.5"
              onClick={handleDownload}
              title="Download chart as PNG"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Row 2: Column mapping */}
        {columns.length > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 pt-4 border-t border-base-300">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-neutral-content uppercase tracking-wider">
                Labels
              </span>
              <select
                className="select select-bordered select-sm bg-base-100 min-w-[120px]"
                value={labelColumn}
                onChange={(e) => handleLabelColumnChange(e.target.value)}
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:block w-px h-6 bg-base-300 shrink-0" />

            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs font-medium text-neutral-content uppercase tracking-wider shrink-0">
                Series
              </span>
              {columns
                .filter((c) => c !== labelColumn)
                .map((col) => (
                  <button
                    key={col}
                    onClick={() => toggleDataColumn(col)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                      ${
                        dataColumns.includes(col)
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "bg-base-100 border-base-300 text-neutral-content hover:border-base-content/30"
                      }`}
                  >
                    {col}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-base-200 border border-base-300 p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Chart Preview</h2>
        <div className="bg-white rounded-lg p-4">
          <canvas ref={canvasRef} id="my-canvas" />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl bg-base-200 border border-base-300 p-4 sm:p-6">
        <div className="flex items-baseline gap-2 mb-4">
          <h2 className="text-lg font-semibold">Data</h2>
          {rows.length > 0 && (
            <span className="text-xs text-neutral-content">
              {rows.length.toLocaleString()} rows &middot; {columns.length}{" "}
              columns
            </span>
          )}
        </div>

        <div className="overflow-auto max-h-[520px] rounded-lg border border-base-300">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-base-300 text-left">
                {columns.map((col, i) => (
                  <th
                    key={col}
                    className={`px-4 py-2.5 font-semibold text-neutral-content text-xs uppercase tracking-wider whitespace-nowrap ${
                      i === 0
                        ? "sticky left-0 z-20 bg-base-300"
                        : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {paginatedRows.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-base-100/50 transition-colors"
                >
                  {columns.map((col, j) => (
                    <td
                      key={col}
                      className={`px-4 py-2 whitespace-nowrap ${
                        j === 0
                          ? "sticky left-0 z-10 bg-base-200 font-medium"
                          : "tabular-nums"
                      }`}
                    >
                      {row[col] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showPagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 pt-3 border-t border-base-300 text-sm">
            <div className="flex items-center gap-2 text-neutral-content">
              <span>Rows per page</span>
              <select
                className="select select-bordered select-xs bg-base-100"
                value={rowsPerPage}
                onChange={(e) =>
                  handleRowsPerPageChange(Number(e.target.value))
                }
              >
                {ROWS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="ml-2">
                {((currentPage - 1) * rowsPerPage + 1).toLocaleString()}
                &ndash;
                {Math.min(
                  currentPage * rowsPerPage,
                  rows.length,
                ).toLocaleString()}{" "}
                of {rows.length.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="btn btn-ghost btn-xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="btn btn-ghost btn-xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="px-2 text-xs text-neutral-content">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-ghost btn-xs"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                className="btn btn-ghost btn-xs"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
