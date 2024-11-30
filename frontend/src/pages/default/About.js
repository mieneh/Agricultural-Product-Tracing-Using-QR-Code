import Header from '../../components/Header';
import '../../components/css/default.css';

const About = () => {
  return (
    <div>
        <Header />
        <div className="about-container">
            <h1 className="title-about text-success">FarmTrack - Nền tảng truy xuất nguồn gốc nông sản </h1>
            <div className="about-info">
                <h2>Thông tin về FarmTrack</h2>
                <div className="intro-content">
                    <img src="/assets/green-and-orange/1.png" alt="Company" className="intro-img" />
                    <div className="intro-text">
                        <p> FarmTrack là nền tảng tiên phong trong việc cung cấp dịch vụ quản lý và truy xuất nguồn gốc nông sản. Chúng tôi kết nối các nhà sản xuất, nhà phân phối và nhà vận chuyển trên một hệ thống đồng nhất, đảm bảo minh bạch và nâng cao chất lượng sản phẩm. </p>
                        <p> Với FarmTrack, mỗi lô hàng nông sản được quản lý từ khâu sản xuất đến khi tới tay người tiêu dùng thông qua công nghệ QR code hiện đại, giúp xây dựng lòng tin và bảo vệ sức khỏe cộng đồng. </p>
                        <p><strong>Địa chỉ:</strong> 123 Đường Số 5, Phường Tân Phú, Quận 7, TP.HCM, Việt Nam</p>
                        <p><strong>Điện thoại:</strong> 0877896226</p>
                        <p><strong>Email:</strong> farmtrack@gmail.com</p>
                        <p><strong>Website:</strong> www.farmtrack.com.vn</p>
                    </div>
                </div>
            </div>

            <div className="about-info">
                <h2>Lịch sử phát triển</h2>
                <p>FarmTrack được hình thành với sứ mệnh đưa công nghệ vào ngành nông nghiệp, giúp tối ưu hóa quy trình sản xuất và phân phối nông sản.</p>
                <p><strong>2019:</strong> Thành lập FarmTrack và phát triển nền tảng truy xuất nguồn gốc.</p>
                <p><strong>2020:</strong> Triển khai dịch vụ tạo mã QR truy xuất lô hàng nông sản.</p>
                <p><strong>2023:</strong> Ra mắt hệ thống quản lý tích hợp, kết nối các nhà sản xuất, phân phối và vận chuyển.</p>
            </div>

            <div className="about-info">
                <h2>Giá trị cốt lõi</h2>
                <p><strong>Minh bạch:</strong> Đảm bảo mọi thông tin về sản phẩm đều được ghi nhận chính xác và truy xuất dễ dàng.</p>
                <p><strong>Hiện đại:</strong> Áp dụng công nghệ mới nhất để nâng cao hiệu quả quản lý và giám sát.</p>
                <p><strong>Liên kết:</strong> Tạo nền tảng kết nối vững chắc giữa nhà sản xuất, nhà phân phối và nhà vận chuyển.</p>
            </div>

            <div className="about-info">
                <h2>Đội ngũ của chúng tôi</h2>
                <p><strong>Trưởng nhóm:</strong> Đinh Phương My</p>
                <p><strong>Thành viên:</strong> Nguyễn Thùy Linh</p>
                <p>Cùng các chuyên gia trong lĩnh vực nông nghiệp, công nghệ và quản lý chuỗi cung ứng. Chúng tôi luôn đặt mục tiêu cải tiến không ngừng và mang đến giải pháp tối ưu nhất cho khách hàng.</p>
            </div>

            <div className="about-info">
                <h2>Đối tác và chứng nhận</h2>
                <p>FarmTrack đã hợp tác với hàng trăm nhà sản xuất và nhà phân phối lớn trên cả nước để đảm bảo chất lượng và độ tin cậy của sản phẩm.</p>
                <p><strong>Chứng nhận:</strong> ISO 22000, GlobalGAP, HACCP.</p>
                <p><strong>Đối tác:</strong> Các hợp tác xã, siêu thị, và hệ thống phân phối nông sản lớn trong nước.</p>
            </div>

            <div className="about-info">
                <h2>Dịch vụ của FarmTrack</h2>
                <ul>
                    <li>Tạo và quản lý mã QR cho từng lô hàng nông sản.</li>
                    <li>Kết nối nhà sản xuất, nhà phân phối và nhà vận chuyển trên một nền tảng duy nhất.</li>
                    <li>Truy xuất thông tin nguồn gốc sản phẩm mọi lúc, mọi nơi.</li>
                    <li>Quản lý chất lượng sản phẩm từ giai đoạn sản xuất đến giao hàng.</li>
                    <li>Hỗ trợ in ấn và cung cấp tem truy xuất nguồn gốc chất lượng cao.</li>
                </ul>
            </div>
        </div>
    </div>
  );
};

export default About;