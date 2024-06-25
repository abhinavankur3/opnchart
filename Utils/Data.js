export const sampleData = {
  bar: [
    { x: 2010, y: 10 },
    { x: 2011, y: 20 },
    { x: 2012, y: 15 },
    { x: 2013, y: 25 },
    { x: 2014, y: 28 },
    { x: 2015, y: 30 },
    { x: 2016, y: 45 },
  ],
  line: [
    { x: 2010, y: 10 },
    { x: 2011, y: 20 },
    { x: 2012, y: 15 },
    { x: 2013, y: 25 },
    { x: 2014, y: 28 },
    { x: 2015, y: 30 },
    { x: 2016, y: 45 },
  ],
  bubble: [
    { x: 2010, y: 10, r: 1 * 10 },
    { x: 2011, y: 20, r: 1 * 20 },
    { x: 2012, y: 15, r: 1 * 15 },
    { x: 2013, y: 25, r: 1 * 25 },
    { x: 2014, y: 28, r: 1 * 28 },
    { x: 2015, y: 30, r: 1 * 30 },
    { x: 2016, y: 45, r: 1 * 45 },
  ],
  doughnut: [
    { x: 2010, y: 10 },
    { x: 2011, y: 20 },
    { x: 2012, y: 15 },
    { x: 2013, y: 25 },
    { x: 2014, y: 28 },
    { x: 2015, y: 30 },
    { x: 2016, y: 45 },
  ],
  pie: [
    { x: 2010, y: 10 },
    { x: 2011, y: 20 },
    { x: 2012, y: 15 },
    { x: 2013, y: 25 },
    { x: 2014, y: 28 },
    { x: 2015, y: 30 },
    { x: 2016, y: 45 },
  ],
  polarArea: [
    { x: 2010, y: 10 },
    { x: 2011, y: 20 },
    { x: 2012, y: 15 },
    { x: 2013, y: 25 },
    { x: 2014, y: 28 },
    { x: 2015, y: 30 },
    { x: 2016, y: 45 },
  ],
  radar: [
    { x: 2010, y: 10, from: 0 },
    { x: 2011, y: 20, from: 0 },
    { x: 2012, y: 15, from: 0 },
    { x: 2013, y: 25, from: 0 },
    { x: 2014, y: 28, from: 0 },
    { x: 2015, y: 30, from: 0 },
    { x: 2016, y: 45, from: 0 },
  ],
  scatter: [
    { x: 2010, y: 10 },
    { x: 2011, y: 20 },
    { x: 2012, y: 15 },
    { x: 2013, y: 25 },
    { x: 2014, y: 28 },
    { x: 2015, y: 30 },
    { x: 2016, y: 45 },
  ],
};

export const getChartData = ({ type, data }) => {
  if (!data) {
    data = sampleData[type];
  }
  const keys = Object.keys(data[0]);
  switch (type) {
    case "bar":
    case "line":
    case "doughnut":
    case "pie":
    case "polarArea":
    case "radar":
    case "scatter":
      return {
        labels: data.map((row) => row[keys[0]]),
        datasets: [
          {
            label: "",
            data: data.map((row) => row[keys[1]]),
          },
        ],
      };
    case "bubble":
      return {
        datasets: [
          {
            label: "Dataset 1",
            data,
          },
        ],
      };
    default:
      return null;
  }
};
