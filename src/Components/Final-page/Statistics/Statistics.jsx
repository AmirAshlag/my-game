import { useEffect, useState } from "react";
import { useContext } from "react";
import { myContext } from "../../../App";
import "../FinalPage.css";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

function Statistics() {
  const { usersList } = useContext(myContext);
  Chart.register(...registerables);
  const labelRanges = [
    "1-2",
    "3-4",
    "5-6",
    "7-8",
    "9-10",
    "11-12",
    "13-14",
    "15-16",
    "17-18",
    "19-20",
  ];

  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: "Score",
        data: usersList
          .filter((user) => user.finished === true)
          .map((user) => ({
            x: user.initialCards, // Cards Started With
            y: user.score, // Average Score
          })),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    console.log(usersList);
    setChartData({
      labels: labelRanges,
      datasets: [
        {
          label: "Number of players",
          data: labelRanges.map((range) => {
            const [min, max] = range.split("-").map(Number);
            return usersList.filter(
              (user) =>
                user.finished === true &&
                user.initialCards >= min &&
                user.initialCards <= max
            ).length;
          }),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Average score",
          data: labelRanges.map((range) => {
            const [min, max] = range.split("-").map(Number);
            const relevantUsers = usersList.filter(
              (user) =>
                user.finished === true &&
                user.initialCards >= min &&
                user.initialCards <= max
            );
            const totalScore = relevantUsers.reduce(
              (acc, user) => acc + user.score,
              0
            );
            return relevantUsers.length === 0
              ? 0
              : totalScore / relevantUsers.length;
          }),
          backgroundColor: "rgba(192, 75, 75, 0.2)",
          borderColor: "rgba(192, 75, 75, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [usersList]);

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Cards Started With",
        },
      },
      y: {
        title: {
          display: true,
          text: "Average score",
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default Statistics;
