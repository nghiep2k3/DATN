import axios from "axios";
import { useState } from "react";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setImages(e.target.files); // Lấy nhiều ảnh
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock_quantity", stock);
    formData.append("brand_id", brandId);
    formData.append("category_id", categoryId);

    // Thêm nhiều ảnh
    for (let i = 0; i < images.length; i++) {
      formData.append("image[]", images[i]); 
      // ✅ Quan trọng: để là "image[]" để PHP đọc thành mảng
    }

    try {
      const res = await axios.post(
        "http://localhost:8081/datn/be/public/api/createproduct.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);
      alert("Thêm sản phẩm thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm sản phẩm");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Tên sản phẩm" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="SKU" onChange={(e) => setSku(e.target.value)} />
      <textarea placeholder="Mô tả" onChange={(e) => setDescription(e.target.value)} />
      <input type="number" placeholder="Giá" onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Số lượng" onChange={(e) => setStock(e.target.value)} />
      <input type="text" placeholder="Brand ID" onChange={(e) => setBrandId(e.target.value)} />
      <input type="text" placeholder="Category ID" onChange={(e) => setCategoryId(e.target.value)} />
      
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Thêm sản phẩm</button>
    </form>
  );
}
