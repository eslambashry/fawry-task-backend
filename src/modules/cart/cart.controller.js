// Get cart
app.get('/api/v1/cart', (req, res) => {
  initializeCart(req);
  const cart = calculateCartTotals(req.session.cart);
  
  // Add product details to cart items
  const cartWithProducts = {
    ...cart,
    items: cart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product !== null)
  };
  
  res.json({
    message: 'Cart retrieved successfully',
    data: cartWithProducts
  });
});

res.status(500).json({ message: 'Internal Server Error' });


// Add item to cart
app.post('/api/v1/cart/items', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  initializeCart(req);
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (product.quantity < quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }
  
  const existingItem = req.session.cart.items.find(item => item.productId === productId);
  
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    existingItem.quantity = newQuantity;
  } else {
    req.session.cart.items.push({ productId, quantity });
  }
  
  const updatedCart = calculateCartTotals(req.session.cart);
  
  // Add product details
  const cartWithProducts = {
    ...updatedCart,
    items: updatedCart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product !== null)
  };
  
  res.json({
    message: 'Item added to cart successfully',
    data: cartWithProducts
  });
});

// Update cart item
app.put('/api/v1/cart/items/:productId', (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  
  initializeCart(req);
  
  if (quantity <= 0) {
    req.session.cart.items = req.session.cart.items.filter(item => item.productId !== productId);
  } else {
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (quantity > product.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    const item = req.session.cart.items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  }
  
  const updatedCart = calculateCartTotals(req.session.cart);
  
  // Add product details
  const cartWithProducts = {
    ...updatedCart,
    items: updatedCart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product !== null)
  };
  
  res.json({
    message: 'Cart item updated successfully',
    data: cartWithProducts
  });
});

// Remove item from cart
app.delete('/api/v1/cart/items/:productId', (req, res) => {
  const { productId } = req.params;
  
  initializeCart(req);
  
  req.session.cart.items = req.session.cart.items.filter(item => item.productId !== productId);
  
  const updatedCart = calculateCartTotals(req.session.cart);
  
  // Add product details
  const cartWithProducts = {
    ...updatedCart,
    items: updatedCart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product !== null)
  };
  
  res.json({
    message: 'Item removed from cart successfully',
    data: cartWithProducts
  });
});

// Clear cart
app.delete('/api/v1/cart', (req, res) => {
  req.session.cart = {
    id: uuidv4(),
    items: [],
    total: 0,
    itemCount: 0
  };
  
  res.json({
    message: 'Cart cleared successfully',
    data: req.session.cart
  });
});

// Checkout
app.post('/api/v1/cart/checkout', (req, res) => {
  const { customerId } = req.body;
  
  initializeCart(req);
  
  if (req.session.cart.items.length === 0) {
    return res.json({
      message: 'Checkout failed',
      data: {
        success: false,
        message: 'Cart is empty'
      }
    });
  }
  
  const customer = customers.find(c => c.id === customerId);
  if (!customer) {
    return res.json({
      message: 'Checkout failed',
      data: {
        success: false,
        message: 'Customer not found'
      }
    });
  }
  
  // Calculate totals
  let subtotal = 0;
  let shipping = 0;
  
  for (const item of req.session.cart.items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.json({
        message: 'Checkout failed',
        data: {
          success: false,
          message: 'Product not found'
        }
      });
    }
    
    if (item.quantity > product.quantity) {
      return res.json({
        message: 'Checkout failed',
        data: {
          success: false,
          message: `${product.name} is out of stock`
        }
      });
    }
    
    subtotal += product.price * item.quantity;
    
    // Calculate shipping for items that require it
    if (product.requiresShipping && product.weight) {
      shipping += product.weight * item.quantity * 5; // $5 per kg
    }
  }
  
  const total = subtotal + shipping;
  
  // Check customer balance
  if (customer.balance < total) {
    return res.json({
      message: 'Checkout failed',
      data: {
        success: false,
        message: 'Insufficient balance'
      }
    });
  }
  
  // Process payment
  customer.balance -= total;
  
  // Update product quantities
  for (const item of req.session.cart.items) {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      product.quantity -= item.quantity;
    }
  }
  
  // Clear cart
  req.session.cart = {
    id: uuidv4(),
    items: [],
    total: 0,
    itemCount: 0
  };
  
  res.json({
    message: 'Checkout successful',
    data: {
      success: true,
      receipt: {
        subtotal,
        shipping,
        total,
        customerBalance: customer.balance
      }
    }
  });
});