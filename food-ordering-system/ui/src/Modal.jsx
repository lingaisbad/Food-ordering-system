import React from "react";

export default class extends React.Component {
    render() {
        const {modalHeader, modalBody} = this.props;
        return <div>
            <div className="fo-modal-bg">
                <div className="fg-modal-content card">
                    <div className="fg-modal-header">{modalHeader}</div>
                    <div className="fg-modal-body">{modalBody}</div>
                </div>
            </div>
        </div>
    }
}