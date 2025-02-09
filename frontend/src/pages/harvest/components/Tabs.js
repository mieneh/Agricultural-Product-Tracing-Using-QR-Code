const Tabs = ({ activeTab, onTabClick }) => (
  <div className="nav nav-tabs justify-content-center fw-bold fs-5 mt-4">
    {["detail", "about", "tracking"].map((tab) => (
      <span key={tab} className={`tab ${activeTab === tab ? "active-tab" : ""}`} onClick={() => onTabClick(tab)}>
        {tab === "detail" ? "Mô tả sản phẩm" : tab === "about" ? "Doanh nghiệp" : "Quy trình vận hành"}
      </span>
    ))}
  </div>
);

export default Tabs;