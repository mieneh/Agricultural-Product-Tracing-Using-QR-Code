import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getProducts } from '../../services/productService';
import { getRegions } from '../../services/regionService';
import { getProcesses } from '../../services/processService';
import { getHarvests, createHarvest, updateHarvest, deleteHarvest } from '../../services/harvestService';
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Harvest = () => {
  const [harvests, setHarvests] = useState([]);
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [harvestData, setHarvestData] = useState({ batch: '', harvestDate: '', expirationDate: '', product: '', location: '', process: '', quantity: '', note: '', });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [maxDay, setMaxDay] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);

  useEffect(() => {
    fetchHarvests();
    fetchProducts();
    fetchRegions();
    fetchProcesses();
  }, []);

  const fetchHarvests = async () => {
    try {
      const data = await getHarvests();
      setHarvests(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      if (data.length > 0) {
        setMaxDay((data)[0].category.maxday || 0);
      }
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const fetchRegions = async () => {
    try {
      const data = await getRegions();
      setRegions(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const fetchProcesses = async () => {
    try {
      const data = await getProcesses();
      setProcesses(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const slugify = (text) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find(product => product._id === e.target.value);
    if (selectedProduct) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}${currentDate.getMonth() + 1}${currentDate.getFullYear()}`;
      const batch = `${slugify(selectedProduct.name)}-${formattedDate}`;
      setMaxDay(selectedProduct.category.maxday);
      setHarvestData(prevState => ({
        ...prevState,
        product: e.target.value,
        batch: batch,
      }));
    }
  };

  const handleExpirationDate = (e) => {
    const harvestDate = e.target.value;
    if (maxDay && harvestDate) {
      const calculatedExpirationDate = new Date(harvestDate);
      calculatedExpirationDate.setDate(calculatedExpirationDate.getDate() + maxDay);

      setHarvestData(prevState => ({
        ...prevState,
        harvestDate: harvestDate,
        expirationDate: calculatedExpirationDate.toISOString().split('T')[0],
      }));
    } else {
      setHarvestData(prevState => ({
        ...prevState,
        harvestDate: harvestDate,
        expirationDate: '',
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!harvestData.harvestDate || !harvestData.product || !harvestData.location || !harvestData.process || !harvestData.quantity) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      if (isEdit) {
        await updateHarvest(selectedHarvest._id, harvestData);
      } else {
        await createHarvest(harvestData);
        console.log(harvestData);      
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchHarvests();
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông tin thu hoạch này?')) {
      try {
        await deleteHarvest(id);
        setHarvests(prev => prev.filter(h => h._id !== id));
        setSuccess('Đã xóa một lô hàng thành công.')
        fetchHarvests();
      } catch (err) {
        alert(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const handleDownloadQR = (qrUrl, batch) => {
    if (!qrUrl) return;
    const downloadUrl = qrUrl.replace('/upload/', `/upload/fl_attachment:${batch}/`);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllQR = async () => {
    if (!harvests.length) {
      alert("Không có lô hàng nào để tải mã QR!");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder("QR");

    for (const harvest of harvests) {
      if (harvest.qrCode) {
        try {
          const response = await fetch(harvest.qrCode);
          const blob = await response.blob();
          const fileName = `${harvest.batch || harvest._id}.png`;
          folder.file(fileName, blob);
        } catch (error) {
          setError(`Không thể tải QR của ${harvest.batch}:`, error);
        }
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "QR.zip");
  };

  const openModal = async () => {
    await fetchHarvests();
    await fetchProducts();
    await fetchRegions();
    await fetchProcesses();
    setHarvestData({ batch: '', harvestDate: '', expirationDate: '', product: '', location: '', process: '', quantity: '', note: '', });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = async (harvest) => {
    await fetchHarvests();
    await fetchProducts();
    await fetchRegions();
    await fetchProcesses();
    setHarvestData({
      batch: harvest.batch,
      harvestDate: harvest.harvestDate.split('T')[0],
      expirationDate: harvest.expirationDate.split('T')[0],
      product: harvest.product?._id || '',
      location: harvest.location?._id || '',
      process: harvest.process?._id || '',
      quantity: harvest.quantity,
      note: harvest.note || '',
    });
    setSelectedHarvest(harvest);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: '15px 2px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-success mb-0">Quản Lý Thu Hoạch</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
          <button className="add-button" style={{ marginTop: "-10px" }} onClick={handleDownloadAllQR} title="Tải tất cả mã QR" > <FaDownload /> </button>
        </div>
      </div>
      
      {success && <Alert variant="success">{success}</Alert>}
      
      <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{textAlign: 'center', fontSize: '18px'}} >
            <th style={{padding: '12px', width:'2.5%'}}>STT</th>              
            <th style={{padding: '12px', width:'12%'}}>Lô</th>
            <th style={{padding: '12px', width:'10%'}}>Sản Phẩm</th>
            <th style={{padding: '12px', width:'10.25%'}}>Ngày Sản Xuất</th>
            <th style={{padding: '12px', width:'10.25%'}}>Ngày Hết Hạn</th>
            <th style={{padding: '12px', width:'13.5%'}}>Khu Vực</th>
            <th style={{padding: '12px', width:'13.5%'}}>Quy Trình</th>
            <th style={{padding: '12px', width:'8%'}}>Số Lượng</th>
            <th style={{padding: '12px', width:'10%'}}>Ghi Chú</th>
            <th style={{padding: '12px', width:'10%'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(!Array.isArray(harvests) || harvests.length === 0) ? (
            <tr>
              <td colSpan="10" className="text-center text-muted p-3">Không có thông tin thu hoạch nào!</td>
            </tr>
          ) : (
          harvests
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((harvest, index) => (
              <tr key={harvest._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>
                  <p>{harvest.batch}</p>
                  {harvest.qrCode && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                      <img src={harvest.qrCode} alt={`QR-${harvest.batch}`} style={{ width: '150px', height: '150px', border: '1px solid #ddd', borderRadius: '6px' }} />
                      <Button variant="success" size="sm" style={{ padding: '3px 8px', fontSize: '14px' }} onClick={() => handleDownloadQR(harvest.qrCode, harvest.batch)} >
                        <FaSave style={{ marginRight: '5px' }} /> Tải QR
                      </Button>
                    </div>
                  )}
                </td>                
                <td style={{textAlign: 'center', padding: '15px'}}>
                  <p>{harvest.product?.name}</p>
                  {harvest.product?.image && <img src={harvest.product?.image} alt={harvest.product?.image} style={{ width: '150px', height: '150px' }} />}
                </td> 
                <td style={{textAlign: 'center', padding: '15px'}}>{new Date(harvest.harvestDate).toLocaleDateString()}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{new Date(harvest.expirationDate).toLocaleDateString()}</td>
                <td style={{padding: '15px'}}>{harvest.location?.name || 'Không rõ'}</td>
                <td style={{padding: '15px'}}>{harvest.process?.name || 'Không rõ'}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{harvest.quantity} kg</td>
                <td style={{padding: '15px'}}>{harvest.note}</td>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                  <Button className="me-2" onClick={() => openEditModal(harvest)}><FaEdit/></Button>
                  <Button className="me-2"  onClick={() => handleDelete(harvest._id)}><FaTrash/></Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Lô Hàng' : 'Thêm Mới Lô Hàng'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="form-group">
              <Form.Label>Lô</Form.Label>
              <Form.Control
                type="text"
                value={harvestData.batch}
                readOnly
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Sản Phẩm</Form.Label>
              <Form.Select
                value={harvestData.product}
                onChange={handleProductChange}
                required
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Khu Vực</Form.Label>
              <Form.Select
                value={harvestData.location}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, location: e.target.value })
                }
                required
              >
                <option value="">Chọn khu vực</option>
                {regions.map((region) => (
                  <option key={region._id} value={region._id}>
                    {region.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Quy Trình</Form.Label>
              <Form.Select
                value={harvestData.process}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, process: e.target.value })
                }
                required
              >
                <option value="">Chọn quy trình</option>
                {processes.map((process) => (
                  <option key={process._id} value={process._id}>
                    {process.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Ngày Sản Xuất</Form.Label>
              <Form.Control
                type="date"
                value={harvestData.harvestDate}
                onChange={handleExpirationDate}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Ngày Hết Hạn</Form.Label>
              <Form.Control
                type="date"
                value={harvestData.expirationDate}
                readOnly
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Số Lượng</Form.Label>
              <Form.Control
                type="number"
                value={harvestData.quantity}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, quantity: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Ghi Chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={harvestData.note}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, note: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100 mt-1 p-2" variant="contained" onClick={isEdit ? handleSubmit : handleSubmit}>
            {isEdit ? <FaSyncAlt style={{ color: 'white' }} /> : <FaSave style={{ color: 'white' }}/>}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Harvest;