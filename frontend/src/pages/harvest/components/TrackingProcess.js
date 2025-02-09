import TemperatureHumidityChart from "../../tracking/components/ChartTemperatureHumidityLight";
import TemperatureMapChart from "../../tracking/components/ChartMap";

function getIconByStep(stepIndex) {
  switch (stepIndex) {
    case 1: return "🧑‍🌾";
    case 2: return "🌱";
    case 3: return "💧";
    case 4: return "🐛";
    case 5: return "🧺";
    case 6: return "📦";
    default: return null;
  }
}

const TrackingProcess = ({ harvest, sensor }) => {
  if (!harvest) {
    return <div className="text-center text-muted py-3">Đang tải thông tin doanh nghiệp...</div>;
  }
  
  return (
    <div>
      <section className="mt-4 p-1 bg-white rounded shadow-sm lh-lg">
        <div className="d-flex align-items-center justify-content-center my-4">
          <div className="line"></div>
          <h5 className="fs-5 fw-bold mb-0 px-4">Quá Trình Sản Xuất</h5>
          <div className="line"></div>
        </div>
        <div className="steps mb-4">
          {harvest.process?.steps?.length ? (
            harvest.process.steps.map((step, index) => (
              <div className="step-item" key={index}>
                <div className="display-6 mb-2 mt-2">{getIconByStep(index + 1)}</div>
                <div>
                  <h3 className="fw-bold fs-6 mb-2">{step.name}</h3>
                  <p className="text-muted small mb-0">{step.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Chưa có thông tin</p>
          )}
        </div>
      </section>

      <section className="mt-4 p-1 bg-white rounded shadow-sm lh-lg">
        <div className="d-flex align-items-center justify-content-center my-4">
          <div className="line"></div>
          <h5 className="fs-5 fw-bold mb-0 px-4">Lộ Trình Vận Chuyển</h5>
          <div className="line"></div>
        </div>
        <TemperatureHumidityChart data={sensor} />
        <TemperatureMapChart data={sensor} />
      </section>
    </div>
  );
};

export default TrackingProcess;