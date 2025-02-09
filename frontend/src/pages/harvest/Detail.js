import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import ProductInfo from "./components/ProductInfo";
import Tabs from "./components/Tabs";
import ProductDescription from "./components/ProductDescription";
import EnterpriseInfo from "./components/EnterpriseInfo";
import TrackingProcess from "./components/TrackingProcess";
import {getHarvestById, getSensorById} from "../../services/harvestService"

const Detail = () => {
  const { id } = useParams();
  const [harvest, setHarvest] = useState(null);
  const [sensor, setSensor] = useState([]);
  const [activeTab, setActiveTab] = useState("detail");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHarvestDetails = async () => {
      try {
        const data = await getHarvestById(id);
        setHarvest(data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSensors = async () => {
      try {
        const data = await getSensorById(id);
        setSensor(data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHarvestDetails();
    fetchSensors();
  }, [id]);

  if (loading) return <p className="text-success mb-4 fw-bold fs-2">Đang tải...</p>;
  if (error) return <p className="text-success mb-4 fw-bold fs-2">{error}</p>;

  return (
    <div>
      <Header />
      <div className="container my-5 text-dark">
        <h1 className="text-success mb-4 fw-bold fs-2">Thông Tin Sản Phẩm</h1>
        <ProductInfo harvest={harvest} />
        <Tabs activeTab={activeTab} onTabClick={setActiveTab} />

        {activeTab === "detail" && <ProductDescription harvest={harvest} />}
        {activeTab === "about" && <EnterpriseInfo harvest={harvest} />}
        {activeTab === "tracking" && <TrackingProcess harvest={harvest} sensor={sensor} />}
      </div>
    </div>
  );
};

export default Detail;