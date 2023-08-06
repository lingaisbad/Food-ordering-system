import React from "react"
import Request from "./Request";
import { toast } from "react-toastify";
import "./style/userhome.css";
import Itemcard from "./Itemcard.jsx";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import OrderHistory from "./OrderHistory.jsx";

export default class extends React.Component {
    state = {
        search: "",
        storeName: "",
        items: [],
        storeId: "",
        cart: {},
        counter: [],
        categories: [],
        filteredItems: [],
        selectedOption: "all"
    }

    fetchStoreItems = () => {
        Request.get("/user/store")
            .then((res) => {
                this.setState({
                    storeId: res._id,
                    storeName: res.name,
                    categories: res.categories,
                    filteredItems: res.items,
                    items: res.items,
                }, this.fetchCartItems);
            })
            .catch(err => {
                toast.error(err.message);
            })
    }

    fetchCartItems = () => {
        Request.get("/user/cart")
            .then((res) => {
                const cart = res || {};
                const currentStoreCart = cart[this.state.storeId] || {};
                console.log("currentStoreCart:", currentStoreCart);
                for (let key in currentStoreCart) {
                    // const matchingItem = this.state.items.filter(item => item._id.indexOf(key) == 0 && item.Available);
                    if (this.state.items.filter(item => item._id.indexOf(key) == 0 && item.Available == "true" && item.version == currentStoreCart[key].version).length == 0) {
                        toast.success(currentStoreCart[key].name + " is no longer available. So removed from your cart.")
                        delete currentStoreCart[key];
                    }
                }
                cart[this.state.storeId] = currentStoreCart;
                Request.post("/user/cart", cart);
                this.setState({ cart });
            })
            .catch(err => {
                toast.error(err.message);
            })
    }

    handleLogout = () => {
        Request.delete("/logout").then((res) => {
            location.reload();
        }).catch((err) => {
            toast.error(err.message);
        })
    }

    getStoreItemsView = () => {
        return this.state.items.filter(item => item.Available == "true").filter(item => item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) != -1).map((item, key) => {
            return <Itemcard key={key} item={item} cart={this.state.cart} storeId={this.state.storeId} refresh={() => this.forceUpdate()} />
        })
    }

    getCartItemsView = () => {
        const currentStoreCart = this.state.cart[this.state.storeId] ? this.state.cart[this.state.storeId] : {};
        return Object.values(currentStoreCart).map((item, key) => {
            return <Itemcard key={key} item={item} cart={this.state.cart} storeId={this.state.storeId} refresh={() => this.forceUpdate()} />
        })
    }

    getCategorySelectView = () => {
        return <select className="select-category">
            {this.state.categories.map((category, key) => (
                <option value={category} key={key}>{category}</option>
            ))
            }
        </select>
    }

    setSearchValue = (e) => {
        this.setState({ search: e.target.value });
    }

    getNavbarView = () => {
        return <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
                <span className="navbar-brand">{this.state.storeName}</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={"nav-link " + (this.props.location.pathName == "/user" ? "active" : "")} to="/user/">Items</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link " + (this.props.location.pathName == "/user/cart" ? "active" : "")} to="/user/cart">Cart</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link " + (this.props.location.pathName == "/user/orders" ? "active" : "")} to="/user/orders">Your Orders</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link " + (this.props.location.pathName == "/user/favourites" ? "active" : "")} to="/user/favourites">Favourite Items</Link>
                        </li>
                    </ul>
                    <div className="d-flex">
                        <button className="btn btn-primary" onClick={this.props.userInfo ? this.handleLogout : this.handleLogin}>{this.props.userInfo ? "Signout" : "Signin"}</button>
                    </div>
                </div>
            </div>
        </nav>
    }

    getStoreView = () => {
        return <div className="p-2">
            <div>
                <input type="search" id="search-btn" placeholder="Search.." className="form-control w-100 mb-2" value={this.state.search} onChange={this.setSearchValue} />
            </div>
            <div className="items-container">
                {this.getStoreItemsView()}
            </div>
            {this.isCartNotEmpty() && <div className="d-flex p-2">
                <button className="btn btn-primary mx-auto" onClick={() => this.props.history.push("/user/cart")}>Checkout</button>
                <span>Total: {this.getTotal()}</span>
            </div>}
        </div>
    }

    getTotal = () => {
        const currentStoreCart = this.state.cart[this.state.storeId] ? this.state.cart[this.state.storeId] : {};
        let total = 0;
        Object.values(currentStoreCart).forEach(item => total += item.price * item.count);
        return total;
    }

    placeOrder = () => {
        const data = {
            items: Object.values(this.state.cart[this.state.storeId]),
            userId: this.props.userInfo.id,
            storeId: this.state.storeId,
        };
        Request.post("/user/order", data)
            .then(() => {
                this.props.history.push("/user/orders");
                this.setState({ cart: {} });
            }).catch(err => toast.error(err.message));
    }

    isCartNotEmpty = () => {
        const currentStoreCart = this.state.cart[this.state.storeId] ? this.state.cart[this.state.storeId] : {};
        return Object.keys(currentStoreCart).length > 0;
    }

    getCartView = () => {
        return <div className="cart-container p-2">
            <span className="ms-1 fs-4">Your Cart</span>
            <div className="items-container">
                {this.getCartItemsView()}
            </div>
            {this.isCartNotEmpty() ? <div>
                Total: {this.getTotal()}
            </div> : <div className="alert alert-warning">Your cart is empty</div>}
            {this.isCartNotEmpty() && <div className="d-flex">
                <button className="mx-auto mt-1 btn btn-primary" onClick={this.placeOrder}>Place order</button>
            </div>}
        </div>
    }

    handleLogin = () => {
        this.props.history.replace("/user-signin");
    }

    render() {
        return <div className="product-manage">
            {this.getNavbarView()}
            <Switch>
                <Route path={"/user/cart"} component={this.getCartView} />
                <Route path={"/user/orders"} render={(props) => <OrderHistory userInfo={this.props.userInfo} {...props} />} />
                <Route path={"/user/"} component={this.getStoreView} />
            </Switch>
        </div>
    }

    componentDidMount() {
        this.fetchStoreItems();
    }
}

