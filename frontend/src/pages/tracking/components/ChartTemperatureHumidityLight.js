import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartTemperatureHumidityLight = ({ data: propData }) => {
    const getHourLabel = (time) => {
        const date = new Date(time);
        return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    };

    const groupedData = propData.reduce((acc, data) => {
        const hourLabel = getHourLabel(data.createdAt);
        if (!acc[hourLabel]) {
            acc[hourLabel] = { temperature: [], humidity: [], light: [] };
        }
        acc[hourLabel].temperature.push(data.temperature);
        acc[hourLabel].humidity.push(data.humidity);
        acc[hourLabel].light.push(data.light);
        return acc;
    }, {});

    const temperatureHumidityData = {
        labels: Object.keys(groupedData),
        datasets: [
            {
                label: 'Nhiệt độ (°C)',
                data: Object.values(groupedData).map((values) =>
                    values.temperature.reduce((a, b) => a + b, 0) / values.temperature.length
                ),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y1',
                tension: 0.4,
            }, {
                label: 'Độ ẩm (%)',
                data: Object.values(groupedData).map((values) =>
                    values.humidity.reduce((a, b) => a + b, 0) / values.humidity.length
                ),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                yAxisID: 'y2',
                tension: 0.4,
            },
        ],
    };

    const lightData = {
        labels: Object.keys(groupedData),
        datasets: [
            {
                label: 'Ánh sáng (lux)',
                data: Object.values(groupedData).map((values) =>
                    values.light.reduce((a, b) => a + b, 0) / values.light.length
                ),
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                yAxisID: 'y3',
                tension: 0.4,
            },
        ],
    };

    const temperatureHumidityOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Nhiệt độ và độ ẩm trong quá trình vận chuyển',
            },
        },
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Nhiệt độ (°C)',
                },
                ticks: {
                    color: 'rgba(255, 99, 132, 1)',
                },
            },
            y2: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Độ ẩm (%)',
                },
                ticks: {
                    color: 'rgba(54, 162, 235, 1)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    const lightOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ánh sáng trong quá trình vận chuyển',
            },
        },
        scales: {
            y3: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Ánh sáng (lux)',
                },
                ticks: {
                    color: 'rgba(255, 159, 64, 1)',
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <div className="chart-item">
                <Line data={temperatureHumidityData} options={temperatureHumidityOptions} />
            </div>
            <div className="chart-item">
                <Line data={lightData} options={lightOptions} />
            </div>
        </div>
    );
};

export default ChartTemperatureHumidityLight;