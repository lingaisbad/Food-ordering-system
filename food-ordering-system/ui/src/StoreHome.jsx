import React from "react"
import Request from "./Request";
import { toast } from "react-toastify";
import "./style/storemanage.css";
import { Link, Route, Switch } from "react-router-dom";
import OrderHistory from "./OrderHistory.jsx";

export default class extends React.Component {

    state = {
        storeName: "",
        categories: [],
        items: [],
        currentItem: {
            name: "",
            price: "",
            quantity: "",
            category: "",
            _id: "",
        },
        new_category:"",
        showModal: false
    }

    unsetCurrentItem = (e) => {
        e.preventDefault()
        this.setState({
            currentItem: { name: "", price: "", quantity: "", category: "", _id: "" },
        });
    }

    setCurrentItem = (item) => {
        this.setState({
            currentItem: item,
        });
    }

    setItemId = (e) => {
        e.preventDefault();
        this.setState({ currentItem: { ...this.state.currentItem, _id: e.target.value } })
    };

    getStoreInfo = () => {
        Request.get("/store/info")
            .then((res) => {
                this.setState({ storeName: res.name, categories: res.categories, items: res.items });
            })
            .catch(err => {
                toast.error(err.message);
            })
    }

    getItem = (e) => {
        e.preventDefault();
        Request.get("/store/item/" + e.target.value)
            .then((res) => {
                this.setState({ currentItem: { ...this.state.currentItem, _id: res._id, name: res.name, quantity: res.quantity, price: res.price, category: res.category } });
                this.setState({ updateStatus: true })
            }).catch(err => {
                toast.error(err.message);
            })

    }

    setSingleAttribute = (e) => {
        const { name, value } = e.target;
        this.setState({ currentItem: { ...this.state.currentItem, [name]: value } });
    }

    setNewCategory = (e) => {
        this.setState({new_category:e.target.value})
    }

    handleAddCategory = (e) => {
        e.preventDefault();
        Request.post("/store/category",{
            "category":this.state.new_category,
        }).then(()=>{
            toast.success('Category Added Successfully');
            this.getStoreInfo();
        })
    }

    handleAddItem = (e) => {
        e.preventDefault();
        Request.post("/store/item", {
            "name": this.state.currentItem.name,
            "price": this.state.currentItem.price,
            "quantity": this.state.currentItem.quantity,
            "category": this.state.currentItem.category,
            "Available": this.state.currentItem.Available,
        }).then(() => {
            toast.success('Item Added Successfully');
            this.getStoreInfo();
        }).catch(err => {
            toast.error(err.message);
        })
    }

