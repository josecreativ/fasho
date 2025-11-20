import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import Modal from 'react-modal';

interface ColorVariant {
  name: string;
  value: string;
  imageFiles?: File[];
  images?: any[];
}

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string; // Add this
  description: string;
  price: number; // Sale price
  originalPrice?: number; // Add this
  isOutOfStock: boolean;
  showOnHomePage: boolean;
  colors: ColorVariant[];
}

// Type for the new category structure
interface CategoryData {
  [key: string]: {
    sub: string[];
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const apiBase = (import.meta as any).env?.DEV ? 'http://localhost:3001' : '';
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    subCategory: '', // Add this
    description: '',
    price: '',
    originalPrice: '', // Add this
    isOutOfStock: false,
    showOnHomePage: true,
    colors: [{ name: '', value: '#000000', imageFiles: [] }] as ColorVariant[],
  });

  const mainCategories = ['WOMEN', 'CURVE', 'MEN', 'KIDS', 'BEAUTY'];
  
  // State for sub-category management
  const [categories, setCategories] = useState<CategoryData>({});
  const [newSubCategory, setNewSubCategory] = useState<{ [key: string]: string }>({});
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Shop by Brand Management
  const [brands, setBrands] = useState<any[]>([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandPreviews, setBrandPreviews] = useState<{ [label: string]: string }>({});

  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTarget, setEmailTarget] = useState<any>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories({ 'WOMEN': { sub: [] }, 'CURVE': { sub: [] }, 'MEN': { sub: [] }, 'KIDS': { sub: [] }, 'BEAUTY': { sub: [] } });
    }
  };

  const fetchBrands = async () => {
    setBrandLoading(true);
    try {
      const res = await axios.get(`${apiBase}/api/brands`);
      setBrands(res.data);
      // Set previews for already uploaded images
      const previews: { [label: string]: string } = {};
      res.data.forEach((b: any) => { if (b.image) previews[b.label] = `${apiBase}${b.image}`; });
      setBrandPreviews(previews);
    } catch (err) {
      // fallback: do nothing
    } finally {
      setBrandLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/users`);
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/orders`);
      const data = res.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrders([]);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`${apiBase}/api/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  useEffect(() => { fetchProducts(); fetchCategories(); fetchBrands(); fetchUsers(); fetchOrders(); }, []);

  const logout = () => {
    localStorage.removeItem('isAdminAuthed');
    navigate('/admin/login', { replace: true });
  };

  const resetForm = () => {
    setProductForm({
      name: '', category: '', subCategory: '', description: '', price: '', originalPrice: '', isOutOfStock: false,
      showOnHomePage: true,
      colors: [{ name: '', value: '#000000', imageFiles: [] }],
    });
    setEditProductId(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowProductForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      subCategory: product.subCategory, // Add this
      description: product.description,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      isOutOfStock: product.isOutOfStock,
      showOnHomePage: !!product.showOnHomePage,
      colors: product.colors.map(c => ({
        name: c.name,
        value: c.value,
        imageFiles: c.imageFiles || [],
        images: c.images || [],
      })),
    });
    setShowProductForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setProductForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      const newForm = { ...productForm, [name]: value };
      // If main category changes, reset sub-category
      if (name === 'category') {
        newForm.subCategory = '';
      }
      setProductForm(newForm);
    }
  };

  const handleColorChange = (index: number, field: keyof ColorVariant, value: string | File | null) => {
    const updatedColors = [...productForm.colors];
    updatedColors[index] = { ...updatedColors[index], [field]: value };
    setProductForm(prev => ({ ...prev, colors: updatedColors }));
  };

  const handleColorImageChange = (index: number, files: FileList | null) => {
    let imageFiles = files ? Array.from(files) : [];
    if (imageFiles.length > 6) {
      alert('You can upload a maximum of 6 images per color.');
      imageFiles = imageFiles.slice(0, 6);
    }
    const updatedColors = [...productForm.colors];
    updatedColors[index] = {
      ...updatedColors[index],
      imageFiles,
      // Remove any images with empty url if new files are selected
      images: files ? (updatedColors[index].images || []).filter(img => img.url) : updatedColors[index].images || []
    };
    setProductForm(prev => ({ ...prev, colors: updatedColors }));
  };
  const handleRemoveImageFile = (colorIdx: number, fileIdx: number) => {
    const updatedColors = [...productForm.colors];
    updatedColors[colorIdx].imageFiles = (updatedColors[colorIdx].imageFiles || []).filter((_, i) => i !== fileIdx);
    setProductForm(prev => ({ ...prev, colors: updatedColors }));
  };
  const handleRemoveExistingImage = (colorIdx: number, imgIdx: number) => {
    const updatedColors = [...productForm.colors];
    updatedColors[colorIdx].images = (updatedColors[colorIdx].images || []).filter((_, i) => i !== imgIdx);
    setProductForm(prev => ({ ...prev, colors: updatedColors }));
  };

  const addColorOption = () => {
    setProductForm(prev => ({ ...prev, colors: [...prev.colors, { name: '', value: '#000000', imageFiles: [] }] }));
  };

  const removeColorOption = (index: number) => {
    if (productForm.colors.length > 1) {
      setProductForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation: Each color must have at least one image (existing or new)
    const missingImageColor = productForm.colors.find(
      color => {
        const hasNew = color.imageFiles && color.imageFiles.length > 0;
        const hasExisting = color.images && color.images.length > 0;
        return !(hasNew || hasExisting);
      }
    );
    if (missingImageColor) {
      alert(`Each color must have at least one image. Please add an image for color: ${missingImageColor.name || '(unnamed color)'}`);
      return;
    }
    // Bulletproof duplicate check: name, category, price, and set of colors/images (order does not matter)
    const normalizeColor = (color) => ({
      name: color.name.trim().toLowerCase(),
      value: color.value,
      images: (color.images || []).map(img => img.url).sort().join(','),
    });
    const isDuplicate = products.some(p =>
      p.name.trim().toLowerCase() === productForm.name.trim().toLowerCase() &&
      p.category.trim().toLowerCase() === productForm.category.trim().toLowerCase() &&
      p.subCategory.trim().toLowerCase() === productForm.subCategory.trim().toLowerCase() &&
      Number(p.price) === Number(productForm.price) &&
      p.colors.length === productForm.colors.length &&
      p.colors.map(normalizeColor).sort((a, b) => a.name.localeCompare(b.name)).join('|') ===
      productForm.colors.map(normalizeColor).sort((a, b) => a.name.localeCompare(b.name)).join('|')
    );
    if (isDuplicate) {
      alert('A product with the same name, category, price, and images already exists. Please edit the existing product or use different details.');
      return;
    }
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('category', productForm.category);
    formData.append('subCategory', productForm.subCategory);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('originalPrice', productForm.originalPrice);
    formData.append('isOutOfStock', String(productForm.isOutOfStock));
    formData.append('showOnHomePage', String(productForm.showOnHomePage));
    // Prepare color data and images
    const colorsData = productForm.colors.map(({ name, value, images }) => ({ name, value, images: images || [] }));
    formData.append('colors', JSON.stringify(colorsData));
    productForm.colors.forEach((color, idx) => {
      (color.imageFiles || []).forEach((file, fileIdx) => {
        formData.append(`images_${idx}`, file);
      });
    });
    try {
      if (editProductId) {
        await axios.put(`http://localhost:3001/api/products/${editProductId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('http://localhost:3001/api/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowProductForm(false);
      fetchProducts(); // reload products to get updated images
    } catch (error) {
      alert('Error saving product. See console for details.');
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:3001/api/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleAddSubCategory = async (e: React.FormEvent, mainCategory: string) => {
    e.preventDefault();
    const name = newSubCategory[mainCategory];
    if (!name || !name.trim()) return;
    try {
      const res = await axios.post('http://localhost:3001/api/sub-category', { 
        mainCategory,
        name
      });
      setCategories(res.data);
      setNewSubCategory(prev => ({ ...prev, [mainCategory]: '' }));
    } catch (err) {
      alert('Error adding sub-category.');
    }
  };
  
  const handleDeleteSubCategory = async (mainCategory: string, name: string) => {
    if (!window.confirm(`Delete sub-category "${name}" from ${mainCategory}?`)) return;
    try {
      const res = await axios.delete('http://localhost:3001/api/sub-category', { 
        data: { mainCategory, name } 
      });
      setCategories(res.data);
    } catch (err) {
      alert('Error deleting sub-category.');
    }
  };

  const openEmailModal = (user: any) => {
    setEmailTarget(user);
    setEmailSubject('');
    setEmailBody('');
    setEmailStatus('');
    setShowEmailModal(true);
  };
  const closeEmailModal = () => setShowEmailModal(false);

  const sendEmail = async () => {
    setEmailStatus('Sending...');
    try {
      await axios.post('http://localhost:3001/api/send-email', {
        to: emailTarget.email,
        subject: emailSubject,
        body: emailBody,
      });
      setEmailStatus('Email sent!');
    } catch (err) {
      setEmailStatus('Failed to send email.');
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        
        {/* SUB-CATEGORY MANAGEMENT SECTION - ACCORDION */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Manage Sub-categories</h2>
          <div className="space-y-2">
            {mainCategories.map(mainCat => (
              <div key={mainCat}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === mainCat ? null : mainCat)}
                  className="w-full flex justify-between items-center text-left font-semibold p-3 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  <span>{mainCat}</span>
                  <span>{openAccordion === mainCat ? '−' : '+'}</span>
                </button>
                {openAccordion === mainCat && (
                  <div className="p-4 border border-t-0 rounded-b">
                    <form onSubmit={(e) => handleAddSubCategory(e, mainCat)} className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSubCategory[mainCat] || ''}
                        onChange={e => setNewSubCategory(prev => ({ ...prev, [mainCat]: e.target.value }))}
                        placeholder={`e.g., Dresses, Shirts`}
                        className="border px-3 py-2 rounded w-full"
                      />
                      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </form>
                    <ul className="divide-y">
                      {(categories[mainCat]?.sub || []).map((sub) => (
                        <li key={sub} className="flex items-center justify-between py-2">
                          <span>{sub}</span>
                          <button onClick={() => handleDeleteSubCategory(mainCat, sub)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </li>
                      ))}
                      {(categories[mainCat]?.sub?.length === 0) && <li className="text-gray-500 py-2">No sub-categories yet.</li>}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* END SUB-CATEGORY MANAGEMENT SECTION */}

        {/* ORDERS SECTION */}
        <section className="bg-white rounded-lg shadow p-6 my-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Orders</h2>
            <button onClick={fetchOrders} className="px-3 py-1 bg-gray-200 rounded">Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border min-w-[700px]">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Payment</th>
                  <th className="py-2 px-4">Subtotal</th>
                  <th className="py-2 px-4">Items & Delivery</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(orders) ? orders : []).map((o:any) => (
                  <tr key={o.id} className="border-b align-top">
                    <td className="py-2 px-4 text-sm">{o.id}</td>
                    <td className="py-2 px-4 text-sm">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</td>
                    <td className="py-2 px-4 text-sm">{o.email}</td>
                    <td className="py-2 px-4 text-sm uppercase">{o.paymentMethod}</td>
                    <td className="py-2 px-4 text-sm">${o.subtotal}</td>
                    <td className="py-2 px-4 text-sm">
                      <ul className="list-disc ml-4">
                        {(o.items || []).map((it:any, idx:number) => (
                          <li key={idx}>{it.name} x {it.quantity} - ${it.price}</li>
                        ))}
                      </ul>
                       <div className="mt-2 text-xs text-gray-600">
                         <div><span className="font-semibold">Ship To:</span> {o.delivery?.firstName} {o.delivery?.lastName}, {o.delivery?.address}, {o.delivery?.city}, {o.delivery?.state}, {o.delivery?.country} {o.delivery?.zip}</div>
                         <div><span className="font-semibold">Phone:</span> {o.delivery?.phone}</div>
                       </div>
                     </td>
                     <td className="py-2 px-4 text-sm">
                       <button onClick={() => deleteOrder(o.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">Delete</button>
                     </td>
                   </tr>
                ))}
                {(Array.isArray(orders) ? orders.length : 0) === 0 && (
                  <tr>
                    <td colSpan={7} className="py-4 px-4 text-center text-gray-500">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {/* END ORDERS SECTION */}

        {/* Settings Section */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Settings & Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/settings/paystack')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">₦</span>
              </div>
              <div>
                <h3 className="font-medium">Paystack</h3>
                <p className="text-sm text-gray-600">Payment gateway settings</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/admin/settings/flutterwave')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold">FW</span>
              </div>
              <div>
                <h3 className="font-medium">Flutterwave</h3>
                <p className="text-sm text-gray-600">Payment gateway settings</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/admin/settings/livechat')}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">💬</span>
              </div>
              <div>
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-sm text-gray-600">Customer support chat</p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <button onClick={openAddForm} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button onClick={logout} className="ml-3 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Logout</button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center">
                    {product.colors[0]?.images && product.colors[0].images[0] && product.colors[0].images[0].url ? (
                      <img src={`http://localhost:3001${product.colors[0].images[0].url}`} alt={product.name} className="w-10 h-10 rounded-md mr-4 object-cover" />
                    ) : (
                      <div style={{width: 40, height: 40, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 10, borderRadius: 8, marginRight: 16}}>
                        No Image
                      </div>
                    )}
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {product.originalPrice && product.originalPrice > product.price ? (
                      <>
                        <span className="line-through text-gray-400 mr-2">${product.originalPrice}</span>
                        <span className="text-red-600 font-bold">${product.price}</span>
                      </>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.isOutOfStock ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => openEditForm(product)} className="text-indigo-600 hover:text-indigo-900"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{editProductId ? 'Edit Product' : 'Add New Product'}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input type="text" name="name" value={productForm.name} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select name="category" value={productForm.category} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select Category</option>
                        {mainCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">Sub-category</label>
                      <select
                        id="subCategory"
                        name="subCategory"
                        value={productForm.subCategory}
                        onChange={handleFormChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md mt-0"
                        disabled={!productForm.category}
                      >
                        <option value="">Select Sub-category</option>
                        {productForm.category && (categories[productForm.category.toUpperCase()]?.sub || []).map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea name="description" value={productForm.description} onChange={handleFormChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Sale Price</label>
                      <input
                        type="number"
                        name="price"
                        value={productForm.price}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Sale Price"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Original Price (Slash Price)</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={productForm.originalPrice}
                        onChange={handleFormChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Original Price"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color Variants</label>
                      {productForm.colors.map((color, idx) => (
                        <div key={idx} className="mb-4 border p-3 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Color Name"
                              value={color.name}
                              onChange={e => handleColorChange(idx, 'name', e.target.value)}
                              className="border rounded px-2 py-1 text-sm"
                            />
                            <input
                              type="color"
                              value={color.value}
                              onChange={e => handleColorChange(idx, 'value', e.target.value)}
                              className="w-8 h-8 border rounded"
                            />
                            <button type="button" onClick={() => removeColorOption(idx)} className="ml-2 text-red-500"><Trash2 size={16} /></button>
                          </div>
                          <div className="mb-2">
                            <label className="text-xs font-medium mb-1">Images</label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={e => handleColorImageChange(idx, e.target.files)}
                            />
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {/* Previews for new files */}
                              {color.imageFiles && color.imageFiles.map((file, fileIdx) => (
                                <div key={fileIdx} className="relative">
                                  <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded" />
                                  <button type="button" onClick={() => handleRemoveImageFile(idx, fileIdx)} className="absolute top-0 right-0 bg-white rounded-full p-1 text-xs text-red-500">&times;</button>
                                </div>
                              ))}
                              {/* Previews for existing images */}
                              {color.images && color.images.map((img, imgIdx) => img.url && (
                                <div key={imgIdx} className="relative">
                                  <img src={`http://localhost:3001${img.url}`} alt="existing" className="w-16 h-16 object-cover rounded" />
                                  <button type="button" onClick={() => handleRemoveExistingImage(idx, imgIdx)} className="absolute top-0 right-0 bg-white rounded-full p-1 text-xs text-red-500">&times;</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addColorOption} className="text-purple-600 text-sm mt-1">+ Add Color</button>
                    </div>
                    <div className="flex items-center">
                      <input id="isOutOfStock" name="isOutOfStock" type="checkbox" checked={productForm.isOutOfStock} onChange={handleFormChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded"/>
                      <label htmlFor="isOutOfStock" className="ml-2 block text-sm text-gray-900">Mark as Out of Stock</label>
                    </div>
                    {/* Add Show on Home Page Checkbox */}
                    <div className="flex items-center">
                      <input id="showOnHomePage" name="showOnHomePage" type="checkbox" checked={productForm.showOnHomePage} onChange={handleFormChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded"/>
                      <label htmlFor="showOnHomePage" className="ml-2 block text-sm text-gray-900">Show on Home Page</label>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 border-t">
                    <button type="button" onClick={() => setShowProductForm(false)} className="px-4 py-2 w-full sm:w-auto">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md w-full sm:w-auto">{editProductId ? 'Update' : 'Save'}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        <section className="bg-white rounded-lg shadow p-6 my-8">
          <h2 className="text-2xl font-bold mb-4">Registered Users</h2>
          <table className="w-full text-left border">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">Username</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Registered</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.createdAt ? new Date(user.createdAt).toLocaleString() : ''}</td>
                  <td className="py-2 px-4">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded mr-2" onClick={() => openEmailModal(user)}>Send Email</button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal isOpen={showEmailModal} onRequestClose={closeEmailModal} ariaHideApp={false} className="bg-white p-8 rounded shadow max-w-lg mx-auto mt-24">
            <h3 className="text-xl font-bold mb-4">Send Email to {emailTarget?.email}</h3>
            <input type="text" className="w-full border rounded px-3 py-2 mb-3" placeholder="Subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2 mb-3" placeholder="Message" rows={5} value={emailBody} onChange={e => setEmailBody(e.target.value)} />
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={sendEmail}>Send</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={closeEmailModal}>Cancel</button>
            </div>
            {emailStatus && <div className="mt-2 text-sm">{emailStatus}</div>}
          </Modal>
        </section>
      </div>
    </div>
  );
};

function BrandUploadForm({ brand, preview, onFileChange, onSave }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState(brand.link || '');
  return (
    <form
      onSubmit={e => { e.preventDefault(); onSave(brand.label, file, link); }}
      className="bg-gray-50 rounded p-4 flex flex-col gap-3 shadow"
    >
      <div className="font-bold text-lg mb-2">{brand.label}</div>
      {preview && <img src={preview} alt={brand.label} className="w-full h-40 object-cover rounded mb-2" />}
      <input
        type="file"
        accept="image/*"
        onChange={e => { const f = e.target.files?.[0] || null; setFile(f); onFileChange(brand.label, f); }}
        className="mb-2"
      />
      <input
        type="text"
        value={link}
        onChange={e => setLink(e.target.value)}
        placeholder="Link (e.g. /women)"
        className="border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-1 mt-2"
      >
        <Upload className="w-4 h-4" /> Save
      </button>
    </form>
  );
}

export default Admin;
