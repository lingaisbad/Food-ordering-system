import React from "react";
import { toast } from "react-toastify";
import Request from "./Request";

function getCount(props) {
    if (props.storeId in props.cart) {
        if (props.item._id in props.cart[props.storeId]) {
            return props.cart[props.storeId][props.item._id].count;
        }
    }
    return 0;
}

export default class extends React.Component {
    state = {
        count: getCount(this.props),
    };

    updateCart = (addValue) => {
        const currentStoreCart = this.props.cart[this.props.storeId] || {};
        if (this.state.count + addValue == 0) {
            if (this.props.item._id in currentStoreCart)
                delete currentStoreCart[this.props.item._id];
        } else {
            currentStoreCart[this.props.item._id] = { ...this.props.item, count: this.state.count + addValue };
        }
        this.props.cart[this.props.storeId] = currentStoreCart;
        Request.post("/user/cart", this.props.cart).then(() => {
            this.forceUpdate();
            this.props.refresh();
        }).catch((err) => {
            toast.error(err.message)
        })
    }

    decrement = () => {
        if (this.state.count == 0) return;
        this.updateCart(-1)
    };

    increment = () => {
        this.updateCart(1)
    }

    getFinalPriceView = () => {
        return this.state.count > 0 && <div className="ms-auto">
            Rs.{this.state.count * this.props.item.price}
        </div>
    }

    render() {
        const item = this.props.item;
        return <div className="card w-100">
            <div className="d-flex">
                <div className="card-body">
                    <span className="card-title fw-bold">{item.name}</span>
                    <p className="card-subtitle mb-2 text-muted">{item.category}</p>
                    <p className="card-text">Rs.{item.price}</p>
                </div>
                <div className="ms-5 d-flex flex-column">
                    <div className="btn-options">
                        {this.state.count > 0 && <button type="button" className={"btn btn-outline-danger"} onClick={this.decrement} value={item._id}>-</button>}
                        <button type="text" className="btn btn-info" onClick={() => this.state.count == 0 && this.increment()}>{this.state.count == 0 ? "ADD" : this.state.count}</button>
                        {this.state.count > 0 && <button type="button" className="btn btn-outline-success" onClick={this.increment} value={item._id}>+</button>}
                    </div>
                    {this.getFinalPriceView()}
                </div>
            </div>
        </div>
    }

    static getDerivedStateFromProps(props, state) {
        return { count: getCount(props) }
    }
}