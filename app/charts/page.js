"use client";
import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import Papa from "papaparse";
import { Table } from "antd";
import { getChartData, sampleData } from "@/Utils/Data";
import capitalize from "@/Utils/Capitalize";

export default function Charts() {
  const [chart, setChart] = useState(null);
  const [type, setType] = useState(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [tableHeaders, setTableHeaders] = useState([
    {
      title: "Year",
      dataIndex: "x",
      key: "x",
    },
    {
      title: "No. of students",
      dataIndex: "y",
      key: "y",
    },
  ]);

  useEffect(() => {
    setData(sampleData.bar);
    setType("bar");
    generateChart("bar", sampleData.bar);
  }, []);

  const getDataSource = () => {
    data.forEach((elem, i) => {
      elem.key = i;
    });
    return data;
  };

  const getArrayOfJson = (data, typeParam) => {
    const result = [];
    data.forEach((arr, i) => {
      if (i === 0) return;
      const obj = { x: arr[0], y: arr[1] };
      if (typeParam === "bubble") {
        const value = Math.floor(parseInt(arr[1]));
        let deltaRadius = 1;
        if (value > 10 && value <= 100) {
          deltaRadius = 0.2;
        } else if (value > 100 && value <= 500) {
          deltaRadius = 0.06;
        } else if (value > 500 && value <= 1000) {
          deltaRadius = 0.03;
        } else if (value > 1000) {
          deltaRadius = 0.02;
        }

        obj.r = Math.floor(Math.min(deltaRadius * value, 50));
      }
      result.push(obj);
    });
    return result;
  };

  const parseFile = (fileParam, typeParam) => {
    if (!fileParam) {
      fileParam = file;
    }
    if (!typeParam) {
      typeParam = type;
    }
    Papa.parse(fileParam, {
      complete: function (results) {
        const arrayOfJson = getArrayOfJson(results.data, typeParam);
        setData(arrayOfJson);
        setTableHeaders((prev) => {
          const newHeaders = prev.map((header, i) => ({
            ...header,
            title: capitalize(results.data[0][i]),
          }));
          return newHeaders;
        });
        if (typeParam) {
          generateChart(typeParam, arrayOfJson);
        }
      },
    });
  };

  const handleOnFileUpload = (e) => {
    setFile(e.target.files[0]);
    parseFile(e.target.files[0]);
  };

  const generateChart = (selectedType, dataParam) => {
    if (chart) {
      chart.destroy();
    }

    if (!selectedType) {
      selectedType = type;
    }

    if (!dataParam) {
      dataParam = data;
    }

    const options = {};
    if (selectedType === "polarArea") {
      options.scales = {
        r: {
          pointLabels: {
            display: true,
            centerPointLabels: true,
            font: {
              size: 18,
            },
          },
        },
      };
    }

    const _chart = new Chart(document.getElementById("my-canvas"), {
      type: selectedType,
      data: getChartData({ type: selectedType, data: dataParam }),
      options,
    });

    setChart(_chart);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    if (file) {
      parseFile(file, e.target.value);
    } else {
      generateChart(e.target.value, sampleData[e.target.value]);
    }
  };

  return (
    <div className=" lg:flex overflow-x-clip justify-between min-h-[92vh] ">
      <div className=" lg:min-w-[45vw] px-5 flex my-5 items-center flex-col">
        <div className="flex w-full flex-wrap justify-around">
          <select
            className="select select-secondary m-2"
            defaultValue={type}
            onChange={handleTypeChange}
          >
            <option value="default" disabled>
              Pick your chart type
            </option>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="bubble">Bubble Chart</option>
            <option value="doughnut">Doughnut Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="polarArea">Polar Area Chart</option>
            <option value="radar">Radar Chart</option>
            <option value="scatter">Scatter Chart</option>
          </select>
          <input
            type="file"
            className=" file-input file-input-bordered file-input-secondary m-2"
            accept=".csv"
            onChange={handleOnFileUpload}
          />
          <button
            className=" btn btn-success text-success-content text-lg m-2"
            disabled={!file}
            onClick={() => parseFile()}
          >
            Generate
          </button>
        </div>
        <div className="w-full h-full flex items-center m-5">
          {data ? (
            <Table
              className="w-full bg-white rounded-lg"
              dataSource={getDataSource()}
              columns={tableHeaders}
              pagination={{
                hideOnSinglePage: true,
              }}
            />
          ) : null}
        </div>
      </div>
      <div className="divider lg:divider-horizontal divider-info" />
      <div className="min-w-[50vw] flex items-center px-5 flex-col justify-center">
        <canvas
          width={3840}
          height={2160}
          className={`${
            chart ? "bg-white" : "bg-base"
          } p-5 h-[100vh] w-[100vw]`}
          id="my-canvas"
        />
        <div className="my-2 text-xl font-semibold">
          To download this as PNG image, use right mouse click and click on{" "}
          <span className="text-success">Save Image As.. </span>
        </div>
      </div>
    </div>
  );
}
