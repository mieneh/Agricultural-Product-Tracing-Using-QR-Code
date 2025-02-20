import { useState, useEffect } from 'react';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import { getCategories } from '../../services/categoryService';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({ category: '', name: '', description: '', image: null, });
  const [previewImage, setPreviewImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, success]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData({ ...productData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productData.name || !productData.category) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    const formData = new FormData();
    formData.append('category', productData.category);
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    if (productData.image) {
      formData.append('image', productData.image);
    }

    try {
      if (isEdit) {
        await updateProduct(selectedProduct._id, formData);
      } else {
        await createProduct(formData);
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      setPreviewImage(null);
      fetchProducts();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(id);
        setProducts(prev => prev.filter(c => c._id !== id));
        setSuccess('Đã xóa một sản phẩm thành công.');
        fetchProducts();
      } catch (err) {
        alert(err.response ? err.response.data.message : err.message);
      }
    }
  };
  
  const openModal = async () => {
    await fetchCategories();
    setProductData({ category: '', name: '', description: '', image: null, });
    setPreviewImage(null);
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = async (product) => {
    await fetchCategories();
    setProductData({
      category: product.category?._id || '',
      name: product.name,
      description: product.description,
      image: null,
    });
    setPreviewImage(product.image);
    setSelectedProduct(product);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: '15px 2px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-success mb-0">Quản Lý Sản Phẩm</h2>
        <button className="add-button" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{ textAlign: 'center', fontSize: '18px' }} >
            <th style={{padding: '12px', width:'5%'}}>STT</th>
            <th style={{padding: '12px', width:'10%'}}>Loại</th>      
            <th style={{padding: '12px', width:'20%'}}>Sản Phẩm</th>
            <th style={{padding: '12px'}}>Mô Tả</th>
            <th style={{padding: '12px', width:'10%'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(!Array.isArray(products) || products.length === 0) ? (
            <tr>
              <td colSpan="5" className="text-center text-muted p-3">Không có thông tin sản phẩm nào!</td>
            </tr>
          ) : (
          products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((product, index) => (
              <tr key={product._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{ padding: '15px'}}>{product.category?.name || 'Không rõ'}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>
                  <p>{product.name}</p>
                  {product.image && <img src={product.image} alt={product.name} style={{ width: '150px', height: '150px' }} />}
                </td>
                <td style={{ padding: '15px'}}>{product.description}</td>
                <td className="text-center">
                  <Button className="me-2" onClick={() => openEditModal(product)}><FaEdit/></Button>
                  <Button className="me-2" onClick={() => handleDelete(product._id)}><FaTrash/></Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="form-group">
              <Form.Label>Loại</Form.Label>
              <Form.Select
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                required
              >
                <option value="">Chọn loại</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Tên Sản Phẩm</Form.Label>
              <Form.Control
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {previewImage && (
                <div className="mt-3">
                  <img
                    src={previewImage}
                    alt="Xem trước"
                    style={{ width: '50%', height: '50%' }}
                  />
                </div>
              )}
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

export default Product;