import React from "react";
import Request from "./Request";

export default class extends React.Component {

    state = { orders: []    }

    fetchOrderHistory = () => {
        Request.get("/" + this.props.userInfo.userType + "/orders")
            .then(orders => {
                console.log(orders);
                this.setState({ orders });
            });
    }

   
    getItemView = (item, key) => {
        return <li className="list-group-item" key={key}>
            <div className="text-truncate">{item.name}</div>
            <div className="d-flex">
                <div><span className="badge bg-success">{item.count}</span> X Rs. {item.price}</div>
                <div className="ms-auto">Rs. {item.count * item.price}</div>
            </div>
        </li>
    }

    getTotal = (items) => {
        let total = 0;
        items.forEach(item => total += item.price * item.count);
        return total;
    }

    getUserStatusView = (order) => {
        return <div>
            <div className="fw-bold">Status</div>
            <div className={"ms-auto badge bg-" + (order.status == "cancelled" ? "danger" : "info")} >{order.status}</div>
        </div>;
    }

    setOrderStatus = (e) => {
        Request.put("/store/order/" + e.target.id, { status: e.target.value }).then(res => {
            this.fetchOrderHistory();
        });
    }

    getStoreStatusView = (order) => {
        return <div>
            <div className="fw-bold">Status</div>
            <div>
                <select id={order._id} value={order.status} onChange={this.setOrderStatus}>
                    <option value="created">Created</option>
                    <option value="accept">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <div>{"Ordered Date:"+order.createdat}</div>
        </div>;
    }

    getStatusView = (order) => {
        return this.props.userInfo.userType == "user" ? this.getUserStatusView(order) : this.getStoreStatusView(order);
    }

    getOrderCardView = (order, key) => {
        return <div className="card bg-light w-100" key={key}>
            <div>
                <div className="fw-bold">Order Number</div>
                <div className="text-truncate">{order._id}</div>
            </div>
            {this.getStatusView(order)}
            <div>
                <div className="fw-bold">Items</div>
                <ul className="list-group">
                    {order.items.map(this.getItemView)}
                    <li className="list-group-item d-flex fw-bold">
                        <div>Total</div>
                        <div className="ms-auto">Rs. {this.getTotal(order.items)}</div>
                    </li>
                </ul>
            </div>
        </div>; 
    }

    render() {
        return <div className="p-2">
            <span className="ms-1 fs-4">Orders History</span>
            <div className="items-container">
                {this.state.orders.map(this.getOrderCardView)}
            </div>
        </div>
    }

    componentDidMount() { 
        this.fetchOrderHistory();
    }
}