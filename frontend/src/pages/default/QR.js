import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { FaUpload } from 'react-icons/fa';
import Header from "../../components/Header";
import '../../components/css/default.css';

const QR = () => {
    const [activeTab, setActiveTab] = useState('camera');
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(true);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (activeTab === 'camera') {
            startCamera();
        }
    }, [activeTab]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraPermissionGranted(true);
            scanQRCode();
        } catch (err) {
            setCameraPermissionGranted(false);
        }
    };

    const scanQRCode = () => {
        let scanning = true;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const tick = () => {
            if (!scanning || !videoRef.current) return;
            if (!videoRef.current || !videoRef.current.readyState) {
                requestAnimationFrame(tick);
                return;
            }
            if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code) {
                    handleRedirect(code.data);
                }
            }
            requestAnimationFrame(tick);
        };
        tick();
        return () => { scanning = false; };
    };


    const handleScanFromImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const qrCodeData = jsQR(imageData.data, canvas.width, canvas.height);
                    if (qrCodeData) {
                        handleTabClick(qrCodeData.data);
                        handleRedirect(qrCodeData.data);
                    } else {
                        alert('Không thể quét mã QR từ ảnh.');
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRedirect = (url) => {
        try {
            const validUrl = new URL(url);
            window.location.href = validUrl;
        } catch (e) {
            alert('Dữ liệu QR không phải là một URL hợp lệ.');
        }
    };

    return (
        <div>
            <Header />
            <div className="container-qr">
                <h1 className="title-qr text-success">Truy Suất Nông Sản</h1>
                <div className="tabs-qr">
                    <span className={activeTab === "camera" ? "tab-qr active-tab-qr" : "tab-qr"} onClick={() => handleTabClick("camera")} > Máy ảnh quét mã QR </span>
                    <span className={activeTab === "upload" ? "tab-qr active-tab-qr" : "tab-qr"} onClick={() => handleTabClick("upload")} > Tải lên hình ảnh mã QR </span>
                </div>

                {activeTab === 'camera' && (
                    <div className={`content-qr ${cameraPermissionGranted ? 'camera-active' : ''}`}>
                        {!cameraPermissionGranted ? (
                            <div className="camera-section">
                                <p>Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera trong trình duyệt.</p>
                            </div>
                        ) : (
                            <>
                                <video ref={videoRef} playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div className="content-qr">
                        <div className="upload-section">
                            <label htmlFor="file-upload"><FaUpload style={{marginBottom: '10px'}}/><p>Tải lên hoặc kéo và thả hình ảnh</p></label>
                            <input
                                id="file-upload"
                                className="file-input-qr"
                                type="file"
                                accept="image/*"
                                onChange={handleScanFromImage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QR;