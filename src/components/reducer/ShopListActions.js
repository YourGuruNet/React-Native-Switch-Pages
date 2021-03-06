import firestore from '@react-native-firebase/firestore';

export const activitiesConst = {
  SET_LOADING: 'SET_LOADING',
  GET_SHOPS_LIST: 'GET_SHOPS_LIST',
  GET_SELECTED_SHOP: 'GET_SELECTED_SHOP',
  FILTER_BY_COUNTRY: 'FILTER_BY_COUNTRY',
  ADD_TO_CART: 'ADD_TO_CART',
  CLEAR_CART: 'CLEAR_CART',
  INCREASE: 'INCREASE',
  INCREASE_QUANTITY: 'INCREASE_QUANTITY',
  SHOW_SELECTED_SHOP_IN_MAP: 'SHOW_SELECTED_SHOP_IN_MAP',
};

export const setLoading = () => {
  return {type: activitiesConst.SET_LOADING};
};

export const getShopsList = () => {
  return async function (dispatch) {
    dispatch(setLoading());
    const data = await firestore().collection('shopData').get();
    dispatch({
      type: activitiesConst.GET_SHOPS_LIST,
      payload: data._docs,
    });
  };
};

export const getSelectedShop = (item, navigation) => {
  return async function (dispatch) {
    dispatch(setLoading());
    dispatch({
      type: activitiesConst.GET_SELECTED_SHOP,
      payload: item,
    });
    navigation.navigate('ShopCardScreen');
  };
};

//Update filters by country
export const updateFilter = (country, selectedShopProducts) => {
  let filteredProducts;
  if (country === 'All') {
    filteredProducts = selectedShopProducts._data.products;
  } else {
    filteredProducts = selectedShopProducts._data.products.filter(function (
      item,
    ) {
      return item.productCountry == country;
    });
  }
  return async function (dispatch) {
    dispatch({
      type: activitiesConst.FILTER_BY_COUNTRY,
      payload: filteredProducts,
    });
  };
};

//Add to cart
export const addToCart = (item, selectedShop, cart) => {
  const product = [...cart].find(
    (product) =>
      product.productName === item.productName &&
      product.selectedShop === selectedShop._data.title,
  );
  if (product) {
    return async function (dispatch) {
      dispatch(increaseAmount(product, selectedShop));
    };
  } else {
    return async function (dispatch) {
      dispatch({
        type: activitiesConst.ADD_TO_CART,
        payload: item,
        shopName: selectedShop._data.title,
      });
    };
  }
};

//Remove all items from cart
export const removeAllItems = () => {
  return async function (dispatch) {
    dispatch({type: activitiesConst.CLEAR_CART});
  };
};

// Increase amount
export const increaseAmount = (product, selectedShop) => {
  return async function (dispatch) {
    dispatch({
      type: activitiesConst.INCREASE,
      productName: product.productName,
      selectedShop: selectedShop._data.title,
    });
  };
};

// Show shop in map

export const showSelectedShopInMap = (item) => {
  return async function (dispatch) {
    dispatch({
      type: activitiesConst.SHOW_SELECTED_SHOP_IN_MAP,
      payload: item._data,
    });
  };
};
