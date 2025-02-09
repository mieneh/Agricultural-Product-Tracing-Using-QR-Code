const ProductDescription = ({ harvest }) => {
  if (!harvest) {
    return <div className="text-center text-muted py-3">Đang tải thông tin doanh nghiệp...</div>;
  }

  return (
    <div className="mt-4 p-4 bg-white rounded shadow-sm lh-lg">
      {harvest?.product?.description?.split(".").map((sentence, index) => {
        if (!sentence.trim()) return null;
        return (
          <p key={index} className="fs-6 mb-2">
            {sentence.includes(":") ? (
              <>
                <strong>{sentence.split(":")[0]}:</strong>
                {sentence.split(":")[1]}
              </>
            ) : (
              sentence
            )}
          </p>
        );
      })}

      <p className="fs-6 mt-2 mb-2"><strong>Sản phẩm thuộc loại:</strong> {harvest.product.category.name}</p>
      <p className="fs-6"><strong>Điều kiện bảo quản:</strong> {harvest.product.category.expiry}</p>
    </div>
  );
};

export default ProductDescription;