    handleRemoveItem = () => {
        console.log("this.state.currentItem:", this.state.currentItem)
        Request.delete("/store/item/" + this.state.currentItem._id)
            .then(() => {
                toast.success("Item Removed Successfully");
                this.getStoreInfo();
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message);
            })
    }
    handleUpdateItem = (e) => {
        e.preventDefault();
        Request.put("/store/item/" + this.state.currentItem._id, {
            "name": this.state.currentItem.name,
            "price": this.state.currentItem.price,
            "quantity": this.state.currentItem.quantity,
            "category": this.state.currentItem.category,
            "Available": this.state.currentItem.Available,
            "status": "active"
        }).then((resp) => {
            toast.success(resp.message);
            this.getStoreInfo();
        }).catch((err) => {
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

    handleLogin = () => {
        this.props.history.replace("/store-signin");
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
                            <Link className={"nav-link " + (this.props.location.pathName == "/store" ? "active" : "")} to="/store/">Items</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link " + (this.props.location.pathName == "/store/orders" ? "active" : "")} to="/store/orders">Your Orders</Link>
                        </li>
                    </ul>
                    <div className="d-flex">
                        <button className="btn btn-primary" onClick={this.props.userInfo ? this.handleLogout : this.handleLogin}>{this.props.userInfo ? "Signout" : "Signin"}</button>
                    </div>
                </div>
            </div>
        </nav>
    }
    getAddCategoryModal() {
        return <div className="modal fade" id="categoryModal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">ADD NEW CATEGORY:</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="row row-cols-1 g-4" onSubmit={this.handleAddCategory}>
                            <div className="col">
                                <label htmlFor="new_category" className="form-label">Enter category:</label>
                                <input type="text" name="new_category" value={this.state.new_category} onChange={this.setNewCategory} className="form-control" id="new_category" required />
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }

    getRemoveItemModal() {
        return <div className="modal fade" id="removeConfirm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="exampleModalLabel">Delete Item Confirmation</h4>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <h4>Are you sure?</h4>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">No</button>
                        <button type="button" className="btn btn-danger" onClick={this.handleRemoveItem} data-bs-dismiss="modal">yes</button>
                    </div>
                </div>
            </div>
        </div>
    }
    getItems() {
        return this.state.items.map((item, key) => {
            return <div className="card" key={key}>
                <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{item.category}</h6>
                    <p className="card-text">Rs.{item.price}</p>
                </div>
                <div className="btn-options">
                    <button type="button" className="btn btn-danger" value={item._id} onClick={this.setItemId} data-bs-toggle="modal" data-bs-target="#removeConfirm">Remove</button>
                    <button type="button" className="btn btn-secondary" value={item._id} onClick={() => this.setCurrentItem(item)} data-bs-toggle="modal" data-bs-target="#itemModal">Update</button>
                </div>
                {this.getRemoveItemModal()}
            </div>
        })
    }

    getAddItemModal() {
        return <div className="modal fade" id="itemModal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Item Details:</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="row row-cols-1 g-4" onSubmit={this.state.currentItem._id != "" ? this.handleUpdateItem : this.handleAddItem}>
                            <div className="col">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" name="name" value={this.state.currentItem.name} onChange={this.setSingleAttribute} className="form-control" id="name" required />
                            </div>
                            <div className="col">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input type="number" name="price" value={this.state.currentItem.price} onChange={this.setSingleAttribute} className="form-control" id="price" required />
                            </div>
                            <div className="col">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input type="number" name="quantity" value={this.state.currentItem.quantity} onChange={this.setSingleAttribute} className="form-control" id="quantity" required />
                            </div>
                            <div className="col">
                                <label htmlFor="category" className="form-label">Select Category</label>
                                <select className="form-select" name="category" value={this.state.currentItem.category} onChange={this.setSingleAttribute} >
                                    <option>Select</option>
                                    {this.state.categories.map((category, key) => (
                                        <option value={category} key={key}>{category}</option>
                                    ))
                                    }
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="category" className="form-label">Available Status</label>
                                <select className="form-select" name="Available" value={this.state.currentItem.Available} onChange={this.setSingleAttribute} >
                                    <option>Select</option>
                                    <option value="true">Available</option>
                                    <option value="false">Not Available</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }

    getStoreView = () =>{
        return <div>
            {this.getAddItemModal()}
            {this.getAddCategoryModal()}
            <div className="add-btn">
                <button type="button" className="btn btn-primary me-1" data-bs-toggle="modal" data-bs-target="#categoryModal">
                    Add New Category
                </button>
        
                <button type="button" className="btn btn-primary" onClick={this.unsetCurrentItem} data-bs-toggle="modal" data-bs-target="#itemModal">
                    Add Item
                </button>
            </div>
            <div className="items-container">
                {this.getItems()}
            </div>
        </div>
    }

    render() {
        return <div className="product-manage">
            {this.getNavbarView()}
            <Switch>
                <Route path={"/store/orders"} render={(props) => <OrderHistory userInfo={this.props.userInfo} {...props} />} />
                <Route path={"/store/"} component={this.getStoreView} />
            </Switch>
        </div>
    }

    componentDidMount() {
        this.getStoreInfo();
    }
}
