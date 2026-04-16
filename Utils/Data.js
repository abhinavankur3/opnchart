export const CHART_COLORS = [
  "rgba(59, 130, 246, 0.7)",
  "rgba(239, 68, 68, 0.7)",
  "rgba(16, 185, 129, 0.7)",
  "rgba(245, 158, 11, 0.7)",
  "rgba(139, 92, 246, 0.7)",
  "rgba(236, 72, 153, 0.7)",
  "rgba(6, 182, 212, 0.7)",
  "rgba(249, 115, 22, 0.7)",
  "rgba(20, 184, 166, 0.7)",
  "rgba(99, 102, 241, 0.7)",
];

export const CHART_BORDER_COLORS = [
  "rgb(59, 130, 246)",
  "rgb(239, 68, 68)",
  "rgb(16, 185, 129)",
  "rgb(245, 158, 11)",
  "rgb(139, 92, 246)",
  "rgb(236, 72, 153)",
  "rgb(6, 182, 212)",
  "rgb(249, 115, 22)",
  "rgb(20, 184, 166)",
  "rgb(99, 102, 241)",
];

export const sampleData = {
  columns: ["Year", "Math", "Science", "English", "History"],
  rows: [
    { Year: 2018, Math: 75, Science: 82, English: 88, History: 70 },
    { Year: 2019, Math: 78, Science: 85, English: 90, History: 72 },
    { Year: 2020, Math: 80, Science: 79, English: 85, History: 78 },
    { Year: 2021, Math: 85, Science: 88, English: 92, History: 80 },
    { Year: 2022, Math: 82, Science: 90, English: 87, History: 84 },
    { Year: 2023, Math: 90, Science: 93, English: 95, History: 88 },
    { Year: 2024, Math: 88, Science: 91, English: 93, History: 90 },
  ],
};

export const isNumeric = (val) =>
  val !== "" && val !== null && val !== undefined && !isNaN(Number(val));

export const detectColumnTypes = (rows, columns) => {
  const sampleSize = Math.min(rows.length, 30);
  const sample = rows.slice(0, sampleSize);
  const types = {};
  columns.forEach((col) => {
    types[col] = sample.every((row) => isNumeric(row[col]))
      ? "numeric"
      : "string";
  });
  return types;
};

export const autoSelectColumns = (columns, rows) => {
  if (!columns.length) return { labelCol: "", dataCols: [] };
  const types = detectColumnTypes(rows, columns);
  const labelCol = columns.find((c) => types[c] === "string") || columns[0];
  const dataCols = columns.filter((c) => c !== labelCol);
  return { labelCol, dataCols };
};

function calcBubbleRadius(value) {
  const v = Math.abs(value);
  if (v <= 10) return Math.max(v, 3);
  if (v <= 100) return Math.floor(Math.min(0.2 * v, 50));
  if (v <= 500) return Math.floor(Math.min(0.06 * v, 50));
  if (v <= 1000) return Math.floor(Math.min(0.03 * v, 50));
  return Math.floor(Math.min(0.02 * v, 50));
}

export const getChartData = ({ type, data, labelColumn, dataColumns }) => {
  if (!data || !data.length || !labelColumn || !dataColumns || !dataColumns.length) {
    return { labels: [], datasets: [] };
  }

  const labels = data.map((row) => row[labelColumn]);
  const isSingleSeries = ["pie", "doughnut", "polarArea"].includes(type);

  if (type === "scatter") {
    return {
      datasets: dataColumns.map((col, i) => ({
        label: col,
        data: data.map((row, idx) => ({
          x: isNumeric(row[labelColumn]) ? Number(row[labelColumn]) : idx,
          y: Number(row[col]) || 0,
        })),
        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
        borderColor: CHART_BORDER_COLORS[i % CHART_BORDER_COLORS.length],
      })),
    };
  }

  if (type === "bubble") {
    return {
      datasets: dataColumns.slice(0, 1).map((col, i) => ({
        label: col,
        data: data.map((row, idx) => {
          const y = Number(row[col]) || 0;
          return {
            x: isNumeric(row[labelColumn]) ? Number(row[labelColumn]) : idx,
            y,
            r: dataColumns[1]
              ? Math.min(Math.abs(Number(row[dataColumns[1]]) || 5), 50)
              : calcBubbleRadius(y),
          };
        }),
        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
        borderColor: CHART_BORDER_COLORS[i % CHART_BORDER_COLORS.length],
      })),
    };
  }

  if (isSingleSeries) {
    const col = dataColumns[0];
    return {
      labels,
      datasets: [
        {
          label: col,
          data: data.map((row) => Number(row[col]) || 0),
          backgroundColor: data.map(
            (_, i) => CHART_COLORS[i % CHART_COLORS.length],
          ),
          borderColor: data.map(
            (_, i) => CHART_BORDER_COLORS[i % CHART_BORDER_COLORS.length],
          ),
          borderWidth: 1,
        },
      ],
    };
  }

  // Multi-series: bar, line, radar
  return {
    labels,
    datasets: dataColumns.map((col, i) => ({
      label: col,
      data: data.map((row) => Number(row[col]) || 0),
      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
      borderColor: CHART_BORDER_COLORS[i % CHART_BORDER_COLORS.length],
      borderWidth: type === "line" ? 2 : 1,
      ...(type === "line" ? { fill: false, tension: 0.1 } : {}),
    })),
  };
};
